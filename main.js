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
  // 2. registra callbacks para eventos de interesse
  // 3. cria, compila e linka programa shader
  // 4. especifica a cena
  // 5. inicia valores para variáveis de estado
}

function atualizaLogica(quantoTempo) {
  // altera o estado da aplicação, e.g.:
  // - movimenta inimigos, jogador, projéteis
  // - verificar estado do teclado, e.g.: 
  //        (↑ abaixada? andar pra frente)
  // - movimenta câmera
}

function desenhaCena(gl) {
  // - apaga a tela
  // - faz a chamada de desenho
}