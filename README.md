# ErstiWeTool
Tool to manage a freshmans weekend by GEOFS.

## Installation
Requires [`node ^8.x`](https://nodejs.org/en/download/package-manager/), [`yarn`](https://yarnpkg.com/en/docs/install) and `mysql-server ^5.7`.

```bash
git clone https://github.com/nicevibesplus/ErstiWeToolDocker.git
cd ErstiWeToolDocker
yarn install
cp config.js.sample config.js
```
Now customize `config.js`.

Continue with:

```bash
htpasswd -c ./admin.htpasswd admin
docker compose up --build -d
sleep 30
docker exec mysql bash -c 'mysql --default-character-set=utf8 --password=supersecretstuff < schema.sql'
```

## anonymize PII
Run `bin/anonymizeUsers [year] --yes-for-real` to replace user PII (first name, last name, email, phone) with placeholders. Birthdate is truncated to months.

## license
GPL-3.0
