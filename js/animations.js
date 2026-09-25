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

const RAIO_VENENO = 0.2;  // distância em que o inseto "chegou perto"
const USOS_VENENO = 50;  
const RAIO_VENENO_MOSCA = 0.35;

export let pontuacao = 0;

export const CUSTO_DEFESAS = {
  sapos: 100,
  lagartos: 150,
  sprays: 200,
  venenos: 50
}

export let defesaSelecionada = null;
export let defesasColocadas = [];

export let fumacasAtivas = [];
export let posXSpray = -0.35;
export let posYSpray = 0.25;

// Declarando e exportando todas as variáveis de controle de quadros para renderização
export let frameFormiga = 0;
export let frameLingua = 0;
export let frameLagarto = 0;
export let frameBesouro = 0;
export let frameMoeda = 0;
export let frameFormigaVermelha = 0;

// Variáveis internas para controle de tempo acumulado
let tempoAnimacaoFormiga = 0;
let tempoAnimacaoLingua = 0;
let tempoAnimacaoLagarto = 0;
let tempoAnimacaoBesouro = 0;
let tempoAnimacaoMoeda = 0;

// BESOURO
export let posXBesouro = 0.55;
export let posYBesouro = -0.30;
export let vidaBesouro = 4;
export let besouroVivo = true;

export let pontuacaoDinheiro = 0;
export const moedasAtivas = [];

let tempoParaProximaMoeda = 0;
const INTERVALO_MOEDA = 5.0; 


// TABULEIRO DA MATRIZ (11 linhas x 7 colunas)
export const LINHAS = 11;
export const COLUNAS = 7;
export let tabuleiro = Array.from({ length: LINHAS }, () => Array(COLUNAS).fill(0));

export function atualizaLogica(quantoTempo) {
  atualizaAnimacaoMoscas(quantoTempo);
  animacaoSapo(quantoTempo);
  animacaoLagarto(quantoTempo);
  animacaoBesouro(quantoTempo);
  animacaoMoeda(quantoTempo);

  atualizaMoscas(quantoTempo);
  atualizaHordaMosca(quantoTempo);
  atualizaProjeteis(quantoTempo);
  atualizaParticulasTiro(quantoTempo);
  
  //é como se fosse o relógio do jogo, usado na dificuldade
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
  atualizaVenenos();

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
        const dy = posYBolo - formiga.posY;
        formiga.indoParaBolo = dy > 0 ? 'cima' : 'baixo';
      }
    } else {
      const dx = posXBolo - formiga.posX;
      const dy = posYBolo - formiga.posY;
      const distancia = Math.hypot(dx, dy);

      if (distancia < 0.05) {
        causarDanoBolo(2);
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

const raioSapo = 0.12; // Raio de colisão do corpo do Sapo


// ==========================================
// COLISÃO DO SAPO
// ==========================================


export function checaColisaoSapo() {
  const sapoAtacando = (frameLingua === 2 || frameLingua === 1);
  if (!sapoAtacando) return;

  const alcanceLinguaX = 0.4;

  // Pega todos os sapos vivos realmente colocados no tabuleiro
  const saposColocados = defesasColocadas.filter(d => d.tipo === 'sapos' && d.viva);
  if (saposColocados.length === 0) return;

  for (const sapo of saposColocados) {
    const posXSapo = sapo.posX;
    const posYSapo = sapo.posY;

    // 1. Formigas Comuns
    for (const formiga of formigasAtivas) {
      if (!formiga.viva) continue;
      const distX = formiga.posX - posXSapo;
      const distY = Math.abs(formiga.posY - posYSapo);
      if (distX >= 0 && distX <= alcanceLinguaX && distY < 0.2) {
        formiga.vida -= 1;
        if (formiga.vida <= 0) {
          formiga.viva = false;
          pontuacao += 1;
        }
      }
    }

    // 2. Formigas Vermelhas
    for (const formiga of formigasVermelhasAtivas) {
      if (!formiga.viva) continue;
      const distX = formiga.posX - posXSapo;
      const distY = Math.abs(formiga.posY - posYSapo);
      if (distX >= 0 && distX <= alcanceLinguaX && distY < 0.2) {
        formiga.vida -= 1;
        if (formiga.vida <= 0){
          formiga.viva = false;
          pontuacao += 1;
        }
      }
    }

  // 3. Mosca
  for (const mosca of moscas) {
    if (!mosca.viva) continue;

    const distMoscaX = Math.abs(alcanceLinguaX - mosca.posX);
    const distMoscaY = Math.abs(posYSapo - mosca.posY);
    if (distMoscaX < 0.4 && distMoscaY < 0.4) {
      causarDanoMosca(mosca, 1);
    }
  }

    // 4. Besouro
    for (const besouro of besourosAtivos) {
      if (!besouro.vivo) continue;
      const distX = besouro.posX - posXSapo;
      const distY = Math.abs(besouro.posY - posYSapo);
      if (distX >= 0 && distX <= alcanceLinguaX && distY < 0.2) {
        besouro.vida -= 1;
        if (besouro.vida <= 0) {
          besouro.vivo = false;
          pontuacao += 1;
        }
      }
    }
  }

}

// Animações dos outros animais

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
  const sapoAtacando = (frameLingua === 1 || frameLingua === 2);
  if (sapoAtacando) return;

  const saposColocados = defesasColocadas.filter(d => d.tipo === 'sapos' && d.viva);
  if (saposColocados.length === 0) return;

  for (const sapo of saposColocados) {
    const posXSapo = sapo.posX;
    const posYSapo = sapo.posY;

    // 1. Formigas Comuns
    for (const formiga of formigasAtivas) {
      if (!formiga.viva) continue;
      const distX = Math.abs(formiga.posX - posXSapo);
      const distY = Math.abs(formiga.posY - posYSapo);
      if (distX < raioSapo && distY < raioSapo) {
        pontuacao += 1;
        sapo.vida -= 1;
        formiga.viva = false;
        console.log(`Formiga atingiu o Sapo! Vida restante: ${sapo.vida}`);
        if (sapo.vida <= 0) sapo.viva = false;
      }
    }

    // 2. Formigas Vermelhas
    for (const formiga of formigasVermelhasAtivas) {
      if (!formiga.viva) continue;
      const distX = Math.abs(formiga.posX - posXSapo);
      const distY = Math.abs(formiga.posY - posYSapo);
      if (distX < raioSapo && distY < raioSapo) {
        sapo.vida -= 1;
        formiga.viva = false;
        console.log(`Formiga Vermelha atingiu o Sapo! Vida restante: ${sapo.vida}`);
        if (sapo.vida <= 0) sapo.viva = false;
      }
    }

    // 3. Besouros
    for (const besouro of besourosAtivos) {
      if (!besouro.vivo) continue;
      const distX = Math.abs(besouro.posX - posXSapo);
      const distY = Math.abs(besouro.posY - posYSapo);
      if (distX < raioSapo && distY < raioSapo) {
        sapo.vida -= 1;
        besouro.vivo = false;
        console.log(`Besouro atingiu o Sapo! Vida restante: ${sapo.vida}`);
        if (sapo.vida <= 0) sapo.viva = false;
      }
    }

  // 4. Verificação com a Mosca
  for (const mosca of moscas) {
    if (!mosca.viva) continue;

    const distMoscaX = Math.abs(mosca.posX - posXSapo);
    const distMoscaY = Math.abs(mosca.posY - posYSapo);

    if (distMoscaX < raioSapo && distMoscaY < raioSapo) {
      causarDanoSapo(1);
      console.log(`A mosca atingiu o Sapo! Vida restante: ${vidaSapo}`);
    }
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

    if (!besouro.indoParaBolo) {
      besouro.posX -= besouro.velocidade * quantoTempo;

      if (besouro.posX <= posXBolo) {
        const dy = posYBolo - besouro.posY;
        besouro.indoParaBolo = dy > 0 ? 'cima' : 'baixo';
      }
    } else {
      const dx = posXBolo - besouro.posX;
      const dy = posYBolo - besouro.posY;
      const distancia = Math.hypot(dx, dy);

      if (distancia < 0.05) {
        causarDanoBolo(2);
        besouro.vivo = false;
        console.log("Besouro chegou ao bolo e causou dano!");
      } else {
        const passo = Math.min(besouro.velocidade * quantoTempo, distancia);
        besouro.posX += (dx / distancia) * passo;
        besouro.posY += (dy / distancia) * passo;
      }
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
  for (const mosca of moscas) {
    if (!mosca.viva) continue;
    const dx = mosca.posX - bicoX;
    const dy = mosca.posY - bicoY;
    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      return true;
    }
  }

  return false;
}

export function tentarAtivarSpray(quantoTempo) {
  const spraysAtivos = defesasColocadas.filter(
    d => d.tipo === 'sprays' && d.viva && d.usosRestantes > 0
  );
  if (spraysAtivos.length === 0) return;

  tempoUltimoDisparoSpray += quantoTempo;

  if (tempoUltimoDisparoSpray >= COOLDOWN_SPRAY) {
    for (const spray of spraysAtivos) {
      if (spray.usosRestantes > 0 && temInsetoNoAlcance(spray.posX, spray.posY)) {
        disparaSpray(spray.posX, spray.posY);
        spray.usosRestantes -= 1;
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
        pontuacao += 1;
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
        pontuacao += 1;
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
        pontuacao += 1;
        console.log("Besouro eliminado pelo Spray!");
      }
    }
  }

  // 4. Mosca
  for (const mosca of moscas) {
    if (!mosca.viva) continue;

    const dx = mosca.posX - posXFumaca;
    const dy = mosca.posY - posYFumaca;

    if (Math.hypot(dx, dy) <= RAIO_ALCANCE_SPRAY) {
      causarDanoMosca(mosca, DANO_SPRAY_POR_SEGUNDO * quantoTempo);
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
// VENENO 
// ==========================================

function matarInseto(inseto) {
  // formigas e moscas usam "viva", besouros usam "vivo"
  if (typeof inseto.viva !== 'undefined'){
    inseto.viva = false;
    pontuacao += 1;
  }
  else{
    inseto.vivo = false;
    pontuacao += 1;
  }
}

export function atualizaVenenos() {
  const venenos = defesasColocadas.filter(d => d.tipo === 'venenos' && d.viva);
  if (venenos.length === 0) return;

  const insetos = [...formigasAtivas,
                   ...formigasVermelhasAtivas, 
                   ...besourosAtivos,
                   ...moscas];

  for (const veneno of venenos) {
    
    // cria o contador na primeira vez que vê este veneno
    if (veneno.usos === undefined){
      veneno.usos = USOS_VENENO;
    }

    for (const inseto of insetos) {
      if (!veneno.viva) break; // já gastou os usos

      if (!estaVivo(inseto)) continue;

      const raio = moscas.includes(inseto) ? RAIO_VENENO_MOSCA : RAIO_VENENO;
      const dist = Math.hypot(inseto.posX - veneno.posX, inseto.posY - veneno.posY);

      if (dist <= raio) {
        matarInseto(inseto);
        veneno.usos -= 1;

        if (veneno.usos <= 0) {
          veneno.viva = false;
          tabuleiro[veneno.linha][veneno.coluna] = 0; // libera a célula
        }
      }
    }
  }
}


// ==========================================
// BOLO 
// ==========================================
/*O que acontece com o bolo ao ser atacado por qualquer inimigo */
export const posXBolo = -0.65;
export const posYBolo = 0.0;
export let vidaBolo = 20;
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
];

// MOSCA:

// Cada mosca da horda é um objeto com seu próprio estado.
// Isso substitui as variáveis soltas posXMosca, posYMosca, vidaMosca, moscaViva.
export let moscas = [];

// ==========================================
// MOSCA (cria um objeto mosca)
// ==========================================

// "Fábrica" de mosca: cria um objeto novo com os valores iniciais.
// Centralizar aqui evita esquecer de inicializar algum campo quando a gente
// for dar spawn em várias moscas nas próximas etapas.
function criaMosca(vidaMaxima = 1, dano = MOSCA_DANO) {
  return {
    posX: 1.2,
    posY: 0.4,
    vida: vidaMaxima,
    viva: true,

    // estado de movimento/combate (o que hoje está solto em variáveis globais)
    olhandoEsquerda: true,
    atacando: false,
    atirando: false,
    alvo: null,
    tempoCicloTiro: 0,
    jaDisparou: false,

    // estado de animação
    espera: 0, // segundos até a mosca começar a se mexer
    frame: 0,
    frameTiro: 0,
    tempoAnimacao: 0,

    // dano que ESSA mosca causa (vai variar por horda)
    dano, 
  };
}

// ==========================================
// MOSCA (animação das moscas)
// ==========================================

// Atualiza a pose de "voando" (16 quadros) de cada mosca viva.
// Só é usada quando a mosca NÃO está atirando (nesse caso quem manda é frameTiro).
export function atualizaAnimacaoMoscas(quantoTempo) {
  for (const mosca of moscas) {
    if (!mosca.viva) continue;

    mosca.tempoAnimacao += quantoTempo;
    if (mosca.tempoAnimacao >= 0.08) {
      mosca.frame = (mosca.frame + 1) % 16;
      mosca.tempoAnimacao -= 0.08; // lembra do bug do "-="? mantemos a versão correta aqui
    }
  }
}

// ==========================================
// MOSCA (mosca recebendo danos)
// ==========================================

export function causarDanoMosca(mosca, dano) {
  if (!mosca.viva) return;
  mosca.vida -= dano;
  if (mosca.vida <= 0) {
    mosca.vida = 0;
    mosca.viva = false;
    pontuacao += 1;
  }
}


/*O canvas vai de -1 a 1, ou seja, a tela tem 2 unidades de largura.
  Então 0.2 por segundo é 10% da tela por segundo, e atravessar a tela 
  inteira leva 10 s.*/
const MOSCA_VELOCIDADE = 0.2;       
const MOSCA_ALCANCE = 1;          // distância a partir da qual ela para e atira
const MOSCA_DANO = 0.01;               // dano de cada projétil
const MOSCA_VELOCIDADE_ATAQUE = 0.08; // velocidade enquanto atira (mais lenta que a de voo)
const MOSCA_DISTANCIA_MIN = 0.15;     // para de se aproximar quando chega tão perto do alvo


// ==========================================
// MOSCA (sistema de hordas)
// ==========================================

export let hordaAtual = 1;
let primeiraHordaGerada = false;
const ESPERA_PRIMEIRA_HORDA = 10; 
const INTERVALO_ENTRE_HORDAS = 20; // segundos de respiro depois que a horda morre, antes da próxima
const MOSCA_LIMITE_SAIDA_X = 1.6; // passou disso, já saiu da tela e pode ser removida
let aguardandoProximaHorda = true;
let tempoEsperaHorda = 0;

// Fibonacci: 1, 1, 2, 3, 5, 8, 13, 21... define quantas moscas nascem na horda n
function fibonacci(n) {
  if (n <= 2) return 1;
  let anterior = 1, atual = 1;
  for (let i = 3; i <= n; i++) {
    [anterior, atual] = [atual, anterior + atual];
  }
  return atual;
}

// A cada 3 hordas, o dano de cada mosca sobe
function danoMoscaNaHorda(horda) {
  const escaloes = Math.floor((horda - 1) / 3);
  return MOSCA_DANO + escaloes;
}

// Sorteia de onde a mosca entra: direita, por cima ou por baixo.
// Sempre fora da tela (a tela vai de -1 a 1), pra ela "entrar voando".
function posicaoSpawnMosca() {
  const lado = Math.random();

  if (lado < 0.4) {
    // DIREITA: fora da tela, em qualquer altura
    return {
      x: 1.2 + Math.random() * 0.3,
      y: (Math.random() * 2 - 1) * 0.9
    };
  }

  // POR CIMA ou POR BAIXO: fora da tela, em qualquer X da direita até o meio (0 a 1)
  const y = lado < 0.7 ? 1.2 : -1.2;
  return {
    x: Math.random() * 1.0,
    y: y + (y > 0 ? 1 : -1) * Math.random() * 0.2
  };
}

function geraHordaMosca(numero) {
  const quantidade = fibonacci(numero);
  const dano = danoMoscaNaHorda(numero);

  for (let i = 0; i < quantidade; i++) {
    const moscaAtual = criaMosca(10, dano); // vida ainda fixa em 10, só o dano escala por enquanto

    moscaAtual.espera = i * 0.8 + Math.random() * 0.5; // cada uma entra um pouco depois da anterior

    const pos = posicaoSpawnMosca();
    moscaAtual.posX = pos.x;
    moscaAtual.posY = pos.y; 

    moscas.push(moscaAtual);
  }

  console.log(`Horda ${numero}: ${quantidade} mosca(s), dano ${dano} cada.`);
}

// Chamada todo frame por atualizaLogica — cuida do ciclo "morreu tudo -> espera -> próxima horda"
export function atualizaHordaMosca(quantoTempo) {

  if (!boloVivo) return; // bolo morreu: nenhuma horda nova

  const hordaMorreu = moscas.length > 0 && moscas.every(m => !m.viva);

  if (hordaMorreu && !aguardandoProximaHorda) {
    aguardandoProximaHorda = true;
    tempoEsperaHorda = 0;
    moscas = moscas.filter(m => m.viva); // limpa os cadáveres pra não acumular pra sempre
  }

  if (aguardandoProximaHorda) {
    tempoEsperaHorda += quantoTempo;

    const esperaAtual = 
          primeiraHordaGerada
              ? INTERVALO_ENTRE_HORDAS
              : ESPERA_PRIMEIRA_HORDA;
    
      if (tempoEsperaHorda >= esperaAtual) {
        if (primeiraHordaGerada) {
          hordaAtual += 1;          // da segunda em diante, sobe o número
        } else {
          primeiraHordaGerada = true; // a primeira usa hordaAtual = 1 como está
        }

        geraHordaMosca(hordaAtual);

        aguardandoProximaHorda = false;
        tempoEsperaHorda = 0;
      }
    }
  }

// ==========================================
// MOSCA (ataque à distância)
// ==========================================

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

// Essa função é chamada mais a frente.
function torreMaisProxima(x, y) {
  let melhor = null;
  let melhorDist = Infinity;
  for (const torre of torres) {
    //Pula as torres mortas
    if (!torre.viva) continue;

    // Ignora torres que já ficaram pra trás — a mosca não dá ré pra atacar
    if (torre.posX > x) continue;

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
export function atualizaMoscas(quantoTempo) {
  for (const mosca of moscas) {
      // Se a mosca tá morta, deixa quieto.
      if (!mosca.viva) continue;

      if (mosca.espera > 0) {
        mosca.espera -= quantoTempo;
        continue; // ainda está parada fora da tela
      }

      // Bolo morreu: para de atacar e vai embora para a direita
      if (!boloVivo) {
        mosca.alvo = null;
        mosca.atacando = false;
        mosca.atirando = false;
        mosca.tempoCicloTiro = 0;
        mosca.jaDisparou = false;

        mosca.posX -= MOSCA_VELOCIDADE * quantoTempo;

        if (Math.abs(mosca.posX) > MOSCA_LIMITE_SAIDA_X) {
          mosca.viva = false;
        }
        continue;
      }

      // Enquanto está atirando numa torre viva, continua nela (um alvo por vez).
      // Caso contrário, escolhe a torre viva mais próxima.
      const travadaNoAlvo = mosca.atacando && mosca.alvo && mosca.alvo.viva;
      if (!travadaNoAlvo) {
        mosca.alvo = torreMaisProxima(mosca.posX, mosca.posY);
        mosca.atacando = false;
      }

      if (!mosca.alvo) {
        // sem torres vivas: segue voando pra esquerda
        mosca.atacando = false;
        mosca.atirando = false;
        mosca.olhandoEsquerda = true;

        mosca.posX -= MOSCA_VELOCIDADE * quantoTempo;

        if (mosca.posX < -1.3) {
          mosca.viva = false;
        }

        continue; // "continue" no lugar do "return": só pula pra próxima mosca do loop
      }

      //Calcula a distância da mosca até o seu alvo e vai andando na direção dele.
      const dx = mosca.alvo.posX - mosca.posX;
      const dy = mosca.alvo.posY - mosca.posY;
      const distancia = Math.hypot(dx, dy);

      if (Math.abs(dx) > 0.01) mosca.olhandoEsquerda = dx < 0;


      //Se tá longe do alvo, continua aproximando
      if (distancia > MOSCA_DISTANCIA_MIN) {
        // ANDAR em direção ao alvo
        // dentro do alcance ela anda mais devagar, pra dar tempo de atirar
        const vel = distancia > MOSCA_ALCANCE ? MOSCA_VELOCIDADE : MOSCA_VELOCIDADE_ATAQUE;


        // A conta dx / distancia dá a direção com comprimento 1, 
        // e multiplicando por velocidade × quantoTempo (m/s * s = m) 
        // você obtém quanto a mosca deve andar neste frame.
        mosca.posX += (dx / distancia) * vel * quantoTempo;
        mosca.posY += (dy / distancia) * vel * quantoTempo;
      }

       // Ainda longe: só voa, sem atirar
      if (distancia > MOSCA_ALCANCE) {
        mosca.atacando = false;
        mosca.atirando = false;
        mosca.tempoCicloTiro = 0;
        mosca.jaDisparou = false;
        continue;
      }

      // O alvo está no alcance, endão ela deve parar e atirar:
      // um ciclo = animação do tiro + pausa
      mosca.atacando = true;
      mosca.tempoCicloTiro += quantoTempo;
      if (mosca.tempoCicloTiro >= TIRO_CICLO) {
        mosca.tempoCicloTiro -= TIRO_CICLO;
        mosca.jaDisparou = false;
      }

      mosca.atirando = mosca.tempoCicloTiro < TIRO_DURACAO_ANIM;
      mosca.frameTiro = Math.min(
        TIRO_TOTAL_FRAMES - 1,
        Math.floor(mosca.tempoCicloTiro / TIRO_DURACAO_FRAME)
      );

      // Solta o projétil uma vez por ciclo, no quadro certo da animação
      if (mosca.atirando && !mosca.jaDisparou && mosca.frameTiro >= TIRO_FRAME_DISPARO) {
        disparaProjetil(mosca); // qual mosca atirou.
        mosca.jaDisparou = true;
      }
  }
  if (!boloVivo) {
    moscas = moscas.filter(m => m.viva); // tira as que já saíram da tela
  }
}

// ==========================================
// MOSCA (projéteis e partículas de tiro)
// ==========================================
const PROJETIL_VELOCIDADE = 0.9;
const PROJETIL_RAIO_ACERTO = 0.1;     // quão perto do centro da torre conta como acerto
const PROJETIL_DURACAO_FRAME = 0.5;   // 2 quadros de 500 ms

const PARTICULA_TOTAL_FRAMES = 6;
const PARTICULA_DURACAO_FRAME = 0.08;

export let projeteis = [];
export let particulasTiro = [];

function disparaProjetil(mosca) {
  const direcao = mosca.olhandoEsquerda ? -1 : 1;
  // De onde sai o projétil
  const origemX = mosca.posX + direcao * BOCA_DESLOC_X;
  const origemY = mosca.posY + BOCA_DESLOC_Y;

  // Cada projétil guarda o objeto torre mais perto
  projeteis.push({
    posX: origemX,
    posY: origemY,
    alvo: mosca.alvo,
    dano: mosca.dano,
    angulo: 0,
    tempo: 0,
    frame: 0
  });

  particulasTiro.push({
    posX: origemX,
    posY: origemY,
    olhandoEsquerda: mosca.olhandoEsquerda,
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
      p.alvo.receberDano(p.dano);
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
      pontuacaoDinheiro += 200;
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

const USOS_SPRAY_POR_TORRE = 10;

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
    viva: true,
    usosRestantes: defesaSelecionada === 'sprays' ? USOS_SPRAY_POR_TORRE : undefined
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


export function reiniciarJogo() {
  // Bolo e sapo
  vidaBolo = 20;
  boloVivo = true;
  vidaSapo = 5;
  sapoVivo = true;

  // Pontuação e dinheiro
  pontuacao = 0;
  pontuacaoDinheiro = 0;

  // Relógio do jogo e timers de geração
  tempoJogoTotal = 0;
  tempoGeracaoFormiga = 0;
  tempoGeracaoVermelha = 0;
  tempoGeracaoBesouros = 0;
  tempoParaProximaMoeda = 0;
  tempoUltimoDisparoSpray = 0;

  // Timers de animação
  tempoAnimacaoFormiga = 0;
  tempoAnimacaoLingua = 0;
  tempoAnimacaoLagarto = 0;
  tempoAnimacaoBesouro = 0;
  tempoAnimacaoMoeda = 0;
  frameFormiga = 0;
  frameLingua = 0;
  frameLagarto = 0;
  frameBesouro = 0;
  frameMoeda = 0;
  frameFormigaVermelha = 0;

  // Esvazia todas as listas (usar .length = 0 preserva a referência do array)
  formigasAtivas.length = 0;
  formigasVermelhasAtivas.length = 0;
  besourosAtivos.length = 0;
  moscas.length = 0;
  projeteis.length = 0;
  particulasTiro.length = 0;
  fumacasAtivas.length = 0;
  moedasAtivas.length = 0;
  defesasColocadas.length = 0;

  // Tabuleiro livre e só o bolo como alvo das torres
  for (const linha of tabuleiro) linha.fill(0);
  torres.length = 1;
  defesaSelecionada = null;

  // Sistema de hordas da mosca
  hordaAtual = 1;
  primeiraHordaGerada = false;
  aguardandoProximaHorda = true;
  tempoEsperaHorda = 0;
}
