import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "../src/App.css"

// Lazy load das páginas
const Login = lazy(() => import("./pages/Login"));
const Cadastro = lazy(() => import("./pages/Cadastro"));
const Pedido = lazy(() => import("./pages/Pedido"));
const Cardapio = lazy(() => import("./pages/Cardapio"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/pedido" element={<Pedido />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
