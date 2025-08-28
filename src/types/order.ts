// Enum com os status possíveis
export const OrderStatus =  {
  NOVO: "novo",
  PRODUCAO:  "producao",
  FINALIZADO:  "finalizado",
  ENVIADO: "enviado",
  FEEDBACK: "feedback",
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

// Tipo de um pedido salvo no banco (vem da API)
export interface Order {
  id: string;
  produto: string;
  cliente: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacao?: string[];
  pintor?: string;
  frete?: number;
  valorUnitario?: number;
  valorTotal?: number;
  imagem?: string;
  imagens?: string[];
  previsaoEntrega?: string;
  status: OrderStatus;
  createdAt: string;
}

// Tipo para formulário (criação/edição de pedido)
export interface OrderForm {
  observacaoTexto: string;
  mensagemEmail: Partial<Record<OrderStatus, string>>; 
  id: string;
  produto: string;
  cliente: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  observacao?: string[];
  pintor?: string;
  frete?: number;
  valorUnitario?: number;
  valorTotal?: number;
  imagem?: string;
  imagens?: string[];
  previsaoEntrega?: string;
}

// Tipo para payload de atualização
export interface OrderUpdatePayload {
  id: string;
  cliente: string;
 email?: string;
  frete?: number;
  telefone?: string;
  valorUnitario?: number;
  valorTotal?: number;
  status?: OrderStatus;
    endereco?: string;
  observacao?: string[];
  previsaoEntrega?: string;
  pintor?: string;
  mensagemEmail?: Partial<Record<OrderStatus, string>>;
}
