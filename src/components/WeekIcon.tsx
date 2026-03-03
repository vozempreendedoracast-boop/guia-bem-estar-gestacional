import React from "react";

interface WeekIconProps {
  week: number;
  className?: string;
  size?: number;
}

const WeekIcon: React.FC<WeekIconProps> = ({ week, className = "", size = 32 }) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: "0 0 48 48",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
  };

  const stroke = "currentColor";
  const sw = 2;
  const fill1 = "currentColor";
  const fillOpacity = 0.15;

  switch (week) {
    // Semana 1 – Sparkle (sem embrião)
    case 1:
      return (
        <svg {...svgProps}>
          <path d="M24 6L26.5 18.5L38 16L28 24L38 32L26.5 29.5L24 42L21.5 29.5L10 32L20 24L10 16L21.5 18.5L24 6Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill1} fillOpacity={fillOpacity} />
        </svg>
      );
    // Semana 2 – Flower bud (preparação)
    case 2:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="28" rx="8" ry="10" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 18V10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M20 12C20 12 22 14 24 14C26 14 28 12 28 12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M18 16C18 16 21 18 24 18C27 18 30 16 30 16" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </svg>
      );
    // Semana 3 – Grão de areia
    case 3:
      return (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="3" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <circle cx="24" cy="24" r="8" stroke={stroke} strokeWidth={1} strokeDasharray="2 3" opacity={0.4} />
        </svg>
      );
    // Semana 4 – Grão de papoula
    case 4:
      return (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="4" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <circle cx="24" cy="24" r="9" stroke={stroke} strokeWidth={1} strokeDasharray="2 3" opacity={0.3} />
        </svg>
      );
    // Semana 5 – Grão de gergelim
    case 5:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="3.5" ry="5" transform="rotate(-15 24 24)" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
        </svg>
      );
    // Semana 6 – Grão de arroz
    case 6:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="3" ry="7" transform="rotate(-10 24 24)" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 17V31" stroke={stroke} strokeWidth={1} opacity={0.3} />
        </svg>
      );
    // Semana 7 – Grão de milho
    case 7:
      return (
        <svg {...svgProps}>
          <path d="M24 14C19 14 16 18 16 24C16 30 19 34 24 34C29 34 32 30 32 24C32 18 29 14 24 14Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 14V11" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M22 12L24 11L26 12" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </svg>
      );
    // Semana 8 – Feijão
    case 8:
      return (
        <svg {...svgProps}>
          <path d="M20 16C16 18 14 22 16 28C18 34 24 36 28 34C32 32 34 26 32 20C30 16 26 14 22 16" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M18 22C22 20 26 22 30 26" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
        </svg>
      );
    // Semana 9 – Jaboticaba (berry)
    case 9:
      return (
        <svg {...svgProps}>
          <circle cx="24" cy="26" r="9" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M22 17L24 13L26 17" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <circle cx="22" cy="23" r="2" fill={stroke} fillOpacity={0.08} />
        </svg>
      );
    // Semana 10 – Ciriguela (small round fruit)
    case 10:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="26" rx="9" ry="10" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 16L24 12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M21 13C22 15 26 15 27 13" stroke={stroke} strokeWidth={1.5} fill="none" strokeLinecap="round" />
        </svg>
      );
    // Semana 11 – Ameixa
    case 11:
      return (
        <svg {...svgProps}>
          <path d="M24 36C18 36 14 30 14 24C14 18 18 14 24 14C30 14 34 18 34 24C34 30 30 36 24 36Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 14V10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M24 14C24 14 20 16 20 20" stroke={stroke} strokeWidth={1} opacity={0.3} strokeLinecap="round" />
        </svg>
      );
    // Semana 12 – Limão
    case 12:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="25" rx="10" ry="11" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 14L24 10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <ellipse cx="24" cy="25" rx="5" ry="6" stroke={stroke} strokeWidth={1} opacity={0.2} />
        </svg>
      );
    // Semana 13 – Pêssego
    case 13:
      return (
        <svg {...svgProps}>
          <path d="M24 36C17 36 13 30 13 24C13 18 17 14 24 14C31 14 35 18 35 24C35 30 31 36 24 36Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 14C24 14 22 10 20 10" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
          <path d="M24 14C24 14 26 10 28 10" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.5} />
          <path d="M24 14L24 36" stroke={stroke} strokeWidth={1} opacity={0.15} />
        </svg>
      );
    // Semana 14 – Maçã pequena
    case 14:
      return (
        <svg {...svgProps}>
          <path d="M24 38C16 38 12 31 12 24C12 17 16 13 24 13C32 13 36 17 36 24C36 31 32 38 24 38Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 13V8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M26 10C28 8 30 9 30 9" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" />
        </svg>
      );
    // Semana 15 – Maçã média
    case 15:
      return (
        <svg {...svgProps}>
          <path d="M24 39C15 39 11 31 11 24C11 17 15 12 24 12C33 12 37 17 37 24C37 31 33 39 24 39Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 12V7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M26 9C28 7 31 8 31 8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <path d="M21 9C19 7 17 8 17 8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.4} />
        </svg>
      );
    // Semana 16 – Abacate
    case 16:
      return (
        <svg {...svgProps}>
          <path d="M24 8C20 8 14 14 14 24C14 34 20 40 24 40C28 40 34 34 34 24C34 14 28 8 24 8Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <ellipse cx="24" cy="28" rx="6" ry="7" stroke={stroke} strokeWidth={1.5} opacity={0.3} />
        </svg>
      );
    // Semana 17 – Pera
    case 17:
      return (
        <svg {...svgProps}>
          <path d="M24 8C22 8 20 10 20 13C18 16 14 20 14 28C14 35 19 40 24 40C29 40 34 35 34 28C34 20 30 16 28 13C28 10 26 8 24 8Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 8V5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    // Semana 18 – Pimentão
    case 18:
      return (
        <svg {...svgProps}>
          <path d="M16 16C14 20 13 26 14 32C15 37 19 40 24 40C29 40 33 37 34 32C35 26 34 20 32 16C30 13 28 12 24 12C20 12 18 13 16 16Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 12V7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M20 8L24 7L28 8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <path d="M20 16L20 32" stroke={stroke} strokeWidth={1} opacity={0.15} />
          <path d="M28 16L28 32" stroke={stroke} strokeWidth={1} opacity={0.15} />
        </svg>
      );
    // Semana 19 – Manga
    case 19:
      return (
        <svg {...svgProps}>
          <path d="M18 10C14 14 12 20 14 28C16 36 22 40 26 40C32 38 36 30 34 22C32 14 28 10 24 8C22 8 20 8 18 10Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M22 8L20 5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    // Semana 20 – Banana
    case 20:
      return (
        <svg {...svgProps}>
          <path d="M14 12C12 16 14 28 18 34C22 40 28 40 32 36C30 30 28 18 26 12C24 8 18 8 14 12Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M26 12C28 10 32 10 34 12" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </svg>
      );
    // Semana 21 – Cenoura
    case 21:
      return (
        <svg {...svgProps}>
          <path d="M24 40L18 18C18 14 20 12 24 12C28 12 30 14 30 18L24 40Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} strokeLinejoin="round" />
          <path d="M22 9C20 6 18 6 18 6" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <path d="M24 12V7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M26 9C28 6 30 6 30 6" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" />
          <path d="M20 22L28 20" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
          <path d="M21 28L27 26" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
        </svg>
      );
    // Semana 22 – Espiga de milho
    case 22:
      return (
        <svg {...svgProps}>
          <path d="M18 12C16 14 16 18 16 24C16 32 18 38 24 40C30 38 32 32 32 24C32 18 32 14 30 12C28 10 20 10 18 12Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M20 8L22 10" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M24 6L24 10" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M28 8L26 10" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M20 18L28 18M20 23L28 23M20 28L28 28M21 33L27 33" stroke={stroke} strokeWidth={1} opacity={0.25} strokeLinecap="round" />
        </svg>
      );
    // Semana 23 – Berinjela
    case 23:
      return (
        <svg {...svgProps}>
          <path d="M24 40C18 40 14 34 14 26C14 18 18 14 22 12C22 12 20 10 22 8C24 6 28 8 28 8C30 10 28 12 28 12C32 14 34 18 34 26C34 34 30 40 24 40Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M22 12L22 8" stroke={stroke} strokeWidth={1.5} opacity={0.4} strokeLinecap="round" />
        </svg>
      );
    // Semana 24 – Régua
    case 24:
      return (
        <svg {...svgProps}>
          <rect x="10" y="16" width="28" height="16" rx="2" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M16 16V22M22 16V24M28 16V22M34 16V20" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
          <text x="15" y="29" fontSize="5" fill={stroke} opacity={0.3} fontFamily="sans-serif">30cm</text>
        </svg>
      );
    // Semana 25 – Espiga de milho grande
    case 25:
      return (
        <svg {...svgProps}>
          <path d="M17 10C15 12 15 17 15 24C15 33 17 39 24 41C31 39 33 33 33 24C33 17 33 12 31 10C29 8 19 8 17 10Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M19 6L21 8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M24 4L24 8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M29 6L27 8" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M19 16L29 16M19 21L29 21M19 26L29 26M20 31L28 31M21 36L27 36" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
        </svg>
      );
    // Semana 26 – Pepino
    case 26:
      return (
        <svg {...svgProps}>
          <path d="M20 8C16 10 14 16 14 24C14 32 16 38 20 40C22 41 26 41 28 40C32 38 34 32 34 24C34 16 32 10 28 8C26 7 22 7 20 8Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 8V5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M20 14C22 16 26 16 28 14" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
        </svg>
      );
    // Semana 27 – Abobrinha
    case 27:
      return (
        <svg {...svgProps}>
          <path d="M20 6C16 8 14 14 14 24C14 34 17 40 22 42C24 43 26 42 28 42C32 40 34 34 34 24C34 14 32 8 28 6C26 5 22 5 20 6Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 6V3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M18 20L30 18" stroke={stroke} strokeWidth={1} opacity={0.15} strokeLinecap="round" />
          <path d="M18 28L30 26" stroke={stroke} strokeWidth={1} opacity={0.15} strokeLinecap="round" />
        </svg>
      );
    // Semana 28 – Colher grande
    case 28:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="14" rx="8" ry="6" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M21 20L22 42" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M27 20L26 42" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M22 42C22 42 24 44 26 42" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
        </svg>
      );
    // Semana 29 – Garrafa PET
    case 29:
      return (
        <svg {...svgProps}>
          <rect x="18" y="16" width="12" height="24" rx="3" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <rect x="20" y="8" width="8" height="8" rx="1" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <rect x="22" y="5" width="4" height="3" rx="1" stroke={stroke} strokeWidth={sw} fill="none" />
          <path d="M20 24L28 24" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
        </svg>
      );
    // Semana 30 – Melão
    case 30:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="25" rx="14" ry="13" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 12V8" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M14 18C18 22 20 30 20 38" stroke={stroke} strokeWidth={1} opacity={0.15} strokeLinecap="round" />
          <path d="M34 18C30 22 28 30 28 38" stroke={stroke} strokeWidth={1} opacity={0.15} strokeLinecap="round" />
          <path d="M24 12C24 12 24 22 24 38" stroke={stroke} strokeWidth={1} opacity={0.15} />
        </svg>
      );
    // Semana 31 – Abóbora alongada
    case 31:
      return (
        <svg {...svgProps}>
          <path d="M24 40C16 40 10 33 10 25C10 17 16 12 24 12C32 12 38 17 38 25C38 33 32 40 24 40Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 12V7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M22 8C20 6 18 7 18 7" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.5} />
          <path d="M16 14C18 20 18 30 16 38" stroke={stroke} strokeWidth={1} opacity={0.12} />
          <path d="M32 14C30 20 30 30 32 38" stroke={stroke} strokeWidth={1} opacity={0.12} />
        </svg>
      );
    // Semana 32 – Melancia pequena
    case 32:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="15" ry="14" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M12 16C16 20 20 28 22 38" stroke={stroke} strokeWidth={1} opacity={0.2} />
          <path d="M36 16C32 20 28 28 26 38" stroke={stroke} strokeWidth={1} opacity={0.2} />
          <path d="M24 10C24 10 24 20 24 38" stroke={stroke} strokeWidth={1} opacity={0.15} />
          <path d="M24 10V7" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    // Semana 33 – Abacaxi
    case 33:
      return (
        <svg {...svgProps}>
          <path d="M18 16C16 20 15 26 16 32C17 38 20 42 24 42C28 42 31 38 32 32C33 26 32 20 30 16C28 13 20 13 18 16Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M20 6L22 13" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M24 4L24 13" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M28 6L26 13" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M17 8L20 13" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M31 8L28 13" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
          <path d="M19 20L29 22M19 26L29 28M20 32L28 34" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
        </svg>
      );
    // Semana 34 – Jaca pequena
    case 34:
      return (
        <svg {...svgProps}>
          <path d="M24 42C17 42 12 35 12 26C12 17 17 10 24 10C31 10 36 17 36 26C36 35 31 42 24 42Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 10V6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M16 18L18 20M32 18L30 20M16 32L18 30M32 32L30 30" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
          <path d="M18 26L30 26" stroke={stroke} strokeWidth={1} opacity={0.12} strokeLinecap="round" />
        </svg>
      );
    // Semana 35 – Jaca média
    case 35:
      return (
        <svg {...svgProps}>
          <path d="M24 43C16 43 11 35 11 25C11 15 16 8 24 8C32 8 37 15 37 25C37 35 32 43 24 43Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 8V4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M15 16L18 19M33 16L30 19M15 34L18 31M33 34L30 31" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
          <path d="M17 25L31 25" stroke={stroke} strokeWidth={1} opacity={0.12} strokeLinecap="round" />
          <path d="M24 12L24 40" stroke={stroke} strokeWidth={1} opacity={0.1} />
        </svg>
      );
    // Semana 36 – Melancia média
    case 36:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="16" ry="15" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M11 15C16 20 20 28 22 39" stroke={stroke} strokeWidth={1} opacity={0.2} />
          <path d="M37 15C32 20 28 28 26 39" stroke={stroke} strokeWidth={1} opacity={0.2} />
          <path d="M24 9L24 39" stroke={stroke} strokeWidth={1} opacity={0.15} />
          <path d="M24 9V6" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    // Semana 37 – Abóbora grande
    case 37:
      return (
        <svg {...svgProps}>
          <path d="M24 42C14 42 8 34 8 24C8 14 14 8 24 8C34 8 40 14 40 24C40 34 34 42 24 42Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 8V4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M22 5C20 3 18 4 18 4" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.5} />
          <path d="M14 10C16 18 16 30 14 40" stroke={stroke} strokeWidth={1} opacity={0.12} />
          <path d="M34 10C32 18 32 30 34 40" stroke={stroke} strokeWidth={1} opacity={0.12} />
          <path d="M24 8L24 42" stroke={stroke} strokeWidth={1} opacity={0.1} />
        </svg>
      );
    // Semana 38 – Jaca grande
    case 38:
      return (
        <svg {...svgProps}>
          <path d="M24 44C15 44 9 35 9 24C9 13 15 6 24 6C33 6 39 13 39 24C39 35 33 44 24 44Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 6V2" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M14 14L17 18M34 14L31 18M14 34L17 30M34 34L31 30" stroke={stroke} strokeWidth={1} opacity={0.2} strokeLinecap="round" />
          <path d="M16 24L32 24" stroke={stroke} strokeWidth={1} opacity={0.1} />
          <path d="M24 10L24 40" stroke={stroke} strokeWidth={1} opacity={0.08} />
        </svg>
      );
    // Semana 39 – Melancia grande
    case 39:
      return (
        <svg {...svgProps}>
          <ellipse cx="24" cy="24" rx="17" ry="16" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M10 13C16 19 20 28 22 40" stroke={stroke} strokeWidth={1.2} opacity={0.2} />
          <path d="M38 13C32 19 28 28 26 40" stroke={stroke} strokeWidth={1.2} opacity={0.2} />
          <path d="M24 8L24 40" stroke={stroke} strokeWidth={1} opacity={0.15} />
          <path d="M24 8V4" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    // Semana 40 – Jaca grande madura
    case 40:
      return (
        <svg {...svgProps}>
          <path d="M24 45C14 45 7 35 7 24C7 13 14 4 24 4C34 4 41 13 41 24C41 35 34 45 24 45Z" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
          <path d="M24 4V1" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <path d="M13 12L17 17M35 12L31 17M13 36L17 31M35 36L31 31" stroke={stroke} strokeWidth={1.2} opacity={0.2} strokeLinecap="round" />
          <path d="M15 24L33 24" stroke={stroke} strokeWidth={1} opacity={0.1} />
          <path d="M24 8L24 42" stroke={stroke} strokeWidth={1} opacity={0.08} />
          <circle cx="24" cy="24" r="4" stroke={stroke} strokeWidth={1} opacity={0.15} />
        </svg>
      );
    default:
      return (
        <svg {...svgProps}>
          <circle cx="24" cy="24" r="10" stroke={stroke} strokeWidth={sw} fill={fill1} fillOpacity={fillOpacity} />
        </svg>
      );
  }
};

export default WeekIcon;
