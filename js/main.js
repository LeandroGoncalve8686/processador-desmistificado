/* ============================================
   PROCESSADOR DESMISTIFICADO - JS GLOBAL
   ALTERE AQUI AS FUNCOES E LOGICAS
   ============================================ */

// ===== SISTEMA DE PERSONALIZACAO =====
const Personalizador = {
  init() {
    this.carregarConfiguracoes();
    this.aplicarTema();
  },

  // ALTERE AQUI OS TEMAS DISPONIVEIS
  temas: {
    escuro:   { name: 'Escuro', class: '' },
    claro:    { name: 'Claro', class: 'theme-light' },
    hacker:   { name: 'Hacker', class: 'theme-hacker' },
    cyberpunk:{ name: 'Cyberpunk', class: 'theme-cyberpunk' },
    matrix:   { name: 'Matrix', class: 'theme-matrix' },
    neon:     { name: 'Neon', class: 'theme-neon' },
    minimal:  { name: 'Minimalista', class: 'theme-minimal' },
    pro:      { name: 'Profissional', class: 'theme-professional' }
  },

  // ALTERE AQUI AS FONTES DISPONIVEIS
  fontes: {
    inter:       { name: 'Inter', family: "'Inter', sans-serif" },
    roboto:      { name: 'Roboto', family: "'Roboto', sans-serif" },
    opensans:    { name: 'Open Sans', family: "'Open Sans', sans-serif" },
    lato:        { name: 'Lato', family: "'Lato', sans-serif" },
    merriweather:{ name: 'Merriweather', family: "'Merriweather', serif" },
    georgia:     { name: 'Georgia', family: "Georgia, serif" },
    dyslexic:    { name: 'OpenDyslexic', family: "'OpenDyslexic', sans-serif" }
  },

  carregarConfiguracoes() {
    const cfg = localStorage.getItem('ebook_config');
    this.config = cfg ? JSON.parse(cfg) : this.configPadrao();
  },

  configPadrao() {
    return {
      tema: 'escuro',
      fonte: 'inter',
      tamanhoFonte: 16,
      espacamento: 1.7,
      larguraTexto: 800,
      altoContraste: false,
      modoLeitura: false,
      cores: {
        texto: null,
        titulo: null,
        link: null,
        fundo: null,
        botao: null,
        menu: null,
        card: null
      }
    };
  },

  salvar() {
    localStorage.setItem('ebook_config', JSON.stringify(this.config));
  },

  aplicarTema() {
    const body = document.body;
    // Remove todas as classes de tema
    Object.values(this.temas).forEach(t => {
      if (t.class) body.classList.remove(t.class);
    });
    // Aplica tema atual
    const temaAtual = this.temas[this.config.tema];
    if (temaAtual && temaAtual.class) {
      body.classList.add(temaAtual.class);
    }

    // Aplica fonte
    const fonteAtual = this.fontes[this.config.fonte];
    if (fonteAtual) {
      document.documentElement.style.setProperty('--font-main', fonteAtual.family);
    }

    // Aplica tamanho de fonte
    document.documentElement.style.fontSize = this.config.tamanhoFonte + 'px';

    // Aplica espacamento
    document.documentElement.style.setProperty('--line-height', this.config.espacamento);

    // Aplica largura do texto
    document.documentElement.style.setProperty('--text-width', this.config.larguraTexto + 'px');

    // Aplica cores customizadas
    const c = this.config.cores;
    if (c.texto) document.documentElement.style.setProperty('--text-primary', c.texto);
    if (c.titulo) document.documentElement.style.setProperty('--primary', c.titulo);
    if (c.link) document.documentElement.style.setProperty('--primary-light', c.link);
    if (c.fundo) document.documentElement.style.setProperty('--bg-main', c.fundo);
    if (c.botao) document.documentElement.style.setProperty('--primary-dark', c.botao);
    if (c.menu) document.documentElement.style.setProperty('--bg-card', c.menu);
    if (c.card) document.documentElement.style.setProperty('--bg-elevated', c.card);

    // Alto contraste
    if (this.config.altoContraste) {
      body.classList.add('alto-contraste');
    } else {
      body.classList.remove('alto-contraste');
    }

    // Modo leitura
    if (this.config.modoLeitura) {
      body.classList.add('modo-leitura');
    } else {
      body.classList.remove('modo-leitura');
    }
  },

  setTema(tema) {
    this.config.tema = tema;
    this.salvar();
    this.aplicarTema();
  },

  setFonte(fonte) {
    this.config.fonte = fonte;
    this.salvar();
    this.aplicarTema();
  },

  setTamanhoFonte(tamanho) {
    this.config.tamanhoFonte = tamanho;
    this.salvar();
    this.aplicarTema();
  },

  setEspacamento(esp) {
    this.config.espacamento = esp;
    this.salvar();
    this.aplicarTema();
  },

  setLarguraTexto(largura) {
    this.config.larguraTexto = largura;
    this.salvar();
    this.aplicarTema();
  },

  setCor(tipo, cor) {
    this.config.cores[tipo] = cor;
    this.salvar();
    this.aplicarTema();
  },

  toggleAltoContraste() {
    this.config.altoContraste = !this.config.altoContraste;
    this.salvar();
    this.aplicarTema();
  },

  toggleModoLeitura() {
    this.config.modoLeitura = !this.config.modoLeitura;
    this.salvar();
    this.aplicarTema();
  },

  resetar() {
    this.config = this.configPadrao();
    this.salvar();
    this.aplicarTema();
  }
};

// ===== SISTEMA DE PROGRESSO =====
const Progresso = {
  totalCapitulos: 14,

  init() {
    this.carregar();
  },

  carregar() {
    const dados = localStorage.getItem('ebook_progresso');
    this.dados = dados ? JSON.parse(dados) : {
      capitulosConcluidos: [],
      quizScores: {},
      xp: 0,
      nivel: 1,
      conquistas: [],
      ultimoAcesso: Date.now()
    };
  },

  salvar() {
    this.dados.ultimoAcesso = Date.now();
    localStorage.setItem('ebook_progresso', JSON.stringify(this.dados));
  },

  concluirCapitulo(num) {
    if (!this.dados.capitulosConcluidos.includes(num)) {
      this.dados.capitulosConcluidos.push(num);
      this.adicionarXP(100);
      this.salvar();
    }
  },

  adicionarXP(qtd) {
    this.dados.xp += qtd;
    const novoNivel = Math.floor(this.dados.xp / 500) + 1;
    if (novoNivel > this.dados.nivel) {
      this.dados.nivel = novoNivel;
      this.notificar(`🎉 Nivel ${novoNivel} alcancado!`);
    }
    this.salvar();
  },

  salvarQuizScore(capitulo, score) {
    const key = `cap${capitulo}`;
    const atual = this.dados.quizScores[key] || 0;
    if (score > atual) {
      this.dados.quizScores[key] = score;
      this.adicionarXP(score * 2);
      this.salvar();
    }
  },

  adicionarConquista(id) {
    if (!this.dados.conquistas.includes(id)) {
      this.dados.conquistas.push(id);
      this.adicionarXP(50);
      this.salvar();
    }
  },

  getPorcentagem() {
    return Math.round((this.dados.capitulosConcluidos.length / this.totalCapitulos) * 100);
  },

  getCapitulosConcluidos() {
    return this.dados.capitulosConcluidos;
  },

  isConcluido(num) {
    return this.dados.capitulosConcluidos.includes(num);
  },

  notificar(msg) {
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.innerHTML = msg;
    notif.style.cssText = `
      position: fixed; top: 20px; right: 20px; z-index: 10000;
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      color: white; padding: 1rem 1.5rem; border-radius: 12px;
      box-shadow: var(--shadow-lg); animation: fadeIn 0.3s ease;
      font-weight: 600;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 4000);
  }
};

// ===== SISTEMA DE QUIZ =====
const Quiz = {
  criar(containerId, perguntas, capitulo) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let atual = 0;
    let acertos = 0;
    let respondeu = false;

    const render = () => {
      const p = perguntas[atual];
      container.innerHTML = `
        <div class="quiz-container">
          <div class="quiz-header">
            <span class="badge badge-info">Pergunta ${atual + 1} de ${perguntas.length}</span>
            <div class="progress-bar" style="margin-top:0.5rem">
              <div class="progress-fill" style="width:${((atual)/perguntas.length)*100}%"></div>
            </div>
          </div>
          <h3 class="quiz-pergunta">${p.pergunta}</h3>
          <div class="quiz-opcoes">
            ${p.opcoes.map((op, i) => `
              <button class="quiz-opcao" data-index="${i}" onclick="Quiz.responder(this, ${i}, ${p.correta}, ${capitulo})">
                <span class="quiz-letra">${String.fromCharCode(65 + i)}</span>
                <span>${op}</span>
              </button>
            `).join('')}
          </div>
          <div class="quiz-feedback" id="quiz-feedback"></div>
        </div>
      `;
      respondeu = false;
    };

    this.responder = (btn, index, correta, cap) => {
      if (respondeu) return;
      respondeu = true;

      const botoes = container.querySelectorAll('.quiz-opcao');
      const feedback = container.querySelector('#quiz-feedback');

      botoes.forEach((b, i) => {
        b.disabled = true;
        if (i === correta) {
          b.style.borderColor = '#22c55e';
          b.style.background = 'rgba(34,197,94,0.1)';
        } else if (i === index && i !== correta) {
          b.style.borderColor = '#ef4444';
          b.style.background = 'rgba(239,68,68,0.1)';
        }
      });

      if (index === correta) {
        acertos++;
        feedback.innerHTML = '<div class="alert alert-success">✅ Correto! Muito bem!</div>';
      } else {
        feedback.innerHTML = '<div class="alert alert-danger">❌ Incorreto. A resposta correta era a opção ' + String.fromCharCode(65 + correta) + '.</div>';
      }

      setTimeout(() => {
        atual++;
        if (atual < perguntas.length) {
          render();
        } else {
          const score = Math.round((acertos / perguntas.length) * 100);
          Progresso.salvarQuizScore(cap, score);
          container.innerHTML = `
            <div class="quiz-resultado text-center">
              <div style="font-size:4rem;margin-bottom:1rem">🏆</div>
              <h2>Quiz Concluido!</h2>
              <p style="font-size:1.5rem;margin:1rem 0">
                <span class="text-gradient">${acertos}/${perguntas.length}</span> acertos
              </p>
              <p style="font-size:1.2rem">Score: <strong>${score}%</strong></p>
              <div class="mt-3">
                <span class="badge ${score >= 80 ? 'badge-success' : score >= 50 ? 'badge-warning' : 'badge-danger'}">
                  ${score >= 80 ? '🌟 Excelente!' : score >= 50 ? '👍 Bom trabalho!' : '📚 Continue estudando!'}
                </span>
              </div>
              <button class="btn btn-primary mt-3" onclick="location.reload()">Tentar Novamente</button>
            </div>
          `;
        }
      }, 1500);
    };

    render();
  }
};

// ===== SISTEMA DE FLASHCARDS =====
const Flashcards = {
  criar(containerId, cards) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let atual = 0;
    let virado = false;

    const render = () => {
      const card = cards[atual];
      container.innerHTML = `
        <div class="flashcard-container">
          <div class="flashcard ${virado ? 'virado' : ''}" onclick="Flashcards.virar()">
            <div class="flashcard-face frente">
              <div class="flashcard-conteudo">${card.frente}</div>
              <small style="color:var(--text-muted)">Clique para virar</small>
            </div>
            <div class="flashcard-face verso">
              <div class="flashcard-conteudo">${card.verso}</div>
            </div>
          </div>
          <div class="flashcard-controls">
            <button class="btn btn-secondary" onclick="Flashcards.anterior()" ${atual === 0 ? 'disabled' : ''}>← Anterior</button>
            <span class="badge badge-info">${atual + 1} / ${cards.length}</span>
            <button class="btn btn-secondary" onclick="Flashcards.proximo()" ${atual === cards.length - 1 ? 'disabled' : ''}>Proximo →</button>
          </div>
        </div>
      `;
    };

    this.virar = () => {
      virado = !virado;
      render();
    };

    this.proximo = () => {
      if (atual < cards.length - 1) { atual++; virado = false; render(); }
    };

    this.anterior = () => {
      if (atual > 0) { atual--; virado = false; render(); }
    };

    render();
  }
};

// ===== SISTEMA DE DRAG & DROP =====
const DragDrop = {
  criar(containerId, pares, capitulo) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let acertos = 0;
    const total = pares.length;
    let arrastaveis = [...pares].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="dragdrop-container">
        <div class="dragdrop-alvos">
          ${pares.map((p, i) => `
            <div class="dragdrop-alvo" data-match="${i}">
              <div class="dragdrop-label">${p.alvo}</div>
              <div class="dragdrop-dropzone" ondrop="DragDrop.drop(event, ${i})" ondragover="DragDrop.allowDrop(event)">
                <span class="dragdrop-placeholder">Solte aqui</span>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="dragdrop-itens">
          <p style="color:var(--text-muted);margin-bottom:0.5rem">Arraste os itens para os lugares corretos:</p>
          ${arrastaveis.map((p, i) => `
            <div class="dragdrop-item" draggable="true" ondragstart="DragDrop.drag(event, '${p.item}')" id="item-${i}">
              ${p.item}
            </div>
          `).join('')}
        </div>
        <div id="dragdrop-feedback" class="mt-2"></div>
      </div>
    `;

    this.drag = (ev, item) => {
      ev.dataTransfer.setData('text', item);
      ev.target.style.opacity = '0.5';
    };

    this.allowDrop = (ev) => {
      ev.preventDefault();
    };

    this.drop = (ev, index) => {
      ev.preventDefault();
      const item = ev.dataTransfer.getData('text');
      const alvo = pares[index];
      const dropzone = ev.target.closest('.dragdrop-dropzone');
      const feedback = document.getElementById('dragdrop-feedback');

      if (item === alvo.item) {
        dropzone.innerHTML = `<div class="dragdrop-item dragdrop-correct">${item}</div>`;
        dropzone.style.borderColor = '#22c55e';
        acertos++;
        feedback.innerHTML = '<div class="alert alert-success">✅ Correto!</div>';
        Progresso.adicionarXP(10);

        if (acertos === total) {
          feedback.innerHTML = '<div class="alert alert-success">🎉 Parabens! Voce completou o desafio!</div>';
          Progresso.adicionarXP(50);
        }
      } else {
        dropzone.style.borderColor = '#ef4444';
        feedback.innerHTML = '<div class="alert alert-danger">❌ Tente novamente!</div>';
        setTimeout(() => {
          dropzone.style.borderColor = '';
        }, 1000);
      }

      // Restaura opacidade
      document.querySelectorAll('.dragdrop-item').forEach(el => el.style.opacity = '1');
    };
  }
};

// ===== ANIMACAO DE ENTRADA =====
const AnimacaoEntrada = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }
};

// ===== SISTEMA DE PERSONALIZACAO - PAINEL =====
const PainelPersonalizacao = {
  abrir() {
    const painel = document.createElement('div');
    painel.id = 'painel-personalizacao';
    painel.className = 'painel-overlay';
    painel.innerHTML = `
      <div class="painel-container glass">
        <div class="painel-header">
          <h2>⚙️ Personalizar Experiencia</h2>
          <button class="painel-close" onclick="PainelPersonalizacao.fechar()">&times;</button>
        </div>
        <div class="painel-body">
          <!-- Temas Rapidos -->
          <div class="painel-section">
            <h3>🎨 Temas Rapidos</h3>
            <div class="painel-grid">
              ${Object.entries(Personalizador.temas).map(([key, t]) => `
                <button class="painel-tema-btn ${Personalizador.config.tema === key ? 'ativo' : ''}" onclick="PainelPersonalizacao.setTema('${key}')">
                  <div class="painel-tema-preview tema-${key}"></div>
                  <span>${t.name}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Tipografia -->
          <div class="painel-section">
            <h3>🔤 Tipografia</h3>
            <div class="painel-field">
              <label>Fonte</label>
              <select onchange="Personalizador.setFonte(this.value)">
                ${Object.entries(Personalizador.fontes).map(([key, f]) => `
                  <option value="${key}" ${Personalizador.config.fonte === key ? 'selected' : ''}>${f.name}</option>
                `).join('')}
              </select>
            </div>
            <div class="painel-field">
              <label>Tamanho da Fonte: <span id="font-size-val">${Personalizador.config.tamanhoFonte}px</span></label>
              <input type="range" min="12" max="24" value="${Personalizador.config.tamanhoFonte}" 
                     oninput="Personalizador.setTamanhoFonte(this.value); document.getElementById('font-size-val').textContent=this.value+'px'">
            </div>
            <div class="painel-field">
              <label>Espacamento: <span id="esp-val">${Personalizador.config.espacamento}</span></label>
              <input type="range" min="1" max="2.5" step="0.1" value="${Personalizador.config.espacamento}" 
                     oninput="Personalizador.setEspacamento(this.value); document.getElementById('esp-val').textContent=this.value">
            </div>
            <div class="painel-field">
              <label>Largura do Texto: <span id="larg-val">${Personalizador.config.larguraTexto}px</span></label>
              <input type="range" min="600" max="1200" step="50" value="${Personalizador.config.larguraTexto}" 
                     oninput="Personalizador.setLarguraTexto(this.value); document.getElementById('larg-val').textContent=this.value+'px'">
            </div>
          </div>

          <!-- Cores Customizadas -->
          <div class="painel-section">
            <h3>🎨 Cores Personalizadas</h3>
            <div class="painel-grid-2">
              <div class="painel-field">
                <label>Cor do Texto</label>
                <input type="color" onchange="Personalizador.setCor('texto', this.value)">
              </div>
              <div class="painel-field">
                <label>Cor dos Titulos</label>
                <input type="color" onchange="Personalizador.setCor('titulo', this.value)">
              </div>
              <div class="painel-field">
                <label>Cor dos Links</label>
                <input type="color" onchange="Personalizador.setCor('link', this.value)">
              </div>
              <div class="painel-field">
                <label>Cor do Fundo</label>
                <input type="color" onchange="Personalizador.setCor('fundo', this.value)">
              </div>
              <div class="painel-field">
                <label>Cor dos Botoes</label>
                <input type="color" onchange="Personalizador.setCor('botao', this.value)">
              </div>
              <div class="painel-field">
                <label>Cor dos Cards</label>
                <input type="color" onchange="Personalizador.setCor('card', this.value)">
              </div>
            </div>
          </div>

          <!-- Acessibilidade -->
          <div class="painel-section">
            <h3>♿ Acessibilidade</h3>
            <div class="painel-toggle">
              <label class="toggle-switch">
                <input type="checkbox" ${Personalizador.config.altoContraste ? 'checked' : ''} onchange="Personalizador.toggleAltoContraste()">
                <span class="toggle-slider"></span>
              </label>
              <span>Alto Contraste</span>
            </div>
            <div class="painel-toggle">
              <label class="toggle-switch">
                <input type="checkbox" ${Personalizador.config.modoLeitura ? 'checked' : ''} onchange="Personalizador.toggleModoLeitura()">
                <span class="toggle-slider"></span>
              </label>
              <span>Modo Leitura Confortavel</span>
            </div>
          </div>
        </div>
        <div class="painel-footer">
          <button class="btn btn-secondary" onclick="Personalizador.resetar(); PainelPersonalizacao.fechar(); PainelPersonalizacao.abrir();">Restaurar Padroes</button>
          <button class="btn btn-primary" onclick="PainelPersonalizacao.fechar()">Fechar</button>
        </div>
      </div>
    `;
    document.body.appendChild(painel);
    painel.style.display = 'flex';
    setTimeout(() => painel.classList.add('ativo'), 10);
  },

  fechar() {
    const painel = document.getElementById('painel-personalizacao');
    if (painel) {
      painel.classList.remove('ativo');
      setTimeout(() => painel.remove(), 300);
    }
  },

  setTema(tema) {
    Personalizador.setTema(tema);
    document.querySelectorAll('.painel-tema-btn').forEach(b => b.classList.remove('ativo'));
    event.currentTarget.classList.add('ativo');
  }
};

// ===== INICIALIZACAO =====
document.addEventListener('DOMContentLoaded', () => {
  Personalizador.init();
  Progresso.init();
  AnimacaoEntrada.init();
});
