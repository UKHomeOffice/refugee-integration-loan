## An example implementation of the Refugee Integration Loans Application using HOF

## Setup

### NPM Local Development Setup
```
nvm install 14.12.0
nvm use 14.12.0
npm i
brew install redis
brew services start redis
npm start #OR npm run start:dev
```

### Docker
```
npm i && docker-compose build && docker-compose up
```

Then navigate to <http://localhost:8080/apply>
or to <http://localhost:8080/accept>
