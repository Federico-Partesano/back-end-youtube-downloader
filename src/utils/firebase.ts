import { getStorage } from "firebase-admin/storage";
import { db, myStorage } from "..";
import { Song } from "../models/song";

export const formatGeneralResp = <T>(
  collection: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>
) => {
  let array: (T & { id: string })[] = [];
  collection.forEach((element) => {
    array.push({ id: element.id, ...element.data() } as T & { id: string });
  });
  return array;
};

export const checkIfExistsFile = async (fileName: string) =>  (await myStorage.file(`mp3/${fileName}`).exists())[0];


export const changeStatusSong = async(videoId: string, song: Song, status: "ok" | "processing" | "converting") => {
  const newSong = await db.collection('songs').doc(videoId);
  await newSong.set({...song,status});
}

