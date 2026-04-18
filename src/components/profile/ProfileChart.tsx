import { Activity } from 'lucide-react';

export function ProfileChart() {
  return (
    <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
      <div className="flex items-center gap-2 font-black uppercase border-b-[4px] border-black pb-4 mb-4">
        <Activity size={20} /> Trading Journey (30D)
      </div>
      <div className="w-full h-32 border-[3px] border-black bg-[#f0f9ff] relative overflow-hidden">
        <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M 0 30 L 0 25 L 10 22 L 20 28 L 30 20 L 40 24 L 50 15 L 60 12 L 70 18 L 80 8 L 90 10 L 100 2 L 100 30 Z"
            fill="#22c55e" fillOpacity="0.2"
          />
          <path
            d="M 0 25 L 10 22 L 20 28 L 30 20 L 40 24 L 50 15 L 60 12 L 70 18 L 80 8 L 90 10 L 100 2"
            fill="none" stroke="#22c55e" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round"
          />
          <circle cx="100" cy="2" r="3" fill="white" stroke="#22c55e" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
    </div>
  );
}
