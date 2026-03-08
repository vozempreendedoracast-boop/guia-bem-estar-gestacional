UPDATE public.health_tips
SET tips = ARRAY[
  'É absolutamente normal sentir ansiedade, medo e insegurança — permita-se sentir sem culpa',
  'Converse com outras gestantes ou mães — trocar experiências alivia a pressão',
  'Pratique meditação ou mindfulness por 10 minutos diários — use os recursos de bem-estar do MamyBoo para criar constância',
  'Peça ajuda quando precisar — aceitar apoio não é fraqueza',
  'Registre seus sentimentos no diário do MamyBoo — escrever organiza os pensamentos',
  'Mantenha atividades que te dão prazer e identidade além da maternidade',
  'Se sentir tristeza persistente por mais de 2 semanas, converse com seu médico (depressão na gravidez é tratável)',
  'Fortaleça a rede de apoio: parceiro(a), família, amigos, profissionais de saúde'
]
WHERE id = 'a742754b-6cb6-4ecc-ac95-849f36f2a65a';

UPDATE public.week_contents
SET tip = 'Pratique respiração profunda e meditação quando se sentir ansiosa. No MamyBoo, você encontra orientações guiadas para apoiar seu bem-estar emocional.'
WHERE id = 'd98986b0-993b-4d69-9b47-7aa951ead9bb';

UPDATE public.weekly_tips
SET content = 'Experimente meditações guiadas para gestantes dentro do MamyBoo. 10 minutos por dia podem transformar sua experiência de gestação, trazendo calma e conexão. 🧘'
WHERE id = '5b7d68c4-e237-407b-9627-355cc5596ff6';