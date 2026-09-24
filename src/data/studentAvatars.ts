/**
 * 16 Avatares Oficiais de Estudantes da Biblioteca Maria Quitéria
 * Baseados nas ilustrações da grade 4x4 fornecida pelo usuário.
 * Renderizados em SVG nativo de alta resolução, super leves, nítidos e com animação de zoom ao passar o mouse.
 */

export interface StudentAvatar {
  id: string;
  name: string;
  description: string;
  category: 'escola' | 'estudantes';
  bgColor: string;
  url: string;
}

const encodeSvg = (svg: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// 1. Menina Cabelo Preto Liso & Camisa Vermelha / Gola Branca (Fundo Pêssego)
const SVG_01 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#FED7AA" stroke="#FDBA74" stroke-width="4"/>
  <!-- Corpo / Roupa -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#EF4444"/>
  <!-- Gola Peter Pan Branca -->
  <path d="M80 145 C80 162, 98 162, 100 152 C102 162, 120 162, 120 145 C110 145, 90 145, 80 145 Z" fill="#FFFFFF"/>
  <!-- Pescoço -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <!-- Cabelo Atrás -->
  <path d="M48 90 C45 140, 60 155, 75 155 C70 120, 130 120, 125 155 C140 155, 155 140, 152 90 C150 45, 50 45, 48 90 Z" fill="#1C1917"/>
  <!-- Rosto -->
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <!-- Orelhas -->
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas Coradas -->
  <circle cx="72" cy="114" r="7" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="114" r="7" fill="#FDA4AF" opacity="0.6"/>
  <!-- Olhos -->
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="76" cy="95" r="3" fill="#FFFFFF"/>
  <circle cx="81" cy="101" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="120" cy="95" r="3" fill="#FFFFFF"/>
  <circle cx="125" cy="101" r="1.5" fill="#FFFFFF"/>
  <!-- Sobrancelhas -->
  <path d="M70 85 Q78 80 86 86" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M114 86 Q122 80 130 85" stroke="#1C1917" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Nariz -->
  <path d="M98 106 Q100 109 102 106" stroke="#FDBA74" stroke-width="2" fill="none" stroke-linecap="round"/>
  <!-- Sorriso -->
  <path d="M84 116 Q100 134 116 116 Z" fill="#DC2626"/>
  <path d="M88 117 Q100 126 112 117 Z" fill="#FFFFFF"/>
  <!-- Franja Cabelo Preto -->
  <path d="M50 82 C55 52, 90 44, 100 44 C110 44, 145 52, 150 82 C145 70, 130 72, 120 68 C110 74, 90 74, 80 68 C70 72, 55 70, 50 82 Z" fill="#1C1917"/>
</svg>`;

// 2. Menino Loiro Cabelo Claro Repicado (Fundo Azul Claro)
const SVG_02 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#38BDF8" stroke="#0284C7" stroke-width="4"/>
  <!-- Roupa Branca com Gola Azul -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#FFFFFF"/>
  <path d="M85 145 C85 160, 115 160, 115 145 Z" fill="#0284C7"/>
  <!-- Pescoço -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <!-- Rosto -->
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas -->
  <circle cx="72" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <!-- Olhos Azuis Brilhantes -->
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#0284C7"/>
  <ellipse cx="78" cy="98" rx="5" ry="6" fill="#0F172A"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#0284C7"/>
  <ellipse cx="122" cy="98" rx="5" ry="6" fill="#0F172A"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sobrancelhas Loiro Castanho -->
  <path d="M70 84 Q78 78 86 83" stroke="#B45309" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M114 83 Q122 78 130 84" stroke="#B45309" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Sorriso Alegre Aberto -->
  <path d="M82 114 Q100 134 118 114 Z" fill="#DC2626"/>
  <path d="M86 115 Q100 124 114 115 Z" fill="#FFFFFF"/>
  <!-- Cabelo Loiro / Castanho Claro Repicado -->
  <path d="M52 82 C50 48, 80 40, 100 40 C125 40, 148 48, 148 82 C140 68, 132 75, 125 66 C115 72, 108 62, 98 70 C88 62, 78 72, 68 66 C60 74, 55 68, 52 82 Z" fill="#D97706"/>
  <path d="M65 52 L75 42 L80 50 L95 38 L102 48 L118 38 L122 48 L135 44 L142 56" stroke="#B45309" stroke-width="2" fill="none"/>
</svg>`;

// 3. Menina Ruiva com Tranças & Laços Verdes (Fundo Pêssego/Laranja)
const SVG_03 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#FED7AA" stroke="#FB923C" stroke-width="4"/>
  <!-- Tranças Longas Caindo -->
  <path d="M60 110 C50 140, 52 175, 62 195 C68 185, 68 140, 72 110 Z" fill="#EA580C"/>
  <path d="M140 110 C150 140, 148 175, 138 195 C132 185, 132 140, 128 110 Z" fill="#EA580C"/>
  <!-- Lacinhos Verdes nas Tranças -->
  <circle cx="62" cy="178" r="6" fill="#16A34A"/>
  <circle cx="138" cy="178" r="6" fill="#16A34A"/>
  <!-- Corpo / Roupa Laranja & Gola Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#F97316"/>
  <path d="M85 145 C85 162, 115 162, 115 145 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Sardas e Bochechas -->
  <circle cx="72" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="86" cy="110" r="1.5" fill="#C2410C"/>
  <circle cx="90" cy="112" r="1.5" fill="#C2410C"/>
  <circle cx="110" cy="112" r="1.5" fill="#C2410C"/>
  <circle cx="114" cy="110" r="1.5" fill="#C2410C"/>
  <!-- Olhos Verdes -->
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#16A34A"/>
  <ellipse cx="78" cy="98" rx="5" ry="6" fill="#064E3B"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#16A34A"/>
  <ellipse cx="122" cy="98" rx="5" ry="6" fill="#064E3B"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso Doce -->
  <path d="M86 116 Q100 130 114 116" stroke="#9A3412" stroke-width="3" fill="none" stroke-linecap="round"/>
  <!-- Cabelo Ruivo com Franja Repartida -->
  <path d="M48 85 C46 45, 80 40, 100 40 C120 40, 154 45, 152 85 C146 72, 128 65, 108 76 C100 68, 92 68, 84 76 C72 65, 54 72, 48 85 Z" fill="#EA580C"/>
</svg>`;

// 4. Menina Negra com Cabelo Afro Volumoso Cacheado (Fundo Amarelo Alaranjado)
const SVG_04 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#F59E0B" stroke="#D97706" stroke-width="4"/>
  <!-- Cabelo Afro Volumoso Encaracolado Atrás -->
  <circle cx="60" cy="70" r="28" fill="#3B2616"/>
  <circle cx="140" cy="70" r="28" fill="#3B2616"/>
  <circle cx="100" cy="52" r="32" fill="#3B2616"/>
  <circle cx="50" cy="105" r="26" fill="#3B2616"/>
  <circle cx="150" cy="105" r="26" fill="#3B2616"/>
  <!-- Roupa Preta com Gola Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#1E293B"/>
  <path d="M82 145 C82 162, 118 162, 118 145 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto Tom de Pele Escura Suave -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#8D5B4C"/>
  <ellipse cx="100" cy="104" rx="46" ry="42" fill="#A26A58"/>
  <circle cx="54" cy="106" r="10" fill="#A26A58"/>
  <circle cx="146" cy="106" r="10" fill="#A26A58"/>
  <!-- Bochechas Coradas -->
  <circle cx="72" cy="116" r="7" fill="#E11D48" opacity="0.4"/>
  <circle cx="128" cy="116" r="7" fill="#E11D48" opacity="0.4"/>
  <!-- Olhos Castanhos Grandes e Expressivos -->
  <ellipse cx="78" cy="100" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="75" cy="96" r="3" fill="#FFFFFF"/>
  <circle cx="80" cy="103" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="122" cy="100" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="119" cy="96" r="3" fill="#FFFFFF"/>
  <circle cx="124" cy="103" r="1.5" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M84 118 Q100 134 116 118 Z" fill="#BE123C"/>
  <path d="M88 119 Q100 126 112 119 Z" fill="#FFFFFF"/>
  <!-- Franja Afro Frontal -->
  <circle cx="80" cy="72" r="16" fill="#3B2616"/>
  <circle cx="100" cy="68" r="18" fill="#3B2616"/>
  <circle cx="120" cy="72" r="16" fill="#3B2616"/>
</svg>`;

// 5. Menino Ruivo com Cabelo Laranja Arrepiado & Camiseta Azul (Fundo Verde)
const SVG_05 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#22C55E" stroke="#16A34A" stroke-width="4"/>
  <!-- Camiseta Azul Céu -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#0284C7"/>
  <path d="M85 145 C85 158, 115 158, 115 145 Z" fill="#38BDF8"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas -->
  <circle cx="72" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <!-- Olhos Verdes Vivos -->
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#15803D"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#15803D"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M82 114 Q100 134 118 114 Z" fill="#DC2626"/>
  <path d="M86 115 Q100 124 114 115 Z" fill="#FFFFFF"/>
  <!-- Cabelo Laranja Arrepiado -->
  <path d="M50 85 C45 45, 75 35, 100 35 C125 35, 155 45, 150 85 C142 70, 135 78, 126 65 C116 75, 108 62, 98 72 C88 62, 78 74, 68 65 C60 76, 54 70, 50 85 Z" fill="#F97316"/>
  <polygon points="90,40 100,24 110,40" fill="#F97316"/>
  <polygon points="70,48 80,32 88,48" fill="#F97316"/>
  <polygon points="112,48 120,32 130,48" fill="#F97316"/>
</svg>`;

// 6. Menino Negro Cabelo Crespo Curto & Camisa Laranja de Gola (Fundo Bege)
const SVG_06 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#FED7AA" stroke="#FDBA74" stroke-width="4"/>
  <!-- Camisa Laranja com Gola Branca Pontuda -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#EA580C"/>
  <polygon points="100,160 82,145 100,148 118,145" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto Tom Café -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#8D5B4C"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#A26A58"/>
  <circle cx="54" cy="104" r="10" fill="#A26A58"/>
  <circle cx="146" cy="104" r="10" fill="#A26A58"/>
  <!-- Bochechas -->
  <circle cx="72" cy="115" r="7" fill="#E11D48" opacity="0.4"/>
  <circle cx="128" cy="115" r="7" fill="#E11D48" opacity="0.4"/>
  <!-- Olhos Castanhos Expressivos -->
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <circle cx="80" cy="102" r="1.5" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <circle cx="124" cy="102" r="1.5" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M82 114 Q100 134 118 114 Z" fill="#991B1B"/>
  <path d="M86 115 Q100 125 114 115 Z" fill="#FFFFFF"/>
  <!-- Cabelo Crespo Curto e Encaracolado no Topo -->
  <path d="M54 82 C50 48, 75 42, 100 42 C125 42, 150 48, 146 82 C140 70, 130 76, 120 68 C110 74, 100 68, 90 74 C80 68, 70 76, 64 70 C58 78, 54 80, 54 82 Z" fill="#292524"/>
  <circle cx="85" cy="50" r="10" fill="#292524"/>
  <circle cx="100" cy="46" r="11" fill="#292524"/>
  <circle cx="115" cy="50" r="10" fill="#292524"/>
</svg>`;

// 7. Menina com Rabo de Cavalo Lateral Castanho & Blusa Laranja (Fundo Azul)
const SVG_07 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#38BDF8" stroke="#0284C7" stroke-width="4"/>
  <!-- Rabo de Cavalo Lateral Levantado à Direita -->
  <path d="M135 70 C165 50, 175 75, 170 95 C160 110, 145 95, 135 80 Z" fill="#78350F"/>
  <circle cx="138" cy="74" r="7" fill="#0284C7"/>
  <!-- Corpo / Roupa Laranja com Gola Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#F97316"/>
  <path d="M82 145 C82 162, 118 162, 118 145 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas Coradas -->
  <circle cx="72" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <!-- Olhos Castanhos -->
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M84 116 Q100 134 116 116 Z" fill="#DC2626"/>
  <path d="M88 117 Q100 126 112 117 Z" fill="#FFFFFF"/>
  <!-- Cabelo Castanho com Franja Lateral -->
  <path d="M48 85 C46 45, 80 40, 100 40 C125 40, 152 48, 150 85 C142 72, 126 66, 110 74 C96 66, 78 68, 64 74 C54 78, 50 82, 48 85 Z" fill="#78350F"/>
</svg>`;

// 8. Menina Loira com Marias-Chiquinhas Duplas & Blusa Listrada Azul (Fundo Vermelho)
const SVG_08 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#EF4444" stroke="#DC2626" stroke-width="4"/>
  <!-- Marias-Chiquinhas Duplas Onduladas -->
  <path d="M55 75 C30 65, 20 90, 25 110 C35 115, 48 100, 55 85 Z" fill="#FBBF24"/>
  <path d="M145 75 C170 65, 180 90, 175 110 C165 115, 152 100, 145 85 Z" fill="#FBBF24"/>
  <circle cx="52" cy="80" r="6" fill="#3B82F6"/>
  <circle cx="148" cy="80" r="6" fill="#3B82F6"/>
  <!-- Roupa Listrada Azul e Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#3B82F6"/>
  <path d="M52 165 Q100 160 148 165 L145 175 Q100 170 55 175 Z" fill="#FFFFFF"/>
  <path d="M58 185 Q100 180 142 185 L140 195 Q100 190 60 195 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Brincos Vermelhos -->
  <circle cx="54" cy="112" r="3.5" fill="#EF4444"/>
  <circle cx="146" cy="112" r="3.5" fill="#EF4444"/>
  <!-- Bochechas & Olhos Azuis -->
  <circle cx="72" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#0284C7"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#0284C7"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M84 116 Q100 134 116 116 Z" fill="#DC2626"/>
  <path d="M88 117 Q100 126 112 117 Z" fill="#FFFFFF"/>
  <!-- Franja Loira -->
  <path d="M50 82 C55 52, 85 42, 100 42 C115 42, 145 52, 150 82 C142 70, 130 72, 120 66 C110 74, 90 74, 80 66 C70 72, 58 70, 50 82 Z" fill="#FBBF24"/>
</svg>`;

// 9. Menino com Óculos Verdes Redondos & Gravata Borboleta (Fundo Laranja/Vermelho)
const SVG_09 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#EA580C" stroke="#C2410C" stroke-width="4"/>
  <!-- Camisa Azul e Gravata Borboleta Preta -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#0284C7"/>
  <!-- Gola Branca e Gravata Borboleta -->
  <polygon points="82,145 100,154 118,145 100,147" fill="#FFFFFF"/>
  <polygon points="90,156 100,162 90,168" fill="#1E293B"/>
  <polygon points="110,156 100,162 110,168" fill="#1E293B"/>
  <circle cx="100" cy="162" r="3" fill="#1E293B"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas Coradas -->
  <circle cx="72" cy="116" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="116" r="6" fill="#FDA4AF" opacity="0.6"/>
  <!-- Olhos Felizes -->
  <ellipse cx="78" cy="98" rx="6" ry="8" fill="#1C1917"/>
  <circle cx="76" cy="95" r="2.5" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="6" ry="8" fill="#1C1917"/>
  <circle cx="120" cy="95" r="2.5" fill="#FFFFFF"/>
  <!-- Grandes Óculos Redondos Verdes -->
  <circle cx="78" cy="98" r="16" fill="none" stroke="#22C55E" stroke-width="4.5"/>
  <circle cx="122" cy="98" r="16" fill="none" stroke="#22C55E" stroke-width="4.5"/>
  <line x1="94" y1="98" x2="106" y2="98" stroke="#22C55E" stroke-width="4.5"/>
  <!-- Sorriso -->
  <path d="M84 118 Q100 134 116 118 Z" fill="#DC2626"/>
  <path d="M88 119 Q100 126 112 119 Z" fill="#FFFFFF"/>
  <!-- Cabelo Preto com Mecha Espetada no Topo -->
  <path d="M50 82 C50 48, 80 42, 100 42 C120 42, 150 48, 150 82 C140 70, 130 76, 120 68 C110 74, 90 74, 80 68 C70 76, 60 70, 50 82 Z" fill="#1C1917"/>
  <path d="M96 42 Q100 25 106 38 Q102 38 98 42 Z" fill="#1C1917"/>
</svg>`;

// 10. Menino Cabelo Castanho & Blusa Listrada Laranja (Fundo Verde)
const SVG_10 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#22C55E" stroke="#16A34A" stroke-width="4"/>
  <!-- Camiseta Listrada Laranja e Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#F97316"/>
  <path d="M52 165 Q100 160 148 165 L145 175 Q100 170 55 175 Z" fill="#FFFFFF"/>
  <path d="M58 185 Q100 180 142 185 L140 195 Q100 190 60 195 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas & Olhos Castanhos -->
  <circle cx="72" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#451A03"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#451A03"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M84 115 Q100 132 116 115 Z" fill="#DC2626"/>
  <path d="M88 116 Q100 124 112 116 Z" fill="#FFFFFF"/>
  <!-- Cabelo Castanho com Franja Partida -->
  <path d="M50 82 C48 48, 80 40, 100 40 C125 40, 150 48, 150 82 C142 70, 130 76, 118 66 C105 76, 92 68, 80 74 C70 66, 58 72, 50 82 Z" fill="#78350F"/>
</svg>`;

// 11. Menino Topete Castanho Escuro & Camisa Azul (Fundo Âmbar/Laranja)
const SVG_11 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#F59E0B" stroke="#D97706" stroke-width="4"/>
  <!-- Camisa Azul com Gola Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#0284C7"/>
  <polygon points="85,145 100,158 115,145 100,148" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="104" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="106" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="106" r="10" fill="#FFEDD5"/>
  <!-- Bochechas & Olhos Azuis Grandes -->
  <circle cx="72" cy="116" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="116" r="6" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="100" rx="8" ry="10" fill="#0284C7"/>
  <circle cx="75" cy="97" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="100" rx="8" ry="10" fill="#0284C7"/>
  <circle cx="119" cy="97" r="3" fill="#FFFFFF"/>
  <!-- Sorriso Confiante -->
  <path d="M84 118 Q100 134 116 118 Z" fill="#DC2626"/>
  <path d="M88 119 Q100 126 112 119 Z" fill="#FFFFFF"/>
  <!-- Topete Alto Castanho Penteado para Cima -->
  <path d="M52 82 C50 35, 75 22, 100 22 C125 22, 148 35, 148 82 C140 72, 130 75, 120 68 C110 74, 90 74, 80 68 C70 75, 60 72, 52 82 Z" fill="#451A03"/>
</svg>`;

// 12. Menina Coques Duplos / Pufes Altos & Blusa Listrada Vermelha (Fundo Azul Claro)
const SVG_12 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#38BDF8" stroke="#0284C7" stroke-width="4"/>
  <!-- Dois Coques Altos Laterais com Laços Vermelhos -->
  <circle cx="50" cy="55" r="20" fill="#1C1917"/>
  <circle cx="150" cy="55" r="20" fill="#1C1917"/>
  <circle cx="58" cy="68" r="6" fill="#EF4444"/>
  <circle cx="142" cy="68" r="6" fill="#EF4444"/>
  <!-- Roupa Listrada Vermelha e Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#EF4444"/>
  <path d="M52 165 Q100 160 148 165 L145 175 Q100 170 55 175 Z" fill="#FFFFFF"/>
  <path d="M58 185 Q100 180 142 185 L140 195 Q100 190 60 195 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas & Olhos Pretos Vivos -->
  <circle cx="72" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="6" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso -->
  <path d="M84 116 Q100 134 116 116 Z" fill="#DC2626"/>
  <path d="M88 117 Q100 126 112 117 Z" fill="#FFFFFF"/>
  <!-- Franja Cabelo Preto -->
  <path d="M52 80 C55 52, 85 45, 100 45 C115 45, 145 52, 148 80 C140 70, 130 72, 120 66 C110 74, 90 74, 80 66 C70 72, 60 70, 52 80 Z" fill="#1C1917"/>
</svg>`;

// 13. Menino Negro Black Power Alto & Camiseta Laranja (Fundo Verde Esmeralda)
const SVG_13 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#10B981" stroke="#059669" stroke-width="4"/>
  <!-- Cabelo Afro Alto no Topo -->
  <circle cx="100" cy="50" r="34" fill="#1C1917"/>
  <circle cx="70" cy="65" r="26" fill="#1C1917"/>
  <circle cx="130" cy="65" r="26" fill="#1C1917"/>
  <!-- Camiseta Laranja Coral -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#F97316"/>
  <path d="M85 145 C85 158, 115 158, 115 145 Z" fill="#EA580C"/>
  <!-- Pescoço & Rosto Tom de Pele Escura -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#8D5B4C"/>
  <ellipse cx="100" cy="104" rx="46" ry="42" fill="#A26A58"/>
  <circle cx="54" cy="106" r="10" fill="#A26A58"/>
  <circle cx="146" cy="106" r="10" fill="#A26A58"/>
  <!-- Bochechas Coradas -->
  <circle cx="72" cy="116" r="7" fill="#E11D48" opacity="0.4"/>
  <circle cx="128" cy="116" r="7" fill="#E11D48" opacity="0.4"/>
  <!-- Olhos e Sorriso Espetacular -->
  <ellipse cx="78" cy="100" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="75" cy="97" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="100" rx="8" ry="10" fill="#1C1917"/>
  <circle cx="119" cy="97" r="3" fill="#FFFFFF"/>
  <!-- Sorriso Aberto e Alegre -->
  <path d="M82 116 Q100 136 118 116 Z" fill="#991B1B"/>
  <path d="M86 117 Q100 127 114 117 Z" fill="#FFFFFF"/>
</svg>`;

// 14. Menina Ruiva Laço Verde & Blusa Verde (Fundo Azul Piscina)
const SVG_14 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#0EA5E9" stroke="#0284C7" stroke-width="4"/>
  <!-- Rabo de Cavalo Lateral Ruivo à Esquerda com Laço Verde -->
  <path d="M65 70 C35 50, 25 75, 30 95 C40 110, 55 95, 65 80 Z" fill="#EA580C"/>
  <circle cx="62" cy="74" r="8" fill="#16A34A"/>
  <!-- Roupa Verde com Gola Branca -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#16A34A"/>
  <path d="M82 145 C82 162, 118 162, 118 145 Z" fill="#FFFFFF"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas & Olhos Verdes Grandes -->
  <circle cx="72" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#16A34A"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#16A34A"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso Aberto -->
  <path d="M84 116 Q100 134 116 116 Z" fill="#DC2626"/>
  <path d="M88 117 Q100 126 112 117 Z" fill="#FFFFFF"/>
  <!-- Cabelo Ruivo Franja -->
  <path d="M50 82 C55 48, 85 40, 100 40 C125 40, 152 48, 150 82 C140 70, 126 66, 110 74 C96 66, 78 68, 64 74 C56 78, 52 80, 50 82 Z" fill="#EA580C"/>
</svg>`;

// 15. Menina Cabelo Preto Ondulado Longo & Blusa Azul (Fundo Escuro)
const SVG_15 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#1E293B" stroke="#0F172A" stroke-width="4"/>
  <!-- Cabelo Preto Ondulado Longo Caindo pelos Ombros -->
  <path d="M45 90 C35 130, 42 165, 58 190 C68 180, 68 140, 72 105 Z" fill="#0F172A"/>
  <path d="M155 90 C165 130, 158 165, 142 190 C132 180, 132 140, 128 105 Z" fill="#0F172A"/>
  <!-- Blusa Azul com Gola Peter Pan Preta -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#0284C7"/>
  <path d="M82 145 C82 162, 118 162, 118 145 Z" fill="#0F172A"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas & Olhos Azuis Escuros Marcantes -->
  <circle cx="72" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#0369A1"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#0369A1"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso Elegante -->
  <path d="M84 116 Q100 134 116 116 Z" fill="#BE123C"/>
  <path d="M88 117 Q100 126 112 117 Z" fill="#FFFFFF"/>
  <!-- Topo do Cabelo Preto com Curvas Onduladas -->
  <path d="M46 85 C44 45, 78 40, 100 40 C122 40, 156 45, 154 85 C146 72, 130 65, 110 75 C96 66, 78 68, 64 75 C54 78, 48 80, 46 85 Z" fill="#0F172A"/>
</svg>`;

// 16. Menino Cabelo Castanho Curto & Colete Preto com Camisa Branca (Fundo Laranja)
const SVG_16 = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%">
  <circle cx="100" cy="100" r="98" fill="#F59E0B" stroke="#D97706" stroke-width="4"/>
  <!-- Roupa: Camisa Branca com Colete Preto / Suspensórios -->
  <path d="M45 195 C45 155, 75 145, 100 145 C125 145, 155 155, 155 195 Z" fill="#FFFFFF"/>
  <!-- Colete Preto -->
  <path d="M45 195 C45 160, 65 150, 75 150 L75 195 Z" fill="#1C1917"/>
  <path d="M155 195 C155 160, 135 150, 125 150 L125 195 Z" fill="#1C1917"/>
  <!-- Pescoço & Rosto -->
  <path d="M86 130 L114 130 L114 148 L86 148 Z" fill="#FED7AA"/>
  <ellipse cx="100" cy="102" rx="46" ry="42" fill="#FFEDD5"/>
  <circle cx="54" cy="104" r="10" fill="#FFEDD5"/>
  <circle cx="146" cy="104" r="10" fill="#FFEDD5"/>
  <!-- Bochechas & Olhos Castanhos Expressivos -->
  <circle cx="72" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <circle cx="128" cy="115" r="7" fill="#FDA4AF" opacity="0.6"/>
  <ellipse cx="78" cy="98" rx="8" ry="10" fill="#451A03"/>
  <circle cx="75" cy="95" r="3" fill="#FFFFFF"/>
  <ellipse cx="122" cy="98" rx="8" ry="10" fill="#451A03"/>
  <circle cx="119" cy="95" r="3" fill="#FFFFFF"/>
  <!-- Sorriso com Dentes de Criança -->
  <path d="M82 114 Q100 134 118 114 Z" fill="#DC2626"/>
  <path d="M86 115 Q100 124 114 115 Z" fill="#FFFFFF"/>
  <!-- Cabelo Castanho Curto com Pequena Mecha Central -->
  <path d="M50 82 C48 48, 80 42, 100 42 C125 42, 150 48, 150 82 C140 70, 130 76, 120 68 C110 74, 90 74, 80 68 C70 76, 60 70, 50 82 Z" fill="#78350F"/>
  <path d="M96 42 Q100 28 104 42 Z" fill="#78350F"/>
</svg>`;

export const OFFICIAL_STUDENT_AVATARS: StudentAvatar[] = [
  {
    id: 'avatar-estudante-01',
    name: 'Menina Cabelo Preto & Gola Peter Pan',
    description: 'Fundo pêssego, cabelo liso chanel e camisa vermelha',
    category: 'escola',
    bgColor: '#FED7AA',
    url: encodeSvg(SVG_01),
  },
  {
    id: 'avatar-estudante-02',
    name: 'Menino Loiro Cabelo Repicado',
    description: 'Fundo azul celeste, olhos azuis e sorriso alegre',
    category: 'escola',
    bgColor: '#38BDF8',
    url: encodeSvg(SVG_02),
  },
  {
    id: 'avatar-estudante-03',
    name: 'Menina Ruiva com Tranças & Laços Verdes',
    description: 'Fundo pêssego, tranças compridas e olhos verdes',
    category: 'escola',
    bgColor: '#FED7AA',
    url: encodeSvg(SVG_03),
  },
  {
    id: 'avatar-estudante-04',
    name: 'Menina Negra Cabelo Cacheado Afro',
    description: 'Fundo âmbar, vestido preto com gola branca',
    category: 'escola',
    bgColor: '#F59E0B',
    url: encodeSvg(SVG_04),
  },
  {
    id: 'avatar-estudante-05',
    name: 'Menino Ruivo Arrepiado',
    description: 'Fundo verde vibrante, olhos verdes e camisa azul',
    category: 'escola',
    bgColor: '#22C55E',
    url: encodeSvg(SVG_05),
  },
  {
    id: 'avatar-estudante-06',
    name: 'Menino Moreno Sorridente',
    description: 'Fundo pêssego, cabelo crespo e camisa polo laranja',
    category: 'escola',
    bgColor: '#FED7AA',
    url: encodeSvg(SVG_06),
  },
  {
    id: 'avatar-estudante-07',
    name: 'Menina Rabo de Cavalo Castanho',
    description: 'Fundo azul piscina, rabo de cavalo lateral e blusa laranja',
    category: 'escola',
    bgColor: '#38BDF8',
    url: encodeSvg(SVG_07),
  },
  {
    id: 'avatar-estudante-08',
    name: 'Menina Loira Maria-Chiquinha',
    description: 'Fundo vermelho, blusa listrada azul e brincos vermelhos',
    category: 'escola',
    bgColor: '#EF4444',
    url: encodeSvg(SVG_08),
  },
  {
    id: 'avatar-estudante-09',
    name: 'Menino Óculos Verdes & Gravata Borboleta',
    description: 'Fundo laranja, óculos redondos e gravata borboleta preta',
    category: 'escola',
    bgColor: '#EA580C',
    url: encodeSvg(SVG_09),
  },
  {
    id: 'avatar-estudante-10',
    name: 'Menino Blusa Listrada Laranja',
    description: 'Fundo verde esmeralda, cabelo castanho clássico',
    category: 'escola',
    bgColor: '#22C55E',
    url: encodeSvg(SVG_10),
  },
  {
    id: 'avatar-estudante-11',
    name: 'Menino Topete Castanho',
    description: 'Fundo âmbar, topete penteado e olhos azuis expressivos',
    category: 'escola',
    bgColor: '#F59E0B',
    url: encodeSvg(SVG_11),
  },
  {
    id: 'avatar-estudante-12',
    name: 'Menina Coques Duplos & Laços Vermelhos',
    description: 'Fundo azul claro, dois coques altos e blusa listrada vermelha',
    category: 'escola',
    bgColor: '#38BDF8',
    url: encodeSvg(SVG_12),
  },
  {
    id: 'avatar-estudante-13',
    name: 'Menino Black Power Alto',
    description: 'Fundo verde esmeralda, corte black power e sorriso contagiante',
    category: 'escola',
    bgColor: '#10B981',
    url: encodeSvg(SVG_13),
  },
  {
    id: 'avatar-estudante-14',
    name: 'Menina Ruiva Laço Verde',
    description: 'Fundo azul piscina, laço de fita verde e vestido escolar',
    category: 'escola',
    bgColor: '#0EA5E9',
    url: encodeSvg(SVG_14),
  },
  {
    id: 'avatar-estudante-15',
    name: 'Menina Cabelo Longo Ondulado',
    description: 'Fundo ardósia escuro, cabelo longo e blusa azul',
    category: 'escola',
    bgColor: '#1E293B',
    url: encodeSvg(SVG_15),
  },
  {
    id: 'avatar-estudante-16',
    name: 'Menino Sorridente Colete Preto',
    description: 'Fundo mostarda, colete preto, camisa social e sorriso aberto',
    category: 'escola',
    bgColor: '#F59E0B',
    url: encodeSvg(SVG_16),
  },
];

export const getStudentAvatarById = (id: string): StudentAvatar => {
  return OFFICIAL_STUDENT_AVATARS.find((a) => a.id === id) || OFFICIAL_STUDENT_AVATARS[0];
};

export const getRandomStudentAvatar = (): string => {
  const index = Math.floor(Math.random() * OFFICIAL_STUDENT_AVATARS.length);
  return OFFICIAL_STUDENT_AVATARS[index].url;
};
