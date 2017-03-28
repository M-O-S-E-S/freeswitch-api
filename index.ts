
import { FreeswitchClientHandler, FreeswitchNodeHandler } from './lib/FreeswitchHandler';
import { Freeswitch } from './lib/Freeswitch';

import * as express from 'express';
import * as bodyParser from 'body-parser';

let fs_ip: string;
if (process.env.FREESWITCH_IP)
  fs_ip = process.env.FREESWITCH_IP;
else
  throw new Error('FREESWITCH_IP must be set on the environment to the client-visible freeswitch IP address');

console.log('Freeswitch portal starting for Freeswitch instance at ' + fs_ip);

let freeswitch = new Freeswitch(fs_ip);

let client_app = express();

client_app.use(bodyParser.json({ limit: '1gb' }));       // to support JSON-encoded bodies
client_app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '1gb'
}));

client_app.use('/fsapi', FreeswitchClientHandler(freeswitch));

client_app.listen(3000, function () {
  console.log('Freeswitch client portal listening for clients on port 3000!');
});


let region_app = express();

region_app.use(bodyParser.json({ limit: '1gb' }));       // to support JSON-encoded bodies
region_app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '1gb'
}));

region_app.use('/fsapi', FreeswitchNodeHandler(freeswitch));

region_app.listen(3001, function () {
  console.log('Freeswitch server/region portal listening for clients on port 3001!');
});
