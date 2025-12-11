export interface Extrato {
    id: string; 
    data: Date | string; 
    valor: number;
    tipo: 'CRÉDITO' | 'DÉBITO';
    nomeContraparte: string;
    numeroContaOrigem: number;
    numeroContaDestino: number;
  }