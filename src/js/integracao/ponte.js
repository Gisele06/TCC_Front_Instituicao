import { executar } from './servico.js';
const origem = new URL(import.meta.env?.VITE_ALUNO_ORIGIN || 'http://localhost:5174').origin;
window.addEventListener('message', async e => {
  if(e.origin!==origem||e.source!==window.parent||e.data?.canal!=='bloom-ponte-v1')return;
  const {req,acao,p}=e.data;
  try {const dados=await executar(acao,p);e.source.postMessage({canal:'bloom-ponte-v1',req,ok:true,dados},origem);}
  catch(err){e.source.postMessage({canal:'bloom-ponte-v1',req,ok:false,erro:err.message},origem);}
});
