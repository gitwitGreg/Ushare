import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3cqEptCD5TbsP2xK1ODD0pi_uGmCJ448",
  authDomain: "ushare-36ff7.firebaseapp.com",
  databaseURL: "https://ushare-36ff7-default-rtdb.firebaseio.com",
  projectId: "ushare-36ff7",
  storageBucket: "ushare-36ff7.appspot.com",
  messagingSenderId: "856065622457",
  appId: "1:856065622457:web:4ef50264e37269e2a77668",
  measurementId: "G-YXLLB08WC7"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const storage = getStorage(app)

export{
  auth,
  storage,
  app
}