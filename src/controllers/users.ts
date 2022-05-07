import { Request, Response } from "express";
import {typeCryptographyJwt} from "../config"

import {
  Error,
  SuccessMessage,
} from "../models/types";
import { db } from "..";
import jwt from "jsonwebtoken";
import { comparePassword, cryptPassword } from "../utils/Ecrypt";


export const usersController = {
    signIn: async (
    {body}: Request<{}, {},Record<'nickname' | 'password', string>>,
    res: Response<Error | any | SuccessMessage>
  ) => {
      const {nickname, password} = body;
      if(!nickname || !password) return res.status(404).json({error: "Invalid credentials"});
    const docRef = await (await db.collection('usersYoutubeDownloader').doc(nickname).get()).data() as Record<'nickname' | 'password', string> & {playlist: string[]} | undefined;

    if (!docRef) return res.status(404).json({error: "Invalid credentials"});
    if (!(await comparePassword(password,docRef.password))) return  res.status(404).json({error: "Invalid password"});
    return res.json({nickname,playlist: docRef.playlist ,token: jwt.sign(body, typeCryptographyJwt)});
    },
    signUp: async (
    {body}: Request<{}, {},Record<'nickname' | 'password', string>>,
    res: Response<Error | any | SuccessMessage>
  ) => {
      const {nickname, password} = body;
      if(!nickname || !password) return res.status(404).json({error: "Invalid credentials"});
    const docRef = await (await db.collection('usersYoutubeDownloader').doc(nickname).get()).data() as Record<'nickname' | 'password', string> | undefined;
    if (docRef) return res.status(404).json({error: "Nickname already used!"});
    const newUser = await (await db.collection('usersYoutubeDownloader').doc(nickname));
    await newUser.set({nickname, playlist: [] ,password: await cryptPassword(password)});

    return res.json({nickname});
    }
    // const resp = formatGeneralResp<Song>(docRef);

}