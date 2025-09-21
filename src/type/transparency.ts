export interface BudgetYear {
  year: number;
  budget: number;
  income: IncomeBreakdown;
  expenses: ExpenseBreakdown;
  notes?: { en: string; fr: string };
}

export interface IncomeBreakdown {
  sponsors: number;
  tickets: number;
}

export interface ExpenseBreakdown {
  venue: number;
  speakers: number;
  catering: number;
  marketing: number;
  equipment: number;
  other: number;
}

export interface TransparencyData {
  years: BudgetYear[];
  description: {
    fr: string;
    en: string;
  };
  methodology: {
    fr: string;
    en: string;
  };
}
