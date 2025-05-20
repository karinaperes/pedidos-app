import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useNavigate, Navigate } from "react-router-dom";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import "../../src/App.css";

export default function Pedido() {
  const [opcoes, setOpcoes] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();
  const [quantidades, setQuantidades] = useState({});

  const adminUID = "sW8iXByLm4XxERUWMjdIITzuNbF2";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario ?? null);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const verificarPermissoes = async () => {
      try {
        const auth = getAuth();
        console.log("Usuário atual:", auth.currentUser?.uid);

        const querySnapshot = await getDocs(collection(db, "cardapio"));
        console.log("Documentos carregados:", querySnapshot.size);

        if (querySnapshot.empty) {
          console.warn("A coleção 'cardapio' está vazia");
        }
      } catch (error) {
        console.error("Erro detalhado:", {
          code: error.code,
          message: error.message,
          stack: error.stack,
        });
      }
    };

    if (user) verificarPermissoes();
  }, [user]);

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const querySnapshot = await getDocs(collection(db, "cardapio"));
        const lista = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOpcoes(lista);
      } catch (error) {
        console.error("Erro ao carregar cardápio:", error);
      }
    }

    carregarOpcoes(); // Carrega opções independente do usuário
  }, []); // Removi a dependência do user

  const toggleSelecionada = (id) => {
    setSelecionadas((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

    // Só define quantidade 1 se for um item novo
    if (!selecionadas.includes(id)) {
      setQuantidades((prev) => ({ ...prev, [id]: 1 }));
    }
  };

  const atualizarQuantidade = (id, valor) => {
    const numValue = Number(valor);

    setQuantidades((prev) => ({
      ...prev,
      [id]: numValue > 0 ? numValue : 1, // Garante mínimo 1
    }));
  };

  const enviarPedido = () => {
    if (!user) {
      alert("Você precisa estar logado para enviar um pedido!");
      return;
    }

    if (selecionadas.length === 0) {
      alert("Selecione pelo menos uma opção!");
      return;
    }

    const texto = selecionadas
      .map((id) => {
        const item = opcoes.find((m) => m.id === id);
        const quantidade = quantidades[id] || 1;
        return `🍽️ ${item.nome} (${quantidade}x)`;
      })
      .join("\n");

    const mensagem = `Olá! Gostaria de pedir as seguintes opções:\n\n${texto}`;
    const telefone = "5548991245682";
    const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const handleImagemClick = () => {
    if (user?.uid === adminUID) {
      navigate("/cardapio");
    }
  };

  if (user === undefined) return <div>Carregando...</div>;
  if (user === null) return <Navigate to="/login" />;

  return (
    <div className="container" style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Escolha suas opções da semana</h2>

      {/* Mostra apenas para admin */}
      {user?.uid === adminUID && (
        <div onClick={handleImagemClick} style={{ cursor: "pointer", marginBottom: "20px" }}>
          <img src="/cardapio.png" width="32" alt="Configurar Cardápio" />
        </div>
      )}

      {/* Lista visível para todos (já que o componente só renderiza se user !== null) */}
      <ul className="opcoes-list">
        {opcoes.map((m) => (
          <li key={m.id} className="opcao-item">
            <div className="opcao-content">
              <span className="opcao-nome">{m.nome}</span>
            </div>
            <div className="opcao-controles">
              <input
                type="checkbox"
                checked={selecionadas.includes(m.id)}
                onChange={() => toggleSelecionada(m.id)}
              />
              {selecionadas.includes(m.id) && (
                <input
                  type="number"
                  min="1"
                  value={quantidades[m.id] || 1}
                  onChange={(e) => atualizarQuantidade(m.id, e.target.value)}
                  className="quantidade-input"
                />
              )}
            </div>
          </li>
        ))}
      </ul>

      <button onClick={enviarPedido}>Enviar Pedido via WhatsApp</button>
    </div>
  );
}
