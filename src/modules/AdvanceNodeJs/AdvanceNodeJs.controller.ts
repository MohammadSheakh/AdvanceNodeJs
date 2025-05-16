import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { GenericController } from '../__Generic/generic.controller';
import { AdvanceNodeJs } from './AdvanceNodeJs.model';
import { IAdvanceNodeJs } from './AdvanceNodeJs.interface';
import { AdvanceNodeJsService } from './AdvanceNodeJs.service';
import catchAsync from '../../shared/catchAsync';
import sendResponse from '../../shared/sendResponse';

import path from 'path';

import { Worker } from 'worker_threads';
import eventEmitter from './eventEmitter';
//import EventEmitter from 'events';

//const eventEmitter = new EventEmitter(); // functional way

// let conversationParticipantsService = new ConversationParticipentsService();
// let messageService = new MessagerService();

const THREAD_COUNT = 4;

function createWorker(res: Response) {
  return new Promise((resolve, reject) => {
    // create a new worker
    const worker = new Worker(path.resolve(__dirname, 'four-workers.ts'), {
      // we need to send the data to ther worker ..
      workerData: { thread_count: THREAD_COUNT },
    });

    // we are gonna create two event ..

    worker.on('message', (data: any) => {
      resolve(data);
    });

    worker.on('error', (error: any) => {
      reject(error);
    });
  });
}

export class AdvanceNodeJsController extends GenericController<
  typeof AdvanceNodeJs,
  IAdvanceNodeJs
> {
  AdvanceNodeJsService = new AdvanceNodeJsService();

  constructor() {
    super(new AdvanceNodeJsService(), 'AdvanceNodeJs');
  }

  blocking = catchAsync(async (req: Request, res: Response) => {
    console.log('blocking');
    /*
      let counter = 0;
      for (let i = 0; i < 20000000000; i++) {
        counter++;
      }
    */
    /**
     * we will do this heavy computation in worker thread
     * and we will use the parent port to send the result back
     */

    //const worker = new Worker('./worker.ts')

    const worker = new Worker(path.resolve(__dirname, 'worker.ts'));

    // we can listen to the message event on the worker // listen to some specific event

    worker.on('message', (data: any) => {
      sendResponse(res, {
        code: StatusCodes.OK,
        message: `this is blocking and result is ${data.counter}`,
        success: false,
      });
    });

    worker.on('error', (error: any) => {
      sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: `this is blocking and an error occured ${error}`,
        success: false,
      });
    });

    // sendResponse(res, {
    //   code: StatusCodes.BAD_REQUEST,
    //   message: `this is blocking and result is ${counter}`,
    //   success: false,
    // });
  });

  blocking_four_workers = catchAsync(async (req: Request, res: Response) => {
    // as we declare promise in createWorker function ..
    // so we need to take care of those
    const workerPromises = [];
    for (let i = 0; i < THREAD_COUNT; i++) {
      workerPromises.push(createWorker(res));
    }

    const thread_results = await Promise.all(workerPromises);

    const total = thread_results.reduce((acc: any, result: any) => {
      return acc + result.counter;
    }, 0);

    sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: `this is blocking_four-workers ${total} :: }`,
      success: false,
    });
  });

  nonBlocking = catchAsync(async (req: Request, res: Response) => {
    console.log('this is non-blocking');
    sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: `this is non-blocking which worker :: ${process.pid}`,
      success: false,
    });
  });

  eventEmitter = catchAsync(async (req: Request, res: Response) => {
    const valueFromRequest = req.body.value;

    console.log('this is eventEmitter');
    const value = req.body.value;

    if (value > 5) {
      eventEmitter.emit('eventEmitForBiggerFive', value);
    } else {
      eventEmitter.emit('eventEmitForUnderFive', value);
      // eventEmitter.emit('error', new Error('value is less than 5'));
    }

    sendResponse(res, {
      code: StatusCodes.OK,
      message: `event emitter :: ${process.pid}`,
      success: true,
    });
  });

  // add more methods here if needed or override the existing ones
}
