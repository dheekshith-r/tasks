# Contributing to Tasks

Thank you for your help. Tasks is a small, free to-do list. Bug reports and ideas are the most useful help.

## Report a bug or suggest an idea

1. Open [a new issue](https://github.com/dheekshith-r/tasks/issues/new/choose).
2. Choose "Bug report" or "Idea".
3. Fill in the form. Do not paste your real tasks; issues are public.

For a security problem, follow [SECURITY.md](./SECURITY.md) instead.

## Change the code

1. Fork the repository and make a branch from `main`.
2. Set it up:
   ```bash
   cd react
   npm install
   npm run dev
   ```
3. Make your change. Keep it small and about one thing.
4. Run the checks:
   ```bash
   npm test
   npm run build
   npm run contrast
   ```
5. Open a pull request and fill in the template.

## Rules for every change

- Every promise on the start page must be true in the app. Do not add a claim that the app does not keep.
- Do not weaken or skip a test to make it pass.
- Keep guest mode private: no new third-party requests, no analytics and no ads.
- Follow the design system in [DESIGN.md](./DESIGN.md). Red is only for the main action, the postmark and `!high`. Yellow is only for labels.
- Every control needs a label, keyboard access and visible focus. Text must pass WCAG AA contrast.
- Never put secrets in code or in git history.

## Code of conduct

Everyone who takes part follows the [code of conduct](./CODE_OF_CONDUCT.md).
