import { Investor } from './types';

// As of 2026.01.27
export const CURRENT_DATE = '2026-01-27';

export const INITIAL_INVESTORS: Investor[] = [
  {
    id: '1',
    name: '산업은행 스케일실',
    amount: 50,
    maxAmount: 70,
    status: 'Verbal',
    probability: 0.9,
    lead: 'CEO (황태일)',
    lastUpdate: '2026-01-25',
    notes: 'Max 70억 possibility depending on final committee.'
  },
  {
    id: '2',
    name: '뮤렉스파트너스',
    amount: 10,
    status: 'Verbal',
    probability: 0.9,
    lead: 'CEO (황태일)',
    lastUpdate: '2026-01-20',
    notes: 'Confirmed.'
  },
  {
    id: '3',
    name: '스틱인베스트먼트',
    amount: 20,
    status: 'HighInterest',
    probability: 0.7,
    lead: 'CEO (황태일)',
    lastUpdate: '2026-01-24',
    notes: 'High sensitivity. Term sheet discussion soon.'
  },
  {
    id: '4',
    name: '코로프라넥스트',
    amount: 40,
    status: 'InProgress',
    probability: 0.4,
    lead: 'Shared',
    dependency: 'Fintech Thesis (MOU)',
    lastUpdate: '2026-01-26',
    notes: 'Requires fintech thesis. Co-GP with DTN.',
    isBlocker: true
  },
  {
    id: '5',
    name: 'MUFG',
    amount: 40,
    status: 'InProgress',
    probability: 0.4,
    lead: 'Shared',
    dependency: 'Fintech Thesis (MOU)',
    lastUpdate: '2026-01-26',
    notes: 'Requires fintech thesis.',
    isBlocker: true
  },
  {
    id: '6',
    name: '현대기술투자',
    amount: 15,
    status: 'InProgress',
    probability: 0.3,
    lead: 'CEO (황태일)',
    contact: '정현욱 수석팀장',
    lastUpdate: '2026-01-22',
    notes: 'Range 10-20억.'
  },
  {
    id: '7',
    name: '노틸러스인베스트먼트',
    amount: 0, // TBD
    status: 'InProgress',
    probability: 0.2,
    lead: 'CEO (황태일)',
    contact: '양현비',
    lastUpdate: '2026-01-15',
    notes: 'IR materials shared, pending internal review. Amount TBD.'
  },
  {
    id: '8',
    name: '디티앤인베스트먼트',
    amount: 0, // Co-GP role
    status: 'InProgress',
    probability: 0.5,
    lead: 'CEO (황태일)',
    contact: '이승한 수석심사역',
    lastUpdate: '2026-01-25',
    notes: 'Co-GP role for Colopl fund.'
  },
  {
    id: '9',
    name: 'IBK기업은행 직접투자실',
    amount: 0,
    status: 'Dropped',
    probability: 0.0,
    lead: 'CEO (황태일)',
    lastUpdate: '2026-01-10',
    notes: 'Declined. Follow-on not possible.'
  }
];

export const TARGETS = {
  primary: 200,
  final: 400
};
