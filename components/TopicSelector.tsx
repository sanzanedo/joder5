import React from 'react';
import { Topic } from '../types';
import { TOPICS } from '../constants';

interface TopicSelectorProps {
  onSelect: (topic: Topic) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
          Práctica Oral DELE B2
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Selecciona un tema para comenzar tu simulación de examen. Hablarás durante 1-2 minutos y recibirás feedback detallado de la IA.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelect(topic)}
            className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-400 transition-all duration-300 group text-left"
          >
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
              {topic.icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">{topic.label}</h3>
            <p className="text-sm text-slate-500 text-center">{topic.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
