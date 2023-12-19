#!/bin/bash

set -e

DB_URI="${DB_URI:-pg://}"
RETRIES=${RETRIES:-15}

# SET DB_PATCH to 1 when deploying to an existing database that has changes in its schema that are non backwards compatible.
# only need to do this once
DB_PATCH=${DB_PATCH:-0}

until psql $DB_URI -c "select 1" > /dev/null 2>&1 || [ $RETRIES -eq 0 ]; do
  echo "Waiting for postgres server, $((RETRIES--)) remaining attempts..."
  sleep 5s
done

if [ $RETRIES -eq 0 ]
then
	echo "Unable to connect to postgres server"
	echo "Attempting to create $PGDATABASE db"
	# Note that the container needs $PGHOST $PGUSER etc set here because of this command
	# Fallback is to manually create a database if you continue having issues here in your environment
	createdb $PGDATABASE && echo "$PGDATABASE created!" || (echo  "Unable to create $PGDATABASE -- exiting" && exit 1)
fi

if [ "$DB_PATCH" = '1' ]; then
	echo "Running DB_PATCH hash script fix to existing sqitch deployment"
	echo "This only needs to be ran once"
	psql $DB_URI -a -f ./utils/hash_changes.sql
fi

sqitch status "db:${DB_URI}" || true
sqitch ${SQITCH_DEPLOY:-deploy} "db:${DB_URI}"

if [ "${SQITCH_VERIFY}" ]; then
	sqitch ${SQITCH_VERIFY} "db:${DB_URI}"
fi

if [ "$RESET_DB" = '1' ]; then
	echo "Resetting Database. Using blank data"
	psql $DB_URI -a -f ./blank_data/reset.sql
fi

sleep 5s
echo "Reloading PostgresT schema cache using Notify"
psql $DB_URI -a -f ./notify/reload_postgrest_schema.sql