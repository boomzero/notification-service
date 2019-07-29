# Night Watch notification service

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
- `FB_PAGE_ACCESS_TOKEN` (string): Token to access Facebook page
- `FB_VERIFY_TOKEN` (string): Token to connect notificaion service to Facebook webhook

### Routes

#### GET `/`

> Just for testing

##### Response body

- `iam`: `"/"`

#### GET `/messenger/webhook`

> Facebook webhook to authenticate the notification service

#### POST `/messenger/webhook`

> Get the Facebook user ID

#### POST `/notifications/changes`

> Notify users of changes

##### Request body

- `url` (string): URL
- `changes` (object): Changes since the last crawl
  - `[cssSelector]` (any[]): Array of 2, the old value as the 1st element and the new one as the last element
