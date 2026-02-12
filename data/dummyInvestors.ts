import { Investor } from '../types';

export const DUMMY_INVESTORS: Investor[] = [
  {
    id: 'demo-1',
    name: '블루오션캐피탈',
    amount: 30,
    maxAmount: 50,
    status: 'Verbal',
    probability: 0.85,
    lead: 'CEO (황태일)',
    contact: '김민수 대표',
    lastUpdate: '2026-01-24',
    notes: 'Term sheet under final review. Max 50억 가능.'
  },
  {
    id: 'demo-2',
    name: '한강벤처스',
    amount: 20,
    status: 'Verbal',
    probability: 0.9,
    lead: '경훈',
    lastUpdate: '2026-01-22',
    notes: 'Verbal confirmation received. 2월 중 계약 예정.'
  },
  {
    id: 'demo-3',
    name: '서울디지털투자',
    amount: 25,
    status: 'HighInterest',
    probability: 0.65,
    lead: 'CEO (황태일)',
    contact: '이정호 심사역',
    lastUpdate: '2026-01-20',
    notes: 'Due diligence phase, strong signals.'
  },
  {
    id: 'demo-4',
    name: '태평양인베스트먼트',
    amount: 40,
    status: 'InProgress',
    probability: 0.4,
    lead: 'Shared',
    dependency: 'Board approval required',
    isBlocker: true,
    lastUpdate: '2026-01-26',
    notes: 'Waiting on Q4 financials review. Board 승인 필요.'
  },
  {
    id: 'demo-5',
    name: '동방기술투자',
    amount: 15,
    status: 'InProgress',
    probability: 0.3,
    lead: 'CEO (황태일)',
    lastUpdate: '2026-01-18',
    notes: 'Initial meeting positive, follow-up scheduled.'
  },
  {
    id: 'demo-6',
    name: '퓨처그로쓰파트너스',
    amount: 50,
    status: 'InProgress',
    probability: 0.5,
    lead: 'Shared',
    dependency: 'Co-investment structure (MOU)',
    isBlocker: true,
    lastUpdate: '2026-01-25',
    notes: 'Requires co-investor commitment. MOU 협의 중.'
  },
  {
    id: 'demo-7',
    name: '코리아그린펀드',
    amount: 10,
    status: 'HighInterest',
    probability: 0.7,
    lead: '경훈',
    contact: '박서연 팀장',
    lastUpdate: '2026-01-23',
    notes: 'ESG thesis alignment. Positive IR review.'
  },
  {
    id: 'demo-8',
    name: '아시아넥스트캐피탈',
    amount: 0,
    status: 'Dropped',
    probability: 0.0,
    lead: 'CEO (황태일)',
    lastUpdate: '2026-01-05',
    notes: 'Declined due to sector overlap.'
  },
];
