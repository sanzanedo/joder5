import React from 'react';
import { Briefcase, Plane, HeartPulse, TreePalm, GraduationCap, Users } from 'lucide-react';
import { Topic } from './types';

export const TOPICS: Topic[] = [
  {
    id: 'trabajo',
    label: 'Trabajo y Estudios',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'Describe tu trabajo ideal, una experiencia laboral o tus estudios.',
    promptContext: 'El alumno habla sobre su experiencia laboral, estudios o aspiraciones profesionales.'
  },
  {
    id: 'viajes',
    label: 'Viajes y Turismo',
    icon: <Plane className="w-6 h-6" />,
    description: 'Habla sobre un viaje memorable, el turismo en tu país o vacaciones.',
    promptContext: 'El alumno describe una experiencia de viaje, turismo o vacaciones.'
  },
  {
    id: 'salud',
    label: 'Salud y Bienestar',
    icon: <HeartPulse className="w-6 h-6" />,
    description: 'Hábitos de vida saludable, deporte, o el sistema sanitario.',
    promptContext: 'El alumno habla sobre salud, hábitos saludables, deporte o medicina.'
  },
  {
    id: 'medio_ambiente',
    label: 'Medio Ambiente',
    icon: <TreePalm className="w-6 h-6" />,
    description: 'El cambio climático, reciclaje, o problemas medioambientales.',
    promptContext: 'El alumno opina sobre el medio ambiente, la contaminación o la naturaleza.'
  },
  {
    id: 'educacion',
    label: 'Educación',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'El sistema educativo, aprendizaje de idiomas o nuevas tecnologías.',
    promptContext: 'El alumno debate sobre la educación, los profesores o el aprendizaje.'
  },
  {
    id: 'relaciones',
    label: 'Relaciones Personales',
    icon: <Users className="w-6 h-6" />,
    description: 'La amistad, la familia, o las relaciones en el mundo moderno.',
    promptContext: 'El alumno habla sobre la familia, amigos o relaciones sociales.'
  }
];

export const SYSTEM_INSTRUCTION = `
Eres un tutor de expresión oral especializado en el examen DELE B2 de español.

OBJETIVO GENERAL
Tu tarea es ayudar al estudiante a mejorar su expresión oral para el DELE B2.
Debes analizar el audio proporcionado (que contiene la respuesta del alumno a un tema) y generar un análisis estructurado en formato JSON.

CRITERIOS DE ANÁLISIS (DELE B2):
1. Gramática y corrección: Tiempos verbales, concordancia, subjuntivo, ser/estar.
2. Léxico: Variedad, precisión, "falsos amigos", colocaciones léxicas.
3. Pronunciación: Claridad, entonación, ritmo.
4. Fluidez: Velocidad, pausas, muletillas, conectores.
5. Adecuación: Si responde al tema y mantiene el registro formal/neutro.

IMPORTANTE:
- Responde siempre en español peninsular estándar.
- Tono profesional, alentador pero riguroso.
- Se constructivo.
`;
