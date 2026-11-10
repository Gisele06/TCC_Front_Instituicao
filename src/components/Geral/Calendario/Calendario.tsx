
// import { useState } from "react";
// import { DayPicker } from "@daypicker/react";
// import { ptBR } from "@daypicker/react/locale";
// import "@daypicker/react/style.css";
// import "./Calendario.css";

// interface Evento {
//   id: number;
//   titulo: string;
//   data: string;
//   horario?: string;
// }

// interface CalendarioProps {
//   eventos?: Evento[];
// }

// const eventosExemplo: Evento[] = [
//   { id: 1, titulo: "Reunião de planejamento", data: "2026-11-06", horario: "09:00" },
//   { id: 2, titulo: "Entrega de atividade", data: "2026-11-10", horario: "14:00" },
//   { id: 3, titulo: "Apresentação do projeto", data: "2026-11-13", horario: "10:00" },
//   { id: 4, titulo: "Reunião pedagógica", data: "2026-11-27", horario: "15:00" },
// ];

// const formatarData = (data: Date) => {
//   const ano = data.getFullYear();
//   const mes = String(data.getMonth() + 1).padStart(2, "0");
//   const dia = String(data.getDate()).padStart(2, "0");

//   return `${ano}-${mes}-${dia}`;
// };

// export default function Calendario({
//   eventos = eventosExemplo,
// }: CalendarioProps) {
//   const [dataSelecionada, setDataSelecionada] = useState<Date>(
//     new Date(2026, 10, 3)
//   );

//   const datasComEventos = eventos.map((evento) => {
//     const [ano, mes, dia] = evento.data.split("-").map(Number);
//     return new Date(ano, mes - 1, dia);
//   });

//   const eventosDoDia = eventos.filter(
//     (evento) => evento.data === formatarData(dataSelecionada)
//   );

//   const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(dataSelecionada);

//   return (
//     <section className="calendario">
//       <h2 className="calendario-titulo">
//         <span>▦</span>
//         Calendário
//       </h2>

//       <DayPicker
//         mode="single"
//         required
//         locale={ptBR}
//         selected={dataSelecionada}
//         onSelect={setDataSelecionada}
//         showOutsideDays
//         modifiers={{ comEvento: datasComEventos }}
//         modifiersClassNames={{ comEvento: "dia-com-evento" }}
//         formatters={{
//           formatCaption: (data) =>
//             new Intl.DateTimeFormat("pt-BR", {
//               month: "long",
//               year: "numeric",
//             }).format(data),
//           formatWeekdayName: (data) =>
//             ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
//               data.getDay()
//             ],
//         }}
//       />

//       <div className="calendario-eventos">
//         <div className="calendario-eventos-cabecalho">
//           <h3>Eventos do dia</h3>
//           <span>{dataFormatada}</span>
//         </div>

//         <div className="calendario-eventos-lista">
//           {eventosDoDia.length > 0 ? (
//             eventosDoDia.map((evento) => (
//               <div className="calendario-evento" key={evento.id}>
//                 <strong>{evento.titulo}</strong>
//                 {evento.horario && <span>{evento.horario}</span>}
//               </div>
//             ))
//           ) : (
//             <p>Nenhum evento para este dia.</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
