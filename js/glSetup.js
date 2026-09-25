export let programa;
export let vao;
export let texturaOverlay

const somDedada = new Audio('audio/Burps and Farts Basic/Farts/Fart_3.wav');
somDedada.volume = 0.5;

const musicaFundo = new Audio('audio/FunCrafting.wav');
musicaFundo.loop = true;
musicaFundo.volume = 0.3;

import { 
  verificarCliqueMoeda, 
  tentarPosicionarDefesa, 
  selecionarDefesa, 
  boloVivo, 
  reiniciarJogo,
  causarDanoMosca,
  moscas,
  formigasAtivas,
  formigasVermelhasAtivas,
  besourosAtivos,
} from './animations.js';

import { BOTOES_LOJA, BOTAO_REINICIAR } from './desenhos.js';

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
  carregaTexturaFumacaSpray,
  carregaTexturaVida,
  carregaTexturaMoscaTiro,
  carregaTexturaProjetil,
  carregaTexturaParticulaTiro,
  carregaTexturaCoinCounter,
  carregaTexturaMoedaPlacar,
  carregaTexturaBotoes,
  carregaTexturaGameOver,
  criaTexturaSolida,
  carregaTexturaBotaoRestart

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
      registraCliqueCanvas(canvas)
      iniciarMusicaFundo()

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
carregaTexturaFumacaSpray(gl)
carregaTexturaVida(gl)
carregaTexturaMoscaTiro(gl)
carregaTexturaProjetil(gl)
carregaTexturaParticulaTiro(gl)
carregaTexturaCoinCounter(gl)
carregaTexturaMoedaPlacar(gl)
carregaTexturaBotoes(gl)
carregaTexturaGameOver(gl)
carregaTexturaBotaoRestart(gl)

texturaOverlay = criaTexturaSolida(gl, 0, 0, 0, 180);


  // 5. inicia valores para variáveis de estado
    gl.clearColor(1, 0, 0, 1) // cor borracha: branco
    gl.useProgram(programa)   // shader: que criamos

    return gl
}

export function registraCliqueCanvas(canvas) {
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();

    const normalizedX = (event.clientX - rect.left) / rect.width;
    const normalizedY = (event.clientY - rect.top) / rect.height;

    const xWebGL = normalizedX * 2 - 1;
    const yWebGL = -(normalizedY * 2 - 1);

    if (!boloVivo) {
      const meiaLargura = BOTAO_REINICIAR.largura / 2;
      const meiaAltura = BOTAO_REINICIAR.altura / 2;

      if (
        xWebGL >= BOTAO_REINICIAR.x - meiaLargura &&
        xWebGL <= BOTAO_REINICIAR.x + meiaLargura &&
        yWebGL >= BOTAO_REINICIAR.y - meiaAltura &&
        yWebGL <= BOTAO_REINICIAR.y + meiaAltura
      ) {
        reiniciarJogo();
      }
      return; // trava qualquer clique em moeda/loja/tabuleiro nesse estado
    }

    // 1. Tenta coletar moeda primeiro caso clique em cima de uma
    const moedaColetada = verificarCliqueMoeda(xWebGL, yWebGL);
    if (moedaColetada) return;

    // 2. Verifica se o clique foi em algum botão da loja
    for (const btn of BOTOES_LOJA) {
      const meiaLargura = btn.largura / 2;
      const meiaAltura = btn.altura / 2;

      if (
        xWebGL >= (btn.x - meiaLargura) &&
        xWebGL <= (btn.x + meiaLargura) &&
        yWebGL >= (btn.y - meiaAltura) &&
        yWebGL <= (btn.y + meiaAltura)
      ) {
        console.log("Botão da loja clicado:", btn.tipo);
        selecionarDefesa(btn.tipo); // Ativa o modo de construção para este tipo
        return; 
      }
    }

    // 3. Tenta dar "dedada" (clicar diretamente) em um inimigo no tabuleiro
    const raioClique = 0.1; // Tamanho da área de clique

    // Função auxiliar para tocar o som rapidamente
    const tocarSomDedada = () => {
      somDedada.currentTime = 0;
      somDedada.play().catch(e => console.log("Áudio bloqueado até interação:", e));
    };

    // Checa Músicas / Moscas (agora percorrendo o array de moscas)
    for (const mosca of moscas) {
      if (!mosca.viva) continue;
      const distMosca = Math.hypot(xWebGL - mosca.posX, yWebGL - mosca.posY);
      if (distMosca < raioClique) {
        causarDanoMosca(mosca, 2); // Aplica dano de 2 na mosca clicada
        tocarSomDedada();
        console.log("Dedada na mosca! Vida restante:", mosca.vida);
        return; // Consome o clique
      }
    }

    // Checa Formigas Comuns
    for (const formiga of formigasAtivas) {
      if (!formiga.viva) continue;
      const dist = Math.hypot(xWebGL - formiga.posX, yWebGL - formiga.posY);
      if (dist < raioClique) {
        formiga.vida -= 0.5;
        tocarSomDedada();
        console.log("Dedada na formiga comum! Vida:", formiga.vida);
        if (formiga.vida <= 0) formiga.viva = false;
        return; 
      }
    }

    // Checa Formigas Vermelhas
    for (const formiga of formigasVermelhasAtivas) {
      if (!formiga.viva) continue;
      const dist = Math.hypot(xWebGL - formiga.posX, yWebGL - formiga.posY);
      if (dist < raioClique) {
        formiga.vida -= 0.5;
        tocarSomDedada();
        console.log("Dedada na formiga vermelha! Vida:", formiga.vida);
        if (formiga.vida <= 0) formiga.viva = false;
        return;
      }
    }

    // Checa Besouros
    for (const besouro of besourosAtivos) {
      if (!besouro.vivo) continue;
      const dist = Math.hypot(xWebGL - besouro.posX, yWebGL - besouro.posY);
      if (dist < raioClique) {
        besouro.vida -= 0.5;
        tocarSomDedada();
        console.log("Dedada no besouro! Vida:", besouro.vida);
        if (besouro.vida <= 0) besouro.vivo = false;
        return;
      }
    }

    // 4. Se o botão já foi escolhido antes, o segundo clique aqui posiciona a defesa no tabuleiro
    tentarPosicionarDefesa(xWebGL, yWebGL);
  });
}

// Função para iniciar a música
export function iniciarMusicaFundo() {
    musicaFundo.play().catch(erro => {
        console.log("Aguardando interação do usuário para iniciar o áudio:", erro);
    });
}
const btnJogar = document.getElementById('btn-jogar'); // Substitua pelo ID do seu botão de início
if (btnJogar) {
    btnJogar.addEventListener('click', () => {
        iniciarMusicaFundo();
        // Aqui você também esconde o menu e ativa o seu configuraTudo() / loop do jogo
    });
}