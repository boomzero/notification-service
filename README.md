# Night Watch chatbot server

## INSTALLATION

### Requirements

- Node.js >= 8
- Dotenv files: `.env.production` and/or `.env.development`

### Instructions

```bash
$ yarn install
$ yarn start # yarn dev for development
```

## DOCUMENTATION

### Environment Variables

- `NODE_ENV` (string): "development" or "production" environment
- `PORT` (number): Port number to run the server
- `PAGE_ACCESS_TOKEN` (string):
- `VERIFY_TOKEN` (string):

### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### GET `/messenger/webhook`

#### POST `/messenger/webhook`

#### POST `/notifications/changes`

> Notify users of changes

##### Request body

- `url` (string): URL
- `changes` (object): Changes since the last crawl
  - `[cssSelector]` (any[]): Array of 2, the old value as the 1st element and the new one as the last element
