/* ============================================================
   StockMaster — JavaScript principal
   Persistência simples com localStorage (projeto front-end)
   ============================================================ */

var DB = {
  chave: 'stockmaster',

  padrao: function () {
    return {
      usuarios: [
        { id: 1, nome: 'Administrador', usuario: 'admin', senha: '123456', perfil: 'Administrador' },
        { id: 2, nome: 'Operador de Estoque', usuario: 'operador', senha: '123456', perfil: 'Operador' }
      ],
      produtos: [
        { id: 1, codigo: '00125', nome: 'Teclado', categoria: 'Informática', quantidade: 20, minimo: 10, preco: 120, fornecedor: 'TechShop', validade: '' },
        { id: 2, codigo: '00126', nome: 'Mouse', categoria: 'Informática', quantidade: 55, minimo: 15, preco: 60, fornecedor: 'TechShop', validade: '' },
        { id: 3, codigo: '00301', nome: 'Iogurte Natural', categoria: 'Alimentos', quantidade: 8, minimo: 15, preco: 4.5, fornecedor: 'Laticínios Sul', validade: '2026-09-11' },
        { id: 4, codigo: '00302', nome: 'Café 500g', categoria: 'Alimentos', quantidade: 4, minimo: 10, preco: 22.9, fornecedor: 'Café Bom Dia', validade: '2026-12-01' },
        { id: 5, codigo: '00303', nome: 'Leite Integral', categoria: 'Alimentos', quantidade: 30, minimo: 12, preco: 5.2, fornecedor: 'Laticínios Sul', validade: '2026-09-08' }
      ],
      movimentacoes: [
        { id: 1, produtoId: 1, tipo: 'entrada', quantidade: 20, data: '2026-08-20', motivo: 'Compra', observacao: '' },
        { id: 2, produtoId: 2, tipo: 'entrada', quantidade: 55, data: '2026-08-22', motivo: 'Compra', observacao: '' },
        { id: 3, produtoId: 3, tipo: 'saida', quantidade: 7, data: '2026-08-30', motivo: 'Venda', observacao: '' }
      ]
    };
  },

  ler: function () {
    var bruto = localStorage.getItem(this.chave);
    if (!bruto) {
      var inicial = this.padrao();
      this.salvar(inicial);
      return inicial;
    }
    try {
      return JSON.parse(bruto);
    } catch (e) {
      var novo = this.padrao();
      this.salvar(novo);
      return novo;
    }
  },

  salvar: function (dados) {
    localStorage.setItem(this.chave, JSON.stringify(dados));
  },

  proximoId: function (lista) {
    var maior = 0;
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id > maior) maior = lista[i].id;
    }
    return maior + 1;
  }
};

/* ---------------- Autenticação ---------------- */

var Auth = {
  chave: 'stockmaster_sessao',

  entrar: function (usuario, senha) {
    var dados = DB.ler();
    for (var i = 0; i < dados.usuarios.length; i++) {
      var u = dados.usuarios[i];
      if (u.usuario === usuario && u.senha === senha) {
        sessionStorage.setItem(this.chave, JSON.stringify({ nome: u.nome, perfil: u.perfil }));
        return true;
      }
    }
    return false;
  },

  atual: function () {
    var bruto = sessionStorage.getItem(this.chave);
    return bruto ? JSON.parse(bruto) : null;
  },

  sair: function () {
    sessionStorage.removeItem(this.chave);
    window.location.href = 'index.html';
  },

  exigirLogin: function () {
    if (!this.atual()) {
      window.location.href = 'index.html';
      return false;
    }
    return true;
  }
};

/* ---------------- Utilidades ---------------- */

function moeda(valor) {
  return 'R$ ' + Number(valor).toFixed(2).replace('.', ',');
}

function dataBR(iso) {
  if (!iso) return '-';
  var p = iso.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

function diasAte(iso) {
  if (!iso) return null;
  var hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  var alvo = new Date(iso + 'T00:00:00');
  return Math.round((alvo - hoje) / 86400000);
}

function mensagem(texto, tipo) {
  var area = document.getElementById('mensagem');
  if (!area) return;
  area.innerHTML = '<div class="mensagem mensagem-' + (tipo || 'ok') + '">' + texto + '</div>';
}

function produtoPorId(dados, id) {
  for (var i = 0; i < dados.produtos.length; i++) {
    if (dados.produtos[i].id === Number(id)) return dados.produtos[i];
  }
  return null;
}

function preencherSelectProdutos(select) {
  var dados = DB.ler();
  select.innerHTML = '<option value="">Selecione o produto</option>';
  for (var i = 0; i < dados.produtos.length; i++) {
    var p = dados.produtos[i];
    select.innerHTML += '<option value="' + p.id + '">' + p.nome + ' (estoque: ' + p.quantidade + ')</option>';
  }
}

/* ---------------- Layout (sidebar + topbar) ---------------- */

var MENU = [
  { texto: 'Dashboard', href: 'dashboard.html' },
  { texto: 'Produtos', href: 'produtos.html' },
  { texto: 'Consulta', href: 'consulta.html' },
  { texto: 'Entrada de Estoque', href: 'entrada.html' },
  { texto: 'Saída de Estoque', href: 'saida.html' },
  { texto: 'Relatórios', href: 'relatorios.html' },
  { texto: 'Alertas', href: 'alertas.html' },
  { texto: 'Usuários', href: 'usuarios.html' }
];

function montarLayout() {
  if (!Auth.exigirLogin()) return;

  var atual = window.location.pathname.split('/').pop() || 'dashboard.html';
  var links = '';
  for (var i = 0; i < MENU.length; i++) {
    var item = MENU[i];
    var classe = item.href === atual ? ' class="ativo"' : '';
    links += '<a href="' + item.href + '"' + classe + '>' + item.texto + '</a>';
  }
  links += '<a href="#" id="link-sair">Sair</a>';

  var sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';
  sidebar.innerHTML = '<div class="marca">StockMaster</div><nav>' + links + '</nav>';
  document.body.insertBefore(sidebar, document.body.firstChild);

  var usuario = Auth.atual();
  var topo = document.createElement('div');
  topo.className = 'topbar';
  topo.innerHTML = '<span>' + usuario.nome + ' &middot; ' + usuario.perfil + '</span>';

  var conteudo = document.querySelector('.conteudo');
  conteudo.insertBefore(topo, conteudo.firstChild);

  document.getElementById('link-sair').onclick = function (e) {
    e.preventDefault();
    Auth.sair();
  };
}