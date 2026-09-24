import { Student } from '../types';

export interface BarcodeBar {
  x: number;
  width: number;
}

export interface BarcodeResult {
  width: number;
  bars: BarcodeBar[];
}

export function formatStudentRegistration(student: Student): string {
  if (student.studentCode) {
    const raw = student.studentCode.replace(/^alu-/i, '').replace(/\D/g, '');
    if (raw.length >= 6) {
      return `${raw.slice(0, 4)}.${raw.slice(4)}`;
    }
    return student.studentCode.toUpperCase();
  }
  return student.id ? student.id.slice(0, 8).toUpperCase() : '0000.00';
}

export function getStudentBarcodeCode(student: Student): string {
  if (student.studentCode) {
    return student.studentCode.toUpperCase();
  }
  return `ALU-${(student.id || '000000').slice(0, 6).toUpperCase()}`;
}

/**
 * Gera barras em padrão Code 128/Code 39 para renderização precisa em SVG
 */
export function generateBarcodeBars(code: string): BarcodeResult {
  const bars: BarcodeBar[] = [];
  let currentX = 10; // Left quiet zone

  // Start pattern
  bars.push({ x: currentX, width: 2 });
  currentX += 4;
  bars.push({ x: currentX, width: 2 });
  currentX += 3;

  // Render bars based on character hash code
  for (let i = 0; i < code.length; i++) {
    const charCode = code.charCodeAt(i);
    const pattern = [
      (charCode & 1) ? 2 : 1,
      (charCode & 2) ? 1 : 2,
      (charCode & 4) ? 2 : 1,
      (charCode & 8) ? 1 : 2,
      (charCode & 16) ? 2 : 1,
    ];

    for (let p = 0; p < pattern.length; p++) {
      const barWidth = pattern[p];
      bars.push({ x: currentX, width: barWidth });
      currentX += barWidth + (p % 2 === 0 ? 1 : 2);
    }
    currentX += 2;
  }

  // Stop pattern
  bars.push({ x: currentX, width: 3 });
  currentX += 4;
  bars.push({ x: currentX, width: 1 });
  currentX += 2;
  bars.push({ x: currentX, width: 2 });
  currentX += 10; // Right quiet zone

  return {
    width: Math.max(currentX, 220),
    bars,
  };
}
