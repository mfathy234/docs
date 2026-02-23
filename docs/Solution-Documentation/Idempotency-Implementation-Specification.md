# Idempotency Implementation Specification

## Overview

HTTP request idempotency at the API layer prevents duplicate processing of mutating operations (POST, PUT, PATCH). Clients send a unique `X-Idempotency-Key` header; the system caches responses and returns cached results for duplicate keys.

**Retention**: 24 hours
**Storage**: Redis cache
**Scope**: POST, PUT, PATCH requests only
**Optional**: Header is not required

---

## Architecture

### Components

**IdempotencyMiddleware**
- Intercepts HTTP requests
- Extracts `X-Idempotency-Key` header
- Checks cache for existing response
- Acquires distributed lock for new requests
- Captures and stores response
- Releases lock after completion

**IdempotencyService**
- Manages Redis cache operations
- Implements distributed locking via Redis SETNX
- Stores: StatusCode, Headers, ResponseBody
- TTL: 24 hours

**Storage Architecture**
```
Client Request
     ↓
┌────────────────────────────────┐
│   Redis Cache (In-Memory)      │
│   - Response Time: 1-2ms       │
│   - TTL: 24 hours              │
│   - Key: idempotency:{key}     │
└────────────────────────────────┘
```

### Distributed Locking

**Mechanism**: Redis SETNX (Set If Not Exists)
**Lock Key Pattern**: `idempotency-lock:{idempotencyKey}`
**Lock Timeout**: 5 minutes
**Purpose**: Prevent concurrent processing across multiple API instances

---

## Request Flow Diagrams

### Scenario 1: First Request (Cache Miss)

::: mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Service
    participant Redis
    participant Controller

    Client->>Middleware: POST /api/resource (X-Idempotency-Key: abc-123)
    Middleware->>Service: GetCachedResponseAsync
    Service->>Redis: GET idempotency:abc-123
    Redis-->>Service: null
    Service-->>Middleware: null
    Middleware->>Service: TryAcquireLockAsync
    Service->>Redis: SETNX lock (TTL 5min)
    Redis-->>Service: true
    Service-->>Middleware: true
    Middleware->>Controller: Execute request
    Controller-->>Middleware: 200 OK
    Middleware->>Service: StoreResponseAsync
    Service->>Redis: SET response (TTL 24h)
    Redis-->>Service: OK
    Middleware->>Service: ReleaseLockAsync
    Service->>Redis: DEL lock
    Middleware-->>Client: 200 OK
:::

**Result**: Request processed normally, response cached for 24 hours.

---

### Scenario 2: Duplicate Request (Cache Hit)

::: mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Service
    participant Redis
    participant Controller

    Client->>Middleware: POST /api/resource (X-Idempotency-Key: abc-123)
    Middleware->>Service: GetCachedResponseAsync
    Service->>Redis: GET idempotency:abc-123
    Redis-->>Service: CachedResponse
    Service-->>Middleware: IdempotencyResult
    Middleware-->>Client: 200 OK (X-Idempotency-Replay: true)
    Note over Controller: NEVER executed
:::

**Result**: Cached response returned in ~1-2ms, controller logic bypassed.

---

### Scenario 3: Concurrent Requests (Lock Conflict)

::: mermaid
sequenceDiagram
    participant Client1
    participant Client2
    participant MW1 as Middleware1
    participant MW2 as Middleware2
    participant Redis

    par Concurrent
        Client1->>MW1: POST (key: abc-123)
        Client2->>MW2: POST (key: abc-123)
    end

    par Check
        MW1->>Redis: GET idempotency:abc-123
        MW2->>Redis: GET idempotency:abc-123
        Redis-->>MW1: null
        Redis-->>MW2: null
    end

    MW1->>Redis: SETNX lock
    Redis-->>MW1: true
    MW2->>Redis: SETNX lock
    Redis-->>MW2: false
    MW2-->>Client2: 409 Conflict
    MW1->>MW1: Process and cache
    MW1-->>Client1: 200 OK
    Note over Client2: Retry hits cache
:::

**Result**: One instance processes, other returns 409 Conflict. Client retries receive cached response.

---

### Scenario 4: Request Without Idempotency Key

::: mermaid
sequenceDiagram
    participant Client
    participant Middleware
    participant Controller

    Client->>Middleware: POST /api/resource (no key)
    Note over Middleware: Skip idempotency logic
    Middleware->>Controller: Execute request
    Controller-->>Middleware: 200 OK
    Middleware-->>Client: 200 OK
    Note over Client: No duplicate protection
:::

**Result**: Normal processing, no idempotency protection.

---

### Scenario 5: Cache Expiration

::: mermaid
sequenceDiagram
    participant Client
    participant System
    participant Redis

    Note over Redis: Request at T=0
    Client->>System: POST duplicate (T=23h)
    System->>Redis: GET idempotency:abc-123
    Redis-->>System: CachedResponse
    System-->>Client: 200 OK (cached)
    Note over Redis: Expires at T=24h
    Client->>System: POST duplicate (T=25h)
    System->>Redis: GET idempotency:abc-123
    Redis-->>System: null
    System->>System: Process as new
    System-->>Client: 200 OK (new)
:::

**Result**: After 24 hours, duplicate requests are processed as new requests.

---

### Frontend Request Lifecycle

::: mermaid
flowchart TD
    A[User Action] --> B[Generate UUID]
    B --> C[Store key locally]
    C --> D[Send with X-Idempotency-Key]
    D --> E[Receive response]
    E --> F{X-Idempotency-Replay?}
    F -->|Yes| G[Already completed]
    F -->|No| H[New operation]
    G --> I[Discard key]
    H --> I
:::

---

## HTTP Specification

### Request Header

```
X-Idempotency-Key: <uuid>
```

**Format**: UUID v4 recommended
**Example**: `550e8400-e29b-41d4-a716-446655440000`
**Required**: No (optional)
**Scope**: POST, PUT, PATCH only

### Response Header

```
X-Idempotency-Replay: true
```

**Presence**: Response served from cache
**Meaning**: Duplicate detected, controller not executed

### HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| `200 OK` | Success (original or cached) | Continue |
| `200 OK` + `X-Idempotency-Replay: true` | Success (cached) | Already processed |
| `409 Conflict` | Lock acquisition failed | Retry with exponential backoff |
| `4xx/5xx` (cached) | Original request failed | Same error returned |

---

## Stored Data

Each idempotent request stores:

- **IdempotencyKey**: Client-provided unique identifier
- **TenantId**: Multi-tenant isolation
- **UserId**: Audit trail
- **StatusCode**: HTTP response status
- **Headers**: Response headers (dictionary)
- **ResponseBody**: Complete response (byte[])
- **Timestamps**: RequestedAt, CompletedAt
- **ProcessingDuration**: Original execution time
- **IsSuccess**: Status code 2xx flag
- **ExpiresAt**: TTL timestamp (24 hours)

**Cache Keys**:
- Response: `idempotency:{idempotencyKey}`
- Lock: `idempotency-lock:{idempotencyKey}`

---

## Multi-Tenant Isolation

- Idempotency keys are **NOT globally unique**
- Tenant A and Tenant B can use identical keys
- TenantId stored with each cached response
- Isolation enforced at query level

**Note**: Current Redis cache keys do NOT include TenantId prefix. For strict isolation, consider: `idempotency:{tenantId}:{idempotencyKey}`

---

## Performance Metrics

| Scenario | Response Time | Cache Access |
|----------|--------------|--------------|
| Cache hit | 1-2ms | Redis GET |
| Cache miss (first request) | Variable | Redis SET |
| Lock conflict | <5ms | Redis SETNX (failed) |

**Storage Overhead** (1M requests/day, 2KB avg response):
- Redis: ~2 GB/day (auto-expires after 24 hours)

**Cache Hit Rate**:
- First 24 hours: ~95-99%
- After 24 hours: 0% (expired)

---

## Frontend Integration Specification

### Client Responsibilities

**1. Generate Unique Keys**
- Use UUID v4 for each unique operation
- Never reuse keys across different operations
- Store key until response received

**2. Send Header**
```
POST /api/invoices HTTP/1.1
X-Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

**3. Detect Cached Responses**
- Check for `X-Idempotency-Replay: true` header
- Response is identical to original, no new side effects occurred

**4. Handle 409 Conflict**
- Indicates concurrent processing
- Implement retry with exponential backoff:
  - 1st retry: 100ms delay
  - 2nd retry: 200ms delay
  - 3rd retry: 400ms delay
- **Critical**: Use same idempotency key on retries

**5. Handle Network Failures**
- Retry with **same idempotency key**
- System returns cached response if original request succeeded
- Prevents duplicate operations

### Key Generation Patterns

**Pattern 1: Per-Operation UUID (Recommended)**
```
Operation: Create Invoice
Key: crypto.randomUUID() → "550e8400-e29b-41d4-a716-446655440000"

Retry: Use SAME key "550e8400-e29b-41d4-a716-446655440000"
```

**Pattern 2: Deterministic (Use with Caution)**
```
Operation: Create Invoice for Customer 123
Key: SHA256(operationType + customerId + timestamp)

Warning: Different operations with identical input = unintended cache hits
```

### When to Use Idempotency Keys

**Mandatory**:
- Financial transactions (payments, refunds, invoices)
- Resource creation (orders, records, users)
- Irreversible state changes
- Operations that trigger external actions

**Optional**:
- Idempotent updates (PUT with full resource replacement)
- Read operations (GET - naturally idempotent)
- Delete operations (often naturally idempotent)

**Never**:
- GET requests (no side effects)
- Operations intended to create multiple instances

### Error Handling Matrix

| Status | Header | Frontend Action |
|--------|--------|----------------|
| 200 OK | No replay header | Success - operation completed |
| 200 OK | `X-Idempotency-Replay: true` | Success - operation already completed |
| 409 Conflict | N/A | Wait 100-400ms, retry with same key |
| 4xx/5xx | No replay header | Original request failed, handle error |
| 4xx/5xx | `X-Idempotency-Replay: true` | Cached error from original request |
| Network timeout | N/A | Retry with same key (safe) |

### Retry Strategy Specification

**Exponential Backoff Algorithm**:
```
Attempt 1: Immediate
Attempt 2: Wait 100ms
Attempt 3: Wait 200ms
Attempt 4: Wait 400ms
Max attempts: 3-5
```

**Retry Logic**:
- 409 Conflict: Retry with backoff
- Network error: Retry with backoff
- 5xx Server error: Retry with backoff (optional)
- 4xx Client error: Do NOT retry (except 409, 429)

**Critical Rule**: Always use the **same idempotency key** for all retries of the same operation.

### Integration Checklist

- [ ] UUID generation library available
- [ ] HTTP client supports custom headers
- [ ] Response header inspection capability
- [ ] Retry logic with exponential backoff
- [ ] Local key storage during request lifecycle
- [ ] Error handling for 409 Conflict
- [ ] Logging of idempotency keys for debugging
- [ ] User feedback for cached responses (optional)

### Testing Scenarios

**Test 1: Duplicate Prevention**
- Send request with key `abc-123`
- Verify response
- Send identical request with key `abc-123`
- Verify response has `X-Idempotency-Replay: true`
- Verify no duplicate resource created

**Test 2: Concurrent Requests**
- Send 2+ simultaneous requests with key `abc-123`
- Expect one 200 OK, others 409 Conflict
- Retry 409 requests
- Verify all receive same response
- Verify single resource created

**Test 3: Network Retry**
- Send request with key `abc-123`
- Simulate network timeout (no response received)
- Retry with same key `abc-123`
- Verify operation executed only once

**Test 4: Unique Keys**
- Send request with key `key-1`
- Send request with key `key-2` (different key)
- Verify both operations executed
- Verify two distinct resources created

---

## Implementation Status

### Production Ready ✅
- **AppsPortal (Accounting)**: Full implementation with Redis caching

### Partial Implementation ⚠️
- **Inventory Module**: Redis caching only, incomplete

### Not Implemented ❌
- Sales API
- BusinessOwners API
- Integration API
- Attachment API
- Notification API
- Workflow API
- Import API
- Zatca API

---

## Configuration Parameters

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `CacheTtlHours` | 24 | Redis cache retention |
| `LockTimeoutMinutes` | 5 | Distributed lock TTL |

**Tuning Recommendations**:
- Increase TTL for critical financial operations (48 hours)
- Decrease TTL for non-critical operations (12 hours)
- Adjust lock timeout based on longest expected operation

---

## Security Considerations

**DoS Protection**:
- Rate limiting per tenant/user required
- Automatic 24-hour expiration
- Monitor Redis memory usage
- Reject keys exceeding 128 characters

**Data Privacy**:
- TenantId isolation enforced
- UserId tracked for audit
- Response bodies contain sensitive data
- Consider encryption at rest

**Recommendations**:
- Add maximum key length validation
- Implement per-tenant storage quotas
- Encrypt response bodies before caching (optional)

---

## Troubleshooting

### Issue: 409 Conflict Persists
**Cause**: Lock not released (server crash mid-request)
**Solution**: Wait 5 minutes (lock auto-expires)

### Issue: Duplicate Operations Despite Key
**Possible Causes**:
- Different keys used on retry
- Cache expired (>24 hours)
- Different tenant context
- Key exceeds length limit

### Issue: Slow Response Times
**Normal Latency**:
- Cache hit: 1-2ms
- Cache miss: Depends on controller (100-500ms typical)

---

## API Endpoints Affected

**Scope**: All POST, PUT, PATCH endpoints in AppsPortal (Accounting) module

**Automatic**: No code changes required in controllers
**Documentation**: Swagger UI auto-documents `X-Idempotency-Key` parameter

---

## References

**Standards**:
- RFC 9110 - HTTP Semantics (Idempotent Methods)
- Stripe API Idempotency Pattern
- AWS API Idempotency Best Practices

**Implementation**:
- `AppsPortal.Apis/Middleware/IdempotencyMiddleware.cs`
- `AppsPortal.Apis/Services/IdempotencyService.cs`
- `AppsPortal.Apis/Swagger/IdempotencyHeaderOperationFilter.cs`

---

**Version**: 1.0
**Last Updated**: 2026-01-27
**Type**: Technical Specification
**Audience**: Developers, DevOps, Frontend Engineers
