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
  carregaTexturaVeneno,
  carregaTexturaMoscaTiro,
  carregaTexturaProjetil,
  carregaTexturaParticulaTiro,

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
        uniform bool u_flipX;
        uniform float u_angle; 

        out vec2 v_texcoord;

        void main() {

            vec2 posicao =
                a_position * u_size;

            float c = cos(u_angle);
            float s = sin(u_angle);

            posicao = 
              vec2(posicao.x * c - posicao.y * s, 
                  posicao.x * s + posicao.y * c);

            gl_Position = 
              vec4(posicao + u_position, 0.0, 1.0);

            // região da textura
            vec2 coordenadaTextura = a_texcoord;

            if (u_flipX) {
              coordenadaTextura.x = 1.0 - coordenadaTextura.x;
            }

            v_texcoord = coordenadaTextura * u_texSize + u_texOffset;
        }
    `
  /*OBS (modificações feitas no Vertex Shader):
  -> a variável "uniform bool u_flipX;" permite controlar se a sprite
  está virada para a esquerda ou para a direita, isto é, permite invertê-la.

  -> a variável "uniform float u_angle;" permite girar a sprite. Perceba que ao invés
  de somar i_position em "vec2 posicao", como estava sendo feito antes, estamos somando
  a posição em "gl_Position", somente após de rotacionar o objeto em seu próprio centro.
  Fazer isso garante que a sprite rode em seu centro, e não no centro da tela (0,0) (desse jeito 
  ela iriaficar orbitando na tela ao invés de rodar fixamente em seu centro, 
  como foi mostrado em aula.*/

  /*OBS: explicações esclarecedoras:
  -> sobre a variável gl_Position: GPU lê o valor pra saber onde desenhar 
  o canto (de -1 a 1 na tela). Ela é vec4 porque precisa de 4 números 
  (x, y, z, w). Aqui z = 0 (não tem profundidade) e w = 1 (não tem perspectiva). */

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

  // 4.2 cria um VAO para o triângulo. Grava qual buffer usar, 
  // como ler e quais atributos estão ligados
  vao = gl.createVertexArray()
  gl.bindVertexArray(vao)
  
  // 4.3 cria um VBO (buffer) com vértices
  /*Aqui estamos levando o vbo que fizemos para a GPU ver*/
  const vbo = gl.createBuffer()             // (a)
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo)       // (b)
  gl.bufferData(gl.ARRAY_BUFFER, vertices,  // (c) 
                                    gl.STATIC_DRAW)
  // (d) instruir a busca e (e) ativar o atributo


  const posicaoLoc = gl.getAttribLocation(programa, 'a_position')
  gl.vertexAttribPointer(// index, size, type, normalize, stride, offset (manual de leitura pra GPU)     d. instrui shader onde e como
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
carregaTexturaMoscaTiro(gl)
carregaTexturaProjetil(gl)
carregaTexturaParticulaTiro(gl)


  // 5. inicia valores para variáveis de estado
    gl.clearColor(1, 0, 0, 1) // cor borracha: branco
    gl.useProgram(programa)   // shader: que criamos

    return gl
}