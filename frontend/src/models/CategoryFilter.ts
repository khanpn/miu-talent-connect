import { Category } from './Category';

export interface CategoryFilter extends Category {
  candidateCount: number;
}
