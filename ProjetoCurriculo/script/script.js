let isOpen = false;

function changeNavState(){
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    const isMobile = window.innerWidth <= 900;

    if(!isOpen) {
        sidebar.style.width = "250px";
        if (!isMobile) {
            main.style.marginLeft = "300px";
        }
    } else {
        sidebar.style.width = "0px";
        main.style.marginLeft = isMobile ? "30px" : "120px";
    }
    isOpen = !isOpen;
}

/* CARROSSEL */

let currentIndex = 0;

function moveCarousel(direction){

    const track = document.getElementById("carouselTrack");

    const images = track.querySelectorAll("img");

    const visibleImages = window.innerWidth <= 768 ? 1 : 3;

    const maxIndex = Math.max(0, images.length - visibleImages);

    currentIndex += direction;

    if(currentIndex < 0){
        currentIndex = maxIndex;
    }

    if(currentIndex > maxIndex){
        currentIndex = 0;
    }

    const imageWidth = images[0].offsetWidth + 20;

    track.style.transform =
        `translateX(-${currentIndex * imageWidth}px)`;
}

/* POPUP DOS PROJETOS */

const projectData = [

    {
        title: "Embate (Combat — Atari 2600)",

        subtitle:
        "2026 • Jogo eletrônico web 2D desenvolvido em HTML5 Canvas, CSS e JavaScript",

        image:
        "imagens/combat.png",

        description:
        "Releitura web jogável do clássico Combat (Atari 2600, 1977) desenvolvida com HTML5 Canvas, CSS3 e JavaScript. Conta com modo multiplayer local para dois jogadores no mesmo teclado, três arenas geradas aleatoriamente, física de ricochete de projéteis nas paredes, efeitos sonoros retrô e caixa de power-up temporário de tiro triplo. Clique no botão abaixo para jogar diretamente no navegador!",

        playUrl:
        "projetos/combat/index.html#game"
    },

    {
        title: "Lanchinho Noturno",

        subtitle:
        "2025 • Jogo eletrônico 3D em primeira pessoa produzido na Unity de forma individual",

        image:
        "imagens/lanchinho.png",

        description:
        "O jogo é um walking simulator em primeira pessoa, ou seja, se baseia na exploração pré-definida de um cenário que, nesse caso, é de um posto de gasolina abandonado. Por conseguinte, contém elementos de terror e uma curta duração de gameplay. Além disso, foi integralmente desenvolvido por apenas uma pessoa e teve como objetivo o uso de 3D na Unity, junto da integração sonora com o FMOD e um menu funcional."
    },

    {
        title: "Modelagem 3D",

        subtitle:
        "2023 • Modelagem 3D de uma casa produzida no Blender de forma individual",

        image:
        "imagens/modelagemcasa.png",

        description:
        "A modelagem teve como objetivo replicar a arquitetura de uma casa com base em uma referência proposta, sem grande foco nos detalhes, portanto o modelo não foi texturizado nem possui cor ou iluminação completa."
    },

    {
        title: "Olimpíada Paranaense de Química",

        subtitle:
        "2024-2025 • Jogo eletrônico 3D para bolsa CNPq relacionado com a Olimpíada Paranaense de Química produzido na Unity desenvolvido em grupo",

        image:
        "imagens/oprq.png",

        description:
        "O jogo foi desenvolvido em um espaço de tempo de cerca de 10 meses em um time inicialmente de uma pessoa, mas que mudou para 2 pessoas após poucos meses do início do projeto e logo 3 pessoas na segunda metade do período de desenvolvimento. A proposta se baseia em um jogo educativo de química para aqueles que desejam participar da OPRQ (Olimpíada Paranaense de Química), por isso possui um nicho específico e uma dificuldade acima da média em relação ao nível de conhecimento necessário para jogá-lo. Como parte do desenvolvimento, tive a responsabilidade de programar as mecânicas fundamentais do jogo, ou seja, a jogabilidade principal."
    },

    {
        title: "Projeto T.E.M.P.O",

        subtitle:
        "2025 • Jogo eletrônico 3D em primeira pessoa produzido na Unity em grupo",

        image:
        "imagens/projetotempo.png",

        description:
        "O jogo se baseia em uma escape room contida em um escritório, em uma realidade em que a viagem temporal é possível, por isso o jogador alterna entre dois períodos para resolver os enigmas e escapar da sala. O projeto foi desenvolvido em um time de 3 pessoas ao longo de aproximadamente 3 meses, em que foi me dada a função de programador do menu, integração sonora, e o desenvolvimento de diversas mecânicas principais e do primeiro enigma completo. O jogo é completo, ou seja, possui começo, meio e fim bem definidos e uma estrutura comum à outros jogos, como menu, configurações, menu de pausa, efeitos visuais, sons, etc."
    },

    {
        title: "Shotgun",

        subtitle:
        "2024 • Jogo eletrônico 2D side view produzido na Unity de forma individual",

        image:
        "imagens/shotgun.png",

        description:
        "O jogo se passa na pele de uma escopeta autônoma controlada pelo jogador, o qual tem 10 diferentes objetivos a cumprir em um certo limite de tempo enquanto controla a arma. No geral, o projeto é simples e de curta duração, considerando-se que foi desenvolvido em um período de 3 dias e por apenas uma pessoa. Apesar disso, o jogo não contém sons, nem menu, por ter como finalidade exclusiva a apresentação de uma gameplay no âmbito 2D."
    }

];

function openPopup(index){

    const popup =
        document.getElementById("popup");

    const popupTitle =
        document.getElementById("popupTitle");

    const popupSubtitle =
        document.getElementById("popupSubtitle");

    const popupText =
        document.getElementById("popupText");

    const popupImage =
        document.getElementById("popupImage");

    const popupPlayLink =
        document.getElementById("popupPlayLink");

    const project = projectData[index];

    popupTitle.textContent =
        project.title;

    popupSubtitle.textContent =
        project.subtitle;

    popupText.textContent =
        project.description;

    popupImage.src =
        project.image;

    if (project.playUrl) {
        popupPlayLink.href = project.playUrl;
        popupPlayLink.style.display = "inline-flex";
    } else {
        popupPlayLink.style.display = "none";
    }

    popup.style.display = "flex";
}

function closePopup(){

    const popup =
        document.getElementById("popup");

    popup.style.display = "none";
}

/* FECHAR CLICANDO FORA OU COM ESC */

window.onclick = function(event){

    const popup =
        document.getElementById("popup");

    if(event.target === popup){
        popup.style.display = "none";
    }
}

window.addEventListener("keydown", function(event){
    if(event.key === "Escape"){
        closePopup();
    }
});
