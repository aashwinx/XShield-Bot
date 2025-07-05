# Code Citations

## License: unknown
https://github.com/glhrmv/motif/tree/ed8e520a6ca7844b42db9980295f3e33fe1db287/src/index.js

```
('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready
```


## License: unknown
https://github.com/SerketCity/Vriska8ot/tree/4289e90402c25d058198908b9337bb33633f0bd0/deploy-commands.js

```
'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
```


## License: unknown
https://github.com/Sedatyf/Cowboy_BeBOT/tree/73d111b079b8955d7cf2cc46ae74fe1f9335b7d9/index.js

```
).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name,
```


## License: unknown
https://github.com/WouterLindeboom/Colours/tree/cc1cbe60237aa67188f330c6dc660e2b5364070c/index.js

```
.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once(
```


## License: unknown
https://github.com/AlexFGeeR/armaeyebot-db-vers/tree/1517f6de84a4aad8aef039258a74c86ffde7abcf/index.js

```
of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once('ready', async () => {
  console.log(
```

