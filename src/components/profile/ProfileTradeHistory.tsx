import { useEffect, useState } from 'react';
import { Clock, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchWalletTrades, type TradeRecord } from '../../api/backendApi';
import { useAppStore } from '../../store';
import { Pagination } from '../Pagination';

interface ProfileTradeHistoryProps {
  walletAddress: string;
}

export function ProfileTradeHistory({ walletAddress }: ProfileTradeHistoryProps) {
  const { orders } = useAppStore();
  const [trades, setTrades] = useState<TradeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  const loadTrades = () => {
    setLoading(true);
    setError(false);
    fetchWalletTrades(walletAddress)
      .then(data => {
        setTrades(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!walletAddress) return;
    loadTrades();
  }, [walletAddress]);

  // Fallback: use local orders from zustand store if BE is offline
  const localOrders = orders.filter(o => o.status === 'filled');

  const displayTrades = !error && trades.length > 0
    ? trades
    : null; // null = use fallback

  const hasFallback = localOrders.length > 0;

  const paginated = displayTrades
    ? displayTrades.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
    : localOrders.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const total = displayTrades ? displayTrades.length : localOrders.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_#000] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 font-black uppercase text-xl">
          <Clock size={24} /> Trade History
          {!error && trades.length > 0 && (
            <span className="ml-2 bg-brand-green border-[2px] border-black px-2 py-0.5 text-xs font-black">
              {trades.length} lệnh
            </span>
          )}
        </div>
        <button
          onClick={loadTrades}
          className="flex items-center gap-1 px-3 py-1 border-[2px] border-black font-bold text-sm hover:bg-gray-100 transition-colors"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Offline notice */}
      {error && hasFallback && (
        <div className="flex items-center gap-2 bg-yellow-50 border-[2px] border-yellow-400 p-3 mb-4 text-sm font-bold text-yellow-700">
          <AlertCircle size={16} />
          Backend offline — hiển thị dữ liệu local (chưa đồng bộ)
        </div>
      )}

      {error && !hasFallback && (
        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
          <AlertCircle size={36} />
          <p className="font-black uppercase">Không thể kết nối backend</p>
          <p className="text-sm font-bold">Hãy đảm bảo BE đang chạy tại localhost:8080</p>
          <button onClick={loadTrades} className="mt-2 bg-black text-white px-4 py-2 font-black border-[2px] border-black hover:opacity-80">
            Thử lại
          </button>
        </div>
      )}

      {loading && (
        <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw size={32} className="animate-spin" />
          <p className="font-bold uppercase">Đang tải lịch sử giao dịch...</p>
        </div>
      )}

      {!loading && (paginated.length > 0 ? (
        <>
          <div className="border-[3px] border-black overflow-hidden">
            {/* Table Header */}
            <div className="flex bg-gray-100 border-b-[2px] border-black p-3 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <div className="flex-1">Sự kiện / Loại vé</div>
              <div className="w-16 text-center">Loại</div>
              <div className="w-20 text-right">Giá</div>
              <div className="w-12 text-right">SL</div>
              <div className="w-24 text-right">Tổng</div>
              <div className="w-28 text-right text-[9px]">Thời gian</div>
            </div>

            {/* Rows */}
            <div className="divide-y-[1px] divide-gray-100 flex flex-col">
              {paginated.map((item, i) => {
                // Handle both BE TradeRecord and local Order formats
                const isBERecord = 'tradeType' in item;
                const tradeType = isBERecord ? (item as TradeRecord).tradeType : (item as typeof localOrders[0]).type;
                const isBuy = tradeType === 'buy';

                const eventTitle = isBERecord
                  ? (item as TradeRecord).eventTitle || 'Unknown Event'
                  : `Event ${(item as typeof localOrders[0]).eventId.slice(-4)}`;

                const ticketClass = isBERecord
                  ? (item as TradeRecord).ticketClass
                  : (item as typeof localOrders[0]).ticketClass;

                const priceSui = isBERecord
                  ? Number((item as TradeRecord).priceSui)
                  : (item as typeof localOrders[0]).priceSui;

                const qty = isBERecord
                  ? (item as TradeRecord).quantity
                  : (item as typeof localOrders[0]).quantity;

                const totalCost = isBERecord
                  ? Number((item as TradeRecord).totalCost)
                  : priceSui * qty;

                const createdAt = isBERecord
                  ? new Date((item as TradeRecord).createdAt)
                  : new Date((item as typeof localOrders[0]).createdAt);

                return (
                  <div key={i} className={`flex p-3 hover:bg-gray-50 items-center text-sm ${isBuy ? 'bg-green-50/30' : 'bg-red-50/30'}`}>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{eventTitle}</div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase">{ticketClass}</div>
                    </div>
                    <div className="w-16 text-center">
                      <span className={`px-1.5 py-0.5 border-[2px] border-black font-black text-[10px] uppercase ${isBuy ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {isBuy ? 'Mua' : 'Bán'}
                      </span>
                    </div>
                    <div className="w-20 text-right font-mono font-bold text-sm">{priceSui.toFixed(4)}</div>
                    <div className="w-12 text-right font-mono text-gray-500">{qty}</div>
                    <div className={`w-24 text-right font-mono font-black ${isBuy ? 'text-red-600' : 'text-green-600'}`}>
                      {isBuy ? '-' : '+'}{totalCost.toFixed(4)}
                    </div>
                    <div className="w-28 text-right text-[10px] text-gray-400 font-medium">
                      {createdAt.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 mt-6 w-full">
              <Pagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={(p) => setPage(p)} 
              />
              <span className="text-xs font-bold text-gray-500 text-center">
                Trang {page + 1} / {totalPages} &nbsp;·&nbsp; {total} giao dịch
              </span>
            </div>
          )}
        </>
      ) : (
        !error && (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <Clock size={36} />
            <p className="font-black uppercase">Chưa có giao dịch nào</p>
            <p className="text-sm font-bold">Hãy mua hoặc bán vé để xem lịch sử tại đây</p>
          </div>
        )
      ))}
    </div>
  );
}
