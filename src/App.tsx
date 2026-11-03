import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ambiente } from "./config/ambiente";
import Cadastro from "./pages/Cadastro/Cadastro";
import CadastrarEvento from "./pages/CadastrarEvento/CadastrarEvento";
import Comunicados from "./pages/Comunicados/Comunicados";
import Eventos from "./pages/Eventos/Eventos";
import Inicio from "./pages/Home/Home";
import Acesso from "./pages/Login/Login";
import RecuperarSenha from "./pages/RecuperarSenha/RecuperarSenha";
import BemEstar from "./pages/BemEstar/BemEstar";
import Salas from "./pages/Salas/Salas";
import Acolhimento from "./pages/Acolhimento/Denuncias";
import CadastrarRedeApoio from "./pages/Acolhimento/CadastrarRedeApoio";
import CadastrarComunicados from "./pages/CadastrarComunicados/CadastrarComunicados";
import "./App.css";

type Tela =
  | "acesso"
  | "cadastro"
  | "recuperar-senha"
  | "inicio"
  | "bem-estar"
  | "eventos"
  | "comunicados"
  | "cadastrar-evento"
  | "acolhimento"
  | "acolhimento-redes"
  | "cadastrar-rede-apoio"
  | "cadastrar-comunicados"
  | "salas";

function Aplicativo() {
  const [tela, definirTela] = useState<Tela>("acesso");

  function navegarPara(pagina: string) {
    const destinos: Record<string, Tela> = {
      inicio: "inicio",
      "bem-estar": "bem-estar",
      eventos: "eventos",
      comunicados: "comunicados",
      acolhimento: "acolhimento",
      academico: "salas",
      "cadastrar-comunicados": "cadastrar-comunicados",
      "cadastrar-rede-apoio": "cadastrar-rede-apoio",
    };
    if (destinos[pagina]) definirTela(destinos[pagina]);
  }

  if (tela === "cadastro") return <Cadastro aoVoltar={() => definirTela("acesso")} />;
  if (tela === "recuperar-senha") return <RecuperarSenha aoVoltar={() => definirTela("acesso")} />;
  if (tela === "inicio") {
    return <Inicio aoNavegar={navegarPara} aoCriarEvento={() => definirTela("cadastrar-evento")} />;
  }
  if (tela === "bem-estar") return <BemEstar aoNavegar={navegarPara} />;
  if (tela === "acolhimento" || tela === "acolhimento-redes") {
    return (
      <Acolhimento
        aoNavegar={navegarPara}
        visaoInicial={tela === "acolhimento-redes" ? "redesApoio" : "denuncias"}
        aoCadastrarRede={() => definirTela("cadastrar-rede-apoio")}
      />
    );
  }
  if (tela === "cadastrar-rede-apoio") {
    return <CadastrarRedeApoio aoNavegar={navegarPara} aoVoltar={() => definirTela("acolhimento-redes")} />;
  }
  if (tela === "eventos") {
    return <Eventos aoNavegar={navegarPara} aoCriarEvento={() => definirTela("cadastrar-evento")} />;
  }
  if (tela === "comunicados") {
    return <Comunicados aoNavegar={navegarPara} aoCriarComunicado={() => definirTela("cadastrar-comunicados")} />;
  }
  if (tela === "cadastrar-evento") {
    return <CadastrarEvento aoNavegar={navegarPara} aoVoltar={() => definirTela("eventos")} />;
  }
  if (tela === "cadastrar-comunicados") {
    return <CadastrarComunicados aoNavegar={navegarPara} aoVoltar={() => definirTela("comunicados")} />;
  }
  if (tela === "salas") return <Salas aoNavegar={navegarPara} />;

  const login = (
    <Acesso
      aoEntrar={() => definirTela("inicio")}
      aoCriarConta={() => definirTela("cadastro")}
      aoRecuperarSenha={() => definirTela("recuperar-senha")}
      googleDisponivel={Boolean(ambiente.googleClientId)}
    />
  );

  // O provider só é montado se houver Client ID público configurado.
  return ambiente.googleClientId
    ? <GoogleOAuthProvider clientId={ambiente.googleClientId}>{login}</GoogleOAuthProvider>
    : login;
}

export default Aplicativo;
