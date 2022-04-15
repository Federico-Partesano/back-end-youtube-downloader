import express from "express";

import cors from "cors";
import { Request } from "express";
import {
  errorHandler,
  ResponseSuccessJson,
  toExpressHandler,
} from "./utils/express.utils";
import * as socketio from "socket.io";
import * as http from "http";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage  } from "firebase-admin/storage";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const serviceAccount = require('./../configurations/serviceAccountKey.json');


const port = process.env.PORT || 3001;

const firebaseApp = initializeApp({
  credential: cert(serviceAccount)
});

export const db = getFirestore();
export let myStorage = getStorage(firebaseApp).bucket("gs://football-df145.appspot.com");
export let socketConnection: socketio.Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> | null = null;



const app = express();
const server = http.createServer(app);

const io = new socketio.Server(server, {cors: {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
 }})


 let connections: Record<string, string> = {}
 io.on('connection',(socket) =>{
  socketConnection = socket;
   socket.on("conn", (message) => {
     console.log(message);
   })
  

 })

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());
app.options("*", cors() as any);

// app.use("/youtube", youtube);
app.get("/", (req, res) =>{
return res.json({message: "ok"})
})


class TestController {
  static testEndpoint = async (req: Request) => {
    if (req.query.fail) throw new Error("simulated error");
    return ResponseSuccessJson({ message: "ok" });
  };
}



app.get(
  "/test",
  // ----
  toExpressHandler(TestController.testEndpoint, TestController)
);
app.use(errorHandler);

server.listen(port ,() => console.log("Server is running"));



export default app;

