import { 
  frameFormiga, 
  frameMosca, 
  frameMoeda, 
  frameLagarto, 
  frameBesouro, 
  frameLingua, 
  frameFormigaVermelha,  
  frameMoscaTiro, 
  moscaViva,
  besouroVivo,
  formigasAtivas,
  formigasVermelhasAtivas,
  besourosAtivos,
  fumacasAtivas,
  usosRestantesSpray,
  posXSpray,
  posYSpray,
  posXMosca,
  posYMosca,
  moscaOlhandoEsquerda,
  posXBolo,
  posYBolo,
  boloVivo,
  moscaAtirando,
  projeteis,
  particulasTiro,
  moedasAtivas,
  pontuacaoDinheiro,
  defesasColocadas

} from './animations.js';


import { 
  texture, 
  texturaBolo, 
  texturaFormiga, 
  texturaVeneno, 
  texturaSpray, 
  texturaLagarto, 
  texturaBesouro, 
  texturaMosca, 
  texturaSapo, 
  texturaMoeda, 
  texturaFormigaVermelha,
  texturaMoscaTiro,
  texturaProjetil,
  texturaParticulaTiro,
  texturasFumacaSpray,
  texturaVida,
  texturaMoedaPlacar,
  texturasCoinCounter,
  texturaBotoes

} from './textures.js';

import { programa } from './glSetup.js';

// Configuração das posições e tamanhos dos botões da loja na tela
export const BOTOES_LOJA = [
  { tipo: 'sapos',    x: -0.525, y: -0.82, largura: 0.22, altura: 0.22 },
  { tipo: 'lagartos', x: -0.175, y: -0.82, largura: 0.22, altura: 0.22 },
  { tipo: 'sprays',   x:  0.175, y: -0.82, largura: 0.22, altura: 0.22 },
  { tipo: 'veneno',   x:  0.525, y: -0.82, largura: 0.22, altura: 0.22 }
];

// Lê o estado do bolo e pede pra GPU desenhar, ou não ele (por enquanto).
export function desenhaBolo(gl) {

  //Se o bolo morre, não desenha ele.
  if (!boloVivo) return;  


  /*u_position e u_size: dizem ao vertex shader onde fica o 
  centro do retângulo e o quanto ele cresce */

  // Posição do bolo
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, posXBolo, posYBolo)

  // Tamanho do bolo na tela
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.18, 0.17)


  // RESET DAS COORDENADAS DE TEXTURA (UV)
  // Garante que a textura não usará o recorte do último sprite desenhado
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, 0.0, 0.0) // Começa do canto superior/esquerdo (0,0)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, 1.0, 1.0) // Usa 100% da largura e altura da imagem


  // Seleciona e vincula a textura do bolo
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaBolo) //avisa o fragment shader onde a textura está (TEXTURE0, pos = 0).

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  // Desenha
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export function desenhaCenario(gl){
     // posição do cenário
    const posicaoLoc =gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc,0.0,0.0)

    // tamanho do cenário
    const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,1.0,1.0)

    // usar a textura inteira
    const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')

    gl.uniform2f(texOffsetLoc,0.0,0.0)

    const texSizeLoc =gl.getUniformLocation(programa, 'u_texSize')

    gl.uniform2f(texSizeLoc,1.0,1.0)

    // textura do cenário
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texture)

    const texturaLoc = gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}


export function desenhaFormiga(gl) {
  if (formigasAtivas.length === 0) return;

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  const larguraSprite = 1 / 12;
  const alturaSprite = 1 / 8;

  // Usa o índice direto da linha (sem subtracção)
  const linha = 1; 

  const colunaInicial = 0; 
  const colunaAtual = colunaInicial + (Math.abs(frameFormiga) % 3);

  gl.uniform2f(texOffsetLoc, colunaAtual * larguraSprite, linha * alturaSprite);
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite);
  gl.uniform2f(tamanhoLoc, 0.16, 0.16);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaFormiga);
  gl.uniform1i(texturaLoc, 0);

  for (const formiga of formigasAtivas) {
    if (!formiga.viva) continue;

    gl.uniform2f(posicaoLoc, formiga.posX, formiga.posY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}


export function desenhaVeneno(gl,posX = -0.35, posY = 0.0, largura = 0.10, altura = 0.10) {

    // posição do veneno
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, posX, posY)

    // tamanho do bolo
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc, largura, altura)

     const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')
     gl.uniform2f(texOffsetLoc,0.0,0.0)

    const texSizeLoc =gl.getUniformLocation(programa,'u_texSize')

    gl.uniform2f(texSizeLoc,1.0,1.0)

    // seleciona a textura do bolo
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texturaVeneno)

    // informa ao shader que a textura está na unidade 0
    const texturaLoc =gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    // desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}

export function desenhaSpray(gl, posX = posXSpray, posY = posYSpray, largura = 0.08,altura = 0.19) {
    if (usosRestantesSpray <= 0) return;

    if (typeof programa === 'undefined' || !programa) return;

    gl.useProgram(programa);

    // Posição dinâmica do spray importada do animations.js
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
    gl.uniform2f(posicaoLoc, posX, posY); 

    // Tamanho do spray
    const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
    gl.uniform2f(tamanhoLoc, largura, altura);

    const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
    gl.uniform2f(texOffsetLoc, 0.0, 0.0);

    const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
    gl.uniform2f(texSizeLoc, 1.0, 1.0);

    // Seleciona a textura do Spray
    if (typeof texturaSpray !== 'undefined' && texturaSpray) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texturaSpray);
        
        const texturaLoc = gl.getUniformLocation(programa, 'u_texture');
        gl.uniform1i(texturaLoc, 0);
    }

    // Desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}


export function desenhaLagarto(gl,posX = -0.35, posY = 0.65, largura = 0.16, altura = 0.16) {
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, posX, posY)

  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, largura, altura)

  const larguraSprite = 1 / 3
  const alturaSprite = 1 / 4

  // Mapeamento dos 4 quadros: [coluna, linha]
  // Linha 0 = 1ª linha da imagem (topo)
  // Linha 1 = 2ª linha da imagem
  const sequenciaFrames = [
    [0, 3], // 1º da 1ª linha
    [1, 3], // 2º da 1ª linha
    [2, 3], // 3º da 1ª linha
    [0, 2]  // 1º da 2ª linha
  ]

  const [coluna, linha] = sequenciaFrames[frameLagarto]

  // EIXO X: Coluna do frame atual (0, 1 ou 2)
  const posUVX = coluna * larguraSprite

  // EIXO Y: Inversão para WebGL (3 - linha)
  const posUVY = (3 - linha) * alturaSprite

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, posUVX, posUVY)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaLagarto)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}


export function desenhaBesouro(gl) {
  // 1. Não tenta desenhar se não houver besouros ativos
  if (!besourosAtivos || besourosAtivos.length === 0) {
    return;
  }

  // 2. Garante que o programa shader está ativo
  if (typeof programa !== 'undefined') {
    gl.useProgram(programa);
  }

  // Localizações dos uniformes do WebGL
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  // Dimensões do recorte da spritesheet (12 colunas x 8 linhas)
  const larguraSprite = 1 / 12;
  const alturaSprite = 1 / 8;

  // CONFIGURAÇÃO DO BESOURO:
  const colunaInicial = 6; // Besouro verde
  const linhaDesejada = 6; // 2 = Andando para a esquerda (direção correta)

  // Vincula a textura do besouro
  if (typeof texturaBesouro !== 'undefined' && texturaBesouro) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texturaBesouro);
    gl.uniform1i(texturaLoc, 0);
  }

  // Define o tamanho visual do besouro
  gl.uniform2f(tamanhoLoc, 0.15, 0.16);
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite);

  // Calcula a coordenada U/V da textura no quadro atual de animação
  const posUVX = (colunaInicial + frameBesouro) * larguraSprite;
  const posUVY = 1.0 - ((linhaDesejada + 1) * alturaSprite);
  gl.uniform2f(texOffsetLoc, posUVX, posUVY);

  // 3. Renderiza cada besouro ativo em sua coordenada real
  for (const besouro of besourosAtivos) {
    if (!besouro.vivo) continue;

    // Atualiza a posição X e Y individual no shader
    gl.uniform2f(posicaoLoc, besouro.posX, besouro.posY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export function desenhaMosca(gl) {
  if (!moscaViva) return;

  // Escolhe a spritesheet: tiro (7 quadros) ou idle (16 quadros)

  // Escolha padrão: mosca voando.
  let textura = texturaMosca
  let totalFrames = 16 
  let frame = frameMosca

  // Se a mosca já pode atirar e a textura tá pronta, 
  // então usa a textura da mosca de 7 frames, ao invés da de 16.
  if (moscaAtirando && texturaMoscaTiro) {
    textura = texturaMoscaTiro
    totalFrames = 7
    frame = frameMoscaTiro
  }


  /*Arrumando a textura:*/
  // Posição da mosca na tela
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, posXMosca, posYMosca) // x: 0.0 (centro), y: 0.4 (no alto)

  // Tamanho do renderizador da mosca
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.2, 0.2)


  const larguraSprite = 1 / totalFrames //são vários quadros, lado a lado, por isso a divisão.
  const alturaSprite = 1.0

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, frame * larguraSprite, 0.0)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

  // Seleciona a textura
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, textura)
  
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  // vira a sprite para que ela olhe pra esquerda.
  //a_texcoord.x antes do recorte, então o espelhamento 
  // acontece dentro do quadro, sem trocar de quadro.
  const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
  gl.uniform1i(flipXLoc, moscaOlhandoEsquerda ? 1 : 0)

  // Desenha
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  // IMPORTANTE: desliga o flip, senão o sapo e a moeda (desenhados depois) saem invertidos
  gl.uniform1i(flipXLoc, 0)
}


export function desenhaProjeteis(gl) {

  //Se não há projéteis no ar, não há o que desenhar.
  if (projeteis.length === 0) return;

  //Pega os endereços do vertex shader/ fragment shader e coloca em variáveis
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  const anguloLoc = gl.getUniformLocation(programa, 'u_angle')

  // Regra de três:
  // Quadro da mosca: 32 × 32 px, u_size = 0.2, então ocupa 0.4 de largura na tela.
  // Dessa forma, cada pixel vale 0.4 / 32 = 0.0125 na tela.
  // u_size é a metade disso (metade da largura do sprite): 0.00625.
  // Multiplicando pelo quadro do projétil:
  // u_size.x = 16 × 0.00625 = 0.1
  // u_size.y =  8 × 0.00625 = 0.05

  gl.uniform2f(tamanhoLoc, 0.1, 0.05)


  // O PNG do projétil tem 32 × 8 px, com 2 quadros de 16 × 8 lado a lado.
  // por isso precisamos dividir os valores totais de px nas frações
  // da imagem que cada quadro ocupa: 
  // 16/32 = 1/2 na largura e 8/8 = 1 na altura.

  gl.uniform2f(texSizeLoc, 1 / 2, 1.0)   

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaProjetil)
  gl.uniform1i(texturaLoc, 0)

  //Fica atualizando essas informações a cada frame, a fim de fazer 
  // uma animação bonitinha, contínua.
  for (const p of projeteis) {
    gl.uniform2f(posicaoLoc, p.posX, p.posY)
    gl.uniform2f(texOffsetLoc, p.frame * 0.5, 0.0)
    gl.uniform1f(anguloLoc, p.angulo)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4) // uma função de desenhar por projétil.
  }

  gl.uniform1f(anguloLoc, 0.0)   // desliga a rotação pros próximos desenhos
}

export function desenhaParticulasTiro(gl) {

  //Se não há partículas ativas, não há o que desenhar.
  if (particulasTiro.length === 0) return;

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')

  // 16x16 px, 6 quadros lado a lado, mesmo cálculo de regra de 3.
  gl.uniform2f(tamanhoLoc, 0.1, 0.1)
  // O PNG tem 6 quadros lado a lado: cada um ocupa 1/6 da largura
  gl.uniform2f(texSizeLoc, 1 / 6, 1.0)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaParticulaTiro)
  gl.uniform1i(texturaLoc, 0)


  //Cada partícula sai pro mesmo lado para onde a mosca olha (flipXLoc garante isso).
  for (const p of particulasTiro) {
    gl.uniform2f(posicaoLoc, p.posX, p.posY)
    gl.uniform2f(texOffsetLoc, p.frame / 6, 0.0)
    gl.uniform1i(flipXLoc, p.olhandoEsquerda ? 1 : 0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  gl.uniform1i(flipXLoc, 0) //desliga o flip pra não dar problema das coisas saírem invertidas.
}



export function desenhaSapo(gl, posX = -0.5, posY = -0.4, largura = 0.16, altura = 0.16) {
  const larguraTotal = 208;
  const alturaTotal = 192;
  const alturaFramePixels = 16;

  const linhaLinguaPixel = 2;
  const colunaInicialPixel = 3 * 16; 

  let larguraFramePixels = 16;
  let larguraTela = largura;
  let offsetFrameX = 0;

  if (frameLingua === 0) {
    larguraFramePixels = 16;
    larguraTela = largura;
    offsetFrameX = 0;
  } else if (frameLingua === 1) {
    larguraFramePixels = 32;
    larguraTela = largura * 2;
    offsetFrameX = 16;
  } else if (frameLingua === 2) {
    larguraFramePixels = 48;
    larguraTela = largura * 3;
    offsetFrameX = 32;
  }

  const texWidth = larguraFramePixels / larguraTotal;
  const texHeight = alturaFramePixels / alturaTotal;

  const posXUV = (colunaInicialPixel + offsetFrameX) / larguraTotal;
  const posYUV = (alturaTotal - (linhaLinguaPixel + 1) * alturaFramePixels) / alturaTotal;

  const ajusteCentro = (larguraTela - largura) / 2;

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  gl.uniform2f(posicaoLoc, posX + ajusteCentro, posY);

  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  gl.uniform2f(tamanhoLoc, larguraTela, altura);

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  gl.uniform2f(texOffsetLoc, posXUV, posYUV);

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  gl.uniform2f(texSizeLoc, texWidth, texHeight);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaSapo);

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');
  gl.uniform1i(texturaLoc, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function desenhaMoeda(gl) {
  // 1. Se não houver moedas na tela, não desenha nada
  if (!moedasAtivas || moedasAtivas.length === 0) return;

  if (typeof programa !== 'undefined' && programa) {
    gl.useProgram(programa);
  }

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  // DIMENSÕES DA SPRITE SHEET (180x20px -> 9 frames)
  const larguraTotal = 180;
  const alturaTotal = 20;
  const larguraFrame = 20;
  const alturaFrame = 20;

  // Cálculo de UV do quadro atual da animação
  const pixelX = frameMoeda * larguraFrame;
  const pixelY = 0;

  const posXUV = pixelX / larguraTotal;
  const posYUV = pixelY / alturaTotal;

  const texWidth = larguraFrame / larguraTotal; // 0.1111
  const texHeight = alturaFrame / alturaTotal;  // 1.0

  // Configura o recorte de textura e tamanho (igual para todas as moedas)
  gl.uniform2f(texOffsetLoc, posXUV, posYUV);
  gl.uniform2f(texSizeLoc, texWidth, texHeight);
  gl.uniform2f(tamanhoLoc, 0.10, 0.10); // Tamanho da moeda no WebGL

  // Activa a textura da moeda
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaMoeda);
  gl.uniform1i(texturaLoc, 0);

  for (const moeda of moedasAtivas) {
    gl.uniform2f(posicaoLoc, moeda.posX, moeda.posY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export function desenhaFormigaVermelha(gl) {
  if (formigasVermelhasAtivas.length === 0) return;

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  const larguraSprite = 1 / 12;
  const alturaSprite = 1 / 8;

  // Usa o índice direto da linha
  const linha = 1; 

  const colunaInicial = 3; 
  const colunaAtual = colunaInicial + (Math.abs(frameFormigaVermelha) % 3);

  gl.uniform2f(texOffsetLoc, colunaAtual * larguraSprite, linha * alturaSprite);
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite);
  gl.uniform2f(tamanhoLoc, 0.16, 0.16);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaFormiga);
  gl.uniform1i(texturaLoc, 0);

  for (const formiga of formigasVermelhasAtivas) {
    if (!formiga.viva) continue;

    gl.uniform2f(posicaoLoc, formiga.posX, formiga.posY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export function desenhaBarraVida(gl, vidaAtual, vidaMaxima, tipoCor = 0) {
  if (typeof texturaHUD === 'undefined' || !texturaHUD) {
      return;
    }

  if (typeof programa === 'undefined' || !programa) return;

  gl.useProgram(programa);

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  // Mapeamento da Spritesheet (A imagem completa)
  // A parte das barras ocupa a metade esquerda da imagem
  const larguraBarraUV = 0.25;  // Largura de uma barra individual em UV
  const alturaBarraUV = 1 / 24;  // 24 linhas de barras no total

  // 1. Calcula qual o estado de preenchimento (0 = vazia, 5 = cheia)
  const percentual = Math.max(0, Math.min(1, vidaAtual / vidaMaxima));
  const nivelVida = Math.round(percentual * 5); // 0, 1, 2, 3, 4, 5
  const indiceEstado = 5 - nivelVida; // Inverte porque o topo do bloco é 'cheia'

  // 2. Escolhe a cor base (Offset das linhas):
  // 0: Azul Escuro | 1: Azul Claro | 2: Verde Escuro | 3: Verde Claro
  // 4: Laranja     | 5: Amarelo    | 6: Vermelho     | 7: Roxo
  const linhaBaseCor = tipoCor * 6; // Cada cor ocupa 6 linhas de variação
  const linhaFinal = linhaBaseCor + indiceEstado;

  // 3. Define a coluna UV (0 para a 1ª coluna de barras, 0.25 para a 2ª)
  const colunaUV = (tipoCor % 2 === 1) ? 0.25 : 0.0;

  // Coordenadas UV de recorte na textura
  const texX = colunaUV;
  const texY = 1.0 - ((linhaFinal + 1) * alturaBarraUV);

  // Ativa a textura do HUD
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaVida);
  gl.uniform1i(texturaLoc, 0);

  // Posição fixa no canto superior esquerdo da tela (exemplo: -0.7, 0.85)
  gl.uniform2f(posicaoLoc, -0.7, 0.85); 
  gl.uniform2f(tamanhoLoc, 0.4, 0.08); // Tamanho da barra no canvas

  // Passa as coordenadas de corte da textura para o shader
  gl.uniform2f(texOffsetLoc, texX, texY);
  gl.uniform2f(texSizeLoc, larguraBarraUV, alturaBarraUV);

  // Renderiza a barra
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

export function desenhaFumaca(gl) {
  
  if (!fumacasAtivas || fumacasAtivas.length === 0) return;
  if (!texturasFumacaSpray || texturasFumacaSpray.length === 0) return;

  if (typeof programa !== 'undefined' && programa) {
    gl.useProgram(programa);
  }

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.depthMask(false);

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  gl.uniform2f(texOffsetLoc, 0.0, 0.0);
  gl.uniform2f(texSizeLoc, 1.0, 1.0);

  const totalFrames = texturasFumacaSpray.length;

  for (const f of fumacasAtivas) {
    // Se a fumaça já perdeu a vida, ignora
    if (!f.vida || f.vida <= 0) continue;

    const progresso = 1.0 - Math.max(0.0, f.vida);

    const indiceFrame = Math.min(
      Math.floor(progresso * totalFrames),
      totalFrames - 1
    );

    const texturaAtual = texturasFumacaSpray[indiceFrame];
    if (texturaAtual) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texturaAtual);
      gl.uniform1i(texturaLoc, 0);
    }

    const deslocamentoCentroFumacaY = f.posY + (f.tamanho / 2);

    gl.uniform2f(posicaoLoc, f.posX, deslocamentoCentroFumacaY);
    gl.uniform2f(tamanhoLoc, f.tamanho, f.tamanho);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  gl.depthMask(true);
}

export function desenhaMoedaPlacar(gl, posX = 0.50, posY = 0.85) {
  if (!texturaMoedaPlacar) return;

  if (typeof programa !== 'undefined' && programa) {
    gl.useProgram(programa);
  }

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  // Usa a textura inteira
  gl.uniform2f(texOffsetLoc, 0.0, 0.0);
  gl.uniform2f(texSizeLoc, 1.0, 1.0);

  // Define a posição e o tamanho do ícone no HUD
  gl.uniform2f(posicaoLoc, posX, posY);
  gl.uniform2f(tamanhoLoc, 0.08, 0.08);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaMoedaPlacar);
  gl.uniform1i(texturaLoc, 0);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

/**
 * Converte a pontuação numérica em dígitos (sprites 0-9) e os desenha em sequência
 */
export function desenhaPlacarDinheiro(gl, posXInicial = 0.68, posY = 0.85) {
  if (!texturasCoinCounter || texturasCoinCounter.length === 0) return;

  if (typeof programa !== 'undefined' && programa) {
    gl.useProgram(programa);
  }

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  gl.uniform2f(texOffsetLoc, 0.0, 0.0);
  gl.uniform2f(texSizeLoc, 1.0, 1.0);

  const larguraDigito = 0.04; 
  const alturaDigito = 0.08; 
  const espacamento = 0.10; 

  const digitosStr = String(pontuacaoDinheiro).split('');

  for (let i = 0; i < digitosStr.length; i++) {
    const digitoVal = parseInt(digitosStr[i], 10);
    const texturaDigito = texturasCoinCounter[digitoVal];

    if (!texturaDigito) continue;

    const posX = posXInicial + (i * espacamento);

    gl.uniform2f(posicaoLoc, posX, posY);
    // Aplica largura e altura ajustadas
    gl.uniform2f(tamanhoLoc, larguraDigito, alturaDigito);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texturaDigito);
    gl.uniform1i(texturaLoc, 0);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

export function desenhaDefesas(gl) {
  if (!defesasColocadas || defesasColocadas.length === 0) return;

  for (const defesa of defesasColocadas) {
    if (!defesa.viva) continue;

    // Desenha exclusivamente as torres posicionadas no tabuleiro
    if (defesa.tipo === 'sapos') {
      desenhaSapo(gl, defesa.posX, defesa.posY);
    } else if (defesa.tipo === 'lagartos') {
      desenhaLagarto(gl, defesa.posX, defesa.posY);
    } else if (defesa.tipo === 'sprays') {
      desenhaSpray(gl, defesa.posX, defesa.posY);
    } else if (defesa.tipo === 'veneno') {
      desenhaVeneno(gl, defesa.posX, defesa.posY);
    }
  }
}

export function desenhaBotoes(gl, texturaBotoes, listaBotoes, defesaSelecionada) {
  if (!texturaBotoes || !listaBotoes || listaBotoes.length === 0) return;

  if (typeof programa !== 'undefined' && programa) {
    gl.useProgram(programa);
  }

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset');
  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize');
  const texturaLoc = gl.getUniformLocation(programa, 'u_texture');

  // Dimensões totais da textura
  const IMG_W = 192.0;
  const IMG_H = 144.0;

  // Tamanho nominal das células da grelha
  const CELL_W = 24.0;  // 192 / 8
  const CELL_H = 20.0;  // Ajustado para 20px exatos para não cortar a borda superior

  // Recorte UV por célula
  const texSizeU = CELL_W / IMG_W;
  const texSizeV = CELL_H / IMG_H;

  // 1. DESENHAR OS BOTÕES VERMELHOS DE FUNDO
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturaBotoes);
  gl.uniform1i(texturaLoc, 0);

  for (const btn of listaBotoes) {
    const estaSelecionado = (defesaSelecionada === btn.tipo);

    // 🔴 BOTÃO VERMELHO: Coluna 6
    // Com UNPACK_FLIP_Y_WEBGL ativado:
    // Linha 2 = Normal | Linha 3 = Pressionado
    const coluna = 6;
    const linha = estaSelecionado ? 3 : 2;

    // Converte para UV
    const texOffsetU = (coluna * CELL_W) / IMG_W;
    const texOffsetV = (linha * (IMG_H / 7.0)) / IMG_H;

    gl.uniform2f(texOffsetLoc, texOffsetU, texOffsetV);
    gl.uniform2f(texSizeLoc, texSizeU, texSizeV);

    gl.uniform2f(tamanhoLoc, btn.largura, btn.altura);
    gl.uniform2f(posicaoLoc, btn.x, btn.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  // 2. DESENHAR OS ÍCONES (SAPO, LAGARTO, SPRAY E VENENO)
  for (const btn of listaBotoes) {
    const estaSelecionado = (defesaSelecionada === btn.tipo);

    const lIcone = btn.largura * 0.40;
    const aIcone = btn.altura * 0.40;
    
    // Posição vertical centralizada na caixa
    const yAjustado = estaSelecionado ? btn.y + 0.015 : btn.y + 0.03;

    if (btn.tipo === 'sapos' && typeof texturaSapo !== 'undefined' && texturaSapo) {
      desenhaSapo(gl, btn.x, yAjustado, lIcone, aIcone);
    } else if (btn.tipo === 'lagartos' && typeof texturaLagarto !== 'undefined' && texturaLagarto) {
      desenhaLagarto(gl, btn.x, yAjustado, lIcone, aIcone);
    } else if (btn.tipo === 'sprays' && typeof texturaSpray !== 'undefined' && texturaSpray) {
      desenhaSpray(gl, btn.x, yAjustado, lIcone, aIcone);
    } else if (btn.tipo === 'veneno' && typeof texturaVeneno !== 'undefined' && texturaVeneno) {
      desenhaVeneno(gl, btn.x, yAjustado, lIcone, aIcone);
    }
  }
}