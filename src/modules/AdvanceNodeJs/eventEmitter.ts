import EventEmitter from 'events';

const eventEmitter = new EventEmitter(); // functional way

eventEmitter.on('eventEmitForBiggerFive', valueFromRequest => {
  console.log('event fired for bigger five! ..  ', valueFromRequest);
});

eventEmitter.on('eventEmitForUnderFive', valueFromRequest => {
  console.log('event fired for under five... ', valueFromRequest);
});

export default eventEmitter;
