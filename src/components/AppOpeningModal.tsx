import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  BookOpen,
  ArrowRight,
  X,
  Film,
  CheckCircle2,
} from 'lucide-react';
import { Logo } from './Logo';

interface AppOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoPlay?: boolean;
}

export const AppOpeningModal: React.FC<AppOpeningModalProps> = ({
  isOpen,
  onClose,
  autoPlay = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(8);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Video source paths
  const videoSrc = '/assets/abertura_cecmq.mp4';
  const posterSrc = '/assets/abertura_cecmq_poster.jpg';

  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true);
      setProgress(0);
      setCurrentTime(0);

      // Try autoplay
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {
            // Autoplay blocked: mute and retry
            setIsMuted(true);
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {
                // Fallback to paused
                setIsPlaying(false);
              });
            }
          });
        }
      }, 150);

      return () => clearTimeout(timer);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  }, [isOpen]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const dur = videoRef.current.duration || 8;
      setCurrentTime(current);
      setDuration(dur);
      setProgress((current / dur) * 100);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleRestart = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    setProgress(0);
    setCurrentTime(0);
  };

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem('bmq_suppress_intro', 'true');
      } catch {
        // ignore
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="app-opening-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-3xl overflow-hidden border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.25)] bg-gradient-to-b from-[#061826] via-[#04101c] to-[#020912]"
        >
          {/* Top Bar / Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-[#031522]/90 backdrop-blur-md z-20">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wide uppercase text-cyan-400 font-mono">
                    Abertura Oficial
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    O Encanto dos Livros
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Colégio Estadual Coronel Maria Quitéria
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                id="btn-skip-opening"
                onClick={handleClose}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
              >
                <span>Pular Abertura</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                id="btn-close-opening-modal"
                onClick={handleClose}
                title="Fechar"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Video Player Canvas Container */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] sm:min-h-[440px] md:min-h-[520px]">
            {/* Ambient Background Light Orbs */}
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

            {/* Floating Magical Stardust / Books FX */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              <span className="absolute top-[15%] left-[8%] text-amber-300/40 text-xl animate-bounce">
                ✨
              </span>
              <span className="absolute top-[25%] right-[10%] text-cyan-300/50 text-base animate-pulse">
                📖
              </span>
              <span className="absolute bottom-[20%] left-[12%] text-purple-300/40 text-lg animate-pulse">
                📚
              </span>
              <span className="absolute bottom-[15%] right-[15%] text-emerald-300/40 text-xl animate-bounce">
                🌟
              </span>
            </div>

            {/* Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              poster={posterSrc}
              playsInline
              autoPlay={autoPlay}
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onLoadedData={() => setVideoLoaded(true)}
              onError={() => setHasError(true)}
              onClick={togglePlay}
              className="w-full h-full max-h-[70vh] object-contain cursor-pointer"
            />

            {/* Fallback Image if Video has loading error */}
            {hasError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#001726]">
                <img
                  src={posterSrc}
                  alt="Abertura Biblioteca Maria Quitéria"
                  className="max-h-[55vh] object-contain rounded-2xl shadow-2xl mb-4"
                />
                <p className="text-cyan-300 text-sm font-semibold mb-1">
                  O Encanto da Leitura • Colégio Estadual Cel. Maria Quitéria
                </p>
                <p className="text-slate-400 text-xs max-w-md">
                  Uma jornada mágica pelo universo dos livros e do conhecimento.
                </p>
              </div>
            )}

            {/* Floating Centered Play/Pause Trigger Indicator when paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[2px] cursor-pointer"
              >
                <div className="flex flex-col items-center gap-3 p-6 rounded-full bg-cyan-500/20 border border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.4)] text-cyan-200 transform transition-transform hover:scale-110 active:scale-95">
                  <Play className="w-12 h-12 fill-cyan-300 text-cyan-300 ml-1" />
                </div>
              </div>
            )}

            {/* Overlaid Inspirational Badge */}
            <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
              <div className="pointer-events-auto bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>"Conhecimento também transforma vidas"</span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Biblioteca Escolar CECMQ • Seja bem-vindo(a)!
                </p>
              </div>

              {/* Sound status tip */}
              {isMuted && (
                <button
                  id="btn-unmute-tip"
                  onClick={toggleMute}
                  className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/90 text-[#021726] text-xs font-bold shadow-lg hover:bg-cyan-400 transition-colors animate-pulse cursor-pointer"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Ativar Áudio da Abertura</span>
                </button>
              )}
            </div>
          </div>

          {/* Video Control Bar & Progress */}
          <div className="px-5 py-3.5 bg-[#031422] border-t border-cyan-500/20 z-20 flex flex-col gap-3">
            {/* Progress Scrub Bar */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-slate-400 w-10">
                0:0{Math.floor(currentTime)}
              </span>
              <div
                onClick={(e) => {
                  if (!videoRef.current) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                  const dur = videoRef.current.duration || 8;
                  videoRef.current.currentTime = ratio * dur;
                }}
                className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer relative group"
              >
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                0:0{Math.floor(duration)}
              </span>
            </div>

            {/* Bottom Controls row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {/* Play/Pause */}
                <button
                  id="btn-opening-toggle-play"
                  onClick={togglePlay}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-colors cursor-pointer"
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  )}
                </button>

                {/* Restart */}
                <button
                  id="btn-opening-restart"
                  onClick={handleRestart}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Reiniciar vídeo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Mute/Unmute */}
                <button
                  id="btn-opening-toggle-sound"
                  onClick={toggleMute}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isMuted
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                  }`}
                  title={isMuted ? 'Ativar som' : 'Desativar som'}
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Sem som</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Com som</span>
                    </>
                  )}
                </button>
              </div>

              {/* Enter app button */}
              <div className="flex items-center gap-3">
                <label className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dontShowAgain}
                    onChange={(e) => setDontShowAgain(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Não abrir automaticamente na próxima vez</span>
                </label>

                <button
                  id="btn-enter-library-after-opening"
                  onClick={handleClose}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-[#021726] bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 shadow-[0_0_20px_rgba(52,211,153,0.4)] transition-all cursor-pointer hover:scale-105 active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Entrar no Aplicativo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
