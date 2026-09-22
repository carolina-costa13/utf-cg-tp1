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
const OFFSET_BICO_X = 0.2;   // mexa se o bico não estiver centralizado horizontalmente
const OFFSET_BICO_Y = 0.2; 

export const CUSTO_DEFESAS = {
  sapos: 100,
  lagartos: 150,
  sprays: 200,
  venenos: 50
}

export let defesaSelecionada = null;
export let defesasColocadas = [];

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
export let posXMosca = 1.2;
export let posYMosca = 0.4;
export let vidaMosca = 10;
export let moscaViva = true;

// BESOURO
export let posXBesouro = 0.55;
export let posYBesouro = -0.30;
export let vidaBesouro = 4;
export let besouroVivo = true;

export let pontuacaoDinheiro = 0;
export const moedasAtivas = [];

let tempoParaProximaMoeda = 0;
const INTERVALO_MOEDA = 15.0; 


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

  atualizaMosca(quantoTempo); 
  atualizaProjeteis(quantoTempo);
  atualizaParticulasTiro(quantoTempo);
  
  //é como se fosse o relógio do jogo, usado na dificuldade
  tempoJogoTotal += quantoTempo; 
  
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

  tentarAtivarSpray(quantoTempo);


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
  // A cada 45 segundos de jogo, a horda ganha +1 no tamanho máximo/mínimo de forma bem lenta
  const bonusDificuldade = Math.floor(tempoJogoTotal / 45);
  
  // Começa com hordas de 1 a 2 formigas no bem início
  const minFormigas = Math.max(1, 1 + Math.floor(bonusDificuldade / 2));
  const maxFormigas = 2 + bonusDificuldade;
  
  const tamanhoHorda = Math.floor(Math.random() * (maxFormigas - minFormigas + 1)) + minFormigas;
  const ultimaColuna = COLUNAS - 1;

  for (let i = 0; i < tamanhoHorda; i++) {
    const linhaSorteada = Math.floor(Math.random() * LINHAS);
    const posWebGL = matrizParaWebGL(linhaSorteada, ultimaColuna);
    const offsetInicioX = Math.random() * 0.1;

    // A velocidade começa bem branda e aumenta muito sutilmente
    const bonusVelocidade = Math.min(0.08, tempoJogoTotal * 0.0003);

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

    if (!formiga.indoParaBolo) {
      formiga.posX -= formiga.velocidade * quantoTempo;

      if (formiga.posX <= posXBolo) {
        // Define se vai para cima ou para baixo com base na posição Y do bolo
        const dy = posYBolo - formiga.posY;
        formiga.indoParaBolo = dy > 0 ? 'cima' : 'baixo';
      }
    } else {
      // Movimento em direção ao bolo
      const dx = posXBolo - formiga.posX;
      const dy = posYBolo - formiga.posY;
      const distancia = Math.hypot(dx, dy);

      if (distancia < 0.05) {
        causarDanoBolo(1);
        formiga.viva = false;
      } else {
        const passo = Math.min(formiga.velocidade * quantoTempo, distancia);
        formiga.posX += (dx / distancia) * passo;
        formiga.posY += (dy / distancia) * passo;
      }
    }
  }
}

// ==========================================
// FORMIGAS VERMELHAS
// ==========================================
export let formigasVermelhasAtivas = [];
let tempoGeracaoVermelha = 0;            

export function geraHordaFormigaVermelha() {
 // Só começa a escalar de verdade depois de um tempo de jogo (ex: após 30 segundos)
  if (tempoJogoTotal < 30) return; 

  const bonusDificuldade = Math.floor((tempoJogoTotal - 30) / 60); // Evolui a cada 1 min
  
  const minFormigas = 1;
  const maxFormigas = 1 + bonusDificuldade;

  const tamanhoHorda = Math.floor(Math.random() * (maxFormigas - minFormigas + 1)) + minFormigas;
  const ultimaColuna = COLUNAS - 1;

  for (let i = 0; i < tamanhoHorda; i++) {
    const linhaSorteada = Math.floor(Math.random() * LINHAS);
    const posWebGL = matrizParaWebGL(linhaSorteada, ultimaColuna);
    const offsetInicioX = Math.random() * 0.1;

    const bonusVelocidade = Math.min(0.1, (tempoJogoTotal - 30) * 0.0005);

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

    if (!formiga.indoParaBolo) {
      formiga.posX -= formiga.velocidade * quantoTempo;

      if (formiga.posX <= posXBolo) {
        formiga.indoParaBolo = true;
      }
    } else {
      const dx = posXBolo - formiga.posX;
      const dy = posYBolo - formiga.posY;
      const distancia = Math.hypot(dx, dy);

      if (distancia < 0.05) {
        causarDanoBolo(2); // Formiga vermelha pode causar mais dano se quiser (ex: 2)
        formiga.viva = false;
        console.log("Formiga Vermelha chegou ao bolo e causou dano!");
      } else {
        const passo = Math.min(formiga.velocidade * quantoTempo, distancia);
        formiga.posX += (dx / distancia) * passo;
        formiga.posY += (dy / distancia) * passo;
      }
    }
  }
}


// ==========================================
// FUNÇÕES UTILITÁRIAS E LÓGICA GERAL
// ==========================================

/*Converte a ideia de matriz para coordenadas. Tradutor de idiomas
entre a lógica do programa e o WebGL. Usada pelas funções que geram 
as hordas */
export function matrizParaWebGL(linha, coluna) {
  const minX = -0.5, maxX = 0.5;
  const minY = -0.5, maxY = 0.5;

  const x = minX + (coluna / (COLUNAS - 1)) * (maxX - minX);
  const y = maxY - (linha / (LINHAS - 1)) * (maxY - minY);

  return { x, y };
}


export function webGLParaMatriz(x, y) {
  const minX = -0.5, maxX = 0.5;
  const minY = -0.5, maxY = 0.5;

  // Verifica se o clique foi fora do tabuleiro jogável
  if (x < minX || x > maxX || y < minY || y > maxY) {
    return null; 
  }

  // Mapeia X para Coluna (0 até COLUNAS - 1)
  const coluna = Math.round(((x - minX) / (maxX - minX)) * (COLUNAS - 1));
  
  // Mapeia Y para Linha (0 até LINHAS - 1, invertendo a orientação do Y)
  const linha = Math.round(((maxY - y) / (maxY - minY)) * (LINHAS - 1));

  return { linha, coluna };
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

  // 4. Verificação com a Mosca
  if (moscaViva) {
    const distMoscaX = Math.abs(posXMosca - posXSapo);
    const distMoscaY = Math.abs(posYMosca - posYSapo);

    if (distMoscaX < raioSapo && distMoscaY < raioSapo) {
      causarDanoSapo(1);
      // Se quiser que a mosca suma ao encostar ou continue viva, você decide aqui. 
      // Por padrão, vamos apenas causar o dano:
      console.log(`A mosca atingiu o Sapo! Vida restante: ${vidaSapo}`);
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
  if (tempoJogoTotal < 45) return; 

  // A dificuldade escala de forma bem lenta a cada 60 segundos após o surgimento deles
  const bonusDificuldade = Math.floor((tempoJogoTotal - 45) / 60); 
  
  const minBesouros = 1;
  const maxBesouros = 1 + bonusDificuldade;

  const tamanhoHorda = Math.floor(Math.random() * (maxBesouros - minBesouros + 1)) + minBesouros;
  const ultimaColuna = COLUNAS - 1;

  for (let i = 0; i < tamanhoHorda; i++) {
    const linhaSorteada = Math.floor(Math.random() * LINHAS);
    const posWebGL = matrizParaWebGL(linhaSorteada, ultimaColuna);
    const offsetInicioX = Math.random() * 0.1;

    const bonusVelocidade = Math.min(0.1, (tempoJogoTotal - 30) * 0.0005);

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

export function tentarAtivarSpray(quantoTempo) {
  if (usosRestantesSpray <= 0) return;

  // Procura se existe pelo menos uma torre de spray ativa no tabuleiro
  const spraysAtivos = defesasColocadas.filter(d => d.tipo === 'sprays' && d.viva);
  if (spraysAtivos.length === 0) return; 

  tempoUltimoDisparoSpray += quantoTempo;

  if (tempoUltimoDisparoSpray >= COOLDOWN_SPRAY) {
    // Dispara a fumaça a partir da posição de cada spray construído no tabuleiro
    for (const spray of spraysAtivos) {
      if (temInsetoNoAlcance(spray.posX, spray.posY)) {
        disparaSpray(spray.posX, spray.posY);
        usosRestantesSpray -= 1;
        tempoUltimoDisparoSpray = 0;
      }
    }
  }
}

export function disparaSpray(posXBase, posYBase) {
  fumacasAtivas.push({
    posX: posXBase + OFFSET_BICO_X,
    posY: posYBase + OFFSET_BICO_Y,
    vida: 1.0,
    tamanho: 0.20
  });
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


export function atualizaFumaca(quantoTempo) {
  for (let i = fumacasAtivas.length - 1; i >= 0; i--) {
    const f = fumacasAtivas[i];

    // A posição da fumaça já foi definida corretamente em disparaSpray(),
    // vinculada à torre específica que a disparou (f.posX / f.posY).
    // Como as torres de spray não se movem, não é necessário recalcular
    // a posição a cada frame aqui.

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
// ==========================================
// BOLO 
// ==========================================
/*O que acontece com o bolo ao ser atacado por qualquer inimigo */
export const posXBolo = -0.65;
export const posYBolo = 0.0;
export let vidaBolo = 10;
export let boloVivo = true;

/*Como o bolo não ataca, então só tem essa função, só pode ser atacado*/
export function causarDanoBolo(dano) {
  if (!boloVivo) return;
  vidaBolo -= dano;
  if (vidaBolo <= 0) {
    vidaBolo = 0;
    boloVivo = false;
    console.log("O bolo foi devorado! Game Over.");
  }
}

/* ==========================================
   TORRES: lista de tudo que os inimigos podem atacar.
   Toda torre tem a mesma "cara": posX, posY, viva e receberDano().
   Dessa forma a mosca não precisa saber quem é quem, é só chamar 
   uma torre e tacar o pau nela.
  ==========================================*/
export const torres = [
  {
    nome: 'bolo',
    posX: posXBolo,
    posY: posYBolo,
    // função que retorna sempre o valor atual da vida daquela torre.
    get viva() { return boloVivo; },
    // Guarda a função receberDano na torre. Quando é atingido chama ela.
    receberDano: causarDanoBolo
  },

  // {
  //   nome: 'sapo',
  //   posX: posXSapo,
  //   posY: posYSapo,
  //   get viva() { return sapoVivo; },
  //   receberDano: causarDanoSapo
  // },


];


// ==========================================
// MOSCA (ataque à distância)
// ==========================================
/*O canvas vai de -1 a 1, ou seja, a tela tem 2 unidades de largura.
  Então 0.2 por segundo é 10% da tela por segundo, e atravessar a tela 
  inteira leva 10 s.*/
const MOSCA_VELOCIDADE = 0.2;       
const MOSCA_ALCANCE = 0.4;          // distância a partir da qual ela para e atira
const MOSCA_DANO = 0.5;               // dano de cada projétil

// Animação fly_shoot (da mosca atirando): 7 quadros de 83 ms
const TIRO_TOTAL_FRAMES = 7;
const TIRO_DURACAO_FRAME = 0.083;
const TIRO_FRAME_DISPARO = 4;       // quadro em que o projétil sai (ajuste olhando a sprite)
const TIRO_PAUSA = 0.6;             // descanso entre um tiro e outro
const TIRO_DURACAO_ANIM = TIRO_TOTAL_FRAMES * TIRO_DURACAO_FRAME;
const TIRO_CICLO = TIRO_DURACAO_ANIM + TIRO_PAUSA;

// De onde o tiro sai, em relação ao centro da mosca (ajuste a olho)
const BOCA_DESLOC_X = 0.12;
const BOCA_DESLOC_Y = -0.02;

export let moscaOlhandoEsquerda = true;
export let moscaAtacando = false;   // está no alcance (vai parar de andar e atacar)
export let moscaAtirando = false;   // está tocando a animação do tiro agora
export let frameMoscaTiro = 0;

let alvoMosca = null;
let tempoCicloTiro = 0;
let jaDisparou = false;

// Essa função é chamada mais a frente.
function torreMaisProxima(x, y) {
  let melhor = null;
  let melhorDist = Infinity;
  for (const torre of torres) {
    //Pula as torres mortas
    if (!torre.viva) continue;

    //Calcula a distância das vivas e pega a menor
    const d = Math.hypot(torre.posX - x, torre.posY - y);
    if (d < melhorDist) {
      melhorDist = d;
      melhor = torre;
    }
  }
  return melhor;
}


//Faz a mosca andar, escolher o alvo e atirar (coração).
export function atualizaMosca(quantoTempo) {
  // Se a mosca tá morta, deixa quieto.
  if (!moscaViva) return;

  // Enquanto está atirando numa torre viva, continua nela (um alvo por vez).
  // Caso contrário, escolhe a torre viva mais próxima.
  const travadaNoAlvo = moscaAtacando && alvoMosca && alvoMosca.viva;
  if (!travadaNoAlvo) {
    alvoMosca = torreMaisProxima(posXMosca, posYMosca);
    moscaAtacando = false;
  }

  if (!alvoMosca) {
    // sem torres vivas: segue voando pra esquerda
    moscaAtacando = false;
    moscaAtirando = false;
    moscaOlhandoEsquerda = true;
    if (posXMosca > -1.3) posXMosca -= MOSCA_VELOCIDADE * quantoTempo;
    return;
  }

  //Calcula a distância da mosca até o seu alvo e vai andando na direção dele.
  const dx = alvoMosca.posX - posXMosca;
  const dy = alvoMosca.posY - posYMosca;
  const distancia = Math.hypot(dx, dy);

  if (Math.abs(dx) > 0.01) moscaOlhandoEsquerda = dx < 0;


  //Se tá longe do alvo, continua aproximando
  if (distancia > MOSCA_ALCANCE) {
    // ANDAR em direção ao alvo
    moscaAtacando = false;
    moscaAtirando = false;
    tempoCicloTiro = 0;
    jaDisparou = false;
    // A conta dx / distancia dá a direção com comprimento 1, 
    // e multiplicando por velocidade × quantoTempo (m/s * s = m) 
    // você obtém quanto a mosca deve andar neste frame.
    posXMosca += (dx / distancia) * MOSCA_VELOCIDADE * quantoTempo;
    posYMosca += (dy / distancia) * MOSCA_VELOCIDADE * quantoTempo;
    return;
  }

  // O alvo está no alcance, endão ela deve parar e atirar:
  // um ciclo = animação do tiro + pausa
  moscaAtacando = true;
  tempoCicloTiro += quantoTempo;
  if (tempoCicloTiro >= TIRO_CICLO) {
    tempoCicloTiro -= TIRO_CICLO;
    jaDisparou = false;
  }

  moscaAtirando = tempoCicloTiro < TIRO_DURACAO_ANIM;
  frameMoscaTiro = Math.min(
    TIRO_TOTAL_FRAMES - 1,
    Math.floor(tempoCicloTiro / TIRO_DURACAO_FRAME)
  );

  // Solta o projétil uma vez por ciclo, no quadro certo da animação
  if (moscaAtirando && !jaDisparou && frameMoscaTiro >= TIRO_FRAME_DISPARO) {
    disparaProjetil(alvoMosca);
    jaDisparou = true;
  }
}

// ==========================================
// PROJÉTEIS E PARTÍCULAS DE TIRO
// ==========================================
const PROJETIL_VELOCIDADE = 0.9;
const PROJETIL_RAIO_ACERTO = 0.1;     // quão perto do centro da torre conta como acerto
const PROJETIL_DURACAO_FRAME = 0.5;   // 2 quadros de 500 ms

const PARTICULA_TOTAL_FRAMES = 6;
const PARTICULA_DURACAO_FRAME = 0.08;

export let projeteis = [];
export let particulasTiro = [];

function disparaProjetil(alvo) {
  const direcao = moscaOlhandoEsquerda ? -1 : 1;
  // De onde sai o projétil
  const origemX = posXMosca + direcao * BOCA_DESLOC_X;
  const origemY = posYMosca + BOCA_DESLOC_Y;

  // Cada projétil guarda o objeto torre mais perto
  projeteis.push({
    posX: origemX,
    posY: origemY,
    alvo: alvo,
    angulo: 0,
    tempo: 0,
    frame: 0
  });

  particulasTiro.push({
    posX: origemX,
    posY: origemY,
    olhandoEsquerda: moscaOlhandoEsquerda,
    tempo: 0,
    frame: 0
  });
}

export function atualizaProjeteis(quantoTempo) {
  for (let i = projeteis.length - 1; i >= 0; i--) {
    const p = projeteis[i];

    // se a torre já morreu, o projétil some
    if (!p.alvo.viva) {
      //função "splice": remove um item e desloca os seguintes
      projeteis.splice(i, 1);
      continue;
    }

    const dx = p.alvo.posX - p.posX;
    const dy = p.alvo.posY - p.posY;
    const distancia = Math.hypot(dx, dy);

    // Se chegou perto, acertou. Causa dano no elemento da lista de torres e some
    if (distancia <= PROJETIL_RAIO_ACERTO) {
      p.alvo.receberDano(MOSCA_DANO);
      projeteis.splice(i, 1);
      continue;
    }

    // Se ainda não atingiu o alvo, vai voando em direção a ele.
    const passo = Math.min(PROJETIL_VELOCIDADE * quantoTempo, distancia); //Impede que o projétil passe do alvo 
    p.posX += (dx / distancia) * passo;
    p.posY += (dy / distancia) * passo;
    p.angulo = Math.atan2(dy, dx);

    p.tempo += quantoTempo;
    p.frame = Math.floor(p.tempo / PROJETIL_DURACAO_FRAME) % 2;
  }
}

export function atualizaParticulasTiro(quantoTempo) {
  for (let i = particulasTiro.length - 1; i >= 0; i--) {
    const p = particulasTiro[i];
    p.tempo += quantoTempo;

    if (p.tempo >= PARTICULA_TOTAL_FRAMES * PARTICULA_DURACAO_FRAME) {
      particulasTiro.splice(i, 1);
      continue;
    }
    p.frame = Math.floor(p.tempo / PARTICULA_DURACAO_FRAME);
  }
}

// ==========================================
// SISTEMA DE MOEDAS
// ==========================================
const LIMITE_X_MIN = -0.7;
const LIMITE_X_MAX = 0.7;
const LIMITE_Y_MIN = -0.7;
const LIMITE_Y_MAX = 0.7;

const TAMANHO_MOEDA = 0.10;

export function criarMoedaAleatoria() {
  const posX = LIMITE_X_MIN + Math.random() * (LIMITE_X_MAX - LIMITE_X_MIN);
  const posY = LIMITE_Y_MIN + Math.random() * (LIMITE_Y_MAX - LIMITE_Y_MIN);

  moedasAtivas.push({
    posX: posX,
    posY: posY,
    coletada: false
  });
}

export function verificarCliqueMoeda(xWebGL, yWebGL) {
  // Aumenta o raio de detecção (ex: 0.12) para que o clique seja preciso
  const RAIO_HITBOX = 0.12;

  for (let i = moedasAtivas.length - 1; i >= 0; i--) {
    const moeda = moedasAtivas[i];

    const dx = xWebGL - moeda.posX;
    const dy = yWebGL - moeda.posY;
    const distancia = Math.hypot(dx, dy);

    if (distancia <= RAIO_HITBOX) {
      // 1. Incrementa o dinheiro
      pontuacaoDinheiro += 50;
      console.log(`Moeda coletada! Total: ${pontuacaoDinheiro}`);

      // 2. Remove a moeda da lista para fazê-la sumir da tela
      moedasAtivas.splice(i, 1);
      return true;
    }
  }

  return false;
}

export function atualizaMoedas(quantoTempo) {
  tempoParaProximaMoeda += quantoTempo;

  if (tempoParaProximaMoeda >= INTERVALO_MOEDA) {
    criarMoedaAleatoria();
    tempoParaProximaMoeda = 0;
  }
}
// ==========================================
// SISTEMA DE DEFESAS E LOJA
// ==========================================

/**
 * Seleciona o tipo de defesa que o jogador quer comprar
 */
export function selecionarDefesa(tipo) {
  if (CUSTO_DEFESAS[tipo] !== undefined) {
    defesaSelecionada = tipo;
    console.log(`Defesa selecionada: ${tipo}. Clique no tabuleiro para posicionar.`);
  }
}

/**
 * Tenta posicionar a defesa selecionada na posição clicada do tabuleiro
 */
export function tentarPosicionarDefesa(xWebGL, yWebGL) {
  // 1. Se nenhuma defesa foi selecionada, ignora
  if (!defesaSelecionada) return false;

  const custo = CUSTO_DEFESAS[defesaSelecionada];

  // 2. Verifica se o jogador tem dinheiro suficiente
  if (pontuacaoDinheiro < custo) {
    console.log(`Moedas insuficientes! Você precisa de ${custo} moedas.`);
    return false;
  }

  // 3. Converte a coordenada clicada para a célula da matriz
  const celula = webGLParaMatriz(xWebGL, yWebGL);
  if (!celula) {
    console.log("Clique fora do tabuleiro jogável!");
    return false;
  }

  const { linha, coluna } = celula;

  // 4. Verifica se a posição já está ocupada (0 = Livre)
  if (tabuleiro[linha][coluna] !== 0) {
    console.log("Posição ocupada!");
    return false;
  }

  // 5. Deduz o dinheiro e posiciona a defesa
  pontuacaoDinheiro -= custo;
  
  // Marca na matriz (ex: 3 para Sapo/Defesa)
  tabuleiro[linha][coluna] = 3; 

  const posWebGL = matrizParaWebGL(linha, coluna);

  const novaDefesa = {
    id: Date.now(),
    tipo: defesaSelecionada,
    linha: linha,
    coluna: coluna,
    posX: posWebGL.x,
    posY: posWebGL.y,
    vida: 5,
    viva: true
  };

  defesasColocadas.push(novaDefesa);

  // Se a defesa tiver vida e puder ser atacada, adiciona à lista de alvos dos inimigos
  torres.push({
    nome: defesaSelecionada,
    posX: posWebGL.x,
    posY: posWebGL.y,
    get viva() { return novaDefesa.viva; },
    receberDano: (dano) => {
      novaDefesa.vida -= dano;
      if (novaDefesa.vida <= 0) {
        novaDefesa.viva = false;
        tabuleiro[linha][coluna] = 0; // Libera o espaço na matriz
      }
    }
  });

  console.log(`${defesaSelecionada} colocada na linha ${linha}, coluna ${coluna}!`);

  // Reseta a seleção após colocar
  defesaSelecionada = null;
  return true;
}

