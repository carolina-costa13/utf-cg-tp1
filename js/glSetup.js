export let programa;
export let vao;

import { 
  carregaTexturaCenario, 
  carregaTexturaBolo, 
  carregaTexturaBesouro,
  carregaTexturaFormiga,
  carregaTexturaFormigaVermelha,
  carregaTexturaLagarto,
  carregaTexturaMoeda,
  carregaTexturaMosca,
  carregaTexturaSapo,
  carregaTexturaSpray,
  carregaTexturaVeneno

} from './textures.js';

 export function configuraTudo() {
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
carregaTexturaMosca(gl)
carregaTexturaSapo(gl)
carregaTexturaMoeda(gl)
carregaTexturaFormigaVermelha(gl)

  // 5. inicia valores para variáveis de estado
    gl.clearColor(1, 0, 0, 1) // cor borracha: branco
    gl.useProgram(programa)   // shader: que criamos

    return gl
}