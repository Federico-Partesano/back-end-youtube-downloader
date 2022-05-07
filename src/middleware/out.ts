import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "..";
import { typeCryptographyJwt } from "../config";



export const auth = async(
  { headers: { authorization, nickname } }: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if(authorization && typeof authorization === "string"){
    res.locals.token = jwt.verify(authorization.split(' ')[1] , typeCryptographyJwt);
    const docRef = await (await db.collection('usersYoutubeDownloader').doc(nickname as string).get()).data() as Record<'nickname' | 'password', string> & {playlist: string[]} | undefined;
      if(!docRef) return res.status(403).json({error: "Invalid nickname!"})
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.locals.nickname = nickname;
    next();
  } catch (err) {
      
    return res.status(401).json({ message: "Invalid token" });
  }
};


