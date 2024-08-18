export interface Financa {
  id: number
  data: string
  categoria: string
  descricao: string
  tipo: 'Despesa' | 'Receita'
  valor: number
  fixoVariavel: 'Fixo' | 'Variavel' | 'Parcela'
  parcelas?: number
  observacoes?: string | null
}

export interface FinancaAdd {
  data: string
  categoria: string
  descricao: string
  tipo: 'Despesa' | 'Receita'
  valor: number | null
  fixoVariavel: 'Fixo' | 'Variavel' | 'Parcela'
  parcelas?: number
  observacoes?: string
}

export interface FinanceResponse {
  size: number
  totalPages: number
  page: number
  list: Financa[]
  totalElements: number
}
