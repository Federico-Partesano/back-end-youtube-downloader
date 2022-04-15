import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { typeCryptographyJwt } from "../configurations/config";



// export const auth = (
//   { headers: { Authorization, nickname } }: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     if(Authorization && typeof Authorization === "string" ){
//     res.locals.token = jwt.verify(Authorization.split(' ')[1] , typeCryptographyJwt);
//     if(!users.find(({nickname: nicknameUser}) => nickname === nicknameUser )) return res.status(401).json({ message: "Invalid nickname" }); 
//     res.locals.nickname = nickname;
//     } else {
//       res.status(401).json({ message: "Invalid token" });
//     }
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };


