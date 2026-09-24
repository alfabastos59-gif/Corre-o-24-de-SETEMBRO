import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Camera,
  Link2,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Smartphone,
  Video,
  Zap,
  ZapOff,
  Image as ImageIcon,
  RotateCcw,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { Book } from '../types';
import { CATEGORIES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { playCameraShutterSound } from '../utils/gameAudio';

interface RegisterBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterBook: (book: Book) => void;
}

export const RegisterBookModal: React.FC<RegisterBookModalProps> = ({
  isOpen,
  onClose,
  onRegisterBook,
}) => {
  const { isDark } = useTheme();

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Literatura Brasileira');
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [totalCopies, setTotalCopies] = useState<number>(1);
  const [location, setLocation] = useState('Estante 01 - Prateleira A');
  const [synopsis, setSynopsis] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [previewImage, setPreviewImage] = useState<string>('');

  // Camera & Upload States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [hasTorchSupport, setHasTorchSupport] = useState(false);
  const [showCameraChoice, setShowCameraChoice] = useState(false);
  const [isCapturingAnimation, setIsCapturingAnimation] = useState(false);

  // Form handling states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Password Authorization states (requires "aluno123")
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Password validation handler
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'aluno123') {
      setIsAuthorized(true);
      setPasswordError(null);
      setPasswordInput('');
    } else {
      setPasswordError('Senha incorreta! Digite a senha correta (aluno123) para continuar.');
    }
  };

  // Stop camera stream safely
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    setIsFlashActive(false);
    setHasTorchSupport(false);
    setCameraError(null);
  }, []);

  // Close and cleanup
  const handleClose = () => {
    stopCameraStream();
    setShowCameraChoice(false);
    setErrorMessage(null);
    setIsAuthorized(false);
    setPasswordInput('');
    setPasswordError(null);
    onClose();
  };

  // Cleanup on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setShowCameraChoice(false);
      setIsAuthorized(false);
      setPasswordInput('');
      setPasswordError(null);
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, stopCameraStream]);

  // Compress and downscale image file
  const compressImageFile = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 720;
          const MAX_HEIGHT = 960;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = Math.round(width);
          canvas.height = Math.round(height);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.84));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 1. Smartphone Native Camera App Trigger
  const triggerNativeSmartphoneCamera = () => {
    setShowCameraChoice(false);
    stopCameraStream();
    // Direct trigger to smartphone hardware camera
    if (nativeCameraInputRef.current) {
      nativeCameraInputRef.current.click();
    }
  };

  // 2. In-App Live Camera Stream (Webcam / Live Viewfinder)
  const startLiveCamera = async (mode: 'user' | 'environment' = facingMode) => {
    stopCameraStream();
    setShowCameraChoice(false);
    setCameraError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fallback directly to smartphone native camera
      triggerNativeSmartphoneCamera();
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      setIsCameraActive(true);
      setFacingMode(mode);

      // Check for torch/flashlight capability on smartphone
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities?.() as any) || {};
        if (capabilities.torch) {
          setHasTorchSupport(true);
        }
      }

      // Attach video stream to element
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((err) => {
            console.warn('Could not auto-play video stream:', err);
          });
        }
      }, 80);
    } catch (err: any) {
      console.warn('Could not start live video, triggering smartphone native camera:', err);
      // If permission is denied or device not found, trigger native smartphone input
      triggerNativeSmartphoneCamera();
    }
  };

  // Toggle flash/torch on smartphone camera
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (!track) return;

    try {
      const nextState = !isFlashActive;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextState }],
      });
      setIsFlashActive(nextState);
    } catch (err) {
      console.warn('Torch constraint error:', err);
    }
  };

  // Switch camera between front and back
  const handleToggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startLiveCamera(nextMode);
  };

  // Capture frame from live video viewfinder
  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    try {
      // Play tactile camera click sound
      playCameraShutterSound();

      // Trigger visual shutter flash animation
      setIsCapturingAnimation(true);

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setPreviewImage(dataUrl);
        setCoverUrl('');
      }

      setTimeout(() => {
        setIsCapturingAnimation(false);
        stopCameraStream();
      }, 250);
    } catch (err) {
      console.error('Error capturing photo:', err);
      setCameraError('Não foi possível capturar a foto. Tente novamente.');
      setIsCapturingAnimation(false);
    }
  };

  // Main Camera Button Click Handler
  const handleCameraClick = () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // On mobile devices, both native smartphone camera and live viewfinder are great options
    if (isMobile) {
      // Show smart choice between Native Camera and Live Viewfinder, or launch directly
      setShowCameraChoice(true);
    } else {
      // On desktop, open live camera stream or file dialog
      startLiveCamera('environment');
    }
  };

  // Handle file input change (Native smartphone camera or file upload)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido (PNG, JPG).');
      return;
    }

    try {
      // Play shutter sound on photo upload/capture
      playCameraShutterSound();
      const compressedDataUrl = await compressImageFile(file);
      setPreviewImage(compressedDataUrl);
      setCoverUrl('');
      setErrorMessage(null);
    } catch (err) {
      console.error('Error processing image:', err);
      setErrorMessage('Erro ao processar imagem. Tente novamente.');
    } finally {
      // Reset input value so same file can be chosen again if needed
      e.target.value = '';
    }
  };

  // Drag & drop support
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      try {
        playCameraShutterSound();
        const compressedDataUrl = await compressImageFile(file);
        setPreviewImage(compressedDataUrl);
        setCoverUrl('');
        setErrorMessage(null);
      } catch (err) {
        setErrorMessage('Erro ao carregar imagem arrastada.');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Clipboard paste support (Ctrl+V)
  useEffect(() => {
    if (!isOpen) return;

    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            try {
              playCameraShutterSound();
              const compressedDataUrl = await compressImageFile(blob);
              setPreviewImage(compressedDataUrl);
              setCoverUrl('');
              setErrorMessage(null);
            } catch (err) {
              console.warn('Error pasting image:', err);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isOpen]);

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('O título do livro é obrigatório.');
      return;
    }

    if (!author.trim()) {
      setErrorMessage('O autor do livro é obrigatório.');
      return;
    }

    setIsSubmitting(true);

    const defaultCover =
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80';

    const finalCover = previewImage || coverUrl.trim() || defaultCover;

    const newBook: Book = {
      id: `livro-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      category: category || 'Literatura Brasileira',
      year: year || new Date().getFullYear(),
      totalCopies: Math.max(1, totalCopies),
      availableCopies: Math.max(1, totalCopies),
      location: location.trim() || 'Estante 01 - Prateleira A',
      isbn: `978-85-${Math.floor(100000 + Math.random() * 900000)}`,
      synopsis: synopsis.trim() || `Livro ${title} de ${author} disponível no acervo da biblioteca escolar.`,
      pages: 180,
      publisher: 'Acervo Biblioteca',
      rating: 5.0,
      reviewsCount: 1,
      status: 'disponivel',
      cover: finalCover,
    };

    onRegisterBook(newBook);
    setIsSubmitting(false);
    setSuccessToast(true);

    setTimeout(() => {
      setSuccessToast(false);
      handleClose();
      // Reset form fields
      setTitle('');
      setAuthor('');
      setCategory('Literatura Brasileira');
      setYear(new Date().getFullYear());
      setTotalCopies(1);
      setSynopsis('');
      setCoverUrl('');
      setPreviewImage('');
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      {/* 1. Native Smartphone Camera Trigger (capture="environment" launches real mobile camera app) */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* 2. Standard File Explorer / Gallery Picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleImageFileChange}
      />

      {/* Main Dialog Container matching Screenshot */}
      <div
        className={`relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto border transition-colors ${
          isDark
            ? 'bg-[#001424] border-[#163650] text-slate-100'
            : 'bg-[#001726] border-[#163650] text-slate-100'
        }`}
      >
        {/* Success Toast Overlay */}
        {successToast && (
          <div className="absolute inset-0 z-50 bg-[#001424]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              Livro Cadastrado com Sucesso!
            </h3>
            <p className="text-sm text-slate-300 max-w-sm">
              A obra <strong className="text-emerald-400">"{title}"</strong> foi adicionada ao acervo e já está visível no catálogo.
            </p>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-start justify-between border-b border-[#163650]/50">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
              {isAuthorized ? 'Cadastrar novo livro' : 'Cadastro de Livros'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isAuthorized
                ? 'Compartilhe um livro com a biblioteca da escola.'
                : 'Acesso protegido — digite a senha para continuar.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar janela"
            className="w-9 h-9 rounded-full bg-[#082032] hover:bg-[#0f2e47] text-slate-200 hover:text-white flex items-center justify-center border border-[#1b3d56] transition-colors shrink-0 cursor-pointer shadow-sm active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthorized ? (
          /* Password Protection Gate */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center animate-in fade-in duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/15">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Autorização Necessária
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mb-6 font-medium leading-relaxed">
              O cadastro de novos livros é restrito. Digite a senha de autorização para liberar o formulário:
            </p>

            <form onSubmit={handleVerifyPassword} className="w-full max-w-sm space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Senha de Acesso
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="input-senha-cadastro-livros"
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setPasswordError(null);
                    }}
                    placeholder="Digite a senha..."
                    autoFocus
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-[#082032] border border-[#1b3d56] text-white placeholder-slate-400 text-sm tracking-wider focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                    title={showPassword ? 'Ocultar senha' : 'Ver senha'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-xs sm:text-sm cursor-pointer transition-all active:scale-95"
                >
                  Cancelar
                </button>
                <button
                  id="btn-desbloquear-cadastro-livro"
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-md cursor-pointer transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Lock className="w-4 h-4" />
                  <span>Liberar Cadastro</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Error message */}
            {errorMessage && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* SECTION: Capa do livro */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
              Capa do livro
            </label>

            {/* LIVE CAMERA VIEWFINDER IN-MODAL */}
            {isCameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-black aspect-[4/3] flex flex-col items-center justify-center shadow-2xl">
                {/* Visual Camera Shutter Flash */}
                {isCapturingAnimation && (
                  <div className="absolute inset-0 z-30 bg-white animate-out fade-out duration-200 pointer-events-none" />
                )}

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {/* Framing Overlay for Book Cover */}
                <div className="absolute inset-4 sm:inset-6 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col items-center justify-between p-3">
                  <div className="flex items-center gap-1.5 bg-black/60 text-white text-[10px] sm:text-xs px-3 py-1 rounded-full backdrop-blur-md">
                    <Camera className="w-3 h-3 text-emerald-400" />
                    <span>Enquadre a capa do livro aqui</span>
                  </div>

                  {hasTorchSupport && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`pointer-events-auto p-2 rounded-full backdrop-blur-md transition-colors ${
                        isFlashActive ? 'bg-amber-400 text-slate-950' : 'bg-black/60 text-white'
                      }`}
                      title="Alternar Flash"
                    >
                      {isFlashActive ? <Zap className="w-4 h-4" /> : <ZapOff className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Camera Controls Bar */}
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 p-2 sm:p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 z-20">
                  <button
                    type="button"
                    onClick={stopCameraStream}
                    className="px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>

                  {/* Main Shutter Capture Button */}
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    className="group relative w-14 h-14 rounded-full border-4 border-white flex items-center justify-center shadow-lg active:scale-90 transition-transform cursor-pointer"
                    title="Capturar Foto"
                  >
                    <div className="w-11 h-11 rounded-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors" />
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Switch Front/Back Lens */}
                    <button
                      type="button"
                      onClick={handleToggleCameraFacing}
                      title="Alternar Câmera (Traseira / Frontal)"
                      className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* Smartphone Native Camera Switch */}
                    <button
                      type="button"
                      onClick={triggerNativeSmartphoneCamera}
                      title="Abrir Câmera do Smartphone"
                      className="p-2.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white cursor-pointer transition-colors"
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : previewImage ? (
              /* Image Preview Box when photo is taken or selected */
              <div className="relative rounded-2xl overflow-hidden border border-[#163650] bg-[#031522] p-3.5 flex items-center gap-4">
                <img
                  src={previewImage}
                  alt="Capa do livro fotografada"
                  className="w-16 h-22 object-cover rounded-xl border border-[#1b3d56] shadow-md shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Foto da capa capturada!
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Imagem pronta para o acervo da biblioteca
                  </p>
                  <div className="flex items-center gap-2.5 mt-2.5">
                    <button
                      type="button"
                      onClick={handleCameraClick}
                      className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline cursor-pointer flex items-center gap-1"
                    >
                      <Camera className="w-3 h-3" />
                      Tirar outra foto
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] font-semibold text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Trocar arquivo
                    </button>
                    <span className="text-slate-600">·</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage('');
                        setCoverUrl('');
                      }}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Dashed Upload Box matching Screenshot */
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-[#163650] hover:border-emerald-500/80 rounded-2xl p-4 sm:p-5 flex items-center gap-4 bg-[#031522]/80 hover:bg-[#031522] transition-colors cursor-pointer group"
              >
                <div className="w-13 h-13 rounded-2xl bg-[#082032] border border-[#163650] flex items-center justify-center text-slate-300 group-hover:text-emerald-400 transition-colors shrink-0 shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    Clique para enviar a imagem
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PNG ou JPG, até 5MB
                  </p>
                </div>
              </div>
            )}

            {/* Smart Camera Choice Popover (when user clicks Tirar foto da capa on smartphone) */}
            {showCameraChoice && !isCameraActive && (
              <div className="mt-2.5 p-3 rounded-2xl bg-[#041c2c] border border-emerald-500/40 animate-in fade-in zoom-in-95 duration-150 shadow-xl">
                <div className="flex items-center justify-between pb-2 border-b border-[#163650]">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-emerald-400" />
                    Escolha o modo de câmera:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCameraChoice(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={triggerNativeSmartphoneCamera}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2.5 text-left transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Câmera do Smartphone</div>
                      <div className="text-[10px] text-emerald-100">App nativo com foco e flash</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => startLiveCamera('environment')}
                    className="p-2.5 rounded-xl bg-[#082032] hover:bg-[#0f2e47] text-white border border-[#163650] flex items-center gap-2.5 text-left transition-colors cursor-pointer shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Video className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">Visor ao Vivo na Tela</div>
                      <div className="text-[10px] text-slate-400">Com guia de enquadramento</div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* "Tirar foto da capa" Full-Width Button matching Screenshot */}
            {!isCameraActive && (
              <button
                type="button"
                id="btn-tirar-foto-capa"
                onClick={handleCameraClick}
                className="w-full mt-2.5 py-3 px-4 rounded-xl bg-[#052132] hover:bg-[#0a2e46] text-slate-200 hover:text-white border border-[#163650] hover:border-emerald-500/60 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-[0.99]"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Tirar foto da capa</span>
              </button>
            )}

            {/* "Ou cole o endereço (URL) da imagem" matching Screenshot */}
            <div className="mt-3">
              <label className="block text-xs text-slate-300 mb-1.5 font-medium">
                Ou cole o endereço (URL) da imagem
              </label>
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => {
                    setCoverUrl(e.target.value);
                    if (e.target.value.trim()) {
                      setPreviewImage(e.target.value.trim());
                    }
                  }}
                  placeholder="https://exemplo.com/capa.jpg"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition-colors"
                />
              </div>
            </div>
          </div>

          {/* SECTION: Título * matching Screenshot */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
              Título *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: O Pequeno Príncipe"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* SECTION: Autor * matching Screenshot */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
              Autor *
            </label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ex: Antoine de Saint-Exupéry"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Categoria & Ano */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                Categoria *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                {CATEGORIES.filter((c) => c !== 'Todos').map((cat) => (
                  <option key={cat} value={cat} className="bg-[#001424] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                Ano de Publicação
              </label>
              <input
                type="number"
                min="1800"
                max={new Date().getFullYear() + 1}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Exemplares & Localização */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                Exemplares Disponíveis
              </label>
              <input
                type="number"
                min="1"
                max="999"
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
                Localização na Estante
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ex: Estante 01 - Prateleira A"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Sinopse / Descrição */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-1.5">
              Sinopse / Sobre o livro (Opcional)
            </label>
            <textarea
              rows={2}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="Breve resumo da história ou tema do livro..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#031522] border border-[#163650] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            />
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#163650]/50">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl border border-[#163650] hover:bg-[#0e2738] text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              id="btn-confirmar-cadastro-livro"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>{isSubmitting ? 'Cadastrando...' : 'Cadastrar Livro'}</span>
            </button>
          </div>
        </form>
        </>
      )}
      </div>
    </div>
  );
};
