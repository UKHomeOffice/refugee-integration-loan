## An example implementation of the Refugee Integration Loans Application using HOF

## Setup

### NPM Local Development Setup
```
nvm install 14.11.0
nvm use 14.11.0
npm i
brew install redis
brew services start redis
npm start #OR npm run start:dev
```
To use the mock notification service locally, set the NOTIFY_KEY environment variable to USE-MOCK:
```export NOTIFY_KEY=USE-MOCK```

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
npm i && docker-compose build && docker-compose up
```

Then navigate to <http://localhost:8080/apply>
or to <http://localhost:8080/accept>

### Kubenetes
Defaults in ACP are:

            Requests - cpu: 50m, memory: 200Mi
            Limits - cpu: 400m, memory: 400Mi

### Pa11y CI Accessibility test runner

Pa11y CI is a CI-centric accessibility test runner, built using [Pa11y](https://github.com/pa11y/pa11y).

Pa11y CI runs accessibility tests against multiple URLs and reports on any issues. This used during automated testing of the application and can act as a gatekeeper to stop common WCAG a11y issues from making it to live.

```bash
npm run test:_accessibility          // requires app to be running
```

### Anchore/Snyk image testing

When the Drone pipeline runs, Anchore will check if the Docker image has any security vulnerabilities. Anything raised can be downloaded via the Drone UI as a manifest detailing the dependencies needing investigation and either needs whitelisting or updating.   

Anything whitelisted should be added to this git repo where a check is carried out against it in Drone:
https://github.com/UKHomeOfficeForms/hof-cve-exceptions

For anything needing fixing, you can use Snyk on your local machine to debug vulnerability issues. They tend to align with what Anchore has raised and are more detailed in how to fix issues.
Just `export SNYK_TOKEN=<your_token>` in your `~/.bashrc` or bash_profile or before executing the following command:
```
npm run test:snyk
```
This will run Snyk tests just against the code base. You can also run `snyk wizard` to assist with repo level fixes. This will also generate/update the `.snyk` policy which others in the project can reuse for focusing on new errors and ignoring previously audited issues.

However, the following creates a test Docker image from the repo and run Snyk tests against the Docker image dependencies. This should help you debug any issues found with Anchore APK package issues as opposed to npm modules which might have security flaws:
```
./snyk_check.sh
```
