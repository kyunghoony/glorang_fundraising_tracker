export type Status = 'Verbal' | 'HighInterest' | 'InProgress' | 'Dropped';

export type LeadPerson = 'CEO (황태일)' | '경훈' | 'Shared';

export interface Investor {
  id: string;
  name: string;
  amount: number; // Unit: 억 KRW
  maxAmount?: number;
  status: Status;
  probability: number; // 0.0 to 1.0
  lead: LeadPerson;
  contact?: string;
  dependency?: string;
  lastUpdate: string; // YYYY-MM-DD
  notes: string;
  isBlocker?: boolean;
}

export interface PipelineStats {
  targetPrimary: number;
  targetFinal: number;
  totalVerbal: number;
  totalHighInterest: number;
  totalInProgress: number;
  weightedTotal: number;
  maxPotential: number;
}
