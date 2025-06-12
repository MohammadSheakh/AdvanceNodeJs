import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import ytdl from "@distube/ytdl-core";
import { stream, video_info } from "play-dl";
import ffmpeg from "fluent-ffmpeg";
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

  playYouTubeAudio = async (req: Request, res: Response): Promise<void> => {
  try {

    // Support both GET and POST requests
    const params = req.method === 'GET' ? req.query : req.body;
    const { url, hour = 0, minute = 0, second = 0 } = params;

    // const { url, hour = 0, minute = 0, second = 0 } = req.body;
    
    // Validate URL presence
    if (!url) {
      res.status(400).json({
        success: false,
        message: "URL is required.",
      });
      return;
    }

    console.log("Received URL:", url);

    // Basic URL validation for YouTube
    const isValidYouTubeUrl = (url: string): boolean => {
      try {
        const urlObj = new URL(url);
        return (
          (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') && 
          urlObj.pathname === '/watch' && 
          urlObj.searchParams.has('v')
        ) || (
          (urlObj.hostname === 'youtu.be') &&
          urlObj.pathname.length > 1
        );
      } catch {
        return false;
      }
    };

    if (!isValidYouTubeUrl(url)) {
      res.status(400).json({
        success: false,
        message: "Invalid YouTube URL format.",
      });
      return;
    }

    // Validate time parameters
    const hourNum = Number(hour);
    const minuteNum = Number(minute);
    const secondNum = Number(second);
    
    if (isNaN(hourNum) || isNaN(minuteNum) || isNaN(secondNum) || 
        hourNum < 0 || minuteNum < 0 || secondNum < 0) {
      res.status(400).json({
        success: false,
        message: "Invalid time parameters.",
      });
      return;
    }

    const startSeconds = hourNum * 3600 + minuteNum * 60 + secondNum;
    console.log("Start time:", startSeconds, "seconds");

    // Try to get video info (optional for duration check)
    let videoDuration: number | null = null;
    try {
      const info = await ytdl.getInfo(url);
      videoDuration = parseInt(info.videoDetails.lengthSeconds);
      console.log("Video duration:", videoDuration, "seconds");
      
      if (startSeconds >= videoDuration) {
        res.status(400).json({
          success: false,
          message: `Start time (${startSeconds}s) exceeds video duration (${videoDuration}s).`,
        });
        return;
      }
    } catch (infoError) {
      console.warn("Could not get video info, proceeding without duration check:", infoError.message);
    }

    // Check if response is already sent
    if (res.headersSent) {
      return;
    }

    // Set headers for streaming audio
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Transfer-Encoding", "chunked");
    
    console.log("Creating audio stream...");
    
    // Create audio stream with better options
    const audioStream = ytdl(url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25, // 32MB buffer
    });

    // Handle stream errors
    audioStream.on('error', (streamError) => {
      console.error("Audio stream error:", streamError);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Failed to create audio stream.",
        });
      }
    });

    // Handle client disconnect
    const cleanup = () => {
      console.log("Cleaning up stream...");
      if (audioStream && !audioStream.destroyed) {
        audioStream.destroy();
      }
    };

    req.on("close", cleanup);
    req.on("aborted", cleanup);

    console.log("Starting FFmpeg processing...");

    // Stream with ffmpeg
    const ffmpegCommand = ffmpeg(audioStream)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .audioChannels(2)
      .audioFrequency(44100)
      .format("mp3")
      .setStartTime(startSeconds)
      .on("start", (commandLine) => {
        console.log("FFmpeg started with command:", commandLine);
      })
      .on("progress", (progress) => {
        console.log("Processing progress:", JSON.stringify(progress.timemark)," ✅");
        // progress.percent
        /****
         * 
         * (parameter) progress: {
    frames: number;
    currentFps: number;
    currentKbps: number;
    targetSize: number;
    timemark: string;
    percent?: number | undefined;
}
         * 
         */
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        cleanup();
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "Error processing audio stream.",
          });
        }
      })
      .on("end", () => {
        console.log("Audio stream processing completed successfully");
      });

    // Handle response finish/close events
    res.on('finish', () => {
      console.log("Response finished");
      cleanup();
    });

    res.on('close', () => {
      console.log("Response closed");
      cleanup();
    });

    // Pipe to response
    ffmpegCommand.pipe(res, { end: true });

  } catch (error) {
    console.error("playYouTubeAudio Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error: " + error.message,
      });
    }
  }
};


  // add more methods here if needed or override the existing ones
}
