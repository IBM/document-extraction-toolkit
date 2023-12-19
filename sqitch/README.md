# Sqitch - Database Change Management

For more information on Sqitch and a tutorial - https://sqitch.org/docs/manual/sqitchtutorial/

## Installation

```sh
brew tap sqitchers/sqitch
brew install sqitch --with-postgres-support
```

## Configuration

```sh
sqitch config --user user.name 'Bob Fang'
sqitch config --user user.email 'sbfang@us.ibm.com'
```

## Adding Tables

sqitch add 11.prompts --requires 10.procrastinate_schema -n 'add procrastinate roles'