# Refugee Integration Loans (RIL)

Refugee Integration Loans (RIL) application, is used by the public to apply for or accept a refugee integration loan.

## Description

- The service allow the user to provide details such as income, expenses, and personal information.
- The user is able to review all the answers provided to confirm their details prior to submission.
- Once the application is submitted, automated notifications are sent to the business and the user.

## Getting Started

- [Install & run locally](#install--run-the-application-locally)
- [Install & run locally with Docker Compose](#install--run-the-application-locally-with-docker-compose)
- [Install & run locally with VS Code Devcontainers](#install--run-the-application-locally-with-vs-code-dev-containers)
- [NPM Local Development Setup](#npm-local-development-setup)

### Dependencies

- This form is built using the [HOF framework](https://github.com/UKHomeOfficeForms/hof)
- [Gov.uk Notify](https://www.notifications.service.gov.uk) is used to send notification emails

## Install & Run the Application locally

### Prerequisites

- [Node.js](https://nodejs.org/en/) - v.20.19.0
- [Redis server](http://redis.io/download) running on default port 6379

### Setup

1. Create a `.env` file in the root directory and populate it with all the required environment variables for the project.
2. Install dependencies using the command `yarn`.
3. Start the service in development mode using `yarn run start:dev`.

## Install & Run the Application locally with Docker Compose

You can containerise the application using [Docker](https://www.docker.com). The `.devcontainer` directory includes a `docker-compose.dev.yml` file for orchestrating multi-container application.

### Prerequisites

- [Docker](https://www.docker.com)

### Setup

By following these steps, you should be able to install and run your application using a Docker Compose. This provides a consistent development environment across different machines and ensures that all required dependencies are available.

1. Make sure you have Docker installed and running on your machine. Docker is needed to create and manage your containers.

2. To configure your dev environment, copy `/.devcontainer/devcontainer.env.sample` to `devcontainer.env` in the same directory and fill in the necessary values. This ensures your development container is set up with the required environment variables.

3. Open a terminal, navigate to the project directory and run: `docker compose -f .devcontainer/docker-compose.dev.yml up -d`

4. Once the containers are built and started, you can go inside the app container: `docker exec -it devcontainer-hof-ril-app-1 sh` (note: Docker containers may be named differently)

5. Run the necessary commands to install dependencies `yarn` and `yarn start:dev` to start your application.

## Install & Run the Application locally with VS Code Dev Containers

Alternatively, if you are using [Visual Studio Code](https://code.visualstudio.com/) (VS Code), you can run the application with a [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers).

The `.devcontainer` folder contains the necessary configuration files for the devcontainer.

### Prerequisites

- [Docker](https://www.docker.com)
- [VS Code Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extention

### Setup

By following these steps, you should be able to run your application using a devcontainer in VS Code. The Dev Containers extension lets you use a Docker container as a full-featured development environment. This provides a consistent development environment across different machines and ensures that all required dependencies are available. A `devcontainer.json` file in this project tells VS Code how to access (or create) a development container with a well-defined tool and runtime stack.

1. Make sure you have Docker installed and running on your machine. Docker is needed to create and manage your containers.

2. Install the [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extention in VS Code. This extension allows you to develop inside a containerised environment.

3. To configure your dev environment, copy `/.devcontainer/devcontainer.env.sample` to `devcontainer.env` in the same directory and fill in the necessary values. This ensures your development container is set up with the required environment variables.

4. Run the `Dev Containers: Open Folder in Container...` command from the Command Palette (F1) or click on the Remote Indicator (≶) in the status bar. This command will build and start the devcontainer based on the configuration files in the `.devcontainer` folder.

5. Once the devcontainer is built and started, you will be inside the containerised environment. You can now work on your project as if you were working locally, but with all the necessary dependencies and tools installed within the container.

6. To start the application, open a terminal within VS Code by going to `View -> Terminal` or by pressing `Ctrl+backtick` (`Cmd+backtick` on macOS). In the terminal, navigate to the project directory if you're not already there.

7. Run the necessary commands to install dependencies `yarn` and `yarn start:dev` to start your application.


## NPM Local Development Setup

```
nvm install 20.19.0
nvm use 20.19.0
yarn
brew install redis
brew services start redis
yarn start #OR yarn run start:dev
```
To use the mock notification service locally, set the NOTIFY_KEY environment variable to USE_MOCK:
```export NOTIFY_KEY=USE_MOCK```

To set the RIL logging level, set the LOG_LEVEL environment variable to either error, warn, or info:
```export LOG_LEVEL="info"```

To set the HOF logging level, set the LOG_LEVEL environment variable to either error, warn, or info:
```export LOG_LEVEL="warn"```

or for redis
```
docker run --name some-redis -d redis
```

### Docker
```
yarn && docker-compose build && docker-compose up
```

Then navigate to <http://localhost:8080/apply>
or to <http://localhost:8080/accept>

### Kubenetes
Defaults in ACP are:

            Requests - cpu: 50m, memory: 200Mi
            Limits - cpu: 400m, memory: 400Mi

### Acceptance Testing
You can run the following to run all acceptance tests. These use the `@feature` tag by default:
```
yarn run test:acceptance
```
You can also run this in browser mode slowed down for visibility when debugging:
```
yarn run test:acceptance_browser
```
Additionally, you can place your own tag (@<name>), e.g. @test, above a Feature or Scenario section to run just that feature or scenario:
```
  @test
  Scenario: Simple application - Mobile Only with new address
    Given I start the 'apply' application journey
```
And then you can run your tests using the `TAGS` environmental variable to use it:
```
TAGS=@test yarn run test:acceptance
```

### Pa11y CI Accessibility test runner

Pa11y CI is a CI-centric accessibility test runner, built using [Pa11y](https://github.com/pa11y/pa11y).

Pa11y CI runs accessibility tests against multiple URLs and reports on any issues. This used during automated testing of the application and can act as a gatekeeper to stop common WCAG a11y issues from making it to live.

```bash
yarn run test:_accessibility          // requires app to be running
```
### BRP Number Validations
BRP Numbers should contain 2 letters, followed by either an 'X' or a digit, and then 6 digits:

- for example, ZUX123456 or ZU1234567

### Trivy image testing

When the Drone pipeline runs, Trivy will check if the Docker image has any security vulnerabilities. Anything raised can be downloaded via the Drone UI as a manifest detailing the dependencies needing investigation and either needs whitelisting or updating.   

Anything whitelisted should be added to this git repo where a check is carried out against it in Drone:
https://github.com/UKHomeOfficeForms/hof-services-config/infrastructure/trivy/.trivyignore.yaml


### Updating vulnerable dependencies
#### Docker Image APK
This should be as simple as extending what apk packages to upgrade to. The registry is already being updated in the Dockerfile, so if anything is raised by Trivy you just need to add the dependency to the following line in it:
```
apk add --upgrade gnutls <dependency1_to_update> <dependency2_to_update> etc etc...
```

#### NPM
One can use npm to update individual dependencies if they have been flagged due to security updates. These can be done like this:
```
yarn upgrade express@"<15.0.0"
```
In this example we have updated just the `express` npm package to the latest version before 15.0.0. So for instance, if it was set to `14.16.0` prior, this might update to the latest minor/patch fix version `14.17.1`. This is a safe way to get the latest minor/patch version before the next major/minor respectively to mitigate bringing in a breaking change.
Here is an example for updating a dev_dependency bringing in the latest patch fix for version `8.2.x`
```
yarn upgrade mocha@"<8.3.0"
```
