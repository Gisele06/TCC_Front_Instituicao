export function lerImagemLocal(arquivo) {
  if (!arquivo) return Promise.resolve(null);
  if (!/^image\/(png|jpeg|webp|gif)$/.test(arquivo.type)) return Promise.reject(new Error('Selecione uma imagem PNG, JPEG, WebP ou GIF.'));
  if (arquivo.size > 1024*1024) return Promise.reject(new Error('A imagem deve ter até 1 MB para caber no armazenamento local.'));
  return new Promise((resolver,rejeitar) => { const leitor = new FileReader(); leitor.onload = () => resolver(leitor.result); leitor.onerror = () => rejeitar(new Error('Não foi possível ler a imagem.')); leitor.readAsDataURL(arquivo); });
}
