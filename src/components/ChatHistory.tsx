import { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../store/sessionStore';
import type { VoiceState } from '../types';
import styles from './ChatHistory.module.css';

interface ChatHistoryProps {
  messages: ChatMessageType[];
  currentMessage?: string; // For word-by-word reveal of current message
  voiceState: VoiceState; // NEW: pass voice state for typing indicator
}

export function ChatHistory({ messages, currentMessage, voiceState }: ChatHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentMessage]);

  // Check if the last message is the same as currentMessage (to avoid duplication)
  const lastMessage = messages[messages.length - 1];
  const showCurrentMessage = currentMessage &&
    (!lastMessage || lastMessage.content !== currentMessage);

  // Determine typing indicator text
  const getTypingText = () => {
    if (voiceState === 'MATH_MATE_SPEAKING') return 'Max is talking...';
    if (voiceState === 'PROCESSING') return 'Max is thinking...';
    return null;
  };

  const typingText = getTypingText();

  return (
    <div className={styles.container} ref={scrollRef}>
      <div className={styles.messageList}>
        <div className={styles.spacer} />
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isCurrentMessage={msg.content === currentMessage}
          />
        ))}
        {/* Show word-by-word reveal for current message if not yet in history */}
        {showCurrentMessage && (
          <ChatMessage
            role="assistant"
            content={currentMessage}
            isCurrentMessage={true}
          />
        )}

        {/* Subtle typing indicator (WhatsApp-style) */}
        {typingText && (
          <div className={styles.typingIndicator}>
            <span className={styles.typingDots}>
              <span></span>
              <span></span>
              <span></span>
            </span>
            <span className={styles.typingText}>{typingText}</span>
          </div>
        )}

        {/* Anchor for scrollIntoView */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
