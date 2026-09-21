import { configuraTudo, programa, vao } from './js/glSetup.js';

import { 
  atualizaLogica, 
  atualizaMoedas, 
  verificarCliqueMoeda, 
  pontuacaoDinheiro, 
  vidaSapo,
  defesasColocadas,
  tentarPosicionarDefesa,
  defesaSelecionada,
  selecionarDefesa
} from './js/animations.js';

import { 
  desenhaCenario, 
  desenhaBolo, 
  desenhaFormiga, 
  desenhaVeneno, 
  desenhaSpray, 
  desenhaLagarto, 
  desenhaBesouro, 
  desenhaMosca, 
  desenhaSapo, 
  desenhaMoeda, 
  desenhaFormigaVermelha,
  desenhaBarraVida,
  desenhaFumaca,
  desenhaProjeteis,
  desenhaParticulasTiro,
  desenhaMoedaPlacar, 
  desenhaPlacarDinheiro,
  desenhaDefesas,
  desenhaBotoes,
  BOTOES_LOJA
} from './js/desenhos.js';

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
  texturaVida, 
  texturasFumacaSpray,
  texturaProjetil,
  texturaParticulaTiro,
  texturaMoedaPlacar,
  texturasCoinCounter,
  texturaBotoes
} from './js/textures.js';

const canvas = document.getElementById('meuCanvas');

/*Carrega as texturas/imagens*/
const gl = configuraTudo();
let logoAntes = 0;

function desenhaCena(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT); //Apaga a cena inteira antes de desenhar o frame novo.

  gl.useProgram(programa); // Programa  = (vertex shader + fragment shader).
  gl.bindVertexArray(vao); //Ativa o VAO

  /* if evita tentar desenhar antes da imagem estar pronta.
     a ordem também importa, o que é desenhado depois fica por cima, por isso
     projéteis e partículas vão por último, cenário vem primeiro.
  */
  if (texture) desenhaCenario(gl);
  if (texturaBolo) desenhaBolo(gl);
  if (texturaFormiga) desenhaFormiga(gl);
  //if (texturaVeneno) desenhaVeneno(gl);
  //if (texturaSpray) desenhaSpray(gl);
  //if (texturaLagarto) desenhaLagarto(gl);
  if (texturaBesouro) desenhaBesouro(gl);
  if (texturaMosca) desenhaMosca(gl);
  //if (texturaSapo) desenhaSapo(gl);
  if (texturaMoeda) desenhaMoeda(gl);
  if (texturaFormigaVermelha) desenhaFormigaVermelha(gl);
  if (texturaVida) desenhaBarraVida(gl,vidaSapo,5,6);
  if (texturasFumacaSpray)desenhaFumaca(gl);

  if (texturaParticulaTiro) desenhaParticulasTiro(gl);
  if (texturaProjetil) desenhaProjeteis(gl);
  if(texturaMoedaPlacar) desenhaMoedaPlacar(gl, 0.50, 0.85);     // Ícone da moeda
  if(texturasCoinCounter)desenhaPlacarDinheiro(gl, 0.68, 0.85);
  desenhaDefesas(gl);
  if (texturaBotoes) desenhaBotoes(gl, texturaBotoes, BOTOES_LOJA, defesaSelecionada);

}


function loopPrincipal(agora) {
  const quantoPassou = (agora - logoAntes) / 1000;
  logoAntes = agora;

  atualizaLogica(quantoPassou);
  atualizaMoedas(quantoPassou);

  desenhaCena(gl);

  requestAnimationFrame(loopPrincipal);
}

requestAnimationFrame(loopPrincipal);



























// /*Variáveis que guardam as texturas/imagens usadas no jogo*/
// let programa
// let vao
// let texture
// let texturaBolo
// let texturaFormiga
// let texturaVeneno
// let texturaSpray
// let texturaLagarto
// let texturaBesouro
// let texturaMosca

// /*Variáveis que controlam animações*/
// let frameMosca = 0
// let tempoAnimacaoMosca = 0
// let frameFormiga = 0
// let tempoAnimacaoFormiga = 0
// let texturaSapo
// let frameLingua = 0
// let tempoAnimacaoLingua = 0
// let tempoAnimacaoLagarto=0
// let frameLagarto=0
// let frameBesouro = 0
// let tempoAnimacaoBesouro = 0
// let texturaMoeda
// let frameMoeda = 0
// let tempoAnimacaoMoeda = 0

// /*Variáveis que controlam o movimento*/
// let posicaoMoscaX = 1.2
// let posicaoMoscaY = 0.4

// const gl = configuraTudo() /*Objeto que conversa com o WebGL2*/
// let logoAntes = 0

// function loopPrincipal(agora) {
//   // (0) descobre o tempo desde a última chamada
//   const quantoPassou = (agora - logoAntes) / 1000
//   logoAntes = agora
  
//   // (1) atualiza a lógica do programa
//   atualizaLogica(quantoPassou)

//   // (2) desenha a cena no novo estado
//   desenhaCena(gl)

//   // registra a próxima chamada do loop
//   requestAnimationFrame(loopPrincipal)
// }

// requestAnimationFrame(loopPrincipal)



// function configuraTudo() {
//   // 1. inicia contexto WebGL2
//     const canvas = document.querySelector('canvas')
//     const gl = canvas.getContext('webgl2')

//     gl.clearColor(1, 1, 1, 1)
//     gl.clear(gl.COLOR_BUFFER_BIT)
    
//     gl.enable(gl.BLEND)

//     gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA)
//   // 2. registra callbacks para eventos de interesse
//     //canvas.addEventListener('mousemove', mouseMexeu)
//     //canvas.addEventListener('click', mouseClicou)
//     //document.addEventListener('keydown', teclaPressionada)
 
 
//    // 3. cria, compila e linka programa shader
//   // 3.1 cria e compila o vertex shader
//   /*Trabalha com os vértices.*/
//     const vsCode = `#version 300 es
        
//         in vec2 a_position; 
//         in vec2 a_texcoord;

//         uniform vec2 u_position;
//         uniform vec2 u_size;

//         uniform vec2 u_texOffset;
//         uniform vec2 u_texSize;

//         uniform bool u_flipX;

//         out vec2 v_texcoord;

//         void main() {

//             vec2 posicao =
//                 a_position * u_size + u_position;

//             gl_Position =
//                 vec4(posicao, 0.0, 1.0);

//             // região da textura

//             vec2 coordenadaTextura = a_texcoord;

//             if (u_flipX) {
//                 coordenadaTextura.x = 1.0 - coordenadaTextura.x;
//             }

//             v_texcoord =
//                 coordenadaTextura * u_texSize
//                 + u_texOffset;
//           }
//     `
//   const vs = gl.createShader(gl.VERTEX_SHADER)
//   gl.shaderSource(vs, vsCode)
//   gl.compileShader(vs)

//   // 3.2 cria e compila o fragment shader
//   /*Trabalha com as cores dos pixels que serão desenhados.*/
//   const fsCode = `#version 300 es

//         precision mediump float;

//         uniform sampler2D u_texture;

//         in vec2 v_texcoord;

//         out vec4 outColor;

//         void main() {

//             outColor =
//                 texture(
//                     u_texture,
//                     v_texcoord
//                 );
//         }
//     `
//   const fs = gl.createShader(gl.FRAGMENT_SHADER)
//   gl.shaderSource(fs, fsCode)
//   gl.compileShader(fs)

//   // 3.3 cria o programa, associa vs/fs e linka
//   programa = gl.createProgram()
//   gl.attachShader(programa, vs)
//   gl.attachShader(programa, fs)
//   gl.linkProgram(programa)

//   const sucesso = gl.getProgramParameter(
//             // ou  {vs|fs}, gl.COMPILE_STATUS  
//                         programa, gl.LINK_STATUS)
//     if (!sucesso) {  
//             // ou gl.getShaderInfoLog({vs|fs})
//     const log = gl.getProgramInfoLog(programa)
//     console.error('Erro no shader:', log)
//     }

//   // 4. especifica a cena
//    // 4.1 vértices de um retângulo em um 1D-array
//   const vertices = new Float32Array([
//     // posição       // textura
//     -1.0, -1.0,       0.0, 1.0,
//      1.0, -1.0,       1.0, 1.0,
//     -1.0,  1.0,       0.0, 0.0,
//      1.0,  1.0,       1.0, 0.0
// ])

//   // 4.2 cria um VAO para o triângulo
//   /*Guarda as instruções de como o WebGL deve interpretar os dados do VBO*/
//   vao = gl.createVertexArray()
//   gl.bindVertexArray(vao)
  
//   // 4.3 cria um VBO (buffer) com vértices
//   /*Guarda os dados dos vértices*/
//   const vbo = gl.createBuffer()             // (a)
//   gl.bindBuffer(gl.ARRAY_BUFFER, vbo)       // (b)
//   gl.bufferData(gl.ARRAY_BUFFER, vertices,  // (c) 
//                                     gl.STATIC_DRAW)
//   // (d) instruir a busca e (e) ativar o atributo

// /*Como encontrar a posição*/
//   const posicaoLoc = gl.getAttribLocation(programa, 'a_position')
//   gl.vertexAttribPointer(// index, size, type, normalize, stride, offset     d. instrui shader onde e como ler os dados do vbo
//                             posicaoLoc, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0)         //    buscar os dados do atributo
//   gl.enableVertexAttribArray(posicaoLoc)                                  // e. habilita o atributo

//   /*Como encontrar a textura*/
//   const texcoordLoc = gl.getAttribLocation(programa, 'a_texcoord')

//   gl.vertexAttribPointer(texcoordLoc,2, gl.FLOAT,false, 4 * Float32Array.BYTES_PER_ELEMENT,2 * Float32Array.BYTES_PER_ELEMENT)

// gl.enableVertexAttribArray(texcoordLoc)

// carregaTexturaCenario(gl)
// carregaTexturaBolo(gl)
// carregaTexturaFormiga(gl)
// carregaTexturaVeneno(gl)
// carregaTexturaSpray(gl)
// carregaTexturaLagarto(gl)
// carregaTexturaBesouro(gl)
// carregaTexturaMosca(gl)
// carregaTexturaSapo(gl)
// carregaTexturaMoeda(gl)
// carregaTexturaFormigaVermelha(gl)

//   // 5. inicia valores para variáveis de estado
//     gl.clearColor(1, 0, 0, 1) // cor borracha: branco
//     gl.useProgram(programa)   // shader: que criamos

//     return gl
// }

// /*Variável quantoTempo é o tempo que passou desde o último frame */
// function atualizaLogica(quantoTempo) {
//   animacaoMosca(quantoTempo)
//   movimentaMosca(quantoTempo)
//   animacaoFormiga(quantoTempo)
//   animacaoSapo(quantoTempo)
//   animacaoLagarto(quantoTempo)
//   animacaoBesouro(quantoTempo)
//   animacaoMoeda(quantoTempo)
//   animacaoFormigaVermelha(quantoTempo)
 
// }

// function desenhaCena(gl) {

//     gl.clear(gl.COLOR_BUFFER_BIT)

//     if (!texture) {
//             return
//         }
//      // usa o programa
//     gl.useProgram(programa)

//     // usa o VAO
//     gl.bindVertexArray(vao)

//          // desenha a toalha
//     if (texture) {
//         desenhaCenario(gl)
//     }

//     // desenha o bolo por cima
//     if (texturaBolo) {
//         desenhaBolo(gl)
//     }

//       // formiga
//     if (texturaFormiga) {
//         desenhaFormiga(gl)
//     }

//       //veneno
//     if (texturaVeneno) {
//         desenhaVeneno(gl)
//     }
    
//       //spray
//     if (texturaSpray) {
//         desenhaSpray(gl)
//     }

//      //wizard lizard 
//     if (texturaLagarto) {
//         desenhaLagarto(gl)
//     }

       
//     if (texturaBesouro) {
//         desenhaBesouro(gl)
//     }

//     if (texturaMosca) {
//         desenhaMosca(gl)
//     }

//     if (texturaSapo) {
//         desenhaSapo(gl)
//     }

//      if (texturaMoeda) {
//         desenhaMoeda(gl)
//     }

//       if (texturaFormigaVermelha) {
//         desenhaFormigaVermelha(gl)
//     }
// }

// //-----------------------------------------------------------------------------------------------------------------
// //                      CARREGAMENTO DE TEXTURA
// //-----------------------------------------------------------------------------------------------------------------


// function carregaTexturaCenario(gl){
// // (1) carrega a imagem
// const image = new Image()

// // (2) cria e configura a textura
// // (2.1) cria e ativa
//   image.onload = function() {
//     console.log("Imagem carregada!")

//     texture = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texture)

//     // (2.2) sobe os dados da imagem
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

//     // (2.3) configura filtros de redução/ampliação
//    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

//     gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
//   }
//   image.onerror = function() {
//     console.error("Não foi possível carregar cenario.png")
// }

// image.src = 'assets/cenarioMaior.png'

// }

// function carregaTexturaBolo(gl){
// const imagemBolo = new Image()

// // (2) cria e configura a textura
// // (2.1) cria e ativa
//   imagemBolo.onload = function() {
//     console.log("Imagem carregada!")

//     texturaBolo = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaBolo)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
//     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemBolo)
//     }

//   imagemBolo.onerror = function() {
//     console.error("Não foi possível carregar o bolo")
// }

// imagemBolo.src = "sprites/Cakes/Cakes_Separated/NO_OUTLINE/BlackForest_Cake_NO_OUTLINE.png"
// }


// function carregaTexturaVeneno(gl){
// const imagemVeneno = new Image()

// // (2) cria e configura a textura
// // (2.1) cria e ativa
//   imagemVeneno.onload = function() {
//     console.log("Imagem carregada!")

//     texturaVeneno = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaVeneno)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
//     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemVeneno)
//     }

//   imagemVeneno.onerror = function() {
//     console.error("Não foi possível carregar o veneno")
// }

// imagemVeneno.src = "sprites/posion_potion.png"
// }

// function carregaTexturaSpray(gl){
// const imagemSpray = new Image()

// // (2) cria e configura a textura
// // (2.1) cria e ativa
//   imagemSpray.onload = function() {
//     console.log("Imagem carregada!")

//     texturaSpray = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaSpray)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
//     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemSpray)
//     }

//   imagemSpray.onerror = function() {
//     console.error("Não foi possível carregar o veneno")
// }

// imagemSpray.src = "sprites/sprey/turuncu sprey.png"
// }

// function carregaTexturaLagarto(gl){
// const imagemLagarto = new Image()

// // (2) cria e configura a textura
// // (2.1) cria e ativa
//   imagemLagarto.onload = function() {

//     texturaLagarto = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaLagarto)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
//     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemLagarto)
//     }

//   imagemLagarto.onerror = function() {
//     console.error("Não foi possível carregar o wizard lizard")
// }

// imagemLagarto.src = "sprites/lizard/Lizard_Pack_1_Magescales_Preview.png"
// }

// function carregaTexturaFormiga(gl){
//     const imagemFormiga = new Image()

//     imagemFormiga.onload = function() {
//     console.log("Imagem carregada!")

//     texturaFormiga = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaFormiga)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
//     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemFormiga)
//     }

//   imagemFormiga.onerror = function() {
//     console.error("Não foi possível carregar o as formigas")
// }

// imagemFormiga.src = "sprites/Ants.png"
// }

// function carregaTexturaFormigaVermelha(gl){
//     const imagemFormigaVermelha = new Image()

//     imagemFormigaVermelha.onload = function() {
//     console.log("Imagem carregada!")

//     texturaFormigaVermelha = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaFormigaVermelha)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE)

//     gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
//     gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,imagemFormigaVermelha)
//     }

//   imagemFormigaVermelha.onerror = function() {
//     console.error("Não foi possível carregar o as formigas")
//     }
//     imagemFormigaVermelha.src = "sprites/Ants.png"
// }

// function carregaTexturaBesouro(gl) {
//   const imagemBesouro = new Image()

//   // 1. Cria a estrutura da textura imediatamente para a variável não ficar undefined
//   texturaBesouro = gl.createTexture()

//   imagemBesouro.onload = function() {
//     console.log("Imagem do besouro carregada!")

//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaBesouro)

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemBesouro)
//   }

//   imagemBesouro.onerror = function() {
//     console.error("Não foi possível carregar o besouro no caminho: sprites/Bugs.png")
//   }

//   imagemBesouro.src = "sprites/Bugs.png"
// }


// function carregaTexturaMosca(gl) {
//   const imagemMosca = new Image()

//   imagemMosca.onload = function() {
//     console.log("Imagem da mosca carregada!")

//     texturaMosca = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaMosca)

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    
//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemMosca)
//   }

//   imagemMosca.onerror = function() {
//     console.error("Não foi possível carregar a mosca")
//   }

//   // Caminho da spritesheet de idle da mosca do pacote de assets
//   imagemMosca.src = "sprites/fly_monster_by_yurinikolai/fly_idle/spritesheet/fly_idle.png"
// }

// function carregaTexturaSapo(gl) {
//   const imagemSapo = new Image()
//   imagemSapo.onload = function() {
//     texturaSapo = gl.createTexture()
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaSapo)

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemSapo)
//   }
//   imagemSapo.src = "sprites/Frog/frog.png"
// }

// function carregaTexturaMoeda(gl) {
//   const imagemMoeda = new Image()
//   texturaMoeda = gl.createTexture()

//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaMoeda)
//   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))

//   imagemMoeda.onload = function() {
//     gl.activeTexture(gl.TEXTURE0)
//     gl.bindTexture(gl.TEXTURE_2D, texturaMoeda)

//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
//     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

//     gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemMoeda)
//   }

//   imagemMoeda.src = "sprites/coins/coin2_20x20.png"
// }
// //---------------------------------------------------------------------------------------------------------------
// //                  FUNÇOES DE DESENHO
// //-----------------------------------------------------------------------------------------------------------------

// function desenhaBolo(gl) {

//   /*Por causa da adição da função u_flipX no vertex shader, é bom que esse trecho
//   de código fosse adicionado em todas as outras funções de desenhar sprites, pois
//   em "desenhaMosca" ela torna a variável true e se isso não for desfeito corre o risco de que as outras sprites
//   sejam invertidas, assim como a mosca*/
//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, 0)

//   // Posição do bolo
//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, -0.65, 0.0)

//   // Tamanho do bolo na tela
//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, 0.18, 0.17)

//   // RESET DAS COORDENADAS DE TEXTURA (UV)
//   // Garante que a textura não usará o recorte do último sprite desenhado
//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, 0.0, 0.0) // Começa do canto superior/esquerdo (0,0)

//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, 1.0, 1.0) // Usa 100% da largura e altura da imagem

//   // Seleciona e vincula a textura do bolo
//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaBolo)

//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   // Desenha
//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// }

// function desenhaCenario(gl){

//     /*Evita que a sprite seja invertida desnecessariamente.*/
//     const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//     gl.uniform1i(flipXLoc, 0)

//      // posição do cenário
//     const posicaoLoc =gl.getUniformLocation(programa, 'u_position')

//     gl.uniform2f(posicaoLoc,0.0,0.0)

//     // tamanho do cenário
//     const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')

//     gl.uniform2f(tamanhoLoc,1.0,1.0)

//     // usar a textura inteira
//     const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')

//     gl.uniform2f(texOffsetLoc,0.0,0.0)

//     const texSizeLoc =gl.getUniformLocation(programa, 'u_texSize')

//     gl.uniform2f(texSizeLoc,1.0,1.0)

//     // textura do cenário
//     gl.activeTexture(gl.TEXTURE0)

//     gl.bindTexture(gl.TEXTURE_2D,texture)

//     const texturaLoc = gl.getUniformLocation(programa,'u_texture')

//     gl.uniform1i(texturaLoc,0)

//     gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
// }

// function desenhaFormiga(gl) {
//   /*Evita que a sprite seja invertida desnecessariamente.*/
//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, 0)

//   // Posição da formiga
//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, 0.55, -0.10)

//   // Tamanho na tela
//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, 0.16, 0.16)

//   const larguraSprite = 1 / 12
//   const alturaSprite = 1 / 8

//   // Configuração da variação/orientação da formiga
//   const colunaInicial = 0 // Coluna base da formiga desejada
//   const linha = 1         // Linha desejada na imagem

//   // O frameFormiga (0, 1 ou 2) é somado à coluna inicial
//   const colunaAtual = colunaInicial + frameFormiga

//   // Envia as coordenadas UV dinâmicas para o Shader
//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, colunaAtual * larguraSprite, linha * alturaSprite)

//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

//   // Ativa e desenha a textura
//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaFormiga)

//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// }

// function desenhaVeneno(gl) {

//     /*Evita que a sprite seja invertida desnecessariamente.*/
//     const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//     gl.uniform1i(flipXLoc, 0)

//     // posição do veneno
//     const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

//     gl.uniform2f(posicaoLoc, -0.35,0.0)

//     // tamanho do bolo
//     const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

//     gl.uniform2f(tamanhoLoc,0.10,0.10)

//      const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')
//      gl.uniform2f(texOffsetLoc,0.0,0.0)

//     const texSizeLoc =gl.getUniformLocation(programa,'u_texSize')

//     gl.uniform2f(texSizeLoc,1.0,1.0)

//     // seleciona a textura do bolo
//     gl.activeTexture(gl.TEXTURE0)

//     gl.bindTexture(gl.TEXTURE_2D,texturaVeneno)

//     // informa ao shader que a textura está na unidade 0
//     const texturaLoc =gl.getUniformLocation(programa,'u_texture')

//     gl.uniform1i(texturaLoc,0)

//     // desenha o quadrado
//     gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
// }


// function desenhaSpray(gl) {

//     /*Evita que a sprite seja invertida desnecessariamente.*/
//     const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//     gl.uniform1i(flipXLoc, 0)

//     // posição do spray
//     const posicaoLoc = gl.getUniformLocation(programa, 'u_position')

//     gl.uniform2f(posicaoLoc, -0.35,0.25)

//     // tamanho do spray
//     const tamanhoLoc =gl.getUniformLocation(programa, 'u_size')

//     gl.uniform2f(tamanhoLoc,0.08,0.19)

//      const texOffsetLoc =gl.getUniformLocation(programa,'u_texOffset')
//      gl.uniform2f(texOffsetLoc,0.0,0.0)

//     const texSizeLoc =gl.getUniformLocation(programa,'u_texSize')

//     gl.uniform2f(texSizeLoc,1.0,1.0)

//     // seleciona a textura do Spray
//     gl.activeTexture(gl.TEXTURE0)

//     gl.bindTexture(gl.TEXTURE_2D,texturaSpray)

//     // informa ao shader que a textura está na unidade 0
//     const texturaLoc =gl.getUniformLocation(programa,'u_texture')

//     gl.uniform1i(texturaLoc,0)

//     // desenha o quadrado
//     gl.drawArrays(gl.TRIANGLE_STRIP,0,4)
// }

// function desenhaLagarto(gl) {

//   /*Evita que a sprite seja invertida desnecessariamente.*/
//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, 0)

//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, -0.35, 0.65)

//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, 0.16, 0.16)

//   const larguraSprite = 1 / 3
//   const alturaSprite = 1 / 4

//   // Mapeamento dos 4 quadros: [coluna, linha]
//   // Linha 0 = 1ª linha da imagem (topo)
//   // Linha 1 = 2ª linha da imagem
//   const sequenciaFrames = [
//     [0, 3], // 1º da 1ª linha
//     [1, 3], // 2º da 1ª linha
//     [2, 3], // 3º da 1ª linha
//     [0, 2]  // 1º da 2ª linha
//   ]

//   const [coluna, linha] = sequenciaFrames[frameLagarto]

//   // EIXO X: Coluna do frame atual (0, 1 ou 2)
//   const posX = coluna * larguraSprite

//   // EIXO Y: Inversão para WebGL (3 - linha)
//   const posY = (3 - linha) * alturaSprite

//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, posX, posY)

//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaLagarto)

//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// }

// function desenhaBesouro(gl) {

//   /*Evita que a sprite seja invertida desnecessariamente.*/
//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, 0)

//   // Posição desejada no canvas
//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, 0.55, -0.30)

//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, 0.15, 0.16)

//   const larguraSprite = 1 / 12
//   const alturaSprite = 1 / 8

//   // CONFIGURAÇÃO DO BESOURO:
//   // Coluna Inicial: 0 (Marrom Claro), 3 (Escuro), 6 (Verde), 9 (Vermelho)
//   // Linha Desejada na imagem:
//   // 0 = Olhando para cima
//   // 1 = Andando para a direita
//   // 2 = Andando para a esquerda
//   // 3 = Olhando para baixo
//   const colunaInicial = 6 // Besouro verde
//   const linhaDesejada = 6 // Andando para a direita

//   // EIXO X: Coluna inicial + passo da animação (0, 1 ou 2)
//   const posX = (colunaInicial + frameBesouro) * larguraSprite

//   const posY = 1.0 - ((linhaDesejada + 1) * alturaSprite)

//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, posX, posY)

//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaBesouro)

//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// }

// /*Chamada sempre que a mosca precisa ser redesenhada (o tempo todo).*/
// function desenhaMosca(gl) {
//   // Posição da mosca na tela
//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, posicaoMoscaX, posicaoMoscaY) // x: 0.0 (centro), y: 0.4 (no alto)

//   // Tamanho do renderizador da mosca
//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, 0.2, 0.2)

//   // A spritesheet da mosca possui 16 quadros organizados horizontalmente
//   const totalFrames = 16
//   const larguraSprite = 1 / totalFrames /*Cada quadro ocupa esse tanto da largura total da imagem.*/
//   const alturaSprite = 1.0  /*cada quadro usa toda a altura da textura, há apenas uma linah de sprites.*/

//   /*Escolha do quadro atual: vai iterando sobre os quadros pra formar o movimento da imagem.*/
//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, frameMosca * larguraSprite, 0.0)

//   /*Manda pro shader o tamanho da parte da textura que será usada*/
//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, larguraSprite, alturaSprite)

//   // Seleciona a textura
//   gl.activeTexture(gl.TEXTURE0) /*Ativa a unidade de textura número 0*/
//   gl.bindTexture(gl.TEXTURE_2D, texturaMosca)

//   /*Associa a textura da mosca ao TEXTURE0. Quando você usar
//    u_texture para buscar pixels, leia a textura que está na 
//    unidade de textura número 0*/
//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, true)

//   // Manda a GPU desenhar
//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

//   /*
//   Com quatro vértices em TRIANGLE_STRIP, o WebGL produz dois 
//   triângulos que formam um retângulo:
//   vértice 0 ●────● vértice 1
//             │  / │
//             │ /  │
//   vértice 2 ●────● vértice 3
//  */
// }

// function desenhaSapo(gl) {

//   /*Evita que a sprite seja invertida desnecessariamente.*/
//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, 0)

//   const larguraTotal = 208
//   const alturaTotal = 192
//   const alturaFramePixels = 16

//   const posXSapo = -0.5
//   const posYSapo = -0.4

//   const linhaLinguaPixel = 2
//   // O ataque da língua completa fica a partir do pixel 48 (coluna 3)
//   const colunaInicialPixel = 3 * 16 

//   let larguraFramePixels = 16
//   let larguraTela = 0.16
//   let offsetXCanvas = 0.0
//   let offsetFrameX = 0

//   // Ajusta proporcionalmente de acordo com a extensão do frame
//   if (frameLingua === 0) {
//     larguraFramePixels = 16
//     larguraTela = 0.16
//     offsetFrameX = 0
//   } else if (frameLingua === 1) {
//     larguraFramePixels = 32 // Pega sapo + meia língua
//     larguraTela = 0.32
//     offsetFrameX = 16
//   } else if (frameLingua === 2) {
//     larguraFramePixels = 48 // Pega o sprite completo de 48px
//     larguraTela = 0.48
//     offsetFrameX = 32
//   }

//   // EIXO X (UV): Corta a largura exata necessária para a língua
//   const texWidth = larguraFramePixels / larguraTotal
//   const texHeight = alturaFramePixels / alturaTotal

//   const posXUV = (colunaInicialPixel + offsetFrameX) / larguraTotal
//   const posYUV = (alturaTotal - (linhaLinguaPixel + 1) * alturaFramePixels) / alturaTotal

//   // EIXO X (Canvas): Compensa a largura extra para o corpo não "pular" para a direita
//   // Como o retângulo cresce a partir do centro, movemos metade da largura extra para a direita
//   const ajusteCentro = (larguraTela - 0.16) / 2

//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, posXSapo + ajusteCentro, posYSapo)

//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, larguraTela, 0.16)

//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, posXUV, posYUV)

//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, texWidth, texHeight)

//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaSapo)

//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// }

// function desenhaMoeda(gl) {

//   /*Evita que a sprite seja invertida desnecessariamente.*/
//   const flipXLoc = gl.getUniformLocation(programa, 'u_flipX')
//   gl.uniform1i(flipXLoc, 0)

//   // Posição no canvas (Ajuste onde deseja colocar a moeda)
//   const posicaoLoc = gl.getUniformLocation(programa, 'u_position')
//   gl.uniform2f(posicaoLoc, 0.0, 0.2) 

//   // Tamanho no Canvas (1:1 de proporção para manter quadrada)
//   const tamanhoLoc = gl.getUniformLocation(programa, 'u_size')
//   gl.uniform2f(tamanhoLoc, 0.10, 0.10)

//   // DIMENSÕES DA SPRITE SHEET
//   const larguraTotal = 180 // 9 frames x 20px
//   const alturaTotal = 20
  
//   const larguraFrame = 20
//   const alturaFrame = 20

//   // Cálculo UV em pixels (linha única, então Y sempre começa na base)
//   const pixelX = frameMoeda * larguraFrame
//   const pixelY = 0 

//   const posXUV = pixelX / larguraTotal
//   const posYUV = pixelY / alturaTotal

//   const texWidth = larguraFrame / larguraTotal  // 20 / 180 = 0.1111
//   const texHeight = alturaFrame / alturaTotal  // 20 / 20 = 1.0

//   const texOffsetLoc = gl.getUniformLocation(programa, 'u_texOffset')
//   gl.uniform2f(texOffsetLoc, posXUV, posYUV)

//   const texSizeLoc = gl.getUniformLocation(programa, 'u_texSize')
//   gl.uniform2f(texSizeLoc, texWidth, texHeight)

//   gl.activeTexture(gl.TEXTURE0)
//   gl.bindTexture(gl.TEXTURE_2D, texturaMoeda)

//   const texturaLoc = gl.getUniformLocation(programa, 'u_texture')
//   gl.uniform1i(texturaLoc, 0)

//   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
// }
// //---------------------------------------------------------------------------------------------------------------
// //                          ANIMAÇÕES
// //---------------------------------------------------------------------------------------------------------------

// function animacaoMosca(quantoTempo){
//  tempoAnimacaoMosca += quantoTempo

//   // Troca de frame a cada 0.08 segundos (16 frames no total da animação idle)
//   if (tempoAnimacaoMosca >= 0.08) {
//     frameMosca = (frameMosca + 1) % 16
//     tempoAnimacaoMosca = 0
//   }
// }

// function animacaoFormiga(quantoTempo){
//     tempoAnimacaoFormiga += quantoTempo

//   // Troca de quadro a cada 0.15 segundos
//   if (tempoAnimacaoFormiga >= 0.15) {
//     frameFormiga = (frameFormiga + 1) % 3 // Cicla entre os quadros 0, 1 e 2
//     tempoAnimacaoFormiga = 0
//   }

// }

// function animacaoSapo(quantoTempo) {
//   tempoAnimacaoLingua += quantoTempo

//   // Troca de quadro a cada 0.10 segundos
//   if (tempoAnimacaoLingua >= 0.5) {
//     frameLingua = (frameLingua + 1) % 2 // Cicla continuamente entre 0, 1 e 2
//     tempoAnimacaoLingua = 0
//   }
// }

// function animacaoLagarto(quantoTempo){
//     tempoAnimacaoLagarto += quantoTempo

//     if (tempoAnimacaoLagarto >= 0.3) {
//     frameLagarto = (frameLagarto + 1) % 4 // Cicla entre as 3 colunas (0, 1 e 2)
//     tempoAnimacaoLagarto = 0
//   }
// }

// function animacaoBesouro(quantoTempo) {
//   tempoAnimacaoBesouro += quantoTempo

//   // Troca de quadro a cada 0.12 segundos
//   if (tempoAnimacaoBesouro >= 0.12) {
//     frameBesouro = (frameBesouro + 1) % 3 // Cicla entre 0, 1 e 2
//     tempoAnimacaoBesouro = 0
//   }
// }

// function animacaoMoeda(quantoTempo) {
//   tempoAnimacaoMoeda += quantoTempo

//   // Troca de quadro a cada 0.12 segundos
//   if (tempoAnimacaoMoeda >= 0.12) {
//     frameMoeda = (frameMoeda + 1) % 9 // Cicla entre 0, 1, 2, 3, 4, 5, 6, 7, 8
//     tempoAnimacaoMoeda = 0
//   }
// }


// //---------------------------------------------------------------------------------------------------------------
// //                          MOVIMENTO
// //---------------------------------------------------------------------------------------------------------------


// function movimentaMosca(quantoTempo) {
//     /*Onde o bolo está no mapa*/
//     const boloX = -0.50
//     const boloY = 0.15

//     const velocidadeMosca = 0.2

//     const dx = boloX - posicaoMoscaX
//     const dy = boloY - posicaoMoscaY

//     const distancia = Math.sqrt(dx * dx + dy * dy)

//     if (distancia > 0.02) {
//         posicaoMoscaX += (dx / distancia) * velocidadeMosca * quantoTempo
//         posicaoMoscaY += (dy / distancia) * velocidadeMosca * quantoTempo
//     }
// }






