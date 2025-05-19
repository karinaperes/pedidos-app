import { useState } from "react";
import { collection, addDoc, deleteDoc, getDocs, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import "../../src/App.css"

export default function Cardapio() {
  const [input, setInput] = useState("");
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const navigate = useNavigate();

  const adicionarItem = () => {
    if (input.trim() === "") return;
    setLista([...lista, { id: Date.now(), nome: input.trim() }]);
    setInput("");
  };

  const excluirItem = (id) => {
    setLista(lista.filter((item) => item.id !== id));
  };

  const limparTudo = () => {
    setLista([]);
  };

  const cadastrarNoFirestore = async () => {
    if (lista.length === 0) return alert("Adicione pelo menos uma opção!");
    setCarregando(true);

    try {
      // Apaga o cardápio antigo
      const snapshot = await getDocs(collection(db, "cardapio"));
      const deletar = snapshot.docs.map((docu) => deleteDoc(doc(db, "cardapio", docu.id)));
      await Promise.all(deletar);

      // Adiciona o novo cardápio
      const adicionar = lista.map((item) =>
        addDoc(collection(db, "cardapio"), { nome: item.nome })
      );
      await Promise.all(adicionar);

      alert("Cardápio cadastrado com sucesso!");
      setLista([]); // limpa só depois de cadastrar
      navigate("/pedido"); // navega para a página de pedidos
    } catch (e) {
      console.error("Erro ao cadastrar:", e);
      alert("Erro ao cadastrar opções. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Cadastro do Cardápio</h2>

      <input
        className="marg10"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite o nome da opção"
        onKeyDown={(e) => e.key === "Enter" && adicionarItem()}
        disabled={carregando}
      />
      <button onClick={adicionarItem} disabled={carregando || input.trim() === ""}>
        Adicionar
      </button>

      <ul>
        {lista.map((item) => (
          <li key={item.id}>
            {item.nome}{" "}
            <button onClick={() => excluirItem(item.id)} disabled={carregando}>
              Excluir
            </button>
          </li>
        ))}
      </ul>

      <button onClick={cadastrarNoFirestore} disabled={carregando}>
        {carregando ? "Cadastrando..." : "Cadastrar Cardápio"}
      </button>
      <button onClick={limparTudo} disabled={carregando} style={{ marginLeft: 10 }}>
        Limpar Tudo
      </button>
    </div>
  );
}
