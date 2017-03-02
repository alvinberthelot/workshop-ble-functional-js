let chalk = require('chalk');
let _ = require('lodash');

let checkpointsService = require('./staticCheckpoints');


let calculateDistanceWithRssi = rssi => {
  var txPower = -59; // hard coded power value. Usually ranges between -59 to -65
  if (rssi == 0) {
    return -1.0;
  }
  var ratio = rssi * 1.0 / txPower;
  if (ratio < 1.0) {
    return Math.pow(ratio,10);
  } else {
    var distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
    return distance;
  }
};

let transformCheckpoint = (checkpoint) => {
  if (checkpoint) {
    // Init new reference
    var checkpointReturn = {};
    // Get back essential properties
    checkpointReturn.serviceData = checkpoint.advertisement.serviceData;
    checkpointReturn.serviceUuids = checkpoint.advertisement.serviceUuids;
    checkpointReturn.uuid = checkpoint.uuid;
    checkpointReturn.connectable = checkpoint.connectable;
    checkpointReturn.state = checkpoint.state;
    // Transform data about distance
    checkpointReturn.distance = calculateDistanceWithRssi(checkpoint.rssi);
    // Return new reference
    return checkpointReturn;
  } else {
    return false;
  }
};

let showCheckpoint = (checkpoint, index) => {
  console.log(chalk.green('CHECKPOINT'), chalk.yellow(index + 1));
  _.forOwn(checkpoint, showCheckpointProperty);
  console.log('\n');
};

let showCheckpointProperty = (value, key) => {
  console.log(chalk.cyan(key.toUpperCase()), value);
}

let run = () => {

  _.chain(checkpointsService.getCheckpoints())
    .map(transformCheckpoint)
    .sortBy(checkpoint => checkpoint.distance)
    .map(checkpoint => {
      let checkpointReturned = _.clone(checkpoint);
      checkpointReturned.distance = _.round(checkpoint.distance, 2);
      return checkpointReturned;
    })
    .map(checkpoint => {
      let checkpointMS = _.clone(checkpoint);
      if (checkpoint.distance >= 1) {
        checkpointMS.distance += ' m';
      } else {
        checkpointMS.distance *= 100;
        checkpointMS.distance += ' cm';
      }
      return checkpointMS;
    })
    .forEach(showCheckpoint)
    .value();
};

module.exports = {
  transformCheckpoint: transformCheckpoint,
  showCheckpoint: showCheckpoint,
  run: run
};