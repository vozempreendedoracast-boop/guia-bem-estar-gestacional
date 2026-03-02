export interface Symptom {
  id: string;
  name: string;
  description: string;
  whenCommon: string;
  whenSeeDoctor: string;
  whatToDo: string;
  alertLevel: "low" | "moderate" | "high";
  trimester: number[];
}

export const symptoms: Symptom[] = [
  { id: "nausea", name: "Enjoo / Náusea", description: "Sensação de desconforto no estômago, com ou sem vômito.", whenCommon: "Semanas 4-14, mais forte pela manhã", whenSeeDoctor: "Se não conseguir manter líquidos por 24h ou perder peso", whatToDo: "Coma pequenas refeições, gengibre, biscoitos secos antes de levantar", alertLevel: "low", trimester: [1] },
  { id: "fatigue", name: "Fadiga / Cansaço", description: "Cansaço extremo mesmo com sono adequado.", whenCommon: "1° e 3° trimestres", whenSeeDoctor: "Se acompanhada de falta de ar intensa ou tontura", whatToDo: "Descanse sempre que possível, durma mais cedo, alimente-se bem", alertLevel: "low", trimester: [1, 3] },
  { id: "back-pain", name: "Dor nas Costas", description: "Dor lombar causada pelo peso extra e mudança no centro de gravidade.", whenCommon: "A partir do 2° trimestre", whenSeeDoctor: "Se a dor for intensa, constante ou acompanhada de sangramento", whatToDo: "Use almofadas de apoio, faça alongamentos, evite ficar muito tempo em pé", alertLevel: "low", trimester: [2, 3] },
  { id: "heartburn", name: "Azia", description: "Queimação no estômago e esôfago.", whenCommon: "2° e 3° trimestres", whenSeeDoctor: "Se não melhorar com mudanças alimentares", whatToDo: "Evite alimentos ácidos e gordurosos, coma devagar, não deite logo após comer", alertLevel: "low", trimester: [2, 3] },
  { id: "swelling", name: "Inchaço", description: "Retenção de líquidos nos pés, tornozelos e mãos.", whenCommon: "3° trimestre", whenSeeDoctor: "Se o inchaço for súbito, no rosto, ou acompanhado de dor de cabeça", whatToDo: "Eleve os pés, beba água, evite ficar muito tempo em pé", alertLevel: "moderate", trimester: [3] },
  { id: "braxton-hicks", name: "Contrações de Braxton Hicks", description: "Contrações irregulares de \"treinamento\" do útero.", whenCommon: "A partir da semana 28", whenSeeDoctor: "Se ficarem regulares, dolorosas ou frequentes antes de 37 semanas", whatToDo: "Mude de posição, beba água, tome banho morno", alertLevel: "moderate", trimester: [3] },
  { id: "bleeding", name: "Sangramento", description: "Qualquer sangramento vaginal durante a gravidez.", whenCommon: "Pode ocorrer em qualquer fase", whenSeeDoctor: "SEMPRE consulte seu médico em caso de sangramento", whatToDo: "Repouso e contato imediato com seu médico", alertLevel: "high", trimester: [1, 2, 3] },
  { id: "headache", name: "Dor de Cabeça", description: "Dores de cabeça frequentes, muitas vezes hormonais.", whenCommon: "1° trimestre", whenSeeDoctor: "Se intensa, persistente ou acompanhada de visão turva", whatToDo: "Descanse em ambiente escuro, hidrate-se, compressa fria", alertLevel: "low", trimester: [1, 2] },
  { id: "cramps", name: "Cólicas", description: "Dores abdominais semelhantes a cólicas menstruais.", whenCommon: "Início da gravidez (implantação) e 3° trimestre", whenSeeDoctor: "Se intensas, persistentes ou com sangramento", whatToDo: "Repouso, banho morno, posição confortável", alertLevel: "moderate", trimester: [1, 3] },
  { id: "insomnia", name: "Insônia", description: "Dificuldade para dormir ou manter o sono.", whenCommon: "3° trimestre", whenSeeDoctor: "Se causar exaustão extrema ou afetar o dia a dia", whatToDo: "Rotina de sono, chá de camomila, travesseiro entre pernas", alertLevel: "low", trimester: [3] },
];
