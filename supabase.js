// ============================================================
// BUFFETPRO — CONEXÃO COM O SUPABASE
// Este arquivo conecta o app ao banco de dados.
// NÃO compartilhe este arquivo publicamente.
// ============================================================

const SUPABASE_URL = 'https://kybizrjwpqqziaqtsubj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_CT44V0uqFsmOXxicX5ADEQ_PHNoa1Ao';

// Carregar o Supabase
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================================
// FUNÇÕES PRONTAS — use em qualquer tela do app
// ============================================================

// CLIENTES
async function buscarClientes() {
  const { data, error } = await db.from('clientes').select('*').order('nome');
  if (error) logErro('ERR-DB-001', 'Erro ao buscar clientes', error);
  return data || [];
}

async function salvarCliente(cliente) {
  const { data, error } = cliente.id
    ? await db.from('clientes').update(cliente).eq('id', cliente.id)
    : await db.from('clientes').insert(cliente);
  if (error) logErro('ERR-DB-002', 'Erro ao salvar cliente', error);
  return !error;
}

async function excluirCliente(id) {
  const { error } = await db.from('clientes').delete().eq('id', id);
  if (error) logErro('ERR-DB-003', 'Erro ao excluir cliente', error);
  return !error;
}

// LEADS
async function buscarLeads() {
  const { data, error } = await db.from('leads').select('*').order('created_at', { ascending: false });
  if (error) logErro('ERR-DB-004', 'Erro ao buscar leads', error);
  return data || [];
}

async function salvarLead(lead) {
  const { data, error } = lead.id
    ? await db.from('leads').update(lead).eq('id', lead.id)
    : await db.from('leads').insert(lead);
  if (error) logErro('ERR-DB-005', 'Erro ao salvar lead', error);
  return !error;
}

// ESPAÇOS
async function buscarEspacos() {
  const { data, error } = await db.from('espacos').select('*').eq('ativo', true).order('nome');
  if (error) logErro('ERR-DB-006', 'Erro ao buscar espaços', error);
  return data || [];
}

async function salvarEspaco(espaco) {
  const { data, error } = espaco.id
    ? await db.from('espacos').update(espaco).eq('id', espaco.id)
    : await db.from('espacos').insert(espaco);
  if (error) logErro('ERR-DB-007', 'Erro ao salvar espaço', error);
  return !error;
}

// EVENTOS
async function buscarEventos() {
  const { data, error } = await db.from('eventos').select('*, clientes(nome), espacos(nome)').order('data_evento');
  if (error) logErro('ERR-DB-008', 'Erro ao buscar eventos', error);
  return data || [];
}

async function salvarEvento(evento) {
  const { data, error } = evento.id
    ? await db.from('eventos').update(evento).eq('id', evento.id)
    : await db.from('eventos').insert(evento);
  if (error) logErro('ERR-DB-009', 'Erro ao salvar evento', error);
  return !error;
}

// CONVIDADOS
async function buscarConvidados(eventoId) {
  const { data, error } = await db.from('convidados').select('*').eq('evento_id', eventoId).order('nome');
  if (error) logErro('ERR-DB-010', 'Erro ao buscar convidados', error);
  return data || [];
}

async function salvarConvidado(convidado) {
  const { data, error } = convidado.id
    ? await db.from('convidados').update(convidado).eq('id', convidado.id)
    : await db.from('convidados').insert(convidado);
  if (error) logErro('ERR-DB-011', 'Erro ao salvar convidado', error);
  return !error;
}

async function fazerCheckin(convidadoId) {
  const { error } = await db.from('convidados').update({
    checkin: true,
    checkin_em: new Date().toISOString(),
    status: 'confirmado'
  }).eq('id', convidadoId);
  if (error) logErro('ERR-DB-012', 'Erro ao fazer check-in', error);
  return !error;
}

// FINANCEIRO
async function buscarFinanceiro(filtros = {}) {
  let query = db.from('financeiro').select('*, eventos(numero), clientes(nome)').order('data_vencimento');
  if (filtros.tipo) query = query.eq('tipo', filtros.tipo);
  if (filtros.status) query = query.eq('status', filtros.status);
  const { data, error } = await query;
  if (error) logErro('ERR-DB-013', 'Erro ao buscar financeiro', error);
  return data || [];
}

async function salvarLancamento(lancamento) {
  const { data, error } = lancamento.id
    ? await db.from('financeiro').update(lancamento).eq('id', lancamento.id)
    : await db.from('financeiro').insert(lancamento);
  if (error) logErro('ERR-DB-014', 'Erro ao salvar lançamento', error);
  return !error;
}

// INGREDIENTES
async function buscarIngredientes() {
  const { data, error } = await db.from('ingredientes').select('*').eq('ativo', true).order('nome');
  if (error) logErro('ERR-DB-015', 'Erro ao buscar ingredientes', error);
  return data || [];
}

async function salvarIngrediente(ingrediente) {
  const { data, error } = ingrediente.id
    ? await db.from('ingredientes').update(ingrediente).eq('id', ingrediente.id)
    : await db.from('ingredientes').insert(ingrediente);
  if (error) logErro('ERR-DB-016', 'Erro ao salvar ingrediente', error);
  return !error;
}

// USUÁRIOS
async function buscarUsuarios() {
  const { data, error } = await db.from('usuarios').select('*').order('nome');
  if (error) logErro('ERR-DB-017', 'Erro ao buscar usuários', error);
  return data || [];
}

// ============================================================
// SISTEMA DE ERROS — gera códigos automáticos com instruções
// ============================================================
function logErro(codigo, mensagem, erro) {
  const log = {
    codigo,
    mensagem,
    detalhe: erro?.message || String(erro),
    tela: document.title || 'Desconhecida',
    data: new Date().toLocaleString('pt-BR')
  };
  const logs = JSON.parse(localStorage.getItem('buffetpro_logs') || '[]');
  logs.unshift(log);
  localStorage.setItem('buffetpro_logs', JSON.stringify(logs.slice(0, 50)));
  console.error('[BuffetPro]', codigo, mensagem, erro);
}

function buscarLogs() {
  return JSON.parse(localStorage.getItem('buffetpro_logs') || '[]');
}

function limparLogs() {
  localStorage.removeItem('buffetpro_logs');
}
