
-- Update health_tips with descriptions and images
UPDATE public.health_tips SET 
  description = 'A alimentação durante a gestação é um dos pilares mais importantes para o desenvolvimento saudável do seu bebê. Os nutrientes que você consome são a principal fonte de energia e construção celular do feto. Uma dieta equilibrada reduz riscos de complicações como pré-eclâmpsia, diabetes gestacional e anemia, além de garantir que seu corpo tenha reservas suficientes para o parto e a amamentação.',
  image_url = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80'
WHERE section_title = 'Alimentação';

UPDATE public.health_tips SET 
  description = 'O sono de qualidade é essencial durante a gestação, pois é nesse período que o corpo produz hormônios fundamentais para o crescimento do bebê e a recuperação da mãe. A privação de sono está associada a maior risco de parto prematuro e dificuldades emocionais. Dormir bem fortalece o sistema imunológico, melhora o humor e prepara o corpo para as demandas crescentes da gravidez.',
  image_url = 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?w=800&q=80'
WHERE section_title = 'Sono e Descanso';

UPDATE public.health_tips SET 
  description = 'A saúde emocional na gestação impacta diretamente o desenvolvimento do bebê. Estudos mostram que o estresse crônico materno pode afetar o sistema nervoso fetal. Cuidar das suas emoções não é luxo — é necessidade. A gestação traz uma montanha-russa hormonal que amplifica sentimentos, e reconhecer isso é o primeiro passo para viver esse momento com mais leveza e consciência.',
  image_url = 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
WHERE section_title = 'Saúde Emocional';

UPDATE public.health_tips SET 
  description = 'A sexualidade durante a gestação é um tema cercado de mitos e tabus, mas que merece atenção e diálogo aberto. Manter a intimidade com seu parceiro(a) fortalece o vínculo emocional e contribui para o bem-estar da gestante. O corpo passa por transformações intensas que afetam o desejo e a autoestima, e compreender essas mudanças é fundamental para viver a sexualidade de forma saudável e prazerosa.',
  image_url = 'https://images.unsplash.com/photo-1516585427167-9f4af9627e6c?w=800&q=80'
WHERE section_title = 'Sexualidade na Gravidez';

UPDATE public.health_tips SET 
  description = 'Preparar-se para o parto é tão importante quanto os cuidados durante a gestação. Mulheres que se informam e se preparam relatam menor ansiedade, maior satisfação com a experiência do parto e recuperação mais rápida. Conhecer seus direitos, entender as etapas do trabalho de parto e ter um plano reduz o medo do desconhecido e empodera você para tomar decisões conscientes.',
  image_url = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80'
WHERE section_title = 'Preparação para o Parto';

UPDATE public.health_tips SET 
  description = 'Durante a gestação, a pele sofre diversas alterações causadas pelas mudanças hormonais — aumento de melanina, maior oleosidade, ressecamento e propensão a estrias. Cuidar da pele vai além da estética: a hidratação adequada previne desconfortos como coceira e rachaduras, e o uso correto de protetor solar evita manchas permanentes. Uma rotina simples e consistente faz toda a diferença.',
  image_url = 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80'
WHERE section_title = 'Cuidados com a Pele';

UPDATE public.health_tips SET 
  description = 'A amamentação é o alimento mais completo para o recém-nascido e oferece benefícios comprovados tanto para o bebê quanto para a mãe. O leite materno contém anticorpos, nutrientes e enzimas perfeitamente adaptados. Preparar-se antes do nascimento — conhecendo técnicas de pega, posições e possíveis desafios — aumenta significativamente as chances de uma amamentação bem-sucedida e prazerosa.',
  image_url = 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&q=80'
WHERE section_title = 'Amamentação';
