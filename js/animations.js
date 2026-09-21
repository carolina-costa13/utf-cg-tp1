let tempoJogoTotal = 0;

const INTERVALO_BASE_MARROM = 6.0;  // Começa com 6s entre hordas
const INTERVALO_MIN_MARROM = 2.0;   // Limite rápido: hordas a cada 2s

const INTERVALO_BASE_VERMELHA = 10.0; // Começa com 10s entre hordas
const INTERVALO_MIN_VERMELHA = 3.5;  // Limite rápido: hordas a cada 3.5s

const INTERVALO_BASE_BESOUROS = 7.0; // Começa com 10s entre hordas
const INTERVALO_MIN_BESOUROS = 3.5;  // Limite rápido: hordas a cada 3.5s

const RAIO_ALCANCE_SPRAY = 0.35;

let tempoUltimoDisparoSpray = 0;
const COOLDOWN_SPRAY = 0.5; // Intervalo de 0.5 segundos entre disparos
const DANO_SPRAY_POR_SEGUNDO = 100;

export let usosRestantesSpray = 10;
export let fumacasAtivas = [];
export let posXSpray = -0.35;
export let posYSpray = 0.25;

// Declarando e exportando todas as variáveis de controle de quadros para renderização
export let frameMosca = 0;
export let frameFormiga = 0;
export let frameLingua = 0;
export let frameLagarto = 0;
export let frameBesouro = 0;
export let frameMoeda = 0;
export let frameFormigaVermelha = 0;

// Variáveis internas para controle de tempo acumulado
let tempoAnimacaoMosca = 0;
let tempoAnimacaoFormiga = 0;
let tempoAnimacaoLingua = 0;
let tempoAnimacaoLagarto = 0;
let tempoAnimacaoBesouro = 0;
let tempoAnimacaoMoeda = 0;

// MOSCA
export let posXMosca = 0.0;
export let posYMosca = 0.4;
export let vidaMosca = 2;
export let moscaViva = true;

// BESOURO
export let posXBesouro = 0.55;
export let posYBesouro = -0.30;
export let vidaBesouro = 4;
export let besouroVivo = true;


// TABULEIRO DA MATRIZ (11 linhas x 7 colunas)
export const LINHAS = 11;
export const COLUNAS = 7;
export let tabuleiro = Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));

export function atualizaLogica(quantoTempo) {
  animacaoMosca(quantoTempo);
  animacaoSapo(quantoTempo);
  animacaoLagarto(quantoTempo);
  animacaoBesouro(quantoTempo);
  animacaoMoeda(quantoTempo);
  
  tempoJogoTotal += quantoTempo;

  // Atualização dos quadros de animação
  tempoAnimacaoFormiga += quantoTempo;
  if (tempoAnimacaoFormiga >= 0.15) {
    frameFormiga = (frameFormiga + 1) % 3;
    frameFormigaVermelha = (frameFormigaVermelha + 1) % 3;
    tempoAnimacaoFormiga = 0;
  }

  // Atualiza as formigas simples e vermelhas
  atualizaFormigas(quantoTempo);
  atualizaFormigasVermelhas(quantoTempo);
  atualizaBesouros(quantoTempo);
  atualizaFumaca(quantoTempo)

  tentarAtivarSpray(posXSpray, posYSpray, quantoTempo);


  // Checa colisões
  checaColisaoSapo();
  checaDanoSapo();
}


// ==========================================
// FORMIGAS (PADRÃO / MARROM)
// ==========================================
export let formigasAtivas = [];
let tempoGeracaoFormiga = 0;

export function geraHordaFormiga() {
  // Aumenta 1 formiga extra a cada 30 segundos de jogo
  const bonusDificuldade = Math.floor(tempoJogoTotal / 30);
  
  const minFormigas = 2 + bonusDificuldade;
  const maxFormigas = 4 + bonusDificuldade;
  
  const tamanhoHorda = Math.floor(Math.random() * (maxFormigas - minFormigas + 1)) + minFormigas;
  const ultimaColuna = COLUNAS - 1;

  for (let i = 0; i < tamanhoHorda; i++) {
    const linhaSorteada = Math.floor(Math.random() * LINHAS);
    const posWebGL = matrizParaWebGL(linhaSorteada, ultimaColuna);
    const offsetInicioX = Math.random() * 0.1;

    // A velocidade base aumenta levemente com o tempo
    const bonusVelocidade = Math.min(0.1, tempoJogoTotal * 0.0005);

    const novaFormiga = {
      id: Date.now() + Math.random(),
      linha: linhaSorteada,
      coluna: ultimaColuna,
      posX: posWebGL.x + offsetInicioX,
      posY: posWebGL.y,
      vida: 2,
      viva: true,
      velocidade: 0.12 + bonusVelocidade + Math.random() * 0.04
    };

    tabuleiro[linhaSorteada][ultimaColuna] = 1;
    formigasAtivas.push(novaFormiga);
  }
}

export function atualizaFormigas(quantoTempo) {
  tempoGeracaoFormiga += quantoTempo;

  // Calcula o intervalo atual: reduz a cada segundo de jogo até o limite mínimo
  const reduzIntervalo = tempoJogoTotal * 0.02; 
  const intervaloAtual = Math.max(INTERVALO_MIN_MARROM, INTERVALO_BASE_MARROM - reduzIntervalo);

  if (tempoGeracaoFormiga >= intervaloAtual) {
    geraHordaFormiga();
    tempoGeracaoFormiga = 0;
  }

  for (let i = formigasAtivas.length - 1; i >= 0; i--) {
    const formiga = formigasAtivas[i];

    if (!formiga.viva) {
      formigasAtivas.splice(i, 1);
      continue;
    }

    formiga.posX -= formiga.velocidade * quantoTempo;

    if (formiga.posX < -0.8) {
      formiga.viva = false;
    }
  }
}

// ==========================================
// FORMIGAS VERMELHAS
// ==========================================
export let formigasVermelhasAtivas = [];
let tempoGeracaoVermelha = 0;            

export function geraHordaFormigaVermelha() {
  const bonusDificuldade = Math.floor(tempoJogoTotal / 45); // Aumenta a cada 45s
  
  const minFormigas = 1 + bonusDificuldade;
  const maxFormigas = 2 + bonusDificuldade;

  const tamanhoHorda = Math.floor(Math.random() * (maxFormigas - minFormigas + 1)) + minFormigas;
  const ultimaColuna = COLUNAS - 1;

  for (let i = 0; i < tamanhoHorda; i++) {
    const linhaSorteada = Math.floor(Math.random() * LINHAS);
    const posWebGL = matrizParaWebGL(linhaSorteada, ultimaColuna);
    const offsetInicioX = Math.random() * 0.1;

    const bonusVelocidade = Math.min(0.12, tempoJogoTotal * 0.0006);

    const novaFormiga = {
      id: Date.now() + Math.random(),
      linha: linhaSorteada,
      coluna: ultimaColuna,
      posX: posWebGL.x + offsetInicioX,
      posY: posWebGL.y,
      vida: 4,
      viva: true,
      velocidade: 0.18 + bonusVelocidade + Math.random() * 0.05
    };

    tabuleiro[linhaSorteada][ultimaColuna] = 2;
    formigasVermelhasAtivas.push(novaFormiga);
  }
}

export function atualizaFormigasVermelhas(quantoTempo) {
  tempoGeracaoVermelha += quantoTempo;

  const reduzIntervalo = tempoJogoTotal * 0.025;
  const intervaloAtual = Math.max(INTERVALO_MIN_VERMELHA, INTERVALO_BASE_VERMELHA - reduzIntervalo);

  if (tempoGeracaoVermelha >= intervaloAtual) {
    geraHordaFormigaVermelha();
    tempoGeracaoVermelha = 0;
  }

  for (let i = formigasVermelhasAtivas.length - 1; i >= 0; i--) {
    const formiga = formigasVermelhasAtivas[i];

    if (!formiga.viva) {
      formigasVermelhasAtivas.splice(i, 1);
      continue;
    }

    formiga.posX -= formiga.velocidade * quantoTempo;

    if (formiga.posX < -0.8) {
      formiga.viva = false;
    }
  }
}
// ==========================================
// FUNÇÕES UTILITÁRIAS E LÓGICA GERAL
// ==========================================

export function matrizParaWebGL(linha, coluna) {
  const minX = -0.5, maxX = 0.5;
  const minY = -0.5, maxY = 0.5;

  const x = minX + (coluna / (COLUNAS - 1)) * (maxX - minX);
  const y = maxY - (linha / (LINHAS - 1)) * (maxY - minY);

  return { x, y };
}


// Coordenadas fixas do corpo do Sapo no WebGL
const posXSapo = -0.5;
const posYSapo = -0.4;
const raioSapo = 0.12; // Raio de colisão do corpo do Sapo

// ==========================================
// COLISÃO DO SAPO
// ==========================================
export function checaColisaoSapo() {
  const sapoAtacando = (frameLingua === 2 || frameLingua === 1);
  if (!sapoAtacando) return;

  const alcancePontaLinguaX = -0.5 + 0.35; 
  const posYSapo = -0.4;

  // 1. Colisão com Formigas
  for (const formiga of formigasAtivas) {
    if (!formiga.viva) continue;

    const distX = Math.abs(alcancePontaLinguaX - formiga.posX);
    const distY = Math.abs(posYSapo - formiga.posY);

    if (distX < 0.1 && distY < 0.15) {
      formiga.vida -= 1;
      console.log(`Sapo acertou Formiga! Vida restante: ${formiga.vida}`);

      if (formiga.vida <= 0) {
        formiga.viva = false;
        console.log("Formiga morreu!");
      }
    }
  }

  // 2. Colisão com Formigas Vermelhas
  for (const formiga of formigasVermelhasAtivas) {
    if (!formiga.viva) continue;

    const distX = Math.abs(alcancePontaLinguaX - formiga.posX);
    const distY = Math.abs(posYSapo - formiga.posY);

    if (distX < 0.1 && distY < 0.15) {
      formiga.vida -= 1;
      console.log(`Sapo acertou Formiga Vermelha! Vida restante: ${formiga.vida}`);

      if (formiga.vida <= 0) {
        formiga.viva = false;
        console.log("Formiga Vermelha morreu!");
      }
    }
  }

  // 3. Mosca
  if (moscaViva) {
    const distMoscaX = Math.abs(alcancePontaLinguaX - posXMosca);
    const distMoscaY = Math.abs(posYSapo - posYMosca);
    if (distMoscaX < 0.12 && distMoscaY < 0.15) {
      causarDanoMosca(1);
    }
  }

  // 4. Besouro
 for (const besouro of besourosAtivos) {
    if (!besouro.vivo) continue;

    const distX = Math.abs(alcancePontaLinguaX - besouro.posX);
    const distY = Math.abs(posYSapo - besouro.posY);

    if (distX < 0.1 && distY < 0.15) {
      besouro.vida -= 1;
      console.log(`Sapo acertou besouro! Vida restante: ${besouro.vida}`);

      if (besouro.vida <= 0) {
        besouro.vivo = false;
        console.log("Besouro morreu!");
      }
    }
  }
}

// Animações dos outros animais
export function animacaoMosca(quantoTempo) {
  tempoAnimacaoMosca += quantoTempo;
  if (tempoAnimacaoMosca >= 0.08) {
    frameMosca = (frameMosca + 1) % 16;
    tempoAnimacaoMosca = 0;
  }
}

export function animacaoSapo(quantoTempo) {
  tempoAnimacaoLingua += quantoTempo;
  if (tempoAnimacaoLingua >= 0.5) {
    frameLingua = (frameLingua + 1) % 2;
    tempoAnimacaoLingua = 0;
  }
}

export function animacaoLagarto(quantoTempo) {
  tempoAnimacaoLagarto += quantoTempo;
  if (tempoAnimacaoLagarto >= 0.3) {
    frameLagarto = (frameLagarto + 1) % 4;
    tempoAnimacaoLagarto = 0;
  }
}

export function animacaoBesouro(quantoTempo) {
  tempoAnimacaoBesouro += quantoTempo;
  if (tempoAnimacaoBesouro >= 0.12) {
    frameBesouro = (frameBesouro + 1) % 3;
    tempoAnimacaoBesouro = 0;
  }
}

export function animacaoMoeda(quantoTempo) {
  tempoAnimacaoMoeda += quantoTempo;
  if (tempoAnimacaoMoeda >= 0.12) {
    frameMoeda = (frameMoeda + 1) % 9;
    tempoAnimacaoMoeda = 0;
  }
}

export function causarDanoMosca(dano) {
  if (!moscaViva) return;
  vidaMosca -= dano;
  if (vidaMosca <= 0) {
    vidaMosca = 0;
    moscaViva = false;
  }
}

export function causarDanoBesouro(dano) {
  if (!besouroVivo) return;
  vidaBesouro -= dano;
  if (vidaBesouro <= 0) {
    vidaBesouro = 0;
    besouroVivo = false;
  }
}

export let vidaSapo = 5; // Defina os pontos de vida iniciais do Sapo
export let sapoVivo = true;

// ==========================================
// COLISÃO DE DANO NO CORPO DO SAPO
// ==========================================
export function checaDanoSapo() {
  if (!sapoVivo) return;

  const sapoAtacando = (frameLingua === 1 || frameLingua === 2);
  if (sapoAtacando) return;

  // 1. Verificação com Formigas Comuns
  for (const formiga of formigasAtivas) {
    if (!formiga.viva) continue;

    const distX = Math.abs(formiga.posX - posXSapo);
    const distY = Math.abs(formiga.posY - posYSapo);

    if (distX < raioSapo && distY < raioSapo) {
      causarDanoSapo(1);
      formiga.viva = false;
      console.log(`Formiga atingiu o Sapo! Vida restante: ${vidaSapo}`);
    }
  }

  // 2. Verificação com Formigas Vermelhas
  for (const formiga of formigasVermelhasAtivas) {
    if (!formiga.viva) continue;

    const distX = Math.abs(formiga.posX - posXSapo);
    const distY = Math.abs(formiga.posY - posYSapo);

    if (distX < raioSapo && distY < raioSapo) {
      causarDanoSapo(1);
      formiga.viva = false;
      console.log(`Formiga Vermelha atingiu o Sapo! Vida restante: ${vidaSapo}`);
    }
  }

  // 3. Verificação com Besouros 
  for (const besouro of besourosAtivos) {
    if (!besouro.vivo) continue;

    const distX = Math.abs(besouro.posX - posXSapo);
    const distY = Math.abs(besouro.posY - posYSapo);

    if (distX < raioSapo && distY < raioSapo) {
      causarDanoSapo(1);
      besouro.vivo = false;
      console.log(`Besouro atingiu o Sapo! Vida restante: ${vidaSapo}`);
    }
  }
}

export function causarDanoSapo(dano) {
  if (!sapoVivo) return;

  vidaSapo -= dano;
  if (vidaSapo <= 0) {
    vidaSapo = 0;
    sapoVivo = false;
    console.log("O Sapo foi derrotado! Game Over.");
  }
}

export let besourosAtivos = [];
let tempoGeracaoBesouros = 0;            

export function geraHordaBesouro() {
  const bonusDificuldade = Math.floor(tempoJogoTotal / 45); 
  
  const minBesouros = 1 + bonusDificuldade;
  const maxBesouros = 2 + bonusDificuldade;

  const tamanhoHorda = Math.floor(Math.random() * (maxBesouros - minBesouros + 1)) + minBesouros;
  const ultimaColuna = COLUNAS - 1;

  for (let i = 0; i < tamanhoHorda; i++) {
    const linhaSorteada = Math.floor(Math.random() * LINHAS);
    const posWebGL = matrizParaWebGL(linhaSorteada, ultimaColuna);
    const offsetInicioX = Math.random() * 0.1;

    const bonusVelocidade = Math.min(0.12, tempoJogoTotal * 0.0006);

    const novoBesouro = {
      id: Date.now() + Math.random(),
      linha: linhaSorteada,
      coluna: ultimaColuna,
      posX: posWebGL.x + offsetInicioX,
      posY: posWebGL.y,
      vida: 4,
      vivo: true, 
      velocidade: 0.18 + bonusVelocidade + Math.random() * 0.05
    };

    tabuleiro[linhaSorteada][ultimaColuna] = 2;
    besourosAtivos.push(novoBesouro);
  }
}

export function atualizaBesouros(quantoTempo) {
  tempoGeracaoBesouros += quantoTempo;

  const reduzIntervalo = tempoJogoTotal * 0.025;
  const intervaloAtual = Math.max(INTERVALO_MIN_BESOUROS, INTERVALO_BASE_BESOUROS - reduzIntervalo);

  if (tempoGeracaoBesouros >= intervaloAtual) {
    geraHordaBesouro(); 
    tempoGeracaoBesouros = 0;
  }

  for (let i = besourosAtivos.length - 1; i >= 0; i--) {
    const besouro = besourosAtivos[i];

    if (!besouro.vivo) {
      besourosAtivos.splice(i, 1);
      continue;
    }

    besouro.posX -= besouro.velocidade * quantoTempo;

    if (besouro.posX < -0.8) {
      besouro.vivo = false; 
    }
  }
}

function estaVivo(inseto) {
  if (typeof inseto.viva !== 'undefined') return inseto.viva;
  if (typeof inseto.vivo !== 'undefined') return inseto.vivo;
  return false;
}

export function temInsetoNoAlcance(posXBase, posYBase) {
  // Ponto de origem da checagem: bico superior da lata de spray
  const bicoX = posXBase;
  const bicoY = posYBase + ALTURA_BICO_SUPERIOR;

  // 1. Une todas as listas de insetos terrestres
  const todosInsetos = [
    ...formigasAtivas,
    ...formigasVermelhasAtivas,
    ...besourosAtivos
  ];

  for (const inseto of todosInsetos) {
    if (!estaVivo(inseto)) continue;

    const dx = inseto.posX - bicoX;
    const dy = inseto.posY - bicoY;
    const distancia = Math.hypot(dx, dy);

    if (distancia <= RAIO_ALCANCE_SPRAY) {
      return true;
    }
  }

  // 2. Checa a mosca se estiver viva
  if (typeof moscaViva !== 'undefined' && moscaViva) {
    const dx = posXMosca - bicoX;
    const dy = posYMosca - bicoY;
    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      return true;
    }
  }

  return false;
}

export function tentarAtivarSpray(posXSpray, posYSpray, quantoTempo) {
  if (usosRestantesSpray <= 0) return;

  tempoUltimoDisparoSpray += quantoTempo;

  if (tempoUltimoDisparoSpray >= COOLDOWN_SPRAY) {
    // Passa as coordenadas base para validar alcance a partir do bico
    if (temInsetoNoAlcance(posXSpray, posYSpray)) {
      disparaSpray(posXSpray, posYSpray);
      usosRestantesSpray -= 1;
      tempoUltimoDisparoSpray = 0;
    }
  }
}

export function aplicaDanoAreaSpray(posXFumaca, posYFumaca, quantoTempo) {
  // 1. Formigas Comuns
  for (let i = formigasAtivas.length - 1; i >= 0; i--) {
    const f = formigasAtivas[i];
    if (!f.viva) continue;

    const dx = f.posX - posXFumaca;
    const dy = f.posY - posYFumaca;

    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      f.vida -= DANO_SPRAY_POR_SEGUNDO * quantoTempo;
      if (f.vida <= 0) {
        f.viva = false;
        console.log("Formiga eliminada pelo Spray!");
      }
    }
  }

  // 2. Formigas Vermelhas
  for (let i = formigasVermelhasAtivas.length - 1; i >= 0; i--) {
    const fv = formigasVermelhasAtivas[i];
    if (!fv.viva) continue;

    const dx = fv.posX - posXFumaca;
    const dy = fv.posY - posYFumaca;

    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      fv.vida -= DANO_SPRAY_POR_SEGUNDO * quantoTempo;
      if (fv.vida <= 0) {
        fv.viva = false;
        console.log("Formiga Vermelha eliminada pelo Spray!");
      }
    }
  }

  // 3. Besouros
  for (let i = besourosAtivos.length - 1; i >= 0; i--) {
    const b = besourosAtivos[i];
    if (!b.vivo) continue;

    const dx = b.posX - posXFumaca;
    const dy = b.posY - posYFumaca;

    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      b.vida -= DANO_SPRAY_POR_SEGUNDO * quantoTempo;
      if (b.vida <= 0) {
        b.vivo = false;
        console.log("Besouro eliminado pelo Spray!");
      }
    }
  }

  // 4. Mosca
  if (typeof moscaViva !== 'undefined' && moscaViva) {
    const dx = posXMosca - posXFumaca;
    const dy = posYMosca - posYFumaca;

    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      if (typeof causarDanoMosca === 'function') {
        causarDanoMosca(DANO_SPRAY_POR_SEGUNDO * quantoTempo);
      }
    }
  }
}

const ALTURA_BICO_SUPERIOR = 0.2;

export function disparaSpray(posXBase, posYBase) {
  if (fumacasAtivas.length === 0) {
    fumacasAtivas.push({
      posX: posXBase,
      posY: posYBase + ALTURA_BICO_SUPERIOR, // Origem exata na ponta superior
      vida: 1.0,
      tamanho: 0.20
    });
  }
}

export function atualizaFumaca(quantoTempo) {
  for (let i = fumacasAtivas.length - 1; i >= 0; i--) {
    const f = fumacasAtivas[i];

    // Mantém a fumaça exatamente centralizada na ponta superior do spray
    f.posX = posXSpray + 0.15; // Removido o + 0.15 que tirava do centro
    f.posY = posYSpray + ALTURA_BICO_SUPERIOR;

    // Aplica dano na área da fumaça
    if (typeof aplicaDanoAreaSpray === 'function') {
      aplicaDanoAreaSpray(f.posX, f.posY, quantoTempo);
    }

    // Avança a animação
    f.vida -= quantoTempo * 1.5;

    // Remove quando a animação terminar
    if (f.vida <= 0) {
      fumacasAtivas.splice(i, 1);
    }
  }
}