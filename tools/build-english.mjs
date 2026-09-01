import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(toolsDir, "..");
const domain = "https://willianquirino.com.br";

const replaceMany = (source, replacements) => {
  let output = source;
  [...replacements]
    .sort(([left], [right]) => right.length - left.length)
    .forEach(([from, to]) => { output = output.replaceAll(from, to); });
  return output;
};

const switcher = (ptHref, enHref) => `<nav class="language-switcher" aria-label="Language">
      <a href="${ptHref}" lang="pt-BR" hreflang="pt-BR" data-language-link="pt">PT</a><span aria-hidden="true">/</span><a href="${enHref}" lang="en" hreflang="en" data-language-link="en" aria-current="page">EN</a>
    </nav>`;

const setSwitcher = (html, ptHref, enHref) => html.replace(
  /<nav class="language-switcher"[\s\S]*?<\/nav>/,
  switcher(ptHref, enHref)
);

const setCanonical = (html, ptCanonical, enCanonical) => {
  let output = html.replaceAll(ptCanonical, enCanonical);
  output = output
    .replace(`<link rel="alternate" hreflang="pt-BR" href="${enCanonical}">`, `<link rel="alternate" hreflang="pt-BR" href="${ptCanonical}">`)
    .replace(`<link rel="alternate" hreflang="x-default" href="${enCanonical}">`, `<link rel="alternate" hreflang="x-default" href="${ptCanonical}">`);
  return output;
};

const common = [
  ['<html lang="pt-BR">', '<html lang="en">'],
  ['content="pt_BR"', 'content="en_US"'],
  [">Pular para o conteúdo<", ">Skip to content<"],
  ['aria-label="Willian Quirino, início"', 'aria-label="Willian Quirino, home"'],
  ['<small>Autor</small>', '<small>Author</small>'],
  ['<span class="sr-only">Abrir menu</span>', '<span class="sr-only">Open menu</span>'],
  ['aria-label="Navegação principal"', 'aria-label="Main navigation"'],
  ['aria-label="Links do rodapé"', 'aria-label="Footer links"'],
  ['aria-label="Links da página"', 'aria-label="Page links"'],
  ['>Livros<', '>Books<'],
  ['>Trilhas<', '>Soundtracks<'],
  ['>O autor<', '>The author<'],
  ['>Autor<', '>Author<'],
  ['>Loja UICLAP<', '>UICLAP store<'],
  ['>Privacidade<', '>Privacy<'],
  ['>Início<', '>Home<'],
  ['>Gerenciar cookies<', '>Manage cookies<'],
  ['Ficção, fantasia e mundos ilustrados.', 'Fiction, fantasy, and illustrated worlds.'],
  ['Ficção científica, fantasia sombria e mundos ilustrados.', 'Science fiction, dark fantasy, and illustrated worlds.'],
  ['<small>Histórias de Mentel</small>', '<small>Mentel Stories</small>'],
  ['Capa do livro ', 'Cover of the book '],
  ['Capa de ', 'Cover of '],
  ['"name":"Início"', '"name":"Home"'],
];

const homeTranslations = [
  ...common,
  ['Conheça os livros, personagens, mundos e trilhas sonoras de Willian Quirino. Ficção científica, fantasia sombria e histórias ilustradas.', 'Discover Willian Quirino’s books, characters, worlds, and original soundtracks. Science fiction, dark fantasy, and illustrated stories.'],
  ['Conheça os livros, personagens, mundos e trilhas sonoras de Willian Quirino.', 'Discover Willian Quirino’s books, characters, worlds, and original soundtracks.'],
  ['Ficção científica, fantasia sombria, personagens e mundos ilustrados de Willian Quirino.', 'Science fiction, dark fantasy, characters, and illustrated worlds by Willian Quirino.'],
  ['Willian Quirino | Livros', 'Willian Quirino | Books'],
  ['Universos literários de Willian Quirino', 'The literary worlds of Willian Quirino'],
  ['Guias de leitura, personagens e mundos', 'Reading guides, characters, and worlds'],
  ['Entre pelo caminho que mais chama <em>você.</em>', 'Enter through the path that calls to <em>you.</em>'],
  ['Três obras, três atmosferas e um mesmo convite: escolher o primeiro mundo a atravessar.', 'Three books, three atmospheres, and one invitation: choose the first world you want to cross.'],
  ['Conheça os livros', 'Discover the books'],
  ['Explorar mundos', 'Explore the worlds'],
  ['Três portas de entrada', 'Three ways in'],
  ['aria-label="Resumo dos universos"', 'aria-label="Worlds at a glance"'],
  ['livros para explorar', 'books to explore'],
  ['mundos em conflito', 'worlds in conflict'],
  ['universo em expansão', 'expanding universe'],
  ['Primeira escolha', 'Your first choice'],
  ['Por onde começar?', 'Where should you begin?'],
  ['Cada livro abre uma porta diferente: o medo das florestas, a queda de um estranho no sertão ou a transformação de um homem em meio ao caos urbano. Escolha pela sensação que você quer encontrar primeiro.', 'Each book opens a different door: fear beyond the forest, a stranger falling into Brazil’s backlands, or one man’s transformation amid urban chaos. Choose the feeling you want to encounter first.'],
  ['Fantasia sombria · Sobrevivência', 'Dark fantasy · Survival'],
  ['Para quem quer atravessar muralhas, medo e uma floresta onde o perigo pode revelar verdades enterradas.', 'For readers ready to cross walls, fear, and a forest where danger may uncover buried truths.'],
  ['Ficção científica · Aventura', 'Science fiction · Adventure'],
  ['Para quem quer começar pela queda de um estranho no sertão e por uma guerra antiga entre mundos.', 'For readers drawn to a stranger’s fall in the Brazilian backlands and an ancient war between worlds.'],
  ['Distopia · Super-humano', 'Dystopia · Superhuman'],
  ['Para quem prefere uma metrópole dura, uma cura impossível e uma força que nasce fora de controle.', 'For readers who prefer a harsh metropolis, an impossible cure, and a power born beyond control.'],
  ['aria-label="Informações do livro"', 'aria-label="Book information"'],
  ['458 páginas', '458 pages'], ['268 páginas', '268 pages'], ['316 páginas', '316 pages'],
  ['Edição ilustrada', 'Illustrated edition'],
  ['Ler o primeiro capítulo', 'Read the first chapter in Portuguese'],
  ['Ler trechos selecionados', 'Read selected excerpts in Portuguese'],
  ['Explorar a história', 'Explore the story'],
  ['aria-label="Edições de A Terra dos Monstros"', 'aria-label="Editions of A Terra dos Monstros"'],
  ['aria-label="Edições de Elemental"', 'aria-label="Editions of Elemental"'],
  ['aria-label="Edições de Veter"', 'aria-label="Editions of Veter"'],
  ['<strong>Impresso</strong><small>Ilustrado + bônus</small>', '<strong>Print</strong><small>Illustrated + bonus pages</small>'],
  ['<strong>Kindle</strong><small>Sem ilustrações/bônus</small>', '<strong>Kindle</strong><small>No illustrations/bonus pages</small>'],
  ['Rostos da travessia', 'Faces of the journey'],
  ['Personagens em caminhos extremos.', 'Characters on extreme paths.'],
  ['Alguns buscam respostas, outros sobrevivem ao que fizeram deles. O ponto em comum é a travessia: cada personagem é levado a encarar um limite diferente do próprio mundo.', 'Some seek answers; others survive what was done to them. What unites them is the crossing: each character must face a different boundary within their world.'],
  ['Uma jovem de Braen que cresceu entre escassez, vigilância e muralhas. Seu desejo de entender o que existe além das fronteiras pode colocá-la diante de verdades perigosas.', 'A young woman from Braen raised among scarcity, surveillance, and walls. Her need to understand what lies beyond the border may lead her to dangerous truths.'],
  ['“As muralhas protegem. Mas também escondem.”', '“The walls protect. But they also conceal.”'],
  ['Do sertão pernambucano para uma guerra ancestral entre mundos, ela é arrastada para uma história maior do que qualquer explicação simples poderia conter.', 'From Pernambuco’s backlands into an ancient war between worlds, she is pulled into a story too vast for any simple explanation.'],
  ['“O céu caiu perto demais da Terra.”', '“The sky fell far too close to Earth.”'],
  ['O herdeiro de Mendels', 'The heir of Mendels'],
  ['Um estranho vindo de uma linhagem perdida, carregando marcas de uma guerra que atravessa estrelas, nomes antigos e poderes elementares.', 'A stranger from a lost bloodline, carrying the marks of a war that crosses stars, ancient names, and elemental powers.'],
  ['“Algumas quedas parecem acidente. Outras parecem destino.”', '“Some falls look like accidents. Others look like destiny.”'],
  ['Um entregador comum em Belonia, preso a uma rotina áspera, até que uma tentativa de cura o coloca no centro de uma transformação imprevisível.', 'An ordinary courier in Belonia, trapped in a harsh routine until an attempted cure places him at the center of an unpredictable transformation.'],
  ['“A cura devolveu movimento. O preço veio depois.”', '“The cure restored movement. The price came later.”'],
  ['Entre a obediência às muralhas e o chamado da floresta, ela precisa descobrir se sobreviver também significa desobedecer.', 'Caught between obedience to the walls and the call of the forest, she must discover whether survival also means disobedience.'],
  ['Uma garota do sertão pernambucano atravessada por uma guerra antiga, onde o céu, a Terra e Mendels deixam de ser mundos separados.', 'A girl from Pernambuco’s backlands caught in an ancient war where the sky, Earth, and Mendels are no longer separate worlds.'],
  ['Um corpo devolvido ao movimento, uma humanidade colocada em dúvida e uma força que cresce mais rápido do que qualquer controle.', 'A body restored to movement, a humanity thrown into doubt, and a power growing faster than any attempt to control it.'],
  ['Territórios e fronteiras', 'Territories and borders'],
  ['Mapa dos mundos.', 'Map of the worlds.'],
  ['Mapa dos mundos', 'Map of the worlds'],
  ['Os mundos das histórias se organizam por fronteiras: cidades contra florestas, Terra contra Mendels, tecnologia contra corpo. O perigo quase sempre começa quando alguém atravessa uma linha proibida.', 'These worlds are shaped by borders: cities against forests, Earth against Mendels, technology against the body. Danger almost always begins when someone crosses a forbidden line.'],
  ['Braen e as cidades-fortaleza', 'Braen and the fortress cities'],
  ['Um mundo cercado por muralhas, escassez e criaturas que transformaram a sobrevivência em rotina.', 'A world enclosed by walls, scarcity, and creatures that have turned survival into routine.'],
  ['<li>Muralhas</li>', '<li>Walls</li>'], ['<li>Floresta</li>', '<li>Forest</li>'], ['<li>Monstros</li>', '<li>Monsters</li>'],
  ['Além das fronteiras', 'Beyond the borders'],
  ['A floresta', 'The forest'],
  ['O território do medo, daquilo que a cidade tenta manter distante e do que talvez explique a origem das ameaças.', 'The realm of fear, of everything the city tries to keep away, and of what may explain the origin of its threats.'],
  ['Universos de Willian Quirino', 'Worlds by Willian Quirino'],
  ['Terra, Pernambuco e Mendels', 'Earth, Pernambuco, and Mendels'],
  ['O sertão encontra uma guerra interestelar. A queda de um estranho abre a passagem entre mundos e linhagens.', 'Brazil’s backlands meet an interstellar war. A stranger’s fall opens a passage between worlds and bloodlines.'],
  ['Sertão', 'Backlands'], ['Mundos', 'Worlds'], ['Legado', 'Legacy'],
  ['Uma metrópole distópica, tecnológica e emocional, onde acidentes, experimentos e perdas mudam o corpo e a identidade.', 'A technological, emotional, dystopian metropolis where accidents, experiments, and loss reshape body and identity.'],
  ['Metrópole', 'Metropolis'], ['Experimento', 'Experiment'], ['Transformação', 'Transformation'],
  ['Um mundo de sobreviventes, cidades-fortaleza e florestas tomadas por criaturas. O medo ali não vive apenas fora dos muros.', 'A world of survivors, fortress cities, and creature-infested forests. Fear does not live only beyond the walls.'],
  ['Uma linhagem perdida, poderes elementares e uma guerra que alcança a Terra através de uma queda no sertão pernambucano.', 'A lost bloodline, elemental powers, and a war that reaches Earth through a fall in Pernambuco’s backlands.'],
  ['Uma metrópole de tecnologia e desigualdade, onde a promessa de cura abre espaço para algo mais intenso, perigoso e incontrolável.', 'A metropolis of technology and inequality where the promise of a cure gives way to something more intense, dangerous, and uncontrollable.'],
  ['Mundos para ler e ouvir', 'Worlds to read and hear'],
  ['As histórias também têm trilha sonora', 'Every story has a soundtrack'],
  ['As músicas ampliam a atmosfera dos livros: a tensão das muralhas em A Terra dos Monstros e a energia urbana de Veter.', 'The music expands each book’s atmosphere: the tension within the walls of A Terra dos Monstros and the urban energy of Veter.'],
  ['Trilha sonora original', 'Original soundtrack'],
  ['Trilha sonora de A Terra dos Monstros no Spotify', 'Soundtrack for A Terra dos Monstros on Spotify'],
  ['Trilha sonora de Veter no Spotify', 'Soundtrack for Veter on Spotify'],
  ['Sombria, atmosférica e tensa, feita para acompanhar a vida dentro das muralhas e o medo da floresta.', 'Dark, atmospheric, and tense—made to accompany life within the walls and the fear of the forest.'],
  ['Urbana, distópica e emocional, acompanhando transformação, perda e uma força incontrolável.', 'Urban, dystopian, and emotional—following transformation, loss, and an uncontrollable power.'],
  ['Abrir álbum no Spotify', 'Open album on Spotify'],
  ['Explorar trilhas e músicas do universo', 'Explore the soundtracks and music'],
  ['Sobre o autor', 'About the author'],
  ['Imaginar foi o começo.<br>Persistir fez o universo crescer.', 'Imagination was the beginning.<br>Persistence made the universe grow.'],
  ['Willian Quirino é autor de obras de fantasia, ficção científica e mundos marcados por conflitos, memórias, sobrevivência e transformação.', 'Willian Quirino writes fantasy and science fiction set in worlds shaped by conflict, memory, survival, and transformation.'],
  ['Suas histórias nasceram em antigos diários manuscritos e voltaram à vida anos depois como livros ilustrados, trilhas sonoras e universos em expansão.', 'His stories began in handwritten childhood journals and returned to life years later as illustrated books, original soundtracks, and expanding worlds.'],
  ['Para Willian, cada obra não se limita apenas às páginas: ela também pode ser sentida por meio de imagens, sons e emoções.', 'For Willian, a story is not confined to the page: it can also be experienced through images, sound, and emotion.'],
  ['Conhecer a trajetória', 'Discover his journey'],
  ['Ouvir as trilhas', 'Listen to the soundtracks'],
  ['Começar', 'Start here'], ['Personagens', 'Characters'], ['Autor', 'Author'],
  ['Por onde começar', 'Where to begin'],
  ['aria-label="Conhecer A Terra dos Monstros"', 'aria-label="Discover A Terra dos Monstros"'],
  ['aria-label="Conhecer As Histórias de Mentel: Elemental"', 'aria-label="Discover As Histórias de Mentel: Elemental"'],
  ['aria-label="Conhecer Veter"', 'aria-label="Discover Veter"'],
  ['Livros e universos de Willian Quirino.', 'Books and worlds by Willian Quirino.'],
  ['"inLanguage": "pt-BR"', '"inLanguage": "en"'],
  ['"description": "Livros, personagens, mundos e trilhas sonoras de Willian Quirino."', '"description": "Books, characters, worlds, and original soundtracks by Willian Quirino."'],
  ['"jobTitle": "Autor, ilustrador e compositor"', '"jobTitle": "Author, illustrator, and composer"'],
];

const bookCommon = [
  ...common,
  ['Livro de Willian Quirino', 'Book by Willian Quirino'],
  [' — edição impressa ilustrada', ' — illustrated print edition'],
  ['Modelo tridimensional do livro ', 'Three-dimensional model of '],
  ['. Arraste para girar.', '. Drag to rotate.'],
  ['Capa de ', 'Cover of '],
  ['Arraste para girar', 'Drag to rotate'],
  ['Voltar o livro para a posição inicial', 'Return the book to its initial position'],
  ['Reposicionar', 'Reset'],
  ['aria-label="Informações do livro"', 'aria-label="Book information"'],
  [' páginas</li>', ' pages</li>'],
  ['Edição ilustrada', 'Illustrated edition'],
  ['Português', 'Portuguese'],
  ['Impresso ou digital', 'Print or digital'],
  ['Escolha sua edição', 'Choose your edition'],
  ['A história é a mesma, mas os extras mudam. A edição impressa foi criada como experiência visual; o Kindle oferece a leitura digital.', 'The story is the same, but the extras differ. The print edition was designed as a visual experience; Kindle offers digital reading. Both editions are currently in Portuguese.'],
  ['Edição impressa · UICLAP', 'Print edition · UICLAP'],
  ['Livro ilustrado + páginas bônus', 'Illustrated book + bonus pages'],
  ['Inclui as ilustrações e o conteúdo bônus exclusivos da edição física.', 'Includes illustrations and bonus content exclusive to the physical edition.'],
  ['páginas</span>', 'pages</span>'], ['formato</span>', 'format</span>'], ['acabamento</span>', 'finish</span>'],
  ['Preto e branco em papel offset · capa brilho', 'Black and white on offset paper · glossy cover'],
  ['Preço consultado em', 'Price checked on'],
  ['Ver preço e entrega na UICLAP', 'Check price and delivery on UICLAP'],
  ['Produção, preço final e prazo de entrega são informados pela UICLAP.', 'Production, final price, and delivery times are provided by UICLAP.'],
  ['Leitura digital', 'Digital reading'],
  ['Disponível para Kindle e aplicativos Kindle. Esta versão não inclui as ilustrações nem as páginas bônus da edição impressa.', 'Available for Kindle devices and apps. This version does not include the illustrations or bonus pages from the print edition.'],
  ['Leitura imediata após a compra', 'Read immediately after purchase'],
  ['Fonte e tamanho ajustáveis', 'Adjustable font and text size'],
  ['Sincronização entre dispositivos compatíveis', 'Sync across compatible devices'],
  ['Ver eBook na Amazon', 'View eBook on Amazon'],
  ['Preço e disponibilidade são informados pela Amazon.', 'Price and availability are provided by Amazon.'],
  ['Entre neste universo', 'Enter this world'],
  ['A edição reúne narrativa e ilustrações para transformar momentos centrais da jornada em uma experiência visual.', 'The edition combines narrative and illustrations, turning key moments of the journey into a visual experience.'],
  ['Ilustração 1 do universo de ', 'Illustration 1 from the world of '],
  ['Ilustração 2 do universo de ', 'Illustration 2 from the world of '],
  ['Ilustração 3 do universo de ', 'Illustration 3 from the world of '],
  ['Ouça antes de entrar nesse mundo', 'Listen before entering this world'],
  ['Trilha sonora original', 'Original soundtrack'],
  ['Abrir álbum no Spotify', 'Open album on Spotify'],
  ['Trilha sonora de ', 'Soundtrack for '],
  [' no Spotify', ' on Spotify'],
  ['A história continua', 'The story continues'],
  ['Descubra o que existe depois do primeiro capítulo.', 'Discover what lies beyond the first chapter.'],
  ['Comparar edições', 'Compare editions'],
  ['Atualmente disponível em português.', 'Currently available in Portuguese.'],
];

const bookTranslations = {
  "a-terra-dos-monstros": [
    ...bookCommon,
    ['Em Avoltera, Melina precisa atravessar os limites das cidades-fortaleza e descobrir verdades mais perigosas do que os monstros.', 'In Avoltera, Melina must cross the boundaries of the fortress cities and uncover truths more dangerous than the monsters.'],
    ['Fantasia sombria e distopia', 'Dark fantasy and dystopia'],
    ['Quando as muralhas deixam de ser proteção, o mundo do lado de fora deixa de ser a única ameaça.', 'When the walls no longer offer protection, the world outside is no longer the only threat.'],
    ['Leia o primeiro capítulo grátis', 'Read the first chapter in Portuguese'],
    ['Escolher edição', 'Choose an edition'],
    ['Livro impresso com ilustrações oficiais', 'Print book with official illustrations'],
    ['aria-label="Explore a página"', 'aria-label="Explore this page"'],
    ['A história', 'The story'], ['Ilustrações', 'Illustrations'], ['Trilha sonora', 'Soundtrack'], ['Ler grátis', 'Read preview'],
    ['Do lado de dentro, regras. Do lado de fora, monstros.', 'Inside, there are rules. Outside, there are monsters.'],
    ['Em Braen, sobreviver significa confiar em muralhas, vigias e rotinas que não podem falhar. Melina conhece esse mundo por dentro, até que uma fera rompe as defesas e transforma a segurança da cidade em uma pergunta.', 'In Braen, survival means trusting walls, guards, and routines that cannot fail. Melina knows this world from within—until a beast breaches the defenses and turns the city’s safety into a question.'],
    ['Entre fantasia sombria e tensão distópica, <em>A Terra dos Monstros</em> acompanha uma jornada sobre medo, pertencimento e as verdades que uma sociedade esconde para continuar de pé.', 'Between dark fantasy and dystopian tension, <em>A Terra dos Monstros</em> follows a journey through fear, belonging, and the truths a society hides to remain standing.'],
    ['Começar pelo primeiro capítulo', 'Read the first chapter in Portuguese'],
    ['Uma criatura gigantesca avança contra os defensores de Avoltera', 'A gigantic creature advances against Avoltera’s defenders'],
    ['A ameaça diante das muralhas', 'The threat before the walls'],
    ['Há coisas que nenhuma fortaleza consegue manter do lado de fora.', 'Some things cannot be kept outside, no matter how strong the fortress.'],
    ['As ilustrações oficiais transformam os conflitos de Avoltera em cenas que ampliam a tensão e a escala da jornada.', 'The official illustrations turn Avoltera’s conflicts into scenes that expand the tension and scale of the journey.'],
    ['A ameaça atravessa as defesas', 'The threat breaches the defenses'],
    ['O medo que vive além das muralhas', 'The fear that lives beyond the walls'],
    ['Braen, uma cidade feita para resistir', 'Braen, a city built to endure'],
    ['Uma trilha sombria, atmosférica e tensa, criada para acompanhar a vida dentro das muralhas e o medo que atravessa a floresta.', 'A dark, atmospheric, tense soundtrack created to accompany life within the walls and the fear moving through the forest.'],
    ['A muralha é apenas o começo', 'The wall is only the beginning'],
    ['Entre em Avoltera antes que os portões se fechem.', 'Enter Avoltera before the gates close.'],
    ['Ler capítulo grátis', 'Read the Portuguese preview'],
  ],
  elemental: [
    ...bookCommon,
    ['O último herdeiro de Mendels cai no sertão de Pernambuco enquanto uma guerra atravessa as estrelas.', 'The last heir of Mendels falls into Pernambuco’s backlands while a war crosses the stars.'],
    ['Ficção científica e aventura', 'Science fiction and adventure'],
    ['Uma linhagem perdida. Uma guerra interestelar. Um encontro improvável no sertão.', 'A lost bloodline. An interstellar war. An unlikely encounter in Brazil’s backlands.'],
    ['Leia trechos grátis', 'Read excerpts in Portuguese'],
    ['Escolher edição', 'Choose an edition'],
    ['Uma história sobre space opera, caatinga, legado', 'A story of space opera, the caatinga, and legacy'],
    ['Ler os trechos selecionados', 'Read selected excerpts in Portuguese'],
    ['Ler trechos grátis', 'Read the Portuguese excerpts'],
  ],
  veter: [
    ...bookCommon,
    ['Um entregador sem perspectivas aceita uma cura impossível e desperta transformado em algo imprevisível.', 'A courier with no prospects accepts an impossible cure and awakens transformed into something unpredictable.'],
    ['Distopia e super-humano', 'Dystopia and superhuman fiction'],
    ['A cura devolveu seus movimentos. O experimento tirou sua antiga humanidade.', 'The cure restored his movement. The experiment took away his former humanity.'],
    ['Leia o primeiro capítulo grátis', 'Read the first chapter in Portuguese'],
    ['Escolher edição', 'Choose an edition'],
    ['Uma história sobre conspiração, biotecnologia, anti-herói', 'A story of conspiracy, biotechnology, and an antihero'],
    ['Começar a leitura gratuita', 'Read the first chapter in Portuguese'],
    ['Uma trilha urbana, distópica e emocional, conduzida por transformação, perda e uma força que já não pode ser controlada.', 'An urban, dystopian, emotional soundtrack driven by transformation, loss, and a power that can no longer be controlled.'],
    ['Ler capítulo grátis', 'Read the Portuguese preview'],
  ],
};

const authorTranslations = [
  ...common,
  ['Willian Quirino | Autor, ilustrador e compositor', 'Willian Quirino | Author, illustrator, and composer'],
  ['Conheça a trajetória de Willian Quirino: dos manuscritos de infância à publicação de Elemental, Veter e A Terra dos Monstros.', 'Discover Willian Quirino’s journey, from childhood manuscripts to the publication of Elemental, Veter, and A Terra dos Monstros.'],
  ['Autor, ilustrador e compositor', 'Author, illustrator, and composer'],
  ['Sobre o autor', 'About the author'],
  ['Retrato em preto e branco de Willian Quirino', 'Black-and-white portrait of Willian Quirino'],
  ['Histórias perdidas.<br>Universos reencontrados.', 'Lost stories.<br>Worlds rediscovered.'],
  ['Willian Quirino escreve fantasia e ficção científica atravessadas por conflitos, memórias, sobrevivência e transformação. Sua trajetória começou ainda na infância, antes que ele compreendesse completamente a dimensão dos mundos que estava criando.', 'Willian Quirino writes fantasy and science fiction shaped by conflict, memory, survival, and transformation. His journey began in childhood, before he fully understood the scale of the worlds he was creating.'],
  ['Os primeiros registros de <em>Elemental</em> foram escritos à mão em um diário de 2006, quando Willian tinha por volta de dez anos. Em outro diário, de 2008, surgiram os manuscritos de <em>Veter</em>.', 'The earliest pages of <em>Elemental</em> were handwritten in a 2006 journal, when Willian was about ten years old. The first manuscripts of <em>Veter</em> appeared in another journal in 2008.'],
  ['Depois de sofrer um derrame em 2012, grande parte das memórias anteriores àquele período se tornou fragmentada. Em 2013, antigos cadernos guardados revelaram histórias ainda inacabadas e abriram um caminho para reencontrar aquilo que havia sido criado.', 'After suffering a stroke in 2012, many of his earlier memories became fragmented. In 2013, preserved notebooks revealed unfinished stories and opened a path back to what he had created.'],
  ['Conhecer os livros', 'Discover the books'], ['Ouvir as trilhas', 'Listen to the soundtracks'],
  ['Escrever também foi uma forma de reconstruir.', 'Writing also became a way to rebuild.'],
  ['Ao reencontrar os diários, Willian decidiu respeitar a essência das histórias criadas no passado. <em>Elemental</em> já possuía sua ideia central formada; em vez de substituí-la, ele continuou o universo que encontrou nos próprios cadernos.', 'When he rediscovered the journals, Willian chose to preserve the essence of the stories he had created. <em>Elemental</em> already had its central idea; instead of replacing it, he continued the universe he found in his own notebooks.'],
  ['Em 2016, começou a desenvolver uma crônica ainda não publicada, criada para narrar acontecimentos anteriores a <em>Elemental</em>. A obra permanece em desenvolvimento e faz parte do universo maior que conecta suas histórias.', 'In 2016, he began developing an unpublished chronicle set before <em>Elemental</em>. The work remains in development and belongs to the larger universe connecting his stories.'],
  ['Em 2017, concluiu <em>Elemental</em> e <em>Veter</em> e iniciou, novamente à mão, <em>A Terra dos Monstros</em>, finalizada no ano seguinte.', 'In 2017, he completed <em>Elemental</em> and <em>Veter</em>, then began writing <em>A Terra dos Monstros</em> by hand, finishing it the following year.'],
  ['Para Willian, uma história não termina nas palavras. Ilustrações, sons e emoções também podem aproximar o leitor de um mundo imaginado.', 'For Willian, a story does not end with words. Illustrations, sound, and emotion can also bring readers closer to an imagined world.'],
  ['Uma trajetória em construção', 'A journey still unfolding'], ['Dos diários à publicação', 'From journals to publication'],
  ['As primeiras páginas de Elemental', 'The first pages of Elemental'],
  ['Os registros mais antigos da história aparecem em um diário manuscrito, quando Willian tinha por volta de dez anos.', 'The oldest records of the story appear in a handwritten journal from when Willian was about ten.'],
  ['O nascimento de Veter', 'The birth of Veter'],
  ['Outro diário preserva os primeiros manuscritos da obra que viria a acompanhar sua jornada literária.', 'Another journal preserves the first manuscripts of the work that would accompany his literary journey.'],
  ['Memórias fragmentadas', 'Fragmented memories'], ['Um derrame afeta grande parte das lembranças anteriores daquele período.', 'A stroke affects many of his memories from before that period.'],
  ['O reencontro com os diários', 'Rediscovering the journals'], ['Os cadernos antigos devolvem histórias inacabadas e pistas de um universo que precisava continuar.', 'The old notebooks return unfinished stories and clues to a universe that needed to continue.'],
  ['Uma história anterior a Elemental', 'A story set before Elemental'], ['Começa o desenvolvimento de uma crônica ainda inédita, ambientada antes dos acontecimentos do livro.', 'Development begins on an unpublished chronicle set before the events of the book.'],
  ['Dois finais e um novo começo', 'Two endings and a new beginning'], ['<em>Elemental</em> e <em>Veter</em> são concluídos. No mesmo ano, começa o manuscrito de <em>A Terra dos Monstros</em>.', '<em>Elemental</em> and <em>Veter</em> are completed. That same year, the manuscript of <em>A Terra dos Monstros</em> begins.'],
  ['A Terra dos Monstros é concluída', 'A Terra dos Monstros is completed'], ['A história de Melina e das cidades-fortaleza encontra sua forma completa no diário.', 'Melina’s story and the fortress cities reach their complete form in the journal.'],
  ['Os cadernos se tornam livros', 'The notebooks become books'], ['Os manuscritos são transcritos, revisados e acompanhados por ilustrações e trilhas sonoras próprias.', 'The manuscripts are transcribed, revised, and accompanied by original illustrations and soundtracks.'],
  ['As histórias chegam aos leitores', 'The stories reach readers'], ['<em>Veter</em>, <em>Elemental</em> e <em>A Terra dos Monstros</em> são publicados pela UICLAP.', '<em>Veter</em>, <em>Elemental</em>, and <em>A Terra dos Monstros</em> are published through UICLAP.'],
  ['Reconstrução pessoal', 'Personal reconstruction'], ['Histórias criadas na infância, reencontradas depois da perda de memória e finalmente compartilhadas com os leitores.', 'Stories created in childhood, rediscovered after memory loss, and finally shared with readers.'],
  ['"jobTitle":"Autor, ilustrador e compositor"', '"jobTitle":"Author, illustrator, and composer"'],
  ['"description":"Autor de fantasia e ficção científica, criador das Histórias de Mentel."', '"description":"Fantasy and science-fiction author and creator of the Mentel Stories."'],
];

const soundtrackTranslations = [
  ...common,
  ['Trilhas e músicas do universo | Willian Quirino', 'Soundtracks and music | Willian Quirino'],
  ['Explore a discografia de Willian Quirino: trilhas de A Terra dos Monstros e Veter, álbuns, EPs e singles lançados em 2025 e 2026.', 'Explore Willian Quirino’s discography: soundtracks for A Terra dos Monstros and Veter, plus albums, EPs, and singles released in 2025 and 2026.'],
  ['Mundos para ler e ouvir', 'Worlds to read and hear'], ['Trilhas e músicas do universo', 'Soundtracks and music'],
  ['Álbuns, EPs e singles criados para levar as histórias além das páginas e transformar cada universo em som.', 'Albums, EPs, and singles created to carry the stories beyond the page and turn each universe into sound.'],
  ['aria-label="Plataformas musicais"', 'aria-label="Music platforms"'],
  ['Trilhas principais', 'Featured soundtracks'], ['Dois universos, duas identidades sonoras', 'Two worlds, two musical identities'],
  ['As trilhas foram compostas para acompanhar o ritmo emocional de cada história, dos muros de Avoltera às ruas de Belonia.', 'The soundtracks were composed to follow each story’s emotional rhythm, from the walls of Avoltera to the streets of Belonia.'],
  ['Uma trilha sombria, atmosférica e tensa, criada para acompanhar a vida dentro das muralhas e o medo que atravessa a floresta.', 'A dark, atmospheric, tense soundtrack created to accompany life within the walls and the fear moving through the forest.'],
  ['Uma trilha urbana, distópica e emocional, conduzida por transformação, perda e uma força que já não pode ser controlada.', 'An urban, dystopian, emotional soundtrack driven by transformation, loss, and a power that can no longer be controlled.'],
  ['Trilha sonora original', 'Original soundtrack'], ['Trilha sonora de ', 'Soundtrack for '], [' no Spotify', ' on Spotify'], ['Ouvir no Spotify', 'Listen on Spotify'],
  ['Discografia', 'Discography'], ['Lançamentos do universo', 'Releases from the universe'], ['Uma coleção em expansão, reunindo trilhas completas e composições lançadas separadamente.', 'An expanding collection of complete soundtracks and separately released compositions.'],
  ['Álbum ·', 'Album ·'], [' faixas', ' tracks'], ['1 faixa', '1 track'],
  ['A primeira travessia musical por Braen: rotina, tensão e os perigos que permanecem além das muralhas.', 'The first musical journey through Braen: routine, tension, and the dangers waiting beyond the walls.'],
  ['Uma jornada urbana e distópica que acompanha Veter entre perdas, escolhas e confrontos.', 'An urban, dystopian journey following Veter through loss, choices, and confrontation.'],
  ['O universo se expande com novas sombras, ameaças ocultas e caminhos pela floresta.', 'The universe expands with new shadows, hidden threats, and paths through the forest.'],
  ['Seis faixas sobre memória, afeto e a identidade que resiste à transformação.', 'Six tracks about memory, affection, and the identity that survives transformation.'],
  ['Um encerramento musical marcado por despedida, lembrança e permanência.', 'A musical ending shaped by farewell, remembrance, and what remains.'],
  ['Uma passagem sonora rumo ao desconhecido que existe além da proteção das muralhas.', 'A sonic passage toward the unknown beyond the protection of the walls.'],
  ['Uma composição ligada ao universo de Veter sobre resistência, memória e esperança.', 'A composition connected to Veter’s world, exploring resilience, memory, and hope.'],
  ['aria-label="Ouvir ', 'aria-label="Listen to '],
];

const privacyTranslations = [
  ...common,
  ['Privacidade e cookies | Willian Quirino', 'Privacy and cookies | Willian Quirino'],
  ['Saiba como o site de Willian Quirino utiliza armazenamento local, métricas, publicidade e conteúdos externos.', 'Learn how Willian Quirino’s website uses local storage, analytics, advertising, and third-party content.'],
  ['Transparência', 'Transparency'], ['Privacidade e cookies', 'Privacy and cookies'],
  ['Você escolhe quais recursos não essenciais podem ser carregados durante a visita.', 'You choose which non-essential features may be loaded during your visit.'],
  ['Última atualização: 27 de agosto de 2026.', 'Last updated: August 27, 2026.'],
  ['O que este site coleta', 'What this website collects'],
  ['O site pode utilizar dados técnicos de navegação para entender visitas, melhorar páginas e medir cliques em prévias, músicas e lojas. Esses recursos permanecem desativados até que você faça uma escolha no aviso de cookies.', 'The website may use technical browsing data to understand visits, improve pages, and measure clicks on previews, music, and stores. These features remain disabled until you make a choice in the cookie notice.'],
  ['Categorias utilizadas', 'Categories used'], ['Necessários', 'Necessary'],
  ['Guardam localmente sua preferência de privacidade e permitem o funcionamento básico do site. Não podem ser desativados.', 'Stores your privacy preference locally and enables essential website functions. It cannot be disabled.'],
  ['Analíticos', 'Analytics'], ['Quando autorizados, o Google Analytics ajuda a medir páginas visitadas e interações de forma agregada.', 'When allowed, Google Analytics helps measure visited pages and interactions in aggregate.'],
  ['Publicidade', 'Advertising'], ['Quando autorizados, Google Ads e Google AdSense podem medir campanhas e oferecer publicidade. Esses serviços podem tratar identificadores e dados técnicos conforme suas próprias políticas.', 'When allowed, Google Ads and Google AdSense may measure campaigns and serve advertising. These services may process identifiers and technical data under their own policies.'],
  ['Conteúdo externo', 'Third-party content'], ['Os players incorporados do Spotify são carregados automaticamente quando se aproximam da área visível da página. O Spotify pode tratar dados técnicos conforme sua própria política. Links para Amazon, UICLAP e plataformas musicais também abrem serviços de terceiros.', 'Embedded Spotify players load automatically as they approach the visible area of the page. Spotify may process technical data under its own policy. Links to Amazon, UICLAP, and music platforms also open third-party services.'],
  ['Como mudar sua escolha', 'How to change your choice'], ['Use o botão abaixo ou o link “Cookies” no rodapé. A nova preferência passa a valer imediatamente; para interromper recursos já carregados, recarregue a página.', 'Use the button below or the “Cookies” link in the footer. Your new preference takes effect immediately; reload the page to stop features that have already loaded.'],
  ['Gerenciar cookies', 'Manage cookies'], ['Contato', 'Contact'], ['Dúvidas sobre privacidade podem ser encaminhadas pelos canais oficiais do autor disponíveis nas páginas da Amazon e da UICLAP.', 'Privacy questions can be sent through the author’s official channels available on Amazon and UICLAP.'],
];

const makeHome = () => {
  let html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  html = replaceMany(html, homeTranslations);
  html = html
    .replace('href="a-terra-dos-monstros/previa/"', 'href="../a-terra-dos-monstros/previa/"')
    .replace('href="elemental/previa/"', 'href="../elemental/previa/"')
    .replace('href="veter/previa/"', 'href="../veter/previa/"')
    .replaceAll('href="trilhas/"', 'href="soundtracks/"')
    .replaceAll('href="autor/"', 'href="author/"')
    .replaceAll('href="privacidade/"', 'href="privacy/"')
    .replaceAll('href="assets/', 'href="../assets/')
    .replaceAll('src="assets/', 'src="../assets/')
    .replaceAll('url("assets/', 'url("../assets/')
    .replaceAll('data-bg-image="assets/', 'data-bg-image="../assets/');
  html = html.replace(
    /(<div class="hero-actions reveal">[\s\S]*?<\/div>)/,
    '$1\n            <p class="language-notice reveal">Books and eBooks are currently available in Portuguese.</p>'
  );
  html = html
    .replace('<link rel="canonical" href="https://willianquirino.com.br/">', '<link rel="canonical" href="https://willianquirino.com.br/en/">')
    .replace('<meta property="og:url" content="https://willianquirino.com.br/">', '<meta property="og:url" content="https://willianquirino.com.br/en/">')
    .replace('"url": "https://willianquirino.com.br/",', '"url": "https://willianquirino.com.br/en/",')
    .replace('"url": "https://willianquirino.com.br/autor/",', '"url": "https://willianquirino.com.br/en/author/",');
  html = setSwitcher(html, "../", "./");
  return html;
};

const makeInternal = ({ sourcePath, slug, englishSlug = slug, translations }) => {
  const ptCanonical = `${domain}/${slug}/`;
  const enCanonical = `${domain}/en/${englishSlug}/`;
  let html = fs.readFileSync(path.join(root, sourcePath, "index.html"), "utf8");
  html = replaceMany(html, translations);
  html = setCanonical(html, ptCanonical, enCanonical)
    .replaceAll('../assets/', '../../assets/')
    .replaceAll('href="../trilhas/"', 'href="../soundtracks/"')
    .replaceAll('href="../autor/"', 'href="../author/"')
    .replaceAll('href="../privacidade/"', 'href="../privacy/"')
    .replaceAll('href="../#livros"', 'href="../#comecar"')
    .replaceAll('"url":"https://willianquirino.com.br/autor/"', '"url":"https://willianquirino.com.br/en/author/"')
    .replaceAll('"item":"https://willianquirino.com.br/"', '"item":"https://willianquirino.com.br/en/"');
  html = setSwitcher(html, `../../${slug}/`, "./");
  return html;
};

const outputPages = [
  { path: "en", html: makeHome() },
  ...Object.entries(bookTranslations).map(([slug, translations]) => {
    let html = makeInternal({ sourcePath: slug, slug, translations });
    html = html.replaceAll('href="previa/"', `href="../../${slug}/previa/"`);
    html = html.replace(
      /(<li>Portuguese<\/li>\s*<\/ul>)/,
      '$1\n          <p class="language-availability">Currently available in Portuguese.</p>'
    );
    return { path: `en/${slug}`, html };
  }),
  { path: "en/author", html: makeInternal({ sourcePath: "autor", slug: "autor", englishSlug: "author", translations: authorTranslations }) },
  { path: "en/soundtracks", html: makeInternal({ sourcePath: "trilhas", slug: "trilhas", englishSlug: "soundtracks", translations: soundtrackTranslations }) },
  { path: "en/privacy", html: makeInternal({ sourcePath: "privacidade", slug: "privacidade", englishSlug: "privacy", translations: privacyTranslations }) },
];

for (const page of outputPages) {
  const directory = path.join(root, ...page.path.split("/"));
  fs.mkdirSync(directory, { recursive: true });
  const cleanHtml = page.html
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n*$/, "\n");
  fs.writeFileSync(path.join(directory, "index.html"), cleanHtml, "utf8");
}

console.log(`English pages generated: ${outputPages.length}.`);
