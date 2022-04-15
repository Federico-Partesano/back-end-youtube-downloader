import { Request, Response } from "express";
import { API_HOST, API_KEY } from "../enviroument";
import youtubedl from "youtube-dl-exec";
// @ts-ignore
import youtubedls from "youtube-dl";

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import fs from "fs";

import {
  BadMessage,
  Error,
  ObjectReduce,
  SuccessMessage,
} from "../models/types";
import axios, { AxiosRequestConfig } from "axios";
import { db, myStorage, socketConnection } from "..";
import { changeStatusSong, checkIfExistsFile, formatGeneralResp } from "../utils/firebase";
import { Song } from "../models/song";
import { v4 as uuidv4 } from 'uuid';

let processingFile: string[] = [];

const ffmpegInstance = createFFmpeg({ log: true });
let ffmpegLoadingPromise: undefined | Promise<void> = ffmpegInstance.load();

async function getFFmpeg() {
  if (ffmpegLoadingPromise) {
      await ffmpegLoadingPromise;
      ffmpegLoadingPromise = undefined;
  }

  return ffmpegInstance;
}


 const convertFileName = (fileName: string) => {
    const fileNameSplitted = fileName.split("-");
    const output = fileNameSplitted.splice(0, fileNameSplitted.length - 1);
    return output.join("");
    }

    const checkFileName = async(name: string, filesize: number, videoId: string) => {
      let fileCreated = false;
     const interval =  setInterval(async() => {
        if(await fs.existsSync(`${name}.part`)) {
          fileCreated = true;
          const stats = fs.statSync(`${name}.part`)
          socketConnection?.emit(`state-download-${videoId}`, {percentual: Math.floor((stats.size  / filesize) * 100) })
          socketConnection?.broadcast.emit(`state-download-${videoId}`, {percentual: Math.floor((stats.size  / filesize) * 100) })
        } else {
          if(fileCreated){
            socketConnection?.emit(`state-download-${videoId}`, {percentual:  100 })
            socketConnection?.broadcast.emit(`state-download-${videoId}`, {percentual:  100 });
            
            clearInterval(interval);
          }
        }

      }, 500)
    }
const tt = async(videoId: string, song: Song, idSong: string) => {
 try{
  const getFileName: any = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, {getFilename: true, format: "mp4"});
  const format: any = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, { getFormat: true, format: "mp4"});
  const info: any = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, { dumpJson: true ,format: "mp4"});
  const size = info.formats.find(({format: formatVideo}: {format: string}) => formatVideo === format )

  

  processingFile.push(videoId);
  size && checkFileName(getFileName, size.filesize as number, videoId);
  const video = await youtubedl(`https://www.youtube.com/watch?v=${videoId}`, { format: "mp4"});

  fs.renameSync(getFileName, `${videoId}.mp4`);
    setTimeout(async() => {
    const ffmpeg = await getFFmpeg();
      const tt = await ffmpeg.FS('writeFile', `${videoId}.mp4`, await fetchFile(`${videoId}.mp4`));
      socketConnection?.broadcast.emit(`state-status-${videoId}`, {status:  "converting" })
      socketConnection?.emit(`state-status-${videoId}`, {status:  "converting" })
      await ffmpeg.run('-i', `${videoId}.mp4`, `${idSong}.mp3`);
      await fs.promises.writeFile(`./${idSong}.mp3`, ffmpeg.FS('readFile', `${idSong}.mp3`));
      setTimeout(async() => {
          await myStorage.upload(`${idSong}.mp3`, {destination: `mp3/${videoId}.mp3`});
          fs.unlinkSync(`${idSong}.mp3`);
          fs.unlinkSync(`${videoId}.mp4`);
          changeStatusSong(videoId, song, "ok")
          processingFile = processingFile.filter((file) => file !== videoId);
          socketConnection?.emit(`state-status-${videoId}`, {status:  "ok" })
          socketConnection?.broadcast.emit(`state-status-${videoId}`, {status:  "ok" })
      }, 500)
    },500);

  }catch(e){
    socketConnection?.broadcast.emit(`state-status-${videoId}`, {status:  "error" })
    socketConnection?.emit(`state-status-${videoId}`, {status:  "error" })

    const newSong = await db.collection('songs').doc(videoId);

    await newSong.delete();
    console.log('e',e);
    
  }
}
// const [users, dispatch] = usersSelector();



const options = (videoId: string): AxiosRequestConfig => ({
  method: "GET",
  url: "https://youtube-mp36.p.rapidapi.com/dl",
  params: { id: videoId },
  headers: {
    "X-RapidAPI-Host": API_HOST,
    "X-RapidAPI-Key": API_KEY,
  },
});
export const youtubeController = {
  convertMp3: async (
    { params: { videoId }, body: {song} }: Request<{ videoId: string }, {}, {song: Song}>,
    res: Response<Error | any | SuccessMessage>
  ) => {
    const idSong = uuidv4();

try {
  
  if(processingFile.some((file) => file === videoId)){
    return res.json({...song, status: "file in processing!"});


  } else if(await checkIfExistsFile(`${videoId}.mp3`)) {
  console.log('exist');
    return res.json({...song, status: "ok"})

 } else {
   console.log('song', song);
   
   tt(videoId, song, idSong);
 }
  await changeStatusSong(videoId, song, "processing")

  return res.json({...song, status: "processing"});

} catch(e) {
  return res.json({error: e})
}

  }, 

  getSongs: async (
    req: Request,
    res: Response<Error | any | SuccessMessage>
  ) => {
    const docRef = await db.collection('songs').get();
    const resp = formatGeneralResp<Song>(docRef);

    return res.json(resp);


  }
}