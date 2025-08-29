import React, { FC } from 'react'
import { SharedStateProvider } from './SharedContext'
import UserBottomTab from './UserBottomTab'
import FloatingChatBot from '@/components/chatbot/FloatingChatBot';

const AnimatedTab:FC = () => {
  return (
    <SharedStateProvider>
      <UserBottomTab />
      <FloatingChatBot />
    </SharedStateProvider>
  );
}

export default AnimatedTab