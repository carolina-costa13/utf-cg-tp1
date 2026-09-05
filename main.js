let programa
let vao
let texture

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
  // 2. registra callbacks para eventos de interesse
    //canvas.addEventListener('mousemove', mouseMexeu)
    //canvas.addEventListener('click', mouseClicou)
    //document.addEventListener('keydown', teclaPressionada)
 
 
   // 3. cria, compila e linka programa shader
  // 3.1 cria e compila o vertex shader
  const vsCode = `#version 300 es

        in vec2 a_position;
        in vec2 a_texcoord;

        out vec2 v_texcoord;

        void main() {

            gl_Position =
                vec4(a_position, 0.0, 1.0);

            v_texcoord =
                a_texcoord;
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

    // ativa textura 0

    gl.activeTexture(gl.TEXTURE0)
    // coloca nossa textura na unidade 0
    gl.bindTexture(gl.TEXTURE_2D,texture)
    
    // encontra u_texture
    const texturaLoc = gl.getUniformLocation(programa,'u_texture')

    // informa ao shader que
    // u_texture usa a unidade 0

    gl.uniform1i(texturaLoc,0)

    gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
}