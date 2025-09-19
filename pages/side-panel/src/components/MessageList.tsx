import { type Message, Actors } from '@extension/storage';
import { ACTOR_PROFILES } from '../types/message';
import { memo, useState } from 'react';
import Tree from './Tree';

interface MessageListProps {
  messages: Message[];
  isDarkMode?: boolean;
}

interface TreeNode {
  id: string;
  label: React.ReactNode;
  children?: TreeNode[];
}

export default memo(function MessageList({ messages, isDarkMode = false }: MessageListProps) {
  const messageGroups = messages.reduce(
    (acc, message) => {
      if (message.actor === Actors.USER) {
        acc.push({ type: 'user', messages: [message] });
      } else {
        const lastGroup = acc[acc.length - 1];
        if (lastGroup && lastGroup.type === 'system') {
          lastGroup.messages.push(message);
        } else {
          acc.push({ type: 'system', messages: [message] });
        }
      }
      return acc;
    },
    [] as { type: 'user' | 'system'; messages: Message[] }[],
  );

  return (
    <div className="max-w-full space-y-2">
      {messageGroups.map((group, index) => {
        if (group.type === 'user') {
          return group.messages.map(message => (
            <UserMessageBlock key={`${message.actor}-${message.timestamp}`} message={message} isDarkMode={isDarkMode} />
          ));
        }
        const treeData = group.messages.reduce((acc, message) => {
          if (message.actor === Actors.PLANNER || message.actor === Actors.SYSTEM) {
            acc.push({
              id: `${message.actor}-${message.timestamp}`,
              label: message.content,
              children: [],
            });
          } else if (message.actor === Actors.NAVIGATOR && acc.length > 0) {
            const lastNode = acc[acc.length - 1];
            if (lastNode) {
              lastNode.children?.push({
                id: `${message.actor}-${message.timestamp}`,
                label: message.content,
              });
            }
          }
          return acc;
        }, [] as TreeNode[]);
        return <Tree key={index} data={treeData} isDarkMode={isDarkMode} />;
      })}
    </div>
  );
});

function UserMessageBlock({ message, isDarkMode = false }: { message: Message; isDarkMode?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongMessage = message.content.length > 75;

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedContent = isLongMessage && !isExpanded ? `${message.content.substring(0, 75)}...` : message.content;

  return (
    <div className={`flex max-w-full gap-3 rounded-lg p-2 ${isDarkMode ? 'bg-sky-900' : 'bg-sky-50'}`}>
      <div className="min-w-0 flex-1">
        <div>
          <div className={`whitespace-pre-wrap break-words text-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {displayedContent.split('|').map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          {isLongMessage && (
            <button
              onClick={toggleExpansion}
              className={`text-xs ${isDarkMode ? 'text-sky-400 hover:text-sky-300' : 'text-sky-600 hover:text-sky-700'}`}>
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
          <div className={`text-right text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-300'}`}>
            {formatTimestamp(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Formats a timestamp (in milliseconds) to a readable time string
 * @param timestamp Unix timestamp in milliseconds
 * @returns Formatted time string
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();

  // Check if the message is from today
  const isToday = date.toDateString() === now.toDateString();

  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  // Check if the message is from this year
  const isThisYear = date.getFullYear() === now.getFullYear();

  // Format the time (HH:MM)
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isToday) {
    return timeStr; // Just show the time for today's messages
  }

  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  if (isThisYear) {
    // Show month and day for this year
    return `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })}, ${timeStr}`;
  }

  // Show full date for older messages
  return `${date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' })}, ${timeStr}`;
}
