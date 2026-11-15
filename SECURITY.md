# Security policy

## Report a problem in private

If you find a security problem in Tasks, do not open a public issue.

1. Open the [private report form](https://github.com/dheekshithsnewjourney-crypto/tasks/security/advisories/new).
2. Describe the problem and the steps to see it.
3. Send the report.

You will get an answer within 7 days. When the fix is live, the report can be made public, with credit to you if you want it.

## What is in scope

- The app and the start page at https://dheekshithsnewjourney-crypto.github.io/tasks/
- The Firestore security rules in [`react/firestore.rules`](./react/firestore.rules)
- The code in this repository

## Supported versions

Only the live version, built from `main`, gets fixes.

## How the project protects your data

- Guest mode uploads nothing. Your tasks stay in your browser.
- With the optional Google sign-in, the Firestore rules let only you read or write `users/<your id>/`. CI tests these rules on every push.
- The pages have a strict Content Security Policy. CI checks it on every build.
- CI fails if a dependency has a known high or critical vulnerability.
- The Firebase web config is public by design. It is kept out of the code and comes from repository variables at build time.
