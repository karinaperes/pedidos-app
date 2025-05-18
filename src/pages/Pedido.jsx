import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";

export default function Pedido() {
  const [opcoes, setOpcoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [user, setUser] = useState(undefined); // undefined = carregando
  const navigate = useNavigate();

  const adminUID = "sW8iXByLm4XxERUWMjdIITzuNbF2";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario ?? null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function carregarOpcoes() {
      const querySnapshot = await getDocs(collection(db, "cardapio"));
      const lista = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOpcoes(lista);
    }

    carregarOpcoes();
  }, []);

  const toggleSelecionada = (id) => {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));
  };

  const enviarPedido = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      console.log("UID do usuário:", user.uid);
      console.log("Email do usuário:", user.email);
    }

    if (selecionadas.length === 0) {
      alert("Selecione pelo menos uma opção!");
      return;
    }

    const texto = selecionadas
      .map((id) => {
        const item = opcoes.find((m) => m.id === id);
        return `🍽️ ${item.nome}`;
      })
      .join("\n");

    const mensagem = `Olá! Gostaria de pedir as seguintes opções:\n\n${texto}`;
    const telefone = "5548991810737";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const handleImagemClick = () => {
    if (user?.uid === adminUID) {
      navigate("/cardapio");
    } else {
      console.log("Acesso negado: não é admin.");
    }
  };

  // 🔒 Proteção da rota: se ainda carregando, não renderiza nada
  if (user === undefined) return null;

  // 🔒 Se não logado, redireciona
  if (user === null) return <Navigate to="/login" />;

  return (
    <div style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Escolha suas opções da semana</h2>

      {user?.uid === adminUID && (
        <div onClick={handleImagemClick} style={{ cursor: "pointer", marginBottom: "20px" }}>
          <img src="/cardapio.png" width="32" alt="Configurar Cardápio" />
        </div>
      )}

      <ul>
        {opcoes.map((m) => (
          <li key={m.id}>
            <label>
              <input
                type="checkbox"
                checked={selecionadas.includes(m.id)}
                onChange={() => toggleSelecionada(m.id)}
              />
              {m.nome}
            </label>
          </li>
        ))}
      </ul>

      <button onClick={enviarPedido}>Enviar Pedido via WhatsApp</button>
    </div>
  );
}
