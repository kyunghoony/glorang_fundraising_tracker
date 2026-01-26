import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { Investor, Status, LeadPerson } from '../types';

interface InvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (investor: Investor) => void;
  initialData?: Investor | null;
}

const STATUS_OPTIONS: Status[] = ['Verbal', 'HighInterest', 'InProgress', 'Dropped'];
const LEAD_OPTIONS: LeadPerson[] = ['CEO (황태일)', '경훈', 'Shared'];

export const InvestorModal: React.FC<InvestorModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<Investor>>({});

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        // Default values for new entry
        setFormData({
            id: Date.now().toString(),
            name: '',
            amount: 0,
            status: 'InProgress',
            probability: 0.5,
            lead: 'CEO (황태일)',
            lastUpdate: new Date().toISOString().split('T')[0],
            notes: '',
            dependency: '',
            contact: '',
            isBlocker: false
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    
    if (type === 'number') {
        newValue = value === '' ? 0 : parseFloat(value);
    } else if (type === 'checkbox') {
        newValue = (e.target as HTMLInputElement).checked;
    }
    
    setFormData(prev => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Investor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? '투자사 정보 수정 (Edit)' : '새 투자사 추가 (Add)'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">투자사명 (Name)</label>
              <input
                required
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Ex: 산업은행"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">담당자 (Contact)</label>
              <input
                name="contact"
                value={formData.contact || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Ex: 홍길동 심사역"
              />
            </div>
          </div>

          {/* Section 2: Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">금액 (억 KRW)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Max Cap (Optional)</label>
              <input
                type="number"
                name="maxAmount"
                value={formData.maxAmount || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Max amount"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">확률 (Probability 0.0-1.0)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="1"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* Section 3: Status & Lead */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">상태 (Status)</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">리드 (Lead)</label>
              <select
                name="lead"
                value={formData.lead}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {LEAD_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

           {/* Section 4: Details */}
           <div className="space-y-3">
              <div className="flex items-center gap-2">
                 <input 
                    type="checkbox"
                    name="isBlocker"
                    id="isBlocker"
                    checked={!!formData.isBlocker}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                 />
                 <label htmlFor="isBlocker" className="text-sm font-medium text-slate-700">이 이슈는 전체 펀딩의 블로커(Blocker)입니다</label>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">의존성 내용 (Dependency Description)</label>
                <input
                    name="dependency"
                    value={formData.dependency || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
                    placeholder="Ex: Fintech Thesis required"
                />
              </div>
            </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
             <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">비고 (Notes)</label>
                <textarea
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">업데이트 날짜</label>
                <input
                  type="date"
                  name="lastUpdate"
                  value={formData.lastUpdate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
             </div>
           </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all flex items-center gap-2"
            >
              <Save size={16} />
              저장하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
