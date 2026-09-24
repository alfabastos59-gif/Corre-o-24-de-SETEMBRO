import React from 'react';
import { ActiveTab } from '../types';
import { Logo } from './Logo';
import { useTheme } from '../context/ThemeContext';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDesignSystem: () => void;
  onOpenAccessibility?: () => void;
  onOpenOpeningVideo?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  onOpenDesignSystem,
  onOpenAccessibility,
  onOpenOpeningVideo,
}) => {
  const { isDark } = useTheme();

  return (
    <footer
      className={`border-t pt-12 pb-8 text-xs transition-colors ${
        isDark ? 'bg-[#031320] border-[#163650] text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div
              onClick={() => setActiveTab('inicio')}
              className="cursor-pointer group inline-block"
            >
              <Logo size="sm" />
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Sistema escolar integrado de acervo literário, empréstimos e incentivo à leitura.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Navegação
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('inicio')}
                  className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('catalogo')}
                  className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Catálogo Completo
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('ranking')}
                  className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Ranking & Mais Lidos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('emprestimos')}
                  className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Controle de Empréstimos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('sugestoes')}
                  className={`hover:text-emerald-500 transition-colors cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Sugerir Livro
                </button>
              </li>
            </ul>
          </div>

          {/* Painéis e Telas */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Módulos do Sistema
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`hover:text-emerald-500 transition-colors text-left cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Painel Administrativo
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('relatorios')}
                  className={`hover:text-emerald-500 transition-colors text-left cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Relatórios e Estatísticas
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('mobile_view')}
                  className={`hover:text-emerald-500 transition-colors text-left cursor-pointer ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                >
                  Visualização Smartphone
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (onOpenAccessibility) onOpenAccessibility();
                  }}
                  className={`hover:text-cyan-400 font-bold transition-colors text-left cursor-pointer flex items-center gap-1.5 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}
                >
                  <span>🤟</span>
                  <span>Acessibilidade & Libras</span>
                </button>
              </li>
              {onOpenOpeningVideo && (
                <li>
                  <button
                    onClick={onOpenOpeningVideo}
                    className={`hover:text-cyan-400 font-bold transition-colors text-left cursor-pointer flex items-center gap-1.5 ${
                      isDark ? 'text-cyan-300' : 'text-cyan-700'
                    }`}
                  >
                    <span>🎬</span>
                    <span>Vídeo de Abertura do App</span>
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact / Location */}
          <div>
            <h4 className={`font-bold text-xs uppercase tracking-wider mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Localização
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Colégio Estadual do Campo Maria Quitéria<br />
              Estrada de São José s/n - Distrito de Maria Quitéria
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] ${
          isDark ? 'border-[#163650]/60 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <span>
            © 2026 Biblioteca Maria Quitéria. Todos os direitos reservados.
          </span>
          <div className="flex items-center gap-1">
            <span>Desenvolvido com padrão visual de alta fidelidade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

