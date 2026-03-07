
-- Delete all existing tips and reinsert with correct title/content matching
DELETE FROM public.weekly_tips;

-- Week 1
INSERT INTO public.weekly_tips (week_number, day_of_week, title, content, display_order, active) VALUES
(1, 1, 'Início da jornada', 'A gestação é contada a partir do primeiro dia da sua última menstruação. Mesmo que a fecundação ainda não tenha ocorrido, seu corpo já está se preparando para esse momento mágico. Aproveite para iniciar hábitos saudáveis desde já! 🌱', 1, true),
(1, 2, 'Ácido fólico', 'O ácido fólico é essencial nas primeiras semanas para a formação do tubo neural do bebê. Comece a tomar 400mcg por dia, conforme orientação médica. Ele pode ser encontrado também em folhas verde-escuras, feijão e lentilha. 💊', 2, true),
(1, 3, 'Alimentação equilibrada', 'Inclua frutas, verduras, proteínas magras e grãos integrais em todas as refeições. Uma alimentação variada garante os nutrientes que seu corpo e o bebê precisam desde o início. Evite ultraprocessados e excesso de açúcar. 🥗', 3, true),
(1, 4, 'Hidratação', 'Beba pelo menos 2 litros de água por dia. A hidratação adequada ajuda na formação do líquido amniótico, melhora a circulação e previne infecções urinárias, muito comuns na gestação. Tenha sempre uma garrafinha por perto! 💧', 4, true),
(1, 5, 'Evite álcool', 'Não existe quantidade segura de álcool durante a gestação. Mesmo pequenas doses podem afetar o desenvolvimento do bebê. Troque por sucos naturais, águas saborizadas ou chás permitidos. Seu bebê agradece! 🚫', 5, true),
(1, 6, 'Sono reparador', 'Priorize dormir de 7 a 9 horas por noite. O sono de qualidade equilibra seus hormônios e fortalece o sistema imunológico. Crie uma rotina relaxante antes de dormir: diminua as luzes e evite telas. 😴', 6, true),
(1, 7, 'Exercícios leves', 'Caminhadas de 20 a 30 minutos são excelentes para manter o corpo ativo. O exercício regular melhora o humor, reduz inchaço e prepara o corpo para as mudanças que virão. Consulte seu médico antes de iniciar. 🚶‍♀️', 7, true),

-- Week 2
(2, 1, 'Ovulação e fertilidade', 'Seu corpo está se preparando para a ovulação. É o momento em que o óvulo é liberado e pode ser fecundado. Observe os sinais do seu corpo: muco cervical transparente e elástico é um indicador natural. 🌸', 1, true),
(2, 2, 'Consulta pré-natal', 'Agende sua primeira consulta pré-natal assim que confirmar a gravidez. O acompanhamento médico desde o início é fundamental para uma gestação saudável e segura para você e seu bebê. 👩‍⚕️', 2, true),
(2, 3, 'Reduza a cafeína', 'Limite o consumo de cafeína a no máximo 200mg por dia (cerca de 1 xícara de café). O excesso pode afetar a absorção de nutrientes importantes e causar desidratação. Prefira chás naturais sem cafeína. ☕', 3, true),
(2, 4, 'Evite substâncias tóxicas', 'Fique longe de tintas, pesticidas e produtos químicos fortes. Essas substâncias podem ser prejudiciais ao desenvolvimento do embrião. Use produtos naturais de limpeza e mantenha ambientes ventilados. 🧤', 4, true),
(2, 5, 'Sinais do corpo', 'Comece a prestar atenção nos sinais do seu corpo: sensibilidade nos seios, leve cansaço e mudanças de humor podem ser os primeiros indícios. Anote tudo para compartilhar com seu médico. 📝', 5, true),
(2, 6, 'Ferro na alimentação', 'O ferro é crucial durante a gestação pois o volume de sangue aumenta significativamente. Inclua carnes vermelhas magras, feijão, lentilha e folhas escuras na alimentação diária. 🥩', 6, true),
(2, 7, 'Planeje refeições', 'Aproveite o fim de semana para planejar refeições saudáveis para a semana. Cozinhar em casa garante mais controle sobre os ingredientes e nutrientes que você e seu bebê recebem. 🍳', 7, true),

-- Week 3
(3, 1, 'Fecundação', 'A fecundação pode estar acontecendo agora! O óvulo e o espermatozoide se encontram na trompa de Falópio. Em breve, o embrião começará sua jornada até o útero para se implantar. Um momento mágico! ✨', 1, true),
(3, 2, 'Continue o ácido fólico', 'Continue tomando ácido fólico diariamente — ele é especialmente crítico nestas primeiras semanas para a formação do sistema nervoso do bebê. Não pule nenhum dia, mesmo que ainda não tenha confirmado a gravidez. 💚', 2, true),
(3, 3, 'Limite a cafeína', 'A cafeína em excesso pode interferir na implantação do embrião. Lembre-se que ela está presente no café, chá preto, refrigerantes e chocolate. Modere o consumo e prefira alternativas sem cafeína. 🍵', 3, true),
(3, 4, 'Exercícios regulares', 'Mantenha uma rotina de exercícios leves e regulares. Yoga, pilates e caminhadas são ótimas opções. A atividade física melhora a circulação e ajuda a preparar o corpo para a gestação. 🧘‍♀️', 4, true),
(3, 5, 'Qualidade do sono', 'A qualidade do sono influencia diretamente o equilíbrio hormonal necessário para a implantação do embrião. Tente dormir e acordar nos mesmos horários todos os dias. 🌙', 5, true),
(3, 6, 'Converse com seu parceiro', 'Converse com seu parceiro(a) sobre expectativas, medos e sonhos para essa fase. Construir uma comunicação aberta desde o início fortalece o vínculo e prepara vocês para a parentalidade. 💑', 6, true),
(3, 7, 'Evite automedicação', 'Evite automedicação durante toda a gestação. Mesmo medicamentos simples como analgésicos podem ser prejudiciais. Sempre consulte seu médico antes de tomar qualquer remédio. 💊', 7, true),

-- Week 4
(4, 1, 'Implantação do embrião', 'O embrião está se implantando no útero nesta semana! Você pode notar um leve sangramento rosado ou marrom, chamado sangramento de implantação. É normal e não deve preocupar. 🌟', 1, true),
(4, 2, 'Primeiros sintomas', 'Os primeiros sintomas de gravidez podem começar a aparecer: sensibilidade nos seios, cansaço extremo e leves náuseas. Cada mulher sente de forma diferente — respeite o seu ritmo. 🤰', 2, true),
(4, 3, 'Teste de gravidez', 'O teste de gravidez pode dar positivo a partir desta semana! O hormônio hCG começa a ser produzido após a implantação. Se der negativo, aguarde mais alguns dias e repita. 🎉', 3, true),
(4, 4, 'Planejamento financeiro', 'Comece a organizar suas finanças para a chegada do bebê, planejando os novos gastos e criando uma pequena reserva. Isso traz mais segurança e tranquilidade para esse novo momento. 👶', 4, true),
(4, 5, 'Progesterona em alta', 'A progesterona está em alta e pode causar sonolência e lentidão intestinal. Inclua fibras na dieta (aveia, frutas com casca, legumes) e beba bastante água para ajudar o intestino. 🥣', 5, true),
(4, 6, 'Evite calor excessivo', 'Evite banhos muito quentes e saunas durante a gestação. Temperaturas elevadas podem ser prejudiciais ao embrião em formação. Prefira banhos mornos e confortáveis. 🚿', 6, true),
(4, 7, 'Celebre a descoberta', 'Reserve um momento para celebrar essa descoberta! Escreva uma carta para seu bebê, tire uma foto especial ou simplesmente sente-se em paz com essa notícia maravilhosa. 💝', 7, true),

-- Week 5
(5, 1, 'Coração se formando', 'O coração do seu bebê começa a se formar nesta semana e em breve começará a bater! É um tubo cardíaco primitivo que pulsa e bombeia sangue. A vida já pulsa dentro de você! 💓', 1, true),
(5, 2, 'Enjoos matinais', 'Se os enjoos matinais chegaram, coma pequenas porções ao longo do dia e evite ficar de estômago vazio. Biscoitos de água e sal ao acordar e gengibre podem ajudar a aliviar as náuseas. 🤢', 2, true),
(5, 3, 'Vitaminas pré-natais', 'Além do ácido fólico, seu médico pode recomendar um complexo vitamínico pré-natal com ferro, cálcio, vitamina D e ômega 3. Esses nutrientes são essenciais para o desenvolvimento do bebê. 💊', 3, true),
(5, 4, 'Descanse mais', 'O cansaço intenso é normal no primeiro trimestre. Seu corpo está trabalhando dobrado para formar a placenta e sustentar o bebê. Permita-se descansar sempre que possível. 😊', 4, true),
(5, 5, 'Evite alimentos crus', 'Evite carne crua, sushi com peixe cru, ovos mal cozidos e leite não pasteurizado. Esses alimentos podem conter bactérias prejudiciais como salmonela e listeria. Cozinhe bem tudo! 🍳', 5, true),
(5, 6, 'Emoções intensas', 'É normal sentir emoções intensas e oscilantes. A montanha-russa hormonal está a todo vapor! Permita-se sentir sem culpa e compartilhe com alguém de confiança como você está. 🎭', 6, true),
(5, 7, 'Registre a jornada', 'Comece um diário da gestação! Anotar sentimentos, sintomas e momentos especiais cria memórias preciosas. No futuro, você vai adorar reler e compartilhar com seu filho(a). 📖', 7, true),

-- Week 6
(6, 1, 'Batimentos cardíacos', 'O coração do bebê já está batendo! Com cerca de 110 batimentos por minuto, esse som maravilhoso pode ser ouvido no próximo ultrassom. É um dos momentos mais emocionantes! 💗', 1, true),
(6, 2, 'Aversões alimentares', 'Aversões a cheiros e sabores são muito comuns nesta fase. Não se force a comer algo que causa náusea. Encontre alternativas nutritivas que sejam agradáveis para você. 🤧', 2, true),
(6, 3, 'Primeira ultrassonografia', 'Se ainda não fez, agende sua primeira ultrassonografia. Ela confirma a localização da gestação, verifica os batimentos cardíacos e calcula a idade gestacional com precisão. 📷', 3, true),
(6, 4, 'Cuidado com toxoplasmose', 'Cuidado com a toxoplasmose! Evite manipular areia de gato, comer carne crua ou mal passada, e lave muito bem frutas e verduras. A prevenção é simples e essencial. 🐱', 4, true),
(6, 5, 'Seios sensíveis', 'Seus seios podem estar maiores e muito sensíveis. Use sutiãs confortáveis de algodão, sem aros. Essa sensibilidade é causada pelos hormônios e tende a diminuir no segundo trimestre. 👙', 5, true),
(6, 6, 'Conexão com o bebê', 'Mesmo tão pequenino, seu bebê já está conectado a você! Converse com ele, coloque as mãos na barriga e envie pensamentos positivos. O vínculo começa a se formar agora. 🥰', 6, true),
(6, 7, 'Descanso dominical', 'Reserve o domingo para relaxar e recarregar as energias. Ouça músicas tranquilas, leia um livro, tome um banho morno com aromaterapia segura. Seu corpo e mente merecem esse cuidado. 🛁', 7, true),

-- Week 7
(7, 1, 'Formação do rosto', 'O rosto do bebê está começando a se formar! Olhos, narinas e boca estão surgindo. Ele tem o tamanho de um grão de feijão, mas já tem uma complexidade incrível. 👶', 1, true),
(7, 2, 'Refeições pequenas', 'Coma de 5 a 6 refeições pequenas ao longo do dia ao invés de 3 grandes. Isso ajuda a controlar as náuseas, mantém a energia estável e evita a queda de açúcar no sangue. 🍽️', 2, true),
(7, 3, 'Cuidado bucal', 'Agende uma consulta com o dentista. A gestação pode causar gengivite gravídica devido às alterações hormonais. Manter a saúde bucal é importante para você e para o bebê. 🦷', 3, true),
(7, 4, 'Intestino preso', 'O intestino lento é comum na gestação por causa da progesterona. Aumente o consumo de fibras (mamão, ameixa, aveia), beba muita água e caminhe diariamente para ajudar. 🥣', 4, true),
(7, 5, 'Emoções no trabalho', 'Se você trabalha, respeite seus limites. Faça pausas regulares, mantenha lanches saudáveis por perto e não hesite em sentar quando precisar. Sua saúde vem primeiro. 💼', 5, true),
(7, 6, 'Cálcio essencial', 'O cálcio é fundamental para a formação dos ossos e dentes do bebê. Inclua leite, iogurte, queijos, brócolis e sardinha na sua alimentação. Se necessário, converse com seu médico sobre suplementação. 🥛', 6, true),
(7, 7, 'Momento de gratidão', 'Pratique gratidão por essa nova vida que cresce em você. Escreva 3 coisas pelas quais você é grata hoje. Esse exercício simples melhora o humor e reduz a ansiedade. 🙏', 7, true),

-- Week 8
(8, 1, 'Dedos se formando', 'Os dedinhos das mãos e dos pés do bebê estão começando a se separar! Ele já se move, embora você ainda não sinta. O desenvolvimento é rápido e fascinante nesta fase. 🖐️', 1, true),
(8, 2, 'Exames de sangue', 'Seu médico provavelmente pedirá exames de sangue importantes: hemograma, glicemia, tipagem sanguínea, sorologias e outros. Faça-os o quanto antes para garantir uma gestação segura. 🩸', 2, true),
(8, 3, 'Ômega 3', 'O ômega 3 é essencial para o desenvolvimento cerebral do bebê. Inclua peixes como salmão e sardinha (bem cozidos), nozes, linhaça e chia na sua alimentação semanal. 🐟', 3, true),
(8, 4, 'Pele mais bonita', 'Algumas gestantes notam a pele mais bonita e brilhante nesta fase. Outras podem ter acne. Use produtos suaves e evite retinol e ácido salicílico. Protetor solar é indispensável! ☀️', 4, true),
(8, 5, 'Roupas confortáveis', 'Suas roupas podem começar a ficar apertadas na cintura. Invista em calças com elástico e peças confortáveis. Não precisa comprar tudo de uma vez — vá adaptando conforme o corpo muda. 👗', 5, true),
(8, 6, 'Meditação', 'Pratique 10 minutos de meditação ou respiração profunda diariamente. Inspire por 4 segundos, segure por 4 e expire por 6. Isso reduz o estresse e beneficia o bebê diretamente. 🧘', 6, true),
(8, 7, 'Compartilhe com quem ama', 'Se ainda não contou para todos, escolha o momento certo para compartilhar a notícia com familiares e amigos próximos. O apoio emocional é fundamental nesta fase. 💕', 7, true),

-- Week 9
(9, 1, 'Fase embrionária final', 'Seu bebê está na transição de embrião para feto! Todos os órgãos principais já estão formados e começam a se desenvolver e amadurecer. Ele tem cerca de 2,5cm. 🌱', 1, true),
(9, 2, 'Vitamina D', 'A vitamina D é essencial para a absorção de cálcio e formação óssea do bebê. Tome sol por 15 minutos pela manhã (antes das 10h) e converse com seu médico sobre suplementação. ☀️', 2, true),
(9, 3, 'Variações de humor', 'Os hormônios podem causar mudanças de humor intensas. Choro fácil, irritabilidade e euforia são normais. Seja gentil consigo mesma e peça ajuda quando precisar. 💗', 3, true),
(9, 4, 'Proteína na dieta', 'A proteína é fundamental para o crescimento do bebê. Inclua carnes magras, ovos, feijão, lentilha e tofu em pelo menos duas refeições diárias. Varie as fontes! 🥚', 4, true),
(9, 5, 'Evite saltos altos', 'Troque sapatos de salto alto por calçados confortáveis e com solado antiderrapante. O centro de gravidade do corpo muda com a gestação e o risco de quedas aumenta. 👟', 5, true),
(9, 6, 'Leitura sobre gestação', 'Leia sobre gestação e maternidade em fontes confiáveis. O conhecimento traz segurança e ajuda a tomar decisões informadas. Mas evite se perder em relatos assustadores na internet. 📚', 6, true),
(9, 7, 'Relaxe e confie', 'A ansiedade do primeiro trimestre é natural. Confie no seu corpo e na sua capacidade de gerar vida. Respire fundo, relaxe e lembre-se: milhões de mulheres passam por isso com sucesso. 🌈', 7, true),

-- Week 10
(10, 1, 'Agora é feto', 'Oficialmente, seu bebê agora é chamado de feto! Ele já tem todos os órgãos formados e está crescendo rapidamente. Mede cerca de 3cm e pesa poucos gramas. 🎊', 1, true),
(10, 2, 'Exame de translucência nucal', 'Entre as semanas 11 e 14, você fará o exame de translucência nucal. Ele avalia o risco de alterações cromossômicas. É um ultrassom simples e indolor. Agende com antecedência! 🏥', 2, true),
(10, 3, 'Fibras e água', 'Continue priorizando fibras e água para manter o intestino funcionando. Mamão, ameixa seca, aveia e sementes de linhaça são seus aliados contra a constipação. 🥝', 3, true),
(10, 4, 'Cuidado com corantes', 'Evite tinturas de cabelo com amônia e alisamentos químicos. Se quiser colorir os fios, use hennas naturais ou produtos sem amônia, preferencialmente após o primeiro trimestre. 💇‍♀️', 4, true),
(10, 5, 'Alongamentos', 'Faça alongamentos leves pela manhã e antes de dormir. Eles aliviam tensões musculares, melhoram a postura e ajudam a prevenir dores nas costas que podem surgir. 🤸‍♀️', 5, true),
(10, 6, 'Rede de apoio', 'Construa sua rede de apoio! Identifique pessoas que podem ajudar após o nascimento: familiares, amigos, profissionais. Aceitar ajuda não é fraqueza, é sabedoria. 🤝', 6, true),
(10, 7, 'Registre a barriguinha', 'Tire uma foto da barriguinha toda semana! Mesmo que ainda não apareça muito, essas fotos se tornarão recordações preciosas da sua jornada de gestação. 📸', 7, true),

-- Week 11
(11, 1, 'Reflexos surgindo', 'O bebê já está desenvolvendo reflexos! Ele se move bastante dentro do útero, embora você ainda não sinta. Os dedinhos já se abrem e fecham. Incrível, não? 🤏', 1, true),
(11, 2, 'Azia e refluxo', 'Azia e refluxo podem começar a incomodar. Coma devagar, evite deitar logo após as refeições e eleve a cabeceira da cama. Evite alimentos muito condimentados ou ácidos. 🔥', 2, true),
(11, 3, 'Zinco para imunidade', 'O zinco fortalece o sistema imunológico e é importante para o crescimento celular do bebê. Encontre-o em carnes, castanhas, grão-de-bico e sementes de abóbora. 🌰', 3, true),
(11, 4, 'Postura no trabalho', 'Se trabalha sentada, cuide da postura: mantenha os pés apoiados no chão, costas retas e levante-se a cada hora para caminhar um pouco. Use uma almofada lombar se necessário. 💺', 4, true),
(11, 5, 'Conexão emocional', 'Converse com seu bebê todos os dias. Mesmo tão pequeno, ele já está desenvolvendo o sistema auditivo. Sua voz será a primeira que ele reconhecerá ao nascer. 🗣️', 5, true),
(11, 6, 'Chás permitidos', 'Alguns chás são seguros na gestação: camomila (moderação), erva-doce e hortelã. Evite boldo, canela em pau, alecrim e erva-cidreira em excesso. Na dúvida, pergunte ao médico. 🍵', 6, true),
(11, 7, 'Planeje o enxoval', 'Comece a pesquisar itens do enxoval! Não precisa comprar tudo agora, mas ter uma lista ajuda a organizar e distribuir os gastos ao longo dos meses. 🛍️', 7, true),

-- Week 12
(12, 1, 'Final do primeiro trimestre', 'Parabéns! Você está chegando ao final do primeiro trimestre! O risco de aborto diminui significativamente a partir de agora. O bebê mede cerca de 6cm e já tem unhas! 🎉', 1, true),
(12, 2, 'Enjoos diminuindo', 'Para muitas mulheres, os enjoos começam a diminuir nesta fase. Se ainda persistem, não se preocupe — cada gestação tem seu ritmo. Continue comendo em pequenas porções. 😌', 2, true),
(12, 3, 'Exames do primeiro trimestre', 'Certifique-se de ter feito todos os exames do primeiro trimestre: ultrassom com translucência nucal, exames de sangue e urina. Organize os resultados para a próxima consulta. 📋', 3, true),
(12, 4, 'Hidrate a pele', 'A pele da barriga começa a esticar. Use cremes hidratantes ou óleos (como óleo de amêndoas) diariamente para prevenir estrias. Massageie suavemente em movimentos circulares. 🧴', 4, true),
(12, 5, 'Energia voltando', 'Muitas gestantes sentem a energia voltar nesta fase. Aproveite para retomar atividades que gosta, organizar o quartinho ou fazer passeios ao ar livre. 🌞', 5, true),
(12, 6, 'Conte a novidade', 'Se estava esperando para contar, este é um bom momento! O risco de complicações diminuiu e você pode compartilhar a alegria com mais tranquilidade. 📣', 6, true),
(12, 7, 'Momento de reflexão', 'Reserve um momento para refletir sobre o primeiro trimestre. Você foi incrivelmente forte! Anote o que aprendeu, sentiu e deseja para os próximos meses. 📝', 7, true),

-- Week 13
(13, 1, 'Segundo trimestre começou', 'Bem-vinda ao segundo trimestre! É considerado o período mais confortável da gestação. Os enjoos tendem a diminuir e a barriguinha começa a aparecer. Aproveite! 🌸', 1, true),
(13, 2, 'Impressões digitais', 'As impressões digitais únicas do seu bebê estão se formando nesta semana! Ele já tem um padrão exclusivo nos dedinhos que o acompanhará por toda a vida. 🤲', 2, true),
(13, 3, 'Aumente a ingestão de cálcio', 'O segundo trimestre é crucial para a formação óssea. Aumente a ingestão de cálcio com leite, iogurte, queijo, brócolis e sardinha. Se necessário, suplemente. 🦴', 3, true),
(13, 4, 'Exercícios aquáticos', 'A hidroginástica e a natação são excelentes exercícios na gestação! A água sustenta o peso e reduz o impacto nas articulações. Consulte seu médico e procure turmas especiais para gestantes. 🏊‍♀️', 4, true),
(13, 5, 'Pele e sol', 'Use protetor solar diariamente no rosto e nas áreas expostas. A gestação aumenta a produção de melanina e o melasma (manchas escuras) pode surgir com a exposição solar. ☀️', 5, true),
(13, 6, 'Intimidade na gestação', 'A vida sexual pode continuar normalmente na gestação, salvo restrições médicas. Converse com seu parceiro sobre conforto e novas posições. A intimidade fortalece o relacionamento. 💏', 6, true),
(13, 7, 'Playlist para o bebê', 'Crie uma playlist especial para seu bebê! Músicas calmas e melodias suaves estimulam o desenvolvimento auditivo e criam um ambiente de paz para vocês dois. 🎵', 7, true),

-- Week 14
(14, 1, 'Cabelos e lanugo', 'O bebê está coberto por uma penugem fina chamada lanugo, que ajuda a regular a temperatura corporal. Seus cabelinhos também começam a crescer nesta semana! 👶', 1, true),
(14, 2, 'Apetite aumentando', 'Seu apetite pode estar voltando com força! É normal precisar de mais calorias agora. Aumente cerca de 300 kcal por dia com alimentos nutritivos, não com junk food. 🥑', 2, true),
(14, 3, 'Ferro reforçado', 'A demanda de ferro aumenta no segundo trimestre. Combine alimentos ricos em ferro com vitamina C (suco de laranja) para melhorar a absorção. Evite tomar ferro com leite ou café. 🍊', 3, true),
(14, 4, 'Exercícios de Kegel', 'Comece a fazer exercícios de Kegel para fortalecer o assoalho pélvico! Contraia os músculos como se estivesse segurando o xixi por 5 segundos e relaxe. Repita 10 vezes, 3 séries ao dia. 💪', 4, true),
(14, 5, 'Viagens permitidas', 'O segundo trimestre é o melhor período para viajar! Converse com seu médico, leve seus exames, use cinto de segurança abaixo da barriga e levante-se a cada 2 horas em viagens longas. ✈️', 5, true),
(14, 6, 'Prevenção de varizes', 'Use meias de compressão se ficar muito tempo em pé ou sentada. Eleve as pernas quando possível e evite cruzá-las. Isso ajuda a prevenir varizes e reduzir inchaço. 🦵', 6, true),
(14, 7, 'Carta ao bebê', 'Escreva uma carta ao seu bebê contando como descobriu a gravidez e o que sente. No futuro, será um presente emocional incrível para vocês dois. 💌', 7, true),

-- Week 15
(15, 1, 'Audição se desenvolve', 'O sistema auditivo do bebê está se desenvolvendo! Em breve ele começará a ouvir sons internos como seu coração batendo e seu estômago funcionando. 👂', 1, true),
(15, 2, 'Peso na gestação', 'O ganho de peso saudável na gestação é de 9 a 14kg no total (varia por pessoa). Não faça dietas restritivas! Foque em qualidade nutricional e converse com seu médico sobre suas metas. ⚖️', 2, true),
(15, 3, 'Magnésio para câimbras', 'Câimbras nas pernas podem aparecer, especialmente à noite. O magnésio ajuda! Coma banana, abacate, castanhas e chocolate amargo. Alongue as panturrilhas antes de dormir. 🍌', 3, true),
(15, 4, 'Posição para dormir', 'Comece a se acostumar a dormir de lado, preferencialmente do lado esquerdo. Isso melhora a circulação e o fluxo de nutrientes para o bebê. Use almofadas para apoio. 🛏️', 4, true),
(15, 5, 'Dor no ligamento redondo', 'Dores agudas e rápidas na lateral da barriga (dor do ligamento redondo) são comuns quando você muda de posição. São normais! Mova-se devagar e apoie a barriga ao se levantar. ⚡', 5, true),
(15, 6, 'Alimentos a evitar', 'Lembre-se de evitar: peixes com alto teor de mercúrio (cação, peixe-espada), queijos não pasteurizados, embutidos e carne de caça. A segurança alimentar protege seu bebê. 🚫', 6, true),
(15, 7, 'Momento a dois', 'Aproveite o segundo trimestre para curtir momentos a dois com seu parceiro(a). Façam um programa especial juntos — cinema, jantar, passeio no parque. Logo a família crescerá! 💑', 7, true),

-- Week 16
(16, 1, 'Expressões faciais', 'Seu bebê já consegue fazer expressões faciais! Ele franze a testa, aperta os lábios e pode até sorrir. Está praticando para quando nascer e ver seu rosto. 😊', 1, true),
(16, 2, 'Primeiros movimentos', 'Algumas mães de segunda viagem já sentem os primeiros movimentos nesta semana — como bolhas ou borboletas na barriga. Para primíparas, pode demorar mais algumas semanas. 🦋', 2, true),
(16, 3, 'Vitamina A com cuidado', 'A vitamina A é importante, mas em excesso pode ser prejudicial. Obtenha-a de fontes seguras como cenoura, batata-doce e espinafre. Evite suplementos sem orientação médica. 🥕', 3, true),
(16, 4, 'Congestão nasal', 'A congestão nasal na gestação é causada pelo aumento do fluxo sanguíneo. Use soro fisiológico para lavar o nariz e um umidificador no quarto. Evite descongestionantes sem prescrição. 🤧', 4, true),
(16, 5, 'Pilates para gestantes', 'O pilates adaptado para gestantes fortalece os músculos abdominais, melhora a postura e prepara o corpo para o parto. Procure um instrutor especializado em gestantes. 🏋️‍♀️', 5, true),
(16, 6, 'Ansiedade sobre o sexo', 'Curiosa sobre o sexo do bebê? Se optou por saber, o ultrassom morfológico entre as semanas 18-22 pode revelar! Se preferiu surpresa, aproveite o mistério. 💙💖', 6, true),
(16, 7, 'Autocompaixão', 'Pratique autocompaixão. Seu corpo está realizando algo extraordinário! Não se compare com outras gestantes. Cada jornada é única e todas são igualmente válidas. 🌺', 7, true),

-- Week 17
(17, 1, 'Gordura corporal do bebê', 'O bebê começa a acumular gordura sob a pele, essencial para regular a temperatura após o nascimento. Ele mede cerca de 13cm e está crescendo rapidamente! 📏', 1, true),
(17, 2, 'Dor nas costas', 'Dores nas costas podem surgir com o crescimento da barriga. Mantenha boa postura, use sapatos baixos e evite carregar peso. Bolsa de água quente e massagens ajudam a aliviar. 🤕', 2, true),
(17, 3, 'Iodo na dieta', 'O iodo é essencial para o desenvolvimento do cérebro do bebê. Encontre-o no sal iodado, peixes, algas marinhas e laticínios. Verifique se sua vitamina pré-natal contém iodo. 🧂', 3, true),
(17, 4, 'Ginástica laboral', 'Se trabalha sentada, faça pausas a cada hora para alongar pescoço, ombros e costas. Gire os tornozelos e estique as pernas para melhorar a circulação. Seu corpo agradece! 🔄', 4, true),
(17, 5, 'Sonhos vívidos', 'Sonhos muito reais e vívidos são comuns na gestação! São causados pelas alterações hormonais e pelo sono mais leve. Não se assuste — é apenas seu cérebro processando emoções. 💭', 5, true),
(17, 6, 'Cordão umbilical', 'O cordão umbilical está forte e funcional, levando oxigênio e nutrientes para o bebê e trazendo de volta os resíduos. É a linha da vida que conecta vocês de forma única. 🔗', 6, true),
(17, 7, 'Lista de nomes', 'Está pensando em nomes? Comece uma lista com seu parceiro(a)! Pesquisem significados, testem sobrenomes e divirtam-se com essa tarefa especial. Não precisa decidir agora. ✍️', 7, true),

-- Week 18
(18, 1, 'Bebê ouve você', 'O sistema auditivo do bebê está maduro o suficiente para começar a ouvir sons! Sua voz, música e até o barulho do seu coração fazem parte do mundo dele agora. 🎧', 1, true),
(18, 2, 'Exame morfológico', 'O ultrassom morfológico deve ser agendado para as próximas semanas (18-22). Ele avalia toda a anatomia do bebê em detalhes e pode revelar o sexo. Momento especial! 📸', 2, true),
(18, 3, 'Carboidratos complexos', 'Prefira carboidratos complexos: arroz integral, pão integral, batata-doce e aveia. Eles liberam energia gradualmente e ajudam a manter a glicemia estável ao longo do dia. 🍠', 3, true),
(18, 4, 'Inchaço nos pés', 'Inchaço nos pés e tornozelos pode aparecer. Eleve as pernas quando possível, use sapatos confortáveis e evite ficar muito tempo na mesma posição. Beba bastante água! 🦶', 4, true),
(18, 5, 'Yoga pré-natal', 'A yoga pré-natal é maravilhosa para relaxar, fortalecer e preparar o corpo para o parto. Respirações conscientes e posições adaptadas trazem equilíbrio físico e mental. 🧘‍♀️', 5, true),
(18, 6, 'Escolha do pediatra', 'Comece a pesquisar pediatras! Ter um profissional escolhido antes do nascimento traz segurança. Peça indicações, visite consultórios e escolha alguém que tenha sua confiança. 👨‍⚕️', 6, true),
(18, 7, 'Gratidão pela jornada', 'Você já percorreu quase metade da gestação! Celebre cada conquista, cada desconforto superado e cada momento de conexão com seu bebê. Você é incrível! 🌟', 7, true),

-- Week 19
(19, 1, 'Vérnix protetor', 'O bebê está coberto por uma substância branca e gordurosa chamada vérnix caseosa, que protege sua pele delicada do líquido amniótico. A natureza pensa em tudo! 🛡️', 1, true),
(19, 2, 'Movimentos mais claros', 'Os movimentos do bebê ficam mais perceptíveis! Você pode sentir chutes, viradas e até soluços. Preste atenção nesses sinais maravilhosos de vida. 🦶', 2, true),
(19, 3, 'Colina para o cérebro', 'A colina é importante para o desenvolvimento cerebral do bebê. Encontre-a em ovos (especialmente a gema), fígado, soja e brócolis. Inclua na alimentação diária! 🧠', 3, true),
(19, 4, 'Cuidado com quedas', 'Seu centro de gravidade está mudando com o crescimento da barriga. Use sapatos antiderrapantes, segure-se em corrimões e evite superfícies escorregadias. Cuidado redobrado! ⚠️', 4, true),
(19, 5, 'Banho de sol seguro', 'Tome sol de manhã cedo (antes das 10h) por 15-20 minutos para sintetizar vitamina D. Proteja o rosto com protetor solar e evite os horários de sol intenso. 🌅', 5, true),
(19, 6, 'Decoração do quartinho', 'Se já sabe o sexo, pode começar a planejar a decoração do quartinho! Pesquise temas, cores e móveis essenciais. É uma atividade prazerosa e que aproxima a família. 🎨', 6, true),
(19, 7, 'Meditação guiada', 'Experimente meditações guiadas para gestantes em aplicativos ou YouTube. 10 minutos por dia podem transformar sua experiência de gestação, trazendo calma e conexão. 🧘', 7, true),

-- Week 20
(20, 1, 'Metade da gestação', 'Parabéns! Você chegou à metade da gestação! O bebê mede cerca de 25cm e pesa 300g. Ele já se move bastante e pode até reagir a estímulos externos. 🎊', 1, true),
(20, 2, 'Morfológico detalhado', 'Se ainda não fez, o ultrassom morfológico é prioridade! Ele verifica coração, cérebro, rins, membros e toda a anatomia do bebê. É um exame completo e fundamental. 🔬', 2, true),
(20, 3, 'Lanches inteligentes', 'Mantenha lanches saudáveis por perto: mix de castanhas, frutas secas, iogurte natural, palitos de cenoura e homus. Evite longos períodos sem comer. 🥜', 3, true),
(20, 4, 'Linha nigra', 'Uma linha escura pode aparecer na barriga (linha nigra). É causada pela hiperpigmentação hormonal e desaparece após o parto. Não tente clareá-la — é completamente normal. 🖍️', 4, true),
(20, 5, 'Fortalecimento pélvico', 'Continue os exercícios de Kegel e inclua exercícios de fortalecimento pélvico. Um assoalho pélvico forte facilita o parto e a recuperação pós-parto. 💪', 5, true),
(20, 6, 'Fotografia gestacional', 'Que tal agendar um ensaio fotográfico gestacional? As fotos mais bonitas costumam ser feitas entre as semanas 28-34, mas comece a pesquisar fotógrafos agora. 📷', 6, true),
(20, 7, 'Celebre a metade', 'Metade do caminho percorrido! Faça algo especial para celebrar: um jantar, um passeio, um presente para você mesma. Você merece reconhecer essa jornada incrível. 🥂', 7, true),

-- Week 21
(21, 1, 'Paladar do bebê', 'O bebê já consegue sentir sabores através do líquido amniótico! O que você come influencia o paladar dele. Varie a alimentação para apresentar diferentes sabores. 👅', 1, true),
(21, 2, 'Contrações de treinamento', 'Você pode começar a sentir as contrações de Braxton Hicks — são contrações leves e irregulares de treino. São normais! Se forem fortes ou regulares, procure o médico. 🏋️', 2, true),
(21, 3, 'Vitamina C diária', 'A vitamina C fortalece a imunidade e ajuda na absorção de ferro. Coma laranja, kiwi, morango, acerola e pimentão diariamente. Uma fruta cítrica após o almoço é ideal! 🍋', 3, true),
(21, 4, 'Cuidado com açúcar', 'O excesso de açúcar pode levar ao diabetes gestacional. Reduza doces, refrigerantes e alimentos ultraprocessados. Prefira açúcar natural das frutas e mel com moderação. 🍬', 4, true),
(21, 5, 'Caminhadas diárias', 'Caminhe 30 minutos por dia. Além de manter o peso saudável, caminhadas melhoram o humor, a digestão e a qualidade do sono. Use roupas leves e calçados confortáveis. 🚶‍♀️', 5, true),
(21, 6, 'Plano de parto', 'Comece a pensar no seu plano de parto! Pesquise sobre tipos de parto, analgesia, posições e seus direitos. Converse com seu médico sobre suas preferências. 📋', 6, true),
(21, 7, 'Música para o bebê', 'Toque músicas suaves para seu bebê! Estudos mostram que bebês que ouvem música na barriga tendem a se acalmar com as mesmas melodias após o nascimento. 🎶', 7, true),

-- Week 22
(22, 1, 'Olhos se formando', 'Os olhos do bebê estão completamente formados, embora a íris ainda não tenha cor definida. Ele já abre e fecha os olhos dentro do útero! 👁️', 1, true),
(22, 2, 'Diabetes gestacional', 'O exame de curva glicêmica deve ser feito entre as semanas 24-28. Cuide da alimentação desde já: evite açúcar refinado e carboidratos simples em excesso. Prevenção é o melhor caminho. 🩸', 2, true),
(22, 3, 'Ácidos graxos', 'Os ácidos graxos essenciais são fundamentais para o desenvolvimento cerebral e visual do bebê. Inclua azeite extra-virgem, abacate, castanhas e peixes na dieta. 🥑', 3, true),
(22, 4, 'Dor ciática', 'A dor ciática pode aparecer com o crescimento do útero. Alongue suavemente, use compressas mornas e evite ficar sentada por longos períodos. Pilates ajuda muito! ⚡', 4, true),
(22, 5, 'Prepare a mala', 'Não é cedo demais para listar o que vai na mala da maternidade! Pesquise checklists e comece a separar itens essenciais para você e para o bebê. 🧳', 5, true),
(22, 6, 'Vínculo prenatal', 'Massageie sua barriga com carinho usando óleo de amêndoas. Converse com o bebê e conte histórias. Esse toque e essa voz criam memórias afetivas poderosas. 🤱', 6, true),
(22, 7, 'Risadas fazem bem', 'Ria muito! O riso libera endorfinas que chegam ao bebê através do sangue. Assista a comédias, esteja com pessoas alegres e permita-se momentos de leveza. 😂', 7, true),

-- Week 23
(23, 1, 'Viabilidade fetal', 'A partir desta semana, o bebê alcança o marco da viabilidade fetal! Com suporte médico intensivo, bebês prematuros desta idade podem sobreviver. Mas vamos mantê-lo seguro dentro! 🏥', 1, true),
(23, 2, 'Respiração do bebê', 'O bebê pratica movimentos respiratórios com o líquido amniótico! Ele inspira e expira, treinando os pulmões para a vida fora do útero. 🫁', 2, true),
(23, 3, 'Potássio essencial', 'O potássio ajuda a controlar a pressão arterial e reduz câimbras. Coma banana, batata, abacate e água de coco regularmente. É gostoso e faz muito bem! 🍌', 3, true),
(23, 4, 'Pré-eclâmpsia', 'Fique atenta a sinais de pré-eclâmpsia: pressão alta, inchaço súbito, dor de cabeça forte e visão turva. Se notar qualquer um desses sintomas, procure o médico imediatamente. ⚠️', 4, true),
(23, 5, 'Dança na gestação', 'Dançar é um exercício maravilhoso na gestação! Movimente-se suavemente ao som de músicas que ama. Além de exercitar o corpo, dançar eleva o humor e conecta com o bebê. 💃', 5, true),
(23, 6, 'Curso de preparação', 'Inscreva-se em um curso de preparação para o parto! Eles ensinam técnicas de respiração, posições e cuidados com o recém-nascido. O conhecimento reduz o medo. 🎓', 6, true),
(23, 7, 'Agradeça seu corpo', 'Olhe-se no espelho e agradeça ao seu corpo por tudo que ele está fazendo. Cada estria, cada mudança é marca de amor e vida sendo criada. Você é linda! 💝', 7, true),

-- Week 24
(24, 1, 'Pulmões amadurecendo', 'Os pulmões do bebê estão produzindo surfactante, uma substância que permitirá respirar fora do útero. O desenvolvimento pulmonar é uma das conquistas mais importantes! 🫁', 1, true),
(24, 2, 'Teste de glicose', 'Está chegando a hora do teste de tolerância à glicose (curva glicêmica). Ele detecta diabetes gestacional. Siga as orientações de preparo do laboratório. 🧪', 2, true),
(24, 3, 'Vitamina K', 'A vitamina K é importante para a coagulação sanguínea. Encontre-a em vegetais verde-escuros como couve, espinafre e brócolis. Inclua pelo menos uma porção por dia. 🥬', 3, true),
(24, 4, 'Olho no peso', 'O ganho de peso acelera no terceiro trimestre. Mantenha uma alimentação equilibrada e exercícios regulares. Não se pese obsessivamente — foque na saúde, não no número. ⚖️', 4, true),
(24, 5, 'Massagem pré-natal', 'Uma massagem pré-natal profissional pode aliviar tensões, melhorar a circulação e proporcionar relaxamento profundo. Procure profissionais especializados em gestantes. 💆‍♀️', 5, true),
(24, 6, 'Amamentação', 'Comece a se informar sobre amamentação! Leia sobre pega correta, posições e possíveis desafios. O conhecimento prévio facilita muito o início da amamentação. 🤱', 6, true),
(24, 7, 'Diário de chutes', 'Comece a prestar atenção nos padrões de movimento do bebê. Conhecer os horários em que ele é mais ativo ajuda a perceber qualquer mudança. Registre no seu diário! 📝', 7, true),

-- Week 25
(25, 1, 'Sentido de equilíbrio', 'O bebê está desenvolvendo o sentido de equilíbrio! Ele sabe quando está de cabeça para cima ou para baixo. Movimentos seus podem fazê-lo reagir e se ajeitar. 🔄', 1, true),
(25, 2, 'Anemia gestacional', 'A anemia é comum na gestação. Faça exames regulares de hemoglobina e mantenha o ferro em dia. Sintomas como cansaço extremo e palidez merecem atenção médica. 🩸', 2, true),
(25, 3, 'Selênio antioxidante', 'O selênio é um poderoso antioxidante que protege as células. Encontre-o na castanha-do-pará (apenas 1 por dia é suficiente!), ovos e atum. Poderoso e simples. 🌰', 3, true),
(25, 4, 'Roupas de gestante', 'Invista em roupas de gestante confortáveis! Calças com faixa elástica, vestidos soltos e sutiãs de amamentação já podem ser usados. Conforto é prioridade. 👗', 4, true),
(25, 5, 'Respiração para relaxar', 'Pratique técnicas de respiração: inspire em 4 tempos, segure em 4 e expire em 6. Essa respiração ativa o sistema nervoso parassimpático e reduz a ansiedade. 🌬️', 5, true),
(25, 6, 'Escolha a maternidade', 'Se ainda não escolheu, visite maternidades! Conheça a estrutura, UTI neonatal, políticas de acompanhante e humanização do parto. Escolha um lugar que inspire confiança. 🏥', 6, true),
(25, 7, 'Conexão familiar', 'Inclua a família na gestação! Convide avós, tios e primos para sentir o bebê chutar. Esses momentos criam laços de amor antes mesmo do nascimento. 👨‍👩‍👧', 7, true),

-- Week 26
(26, 1, 'Olhos abertos', 'O bebê abre os olhos pela primeira vez! Ele começa a perceber variações de luz através da parede do útero. Se apontar uma lanterna para a barriga, ele pode reagir! 👀', 1, true),
(26, 2, 'Terceiro trimestre chegando', 'O terceiro trimestre está quase começando! É hora de organizar documentos, confirmar o plano de saúde e garantir que tudo esteja preparado para a reta final. 📂', 2, true),
(26, 3, 'Proteínas variadas', 'Varie suas fontes de proteína: frango, peixe, ovos, feijão, lentilha, grão-de-bico e tofu. A proteína é essencial para o crescimento acelerado do bebê nesta fase. 🥚', 3, true),
(26, 4, 'Inchaço e retenção', 'O inchaço pode aumentar. Reduza o sal, beba bastante água, eleve as pernas e use meias de compressão. Se o inchaço for súbito no rosto e mãos, procure o médico. 🧊', 4, true),
(26, 5, 'Exercícios de respiração', 'Pratique a respiração que usará no parto: inspire pelo nariz contando até 4, e expire pela boca contando até 8. Essa técnica ajuda a controlar a dor e manter a calma. 💨', 5, true),
(26, 6, 'Documentos do bebê', 'Pesquise sobre os documentos necessários após o nascimento: certidão de nascimento, CPF e cartão SUS. Saber antecipadamente agiliza tudo nos primeiros dias. 📄', 6, true),
(26, 7, 'Momento de paz', 'Reserve 15 minutos do seu domingo para sentar em silêncio, colocar as mãos na barriga e simplesmente estar presente com seu bebê. Essa presença é um presente para ambos. 🕊️', 7, true),

-- Week 27
(27, 1, 'Cérebro ativo', 'O cérebro do bebê está muito ativo! Ele já tem ciclos de sono e vigília e pode até sonhar. Padrões de ondas cerebrais semelhantes aos de um recém-nascido são detectados. 🧠', 1, true),
(27, 2, 'Vacina anti-D', 'Se seu sangue é Rh negativo e o do pai é Rh positivo, converse com seu médico sobre a vacina anti-D (imunoglobulina). Ela previne a doença hemolítica do recém-nascido. 💉', 2, true),
(27, 3, 'Lanches noturnos', 'Fome à noite? Opte por lanches leves: iogurte natural, frutas, torrada integral com queijo branco. Evite comer muito antes de dormir para prevenir azia. 🌙', 3, true),
(27, 4, 'Dor nas costas', 'A barriga crescendo aumenta a lordose lombar. Fortaleça as costas com exercícios específicos, use uma cadeira ergonômica e considere uma cinta de sustentação gestacional. 🦴', 4, true),
(27, 5, 'Toque na barriga', 'O bebê já responde ao toque! Quando sentir um chute, toque de volta no mesmo lugar. Ele pode chutar novamente. É uma brincadeira incrível entre vocês. 🤰', 5, true),
(27, 6, 'Mala da maternidade', 'Comece a montar a mala da maternidade! Para você: roupas confortáveis, absorventes, chinelos. Para o bebê: bodies, fraldas, mantas. Faça uma lista e vá separando aos poucos. 🧳', 6, true),
(27, 7, 'Fé e esperança', 'Independente da sua crença, cultive a fé e a esperança. Acreditar que tudo vai dar certo e confiar no processo traz paz interior para você e para o bebê que sente tudo. 🙏', 7, true),

-- Week 28
(28, 1, 'Terceiro trimestre', 'Bem-vinda ao terceiro trimestre! Reta final! O bebê já pesa cerca de 1kg e está cada vez mais preparado para a vida fora do útero. Faltam apenas 12 semanas! 🎉', 1, true),
(28, 2, 'Contagem de movimentos', 'A partir de agora, conte os movimentos do bebê diariamente. Ele deve se mover pelo menos 10 vezes em 2 horas. Se notar redução significativa, procure o médico. 📊', 2, true),
(28, 3, 'DHA para o cérebro', 'O DHA (tipo de ômega 3) é crucial para o desenvolvimento cerebral nesta fase. Coma salmão 2x por semana ou converse com seu médico sobre suplementação. 🐟', 3, true),
(28, 4, 'Dificuldade para dormir', 'Dormir pode ficar mais difícil. Use um travesseiro entre as pernas, outro nas costas e tente dormir semi-reclinada se sentir falta de ar. Evite telas antes de dormir. 😴', 4, true),
(28, 5, 'Exercícios na bola', 'A bola de pilates é sua nova melhor amiga! Sente-se nela fazendo círculos com o quadril. Isso alivia dores, ajuda na posição do bebê e prepara a pelve para o parto. ⚽', 5, true),
(28, 6, 'Licença maternidade', 'Organize a documentação para a licença maternidade! Conheça seus direitos trabalhistas e converse com o RH sobre os procedimentos necessários. Planeje com antecedência. 📋', 6, true),
(28, 7, 'Carta de agradecimento', 'Escreva uma carta de agradecimento ao seu corpo por tudo que ele está fazendo. Cada desconforto é sinal de que a vida está sendo formada. Você é guerreira! 💪', 7, true),

-- Week 29
(29, 1, 'Ossos se fortalecem', 'Os ossos do bebê estão se endurecendo, exceto os do crânio que permanecerão flexíveis para facilitar a passagem no canal do parto. A natureza é sábia! 🦴', 1, true),
(29, 2, 'Pressão arterial', 'Monitore sua pressão arterial regularmente. Valores acima de 140/90 merecem atenção médica imediata. A hipertensão gestacional pode evoluir para pré-eclâmpsia. 🩺', 2, true),
(29, 3, 'Cálcio reforçado', 'O bebê está absorvendo muito cálcio dos seus ossos! Reforce a ingestão: 3 porções de laticínios por dia mais vegetais escuros. Seu médico pode recomendar suplementação. 🥛', 3, true),
(29, 4, 'Falta de ar', 'A falta de ar é comum pois o útero pressiona o diafragma. Mantenha boa postura, durma com a cabeceira elevada e evite esforços intensos. Vai melhorar quando o bebê encaixar. 💨', 4, true),
(29, 5, 'Perineal massage', 'A massagem perineal a partir desta semana pode ajudar a preparar os tecidos para o parto e reduzir o risco de laceração. Pergunte ao seu médico sobre a técnica. 🌸', 5, true),
(29, 6, 'Enxoval pronto', 'Finalize a lavagem do enxoval! Use sabão neutro de bebê e passe tudo a ferro. Organize nas gavetas e prateleiras. Tudo cheirosinho e pronto para o bebê chegar! 👶', 6, true),
(29, 7, 'Visualize o parto', 'Pratique visualização positiva do parto: imagine-se calma, forte e confiante. Visualize o bebê nascendo saudável nos seus braços. O poder da mente é incrível! 🌈', 7, true),

-- Week 30
(30, 1, 'Bebê de 1,3kg', 'O bebê pesa cerca de 1,3kg e mede 40cm! Ele está ganhando peso rapidamente e acumulando gordura que deixará suas bochechas fofinhas ao nascer. 😍', 1, true),
(30, 2, 'Streptococcus B', 'O exame de Streptococcus do grupo B deve ser feito entre as semanas 35-37. Converse com seu médico sobre o agendamento e saiba que, se positivo, é facilmente tratado. 🔬', 2, true),
(30, 3, 'Ferro e vitamina C', 'Continue combinando ferro com vitamina C nas refeições. Exemplo: carne vermelha com suco de laranja, feijão com salada de tomate. Essa dupla potente previne a anemia. 🍊', 3, true),
(30, 4, 'Posição do bebê', 'O médico verificará a posição do bebê nas consultas. A maioria vira de cabeça para baixo nas próximas semanas. Exercícios na bola podem ajudar no encaixe. 🔄', 4, true),
(30, 5, 'Alongamento matinal', 'Comece o dia com 10 minutos de alongamento suave. Estique braços, pernas e costas. O alongamento alivia rigidez, melhora a circulação e prepara o corpo para o dia. 🌅', 5, true),
(30, 6, 'Cadeirinha do carro', 'Pesquise e compre a cadeirinha/bebê-conforto para o carro! Ela deve ser instalada voltada para trás e é obrigatória para sair da maternidade. Teste a instalação antes. 🚗', 6, true),
(30, 7, 'Silêncio e paz', 'Dedique momentos de silêncio para estar com seu bebê. Sem celular, sem TV, sem distrações. Apenas você, sua respiração e essa vida que cresce dentro de você. 🕊️', 7, true),

-- Week 31
(31, 1, 'Cinco sentidos ativos', 'Todos os cinco sentidos do bebê estão funcionando! Ele vê, ouve, sente, prova e cheira (pelo líquido amniótico). É um ser humano completo em miniatura! ✨', 1, true),
(31, 2, 'Consultas quinzenais', 'A partir de agora, as consultas pré-natais podem ser quinzenais. Não falte a nenhuma — elas são cruciais para monitorar a saúde de vocês dois na reta final. 👩‍⚕️', 2, true),
(31, 3, 'Probióticos', 'Probióticos ajudam a manter a flora intestinal saudável e podem prevenir infecções. Inclua iogurte natural, kefir e alimentos fermentados na dieta diária. 🥛', 3, true),
(31, 4, 'Incontinência urinária', 'Pequenos escapes de urina ao tossir ou espirrar são comuns. Continue os exercícios de Kegel para fortalecer o assoalho pélvico. Após o parto, um fisioterapeuta pélvico pode ajudar. 💧', 4, true),
(31, 5, 'Preparação para o parto', 'Converse detalhadamente com seu médico sobre o plano de parto. Discuta analgesia, acompanhante, corte do cordão, contato pele a pele e amamentação na primeira hora. 📋', 5, true),
(31, 6, 'Organize a casa', 'Comece a organizar a casa para a chegada do bebê: monte o berço, organize o trocador, lave as roupinhas. Tudo pronto traz tranquilidade para os últimos dias. 🏠', 6, true),
(31, 7, 'Carta ao futuro', 'Escreva uma carta para você mesma ler daqui a um ano. Conte como se sente agora, seus medos e sonhos. Será emocionante reler depois com o bebê nos braços. 💌', 7, true),

-- Week 32
(32, 1, 'Unhas crescendo', 'As unhas do bebê já cresceram e alcançam as pontas dos dedinhos! Ele pode até se arranhar. Após o nascimento, você precisará de uma tesourinha de ponta redonda. 💅', 1, true),
(32, 2, 'Sintomas do terceiro trimestre', 'Azia, insônia, inchaço e falta de ar são companheiros frequentes agora. Lembre-se: são temporários! Cada desconforto significa que seu bebê está crescendo e quase pronto. 💕', 2, true),
(32, 3, 'Vitamina E', 'A vitamina E é antioxidante e importante para a pele e sistema imunológico. Encontre-a em amêndoas, sementes de girassol, azeite e abacate. Uma mão de amêndoas por dia! 🌻', 3, true),
(32, 4, 'Contrações de Braxton Hicks', 'As contrações de Braxton Hicks podem ficar mais frequentes. São irregulares e indolores. Se ficarem regulares (a cada 5 minutos) ou dolorosas, vá ao hospital. 🏥', 4, true),
(32, 5, 'Banho relaxante', 'Um banho morno (não quente!) antes de dormir pode aliviar dores e ajudar a relaxar. Adicione óleos essenciais de lavanda (1-2 gotas) para um efeito calmante extra. 🛁', 5, true),
(32, 6, 'Ensaio fotográfico', 'Se planejou um ensaio gestacional, agende para as próximas 2-3 semanas! A barriga estará linda e redonda, perfeita para fotos que ficarão para sempre. 📸', 6, true),
(32, 7, 'Confie no processo', 'A ansiedade com a aproximação do parto é natural. Confie no seu corpo, na sua equipe médica e no seu bebê. Mulheres dão à luz com sucesso há milênios. Você consegue! 💪', 7, true),

-- Week 33
(33, 1, 'Posição cefálica', 'A maioria dos bebês já está de cabeça para baixo! Se o seu ainda não virou, não se preocupe — ainda há tempo. Exercícios na bola e posições podem ajudar. 🔄', 1, true),
(33, 2, 'Imunidade transferida', 'Seus anticorpos estão sendo transferidos para o bebê através da placenta! Essa imunidade passiva o protegerá nos primeiros meses de vida. Mais um motivo para se cuidar. 🛡️', 2, true),
(33, 3, 'Refeições leves', 'Com o estômago comprimido pelo útero, refeições grandes causam desconforto. Coma porções menores e mais frequentes. Mastigue devagar e evite deitar logo após comer. 🍽️', 3, true),
(33, 4, 'Teste do cotonete', 'O exame de Streptococcus B (teste do cotonete) deve ser agendado para as próximas semanas. É rápido, indolor e importante para a segurança do parto. 🧪', 4, true),
(33, 5, 'Relaxamento progressivo', 'Pratique relaxamento muscular progressivo: contraia e relaxe cada grupo muscular do corpo, dos pés até a cabeça. Isso alivia tensões e prepara para o parto. 🧘‍♀️', 5, true),
(33, 6, 'Pediatra definido', 'Confirme o pediatra que acompanhará o bebê. Alguns pais gostam que o pediatra esteja presente no parto. Converse sobre essa possibilidade. 👨‍⚕️', 6, true),
(33, 7, 'Ninho de amor', 'O instinto de preparar o ninho está forte! Aproveite a energia para organizar cada detalhe do cantinho do bebê. Deixe tudo limpo, arrumado e cheio de amor. 🪺', 7, true),

-- Week 34
(34, 1, 'Pulmões quase prontos', 'Os pulmões do bebê estão quase completamente maduros! A produção de surfactante está em alta, preparando-o para respirar ar pela primeira vez. 🫁', 1, true),
(34, 2, 'Consultas semanais', 'Seu médico pode iniciar consultas semanais a partir de agora. Aproveite para tirar todas as dúvidas sobre o parto e os primeiros cuidados com o recém-nascido. 📅', 2, true),
(34, 3, 'Hidratação extra', 'Beba ainda mais água — pelo menos 2,5 litros por dia. A hidratação adequada ajuda a manter o volume de líquido amniótico e previne contrações prematuras. 💧', 3, true),
(34, 4, 'Sinais de parto', 'Conheça os sinais do trabalho de parto: contrações regulares e progressivas, perda do tampão mucoso, rompimento da bolsa. Saiba quando ir ao hospital e quando esperar em casa. 🚨', 4, true),
(34, 5, 'Exercícios de agachamento', 'Agachamentos com apoio (segurando numa cadeira) fortalecem as pernas e abrem a pelve para o parto. Faça 10 repetições, 2 vezes ao dia, sempre com cuidado. 🦵', 5, true),
(34, 6, 'Freezer preparado', 'Cozinhe e congele refeições para o pós-parto! Sopas, arroz, feijão e carnes porcionadas vão facilitar muito a vida quando o bebê chegar. Seu eu do futuro vai agradecer! 🍲', 6, true),
(34, 7, 'Amor incondicional', 'O amor que você sente pelo seu bebê antes mesmo de conhecê-lo pessoalmente é o mais puro que existe. Deixe esse sentimento guiar suas decisões e trazer coragem. ❤️', 7, true),

-- Week 35
(35, 1, 'Gordura acumulada', 'O bebê ganha cerca de 250g por semana! A gordura acumulada dá aquele visual fofinho e é essencial para regular a temperatura corporal após o nascimento. 🍼', 1, true),
(35, 2, 'Teste do cotonete', 'Esta é a semana ideal para o exame de Streptococcus do grupo B! Se positivo, você receberá antibiótico durante o parto para proteger o bebê. Simples e eficaz. 🩺', 2, true),
(35, 3, 'Energia para o parto', 'Alimente-se bem para ter energia para o parto! Tâmaras (6 por dia a partir de agora) estão associadas a dilatação mais rápida e partos mais curtos. Vale experimentar! 🌴', 3, true),
(35, 4, 'Encaixe do bebê', 'O bebê pode encaixar a cabeça na pelve a qualquer momento. Quando isso acontecer, você sentirá mais pressão embaixo, mas respirará melhor. É sinal de que está quase! 👇', 4, true),
(35, 5, 'Técnicas de parto', 'Revise as técnicas de respiração e relaxamento para o parto. Pratique diariamente: respiração lenta nas contrações leves e respiração curta nas intensas. 💨', 5, true),
(35, 6, 'Mala pronta', 'Hora de finalizar a mala da maternidade! Documentos, roupas para você e para o bebê, itens de higiene e o bebê-conforto no carro. Deixe tudo pronto na porta! 🧳', 6, true),
(35, 7, 'Carta ao bebê final', 'Escreva uma última carta ao bebê antes do nascimento. Conte tudo que sentiu durante a gestação, seus sonhos e a ansiedade de finalmente conhecê-lo pessoalmente. 💝', 7, true),

-- Week 36
(36, 1, 'Quase a termo', 'O bebê é considerado pré-termo tardio. Se nascesse agora, teria ótimas chances! Mas cada dia a mais no útero ajuda no amadurecimento cerebral e pulmonar. ⏰', 1, true),
(36, 2, 'Monitoramento', 'Seu médico pode solicitar cardiotocografia para monitorar os batimentos do bebê e as contrações uterinas. É um exame tranquilo e que traz muita informação. 💗', 2, true),
(36, 3, 'Alimentação leve', 'Mantenha a alimentação leve e frequente. O estômago está bem comprimido! Frutas, iogurte, torradas e sopas são boas opções para refeições confortáveis. 🍎', 3, true),
(36, 4, 'Tampão mucoso', 'A perda do tampão mucoso (secreção gelatinosa rosa ou marrom) pode acontecer. Não significa que o parto é imediato, mas é sinal de que o colo está amadurecendo. 🔍', 4, true),
(36, 5, 'Caminhada suave', 'Caminhadas suaves ajudam o bebê a encaixar e estimulam o trabalho de parto naturalmente. Caminhe em locais planos e seguros, sempre acompanhada. 🚶‍♀️', 5, true),
(36, 6, 'Números importantes', 'Tenha à mão: telefone do médico, da maternidade, do plano de saúde e de quem vai te levar ao hospital. Compartilhe com familiares e acompanhantes. 📱', 6, true),
(36, 7, 'Presença e calma', 'Pratique estar presente. Respire fundo, observe seu corpo e sinta a vida dentro de você. Esses últimos dias de gestação são preciosos e únicos. Viva cada um. 🕊️', 7, true),

-- Week 37
(37, 1, 'A termo!', 'Seu bebê é considerado a termo! Ele está pronto para nascer a qualquer momento. Todos os órgãos estão maduros e funcionando. O momento mágico se aproxima! 🌟', 1, true),
(37, 2, 'Dilatação começa', 'Seu colo do útero pode começar a dilatar e afinar. Isso acontece gradualmente e pode levar dias ou semanas. Cada corpo tem seu próprio ritmo. Paciência! 🌺', 2, true),
(37, 3, 'Alimentos para energia', 'Mantenha a energia com alimentos nutritivos: granola, frutas secas, mel, pão integral e ovos. Você precisará de reservas para o trabalho de parto. 🍯', 3, true),
(37, 4, 'Posições para o parto', 'Pratique posições que podem ajudar no parto: de cócoras com apoio, de quatro apoios, na bola de pilates. Movimentar-se durante o trabalho de parto acelera o processo. 🤸', 4, true),
(37, 5, 'Nesting instinct', 'O instinto de ninhada pode estar forte! Organize, limpe e arrume tudo. Mas cuidado: não exagere nos esforços físicos. Peça ajuda para tarefas pesadas. 🏡', 5, true),
(37, 6, 'Acompanhante no parto', 'Confirme quem será seu acompanhante no parto. É um direito garantido por lei! Escolha alguém que transmita calma e segurança. Conversem sobre o plano de parto juntos. 🤝', 6, true),
(37, 7, 'Gratidão profunda', 'Sinta gratidão profunda por essa jornada que está chegando ao fim. Cada segundo de desconforto valeu a pena. Em breve você terá seu bebê nos braços. 🙏', 7, true),

-- Week 38
(38, 1, 'Mecônio se formando', 'O intestino do bebê está acumulando mecônio — as primeiras fezes, de cor verde-escura. Será eliminado nos primeiros dias de vida. Tudo funcionando perfeitamente! 💚', 1, true),
(38, 2, 'Sinais do parto', 'Fique atenta: contrações regulares (a cada 5 minutos por 1 hora), rompimento da bolsa ou sangramento são sinais para ir ao hospital. Não hesite em ligar para o médico! 🚑', 2, true),
(38, 3, 'Chá de tâmaras', 'Continue consumindo tâmaras e mantenha a alimentação equilibrada. Evite alimentos pesados que possam causar desconforto digestivo nesta fase final. 🌴', 3, true),
(38, 4, 'Descanso ativo', 'Alterne descanso com atividades leves. Caminhe, faça exercícios na bola, alongue-se. O movimento ajuda o bebê a descer e estimula o trabalho de parto naturalmente. 🏐', 4, true),
(38, 5, 'Bolsa na porta', 'A mala deve estar pronta na porta! Verifique: documentos, roupas, itens de higiene para você e bebê, carregador de celular e o bebê-conforto instalado no carro. ✅', 5, true),
(38, 6, 'Últimos preparativos', 'Verifique se tudo está pronto: quartinho organizado, fraldas compradas, pediatra escolhido, maternidade confirmada. Respire fundo — você está preparada! 🎒', 6, true),
(38, 7, 'Confie e entregue', 'Confie no seu corpo, na sua intuição e na sua equipe médica. Você foi feita para isso. O parto é poderoso e transformador. Entregue-se ao processo com coragem. 💫', 7, true),

-- Week 39
(39, 1, 'Pronto para nascer', 'O bebê está completamente pronto! Pesa em média 3,2kg e mede cerca de 50cm. Ele está apenas esperando o momento certo para fazer sua grande estreia. 🌈', 1, true),
(39, 2, 'Líquido amniótico', 'O volume de líquido amniótico começa a diminuir. É normal! O bebê ocupa quase todo o espaço do útero. Os movimentos podem parecer diferentes — mais pressões que chutes. 💧', 2, true),
(39, 3, 'Refeições frequentes', 'Coma refeições leves e frequentes. Mantenha crackers e frutas por perto. Durante o trabalho de parto inicial, alimentos leves podem dar energia. 🍪', 3, true),
(39, 4, 'Quando ir ao hospital', 'Vá ao hospital quando: contrações a cada 5 min por 1 hora, bolsa rompeu, sangramento vaginal, ou qualquer preocupação. Na dúvida, vá! Melhor prevenir. 🏥', 4, true),
(39, 5, 'Últimas caminhadas', 'Continue caminhando! A gravidade e o movimento ajudam o bebê a descer e estimulam o colo do útero. Caminhe em lugares seguros e sempre acompanhada. 👣', 5, true),
(39, 6, 'Contato pele a pele', 'Converse com sua equipe sobre o contato pele a pele imediato após o nascimento. Esse momento é fundamental para o vínculo e para o início da amamentação. 🤱', 6, true),
(39, 7, 'Últimos momentos', 'Estes podem ser os últimos dias com o bebê dentro da barriga. Saboreie cada momento, cada chute, cada movimento. Em breve vocês estarão face a face. 💝', 7, true),

-- Week 40
(40, 1, 'Data provável!', 'Você chegou à data provável do parto! Mas lembre-se: apenas 5% dos bebês nascem exatamente na data prevista. O bebê virá no momento certo dele. Tenha paciência! 📅', 1, true),
(40, 2, 'Monitoramento frequente', 'Seu médico fará monitoramento mais frequente: cardiotocografia, verificação do líquido amniótico e avaliação do colo. Confie na equipe e siga as orientações. 🩺', 2, true),
(40, 3, 'Alimentação energética', 'Mantenha-se nutrida com alimentos que dão energia rápida e saudável: frutas, mel, pão integral e barras de cereal. Você vai precisar dessa energia para o parto! ⚡', 3, true),
(40, 4, 'Paciência e confiança', 'A espera pode ser angustiante, mas confie no seu corpo e no seu bebê. Ele sabe quando está pronto. Use esse tempo para descansar e se preparar emocionalmente. 🧘', 4, true),
(40, 5, 'Relaxe e respire', 'Pratique suas técnicas de respiração e relaxamento. Tome banhos mornos, ouça músicas calmas e mantenha pensamentos positivos. Seu bebê sente sua energia. 🌊', 5, true),
(40, 6, 'Você consegue', 'Milhões de mulheres ao redor do mundo dão à luz todos os dias. Seu corpo foi projetado para isso. Você é forte, corajosa e capaz. Confie em você mesma! 💪', 6, true),
(40, 7, 'O grande dia chegará', 'O grande dia está chegando! Logo você terá seu bebê nos braços, sentirá seu cheirinho e ouvirá seu primeiro choro. Tudo que passou terá valido cada segundo. Parabéns, mamãe! 🎊💕', 7, true);
