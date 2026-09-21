export let texture;
export let texturaBolo;
export let texturaFormiga;
export let texturaVeneno;
export let texturaSpray;
export let texturaLagarto;
export let texturaBesouro;
export let texturaMosca;
export let texturaSapo;
export let texturaMoeda;
export let texturaFormigaVermelha;

export function carregaTexturaCenario(gl) {
    // (1) carrega a imagem
    const image = new Image()

    // (2) cria e configura a textura
    // (2.1) cria e ativa
    image.onload = function () {
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

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    }
    image.onerror = function () {
        console.error("Não foi possível carregar cenario.png")
    }

    image.src = 'assets/cenarioMaior.png'

}

export function carregaTexturaBolo(gl) {
    const imagemBolo = new Image()

    // (2) cria e configura a textura
    // (2.1) cria e ativa
    imagemBolo.onload = function () {
        console.log("Imagem carregada!")

        texturaBolo = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaBolo)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemBolo)
    }

    imagemBolo.onerror = function () {
        console.error("Não foi possível carregar o bolo")
    }

    imagemBolo.src = "sprites/Cakes/Cakes_Separated/NO_OUTLINE/BlackForest_Cake_NO_OUTLINE.png"
}


export function carregaTexturaVeneno(gl) {
    const imagemVeneno = new Image()

    // (2) cria e configura a textura
    // (2.1) cria e ativa
    imagemVeneno.onload = function () {
        console.log("Imagem carregada!")

        texturaVeneno = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaVeneno)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemVeneno)
    }

    imagemVeneno.onerror = function () {
        console.error("Não foi possível carregar o veneno")
    }

    imagemVeneno.src = "sprites/posion_potion.png"
}

export function carregaTexturaSpray(gl) {
    const imagemSpray = new Image()

    // (2) cria e configura a textura
    // (2.1) cria e ativa
    imagemSpray.onload = function () {
        console.log("Imagem carregada!")

        texturaSpray = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaSpray)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemSpray)
    }

    imagemSpray.onerror = function () {
        console.error("Não foi possível carregar o veneno")
    }

    imagemSpray.src = "sprites/sprey/turuncu sprey.png"
}

export function carregaTexturaLagarto(gl) {
    const imagemLagarto = new Image()

    // (2) cria e configura a textura
    // (2.1) cria e ativa
    imagemLagarto.onload = function () {

        texturaLagarto = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaLagarto)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemLagarto)
    }

    imagemLagarto.onerror = function () {
        console.error("Não foi possível carregar o wizard lizard")
    }

    imagemLagarto.src = "sprites/lizard/Lizard_Pack_1_Magescales_Preview.png"
}

export function carregaTexturaFormiga(gl) {
    const imagemFormiga = new Image()

    imagemFormiga.onload = function () {
        console.log("Imagem carregada!")

        texturaFormiga = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaFormiga)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemFormiga)
    }

    imagemFormiga.onerror = function () {
        console.error("Não foi possível carregar o as formigas")
    }

    imagemFormiga.src = "sprites/Ants.png"
}

export function carregaTexturaFormigaVermelha(gl) {
    const imagemFormigaVermelha = new Image()

    imagemFormigaVermelha.onload = function () {
        console.log("Imagem carregada!")

        texturaFormigaVermelha = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaFormigaVermelha)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemFormigaVermelha)
    }

    imagemFormigaVermelha.onerror = function () {
        console.error("Não foi possível carregar o as formigas")
    }
    imagemFormigaVermelha.src = "sprites/Ants.png"
}

export function carregaTexturaBesouro(gl) {
    const imagemBesouro = new Image()

    // 1. Cria a estrutura da textura imediatamente para a variável não ficar undefined
    texturaBesouro = gl.createTexture()

    imagemBesouro.onload = function () {
        console.log("Imagem do besouro carregada!")

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaBesouro)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemBesouro)
    }

    imagemBesouro.onerror = function () {
        console.error("Não foi possível carregar o besouro no caminho: sprites/Bugs.png")
    }

    imagemBesouro.src = "sprites/Bugs.png"
}

export function carregaTexturaMosca(gl) {
    const imagemMosca = new Image()

    imagemMosca.onload = function () {
        console.log("Imagem da mosca carregada!")

        texturaMosca = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaMosca)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemMosca)
    }

    imagemMosca.onerror = function () {
        console.error("Não foi possível carregar a mosca")
    }

    // Caminho da spritesheet de idle da mosca do pacote de assets
    imagemMosca.src = "sprites/fly_monster_by_yurinikolai/fly_idle/spritesheet/fly_idle.png"
}

export function carregaTexturaSapo(gl) {
    const imagemSapo = new Image()
    imagemSapo.onload = function () {
        texturaSapo = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaSapo)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemSapo)
    }
    imagemSapo.src = "sprites/Frog/frog.png"
}

export function carregaTexturaMoeda(gl) {
    const imagemMoeda = new Image()
    texturaMoeda = gl.createTexture()

    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texturaMoeda)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]))

    imagemMoeda.onload = function () {
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, texturaMoeda)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagemMoeda)
    }

    imagemMoeda.src = "sprites/coins/coin2_20x20.png"
}

/* ==========================================
   ATAQUE MOSCA + PROJÉTEIS
  ==========================================*/
export let texturaMoscaTiro;
export let texturaProjetil;
export let texturaParticulaTiro;

// Carrega uma imagem e só entrega a textura quando ela está pronta. 
// Ela não é chamada lá no glSetup, é usada só aqui mesmo.
function criaTexturaDeImagem(gl, caminho, quandoPronta) {
    const imagem = new Image() // Cria o objeto da imagem

    // Quando a imagem terminar de carregar, cria e configura a textura no WebGL
    imagem.onload = function () { 
        const textura = gl.createTexture()
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, textura)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagem)

        quandoPronta(textura) 
        //Quando termina, retorna a textura prontinha, não precisa 
        //esperar o js baixar as características das imagens.
    }

    imagem.onerror = function () {
        console.error("Não foi possível carregar: " + caminho)
    }
    
    // É aqui que o carregamento começa.
    // Deixa a função mais geral, então não precisamos copiar e colar ela várias vezes.
    imagem.src = caminho
}

// Chamadas da função acima
export function carregaTexturaMoscaTiro(gl) {
    criaTexturaDeImagem(gl, "sprites/fly_monster_by_yurinikolai/fly_shoot/spritesheet/fly_shoot.png",
        function (tex) { texturaMoscaTiro = tex }) 
        // Função que guarda o parâmetro tex (textura) na variável texturaMoscaTiro
        // Usar ela é uma preucaução pra que quando a main chamar a função desenha
        // não seja desenhado um retângulo preto (vetor de textura incompleta)
}

export function carregaTexturaProjetil(gl) {
    criaTexturaDeImagem(gl, "sprites/fly_monster_by_yurinikolai/projectile/spritesheet/Sprite-0001.png",
        function (tex) { texturaProjetil = tex })
}

export function carregaTexturaParticulaTiro(gl) {
    criaTexturaDeImagem(gl, "sprites/fly_monster_by_yurinikolai/shoot_particle/spritesheet/shoot_particle.png",
        function (tex) { texturaParticulaTiro = tex })
}
