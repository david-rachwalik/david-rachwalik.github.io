---
title: 'Angular in a Dev Container'
author: 'David Rachwalik'
created: '2024-11-24'
modified: '2024-11-25'
active: true
tags:
  - Dev Container
  - VS Code
  - Angular
  - Markdown
---

<!-- # Angular in a Dev Container -->

<sup><sub><i>Technologies Used:</i>&nbsp; Node.js v20, Angular v18</sub></sup>

Using containers is a great way to have a reliable, easily reproducable environment for development.&nbsp; Lately as I've been getting more into using Docker containers for programming, I've been really leaning into Dev Containers for all my development purposes.&nbsp; Using a framework (e.g. Angular, Vue, React) from a Dev Container in VS Code involves leveraging the **Dev Containers** extension and a NodeJS based container image (_mcr.microsoft.com/devcontainers/javascript-node:20_) to create a consistent and isolated development environment.&nbsp; Here's a general overview of the process:

## Step 1: Set Up Your Development Environment

### Pre-requisites

- Install **Docker** on your machine
- Install **Visual Studio Code**
- Install the **Dev Containers** extension in VS Code

## Step 2: Create a Dev Container Configuration

- Create a folder named `.devcontainer` inside your project directory.
- Add the following files in the `.devcontainer` folder:
  - `devcontainer.json`: Configuration file for your container environment
  - `Dockerfile` (optional, use when customizations are required)

Example `devcontainer.json`:

```json
{
  "name": "NodeJS",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {
    "ghcr.io/devcontainers/features/node:1": {
      "version": "20"
    }
  },
  "postCreateCommand": "npm i -g @angular/cli@18",
  "forwardPorts": [4200]
}
```

- Key Configurations
  - **image:** Specifies the base Node.js 20 container image
  - **features:** Adds Node.js environment enhancements
  - **postCreateCommand:** Installs Angular CLI globally in the container
  - **forwardPorts:** Maps port 4200 (Angular dev server)

## Step 3: Open the Dev Container

- Open your project in VS Code
- From the **Command Palette** (`Ctrl+Shift+P`), select **Dev Containers: Reopen in Container**
- VS Code will build the container based on your `devcontainer.json` and attach to it

## Step 4: Initialize Your Angular Project

If you don't have an existing Angular project, you can create one inside the container:

```bash
ng new <app-name>
cd <app-name>
```

Then, use `npm install` to install dependencies as needed.

## Step 5: Run the Angular Application

Script to start Angular (for development):

```bash
ng serve --host 0.0.0.0 --port 4200 --poll 2000
```

Access the application via [localhost:4200](http://localhost:4200) from your browser.&nbsp; Note that `--host 0.0.0.0` is what allows external access from the container to your local machine's browser.&nbsp; This is expected for a containerized development environment, and the security warning it raises can be ignored.

_Enable Polling for File Watching:_&nbsp; Docker containers sometimes have issues detecting file changes on mounted volumes, especially when running on Windows or macOS hosts.&nbsp; Angular’s CLI can use a polling mechanism to resolve this issue.&nbsp; Add the `--poll` flag with a suitable interval (e.g., 2000ms).

## Step 6: Use Angular CLI and Debugging

- Use Angular CLI commands inside the container for development, like:

  ```bash
  ng generate component <component-name>
  ng build --prod
  ```

- For debugging:
  - Add a launch configuration in `.vscode/launch.json` to attach the debugger to the running Angular app.

## Step 7: Persist Changes and Workflow

Your changes in the container will be synced with your local file system (via the mounted workspace).
Use Git for version control as usual, with no need to install Git separately—it runs inside the container.

## Conclusion: Benefits of Using Angular with Dev Containers

1. **Consistency:** Same dependencies and configurations for all developers.
2. **Isolation:** No conflicts with host machine's global dependencies.
3. **Portability:** Easily share the `devcontainer.json` with teammates.
4. **Streamlined Setup:** Quick onboarding for new projects.

This setup integrates seamlessly with Angular, ensuring a smooth development experience within a containerized environment.
