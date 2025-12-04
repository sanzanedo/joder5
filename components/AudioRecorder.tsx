import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, RotateCcw, ArrowRight } from 'lucide-react';

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  onCancel: () => void;
  topicLabel: string;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete, onCancel, topicLabel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        setHasRecorded(true);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = window.setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("No se pudo acceder al micrófono. Por favor, verifica los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const resetRecording = () => {
    setHasRecorded(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
          Tarea: {topicLabel}
        </span>
        <h2 className="text-2xl font-bold text-slate-800">
          {hasRecorded ? 'Grabación finalizada' : isRecording ? 'Grabando tu respuesta...' : 'Prepara tu respuesta'}
        </h2>
        <p className="text-slate-500 mt-2">
          {hasRecorded 
            ? 'Escucha tu audio o envíalo para analizar.' 
            : 'Intenta hablar durante al menos 30 segundos para obtener un buen análisis.'}
        </p>
      </div>

      {/* Visualizer / Timer Circle */}
      <div className="relative mb-8">
        <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${
          isRecording ? 'bg-red-50 recording-ring' : 'bg-slate-100'
        }`}>
          <div className="text-3xl font-mono font-medium text-slate-700">
            {formatTime(duration)}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRecording && !hasRecorded && (
          <button
            onClick={startRecording}
            className="flex items-center justify-center w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <Mic size={28} />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="flex items-center justify-center w-16 h-16 bg-slate-800 hover:bg-slate-900 text-white rounded-full shadow-lg transition-transform hover:scale-105"
          >
            <Square size={24} fill="currentColor" />
          </button>
        )}

        {hasRecorded && (
          <div className="flex gap-4">
            <button
              onClick={resetRecording}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
            >
              <RotateCcw size={18} />
              Repetir
            </button>
            <button
              onClick={() => audioBlob && onRecordingComplete(audioBlob)}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-md transition-colors"
            >
              Analizar
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>

      {hasRecorded && audioUrl && (
        <div className="mt-8 w-full max-w-md">
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}

      <button
        onClick={onCancel}
        className="mt-12 text-slate-400 hover:text-slate-600 text-sm font-medium"
      >
        Cancelar y elegir otro tema
      </button>
    </div>
  );
};
