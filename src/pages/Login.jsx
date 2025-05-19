import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import "../../src/App.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", senha: "" });
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      await signInWithEmailAndPassword(auth, form.email, form.senha);
      navigate("/pedido");
    } catch (err) {
      setErro("Email ou senha inválidos.");
    }
  };

  return (
    <div className="container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required          
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required          
        />
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>
      <div className="signup-link-container">
        <Link to="/cadastro" className="signup-link">
          Cadastre-se
        </Link>
      </div>
      {erro && <p className="error-message">{erro}</p>}
    </div>
  );
}
