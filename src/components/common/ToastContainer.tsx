import { AnimatePresence, motion } from 'motion/react';
import { Info, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useAppStore } from '../../store';

export function ToastContainer() {
  const { notifications, removeNotification } = useAppStore();

  return (
    <div className="fixed top-24 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map(n => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-center justify-between p-4 border-[3px] border-black shadow-[4px_4px_0px_#000] w-[320px] bg-white ${n.type === 'success' ? 'border-l-brand-green border-l-8' : n.type === 'error' ? 'border-l-[#ff5f56] border-l-8' : 'border-l-brand-blue border-l-8'}`}
          >
            <div className="flex items-center gap-3">
              {n.type === 'success' && <CheckCircle2 className="text-brand-green shrink-0" strokeWidth={3} />}
              {n.type === 'error' && <AlertCircle className="text-[#ff5f56] shrink-0" strokeWidth={3} />}
              {n.type === 'info' && <Info className="text-brand-blue shrink-0" strokeWidth={3} />}
              <p className="font-bold text-sm uppercase tracking-tight">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="shrink-0 hover:opacity-50">
              <X size={16} strokeWidth={3} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
