import { CalculationResults } from '@/types/CalculationResults';

export interface HistoryEntry {
  date: string;
  animals: { [key: string]: number };
  results: CalculationResults;
} 