import five from 'johnny-five';
import Particle from 'particle-io';
import ParticleApi from 'particle-api-js';
import { ACCOUNT, DEVICE } from './constants';

const PINS = {
  yellow: 'A0',
  blue: 'A1',
  green: 'A2',
  red: 'A3',

  redButton: 'WKP',
  blueButton: 'A5',
  greenButton: 'DAC',
  yellowButton: 'A4',
};

const HIGH = 1;
const LOW = 0;

// module vars
const particleApi = new ParticleApi();

const actualBoard = new five.Board({
  io: new Particle({
    token: ACCOUNT.accessToken,
    deviceId: DEVICE.id,
  }),
});

// helpers
const setup = board => {};

const writeText = text => {
  particleApi.callFunction({
    deviceId: DEVICE.id,
    name: 'displayText',
    argument: text,
    auth: ACCOUNT.accessToken,
  });
};

const getTemp = () => {
  const getData = [
    particleApi.getVariable({ deviceId: DEVICE.id, name: 'temp', auth: ACCOUNT.accessToken }),
    particleApi.getVariable({ deviceId: DEVICE.id, name: 'humidity', auth: ACCOUNT.accessToken }),
  ];

  Promise.all(getData).then(([tempData, humData]) => {
    writeText(`\nTemp: ${tempData.body.result}\nHu: ${humData.body.result}`);
  });
};

const loop = board => {
  const button = new five.Button(PINS.redButton);
  button.on('press', () => {
    console.log('Hello');
  });

  writeText('');
};

// events
actualBoard.on('ready', function() {
  console.log('Device Ready ...');

  setup(this);
  console.log('Device Setup ...');

  loop(this);
});
