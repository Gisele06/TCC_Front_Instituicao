export const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function criarSemanas(ano, mes) {
  // O calendário sempre começa no domingo, por isso usamos getDay() para achar a primeira coluna.
  const primeiroDia = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasNoMesAnterior = new Date(ano, mes, 0).getDate();
  // Soma os espaços vazios do início aos dias do mês para saber quantas semanas mostrar.
  const quantidadeDeSemanas = Math.ceil((primeiroDia + diasNoMes) / 7);
  const semanas = [];
  let diaAtual = 1;
  let diaDoProximoMes = 1;

  for (let semana = 0; semana < quantidadeDeSemanas; semana += 1) {
    const dias = [];

    for (let coluna = 0; coluna < 7; coluna += 1) {
      const posicao = semana * 7 + coluna;

      if (posicao < primeiroDia) {
        dias.push({ dia: diasNoMesAnterior - primeiroDia + posicao + 1, outroMes: true });
      } else if (diaAtual <= diasNoMes) {
        dias.push({ dia: diaAtual });
        diaAtual += 1;
      } else {
        dias.push({ dia: diaDoProximoMes, outroMes: true });
        diaDoProximoMes += 1;
      }
    }

    semanas.push(dias);
  }

  return semanas;
}

export function formatarData(data) {
  const partesDaData = data.split("-");
  const ano = Number(partesDaData[0]);
  const mes = Number(partesDaData[1]);
  const dia = Number(partesDaData[2]);
  const nomesDosMeses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${dia} ${nomesDosMeses[mes - 1]} ${ano}`;
}

export function dataLocal(data = new Date()) { return `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}`; }
export function ocorreNaData(registro, data) {
  if (registro.oculto || !registro.data || data < registro.data) return false;
  if (data === registro.data) return true;
  const inicio = new Date(registro.data+'T12:00:00'), dia = new Date(data+'T12:00:00');
  const r = registro.recorrencia;
  if (['diaria','Todo dia'].includes(r)) return true;
  if (['semanal','Toda semana'].includes(r)) return inicio.getDay() === dia.getDay();
  if (['mensal','Todo mês'].includes(r)) return inicio.getDate() === dia.getDate();
  if (r === 'anual') return inicio.getMonth() === dia.getMonth() && inicio.getDate() === dia.getDate();
  return false;
}
