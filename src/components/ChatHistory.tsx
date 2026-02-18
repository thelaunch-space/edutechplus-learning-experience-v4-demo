import React, { useEffect, useRef } from 'react';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../store/sessionStore';
import type { VoiceState } from '../types';
import styles from './ChatHistory.module.css';

interface ChatHistoryProps {
  messages: ChatMessageType[];
  currentMessage?: string; // For word-by-word reveal of current message
  voiceState: VoiceState; // Pass voice state for typing indicator
  currentSpeaker: 'max' | 'spark'; // Who is currently speaking (for live message)
}

export function ChatHistory({ messages, currentMessage, voiceState, currentSpeaker }: ChatHistoryProps) {
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
    if (voiceState === 'MATH_MATE_SPEAKING') return currentSpeaker === 'spark' ? 'Spark is talking...' : 'Max is talking...';
    if (voiceState === 'PROCESSING') return 'Max is thinking...';
    return null;
  };

  const typingText = getTypingText();

  return (
    <div className={styles.container} ref={scrollRef}>
      <div className={styles.messageList}>
        <div className={styles.spacer} />
        {messages.map((msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : null;
          const showSeparator = prevMsg && prevMsg.nodeIndex !== msg.nodeIndex;

          return (
            <React.Fragment key={msg.id}>
              {showSeparator && (
                <div className={styles.nodeSeparator}>
                  <span className={styles.separatorLine} />
                </div>
              )}
              <ChatMessage
                role={msg.role}
                content={msg.content}
                speaker={msg.speaker}
                isCurrentMessage={msg.content === currentMessage}
              />
            </React.Fragment>
          );
        })}
        {/* Show word-by-word reveal for current message if not yet in history */}
        {showCurrentMessage && (
          <ChatMessage
            role="assistant"
            content={currentMessage}
            speaker={currentSpeaker}
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
