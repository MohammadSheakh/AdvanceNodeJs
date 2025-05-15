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

// let conversationParticipantsService = new ConversationParticipentsService();
// let messageService = new MessagerService();

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

    const worker = new Worker(path.resolve(__dirname, 'worker.ts'))

    // we can listen to the message event on the worker // listen to some specific event 

    worker.on('message', (data:any) => {
      sendResponse(res, {
        code: StatusCodes.OK,
        message: `this is blocking and result is ${data.counter}`,
        success: false,
      });
    });

    worker.on('error', (error:any) => {
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
  nonBlocking = catchAsync(async (req: Request, res: Response) => {
    console.log('this is non-blocking');
    sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: `this is non-blocking`,
      success: false,
    });
  });

  // add more methods here if needed or override the existing ones
}
