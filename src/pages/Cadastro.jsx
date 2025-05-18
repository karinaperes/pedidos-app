import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: "",
    endereco: "",
    numero: "",
    bairro: "",
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (form.senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.senha);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nome: form.nome,
        endereco: form.endereco,
        numero: form.numero,
        bairro: form.bairro,
        email: form.email,
      });

      setSucesso("Usuário cadastrado com sucesso!");
      setForm({
        nome: "",
        endereco: "",
        numero: "",
        bairro: "",
        email: "",
        senha: "",
      });
    } catch (err) {
      console.error(err);
      setErro("Erro ao cadastrar: " + (err.code || err.message));
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "1rem" }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleCadastro} autoComplete="on">
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
        <input
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
          required
        />
        <input
          name="numero"
          placeholder="Número"
          value={form.numero}
          onChange={handleChange}
          required
        />
        <input
          name="bairro"
          placeholder="Bairro"
          value={form.bairro}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          autoComplete="current-password"
          required
        />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Cadastrar
        </button>
      </form>

      {erro && <p style={{ color: "red" }}>{erro}</p>}
      {sucesso && <p style={{ color: "green" }}>{sucesso}</p>}
    </div>
  );
}
