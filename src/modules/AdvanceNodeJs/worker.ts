const { parentPort } = require('worker_threads');

let counter = 0;
for (let i = 0; i < 20000000000; i++) {
  counter++;
}

parentPort.postMessage({ counter });
/**
 * postMessage() is the way to communicate with the main thread.
 * from worker
 */

/**
 *
 * lets find out how many core we have ...
 *
 * > sysctl -n hw.ncpu
 * > echo %NUMBER_OF_PROCESSORS% in terminal for windows ..
 */
