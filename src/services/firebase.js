import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do seu projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAmk4dvXr_TbHb50QhHnZS7iXx-oEHC_uI",
  authDomain: "pedidos-app-b43df.firebaseapp.com",
  projectId: "pedidos-app-b43df",
  storageBucket: "pedidos-app-b43df.appspot.com",
  messagingSenderId: "257369148545",
  appId: "1:257369148545:web:b7787535fbf1604b5d5180",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar no app
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
