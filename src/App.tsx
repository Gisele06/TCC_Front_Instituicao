import { useState } from "react";
import Cadastro from "./pages/Cadastro/Cadastro";
import CadastrarEvento from "./pages/CadastrarEvento/CadastrarEvento";
import Comunicados from "./pages/Comunicados/Comunicados";
import Eventos from "./pages/Eventos/Eventos";
import Inicio from "./pages/Home/Home";
import Acesso from "./pages/Login/Login";
import "./App.css";

type Tela = "acesso" | "cadastro" | "inicio" | "eventos" | "comunicados" | "cadastrar-evento";

function Aplicativo() {
  const [tela, definirTela] = useState<Tela>("acesso");

  function navegarPara(pagina: string) {
    if (pagina === "inicio") definirTela("inicio");
    if (pagina === "eventos") definirTela("eventos");
    if (pagina === "comunicados") definirTela("comunicados");
  }

  if (tela === "cadastro") {
    return <Cadastro aoVoltar={() => definirTela("acesso")} />;
  }

  if (tela === "inicio") {
    return (
      <Inicio
        aoNavegar={navegarPara}
        aoCriarEvento={() => definirTela("cadastrar-evento")}
      />
    );
  }

  if (tela === "eventos") {
    return (
      <Eventos
        aoNavegar={navegarPara}
        aoCriarEvento={() => definirTela("cadastrar-evento")}
      />
    );
  }

  if (tela === "comunicados") {
    return <Comunicados aoNavegar={navegarPara} />;
  }

  if (tela === "cadastrar-evento") {
    return (
      <CadastrarEvento
        aoNavegar={navegarPara}
        aoVoltar={() => definirTela("eventos")}
      />
    );
  }

  return (
    <Acesso
      aoEntrar={() => definirTela("inicio")}
      aoCriarConta={() => definirTela("cadastro")}
    />
  );
}

export default Aplicativo;
