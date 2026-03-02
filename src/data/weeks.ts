export interface WeekData {
  week: number;
  babySize: string;
  babySizeComparison: string;
  babyDevelopment: string;
  motherChanges: string;
  commonSymptoms: string[];
  alerts: string[];
  tip: string;
}

export const weeksData: WeekData[] = [
  { week: 1, babySize: "< 1mm", babySizeComparison: "🌰 Grão de areia", babyDevelopment: "A fecundação acontece e o zigoto começa a se dividir.", motherChanges: "Você pode não sentir nada ainda. O corpo está se preparando.", commonSymptoms: ["Nenhum sintoma perceptível"], alerts: ["Comece a tomar ácido fólico"], tip: "Comece a tomar vitaminas pré-natais o quanto antes." },
  { week: 2, babySize: "< 1mm", babySizeComparison: "🌰 Semente de papoula", babyDevelopment: "O blastocisto viaja pelas trompas rumo ao útero.", motherChanges: "Algumas mulheres sentem leve cólica ou spotting de implantação.", commonSymptoms: ["Leve cólica", "Spotting"], alerts: [], tip: "Mantenha hidratação adequada e evite álcool." },
  { week: 3, babySize: "1mm", babySizeComparison: "🌰 Semente de chia", babyDevelopment: "O embrião se implanta no útero. As células começam a se diferenciar.", motherChanges: "Possível sensibilidade nos seios e cansaço.", commonSymptoms: ["Sensibilidade nos seios", "Fadiga"], alerts: [], tip: "Descanse bastante e ouça seu corpo." },
  { week: 4, babySize: "2mm", babySizeComparison: "🌱 Semente de gergelim", babyDevelopment: "O coração primitivo começa a se formar. O tubo neural se desenvolve.", motherChanges: "Enjoo matinal pode começar. Seios mais sensíveis.", commonSymptoms: ["Enjoo", "Seios sensíveis", "Fadiga"], alerts: ["Teste de gravidez positivo!"], tip: "Coma pequenas refeições ao longo do dia para aliviar enjoos." },
  { week: 5, babySize: "3mm", babySizeComparison: "🍊 Semente de laranja", babyDevelopment: "O coração começa a bater! Braços e pernas começam como brotos.", motherChanges: "Enjoos podem se intensificar. Frequência urinária aumenta.", commonSymptoms: ["Enjoo intenso", "Frequência urinária", "Mudanças de humor"], alerts: ["Marque sua primeira consulta pré-natal"], tip: "Gengibre e limão podem ajudar com enjoos." },
  { week: 6, babySize: "6mm", babySizeComparison: "🫐 Lentilha", babyDevelopment: "O rosto começa a se formar. Olhos e narinas aparecem como manchas.", motherChanges: "Cansaço extremo e enjoos são comuns.", commonSymptoms: ["Náusea", "Fadiga extrema", "Inchaço"], alerts: [], tip: "Tente dormir mais cedo e tire cochilos quando possível." },
  { week: 7, babySize: "1,3cm", babySizeComparison: "🫐 Blueberry", babyDevelopment: "O cérebro está crescendo rapidamente. Mãos e pés se formam.", motherChanges: "Salivação excessiva pode ocorrer. Aversões alimentares.", commonSymptoms: ["Salivação", "Aversões alimentares", "Cólicas leves"], alerts: [], tip: "Evite alimentos com odores fortes se causar náusea." },
  { week: 8, babySize: "1,6cm", babySizeComparison: "🍇 Framboesa", babyDevelopment: "Todos os órgãos essenciais começaram a se formar. O bebê se move, mas você ainda não sente.", motherChanges: "Útero do tamanho de uma laranja. Calças podem apertar.", commonSymptoms: ["Roupas apertando", "Enjoo", "Constipação"], alerts: ["Primeiro ultrassom geralmente entre 8-12 semanas"], tip: "Invista em roupas confortáveis com elástico na cintura." },
  { week: 9, babySize: "2,3cm", babySizeComparison: "🍒 Azeitona", babyDevelopment: "Os dedos das mãos e pés se separam. A cauda embrionária desaparece.", motherChanges: "Cintura mais grossa. Humor instável.", commonSymptoms: ["Mudanças de humor", "Congestão nasal", "Dor de cabeça"], alerts: [], tip: "Pratique respiração profunda quando se sentir ansiosa." },
  { week: 10, babySize: "3cm", babySizeComparison: "🍓 Morango", babyDevelopment: "Os ossos começam a endurecer. Unhas começam a crescer.", motherChanges: "Veias mais visíveis pela pele. Volume sanguíneo aumentando.", commonSymptoms: ["Veias aparentes", "Cansaço", "Enjoo diminuindo"], alerts: [], tip: "Comece a usar protetor solar para evitar manchas de gravidez." },
  { week: 11, babySize: "4cm", babySizeComparison: "🍋 Limão pequeno", babyDevelopment: "O bebê pode bocejar e soluçar! Os genitais começam a se diferenciar.", motherChanges: "Enjoos podem começar a diminuir. Energia voltando aos poucos.", commonSymptoms: ["Azia", "Gases", "Mais energia"], alerts: [], tip: "Aproveite o retorno da energia para fazer atividades leves." },
  { week: 12, babySize: "5,4cm", babySizeComparison: "🍑 Ameixa", babyDevelopment: "Os reflexos estão se desenvolvendo. O bebê pode fechar os punhos.", motherChanges: "Risco de aborto diminui significativamente. Barriguinha aparecendo!", commonSymptoms: ["Barriga aparecendo", "Disposição melhorando", "Constipação"], alerts: ["Exame de translucência nucal (11-14 semanas)"], tip: "Esse é um momento seguro para compartilhar a novidade!" },
  { week: 13, babySize: "7,4cm", babySizeComparison: "🍋 Limão", babyDevelopment: "As cordas vocais se formam. O bebê produz urina.", motherChanges: "Bem-vinda ao 2° trimestre! Mais energia e disposição.", commonSymptoms: ["Mais energia", "Menos enjoo", "Libido alterada"], alerts: [], tip: "O 2° trimestre costuma ser o mais confortável. Aproveite!" },
  { week: 14, babySize: "8,7cm", babySizeComparison: "🍊 Nectarina", babyDevelopment: "O bebê faz expressões faciais. Lanugo (pelinhos finos) cobre o corpo.", motherChanges: "Apetite aumenta. Disposição melhora bastante.", commonSymptoms: ["Mais apetite", "Dores ligamentares", "Congestão nasal"], alerts: [], tip: "Comece a hidratar a barriga para prevenir estrias." },
  { week: 16, babySize: "11,6cm", babySizeComparison: "🥑 Abacate", babyDevelopment: "O bebê ouve sons! As unhas dos pés começam a crescer.", motherChanges: "Você pode sentir as primeiras mexidas (como borboletas)!", commonSymptoms: ["Primeiras mexidas", "Mais energia", "Nariz entupido"], alerts: [], tip: "Converse e cante para o bebê — ele já pode ouvir você!" },
  { week: 20, babySize: "25cm", babySizeComparison: "🍌 Banana", babyDevelopment: "Metade da gestação! O bebê está coberto de vernix. Movimentos mais fortes.", motherChanges: "Barriga visível. Umbigo pode começar a saltar.", commonSymptoms: ["Dor lombar", "Cãibras", "Inchaço leve"], alerts: ["Ultrassom morfológico (18-22 semanas)"], tip: "Use almofada entre as pernas para dormir melhor." },
  { week: 24, babySize: "30cm", babySizeComparison: "🌽 Espiga de milho", babyDevelopment: "Os pulmões desenvolvem surfactante. O bebê tem ciclos de sono.", motherChanges: "Linha nigra pode aparecer. Pele esticando.", commonSymptoms: ["Linha nigra", "Coceira na barriga", "Estrias"], alerts: ["Teste de glicose (24-28 semanas)"], tip: "Hidrate muito a pele da barriga e seios." },
  { week: 28, babySize: "37cm", babySizeComparison: "🍆 Berinjela", babyDevelopment: "O bebê abre os olhos! Tem fases de sono e vigília definidas.", motherChanges: "Bem-vinda ao 3° trimestre! Falta de ar pode começar.", commonSymptoms: ["Falta de ar", "Azia intensa", "Insônia"], alerts: ["Início do 3° trimestre", "Consultas quinzenais"], tip: "Durma de lado (esquerdo preferencialmente)." },
  { week: 32, babySize: "42cm", babySizeComparison: "🥥 Coco", babyDevelopment: "O bebê está ganhando gordura. Unhas crescidas. Prática de respiração.", motherChanges: "Barriga grande. Contrações de Braxton Hicks podem começar.", commonSymptoms: ["Braxton Hicks", "Pressão pélvica", "Cansaço"], alerts: ["Monte a mala da maternidade"], tip: "Comece a preparar a mala da maternidade." },
  { week: 36, babySize: "47cm", babySizeComparison: "🍈 Melão", babyDevelopment: "O bebê está encaixando na posição de parto. Pulmões quase maduros.", motherChanges: "Pressão na bexiga intensa. Pode respirar melhor com o bebê descendo.", commonSymptoms: ["Pressão na bexiga", "Dificuldade para caminhar", "Ansiedade"], alerts: ["Consultas semanais", "Strep B test"], tip: "Pratique técnicas de respiração para o parto." },
  { week: 38, babySize: "49cm", babySizeComparison: "🍉 Mini melancia", babyDevelopment: "O bebê é considerado a termo! Todos os órgãos estão maduros.", motherChanges: "Nesting (instinto de organizar tudo). Tampa mucosa pode sair.", commonSymptoms: ["Instinto de organização", "Ansiedade", "Contrações irregulares"], alerts: ["Atente-se a sinais de trabalho de parto"], tip: "Sinais de trabalho de parto: contrações regulares, ruptura da bolsa, sangramento." },
  { week: 40, babySize: "51cm", babySizeComparison: "🍉 Melancia", babyDevelopment: "O bebê está pronto para nascer! Peso médio de 3-3,5kg.", motherChanges: "Você pode estar ansiosa — isso é completamente normal!", commonSymptoms: ["Ansiedade", "Contrações", "Insônia"], alerts: ["Se passar de 41 semanas, consulte seu médico"], tip: "Confie no seu corpo. Você está preparada para este momento!" },
];

export function getWeekData(week: number): WeekData | undefined {
  return weeksData.find(w => w.week === week);
}

export function getClosestWeekData(week: number): WeekData {
  const exact = weeksData.find(w => w.week === week);
  if (exact) return exact;
  const sorted = [...weeksData].sort((a, b) => Math.abs(a.week - week) - Math.abs(b.week - week));
  return sorted[0];
}
