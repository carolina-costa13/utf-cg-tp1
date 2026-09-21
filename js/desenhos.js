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
  posXMosca,
  posYMosca,
  moscaOlhandoEsquerda,
  posXBolo,
  posYBolo,
  boloVivo,
  moscaAtirando,
  projeteis,
  particulasTiro,

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

} from './textures.js';

import { programa } from './glSetup.js';


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


