import React from 'react';
import {
  X,
  BookOpen,
  Users,
  MessageSquare,
  BarChart3,
  Bell,
  Heart,
  Search,
  Filter,
  Settings,
  FolderPlus,
  Star,
  Film,
  Play
} from 'lucide-react';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';
import { ADMIN_AVATAR_OPTIONS } from '../data/adminAvatars';
import { MEMOJI_AVATAR_OPTIONS } from '../data/memojiAvatars';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOpeningVideo?: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen, onClose, onOpenOpeningVideo }) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        className={`relative z-10 w-full max-w-5xl border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between border-b pb-4 mb-6 ${isDark ? 'border-[#163650]' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 font-bold text-sm">
              7
            </div>
            <div>
              <h2 className={`text-xl sm:text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Elementos Visuais (Padrão de Design)
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Guia de identidade visual, logotipo oficial, cores, tipografia, componentes e tags
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition-colors cursor-pointer ${
              isDark
                ? 'bg-[#092032] text-slate-400 hover:text-white border-[#163650]'
                : 'bg-slate-100 text-slate-500 hover:text-slate-900 border-slate-200'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Brand Logo Card */}
        <div className={`p-5 rounded-2xl border mb-8 ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
          <h3 className={`text-sm font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span>Logotipo Oficial da Instituição</span>
          </h3>
          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 rounded-xl border ${
            isDark ? 'bg-[#001424] border-[#163650]' : 'bg-white border-slate-200'
          }`}>
            <Logo size="lg" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F97316]" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Artes e Letras</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#14B8A6]" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Ciência e Pesquisa</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Inovação e Rede</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#2563EB]" />
                <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Esporte e Cultura</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid matching Panel 7 */}
        <div className="space-y-8">
          {/* Row 1: Cores & Tipografia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cores */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Cores do Sistema</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">3 Temas</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { hex: '#0088CC', name: 'Kinetic Cyan' },
                  { hex: '#00A651', name: 'Kinetic Green' },
                  { hex: '#F25622', name: 'Kinetic Orange' },
                  { hex: '#0C1014', name: 'Kinetic Charcoal' },
                  { hex: '#00182A', name: 'Dark Navy' },
                  { hex: '#1DBB64', name: 'Classic Green' },
                  { hex: '#133E4A', name: 'Deep Slate' },
                  { hex: '#EF4444', name: 'Danger Red' },
                ].map((color) => (
                  <div key={color.hex} className="flex flex-col items-center gap-1">
                    <div
                      style={{ backgroundColor: color.hex }}
                      className="w-9 h-9 rounded-full border border-black/10 dark:border-white/20 shadow-md"
                    />
                    <span className={`text-[10px] font-mono font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {color.hex}
                    </span>
                    <span className={`text-[9px] truncate max-w-full ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tipografia */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tipografia</h3>
              <div className="space-y-3 text-left">
                <div>
                  <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Título (Poppins SemiBold)
                  </span>
                  <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Biblioteca Escolar
                  </h4>
                </div>
                <div>
                  <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Subtítulo (Poppins Regular)
                  </span>
                  <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    Conhecimento que transforma.
                  </p>
                </div>
                <div>
                  <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Texto (Poppins Regular)
                  </span>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Este é um exemplo de texto para o sistema da biblioteca escolar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Ícones & Botões */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ícones */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Ícones</h3>
              <div className={`grid grid-cols-5 gap-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {[BookOpen, Users, MessageSquare, BarChart3, Bell, Heart, Search, Filter, Settings, FolderPlus].map((Icon, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-center p-2.5 rounded-xl border ${
                      isDark ? 'bg-[#031320] border-[#163650]' : 'bg-white border-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Botões */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Botões</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-xs font-medium w-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Primário</span>
                  <button className="flex-1 py-2.5 px-4 rounded-xl bg-[#23c65e] text-white text-xs font-semibold shadow-sm cursor-pointer hover:bg-[#1fa950]">
                    Ação principal
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-xs font-medium w-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Secundário</span>
                  <button className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold cursor-pointer ${
                    isDark ? 'bg-[#092032] border-[#163650] text-white hover:bg-[#001424]' : 'bg-slate-100 border-slate-200 text-slate-800 hover:bg-slate-200'
                  }`}>
                    Ação secundária
                  </button>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className={`text-xs font-medium w-20 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Perigo</span>
                  <button className="flex-1 py-2.5 px-4 rounded-xl bg-[#ef4444] text-white text-xs font-semibold shadow-sm cursor-pointer hover:bg-[#dc2626]">
                    Ação de risco
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Cards, Tags/Status & Exemplo de Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Cards</h3>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#031320] border-[#163650]' : 'bg-white border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Título do Card</h4>
                <p className={`text-xs mb-3 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Informações importantes aqui dentro do card.
                </p>
                <span className="text-xs font-semibold text-emerald-500 cursor-pointer hover:underline">
                  Saiba mais
                </span>
              </div>
            </div>

            {/* Tags / Status */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Tags / Status</h3>
              <div className="flex flex-wrap gap-2">
                <span className="bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Disponível
                </span>
                <span className="bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Reservado
                </span>
                <span className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Em andamento
                </span>
                <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Devolvido
                </span>
                <span className="bg-rose-500 text-white text-xs font-semibold px-3 py-1 rounded-md">
                  Atrasado
                </span>
              </div>
            </div>

            {/* Exemplo de Card de Livro matching Panel 7 */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
              <h3 className={`text-sm font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Exemplo de Card de Livro</h3>
              <div className={`p-3 rounded-xl border flex gap-3 items-center ${
                isDark ? 'bg-[#031320] border-[#163650]' : 'bg-white border-slate-200'
              }`}>
                <img
                  src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=150&auto=format&fit=crop&q=80"
                  alt="O Pequeno Príncipe"
                  className="w-14 h-20 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    O Pequeno Príncipe
                  </h4>
                  <span className={`text-[10px] block truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Antoine de Saint-Exupéry
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>4.9 (41)</span>
                  </div>
                  <span className="inline-block mt-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] px-1.5 py-0.5 rounded font-semibold">
                    Disponível
                  </span>
                </div>
              </div>
              <button className="w-full mt-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer transition-colors">
                Ver detalhes
              </button>
            </div>
          </div>

          {/* Row 4: Banco Oficial de 25 Avatares Ilustrados (Grade 5x5) */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>🎨 Banco Oficial de Avatares Ilustrados (25 Personagens)</span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Coleção vetorial em alta resolução com efeito de ampliação (+50%) ao passar o mouse, disponível para estudantes, leitores e equipe.
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 self-start sm:self-auto">
                Grade 5x5 Ativa
              </span>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 gap-3 p-4 rounded-xl border bg-black/20 border-[#163650]/50">
              {ADMIN_AVATAR_OPTIONS.map((avatar, idx) => (
                <div
                  key={avatar.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors group relative"
                  title={`${avatar.name} (${avatar.roleHint})`}
                >
                  <div className="relative">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover shadow-lg student-avatar-zoom cursor-pointer relative transition-transform duration-300 ease-out hover:scale-150 hover:shadow-2xl hover:z-40"
                    />
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-mono px-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-700">
                      #{idx + 1}
                    </span>
                  </div>
                  <span className={`text-[10px] text-center mt-2 font-medium line-clamp-1 max-w-[80px] sm:max-w-[110px] ${
                    isDark ? 'text-slate-400 group-hover:text-emerald-400' : 'text-slate-600 group-hover:text-emerald-600'
                  }`}>
                    {avatar.name.split('(')[0].trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 5: Nova Coleção de 12 Memojis 3D (Grade 4x3) */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>✨ Nova Coleção Oficial de 12 Memojis 3D</span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Avatares tridimensionais expressivos com diversidade cultural, acessórios estilizados e ampliação dinâmica (+50%).
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 self-start sm:self-auto">
                12 Personagens 3D
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3.5 p-4 rounded-xl border bg-black/20 border-[#163650]/50">
              {MEMOJI_AVATAR_OPTIONS.map((avatar, idx) => (
                <div
                  key={avatar.id}
                  className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/5 transition-colors group relative"
                  title={`${avatar.name}: ${avatar.description}`}
                >
                  <div className="relative">
                    <img
                      src={avatar.url}
                      alt={avatar.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-lg student-avatar-zoom cursor-pointer relative transition-transform duration-300 ease-out hover:scale-150 hover:shadow-2xl hover:z-40"
                    />
                    <span className="absolute -bottom-1 -right-1 text-[9px] font-mono px-1 rounded-full bg-purple-950/90 text-purple-300 border border-purple-700">
                      #{idx + 1}
                    </span>
                  </div>
                  <span className={`text-[10px] text-center mt-2 font-medium line-clamp-1 max-w-[90px] sm:max-w-[110px] ${
                    isDark ? 'text-slate-400 group-hover:text-purple-400' : 'text-slate-600 group-hover:text-purple-600'
                  }`}>
                    {avatar.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Row 6: Vídeo de Abertura Oficial do Aplicativo */}
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#092032] border-[#163650]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className={`text-sm font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span>🎬 Vídeo e Vinheta Oficial de Abertura do Aplicativo</span>
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Animação 3D comemorativa com o jovem leitor flutuando entre livros voadores, fitas de luz mágicas e partículas estelares.
                </p>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 self-start sm:self-auto">
                MP4 1080p • 8s
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl border bg-black/30 border-cyan-500/30">
              <div className="relative w-full md:w-80 h-48 rounded-xl overflow-hidden shadow-xl border border-cyan-500/40 group flex-shrink-0">
                <img
                  src="/assets/abertura_cecmq_poster.jpg"
                  alt="Poster Abertura"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  {onOpenOpeningVideo && (
                    <button
                      onClick={onOpenOpeningVideo}
                      className="p-3.5 rounded-full bg-cyan-500 text-[#021726] shadow-[0_0_20px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all cursor-pointer"
                      title="Assistir em Tela Cheia"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[10px] text-cyan-300 font-mono flex items-center justify-between">
                  <span>Abertura Oficial</span>
                  <span>0:08</span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-between h-full space-y-3 text-left w-full">
                <div>
                  <h4 className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'} mb-1`}>
                    Conhecimento também transforma vidas
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Esta vinheta é apresentada aos estudantes e visitantes na primeira inicialização da Biblioteca Maria Quitéria, simbolizando o poder transformador e a alegria da leitura no Colégio Estadual Cel. Maria Quitéria.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {onOpenOpeningVideo && (
                    <button
                      onClick={onOpenOpeningVideo}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold text-[#021726] bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <Film className="w-4 h-4" />
                      <span>Reproduzir Abertura do Aplicativo</span>
                    </button>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">
                    Formato: H.264 / AAC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

