# Document Extraction Toolkit UI

## Developing Locally

```sh
docker compose -f docker-compose.yaml -f docker-compose.minio.yaml up
```

When you run docker compose, you are standing up a local instance of postgres and the sqitch job will apply all schema patches to it. After that, the postgresT service will be available (database to REST translation middleware). The webclient's API server hosts the static client build and proxies UI requests to postgres. Minio provides s3 like storage for documents.

```sh
npm run develop:server
```

```sh
npm run develop:client
```

Visit http://localhost:3003

