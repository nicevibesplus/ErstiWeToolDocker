# ErstiWeTool
Tool to manage a freshmans weekend by GEOFS.

## Installation
Requires [`node  ^6.12.0`](https://nodejs.org/en/download/package-manager/) and `mysql-server ^5.7.20`.

```bash
git clone https://github.com/SpeckiJ/ErstiWeTool.git
cd ErstiWeTool
npm install
mysql -u root -p < schema.sql
echo "SET PASSWORD FOR 'ersti-we' = PASSWORD('my pass word here')" | mysql -u root -p
cp config.js.sample config.js
```

Now open `config.js` and configure the application to your likings.

At last, create login credentials for the admin panel (requires `htpasswd` from apache-utils):
```
htpasswd -c ./admin.htpasswd <username>
```

You now can start the app by running `npm start`.

There are two frontend endpoints:
- `./`:      contains the user facing forms
- `./admin`: contains an adminpanel, requires authentication

## run as service
### systemd
```bash
vi init/erstiwetool.service # change installation path
sudo cp init/erstiwetool.service /etc/systemd/system/
sudo systemctl enable erstiwetool
sudo systemctl start erstiwetool
```

### upstart
```bash
vi init/erstiwetool # change installation path
sudo cp init/erstiwetool /etc/init.d/
sudo update-rc.d erstiwetool defaults 98 02
sudo service erstiwetoolstart
```

## license
GPL-3.0
