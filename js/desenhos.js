import { 
  frameFormiga, 
  frameMosca, 
  frameMoeda, 
  frameLagarto, 
  frameBesouro, 
  frameLingua, 
  frameFormigaVermelha 
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
  texturaMoeda 
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
  // Posição da formiga
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, 0.55, -0.10)

  // Tamanho na tela
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.16, 0.16)

  const larguraSprite = 1 / 12
  const alturaSprite = 1 / 8

  // Configuração da variação/orientação da formiga
  const colunaInicial = 0 // Coluna base da formiga desejada
  const linha = 1         // Linha desejada na imagem

  // O frameFormiga (0, 1 ou 2) é somado à coluna inicial
  const colunaAtual = colunaInicial + frameFormiga

  // Envia as coordenadas UV dinâmicas para o Shader
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, colunaAtual * larguraSprite, linha * alturaSprite)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

  // Ativa e desenha a textura
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaFormiga)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
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

    // posição do spray
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, -0.35,0.25)

    // tamanho do spray
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.08,0.19)

     const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')
     gl.uniform2f(texOffsetLoc,0.0,0.0)

    const texSizeLoc =gl.getUniformLocation(programa,'u_texSize')

    gl.uniform2f(texSizeLoc,1.0,1.0)

    // seleciona a textura do Spray
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texturaSpray)

    // informa ao shader que a textura está na unidade 0
    const texturaLoc =gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    // desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
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
  // Posição desejada no canvas
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, 0.55, -0.30)

  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.15, 0.16)

  const larguraSprite = 1 / 12
  const alturaSprite = 1 / 8

  // CONFIGURAÇÃO DO BESOURO:
  // Coluna Inicial: 0 (Marrom Claro), 3 (Escuro), 6 (Verde), 9 (Vermelho)
  // Linha Desejada na imagem:
  // 0 = Olhando para cima
  // 1 = Andando para a direita
  // 2 = Andando para a esquerda
  // 3 = Olhando para baixo
  const colunaInicial = 6 // Besouro verde
  const linhaDesejada = 6 // Andando para a direita

  // EIXO X: Coluna inicial + passo da animação (0, 1 ou 2)
  const posX = (colunaInicial + frameBesouro) * larguraSprite

  const posY = 1.0 - ((linhaDesejada + 1) * alturaSprite)

  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, posX, posY)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaBesouro)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export function desenhaMosca(gl) {
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
  // Posição da formiga
  const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
  gl.uniform2f(posicaoLoc, 0.55, 0.20)

  // Tamanho na tela
  const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
  gl.uniform2f(tamanhoLoc, 0.16, 0.16)

  const larguraSprite = 1 / 12
  const alturaSprite = 1 / 8

  // Configuração da variação/orientação da formiga
  const colunaInicial = 3 // Coluna base da formiga desejada
  const linha = 1         // Linha desejada na imagem

  // O frameFormiga (0, 1 ou 2) é somado à coluna inicial
  const colunaAtual = colunaInicial + frameFormiga

  // Envia as coordenadas UV dinâmicas para o Shader
  const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
  gl.uniform2f(texOffsetLoc, colunaAtual * larguraSprite, linha * alturaSprite)

  const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
  gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

  // Ativa e desenha a textura
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texturaFormiga)

  const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
  gl.uniform1i(texturaLoc, 0)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}