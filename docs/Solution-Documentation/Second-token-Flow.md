# 🔐 Second Token Flow for ERP System

  

## 📋 Overview

Modern dual-token authentication architecture where users obtain a specialized ERP token after initial Keycloak authentication, enabling secure session management with Redis-backed token storage.

  

## 🔄 Authentication Flow

  

### Phase 1: Initial Authentication

- 🔑 User authenticates via **Keycloak** SSO

- 📨 Receives primary JWT token

- ➡️ Redirected to **after-login** page

  

### Phase 2: Second Token Acquisition

- 📡 After-login page requests ERP-specific token

- ✅ ERP backend validates Keycloak JWT

- 🎫 Generates second token with unique version identifier

- 💾 Stores token AND version in Redis

  

### Phase 3: Distributed Token Storage

  

#### 💻 Frontend Layer

- Receives ERP token and token version from backend

- Stores both in secure client storage (sessionStorage recommended)

- Attaches token to all subsequent ERP API requests

- Sends token version in request headers for validation

  

#### 🗄️ Backend Layer

- Persists token with version in **Redis**

- Maps token to user session context

- Validates token version on each request

- Issues refresh directive if version mismatch detected

- Configures automatic TTL-based expiration

  

## Sequence Diagram

  

::: mermaid

sequenceDiagram

    actor User

    participant KC as Keycloak

    participant FE as Frontend<br/>(after-login)

    participant BE as ERP Backend

    participant Redis as Redis

  

    User->>KC: 1. Authenticate (username/password)

    activate KC

    KC->>KC: Validate credentials

    KC-->>User: 2. First Token (JWT)

    deactivate KC

  

    User->>FE: 3. Redirect with First Token

    activate FE

  

    FE->>BE: 4. POST /api/erp/token<br/>(Authorization: Bearer firstToken)

    activate BE

  

    BE->>BE: 5. Validate First Token<br/>(verify with Keycloak)

    BE->>BE: 6. Generate Second Token<br/>+ Token Version (UUID)

  

    BE->>Redis: 7. SETEX erp:token:userId<br/>(token, version, TTL: 3600s)

    activate Redis

    Redis-->>BE: 8. OK

    deactivate Redis

  

    BE-->>FE: 9. { secondToken, tokenVersion }<br/>X-Token-Version header

    deactivate BE

  

    FE->>FE: 10. Store Token + Version<br/>(sessionStorage)

    FE-->>User: 11. Display Application

    deactivate FE

  

    Note over FE,BE: Subsequent API Requests

  

    FE->>BE: 12. API Request<br/>Authorization: Bearer token<br/>X-Token-Version: {version}

    activate BE

    BE->>Redis: 13. Get Token Version

    activate Redis

    Redis-->>BE: 14. Current Version

    deactivate Redis

    alt Version Match

        BE-->>FE: 15. 200 OK + Data

    else Version Mismatch

        BE-->>FE: 16. 200 OK + Data<br/>X-Token-Refresh-Required: true

        FE->>FE: 17. Request New Token

    end

    deactivate BE

:::

  

## Component Diagram

  

::: mermaid

graph TB

    subgraph Client["Client Side"]

        Browser[Browser]

        AfterLogin[After-Login Page]

        SessionStore[(Session Storage<br/>Token + Version)]

    end

  

    subgraph Auth["Authentication"]

        KC[Keycloak]

    end

  

    subgraph ERP["ERP Application"]

        subgraph Backend["Backend"]

            Gateway[API Gateway]

            AuthMW[Auth Middleware<br/>Version Validator]

            TokenService[Token Service]

        end

        subgraph Storage["Storage"]

            Redis[(Redis<br/>Token + Version<br/>TTL: 3600s)]

        end

    end

  

    Browser -->|1. Authenticate| KC

    KC -->|2. First Token| Browser

    Browser -->|3. Navigate with token| AfterLogin

    AfterLogin -->|4. Request Second Token| Gateway

    Gateway -->|5. Validate| AuthMW

    AuthMW -->|6. Issue Token + Version| TokenService

    TokenService -->|7. Store Token + Version| Redis

    Redis -->|8. Confirm| TokenService

    TokenService -->|9. Return Token + Version| AfterLogin

    AfterLogin -->|10. Store Both| SessionStore

    SessionStore -.->|11. API Requests| Gateway

    Gateway -.->|12. Validate Version| Redis

    Gateway -.->|13. Refresh if mismatch| SessionStore

  

    style Redis fill:#e1f5ff

    style SessionStore fill:#e1f5ff

    style KC fill:#fff4e1

    style AuthMW fill:#ffe1e1

:::

  

## 🛡️ Security Architecture

  

| Component | Security Measure | Implementation |

|-----------|-----------------|----------------|

| **Token Validation** | Keycloak JWT verification | Cryptographic signature validation |

| **Version Control** | Token version matching | UUID-based version tracking in Redis |

| **Storage Security** | Client-side protection | SessionStorage (cleared on tab close) |

| **Token Lifecycle** | Automatic expiration | Synchronized TTL across layers |

| **Cache Layer** | Redis TTL enforcement | Auto-cleanup of expired sessions |

| **Transport Security** | TLS encryption | HTTPS-only communication |

| **Token Rotation** | Proactive refresh | Version mismatch detection |

| **Stale Token Prevention** | Version validation | Force refresh on version mismatch |

  

## 📡 HTTP Headers Specification

  

### Request Headers (Frontend → Backend)

  

| Header Name | Type | Description | Example Value | When Used |

|-------------|------|-------------|---------------|-----------|

| `Authorization` | Standard | Bearer token for authentication | `Bearer eyJhbGc...` | All authenticated requests |

| `X-Token-Version` | Custom | Token version identifier | `550e8400-e29b-41d4-a716-446655440000` | All API requests after token acquisition |

  

### Response Headers (Backend → Frontend)

  

| Header Name | Type | Description | Example Value | When Used |

|-------------|------|-------------|---------------|-----------|

| `X-Token-Version` | Custom | Token version on issuance | `550e8400-e29b-41d4-a716-446655440000` | Initial token response |

| `X-Token-Refresh-Required` | Custom | Signals version mismatch | `true` | When frontend version ≠ Redis version |

| `X-Token-Expires-In` | Custom | TTL in seconds | `3600` | Token issuance/refresh |

  

### Header Naming Convention

- **Standard**: Following RFC 7235 for `Authorization`

- **Custom Headers**: Using `X-` prefix for proprietary headers (legacy convention, widely supported)

- **Alternative Modern Approach**: Could use vendor-specific prefix like `ERP-Token-Version` for clarity

  

## ⚙️ Technical Stack

  

### Frontend Technologies

- **HTTP Client**: Fetch API / Axios with interceptors

- **Storage**: Web Storage API (SessionStorage)

- **Auth Flow**: OAuth 2.0 / OpenID Connect

- **Version Tracking**: UUID v4 generation and validation

  

### Backend Technologies

- **Auth Provider**: Keycloak

- **Cache Layer**: Redis with versioned key storage

- **Token Format**: JWT (JSON Web Tokens)

- **API Protocol**: REST / GraphQL

- **Version Generation**: UUID v4 (RFC 4122)

  

### Infrastructure

- **Session Store**: Redis Cluster

- **TTL Management**: Automated expiration

- **Load Balancing**: Session affinity support

- **Version Storage**: Hash structure in Redis

  

## Token Lifecycle

  

::: mermaid

stateDiagram-v2

    [*] --> Requested: User logs in

    Requested --> Validated: Validate First Token

    Validated --> Created: Generate Second Token<br/>+ Version (UUID)

    Created --> Stored: Store in Redis & Frontend<br/>(Token + Version)

    state Stored {

        [*] --> Active

        Active --> VersionCheck: API Request

        VersionCheck --> Active: Version Match

        VersionCheck --> RefreshRequired: Version Mismatch

        RefreshRequired --> Active: Token Refreshed

    }

    Stored --> InUse: API Requests<br/>(with X-Token-Version)

    InUse --> Stored: Request Complete

    Stored --> Expired: TTL Reached

    Stored --> Revoked: User Logout

    Expired --> [*]

    Revoked --> [*]

    note right of Stored

        Token + Version stored

        Redis validates on each request

    end note

    note right of RefreshRequired

        Backend sends

        X-Token-Refresh-Required: true

    end note

    note right of Expired

        Auto-removed from

        Redis by TTL

    end note

:::

  

### 📊 Lifecycle Phases

  

| Phase | Action | Location | Duration | Version Handling |

|-------|--------|----------|----------|------------------|

| 🎯 **Creation** | Generated post-validation | ERP Backend | Instant | UUID v4 generated |

| 💾 **Storage** | Dual persistence | Frontend + Redis | Synchronized | Both layers store version |

| 🚀 **Active Use** | API request authorization | All ERP endpoints | Until expiry | Version sent in header |

| 🔍 **Validation** | Version matching | Backend middleware | Per request | Compare frontend vs Redis |

| 🔄 **Refresh** | Forced renewal | On version mismatch | Immediate | New version generated |

| 🗑️ **Revocation** | Cleanup & invalidation | Both layers | On logout/expire | Version deleted |

  

## 🔄 Token Version Management

  

### Version Generation

- **Format**: UUID v4 (Universally Unique Identifier)

- **Example**: `550e8400-e29b-41d4-a716-446655440000`

- **Generation**: On each token creation/refresh

- **Uniqueness**: Cryptographically random, collision-resistant

  

### Redis Storage Structure

```

Key: erp:token:{userId}

Value: {

  "token": "eyJhbGciOiJIUzI1NiIs...",

  "version": "550e8400-e29b-41d4-a716-446655440000",

  "createdAt": 1701349200,

  "expiresAt": 1701352800

}

TTL: 3600 seconds

```

  

### Frontend Storage Structure

```javascript

// SessionStorage

{

  "erpToken": "eyJhbGciOiJIUzI1NiIs...",

  "erpTokenVersion": "550e8400-e29b-41d4-a716-446655440000",

  "tokenExpiresAt": 1701352800000

}

```

  

### Version Validation Flow

  

1. **Frontend**: Sends `X-Token-Version` header with every API request

2. **Backend**: Retrieves current version from Redis

3. **Comparison**:

   - ✅ **Match**: Process request normally

   - ❌ **Mismatch**: Set `X-Token-Refresh-Required: true` in response

4. **Frontend**: Detects refresh header, requests new token automatically

5. **Backend**: Issues new token with new version, updates Redis

  

## Error Handling

  

::: mermaid

flowchart TD

    Start([User requests Second Token]) --> ValidateToken{First Token Valid?}

    ValidateToken -->|No| Unauthorized[Return 401 Unauthorized<br/>Redirect to Login]

    Unauthorized --> End1([End])

    ValidateToken -->|Yes| GenerateToken{Generate Second Token<br/>+ Version?}

    GenerateToken -->|Failed| ServerError[Log Error<br/>Return 500 Internal Server Error]

    ServerError --> End2([End])

    GenerateToken -->|Success| StoreRedis{Store Token + Version<br/>in Redis?}

    StoreRedis -->|Failed| ServiceError[Log Error<br/>Return 503 Service Unavailable<br/>Redis connection failed]

    ServiceError --> End3([End])

    StoreRedis -->|Success| Success[Return Token + Version<br/>Status: 200 OK<br/>X-Token-Version header]

    Success --> End4([End])

    style Unauthorized fill:#ffcccc

    style ServerError fill:#ffcccc

    style ServiceError fill:#ffcccc

    style Success fill:#ccffcc

:::

  

### Version Mismatch Handling

  

::: mermaid

flowchart TD

    APIRequest([API Request with<br/>X-Token-Version]) --> GetRedisVersion{Retrieve Version<br/>from Redis}

    GetRedisVersion -->|Redis Error| CacheError[Continue Processing<br/>Log Warning]

    CacheError --> ProcessRequest[Process Request]

    ProcessRequest --> Return200[Return 200 OK]

    GetRedisVersion -->|Success| CompareVersions{Frontend Version<br/>== Redis Version?}

    CompareVersions -->|Match| ProcessRequest2[Process Request]

    ProcessRequest2 --> Return200_2[Return 200 OK]

    Return200_2 --> End5([End])

    CompareVersions -->|Mismatch| SetRefreshHeader[Process Request<br/>Add Header:<br/>X-Token-Refresh-Required: true]

    SetRefreshHeader --> Return200Refresh[Return 200 OK<br/>with Refresh Header]

    Return200Refresh --> FrontendDetect[Frontend Detects Header]

    FrontendDetect --> RequestNewToken[Request New Token<br/>Automatically]

    RequestNewToken --> End6([End])

    Return200 --> End7([End])

    style CacheError fill:#fff4cc

    style SetRefreshHeader fill:#cce5ff

    style RequestNewToken fill:#ccffcc

:::

  

### 🚨 Error Scenarios & Responses

  

| Error Type | HTTP Status | Client Action | Backend Action | Headers Set |

|------------|-------------|---------------|----------------|-------------|

| Invalid Keycloak Token | 401 Unauthorized | Redirect to login | Log security event | - |

| Token Generation Failed | 500 Internal Error | Show error message | Alert monitoring | - |

| Redis Unavailable | 503 Service Unavailable | Retry with backoff | Failover mechanism | - |

| Token Expired | 401 Unauthorized | Request new token | Clear Redis entry | - |

| Version Mismatch | 200 OK | Auto-refresh token | Continue processing | `X-Token-Refresh-Required: true` |

| Missing Version Header | 200 OK | Request continues | Log warning | `X-Token-Refresh-Required: true` |

| Network Timeout | 408 Request Timeout | Retry request | N/A | - |

  

## 📈 Performance Metrics

  

- **Token Generation**: < 100ms

- **Version Generation (UUID)**: < 1ms

- **Redis Write/Read**: < 10ms

- **Token Validation**: < 50ms

- **Version Comparison**: < 5ms

- **End-to-End Flow**: < 500ms

- **Cache Hit Ratio**: > 95%

  

## 🔧 Configuration

  

### Recommended TTL Settings

- **Development**: 1 hour (3600s)

- **Staging**: 8 hours (28800s)

- **Production**: 12 hours (43200s)

  

### Redis Configuration

```yaml

Key Pattern: erp:token:{userId}

Data Structure: Hash

Fields:

  - token: JWT string

  - version: UUID v4

  - createdAt: Unix timestamp

  - expiresAt: Unix timestamp

Eviction Policy: volatile-ttl

Max Memory: 2GB

Persistence: AOF enabled

```

  

## 🎯 Benefits of Version Control

  

### Security Benefits

- ✅ **Prevents Stale Token Usage**: Old cached tokens become invalid

- ✅ **Session Invalidation**: Force logout across all devices by changing version

- ✅ **Concurrent Session Detection**: Identify multiple sessions using same token

- ✅ **Token Rotation**: Seamless token refresh without breaking active sessions

  

### Operational Benefits

- ✅ **Zero-Downtime Updates**: Can invalidate all tokens during critical updates

- ✅ **Debugging**: Track which token version is in use

- ✅ **Audit Trail**: Version changes logged for compliance

- ✅ **Graceful Migration**: Users automatically get new tokens without re-login