import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC7FcWvQStvO4E7TPZaQyjNi-ps50GsiOI",
  authDomain: "indiasite-8d45b.firebaseapp.com",
  projectId: "indiasite-8d45b",
  storageBucket: "indiasite-8d45b.firebasestorage.app",
  messagingSenderId: "168378838234",
  appId: "1:168378838234:web:64f6c5b82e523bdd9549e3",
  measurementId: "G-FVBTCVDLES"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
