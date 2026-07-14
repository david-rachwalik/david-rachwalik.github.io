# david-rachwalik.github.io (Client)

## Web App ([site](https://david-rachwalik.github.io), [repo](https://github.com/david-rachwalik/david-rachwalik.github.io))

Personal site for hobbies, aspirations, game news, game design, engine info, and patch notes.

### Project Tech Stack

- **Languages:**&nbsp; HTML, CSS, SASS, JavaScript, TypeScript, Markdown
- **Framework:**&nbsp; [Angular v22](https://angular.dev) ([GitHub](https://github.com/angular/angular), [Version Compatibility](https://angular.dev/guide/versions))
- **Styling:**&nbsp; [Angular Material](https://material.angular.io), [Tailwind CSS](https://tailwindcss.com)
- **State Management:**&nbsp; [NgRx](https://ngrx.io) (Store, Effects, Entity, Data)&nbsp; ([Learn RxJS](https://www.learnrxjs.io))

---

## Development Environment Setup

This project is configured to run inside a VS Code Dev Container to ensure consistent tooling (Node, npm, Angular CLI) across all environments.

1. Ensure **Docker** is running on your host machine.
2. Open the workspace in **VS Code**.
3. Open the **Command Palette** (`Ctrl+Shift+P` / `Cmd+Shift+P`) and select **Dev Containers: Reopen in Container** (or **Rebuild and Reopen in Container** if needed).

### Helpful Docker Commands

List running containers (shows IDs and names):

```bash
docker ps
```

Connect directly to the running container via terminal:

```bash
docker exec -it --user vscode -w <working-dir> <container-id> /bin/zsh
```

---

## Running the Application

Inside the dev container, navigate to the Angular client folder and start the development server:

```bash
cd /workspaces/david-rachwalik.github.io/client-angular
npm install
npm run dev
```

---

## Using the Angular CLI Locally (`npx`)

Instead of relying on a globally installed Angular CLI (`ng`), this project uses `npx` to execute the CLI directly from the project's local dependency tree (`node_modules`).

**Why `npx`?**
Using `npx ng <command>` guarantees you are running the exact version of the Angular CLI that matches the project.&nbsp; It prevents compatibility issues that occur when a globally installed CLI is older or newer than what the project expects.

### Common Generation Commands

Generate a new Angular component:

```bash
npx ng g c <component-name>
```

Generate a new Angular module:

```bash
npx ng g m <module-name>
```

#### Example: Generating a Blog section

See the [Blog Documentation](src/app/modules/blog/README.md) for details on blog generation, metadata, and styling inspiration.

---

## Upgrading the Project

When migrating the project to newer versions of Angular, apply updates sequentially, one major version at a time. The following commands demonstrate the standard upgrade workflow (e.g., upgrading to v22).

1. Check for available updates:

   ```bash
   npx ng update
   ```

2. Update internal core framework and CLI tools to v22:

   ```bash
   npx ng update @angular/core@22 @angular/cli@22
   ```

3. Update Angular Material components to v22:

   ```bash
   npx ng update @angular/material@22
   ```

4. Update state management and third-party packages to v22:

   ```bash
   npx ng update @ngrx/store@22 @ngrx/effects@22 @ngrx/entity@22 @ngrx/data@22
   ```

### Handling Peer Dependency Conflicts

During major framework upgrades, third-party libraries (like `ngx-markdown` or NgRx) might not immediately support the new Angular version, leading to peer dependency conflicts.

- **`--force` (Angular CLI):** Use this with `ng update` to force the migration scripts to run even if the underlying `package.json` dependencies have conflicts.

  ```bash
  npx ng update @angular/core@22 @angular/cli@22 --force
  ```

- **`--legacy-peer-deps` (NPM):** Use this with `npm install` to tell NPM to bypass strict peer dependency resolution. This allows you to install older packages (e.g., v21) alongside the newer framework (e.g., v22) so you can test if they are functionally compatible while waiting for official updates.

  ```bash
  npm install --legacy-peer-deps
  ```

---

## Deployment Options

This application is configured to deploy directly to GitHub Pages using the `angular-cli-ghpages` package.

To build and deploy the production app:

```bash
npm run deploy
```

_(Note: The `npm run deploy` command automatically triggers the `predeploy` script. This handles [metadata generation](src/app/modules/blog/README.md), production builds, and pushing to the `gh-pages` branch)._

---

## Tooling Requirements

If not using the provided Dev Container, ensure your local environment has the following:

- **Node.js**: v22 (or equivalent compatible with Angular v22)
- **npm**: v10+

---

## Historical Project Setup Logic (Reference Only)

Below are the commands used originally to bootstrap this project and its dependencies. They are kept here for historical context and architectural reference.

Bootstrapping the raw application ([Tutorial](https://angular.dev/tutorials/tour-of-heroes), [Layouts Guide](https://indepth.dev/posts/1235/how-to-reuse-common-layouts-in-angular-using-router-2)):

```bash
ng new <app-name>
```

Adding tailwind ([CheatSheet](https://nerdcave.com/tailwind-cheat-sheet), [Box Shadow Guide](https://tailwindcss.com/docs/box-shadow), [Use with Preprocessors](https://tailwindcss.com/docs/using-with-preprocessors)):

```bash
npm i -D tailwindcss
npx tailwindcss init
```

Adding Angular Material ("custom" theme, typography, animations) ([Background Theming Guide](https://material.angular.io/guide/theming#application-background-color)):

```bash
npx ng add @angular/material
```

Adding Markdown support for documentation and blogs ([ngx-markdown Repo](https://github.com/jfcere/ngx-markdown)):

```bash
npm i ngx-markdown marked prismjs yaml
npm i -D @types/marked
```

Adding state management ([NgRx Store Guide](https://ngrx.io/guide/store)):

```bash
npx ng add @ngrx/store --minimal=false --statePath=core/store
npx ng add @ngrx/store-devtools --skip-confirmation
npx ng add @ngrx/effects --skip-confirmation
npx ng add @ngrx/entity --skip-confirmation
npx ng add @ngrx/data --skip-confirmation
```
