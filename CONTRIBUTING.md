# Contributing to Motion SurveyJS UI

Thank you for your interest in contributing to Motion SurveyJS UI! We welcome contributions from the community to help make this library better.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/motion-surveyjs-ui.git
    cd motion-surveyjs-ui
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

## Development Workflow

### Commands

-   **Start the demo app**:
    ```bash
    npm run dev
    ```
-   **Run unit tests**:
    ```bash
    npm run test
    ```
-   **Typecheck**:
    ```bash
    npm run typecheck
    ```
-   **Lint**:
    ```bash
    npm run lint
    ```
-   **Build the library**:
    ```bash
    npm run build
    ```

### Project Structure

-   `src/lib/`: Contains the library source code.
-   `src/lib/elements/`: Individual SurveyJS element renderers.
-   `src/lib/ui/`: Shared UI components.
-   `src/App.tsx`: Demo application for testing changes.

## Code Standards

-   **TypeScript**: We use strict mode. Avoid `any` and ensure types are accurate.
-   **Styling**: Use CSS variables for theming. Avoid hardcoding colors. See `STYLING-CSS-GUIDE.md`.
-   **Testing**: New features must include unit tests. We use Vitest and React Testing Library.
-   **Linting**: Ensure your code passes `npm run lint` before submitting.

## Pull Request Process

1.  Create a new branch for your feature or fix:
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  Make your changes.
3.  Run tests and linting to ensure no regressions.
4.  Commit your changes with clear, descriptive messages.
5.  Push to your fork and submit a Pull Request to the `main` branch.
6.  Fill out the PR template with details about your changes.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. Provide as much detail as possible, including reproduction steps for bugs.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
