import { initializeApp } from "firebase/app";

export const hnFirebase = initializeApp({
  databaseURL: "https://hacker-news.firebaseio.com",
});
