export interface Extrato {
    map(arg0: (item: any) => any, arg1: { this: string; return: never[]; }): any;
    id: string; 
    data: Date | string; 
    valor: number;
    tipo: 'CRÉDITO' | 'DÉBITO';
    nomeContraparte: string;
    numeroContaOrigem: number;
    numeroContaDestino: number;
    descricao: string;
  }