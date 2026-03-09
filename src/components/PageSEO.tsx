import { Helmet } from "react-helmet-async";

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
}

const BASE_URL = "https://mamyboo.com";
const DEFAULT_KEYWORDS = "gravidez semana a semana, aplicativo gravidez, acompanhamento gestacional, desenvolvimento do bebê, sintomas da gravidez, saúde da gestante, maternidade";

const PageSEO = ({ title, description, keywords, path }: PageSEOProps) => {
  const fullTitle = `${title} | MamyBoo`;
  const canonical = path ? `${BASE_URL}${path}` : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords || DEFAULT_KEYWORDS} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default PageSEO;
