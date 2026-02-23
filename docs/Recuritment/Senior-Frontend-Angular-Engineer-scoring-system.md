# Detailed Scoring System (Keyword-Based)

👉 Rule: Each answer has key concepts (keywords).  
- Candidate gets **1 point per keyword** (unless noted otherwise).  
- If they cover all keywords → full score.  
- Partial answers get proportional points.
- Some questions will have a point for I don't know  

---

## JavaScript Core & Event Loop (25 points)

| Question | Max Points | Keywords (1 point each) |
|----------|------------|--------------------------|
| == vs === | 2 | `==` does type coercion, `===` strict equality, no coercion |
| Data types | 3 | Primitive, Non-primitive, Examples (string/number/object etc.) |
| var / let / const | 2 | Scope difference, Reassignment/Hoisting difference |
| null vs undefined | 2 | `null` = intentional empty, `undefined` = uninitialized |
| Arrow vs Normal function (this) | 3 | Normal = dynamic `this`, Arrow = lexical `this`, Example |
| Hoisting & Closures | 3 | Hoisting = declarations move up, Closure = inner function keeps outer scope, Example |
| ES6 updates | 2 | `let/const`, Arrow functions, Destructuring/Modules |
| Array cloning | 2 | `slice()`, `[...arr]`, `Array.from()` |
| Looping objects | 2 | `for...in`, `Object.keys/values/entries` |
| Map vs forEach | 2 | `map` returns new array, `forEach` returns undefined |
| Event Loop example | 2 | Sync first, Microtasks (Promise), then Macrotasks (setTimeout) |

---

<table>
  <tr style="background-color: #f2f2f2;">
    <th>What is the difference between == & ===</th>
    <th>2</th>
  </tr>
  <tr>
    <td>does type coercion</td>
    <td>1</td>
  </tr>
  <tr>
    <td>strict equality, no coercion</td>
    <td>1</td>
  </tr>
</table>




## Senior-Level JavaScript (15 points)

<table>
  <tr style="background-color: #f2f2f2;">
    <th>Walk me through a scenario where you optimized a complex grid with thousands of rows.</th>
    <th>10</th>
  </tr>
  <tr>
    <td>Virtual scrolling / infinite scroll</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Pagination (client-side or server-side)</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Server-side filtering and sorting</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Column virtualization (render only visible columns)</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Lazy loading of data chunks</td>
    <td>1</td>
  </tr>
  <tr>
    <td>OnPush change detection strategy</td>
    <td>1</td>
  </tr>
  <tr>
    <td>TrackBy in *ngFor for stable DOM reuse</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Debouncing search/filter inputs</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Caching frequently accessed data</td>
    <td>1</td>
  </tr>
  <tr>
    <td>Preloading lightweight summaries before full detail load</td>
    <td>1</td>
  </tr>
</table>

<table>
  <tr style="background-color: #f2f2f2;">
    <th>What is the difference between Default and OnPush change detection strategies?</th>
    <th>8</th>
  </tr>
  <tr>
    <td><B>Default Strategy</b> Runs change detection for the entire component tree whenever any event occurs (click, HTTP response, timer, input, etc.)/td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>Default Strategy</b> Checks all components, even if their inputs didn’t change.</td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>Default Strategy</b> Easier for beginners, but less performant in large apps.</td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>OnPush Strategy</B> Runs change detection <B>only</B> when : Component input reference changes</td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>OnPush Strategy</B> Runs change detection <B>only</B> when : An event originates from inside the component</td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>OnPush Strategy</B> Runs change detection <B>only</B> when : Or you manually trigger it (e.g., using `ChangeDetectorRef.markForCheck()`)</td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>OnPush Strategy</B> Skips re-checking components unnecessarily</td>
    <td>1</td>
  </tr>
  <tr>
    <td><B>OnPush Strategy</B> More performant and predictable for ERP-scale applications.</td>
    <td>1</td>
  </tr>
</table>

| Question | Max Points | Keywords |
|----------|------------|----------|
| Browser request flow | 4 | DNS Lookup, TCP/HTTPS request, Server sends HTML/CSS/JS, Parsing & Rendering, JS executed (event loop) |
| Remove duplicates from array | 2 | `Set`, Filter + indexOf |
| call vs apply vs bind | 3 | `call(args list)`, `apply(args array)`, `bind` returns new function |
| Tree shaking | 3 | Remove unused code, ES modules, Reduce bundle size |
| Web Vitals | 3 | LCP, FID, CLS, Measure performance & UX |

---

## Angular (35 points)

| Question | Max Points | Keywords |
|----------|------------|----------|
| Angular & building blocks | 3 | Modules, Components, Services, Templates, Metadata |
| Lifecycle hooks | 3 | ngOnInit, ngOnChanges, ngOnDestroy |
| Directives & Pipes | 3 | Structural, Attribute, Built-in Pipes, Custom |
| Promise vs Observable | 3 | Promise = single value, Observable = stream/multiple, cancellable |
| Change Detection (deep) | 5 | Zone.js triggers, Component tree re-check, Default strategy, OnPush strategy |
| Signals & difference | 5 | Fine-grained reactivity, No Zone.js, Automatic change tracking, More performant |
| Encapsulation | 2 | Emulated, ShadowDom, None |
| Dependency Injection | 3 | Injector provides, Singleton pattern, Hierarchical injectors |
| Service vs Class | 2 | Service managed by DI, Class instantiated manually |
| Provided in root vs module | 2 | Root = singleton app-wide, Module = new instance per module |
| Interceptor | 2 | Intercept HTTP requests/responses, Auth/logging/error handling |
| Guard | 2 | CanActivate/Deactivate, Route protection |
| Resolver | 2 | Pre-fetch data before routing |
| Compilation types | 2 | JIT (runtime), AOT (build time) |
| Authentication vs Authorization | 2 | Auth = identity, Authorization = permissions |

---

## Performance Optimization (10 points)

| Question | Max Points | Keywords |
|----------|------------|----------|
| Angular optimization strategies | 10 | OnPush, trackBy, Lazy Loading, Preloading, Signals, Tree Shaking, Build Optimizer, Lazy loading images, Web Workers, Caching, SSR |

---

## Live Coding (15 points)

| Exercise | Max Points | Keywords |
|----------|------------|----------|
| Reverse string | 2 | `split`, `reverse`, `join` |
| Remove duplicates | 2 | `Set`, `filter` |
| Find max number | 2 | `Math.max`, Spread operator |
| FizzBuzz | 2 | `%3`, `%5`, Output "Fizz", "Buzz", "FizzBuzz" |
| Debounce function | 3 | Clear timeout, Set timeout, Return wrapper function |
| Deep clone object | 2 | `structuredClone`, `JSON.parse(JSON.stringify(obj))` |
| Angular trackBy | 2 | trackByFn, Return unique id, Performance benefit |

---

# Scoring Guidelines

- ✅ Mention **all keywords** → full score.  
- ⚠️ Mention **some keywords** → partial score.  
- ❌ No relevant keywords → 0 score.  

---

# Rating Scale

- **85–100**: Strong Senior  
- **70–84**: Mid-Senior  
- **50–69**: Mid-Level  
- **<50**: Junior  

