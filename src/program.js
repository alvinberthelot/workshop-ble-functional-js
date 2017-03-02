let chalk = require('chalk');
let _ = require('lodash');

let checkpointsService = require('./staticCheckpoints');
let transformCheckpoint = require('./utilities').transformCheckpoint;
let showCheckpoint = require('./utilities').showCheckpoint;


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
  run: run
};