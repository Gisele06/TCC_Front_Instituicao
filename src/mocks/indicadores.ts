// Indicadores inventados somente para a demonstração visual.
// Os cálculos reais precisam ser definidos pelo grupo no backend.
export const painelHomeMock = {
  bemEstar: { valor: "78%", selo: "Bom", variacao: "8% de aumento nesse mês" },
  participacao: { valor: "67%", selo: "Bom", variacao: "12% de aumento nesse mês" },
  turmasEmAtencao: { valor: "3", selo: "Atenção", variacao: "3 turmas em acompanhamento" },
  totais: { alunos: 345, avaliacoes: 428, mensagens: 3 },
  grafico: {
    rotulos: ["15/06", "22/06", "29/06", "06/07", "13/07", "20/07", "27/07", "03/08"],
    series: [
      { id: "bem-estar", nome: "Bem-estar", cor: "#4baf94", valores: [60, 65, 70, 75, 78, 80, 76, 78] },
      { id: "participacao", nome: "Participação", cor: "#3479b8", valores: [56, 62, 67, 65, 68, 73, 69, 75] },
      { id: "atencao", nome: "Turmas em atenção", cor: "#a17bc8", valores: [32, 36, 30, 35, 40, 38, 43, 39] },
    ],
  },
};

export const panoramaBemEstarMock = {
  indice: 78,
  variacao: "+8%",
  situacao: "Bom",
  series: [
    { id: "bem", nome: "Bem", cor: "#2f9365", valores: [63, 70, 75, 75, 82, 78, 72, 67, 64, 66, 72, 84, 92, 92, 90, 91] },
    { id: "atencao", nome: "Atenção", cor: "#f4aa06", valores: [44, 48, 55, 58, 64, 67, 66, 74, 82, 82, 76, 71, 72, 74, 74, 79] },
    { id: "regular", nome: "Regular", cor: "#de7009", valores: [30, 34, 38, 36, 32, 33, 45, 52, 51, 44, 40, 41, 48, 48, 46, 50] },
    { id: "alerta", nome: "Alerta", cor: "#d54017", valores: [13, 20, 24, 24, 22, 17, 21, 27, 30, 28, 22, 17, 19, 26, 26, 29] },
  ],
  rotulos: ["15/06", "22/06", "29/06", "06/07", "13/07", "20/07", "27/07", "03/08"],
  distribuicao: [
    { rotulo: "Bem", valor: 58, largura: 53, cor: "var(--cor-bem)" },
    { rotulo: "Atenção", valor: 24, largura: 21, cor: "var(--cor-atencao)" },
    { rotulo: "Regular", valor: 13, largura: 18, cor: "var(--cor-regular)" },
    { rotulo: "Alerta", valor: 5, largura: 8, cor: "var(--cor-alerta-grafico)" },
  ],
  indicadores: [
    { id: "estresse", valor: "20%", variacao: "-5%", sentido: "baixo", tom: "bom" },
    { id: "sono", valor: "40%", variacao: "+10%", sentido: "cima", tom: "ruim" },
    { id: "ansiedade", valor: "20%", variacao: "+10%", sentido: "cima", tom: "ruim" },
    { id: "organizacao", valor: "40%", variacao: "+5%", sentido: "cima", tom: "bom" },
    { id: "pertencimento", valor: "40%", variacao: "+5%", sentido: "cima", tom: "bom" },
  ],
};

export const bemEstarTurmasMock = {
  metricas: [
    { id: "sobrecarga", percentual: 78, variacao: "+8%", situacao: "Bom", valores: [27, 33, 37, 35, 30, 30, 38, 45, 44, 37, 30, 32, 38, 39, 37, 41] },
    { id: "sono", percentual: 64, variacao: "+3%", situacao: "Bom", valores: [40, 44, 48, 46, 42, 45, 52, 55, 50, 47, 49, 53, 51, 56, 54, 58] },
    { id: "ansiedade", percentual: 71, variacao: "+2%", situacao: "Bom", valores: [30, 28, 35, 38, 33, 36, 42, 40, 37, 39, 44, 41, 43, 46, 44, 47] },
    { id: "organizacao", percentual: 69, variacao: "+5%", situacao: "Bom", valores: [35, 38, 36, 41, 45, 43, 40, 46, 50, 48, 47, 52, 55, 53, 56, 58] },
    { id: "pertencimento", percentual: 82, variacao: "+5%", situacao: "Bom", valores: [50, 53, 55, 52, 58, 60, 57, 62, 65, 63, 66, 64, 68, 70, 69, 72] },
  ],
  rotulos: ["15/06", "22/06", "29/06", "06/07", "13/07", "20/07", "27/07", "03/08"],
};
