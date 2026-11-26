import { ler, gravar, lerPublico, gravarPublico } from '../_cache/storage.js';
const lista = (id, r) => ler(r, [], id) || [];
const igual = (a,b) => String(a) === String(b);
const codigo = v => String(v || '').toUpperCase().replace(/[\s-]/g,'');
const texto = v => String(v ?? '').trim();
const agora = () => new Date().toISOString();
const hora = () => new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
const dia = () => new Date().toLocaleDateString('pt-BR');
const falha = msg => { throw new Error(msg); };
function idNumerico(chave) {
  const mapa = lerPublico('idsPonte', {});
  if (!mapa[chave]) { mapa[chave] = Math.max(10000, ...Object.values(mapa)) + 1; gravarPublico('idsPonte', mapa); }
  return mapa[chave];
}
function novoId() { const n = Math.max(Date.now(), lerPublico('ultimoIdPonte', 0)+1); gravarPublico('ultimoIdPonte', n); return n; }
function perfil(id, turma) {
  const u = listaUsuarios().find(u=>igual(u.id,id));
  if (!u) falha('Instituição indisponível.');
  return {id:idNumerico('inst:'+id), nome:u.instituicao || u.nome, tipo:'Instituição de ensino', local:[u.cidade,u.estado].filter(Boolean).join('/') || '', foto:u.foto || '', fundo:u.banner || '', email:u.email, telefone:u.telefone || '', verificada:true, recursos:['apoio','avaliacoes','denuncias'], turmaId:turma.id, turmaNome:turma.nome, integrantes:lista(id,'vinculosPonte').filter(m=>igual(m.turmaId,turma.id)&&m.ativo).length, integrado:true};
}
const listaUsuarios = () => lerPublico('usuarios',[]) || [];
function convite(v) {
  for (const u of listaUsuarios()) {
    const mapa = ler('convitesTurmas',{},u.id);
    const c = Object.values(mapa).find(c=>codigo(c.codigo)===codigo(v)&&c.expiraEm>Date.now());
    const turma = c && lista(u.id,'turmas').find(t=>igual(t.id,c.turmaId)&&t.ativa!==false);
    if (turma) return {id:u.id,turma,c};
  }
  return null;
}
function vinculo(token) {
  for (const u of listaUsuarios()) {
    const m = lista(u.id,'vinculosPonte').find(m=>m.token===token&&m.ativo);
    if (!m) continue;
    const turma = lista(u.id,'turmas').find(t=>igual(t.id,m.turmaId)&&t.ativa!==false);
    if (!turma) falha('Turma indisponível.');
    return {id:u.id,m,turma};
  }
  falha('Vínculo inválido ou encerrado.');
}
const dias = {Seg:'segunda',Ter:'terca',Qua:'quarta',Qui:'quinta',Sex:'sexta',Sab:'sabado','Sáb':'sabado',Dom:'domingo'};
function grade(id,turma) {
  const materias=lista(id,'materias'), salas=lista(id,'salas');
  const g={segunda:[],terca:[],quarta:[],quinta:[],sexta:[]};
  for(const h of turma.horarios||[]) for(const d of h.dias||[]) {
    if (!dias[d]) continue;
    const mat=materias.find(m=>igual(m.id,h.materiaId)); if(!mat)continue;
    const a={id:idNumerico(`aula:${id}:${turma.id}:${h.id}:${d}`),nome:mat.nome,sigla:mat.sigla,inicio:h.inicio,fim:h.fim,sala:salas.find(s=>igual(s.id,h.salaId))?.nome||'',professor:h.professor||mat.professor||'',status:'pendente'};
    (g[dias[d]] ||= []).push(a);
  }
  for(const arr of Object.values(g))arr.sort((a,b)=>a.inicio.localeCompare(b.inicio));
  return g;
}
function publico(p,t) {return !p.oculto && (p.turmas==null || ['todas','Todas as salas','Todas as turmas'].includes(p.turmas)||igual(p.turmas,t.id)||igual(p.turmas,t.nome));}
function publicacoes(id,turma,m) {
  const eventos=lista(id,'eventos');
  return lista(id,'comunicados').filter(c=>publico(c,turma)).flatMap(c=>{
    const e=eventos.find(e=>igual(e.id,c.eventoId)); if(c.eventoId&&(!e||!publico(e,turma)))return [];
    const n={...e,...c,id:idNumerico(`pub:${id}:${c.id}`),instituicaoId:idNumerico('inst:'+id),turmaId:turma.id, titulo:c.titulo||c.nome, resumo:c.descricao||'',conteudoCompleto:c.corpo||c.descricao||'',dataPublicacao:c.publicadoEm?.slice(0,10)||c.data,dataTexto:c.data,horarioInicio:c.horaInicio,horarioFim:c.horaFim,local:e?.local||c.local||'',custo:e?.valorFormatado||'',imagem:c.imagem||e?.imagem||'',categoria:e?'Evento':c.categoria,tipo:c.categoria,tags:c.tags||[],permitirComentarios:!!e&&e.permitirComentarios!==false,permitirPerguntas:!!e&&e.permitirPerguntas!==false,curtidas:(c.curtidasPonte||[]).length,curtidaPeloUsuario:(c.curtidasPonte||[]).includes(m?.id),nova:true};
    delete n.comentarios;delete n.perguntas;delete n.curtidasPonte;return [{n,e,c}];
  });
}
function denuncias(id,m){return lista(id,'denuncias').filter(d=>d.vinculoId===m.id);}
function mensagens(id,d){return lista(id,`mensagens_${d.id}`).sort((a,b)=>String(a.data||'').localeCompare(String(b.data||''))||String(a.horario||'').localeCompare(String(b.horario||''))).map(msg=>({...msg,id:idNumerico(`msg:${id}:${d.id}:${msg.id}`),autor:msg.autor==='voce'?'equipe':msg.autor==='sistema'?'sistema':'usuario',hora:msg.horario,lida:msg.autor==='voce'?!!msg.lidaAluno:!!msg.lidaEquipe})).sort((a,b)=>a.id-b.id);}
function detalhe(id,d){const status=d.status==='Resolvida'?'concluida':'em_andamento';const lida=!!d.lidaEquipe||d.status==='Em andamento'||status==='concluida'; const andamento=d.status==='Em andamento'||status==='concluida';const {vinculoId,...publico}=d;return {...publico, codigo:'#'+String(d.id).slice(-5),instituicaoId:idNumerico('inst:'+id),status,statusTexto:status==='concluida'?'Encerrada':andamento?'Em andamento':lida?'Lida pela equipe':'Enviada',titulo:d.categoria,tipoTexto:d.categoria,dataHora:d.data,quandoTexto:d.data,ondeTexto:d.local,envolvidosTexto:d.envolvidos,ultimaAtualizacao:d.atualizadoEm||d.data,descricaoStatus:lida?'Acompanhamento com a equipe':'Aguardando leitura',novasMensagens:mensagens(id,d).filter(m=>m.autor==='equipe'&&!m.lida).length,timeline:[{id:'enviada',titulo:'Enviada',subtitulo:d.data,estado:'concluida'},{id:'lida',titulo:'Lida pela equipe',subtitulo:lida?'Visualizada':'Aguardando leitura',estado:lida?'concluida':'atual'},{id:'andamento',titulo:'Em andamento',estado:andamento?'concluida':lida?'atual':'pendente'},{id:'encerrada',titulo:'Encerrada',estado:status==='concluida'?'concluida':'pendente'}],mensagens:mensagens(id,d)};}
function alterarLista(id,r,fn){return gravar(r,fn(lista(id,r)),id);}
function alterarDenuncia(id,d,patch){alterarLista(id,'denuncias',arr=>arr.map(x=>igual(x.id,d.id)?{...x,...patch}:x));}
function comentario(c,m,inst){return {id:c.id,autor:{id:c.autorId,nome:c.autorNome||'Estudante',foto:c.autorFoto||'',titulo:'Estudante',registro:c.registro||'',mensagens:c.mensagens||0},texto:c.texto,dataISO:c.dataISO,dataTexto:c.data,curtidas:(c.curtidasPor||[]).length,curtidoPeloUsuario:(c.curtidasPor||[]).includes(m.id),ehDoUsuarioLogado:c.vinculoId===m.id,emRespostaA:c.emRespostaA||null};}
export async function executar(acao,p={}) {
  if(acao==='buscar'||acao==='entrar'){
    if(!texto(p.codigo))return null; const v=convite(p.codigo); if(!v)return null;
    const inst={...perfil(v.id,v.turma),codigo:v.c.codigo}; if(acao==='buscar')return inst;
    if(!texto(p.alunoId))falha('Entre na conta de aluno.');
    const ms=lista(v.id,'vinculosPonte'); if(ms.some(m=>m.ativo&&m.alunoId===p.alunoId))falha('Você já faz parte desta instituição.');
    const m={id:crypto.randomUUID(),token:crypto.randomUUID(),alunoId:p.alunoId,turmaId:v.turma.id,ativo:true,desde:agora().slice(0,10)};gravar('vinculosPonte',[...ms,m],v.id);return {...inst,token:m.token};
  }
  const {id,m,turma}=vinculo(p.token); const inst=perfil(id,turma);
  if(acao==='sair'){alterarLista(id,'vinculosPonte',a=>a.map(x=>x.id===m.id?{...x,ativo:false}:x));return true;}
  if(acao==='snapshot'){
    const g=grade(id,turma);const nomes=['domingo','segunda','terca','quarta','quinta','sexta','sabado'];const hoje=new Date();const aulas=Object.entries(g).flatMap(([d,arr])=>arr.map(a=>{const data=new Date(hoje);let delta=(nomes.indexOf(d)-hoje.getDay()+7)%7;if(!delta&&a.fim< hora())delta=7;data.setDate(data.getDate()+delta);return {...a,data:data.toLocaleDateString('sv-SE'),materia:a.nome,turno:turma.descricao||'',horarioInicio:a.inicio,horarioFim:a.fim,proximaAula:{nome:a.nome,horarioInicio:a.inicio,horarioFim:a.fim},instituicaoId:inst.id};}));
    return {instituicao:inst,grade:g,aulas,locais:lista(id,'salas').filter(s=>s.ativa!==false).map(s=>({id:s.id,nome:s.nome})),redesApoio:lista(id,'redesApoio').map(r=>({...r,especialidade:r.especialidade||r.categoria||'',imagem:r.imagem||r.foto||'',latitude:r.latitude??r.lat,longitude:r.longitude??r.lng})),noticias:publicacoes(id,turma,m).map(x=>x.n),denuncias:denuncias(id,m).map(d=>detalhe(id,d))};
  }
  if(acao.startsWith('avaliacao')){
    const av=p.dados||{};const existentes=lista(id,'avaliacoesPonte');
    if(acao==='avaliacaoExcluir'){gravar('avaliacoesPonte',existentes.filter(a=>!(a.vinculoId===m.id&&igual(a.id,p.avaliacaoId))),id);return true;}
    const antigo=existentes.find(a=>a.vinculoId===m.id&&igual(a.id,av.id));
    if(!antigo&&!Object.values(grade(id,turma)).flat().some(a=>igual(a.id,av.aulaId)))falha('Aula não encontrada nesta turma.');
    if(!['muitoBem','bem','normal','naoMuitoBem','sobrecarregado'].includes(av.humor))falha('Humor inválido.');
    if(!antigo&&existentes.some(a=>a.vinculoId===m.id&&igual(a.aulaId,av.aulaId)&&a.data===av.data))falha('Esta aula já foi avaliada nesta data.');
    const item={id:av.id,vinculoId:m.id,turmaId:turma.id,aulaId:av.aulaId,humor:av.humor,data:av.data,estresse:av.estresse};gravar('avaliacoesPonte',[...existentes.filter(a=>a!==antigo),item],id);return true;
  }
  if(acao==='denunciaCriar'){
    const d=p.dados||{};const local=lista(id,'salas').find(s=>s.ativa!==false&&(igual(s.id,d.local)||s.nome===d.local));if(!local||!texto(d.relato))falha('Informe um ambiente cadastrado e o relato.');
    const item={id:novoId(),vinculoId:m.id,turmaId:turma.id,categoria:(d.tipos||[]).map(t=>({violencia:'Violência/Agressão',bullying:'Convivência/Bullying',assedio:'Assédio',discriminacao:'Discriminação',outro:'Outro'})[t]||t).join('/')||'Denúncia',resumo:texto(d.relato).slice(0,130),relato:texto(d.relato),data:`${d.data||dia()}, ${d.horario||hora()}`,local:local.nome,envolvidos:(d.envolvidos||[]).join(' - '),anonimo:!!d.anonimo,status:'Recebida',provas:d.provas||[]};alterarLista(id,'denuncias',a=>[item,...a]);return detalhe(id,item);
  }
  if(acao.startsWith('denuncia')||acao.startsWith('mensagem')){
    const d=denuncias(id,m).find(d=>igual(d.id,p.denunciaId));if(!d)falha('Denúncia não encontrada.');const r=`mensagens_${d.id}`;
    if(acao==='denunciaDetalhe')return detalhe(id,d);
    if(acao==='mensagens')return mensagens(id,d).filter(x=>x.id>Number(p.ultimoId||0));
    if(acao==='mensagemLer'){alterarLista(id,r,a=>a.map(x=>x.autor==='voce'?{...x,lidaAluno:true}:x));return true;}
    if(acao==='mensagemEnviar'){if(d.status==='Resolvida'||!texto(p.texto))falha('Mensagem inválida ou denúncia encerrada.');const msg={id:novoId(),autor:'aluno',texto:texto(p.texto),horario:hora(),data:agora(),lidaEquipe:false};alterarLista(id,r,a=>[...a,msg]);return mensagens(id,d).find(x=>x.texto===msg.texto&&x.hora===msg.horario&&x.autor==='usuario'&&x.id===idNumerico(`msg:${id}:${d.id}:${msg.id}`));}
    if(acao==='denunciaEncerrar'){alterarDenuncia(id,d,{status:'Resolvida'});return detalhe(id,{...d,status:'Resolvida'});}
    if(acao==='denunciaIdentificar'){alterarDenuncia(id,d,{anonimo:false,identidade:texto(p.usuario?.nome||p.usuario?.apelido)||'Estudante'});return {anonimo:false,ultimaAtualizacao:dia(),mensagemSistema:{id:novoId(),autor:'sistema',tipoEvento:'identificacao',titulo:'Você se identificou',texto:'Sua identidade foi compartilhada com a equipe de apoio.',hora:hora(),lida:true}};}
  }
  const pub=publicacoes(id,turma,m).find(x=>igual(x.n.id,p.noticiaId));if(!pub)falha('Publicação não encontrada.'); const e=pub.e;
  if(acao==='noticiaCurtir'){const por=pub.c.curtidasPonte||[];const curtidaPeloUsuario=!por.includes(m.id);const curtidasPonte=curtidaPeloUsuario?[...por,m.id]:por.filter(x=>x!==m.id);alterarLista(id,'comunicados',a=>a.map(x=>igual(x.id,pub.c.id)?{...x,curtidasPonte}:x));return {id:pub.n.id,curtidas:curtidasPonte.length,curtidaPeloUsuario};}
  if(!e){if(acao==='comentarios'||acao==='perguntas')return [];falha('Interações desabilitadas.');}
  const comentarios=e.comentarios||[], perguntas=e.perguntas||[];
  const salvar=patch=>alterarLista(id,'eventos',a=>a.map(x=>igual(x.id,e.id)?{...x,...patch}:x));
  if(acao==='comentarios')return comentarios.flatMap(c=>[comentario(c,m,inst),...(c.respostas||[]).map(r=>({id:idNumerico(`resp:${id}:${e.id}:${r.id}`),autor:{nome:r.autor||inst.nome,titulo:'Instituição',foto:inst.foto},texto:r.texto,dataTexto:r.data,curtidas:0,ehDoUsuarioLogado:false,emRespostaA:{id:c.id,autor:{nome:c.autorNome||'Estudante'},texto:c.texto}}))]);
  if(acao==='perguntas')return perguntas.filter(q=>q.vinculoId===m.id).map(({vinculoId,...q})=>({...q,dataTexto:q.data}));
  if(acao==='comentarioCriar'){
    if(e.permitirComentarios===false||!texto(p.texto))falha('Comentários desabilitados ou vazios.');const u=p.usuario||{};const c={id:novoId(),vinculoId:m.id,autorId:u.id,autorNome:u.nome||u.apelido||'Estudante',autorFoto:u.foto||'',texto:texto(p.texto),data:dia()+' '+hora(),dataISO:agora(),respostas:[],emRespostaA:p.emRespostaA?.id?(()=>{const alvo=comentarios.find(x=>igual(x.id,p.emRespostaA.id));return alvo?{id:alvo.id,autor:{nome:alvo.autorNome||"Estudante"},texto:alvo.texto}:null;})():null};salvar({comentarios:[c,...comentarios]});return comentario(c,m,inst);
  }
  if(acao==='comentarioCurtir'){const c=comentarios.find(x=>igual(x.id,p.comentarioId));if(!c)falha('Comentário não encontrado.');const por=c.curtidasPor||[];const atualizado={...c,curtidasPor:por.includes(m.id)?por.filter(x=>x!==m.id):[...por,m.id]};salvar({comentarios:comentarios.map(x=>x===c?atualizado:x)});return comentario(atualizado,m,inst);}
  if(acao==='comentarioExcluir'){salvar({comentarios:comentarios.filter(c=>!(igual(c.id,p.comentarioId)&&c.vinculoId===m.id))});return true;}
  if(acao.startsWith('pergunta')){
    const q=perguntas.find(q=>igual(q.id,p.perguntaId)&&q.vinculoId===m.id);
    if(acao==='perguntaExcluir'){salvar({perguntas:perguntas.filter(x=>x!==q)});return true;}
    if(e.permitirPerguntas===false||!texto(p.dados?.texto))falha('Perguntas desabilitadas ou vazias.');if(acao==='perguntaEditar'&&!q)falha('Pergunta não encontrada.');
    const d=p.dados;const item={...q,id:q?.id||novoId(),vinculoId:m.id,texto:texto(d.texto),anonima:!!d.anonima,autorNome:d.anonima?'Anônimo':d.usuarioLogado?.nome||'Estudante',data:dia()+' '+hora(),respondida:q?.respondida||false};salvar({perguntas:[item,...perguntas.filter(x=>x!==q)]});return {...item,dataTexto:item.data};
  }
  falha('Operação não permitida.');
}
