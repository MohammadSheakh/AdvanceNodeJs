const { workerData, parentPort } = require('worker_threads');

let counter = 0;
// i < 20000000000
for (let i = 0; i < 2000 / workerData.thread_count; i++) {
  counter++;
}

parentPort.postMessage({ counter });

/**
 * every thing is same as the worker.ts file
 *
 * now we are receiving some parameter from the main thread ..  which is workerData
 *
 */
