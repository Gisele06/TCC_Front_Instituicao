import { StrictMode, useEffect, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@fontsource/alice/400.css";
import "./css/Global.css";
import MainLayout from "./components/Gerais/Layouts/MainLayout.jsx";
import Login from "./pages/AUTENTICACAO/Login.jsx";
import Cadastro from "./pages/AUTENTICACAO/Cadastro.jsx";
import RecuperarSenha from "./pages/AUTENTICACAO/RecuperarSenha.jsx";
import Inicio from "./pages/HOME/Home.jsx";
import BemEstar from "./pages/BEM_ESTAR/BemEstar.jsx";
import Acolhimento from "./pages/ACOLHIMENTO/Denuncias.jsx";
import Eventos from "./pages/EVENTOS/Eventos.jsx";
import CadastrarEvento from "./pages/EVENTOS/CADASTRAR_EVENTO/CadastrarEvento.jsx";
import Comunicados from "./pages/COMUNICADOS/Comunicados.jsx";
import CadastrarComunicados from "./pages/COMUNICADOS/CADASTRAR_COMUNICADOS/CadastrarComunicados.jsx";
import CadastrarRedeApoio from "./pages/ACOLHIMENTO/REDES_APOIO/CADASTRAR_REDE/CadastrarRedeApoio.jsx";
import Salas from "./pages/ACADEMICO/Salas.jsx";

import {
  obterUsuarioLogado,
  sairDaConta,
} from "./js/Rotas_LOGIN/rotas_LOGIN.js";
import { escutarDadosOffline, obterVersao } from "./js/_cache/storage.js";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const ROTAS_AUTENTICACAO = ["/login", "/cadastro", "/recuperar-senha"];

function RotaProtegida({ logado }) {
  return logado ? <Outlet /> : <Navigate to="/login" replace />;
}

function Aplicativo() {
  useSyncExternalStore(escutarDadosOffline, obterVersao);
  const usuario = obterUsuarioLogado();
  const logado = !!usuario;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function aoPressionarAtalho(evento) {
      if (evento.repeat) return;

      const ehTeclaS =
        evento.code === "KeyS" || evento.key?.toLowerCase() === "s";
      const ehAtalhoSair = (evento.altKey || evento.metaKey) && !evento.ctrlKey;

      if (ehAtalhoSair && ehTeclaS) {
        evento.preventDefault();
        sairDaConta();
        navigate("/login", { replace: true });
      }
    }

    window.addEventListener("keydown", aoPressionarAtalho);
    return () => window.removeEventListener("keydown", aoPressionarAtalho);
  }, [navigate]);

  const navegarPara = (pagina) =>
    navigate(pagina === "inicio" ? "/home" : `/${pagina}`);
  const voltarLogin = () => navigate("/login");
  const criarEvento = () => navigate("/eventos/cadastrarEvento");
  const criarComunicado = () => navigate("/comunicados/cadastrarComunicado");

  const chaveRota = ROTAS_AUTENTICACAO.includes(location.pathname)
    ? location.pathname
    : "app";

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={chaveRota}>
        <Route
          path="/"
          element={<Navigate to={logado ? "/home" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={
            logado ? (
              <Navigate to="/home" replace />
            ) : (
              <Login
                aoEntrar={() => {
                  navigate("/home", { replace: true });
                }}
                aoCriarConta={() => navigate("/cadastro")}
                aoRecuperarSenha={() => navigate("/recuperar-senha")}
              />
            )
          }
        />
        <Route path="/cadastro" element={<Cadastro aoVoltar={voltarLogin} />} />
        <Route
          path="/recuperar-senha"
          element={<RecuperarSenha aoVoltar={voltarLogin} />}
        />
        <Route element={<RotaProtegida logado={logado} />}>
          <Route element={<MainLayout key={usuario?.id} />}>
            <Route
              path="/home"
              element={
                <Inicio
                  aoNavegar={navegarPara}
                  aoCriarEvento={() => navigate("/home/cadastrarEvento")}
                  aoAbrirEvento={(id) =>
                    navigate(`/home/evento/${encodeURIComponent(id)}`)
                  }
                />
              }
            />
            <Route
              path="/home/evento/:id"
              element={<CadastrarEvento aoVoltar={() => navigate("/home")} />}
            />
            <Route
              path="/home/cadastrarEvento"
              element={<CadastrarEvento aoVoltar={() => navigate("/home")} />}
            />
            <Route path="/bem-estar" element={<BemEstar />} />
            <Route path="/acolhimento" element={<Acolhimento />} />
            <Route
              path="/acolhimento/cadastrarRedeApoio"
              element={<CadastrarRedeApoio />}
            />
            <Route
              path="/eventos"
              element={<Eventos aoCriarEvento={criarEvento} />}
            />
            <Route
              path="/eventos/cadastrarEvento"
              element={
                <CadastrarEvento aoVoltar={() => navigate("/eventos")} />
              }
            />
            <Route
              path="/comunicados"
              element={<Comunicados aoCriarComunicado={criarComunicado} />}
            />
            <Route
              path="/comunicados/cadastrarComunicado"
              element={
                <CadastrarComunicados
                  aoVoltar={() => navigate("/comunicados")}
                />
              }
            />
            <Route path="/academico" element={<Salas />} />
            <Route
              path="/salas"
              element={<Navigate to="/academico" replace />}
            />
            <Route path="/inicio" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <Aplicativo />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>,
);
