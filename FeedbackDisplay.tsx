import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { CheckCircle2, BookOpen, Mic2, Activity, MessageSquare, ChevronDown, ChevronUp, Star, ArrowLeft } from 'lucide-react';

interface FeedbackDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ result, onReset }) => {
  const [showTranscription, setShowTranscription] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50 ring-green-600/20';
    if (score >= 70) return 'text-indigo-600 bg-indigo-50 ring-indigo-600/20';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 ring-yellow-600/20';
    return 'text-red-600 bg-red-50 ring-red-600/20';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 pb-20">
      
      {/* Header with Score */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Análisis DELE B2</h2>
          <p className="text-slate-600">{result.generalFeedback}</p>
        </div>
        <div className={`flex flex-col items-center justify-center p-4 rounded-xl ring-1 ${getScoreColor(result.score)} min-w-[120px]`}>
          <span className="text-3xl font-bold">{result.score}/100</span>
          <span className="text-xs font-medium uppercase tracking-wider mt-1">Estimación</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Detailed Feedback */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Criteria Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-indigo-600">
                <BookOpen size={20} />
                <h3 className="font-semibold">Gramática</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.feedback.grammar}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-emerald-600">
                <MessageSquare size={20} />
                <h3 className="font-semibold">Léxico</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.feedback.vocabulary}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-purple-600">
                <Mic2 size={20} />
                <h3 className="font-semibold">Pronunciación</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.feedback.pronunciation}</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-orange-600">
                <Activity size={20} />
                <h3 className="font-semibold">Fluidez</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.feedback.fluency}</p>
            </div>
          </div>
          
           {/* Adequacy - Full width */}
           <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-slate-700">
                <CheckCircle2 size={20} />
                <h3 className="font-semibold">Adecuación a la Tarea</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">{result.feedback.adequacy}</p>
            </div>

          {/* Transcription Toggle */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <button 
              onClick={() => setShowTranscription(!showTranscription)}
              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-slate-700 font-medium"
            >
              <span>Ver Transcripción</span>
              {showTranscription ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {showTranscription && (
              <div className="p-6 text-slate-600 italic leading-relaxed border-t border-slate-200 bg-slate-50/50">
                "{result.transcription}"
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scaffolding / Tools */}
        <div className="space-y-6">
          <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-400" fill="currentColor" />
              <h3 className="font-bold text-lg">Para mejorar (Nivel B2/C1)</h3>
            </div>
            <p className="text-indigo-200 text-sm mb-4">
              Aquí tienes algunas estructuras o vocabulario avanzado que podrías usar en este contexto:
            </p>
            <ul className="space-y-3">
              {result.scaffolding.map((item, index) => (
                <li key={index} className="flex items-start gap-3 bg-indigo-800/50 p-3 rounded-lg border border-indigo-700">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-500 text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-indigo-50 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 text-slate-600 font-bold rounded-xl transition-all duration-200"
          >
            <ArrowLeft size={20} />
            Practicar otro tema
          </button>
        </div>

      </div>
    </div>
  );
};
