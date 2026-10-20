import { useState } from "react";
import Cadastro from "./pages/Cadastro/Cadastro";
import CadastrarEvento from "./pages/CadastrarEvento/CadastrarEvento";
import Comunicados from "./pages/Comunicados/Comunicados";
import Eventos from "./pages/Eventos/Eventos";
import Inicio from "./pages/Home/Home";
import Acesso from "./pages/Login/Login";
import BemEstar from "./pages/BemEstar/BemEstar";
import "./App.css";

type Tela = "acesso" | "cadastro" | "inicio" | "bem-estar" | "eventos" | "comunicados" | "cadastrar-evento";

function Aplicativo() {
  const [tela, definirTela] = useState<Tela>("acesso");

  function navegarPara(pagina: string) {
    if (pagina === "inicio") definirTela("inicio");
    if (pagina === "bem-estar") definirTela("bem-estar");
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

  if (tela === "bem-estar") {
    return <BemEstar aoNavegar={navegarPara} />;
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
