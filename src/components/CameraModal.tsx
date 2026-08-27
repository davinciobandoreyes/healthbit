import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, Check, ShieldCheck } from 'lucide-react';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
  title: string;
  isBiometricOverlay?: boolean;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title,
  isBiometricOverlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setErrorMsg(null);
    setCapturedImage(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isBiometricOverlay ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setErrorMsg('No se pudo acceder a la cámara. Revisa los permisos de tu navegador o carga un archivo.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
    }
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-sm sm:text-base tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewport Area */}
        <div className="relative bg-slate-950 aspect-4/3 flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-rose-300 max-w-xs text-xs">
              <p>{errorMsg}</p>
            </div>
          ) : capturedImage ? (
            <img src={capturedImage} alt="Captura" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay guides */}
              {isBiometricOverlay ? (
                <div className="absolute inset-0 border-2 border-dashed border-violet-400/80 rounded-full my-6 mx-14 flex items-center justify-center pointer-events-none">
                  <div className="text-violet-300 text-[11px] font-bold bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-xs">
                    Alinea tu rostro dentro del óvalo
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 border-2 border-dashed border-violet-400/80 rounded-2xl m-6 pointer-events-none flex items-center justify-center">
                  <div className="text-white text-[11px] font-bold bg-slate-900/80 px-3 py-1 rounded-full backdrop-blur-xs">
                    Ubica el documento dentro del marco
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          {capturedImage ? (
            <>
              <button
                onClick={() => setCapturedImage(null)}
                className="min-h-[44px] flex items-center gap-2 px-4 py-2 rounded-2xl bg-white text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Repetir
              </button>
              <button
                onClick={confirmPhoto}
                className="min-h-[44px] flex items-center gap-2 px-5 py-2 rounded-2xl bg-violet-600 text-white font-bold text-xs hover:bg-violet-700 shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Usar esta captura
              </button>
            </>
          ) : (
            <button
              onClick={takePhoto}
              disabled={!!errorMsg}
              className="w-full min-h-[48px] py-3 rounded-2xl bg-violet-600 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-violet-700 shadow-xs active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Tomar Captura
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
