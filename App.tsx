import React, { useState } from 'react';
import { TopicSelector } from './components/TopicSelector';
import { AudioRecorder } from './components/AudioRecorder';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { analyzeAudio } from './services/geminiService';
import { AppState, Topic, AnalysisResult } from './types';
import { Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.TOPIC_SELECTION);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setAppState(AppState.RECORDING);
    setErrorMessage(null);
  };

  const handleRecordingComplete = async (blob: Blob) => {
    if (!selectedTopic) return;

    setAppState(AppState.ANALYZING);
    setErrorMessage(null);
    
    try {
      // Analyze with Gemini
      const result = await analyzeAudio(blob, selectedTopic.promptContext);
      setAnalysisResult(result);
      setAppState(AppState.FEEDBACK);
    } catch (error: any) {
      console.error("Analysis failed:", error);
      setErrorMessage("Hubo un error al analizar tu audio. Por favor, asegúrate de haber configurado tu API Key y de que tu conexión es estable.");
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.TOPIC_SELECTION);
    setSelectedTopic(null);
    setAnalysisResult(null);
    setErrorMessage(null);
  };

  const handleRetryAfterError = () => {
    setAppState(AppState.RECORDING);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <span className="font-bold text-slate-800 text-lg">Tutor DELE B2</span>
          </div>
          <div className="text-sm font-medium text-slate-500">
            {selectedTopic ? selectedTopic.label : 'Inicio'}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50">
        {appState === AppState.TOPIC_SELECTION && (
          <TopicSelector onSelect={handleTopicSelect} />
        )}

        {appState === AppState.RECORDING && selectedTopic && (
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete} 
            onCancel={handleReset}
            topicLabel={selectedTopic.label}
          />
        )}

        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Analizando tu respuesta...</h3>
            <p className="text-slate-500 max-w-md">
              La IA está transcribiendo tu audio y evaluando tu gramática, léxico y fluidez según los criterios DELE.
            </p>
          </div>
        )}

        {appState === AppState.FEEDBACK && analysisResult && (
          <FeedbackDisplay result={analysisResult} onReset={handleReset} />
        )}

        {appState === AppState.ERROR && (
           <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Error de Análisis</h3>
            <p className="text-slate-500 max-w-md mb-8">
              {errorMessage || 'Ocurrió un error desconocido.'}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleReset}
                className="px-6 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
              >
                Volver al inicio
              </button>
              <button 
                onClick={handleRetryAfterError}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Tutor DELE B2 con Gemini IA. Diseñado para estudiantes de español.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
