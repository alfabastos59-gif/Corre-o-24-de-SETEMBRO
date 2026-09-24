// Moderation and content filter for student suggestions in school library environment

const BLOCKED_WORDS = [
  'porra',
  'caralho',
  'merda',
  'puta',
  'puto',
  'viado',
  'bicha',
  'arrombado',
  'arrombada',
  'filho da puta',
  'fdp',
  'cu',
  'vai se foder',
  'foder',
  'buceta',
  'piroca',
  'cacete',
  'vagabundo',
  'vagabunda',
  'desgraçado',
  'desgraçada',
  'idiota',
  'imbecil',
  'babaca',
  'otario',
  'otária',
  'corno',
  'estúpido',
  'estupido',
  'retardado',
];

export interface ValidationInput {
  studentName?: string;
  bookTitle?: string;
  author?: string;
  reason?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  flaggedFields: string[];
}

function containsInappropriateContent(text: string): boolean {
  if (!text) return false;
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');

  return BLOCKED_WORDS.some((word) => {
    const cleanWord = word
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    // Check whole word match or space delimited
    const regex = new RegExp(`(^|\\s)${cleanWord}(\\s|$)`, 'i');
    return regex.test(normalized);
  });
}

export function validateBookSuggestion(input: ValidationInput): ValidationResult {
  const flaggedFields: string[] = [];

  if (input.studentName && containsInappropriateContent(input.studentName)) {
    flaggedFields.push('studentName');
  }

  if (input.bookTitle && containsInappropriateContent(input.bookTitle)) {
    flaggedFields.push('bookTitle');
  }

  if (input.author && containsInappropriateContent(input.author)) {
    flaggedFields.push('author');
  }

  if (input.reason && containsInappropriateContent(input.reason)) {
    flaggedFields.push('reason');
  }

  if (flaggedFields.length > 0) {
    return {
      isValid: false,
      errorMessage: 'Mensagem contém termos inapropriados para o ambiente escolar.',
      flaggedFields,
    };
  }

  return {
    isValid: true,
    flaggedFields: [],
  };
}
