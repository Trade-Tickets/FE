import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, CornerDownRight, Send, MessageSquare } from 'lucide-react';
import type { Comment } from '../../types';

function CommentNode({ comment, depth = 0, onReply, onLike }: {
  comment: Comment;
  depth?: number;
  onReply: (parentId: string, text: string) => void;
  onLike: (commentId: string) => void;
}) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isNested = depth > 0;

  return (
    <div className={`flex flex-col ${isNested ? 'mt-3 pl-2 sm:pl-6 border-l-[3px] border-black border-dashed' : 'mb-6'}`}>
      <div className="flex gap-3">
        {!isNested ? (
          <img src={comment.avatar} alt="avatar" className="w-10 h-10 border-[2px] border-black rounded-full bg-brand-yellow shrink-0" />
        ) : (
          <CornerDownRight size={18} strokeWidth={3} className="text-gray-400 shrink-0 mt-1" />
        )}

        <div className="flex-1">
          <div className="bg-brand-bg border-[3px] border-black p-3 relative shadow-[4px_4px_0px_#000]">
            {isNested && (
              <img src={comment.avatar} alt="avatar" className="absolute -left-[20px] -top-[10px] w-6 h-6 border-[2px] border-black rounded-full bg-brand-pink z-10" />
            )}
            <div className="flex items-center justify-between mb-1">
              <span className="font-black text-sm">{comment.author}</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase">{comment.timestamp}</span>
            </div>
            <p className="text-gray-800 text-sm font-bold">{comment.content}</p>
          </div>

          <div className="flex items-center gap-4 mt-2 px-1">
            <button
              onClick={() => onLike(comment.id)}
              className="flex items-center gap-1 font-bold text-xs uppercase text-gray-500 hover:text-brand-purple transition-colors active:scale-90"
            >
              <ThumbsUp size={12} strokeWidth={3} /> {comment.likes}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="font-bold text-xs uppercase text-gray-500 hover:text-brand-blue transition-colors"
            >
              Reply
            </button>
          </div>

          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={`Replying to ${comment.author}...`}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="flex-1 text-sm border-[2px] border-black p-2 font-mono outline-none focus:bg-yellow-50"
                  />
                  <button
                    onClick={() => {
                      if (replyText.trim()) {
                        onReply(comment.id, replyText);
                        setIsReplying(false);
                        setReplyText('');
                      }
                    }}
                    className="bg-brand-green border-[2px] border-black px-3 flex items-center justify-center hover:bg-green-400 active:translate-y-1 transition-all"
                  >
                    <Send size={14} strokeWidth={3} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 text-sm">
              {comment.replies.map(reply => (
                <CommentNode key={reply.id} comment={reply} depth={depth + 1} onReply={onReply} onLike={onLike} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DiscussionSectionProps {
  comments: Comment[];
  totalCount: number;
  newCommentText: string;
  onNewCommentChange: (text: string) => void;
  onAddComment: () => void;
  onReply: (parentId: string, text: string) => void;
  onLike: (commentId: string) => void;
}

export function DiscussionSection({ comments, totalCount, newCommentText, onNewCommentChange, onAddComment, onReply, onLike }: DiscussionSectionProps) {
  return (
    <section className="border-t-[4px] border-dashed border-gray-300 pt-8 mt-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-black uppercase inline-block border-b-[4px] border-[#356ee7] pb-1 tracking-wides flex items-center gap-2">
          <MessageSquare strokeWidth={3} /> Discussion
        </h3>
        <span className="font-bold border-[2px] border-black px-2 py-0.5 bg-brand-yellow text-xs neo-box uppercase">{totalCount} Comments</span>
      </div>

            <div className="flex gap-3 mb-8">
        <div className="w-10 h-10 border-[3px] border-black rounded-full bg-brand-pink flex items-center justify-center shrink-0">
          <span className="font-black text-xs">YOU</span>
        </div>
        <div className="flex-1 flex flex-col items-end gap-2">
          <textarea
            placeholder="Join the conversation..."
            value={newCommentText}
            onChange={(e) => onNewCommentChange(e.target.value)}
            className="w-full border-[3px] border-black p-3 font-mono font-bold text-sm resize-none h-20 outline-none focus:bg-blue-50 transition-colors shadow-[4px_4px_0px_#000]"
          ></textarea>
          <button
            onClick={onAddComment}
            className="bg-brand-blue text-white border-[3px] border-black px-4 py-1.5 font-black uppercase text-xs shadow-[2px_2px_0px_#000] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all"
          >
            Post Comment
          </button>
        </div>
      </div>

            <div className="flex flex-col">
        {comments.map(comment => (
          <CommentNode key={comment.id} comment={comment} onReply={onReply} onLike={onLike} />
        ))}
      </div>
    </section>
  );
}
