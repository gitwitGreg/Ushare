import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA3cqEptCD5TbsP2xK1ODD0pi_uGmCJ448",
    authDomain: "ushare-36ff7.firebaseapp.com",
    projectId: "ushare-36ff7",
    storageBucket: "ushare-36ff7.appspot.com",
    messagingSenderId: "856065622457",
    appId: "1:856065622457:web:4ef50264e37269e2a77668",
  };

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);