# Assignment answers

These sections came from the original coding assignment. They moved out of the README so that the product page reads as a product (DEFINE.md, section 0).

## Debugging task
**Broken:**
```js
const todos = ["Buy milk", "Study JS"];
for (var i = 0; i <= todos.length; i++) {
  setTimeout(() => console.log(todos[i].toUpperCase()), 100);
}
```
**Problems:** `<=` runs one step past the end (`undefined`), `var` shares one `i` across all callbacks, so the result is a `TypeError`.

**Fixed:**
```js
todos.forEach((todo) => setTimeout(() => console.log(todo.toUpperCase()), 100));
```

## Enhancement ideas for a basic static page
1. Dark mode with CSS variables and `prefers-color-scheme` (used in this app).
2. Accessibility and performance pass: semantic landmarks, contrast checks, lazy-loaded images, Lighthouse above 90.
3. Micro-interactions and a validated contact form instead of a bare `mailto:` link.
