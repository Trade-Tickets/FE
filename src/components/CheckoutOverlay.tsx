import { motion, AnimatePresence } from 'motion/react';
import { Zap, CheckCircle2 } from 'lucide-react';

interface CheckoutOverlayProps {
  isOpen: boolean;
  isSuccess: boolean;
  onClose?: () => void;
  onNavigateVault?: () => void;
}

export function CheckoutOverlay({ isOpen, isSuccess, onClose, onNavigateVault }: CheckoutOverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg relative pointer-events-auto"
          >
                        <div className="absolute inset-0 bg-[#00ff88] translate-x-4 translate-y-4 border-[4px] border-black"></div>

                        <div className="bg-[#edf6f0] border-[4px] border-black p-10 flex flex-col items-center relative z-10 text-center shadow-none">
              {!isSuccess ? (
                 <>
                                      <div className="w-24 h-24 rounded-full border-[6px] border-black flex items-center justify-center mb-6 relative bg-white">
                      <div className="absolute inset-0 rounded-full border-[6px] border-[#00ff88] border-b-transparent border-l-brand-yellow animate-spin"></div>
                      <Zap size={40} className="text-black" strokeWidth={3} fill="currentColor" />
                   </div>

                   <h2 className="text-4xl font-black uppercase mb-4 text-black tracking-tight">Signing Transaction</h2>
                   <p className="text-gray-600 text-lg font-bold mb-8">Broadcasting to the SUI network...</p>

                                      <div className="flex flex-col items-start gap-3 w-full max-w-xs mx-auto text-left font-bold text-gray-500">
                     <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#00ff88] rounded-full border-2 border-black animate-pulse"></div> Verifying ownership</div>
                     <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#00ff88] rounded-full border-2 border-black animate-pulse"></div> Minting ticket NFT</div>
                     <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#00ff88] rounded-full border-2 border-black animate-pulse"></div> Writing to blockchain</div>
                   </div>
                 </>
              ) : (
                 <>
                   <motion.div
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", bounce: 0.6 }}
                     className="w-24 h-24 bg-[#00ff88] border-[4px] border-black flex items-center justify-center mb-6 text-black shadow-[6px_6px_0px_#000]"
                   >
                     <CheckCircle2 size={48} strokeWidth={4} />
                   </motion.div>

                   <h2 className="text-4xl font-black uppercase mb-4 text-black tracking-tighter">Transaction Confirmed!</h2>
                   <p className="text-gray-600 text-lg font-bold mb-8 max-w-sm">Your order has been recorded securely on the SUI blockchain.</p>

                                      <div className="w-full bg-white border-[4px] border-black p-4 text-left mb-8 flex justify-between shadow-[6px_6px_0px_#000]">
                      <div>
                        <p className="font-black text-xl uppercase">SUI Network Sign</p>
                        <p className="text-gray-500 font-bold text-sm">Valid Trade Digest</p>
                        <p className="text-gray-400 font-mono text-xs mt-2 break-all flex items-center gap-1">
                          <span className="text-lg">🔗</span> 0x22c9fa4b47c7a6bf6de230...
                        </p>
                      </div>
                      <div className="bg-[#00ff88] border-[2px] border-black px-2 py-1 h-fit font-black uppercase text-sm shadow-[2px_2px_0px_#000]">
                         FT-6328
                      </div>
                   </div>

                   <div className="flex gap-4 w-full">
                     <button
                       onClick={() => {
                          if(onNavigateVault) onNavigateVault();
                          if(onClose) onClose();
                       }}
                       className="flex-1 bg-black text-white font-black text-lg py-4 border-[4px] border-black uppercase tracking-tight shadow-[6px_6px_0px_#00ff88] hover:translate-y-1 transition-transform"
                     >
                        View Dashboard
                     </button>
                     <button
                       onClick={onClose}
                       className="flex-1 bg-white text-black font-black text-lg py-4 border-[4px] border-black uppercase tracking-tight shadow-[6px_6px_0px_#000] hover:translate-y-1 transition-transform"
                     >
                        Keep Trading
                     </button>
                   </div>
                 </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
