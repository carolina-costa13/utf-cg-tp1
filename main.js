let programa
let vao
let texture
let texturaBolo
let texturaFormiga
let texturaVeneno
let texturaSpray
let texturaLagarto
let texturaBesouro

const gl = configuraTudo()
let logoAntes = 0

function loopPrincipal(agora) {
  // (0) descobre o tempo desde a última chamada
  const quantoPassou = (agora - logoAntes) / 1000
  logoAntes = agora
  
  // (1) atualiza a lógica do programa
  atualizaLogica(quantoPassou)

  // (2) desenha a cena no novo estado
  desenhaCena(gl)

  // registra a próxima chamada do loop
  requestAnimationFrame(loopPrincipal)
}

requestAnimationFrame(loopPrincipal)



function configuraTudo() {
  // 1. inicia contexto WebGL2
    const canvas = document.querySelector('canvas')
    const gl = canvas.getContext('webgl2')

    gl.clearColor(1, 1, 1, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    
    gl.enable(gl.BLEND)

    gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
  // 2. registra callbacks para eventos de interesse
    //canvas.addEventListener('mousemove', mouseMexeu)
    //canvas.addEventListener('click', mouseClicou)
    //document.addEventListener('keydown', teclaPressionada)
 
 
   // 3. cria, compila e linka programa shader
  // 3.1 cria e compila o vertex shader
    const vsCode = `#version 300 es

        in vec2 a_position;
        in vec2 a_texcoord;

        uniform vec2 u_position;
        uniform vec2 u_size;

        uniform vec2 u_texOffset;
        uniform vec2 u_texSize;

        out vec2 v_texcoord;

        void main() {

            vec2 posicao =
                a_position * u_size + u_position;

            gl_Position =
                vec4(posicao, 0.0, 1.0);

            // região da textura
            v_texcoord =
                a_texcoord * u_texSize
                + u_texOffset;
        }
    `
  const vs = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vs, vsCode)
  gl.compileShader(vs)

  // 3.2 cria e compila o fragment shader
  const fsCode = `#version 300 es

        precision mediump float;

        uniform sampler2D u_texture;

        in vec2 v_texcoord;

        out vec4 outColor;

        void main() {

            outColor =
                texture(
                    u_texture,
                    v_texcoord
                );
        }
    `
  const fs = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fs, fsCode)
  gl.compileShader(fs)

  // 3.3 cria o programa, associa vs/fs e linka
  programa = gl.createProgram()
  gl.attachShader(programa, vs)
  gl.attachShader(programa, fs)
  gl.linkProgram(programa)

  const sucesso = gl.getProgramParameter(
            // ou  {vs|fs}, gl.COMPILE_STATUS  
                        programa, gl.LINK_STATUS)
    if (!sucesso) {  
            // ou gl.getShaderInfoLog({vs|fs})
    const log = gl.getProgramInfoLog(programa)
    console.error('Erro no shader:', log)
    }

  // 4. especifica a cena
   // 4.1 vértices de um retângulo em um 1D-array
  const vertices = new Float32Array([
    // posição       // textura
    -1.0, -1.0,       0.0, 1.0,
     1.0, -1.0,       1.0, 1.0,
    -1.0,  1.0,       0.0, 0.0,
     1.0,  1.0,       1.0, 0.0
])

  // 4.2 cria um VAO para o triângulo
  vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  
  // 4.3 cria um VBO (buffer) com vértices
  const vbo = gl.createBuffer()             // (a)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)       // (b)
  gl.bufferData(gl.ARRAY_BUFFER, vertices,  // (c) 
                                    gl.STATIC_DRAW)
  // (d) instruir a busca e (e) ativar o atributo


  const posicaoLoc = gl.getAttribLocation(programa, 'a_position')
  gl.vertexAttribPointer(// index, size, type, normalize, stride, offset     d. instrui shader onde e como
                            posicaoLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0)         //    buscar os dados do atributo
  gl.enableVertexAttribArray(posicaoLoc)                                  // e. habilita o atributo
  
  const texcoordLoc = gl.getAttribLocation(programa, 'a_texcoord')

  gl.vertexAttribPointer(texcoordLoc,2, gl.FLOAT,false, 4 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT)

gl.enableVertexAttribArray(texcoordLoc)

carregaTexturaCenario(gl)
carregaTexturaBolo(gl)
carregaTexturaFormiga(gl)
carregaTexturaVeneno(gl)
carregaTexturaSpray(gl)
carregaTexturaLagarto(gl)
carregaTexturaBesouro(gl)

  // 5. inicia valores para variáveis de estado
    gl.clearColor(1, 0, 0, 1) // cor borracha: branco
    gl.useProgram(programa)   // shader: que criamos

    return gl
}

function atualizaLogica(quantoTempo) {
  // altera o estado da aplicação, e.g.:
  // - movimenta inimigos, jogador, projéteis
  // - verificar estado do teclado, e.g.: 
  //        (↑ abaixada? andar pra frente)
  // - movimenta câmera
}

function desenhaCena(gl) {

    gl.clear(gl.COLOR_BUFFER_BIT)

    if (!texture) {
            return
        }
     // usa o programa
    gl.useProgram(programa)

    // usa o VAO
    gl.bindVertexArray(vao)

         // desenha a toalha
    if (texture) {
        desenhaCenario(gl)
    }

    // desenha o bolo por cima
    if (texturaBolo) {
        desenhaBolo(gl)
    }

      // formiga
    if (texturaFormiga) {
        desenhaFormiga(gl)
    }

      //veneno
    if (texturaVeneno) {
        desenhaVeneno(gl)
    }
    
      //spray
    if (texturaSpray) {
        desenhaSpray(gl)
    }

     //wizard lizard 
    if (texturaLagarto) {
        desenhaLagarto(gl)
    }

      //wizard lizard 
    if (texturaBesouro) {
        desenhaBesouro(gl)
    }
}

function carregaTexturaCenario(gl){
// (1) carrega a imagem
const image = new Image()

// (2) cria e configura a textura
// (2.1) cria e ativa
  image.onload = function() {
    console.log("Imagem carregada!")

    texture = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)

    // (2.2) sobe os dados da imagem
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

    // (2.3) configura filtros de redução/ampliação
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }
  image.onerror = function() {
    console.error("Não foi possível carregar cenario.png")
}

image.src = 'assets/cenario.png'

}

function carregaTexturaBolo(gl){
const imagemBolo = new Image()

// (2) cria e configura a textura
// (2.1) cria e ativa
  imagemBolo.onload = function() {
    console.log("Imagem carregada!")

    texturaBolo = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaBolo)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemBolo)
    }

  imagemBolo.onerror = function() {
    console.error("Não foi possível carregar o bolo")
}

imagemBolo.src = "sprites/Cakes/cake01.png"
}


function carregaTexturaVeneno(gl){
const imagemVeneno = new Image()

// (2) cria e configura a textura
// (2.1) cria e ativa
  imagemVeneno.onload = function() {
    console.log("Imagem carregada!")

    texturaVeneno = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaVeneno)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemVeneno)
    }

  imagemVeneno.onerror = function() {
    console.error("Não foi possível carregar o veneno")
}

imagemVeneno.src = "sprites/posion_potion.png"
}

function carregaTexturaSpray(gl){
const imagemSpray = new Image()

// (2) cria e configura a textura
// (2.1) cria e ativa
  imagemSpray.onload = function() {
    console.log("Imagem carregada!")

    texturaSpray = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaSpray)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemSpray)
    }

  imagemSpray.onerror = function() {
    console.error("Não foi possível carregar o veneno")
}

imagemSpray.src = "sprites/sprey/turuncu sprey.png"
}

function carregaTexturaLagarto(gl){
const imagemLagarto = new Image()

// (2) cria e configura a textura
// (2.1) cria e ativa
  imagemLagarto.onload = function() {

    texturaLagarto = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaLagarto)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemLagarto)
    }

  imagemLagarto.onerror = function() {
    console.error("Não foi possível carregar o wizard lizard")
}

imagemLagarto.src = "sprites/lizard/Magescale_Lizard_06.png"
}

function carregaTexturaFormiga(gl){
    const imagemFormiga = new Image()

    imagemFormiga.onload = function() {
    console.log("Imagem carregada!")

    texturaFormiga = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaFormiga)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemFormiga)
    }

  imagemFormiga.onerror = function() {
    console.error("Não foi possível carregar o as formigas")
}

imagemFormiga.src = "sprites/Ants.png"
}

function carregaTexturaBesouro(gl){
    const imagemBesouro = new Image()

    imagemBesouro.onload = function() {
    console.log("Imagem carregada!")

    texturaBesouro = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaBesouro)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemBesouro)
    }

  imagemBesouro.onerror = function() {
    console.error("Não foi possível carregar o as formigas")
}

imagemBesouro.src = "sprites/Bugs.png"
}

function desenhaBolo(gl) {

    // posição do bolo
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, -0.65,0.0)

    // tamanho do bolo
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.2,0.2)

    // seleciona a textura do bolo
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texturaBolo)

    // informa ao shader que a textura está na unidade 0
    const texturaLoc =gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    // desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}

function desenhaCenario(gl){
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

function desenhaFormiga(gl){
  // posição da formiga
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, 0.55,-0.10)

    // tamanho da formiga
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.15,0.15)

    const larguraSprite = 1 / 12
    const alturaSprite = 1 / 8

    // primeira formiga
    const coluna = 0
    const linha = 1

    // posição dentro do spritesheet
    const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')

    gl.uniform2f(texOffsetLoc,coluna * larguraSprite,linha * alturaSprite)

    // tamanho do sprite
    const texSizeLoc = gl.getUniformLocation(programa,'u_texSize')

    gl.uniform2f(texSizeLoc,larguraSprite,alturaSprite)

    // seleciona a textura da formiga
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texturaFormiga)

    // informa ao shader que a textura está na unidade 0
    const texturaLoc =gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    // desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)

}

function desenhaVeneno(gl) {

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


function desenhaSpray(gl) {

    // posição do spray
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, -0.35,0.25)

    // tamanho do spray
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.20,0.20)

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

function desenhaLagarto(gl) {

    // posição do lagarto
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, -0.35,0.65)

    // tamanho do lagarto
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.20,0.20)

     const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')
     gl.uniform2f(texOffsetLoc,0.0,0.0)

    const texSizeLoc =gl.getUniformLocation(programa,'u_texSize')

    gl.uniform2f(texSizeLoc,1.0,1.0)

    // seleciona a textura do lagarto
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texturaLagarto)

    // informa ao shader que a textura está na unidade 0
    const texturaLoc =gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    // desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}

function desenhaBesouro(gl){
  // posição do Besouro
    const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

    gl.uniform2f(posicaoLoc, 0.55,-0.30)

    // tamanho do besouro
    const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

    gl.uniform2f(tamanhoLoc,0.15,0.15)

    const larguraSprite = 1 / 12
    const alturaSprite = 1 / 4

    
    const coluna = 7
    const linha = 1

    // posição dentro do spritesheet
    const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')

    gl.uniform2f(texOffsetLoc,coluna * larguraSprite,linha * alturaSprite)

    // tamanho do sprite
    const texSizeLoc = gl.getUniformLocation(programa,'u_texSize')

    gl.uniform2f(texSizeLoc,larguraSprite,alturaSprite)

    // seleciona a textura do besouro
    gl.activeTexture(gl.TEXTURE0)

    gl.bindTexture(gl.TEXTURE_2D,texturaBesouro)

    // informa ao shader que a textura está na unidade 0
    const texturaLoc =gl.getUniformLocation(programa,'u_texture')

    gl.uniform1i(texturaLoc,0)

    // desenha o quadrado
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)

}





