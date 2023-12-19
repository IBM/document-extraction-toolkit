FROM sqitch/sqitch:v1.4.0

WORKDIR /generalpurpose

COPY . .

    # Required ENV variables
    #   # if you want to connect to cloud postgres you'll need to add ?sslmode=require to DB_URI below
    #   #- DB_URI=postgres://${SUPER_USER}:${SUPER_USER_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
    #   # remember! sqitch logins with super user first using URI
    #   - SQITCH_TARGET=${DB_URI-postgres://superuser:superuserpass@db:5432/det}
    #   - SQITCH_DEPLOY=deploy --verify
    #   # env vars useful for our sql scripts
    #   # remember! sqitch logins with super user, here we need the regular user details
    #   - DB_USER=${DB_USER-auth}
    #   - DB_PASS=${DB_PASS-authpass}
    #   - DB_ANON_ROLE=${DB_ANON_ROLE-anonymous}
    #   - DB_READER_ROLE=${DB_READER_ROLE-reader}
    #   - DB_WRITER_ROLE=${DB_WRITER_ROLE-writer}
    #   - DB_MANAGER_ROLE=${DB_MANAGER_ROLE-manager}
    #   - RESET_DB=${RESET_DB}
    #   - DEMO_DB=${DEMO_DB}
    #   - PGDATABASE=${DB_NAME-det}
    #   - PGUSER=${SUPER_USER-superuser}
    #   - PGHOST=${DB_HOST-db}
    #   - PGPORT=${DB_PORT-5432}


ENV SQITCH_DEPLOY=deploy SQITCH_VERIFY=verify
ENTRYPOINT [ "./run.sh" ]