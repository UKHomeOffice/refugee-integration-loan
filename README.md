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

To run against URL's listed in the `.pa11yci.json` configuration file.   

```bash
npm run test:_accessibility          // requires app to be running
```
