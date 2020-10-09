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