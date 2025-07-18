// src/pages/Character.jsx
import './System.css'; // CSS local dentro da pasta Home
import Menu from '../../components/Menu/Menu'; // ajuste conforme estrutura real
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';


export default function System() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(false);
  const [showCombat, setShowCombat] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const [showOthers, setShowOthers] = useState(false);

  return (
    <div className="system-page">
        <Menu>
            <button onClick={() => (window.location.href = '/')}>Inicio</button>
            <button onClick={() => (window.location.href = '/system')}>Sistema</button>
            <button onClick={() => (window.location.href = '/equipment')}>Equipamento</button>
            <button onClick={() => (window.location.href = '/character')}>Personagem</button>
            <button onClick={() => (window.location.href = '/dice')}>Dados</button>
            <button onClick={() => (window.location.href = '/map')}>Mapa</button>
        </Menu>
        

        <div className="allParts" id="allParts-section">
            {/*  Container de Introdução  */}
            <div className="Introduction" onClick={() => setShowIntro(!showIntro)}>
                <img src="./images_system/sword.png" alt="Icon Introduction" className="iconIntroduction" />
                <h2>Introdução</h2>
            </div>

            {showIntro && (
                <div className="introduction-text">
                    <img src="./images_system/rpg.jpg" alt="Icon Text Introduction" className="iconTextIntroduction" />
                    <p style={{ textIndent: '1%' }}>
                        Aqui seguem as regras de núcleo para o jogo, e as mais gerais. As regras 
                        mais específicas serão detalhadas no futuro no <b>Grimório de Regras</b>. 
                        Como jogadores precisam de um conhecimento básico de regras para 
                        saberem o que fazer, então será bastante simples pensar: em suma a maior parte 
                        das regras que não estiverem listadas e descritas aqui se comportam de maneira 
                        muito similar à como funcionam no D&D. Entretanto, é fundamental destacar que este sistema não é uma mera cópia. 
                        Diversos aspectos foram ajustados, refinados ou completamente redesenhados para atender às particularidades e ao espírito do jogo.
                        As exceções mais facilmente averiguáveis são as condições, que serão e estarão um pouco diferentes. 
                    </p>
                    <p style={{ textIndent: '1%' }}>
                        Ainda que este jogo ofereça flexibilidade e liberdade criativa, é essencial que os jogadores tenham um entendimento básico 
                        das regras descritas aqui para que possam tomar decisões informadas e se engajar plenamente no jogo. Este núcleo de regras é 
                        suficiente para começar, e novos jogadores não precisam se sentir sobrecarregados por detalhes avançados desde o início.
                    </p>
                </div>
            )}

            {/* Container de Combate  */}
            <div className="Combat" onClick={() => setShowCombat(!showCombat)}>
                <img src="./images_system/sword.png" alt="Icon Combat" className="iconCombat" />
                <h2>Combate</h2>
            </div>

            { showCombat && (
                <div id="combat-text">
                    <img src="./images_system/combat.jpg" alt="Icon Text Combat" class="iconTextCombat" />
                    <p style={{textIndent: '1%'}}>
                        O combate em RPG é onde estratégia, trabalho em equipe e sorte se encontram. É o momento em que personagens provam seu valor, enfrentam desafios e moldam suas jornadas.
                        Espadas cortam o ar, flechas voam e magias explodem em meio ao caos. Mas não é apenas força que decide o resultado; decisões táticas e criatividade dos jogadores fazem toda a diferença. 
                        Cada turno oferece uma escolha: atacar, defender, ajudar um aliado ou recuar para lutar outro dia. 
                    </p>
                    <p style={{textIndent: '1%'}}>
                        Mais do que batalhas, o combate conta 
                        histórias. Ele revela quem são os inimigos, os motivos da luta e as consequências da vitória ou derrota. Cada encontro molda a narrativa, 
                        criando momentos épicos que serão lembrados por anos.
                    </p>
                    
                    <p class="defaultActions-text">
                        <i><h3>[Ações Padrões]</h3></i>
                    </p>
                    <p style={{textIndent: '1%'}}>
                        No <b>Sistema NEMO</b> se tem uma mecânica um tanto quanto mais 
                        flexível de ações do que em D&D apesar de que sua estrutura é muito similar. 
                        De início, para aqueles muito acostumados com o modelo tradicional D20, 
                        pode ser um pouco complicado, mas rapidamente se aprende a utilizar; em 
                        especial pela sua similaridade com outros jogos. 
                    </p>

                    <p style={{ textIndent: '1%' }}>
                        Todos os turnos os jogadores terão direito a uma <b>Ação Principal, Ação Rápida, Ação Movimentação, Ação Reação</b>: 
                        <div className="paragActions">
                            <p>
                                <b>Ação Principal:</b> Equivalente a uma Ação Padrão de D&D, podendo realizar 
                                    ataques padrões, utilizar para abrir uma porta, se movimentar, realizar um
                                    teste de perícia;
                            </p>

                            <p>
                                <b>Ação Rápida:</b> Nessa ação é possível sacar uma arma, uma poção, 
                                    realizar um ataque leve ou conjurar um feitiço muito 
                                    veloz. Todas as rolagens feitas utilizando uma Ação Rápida <b>SEMPRE</b> 
                                    serão apenas com <b>metade dos dados (arredondado para baixo)</b>;
                            </p>

                            <p>
                                <b>Ação Movimentação:</b> Todos os turnos o personagem pode utilizar sua Velocidade para se 
                                    movimentar <b>(5 + Agilidade + Modificador Movimentação)</b>. Regras como terreno 
                                    difícil continuam se aplicando;
                            </p>

                            <p>
                                <b>Ação Reação:</b> Pode ser utilizado para realizar manobras como <b>Aparar</b>, <b>Bloquear</b> e 
                                <b>Esquivar</b>, ao custo de <b>pontos de Estamina:</b>.
                                
                            </p>
                            <div className="paragReactions">
                                <p>
                                    <b>Aparar:</b> Só é possível de se fazer caso uma arma possua a capacidade de Aparar 
                                    e você tenha quaisquer níveis de Maestria com ela. Note, algumas 
                                    armas irão possuir um valor de “Aparar” que irá somar na sua tentativa 
                                    de aparar um ataque, reduzindo ou até mesmo anulando o dano. É 
                                    possível gastar quantos pontos de Estamina desejar para aprimorar sua 
                                    tentativa de defesa, mas é necessário gastar pelo menos <b>1 ponto de Estamina</b> para iniciar o 
                                    aparar. Caso o seu aparo seja bem-sucedido, então ele não consumirá 
                                    sua Reação, permitindo que você realize outras manobras defensivas 
                                    nesse turno;
                                </p>

                                <p>
                                    <b>Bloquear:</b> Geralmente uma manobra defensiva que só pode ser utilizada com 
                                    escudos, manifestações sobrenaturais ou algumas raras armas. Assim, essa manobra
                                    permite que você automaticamente reduza dano sem sequer uma rolagem, ao 
                                    custo de <b>1 ponto de Estamina</b>. Contudo, uma vez que o Bloqueio é 
                                    utilizado ele consome sua Reação, impedindo você de o fazer outra 
                                    vez no mesmo turno, sendo uma opção imediata segura, mas que pode 
                                    se demonstrar uma aposta arriscada;
                                </p>

                                <p>
                                    <b>Esquivar:</b> Quando um personagem é alvo de um ataque, ele pode optar 
                                    por gastar pontos equivalentes ao total de sucessos obtidos pelo atacante para evitar o dano. 
                                    Caso consiga, a reação não é consumida, permitindo que ele execute outras manobras defensivas 
                                    durante a mesma rodada.
                                </p>
                            </div>
                        </div>
                    </p>
                    
                    <p className="specialActions-text">
                        <i><h3>[Ações Especiais]</h3></i>
                    </p>           

                    <p style={{ textIndent: '1%' }}>
                        São as jogadas mais simples que você pode realizar ao combinar suas 
                        ações. Todos os personagens são capazes de as fazer portanto que possuam 
                        quaisquer nível de Escala — pois isso determina que possuem mínimo de 
                        treinamento e experiência para lidarem com uma situação de perigo. Elas 
                        estão listadas logo abaixo:                
                    </p>

                    <div className="SurpriseAttack" id="surpriseAttack-section">
                        <div className="SurpriseAttack-header">
                            <img src="./images_system/surpriseAttack.png" alt="Icon Text Surprise Attack" className="iconTextSurpriseAttack" />
                            <h1>Ataque Surpresa</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>
                            É usado em situações em que um personagem ou grupo toma os inimigos desprevenidos, garantindo uma vantagem 
                            significativa em combate. Geralmente, o Ataque Surpresa ocorre no início de uma luta, quando os oponentes não estão 
                            conscientes do perigo iminente. Personagens que impõem efeitos de Surpresa a algum inimigo <b>aumenta uma categoria</b> nas
                            rolagens de dados para ataques, tanto corpo a corpo, como ataques a distância.
                        </p>
                    </div>    

                    <div class="Race" id="race-section">
                        <div class="Race-header">
                            <img src="./images_system/race.jpg" alt="Icon Text Race" class="iconTextRace" />
                            <h1>Corrida</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>

                            A Corrida é ação especial que permite ao personagem aumentar sua Velocidade de deslocamento ao custo de 
                            sacrificar outras ações no turno. Essa mecânica é fundamental em situações onde rapidez e mobilidade são essenciais, 
                            como perseguições, fugas ou para alcançar uma posição estratégica no campo de batalha.
                            Para se movimentar em um turno, um personagem sempre utiliza até sua Velocidade total ao custo de uma <b>Ação de Movimento</b>.
                            Para que utilizar essa postura, ele pode: 
                        </p>
                        <div className="paragRace">
                            <p><b>Corrida Tática:</b> Ao custo também da <b>Ação Rápida</b> o personagem consegue se movimentar até 
                                    o <b>dobro da sua Velocidade</b>;</p>
                            <p><b>Corrida Explosiva:</b> Ao custo também da <b>Ação Rápida</b> e <b>Ação Padrão</b> o personagem consegue 
                                    se movimentar até o <b>triplo da sua Velocidade</b>;</p>
                        </div>
                    </div>  

                    <div className="CompleteDefense" id="completeDefense-section">
                        <div className="CompleteDefense-header">
                            <img src="./images_system/completeDefense.png" alt="Icon Text Complete Defense" className="iconTextCompleteDefense" />
                            <h1>Defesa Completa</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>
                            Qualquer personagem pode assumir essa postura. Ao entrar na defensiva, um personagem abre mão de todas as suas ações naquele 
                            turno, não contando com sua Ação de Movimento. Ao assumir essa forma, o personagem recebe mais uma <b>Ação de Reação</b> com o 
                            propósito de usar mais manobras defensivas: <b>Aparar</b>, <b>Bloquear</b>, <b>Esquivar</b>. Ao se passar 1 turno, caso não tenha utilizado essa 
                            Reação adicional, ele perde essa característica.
                        </p>
                    </div>  

                    <div className="Desingage" id="desingage-section">
                        <div className="Desingage-header">
                            <img src="./images_system/desingage.jpg" alt="Icon Text Desingage" className="iconTextDesingage" />
                            <h1>Desengaje</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>
                            O Desengaje é uma manobra defensiva que permite ao personagem se afastar de um combate corpo a corpo de forma segura, 
                            evitando ataques de oportunidade de inimigos adjacentes. Ao optar por essa ação, o personagem sacrifica parte de sua 
                            mobilidade em troca de uma retirada estratégica. 
                            
                            Assim, existem duas opções em que o personagem pode optar para executar esse movimento mais tático e cauteloso:
                        </p>
                        <div className="paragDesingage">
                            <p>
                                <b>Subterfúgio:</b> Ao custo da <b>Ação de Movimento</b> e da <b>Ação de Reação</b> o personagem se solta 
                                do combate corpo-a-corpo com um inimigo sem provocar ataques de oportunidade. Utilizando essa técnica 
                                o personagem se movimenta até <b>metade da sua Velocidade</b> apenas para trás;
                            </p>
                            <p>
                                <b>Fuga:</b> Ao custo também da <b>Ação Padrão</b>, <b>Ação Rápida</b>, <b>Ação de Movimento</b>, <b>Ação de Reação</b> 
                                tenha um <b>aumento em 1 ponto sua defesa</b>. O personagem usa toda sua Velocidade para mudar o seu posicionamento no embate ou fugir. 
                                Não provoca ataques de oportunidade.  
                            </p>
                        </div>
                    </div>    

                    <div className="CriticalFailure" id="criticalFailure-section">
                        <div className="CriticalFailure-header">
                            <img src="./images_system/criticalFailure.jpg" alt="Icon Text Critical Failure" className="iconTextCriticalFailure" />
                            <h1>Falha Crítica</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>
                            Quando um personagem em sua rolagem de dados não obtêm nenhum sucesso e ainda possui uma rolagem 1 no d10, ele está sobre essa 
                            características. Fica ao cargo do narrador definir uma situação desfavorável ao personagem pera seu resultado. Caso haja mais 
                            acúmulos de resultados 1's, segue a ordem abaixo: 
                            <div className="parag">
                                <p>Um dado 1 em falha crítica: evento desfavorável a sua ação;</p>
                                <p>Dois dados 1 em falha crítica: evento prejudicial a sua integridade física;</p>
                                <p>Três dados 1 em falha crítica: evento calamitoso até com pessoas ao seu redor.</p>
                            </div>
                        </p>
                        
                    </div>  

                    <div className="Flank" id="flank-section">
                        <div className="Flank-header">
                            <img src="./images_system/flank.jpeg" alt="Icon Text Flank" className="iconTextFlank" />
                            <h1>Flanqueio</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>
                            Para obter a característica de flanqueio, dois personagens aliados devem se posicionar em lados opostos de um inimigo, 
                            formando uma situação onde ele esteja adjacente a ambos. Essa tática representa a dificuldade do inimigo em se defender 
                            de múltiplas direções simultaneamente. Quando flanqueando um inimigo, os personagens aliados recebem 
                            um <b>aumento de categoria</b> de dados em seus ataques corpo a corpo, aproveitando a vantagem posicional para 
                            aumentar a efetividade de seus golpes.
                        </p>
                    </div>       

                    <div className="Numen" id="numen-section">
                        <div className="Numen-header">
                            <img src="./images_system/numen.jpg" alt="Icon Text Numen" className="iconTextNumen" />
                            <h1>Queimar Númen</h1>
                        </div>
                        <p style={{ textIndent: '1%' }}>
                            Como uma <b>Ação Livre</b> se o personagem possuir acesso a uma Energia Sobrenatural, 
                            ele pode queimar <b>1 ponto de Numen</b> para adicionar dados equivalentes ao seu <b>nível de Escala</b> em 
                            qualquer tipo de rolagem. Essa habilidade pode ser utilizada em todas as rolagens feitas no mesmo turno, 
                            porém, é necessário definir antecipadamente que a energia será gasta, não sendo permitido adicionar 
                            mais do que <b>1 ponto de Numen</b> para aumento dos dados em uma mesma rolagem.
                        </p>
                    </div>     
                </div>
            )}

            {/* Container de Confronto Social */}
            <div className="socialConfrontation" onClick={ () => setShowSocial(!showSocial)}>
                <img src="./images_system/sword.png" alt="Icon Social Confrontation" className="iconSocialConfrontation" />
                <h2>Confronto Social</h2>
            </div>

            { showSocial && (
                <div id="socialConfrontation-text">
                    <img src="./images_system/tavern.jpeg" alt="Icon Text Social Confrontation" className="iconTextSocialConfrontation" />
                    <p style={{textIndent: '1%'}}>
                        O Confronto Social é uma forma de resolução de conflitos tão importante quanto o combate físico em um RPG de mesa. Ele representa disputas verbais, negociações, blefes, intimidações ou debates — momentos em que os personagens usam sua lábia, carisma ou argumentos para atingir objetivos. Pode envolver persuadir um guarda a abrir os portões, intimidar um inimigo a recuar ou convencer um nobre a apoiar uma causa.
                    </p>
                    <p style={{textIndent: '1%'}}>
                        Assim como no combate tradicional, o Confronto Social envolve estratégia, interpretação e jogadas de dados. Cada palavra dita pode ser tão poderosa quanto uma espada, e uma boa atuação pode evitar batalhas, conquistar aliados ou virar o rumo da história. É nesse tipo de interação que os personagens mostram sua influência, empatia e inteligência emocional — moldando o mundo ao seu redor com palavras em vez de armas.                </p>
                </div>
            )}

            {/* Container de Outros */}
            <div className="others" onClick={ () => setShowOthers(!showOthers)}>
                <img src="./images_system/sword.png" alt="Icon Others" className="iconOthers" />
                <h2>Outros</h2>
            </div>

            { showOthers && (
                <div id="others-text">
                    <img src="./images_system/bonfire.jpeg" alt="Icon Text Others" className="iconTextOthers" />
                    <p style={{textIndent: '1%'}}>
                        Esta seção reúne regras e informações complementares que não se encaixam diretamente nas categorias principais, mas que ainda são importantes para o bom funcionamento do jogo. Aqui você encontrará mecânicas especiais, exceções, sugestões de interpretação, dicas de ambientação e outros detalhes que enriquecem a experiência de jogo. Sempre que algo novo for adicionado ao sistema e não tiver uma seção própria, é aqui que você deve procurar.                
                    </p>
                </div>
            )}

        </div>
    </div>
    
  );
}


