let chalk = require('chalk');
let noble = require('noble');

let transformCheckpoint = require('./utilities').transformCheckpoint;
let showCheckpoint = require('./utilities').showCheckpoint;


let run = () => {

  noble.on('stateChange', state => {
    if (state === 'poweredOn') {
      noble.startScanning([], true);
    } else {
      noble.stopScanning();
    }
  });

  noble.on('scanStart', () => {
    console.log(chalk.dim('Scan started...','\n'));
  });

  noble.on('scanStop', () => {
    console.log(chalk.dim('Scan stopped...','\n'));
  });

  noble.on('discover', peripheral => {
    // console.log('BLE DEVICE', peripheral);
    showCheckpoint(transformCheckpoint(peripheral));
  });

};

module.exports = {
  run: run
};