import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDf6-FumAmh6SOOh_LAjFjtwagFkhb4mX4",
  authDomain: "proyecto-vii-2b28f.firebaseapp.com",
  databaseURL: "https://proyecto-vii-2b28f-default-rtdb.firebaseio.com",
  projectId: "proyecto-vii-2b28f",
  storageBucket: "proyecto-vii-2b28f.appspot.com",
  messagingSenderId: "772883744807",
  appId: "1:772883744807:web:56790011c5a101646ba602"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
  
  export { app, database };