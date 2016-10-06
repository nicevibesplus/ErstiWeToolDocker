# ErstiWeTool
Prototype of ErstiWeTool in nodejs express framework.

## Installation
Requires `node >= 4.x` and `mysql-server`.

```bash
git clone https://github.com/SpeckiJ/ErstiWeTool.git
cd ErstiWeTool
npm install
mysql -u root -p < schema.sql
echo "SET PASSWORD FOR 'ersti-we' = PASSWORD('my pass word here')" | mysql -u root -p
cp config.sample.js config.js
```

Now open `config.js` and configure the application to your likings

You now can start the app by running `npm start`.

## TODO
- Adminpanel frontend `admin.pug`
- landingpage `#info` styling as alert/toast/..
- improve landingpage styling
- query für nachrücker auflistung
- registration disclaimers:
    - du bist 18 jahre alt (wird vor fahrtantritt geprüft!)
    - auf dem wochenende wird gefilmt!
- improve delayed email sending times
- systemd script for autostart
