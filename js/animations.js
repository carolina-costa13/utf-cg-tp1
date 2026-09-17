// Declarando e exportando todas as variáveis de controle de quadros para renderização
export let frameMosca = 0;
export let frameFormiga = 0;
export let frameLingua = 0;
export let frameLagarto = 0;
export let frameBesouro = 0;
export let frameMoeda = 0;
export let frameFormigaVermelha = 0;

// Variáveis internas para controle de tempo acumulado
let tempoAnimacaoMosca = 0;
let tempoAnimacaoFormiga = 0;
let tempoAnimacaoLingua = 0;
let tempoAnimacaoLagarto = 0;
let tempoAnimacaoBesouro = 0;
let tempoAnimacaoMoeda = 0;
let tempoAnimacaoFormigaVermelha = 0;


 export function atualizaLogica(quantoTempo) {
  animacaoMosca(quantoTempo)
  animacaoFormiga(quantoTempo)
  animacaoSapo(quantoTempo)
  animacaoLagarto(quantoTempo)
  animacaoBesouro(quantoTempo)
  animacaoMoeda(quantoTempo)
  animacaoFormigaVermelha(quantoTempo)
 
  }


export function animacaoMosca(quantoTempo){
 tempoAnimacaoMosca += quantoTempo

  // Troca de frame a cada 0.08 segundos (16 frames no total da animação idle)
  if (tempoAnimacaoMosca >= 0.08) {
    frameMosca = (frameMosca + 1) % 16
    tempoAnimacaoMosca = 0
  }
}

export function animacaoFormiga(quantoTempo){
    tempoAnimacaoFormiga += quantoTempo

  // export Troca de quadro a cada 0.15 segundos
  if (tempoAnimacaoFormiga >= 0.15) {
    frameFormiga = (frameFormiga + 1) % 3 // Cicla entre os quadros 0, 1 e 2
    tempoAnimacaoFormiga = 0
  }

}

export function animacaoSapo(quantoTempo) {
  tempoAnimacaoLingua += quantoTempo

  // Troca de quadro a cada 0.10 segundos
  if (tempoAnimacaoLingua >= 0.5) {
    frameLingua = (frameLingua + 1) % 2 // Cicla continuamente entre 0, 1 e 2
    tempoAnimacaoLingua = 0
  }
}

export function animacaoLagarto(quantoTempo){
    tempoAnimacaoLagarto += quantoTempo

    if (tempoAnimacaoLagarto >= 0.3) {
    frameLagarto = (frameLagarto + 1) % 4 // Cicla entre as 3 colunas (0, 1 e 2)
    tempoAnimacaoLagarto = 0
  }
}

export function animacaoBesouro(quantoTempo) {
  tempoAnimacaoBesouro += quantoTempo

  // Troca de quadro a cada 0.12 segundos
  if (tempoAnimacaoBesouro >= 0.12) {
    frameBesouro = (frameBesouro + 1) % 3 // Cicla entre 0, 1 e 2
    tempoAnimacaoBesouro = 0
  }
}

export function animacaoMoeda(quantoTempo) {
  tempoAnimacaoMoeda += quantoTempo

  // Troca de quadro a cada 0.12 segundos
  if (tempoAnimacaoMoeda >= 0.12) {
    frameMoeda = (frameMoeda + 1) % 9 // Cicla entre 0, 1, 2, 3, 4, 5, 6, 7, 8
    tempoAnimacaoMoeda = 0
  }
}

export function animacaoFormigaVermelha(quantoTempo){
    tempoAnimacaoFormigaVermelha += quantoTempo

  // Troca de quadro a cada 0.15 segundos
  if (tempoAnimacaoFormigaVermelha >= 0.15) {
    frameFormigaVermelha = (frameFormigaVermelha + 1) % 3 // Cicla entre os quadros 0, 1 e 2
    tempoAnimacaoFormigaVermelha = 0
  }

}
