// Formata valores monetários (corrigido para lidar com R$ duplicado e separadores brasileiros)
export const formatCurrency = (valor?: string | number): string => {
  if (!valor) return "R$ 0,00"

  let numero: number

  if (typeof valor === "number") {
    numero = valor
  } else {
    // Limpa e converte valores brasileiros (ex: "1.001,10")
    const limpado = valor
      .replace(/R\$\s?/g, "") // remove símbolo
      .replace(/\./g, "")     // remove pontos de milhar
      .replace(",", ".")      // troca vírgula por ponto

    numero = parseFloat(limpado)
  }

  if (isNaN(numero)) return "R$ 0,00"

  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  })
}




// Formata datas (aceita tanto "DD/MM/AAAA" quanto "YYYY-MM-DD")
export const formatDate = (data?: string): string => {
  if (!data) return 'Data inválida'

  // Formato ISO
  if (/^\d{4}-\d{2}-\d{2}/.test(data)) {
    const [ano, mes, dia] = data.split('-')
    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia)) // ← local
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  // Formato brasileiro
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    const [dia, mes, ano] = data.split('/')
    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia)) // ← local
    return dataObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  return 'Data inválida'
}


// Formata telefones automaticamente com DDD
export const formatPhone = (telefone?: string): string => {
  if (!telefone) return ''
  const numeros = telefone.replace(/\D/g, '')

  if (numeros.length === 10)
    return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')

  if (numeros.length === 11)
    return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')

  return telefone // fallback
}
