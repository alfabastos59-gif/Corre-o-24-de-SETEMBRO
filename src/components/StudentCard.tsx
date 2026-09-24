import React from 'react';
import { Student } from '../types';
import { generateBarcodeBars, formatStudentRegistration, getStudentBarcodeCode } from '../utils/barcodeGenerator';
import { MapPin, Globe, Instagram, BookOpen, Quote } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  issueDate?: string;
  className?: string;
  scale?: number;
  printMode?: boolean;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  issueDate = '27/05/2025',
  className = '',
  scale = 1,
  printMode = false,
}) => {
  const barcodeText = getStudentBarcodeCode(student);
  const barcodeData = generateBarcodeBars(barcodeText);
  const registrationNumber = formatStudentRegistration(student);

  return (
    <div
      id={`student-card-${student.id}`}
      className={`relative w-[380px] h-[550px] bg-white text-slate-900 rounded-[24px] overflow-hidden shadow-2xl border border-slate-300 flex flex-col justify-between select-none print:shadow-none print:border-slate-400 print:rounded-2xl ${className}`}
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: 'top center',
        pageBreakInside: 'avoid',
      }}
    >
      {/* 1. TOP HEADER - Deep Forest Green with Watermark */}
      <div className="relative bg-[#023d24] text-white px-4 pt-3.5 pb-4 overflow-hidden shrink-0">
        {/* Subtle decorative background watermarks (Books) */}
        <div className="absolute right-2 top-2 opacity-10 pointer-events-none">
          <BookOpen className="w-28 h-28 text-white stroke-[1.2]" />
        </div>
        <div className="absolute right-14 bottom-1 opacity-10 pointer-events-none">
          <BookOpen className="w-16 h-16 text-white stroke-[1.2]" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          {/* Logo 4 Quadrants with Circular Border Text */}
          <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
            {/* SVG Circular Badge */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Outer circular text path */}
              <defs>
                <path
                  id="circlePathTop"
                  d="M 50 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                />
              </defs>
              <circle cx="50" cy="50" r="48" fill="#012b1a" stroke="#22c55e" strokeWidth="1.5" />
              
              {/* Inner 4-piece puzzle emblem */}
              <g transform="translate(18, 18) scale(0.64)">
                {/* Top-Left: Orange */}
                <path
                  d="M 0 0 L 50 0 L 50 20 C 44 20 44 32 50 32 L 50 50 L 32 50 C 32 44 20 44 20 50 L 0 50 Z"
                  fill="#F97316"
                />
                {/* Top-Right: Teal */}
                <path
                  d="M 50 0 L 100 0 L 100 50 L 80 50 C 80 56 68 56 68 50 L 50 50 L 50 32 C 44 32 44 20 50 20 Z"
                  fill="#14B8A6"
                />
                {/* Bottom-Left: Coral Red */}
                <path
                  d="M 0 50 L 20 50 C 20 44 32 44 32 50 L 50 50 L 50 68 C 44 68 44 80 50 80 L 50 100 L 0 100 Z"
                  fill="#EF4444"
                />
                {/* Bottom-Right: Blue */}
                <path
                  d="M 50 50 L 68 50 C 68 56 80 56 80 50 L 100 50 L 100 100 L 50 100 L 50 80 C 44 80 44 68 50 68 Z"
                  fill="#2563EB"
                />
                {/* Icons inside puzzle */}
                {/* Brush */}
                <g transform="translate(18, 14) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" fill="none">
                  <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.375-9.375z" />
                </g>
                {/* Flask */}
                <g transform="translate(62, 13) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" fill="none">
                  <path d="M10 2v7.5L4.5 20a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9.5V2" />
                </g>
                {/* Molecule */}
                <g transform="translate(18, 58) scale(0.65)" stroke="#FFFFFF" strokeWidth="2.2" fill="none">
                  <circle cx="12" cy="5" r="3.5" fill="#FFF" />
                  <circle cx="5" cy="17" r="3.5" fill="#FFF" />
                  <circle cx="19" cy="17" r="3.5" fill="#FFF" />
                  <line x1="12" y1="8.5" x2="6.5" y2="14" stroke="#FFF" />
                  <line x1="12" y1="8.5" x2="17.5" y2="14" stroke="#FFF" />
                </g>
                {/* Ball */}
                <g transform="translate(62, 58) scale(0.65)" stroke="#FFFFFF" strokeWidth="2" fill="none">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="12 7, 16 10, 14.5 15, 9.5 15, 8 10" fill="#FFF" fillOpacity="0.5" />
                </g>
              </g>
            </svg>
          </div>

          {/* Titles */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[17px] font-black tracking-tight leading-tight uppercase font-sans text-white">
              BIBLIOTECA CECMQ - TI
            </h2>
            <p className="text-[9.5px] font-semibold text-slate-100 uppercase tracking-tight leading-tight mt-0.5">
              Colégio Estadual do Campo Maria Quitéria
            </p>
            <p className="text-[10px] font-extrabold text-[#4ade80] tracking-wider uppercase mt-0.5">
              TEMPO INTEGRAL
            </p>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION - Student Details + Avatar + Barcode */}
      <div className="px-4 py-3 bg-white flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-12 gap-3 items-center">
          {/* Left Column: Avatar Frame + Barcode */}
          <div className="col-span-5 flex flex-col items-center justify-center">
            {/* Avatar Frame (Double Emerald Border) */}
            <div className="relative w-28 h-32 rounded-2xl p-1 bg-white border-2 border-[#15803d] ring-2 ring-[#86efac] shadow-sm flex items-center justify-center overflow-hidden">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-full h-full object-cover rounded-xl bg-slate-100"
                crossOrigin="anonymous"
              />
            </div>

            {/* Unique Barcode under Avatar */}
            <div className="w-full mt-2 flex flex-col items-center">
              <svg
                viewBox={`0 0 ${barcodeData.width} 32`}
                className="w-full h-7 block"
                shapeRendering="crispEdges"
              >
                {barcodeData.bars.map((bar, idx) => (
                  <rect
                    key={idx}
                    x={bar.x}
                    y={0}
                    width={bar.width}
                    height={32}
                    fill="#000000"
                  />
                ))}
              </svg>
              <span className="text-[8.5px] font-mono font-bold tracking-widest text-slate-900 mt-0.5">
                {barcodeText}
              </span>
            </div>
          </div>

          {/* Right Column: Student Data */}
          <div className="col-span-7 flex flex-col justify-between pl-1">
            <div>
              <span className="text-[10px] font-bold text-slate-700 tracking-wider block uppercase">
                USUÁRIO(A)
              </span>
              <h3 className="text-[14px] font-black text-slate-950 uppercase leading-tight line-clamp-2 mt-0.5">
                {student.name}
              </h3>
              
              <div className="w-full h-[1.5px] bg-slate-200 my-1.5" />

              <div className="space-y-1 text-[11px] font-medium text-slate-800">
                <p className="flex items-center gap-1">
                  <span className="font-bold text-slate-950 text-[10px]">MATRÍCULA:</span>
                  <span className="font-mono font-bold text-slate-900">{registrationNumber}</span>
                </p>
                <p className="flex items-baseline gap-1">
                  <span className="font-bold text-slate-950 text-[10px]">TURMA:</span>
                  <span className="font-semibold text-slate-800 truncate">{student.class}</span>
                </p>
                <p className="flex items-center gap-1">
                  <span className="font-bold text-slate-950 text-[10px]">DATA DE EMISSÃO:</span>
                  <span className="font-semibold text-slate-700">{issueDate}</span>
                </p>
              </div>
            </div>

            {/* Slogan with Book Icon */}
            <div className="flex items-center gap-2 mt-2.5 pt-1.5 border-t border-slate-100">
              <div className="w-6 h-6 rounded-md bg-emerald-50 flex items-center justify-center text-[#15803d] shrink-0 border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5" />
              </div>
              <div className="text-[8.5px] font-extrabold text-[#023d24] leading-tight uppercase">
                LER TRANSFORMA.<br />CONHECER LIBERTA.
              </div>
            </div>

            {/* Badge: Uso Pessoal e Intransferível */}
            <div className="mt-2.5">
              <div className="bg-[#023d24] text-white text-[8px] font-bold tracking-wide uppercase py-1 px-2.5 rounded-full text-center shadow-xs">
                USO PESSOAL E INTRANSFERÍVEL
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. LOWER SECTION - Rules (Dark Left) + Quote & QR Code (Light Right) */}
      <div className="grid grid-cols-12 border-t border-slate-300 shrink-0 min-h-[145px]">
        {/* Left Box (Dark Forest Green) */}
        <div className="col-span-7 bg-[#023d24] text-white p-2.5 flex flex-col justify-between relative overflow-hidden">
          {/* Watermark Book Icon */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <BookOpen className="w-16 h-16 text-white" />
          </div>

          <div className="relative z-10">
            <h4 className="text-[10.5px] font-black text-[#4ade80] uppercase tracking-wide mb-1 flex items-center gap-1">
              REGRAS DE USO
            </h4>
            <ul className="text-[7.8px] leading-[1.3] text-slate-100 space-y-0.8 font-medium">
              <li className="flex items-start gap-1">
                <span className="text-[#4ade80] font-bold">•</span>
                <span>Esta carteirinha é de uso pessoal e intransferível.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#4ade80] font-bold">•</span>
                <span>Apresente-a sempre que for utilizar os serviços da biblioteca.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#4ade80] font-bold">•</span>
                <span>Cuide bem dos livros e materiais.</span>
              </li>
              <li className="flex items-start gap-1">
                <span className="text-[#4ade80] font-bold">•</span>
                <span>Em caso de perda, comunique à biblioteca.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Box (White/Light) */}
        <div className="col-span-5 bg-slate-50 border-l border-slate-200 p-2 flex flex-col items-center justify-between text-center">
          {/* Quote */}
          <div className="flex items-center gap-0.5 px-1">
            <Quote className="w-3 h-3 text-emerald-700 shrink-0 rotate-180" />
            <p className="text-[7.5px] font-semibold italic text-slate-800 leading-tight">
              A biblioteca é o lugar onde as ideias ganham vida.
            </p>
          </div>

          {/* QR Code SVG */}
          <div className="my-1 flex flex-col items-center">
            <div className="w-14 h-14 bg-white p-1 rounded-md border border-slate-300 shadow-xs flex items-center justify-center">
              <svg viewBox="0 0 29 29" className="w-full h-full" shapeRendering="crispEdges">
                {/* Standard Sharp QR Code Matrix pattern */}
                <rect x="0" y="0" width="29" height="29" fill="#FFFFFF" />
                {/* Position Detection 1 (Top Left) */}
                <rect x="2" y="2" width="7" height="7" fill="#000000" />
                <rect x="3" y="3" width="5" height="5" fill="#FFFFFF" />
                <rect x="4" y="4" width="3" height="3" fill="#000000" />
                {/* Position Detection 2 (Top Right) */}
                <rect x="20" y="2" width="7" height="7" fill="#000000" />
                <rect x="21" y="3" width="5" height="5" fill="#FFFFFF" />
                <rect x="22" y="4" width="3" height="3" fill="#000000" />
                {/* Position Detection 3 (Bottom Left) */}
                <rect x="2" y="20" width="7" height="7" fill="#000000" />
                <rect x="3" y="21" width="5" height="5" fill="#FFFFFF" />
                <rect x="4" y="22" width="3" height="3" fill="#000000" />
                {/* Matrix Data Points */}
                <rect x="11" y="2" width="2" height="2" fill="#000" />
                <rect x="15" y="2" width="2" height="2" fill="#000" />
                <rect x="11" y="6" width="3" height="2" fill="#000" />
                <rect x="16" y="6" width="2" height="2" fill="#000" />
                <rect x="10" y="10" width="2" height="2" fill="#000" />
                <rect x="13" y="10" width="3" height="2" fill="#000" />
                <rect x="17" y="10" width="2" height="2" fill="#000" />
                <rect x="2" y="11" width="2" height="2" fill="#000" />
                <rect x="6" y="11" width="2" height="2" fill="#000" />
                <rect x="11" y="13" width="7" height="2" fill="#000" />
                <rect x="20" y="11" width="2" height="3" fill="#000" />
                <rect x="24" y="11" width="3" height="2" fill="#000" />
                <rect x="10" y="16" width="3" height="2" fill="#000" />
                <rect x="15" y="16" width="2" height="2" fill="#000" />
                <rect x="11" y="20" width="2" height="2" fill="#000" />
                <rect x="15" y="20" width="4" height="2" fill="#000" />
                <rect x="20" y="16" width="3" height="3" fill="#000" />
                <rect x="24" y="17" width="2" height="2" fill="#000" />
                <rect x="20" y="21" width="2" height="4" fill="#000" />
                <rect x="24" y="21" width="3" height="2" fill="#000" />
                <rect x="11" y="24" width="3" height="2" fill="#000" />
                <rect x="16" y="24" width="2" height="2" fill="#000" />
                <rect x="24" y="25" width="2" height="2" fill="#000" />
              </svg>
            </div>
            <span className="text-[7px] font-extrabold text-slate-900 tracking-tight leading-tight uppercase">
              ACESSE NOSSA<br />BIBLIOTECA DIGITAL
            </span>
          </div>
        </div>
      </div>

      {/* 4. FOOTER BAR - Light Green / Sage with Institutional Contact Info */}
      <div className="bg-[#cbd8c6] border-t border-[#aab9a5] px-3 py-1.5 text-[8px] font-semibold text-slate-800 flex items-center justify-between shrink-0">
        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#023d24] shrink-0" />
          <span className="leading-tight text-[7.5px]">
            Distrito de Maria Quitéria<br />Feira de Santana - BA
          </span>
        </div>

        {/* Links: Web + Insta */}
        <div className="flex flex-col text-[7.5px] leading-tight">
          <div className="flex items-center gap-1 text-slate-900">
            <Globe className="w-2.5 h-2.5 text-[#023d24]" />
            <span>cecmq.educacao.ba.gov.br</span>
          </div>
          <div className="flex items-center gap-1 text-slate-900 mt-0.5">
            <Instagram className="w-2.5 h-2.5 text-[#023d24]" />
            <span>cecmq_mariaquiteria</span>
          </div>
        </div>

        {/* Right Label */}
        <div className="text-right text-[7.5px] font-extrabold text-[#023d24] leading-tight">
          TEMPO INTEGRAL<br />FEIRA DE SANTANA - BA
        </div>
      </div>
    </div>
  );
};
