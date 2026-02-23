JavaScript Core & Event Loop
============================

### Equality Operators

| Question | Answer |
| --- | --- |
| What is the difference between `==` and `===`? | `==` compares values with type coercion.  <br>`===` compares both value and type (no coercion). |

### Data Types

| Question | Answer |
| --- | --- |
| What are the data types in JavaScript? | Primitive: string, number, bigint, boolean, null, undefined, symbol.  <br>Non-Primitive: objects, arrays, functions. |
| Which are primitive vs non-primitive? | Primitive → immutable, stored by value.  <br>Non-Primitive → reference types, stored by reference. |

### Variables

| Question | Answer |
| --- | --- |
| Difference between `var`, `let`, and `const`? | `var`: function-scoped, hoisted, can redeclare.  <br>`let`: block-scoped, cannot redeclare in same scope.  <br>`const`: block-scoped, must be initialized, cannot reassign. |

### Null vs Undefined

| Question | Answer |
| --- | --- |
| Difference between `null` and `undefined`? | `null`: intentional empty value.  <br>`undefined`: variable declared but not assigned. |

### Functions

| Question | Answer |
| --- | --- |
| Difference between normal function and arrow function regarding `this`? | Normal function: `this` depends on how it’s called.  <br>Arrow function: `this` is lexically inherited from outer scope. |

### Other Core Concepts

| Question | Answer |
| --- | --- |
| What is hoisting? | Variables (`var`) and functions are moved to the top of their scope before execution. |
| What is a closure? | A function that retains access to variables from its lexical scope even after that scope has finished. |
| Key ES6 updates? | `let`, `const`, arrow functions, template literals, destructuring, modules, promises, classes, spread/rest, Map, Set, etc. |
| How to clone an array? | `arr.slice()`, `[...arr]`, or `Array.from(arr)`. |
| How to loop on objects? | `for...in` → keys  <br>`for...of` → values (arrays/iterables only)  <br>`Object.keys()`, `Object.values()`, `Object.entries()`. |
| Difference between `map` and `forEach`? | `forEach`: executes callback, returns undefined.  <br>`map`: transforms array, returns new array. |

* * *

### Event Loop Example

| Code | Expected Output |
| --- | --- |
| `js<br>console.log("1 - Start");<br><br>setTimeout(() => { console.log("2 - setTimeout"); }, 0);<br><br>Promise.resolve()<br> .then(() => { console.log("3 - Promise then 1"); })<br> .then(() => { console.log("4 - Promise then 2"); });<br><br>console.log("5 - End");<br>` | `<br>1 - Start<br>5 - End<br>3 - Promise then 1<br>4 - Promise then 2<br>2 - setTimeout<br>` |

* * *

Senior-Level JavaScript
=======================

| Question | Answer |
| --- | --- |
| What happens when typing `google.com` in browser? | DNS resolution → TCP/TLS handshake → HTTP request → server response → browser parses HTML → builds DOM/CSSOM → executes JS → renders page. |
| How to remove duplicates from an array? | `const unique = [...new Set(arr)];` |
| Difference between `call`, `apply`, and `bind`? | `call`: invoke with `this` + args (comma-separated).  <br>`apply`: invoke with `this` + args (array).  <br>`bind`: returns new function with bound `this`. |
| What is Tree Shaking? | Build optimization that removes unused code (works best with ES modules). |
| What are Web Vitals? | Performance metrics: **LCP** (Largest Contentful Paint), **FID** (First Input Delay), **CLS** (Cumulative Layout Shift). They help measure real-world user experience. |

* * *

Angular
=======

| Question | Answer |
| --- | --- |
| What is Angular? | A TypeScript-based framework for building web apps. |
| What are Angular’s building blocks? | Components, Templates, Modules, Services, Dependency Injection, Directives, Pipes, Routing. |
| Lifecycle hooks in components? | `ngOnInit`, `ngOnChanges`, `ngDoCheck`, `ngAfterViewInit`, `ngAfterContentInit`, `ngOnDestroy`, etc. |
| What are directives? | **Structural**: `*ngIf`, `*ngFor`.  <br>**Attribute**: `[ngClass]`, `[ngStyle]`. |
| What are pipes? | **Pure pipes**: depend only on input.  <br>**Impure pipes**: re-run frequently, may cause performance issues. |
| Difference between Promise and Observable? | Promise → single async value, eager, not cancellable.  <br>Observable → multiple values over time, lazy, cancellable, supports RxJS operators. |
| How does change detection work? | Runs after async events (e.g., DOM events, XHR, setTimeout). Re-checks bindings and updates DOM. |
| What are Signals? | Fine-grained reactivity primitive (Angular 16+). Better control than global change detection. |
| Difference between Signals and previous CD strategy? | Signals trigger reactivity only where used, unlike zone-based CD that checks the whole tree. |
| What does `encapsulation` property in component decorator do? | Controls CSS scoping:  <br>`Emulated` (default), `None` (global), `ShadowDom` (native shadow DOM). |
| What is Dependency Injection? | A pattern where Angular provides services to components instead of components instantiating them manually. |
| Difference between service and normal class? | Service: `@Injectable`, managed by Angular DI.  <br>Normal class: not injectable. |
| Service provided in root vs module? | **Root**: singleton across app.  <br>**Module**: new instance for that module’s injector. |
| What is an interceptor? | Middleware for HTTP requests (e.g., add auth token, logging, error handling). |
| What is a guard? | Used in routing to control access (e.g., `CanActivate`, `CanDeactivate`). |
| What is a resolver? | Preloads data before navigating to a route. |
| Types of compilation in Angular? | **JIT** (compile in browser) and **AOT** (compile at build time). |
| Authentication vs Authorization? | Authentication → identity (who you are).  <br>Authorization → permissions (what you can access). |

* * *

Performance Optimization in Angular
===================================

| Question | Answer |
| --- | --- |
| How to improve Angular app performance? | 1. Use **OnPush** change detection.  <br>2. Use **trackBy** with `*ngFor`.  <br>3. **Lazy load** modules.  <br>4. Use **PreloadingStrategy** for critical modules.  <br>5. Use **Signals** for efficient CD.  <br>6. Bundle optimizations (Tree Shaking, Build Optimizer).  <br>7. Lazy load images/files.  <br>8. Use **Web Workers** for heavy tasks.  <br>9. Cache data in services/state management.  <br>10. Use **Angular Universal (SSR)** for faster first paint. |

* * *

Behavioral
==========

| Question | Answer |
| --- | --- |
| How would you rate your level of seniority (junior, mid-level, senior)? | _Candidate’s self-assessment here._ |
| What experiences support that rating? | _Candidate describes examples from career (projects, leadership, challenges solved)._ |