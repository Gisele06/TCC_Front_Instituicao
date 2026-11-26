export function formatarTelefone(valor) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;

  const limiteLocal = digitos.length > 10 ? 7 : 6;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, limiteLocal)}-${digitos.slice(limiteLocal)}`;
}
