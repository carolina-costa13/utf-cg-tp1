let tempoJogoTotal = 0;

const INTERVALO_BASE_MARROM = 6.0;  // Começa com 6s entre hordas
const INTERVALO_MIN_MARROM = 2.0;   // Limite rápido: hordas a cada 2s

const INTERVALO_BASE_VERMELHA = 10.0; // Começa com 10s entre hordas
const INTERVALO_MIN_VERMELHA = 3.5;  // Limite rápido: hordas a cada 3.5s

const INTERVALO_BASE_BESOUROS = 7.0; // Começa com 10s entre hordas
const INTERVALO_MIN_BESOUROS = 3.5;  // Limite rápido: hordas a cada 3.5s

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

  // Checa colisões
  checaColisaoSapo();
  checaDanoSapo();
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

