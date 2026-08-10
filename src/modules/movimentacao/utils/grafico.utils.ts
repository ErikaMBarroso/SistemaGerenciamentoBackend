// import { Injectable } from '@nestjs/common';
// import { OpcaoData } from '../interface/interfaceData';
// @Injectable()
// export class GraficoLinhaUtils(){
//     processarDados(
//     dados: any[],
//     periodo: string,
//   ) {

// private opcaoPeriodo(periodo: string): OpcaoData {
//   if (periodo === '3meses') return 'semana';
//   if (periodo === '1ano') return 'mes';
//   return 'dia';
// }
// private  inicioDoDia(data: Date, opcaoPeriodo: OpcaoData): Date {
//   const d = new Date(data);

//   d.setHours(0, 0, 0, 0);
//   if (opcaoPeriodo === 'semana') {
//     const dia = d.getDay();
//     const diaInicio = d.getDate() - dia + (dia === 0 ? -6 : 1);
//     d.setDate(diaInicio);
//   } else if (opcaoPeriodo === 'mes') {
//     d.setDate(1);
//   }
//   return d;
// }
// private  formataData(d: Date): string {
//   const ano = d.getFullYear();
//   const mes = String(d.getMonth() + 1).padStart(2, '0');
//   const dia = String(d.getDate()).padStart(2, '0');
//   return `${ano}-${mes}-${dia}`;
// }
// private labelData(d: Date, opcaoPeriodo: OpcaoData): string {
//   if (opcaoPeriodo === 'mes') {
//     return d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
//   }
//   return d.toLocaleDateString('pt-BR', { day: '2-digit', year: '2-digit' });
// }
// private  periodoDias(periodo): number {
//   const mapa: Record<string, number> = {
//     '7dias': 7,
//     '30dias': 30,
//     '3meses': 90,
//     '1ano': 365,
//   };

//   return mapa[periodo] ?? 30;
// }
// }
