# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.

## Environment Requirements

To set up and run this project, you need to have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (version 14.x or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Angular CLI](https://angular.io/cli) (version 19.0.6 or higher)

## Project Dependencies

The project dependencies are listed in the `package.json` file. Key dependencies include:

- `@angular/animations`: ^17.0.0
- `@angular/cdk`: ^17.0.0
- `@angular/common`: ^17.0.0
- `@angular/compiler`: ^17.0.0
- `@angular/core`: ^17.0.0
- `@angular/flex-layout`: ^15.0.0-beta.42
- `@angular/forms`: ^17.0.0
- `@angular/material`: ^17.3.10
- `@angular/platform-browser`: ^17.0.0
- `@angular/platform-browser-dynamic`: ^17.0.0

For a complete list of dependencies, refer to the [`package.json`](package.json) file.

## Setting Up the Project

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mhermannn/angularKiosk.git
   cd frontend
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Development Server:**
   To start a local development server, run:
   ```bash
   ng serve
   ```
   Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

4. **Building the Project:**
   To build the project, run:
   ```bash
   npm run build
   ```
   This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

5. **Running Linting:**
   To run linting on the project, use:
   ```bash
   npm run lint
   ```
   To automatically fix linting issues, use:
   ```bash
   npm run lint:fix
   ```

