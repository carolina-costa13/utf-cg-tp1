import { 
  frameFormiga, 
  frameMosca, 
  frameMoeda, 
  frameLagarto, 
  frameBesouro, 
  frameLingua, 
  frameFormigaVermelha,  
  moscaViva,
  besouroVivo,
  formigasAtivas,
  formigasVermelhasAtivas,
  besourosAtivos,
  fumacasAtivas,
  usosRestantesSpray,
  posXSpray,
  posYSpray

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
  texturasFumacaSpray,
  texturaVida

} from './textures.js';

import { programa } from './glSetup.js';


export function desenhaBolo(gl) {
  // Posição do bolo
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, -0.65, 0.0)

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
  gl.bindTexture(gl.TEXTURE_2D, texturaBolo)

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


export function desenhaVeneno(gl) {

    // posição do veneno
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, -0.35,0.0)

    // tamanho do bolo
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.10,0.10)

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

export function desenhaSpray(gl) {
    if (usosRestantesSpray <= 0) return;

    if (typeof programa === 'undefined' || !programa) return;

    gl.useProgram(programa);

    // Posição dinâmica do spray importada do animations.js
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position');
    gl.uniform2f(posicaoLoc, posXSpray, posYSpray); // 👈 Posição dinâmica aqui!

    // Tamanho do spray
    const tamanhoLoc = gl.getUniformLocation(programa, 'u_size');
    gl.uniform2f(tamanhoLoc, 0.08, 0.19);

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


export function desenhaLagarto(gl) {
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, -0.35, 0.65)

  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.16, 0.16)

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
  const posX = coluna * larguraSprite

  // EIXO Y: Inversão para WebGL (3 - linha)
  const posY = (3 - linha) * alturaSprite

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, posX, posY)

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
  const posX = (colunaInicial + frameBesouro) * larguraSprite;
  const posY = 1.0 - ((linhaDesejada + 1) * alturaSprite);
  gl.uniform2f(texOffsetLoc, posX, posY);

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
  // Posição da mosca na tela
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, 0.0, 0.4) // x: 0.0 (centro), y: 0.4 (no alto)

  // Tamanho do renderizador da mosca
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.2, 0.2)

  // A spritesheet da mosca possui 16 quadros organizados horizontalmente
  const totalFrames = 16
  const larguraSprite = 1 / totalFrames
  const alturaSprite = 1.0

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, frameMosca * larguraSprite, 0.0)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

  // Seleciona a textura
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaMosca)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  // Desenha
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export function desenhaSapo(gl) {
  const larguraTotal = 208
  const alturaTotal = 192
  const alturaFramePixels = 16

  const posXSapo = -0.5
  const posYSapo = -0.4

  const linhaLinguaPixel = 2
  // O ataque da língua completa fica a partir do pixel 48 (coluna 3)
  const colunaInicialPixel = 3 * 16 

  let larguraFramePixels = 16
  let larguraTela = 0.16
  let offsetXCanvas = 0.0
  let offsetFrameX = 0

  // Ajusta proporcionalmente de acordo com a extensão do frame
  if (frameLingua === 0) {
    larguraFramePixels = 16
    larguraTela = 0.16
    offsetFrameX = 0
  } else if (frameLingua === 1) {
    larguraFramePixels = 32 // Pega sapo + meia língua
    larguraTela = 0.32
    offsetFrameX = 16
  } else if (frameLingua === 2) {
    larguraFramePixels = 48 // Pega o sprite completo de 48px
    larguraTela = 0.48
    offsetFrameX = 32
  }

  // EIXO X (UV): Corta a largura exata necessária para a língua
  const texWidth = larguraFramePixels / larguraTotal
  const texHeight = alturaFramePixels / alturaTotal

  const posXUV = (colunaInicialPixel + offsetFrameX) / larguraTotal
  const posYUV = (alturaTotal - (linhaLinguaPixel + 1) * alturaFramePixels) / alturaTotal

  // EIXO X (Canvas): Compensa a largura extra para o corpo não "pular" para a direita
  // Como o retângulo cresce a partir do centro, movemos metade da largura extra para a direita
  const ajusteCentro = (larguraTela - 0.16) / 2

  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, posXSapo + ajusteCentro, posYSapo)

  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, larguraTela, 0.16)

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, posXUV, posYUV)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, texWidth, texHeight)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaSapo)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export function desenhaMoeda(gl) {
  // Posição no canvas (Ajuste onde deseja colocar a moeda)
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, 0.0, 0.2) 

  // Tamanho no Canvas (1:1 de proporção para manter quadrada)
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.10, 0.10)

  // DIMENSÕES DA SPRITE SHEET
  const larguraTotal = 180 // 9 frames x 20px
  const alturaTotal = 20
  
  const larguraFrame = 20
  const alturaFrame = 20

  // Cálculo UV em pixels (linha única, então Y sempre começa na base)
  const pixelX = frameMoeda * larguraFrame
  const pixelY = 0 

  const posXUV = pixelX / larguraTotal
  const posYUV = pixelY / alturaTotal

  const texWidth = larguraFrame / larguraTotal  // 20 / 180 = 0.1111
  const texHeight = alturaFrame / alturaTotal  // 20 / 20 = 1.0

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, posXUV, posYUV)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, texWidth, texHeight)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaMoeda)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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
  if (!fumacasAtivas || fumacasAtivas.length === 0 || !texturasFumacaSpray || texturasFumacaSpray.length === 0) return;

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
    // Progresso de 0.0 a 1.0 para percorrer as texturas
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

    // Se a base da fumaça precisa ficar no bico, deslocamos metade do tamanho da fumaça para cima
    const deslocamentoCentroFumacaY = f.posY + (f.tamanho / 2);

    gl.uniform2f(posicaoLoc, f.posX, deslocamentoCentroFumacaY);
    gl.uniform2f(tamanhoLoc, f.tamanho, f.tamanho);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  gl.depthMask(true);
}
