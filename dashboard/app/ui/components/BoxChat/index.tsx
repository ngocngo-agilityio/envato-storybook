'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { Box, Heading, Flex } from '@chakra-ui/react';

// Components
import Message from './Message';

// Components
import { InputSendMessages } from '@/ui/components';

// Interface
import { TMessages } from '@/lib/interfaces';

// Stores
import { authStore } from '@/lib/stores';

// Hooks
import { getCurrentUser } from '@/lib/hooks';

// Firebase
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/utils';
import { AUTHENTICATION_ROLE, FIREBASE_CHAT } from '@/lib/constants';

const initialUserChat = {
  roomChatId: '',
  userId: '',
  adminId: '',
  avatarUrl: '',
  avatarAdminUrl: '',
  displayName: '',
};

const BoxChatComponent = () => {
  const [messages, setMessages] = useState<TMessages[]>([]);
  const user = authStore((state) => state.user);
  const hasPermission = user?.role === AUTHENTICATION_ROLE.MEMBER;
  const [userChat, setUserChat] = useState(initialUserChat);
  const boxRef = useRef<HTMLDivElement | null>(null);

  const fetchData = async () => {
    // Get user data
    const usersData = await getCurrentUser(user);

    // Check if usersData is undefined before accessing its properties
    if (usersData) {
      const res = await getDoc(
        doc(db, FIREBASE_CHAT.CHATS, usersData.roomChatId),
      );

      setUserChat(usersData);
      res.exists() && setMessages(res.data().messages);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!userChat.roomChatId) return;
    const unSub = onSnapshot(
      doc(db, FIREBASE_CHAT.CHATS, userChat.roomChatId),
      (doc) => {
        doc.exists() && setMessages(doc.data().messages);
      },
    );

    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }

    return () => {
      unSub();
    };
  }, [userChat.roomChatId]);

  return (
    hasPermission && (
      <Box w="full" bg="background.body.quaternary" borderRadius="lg">
        <Flex
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          justify="center"
          borderBottom="1px solid"
          borderBottomColor="border.tertiary"
          padding="24px 26px"
        >
          <Heading
            as="h3"
            fontWeight="semibold"
            color="text.primary"
            fontSize="2xl"
            textTransform="capitalize"
          >
            team chat
          </Heading>
        </Flex>

        <Box padding={{ base: '24px 20px', lg: '45px 35px' }}>
          <Box
            ref={boxRef}
            overflowX="auto"
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': {
                width: 2,
              },
              '&::-webkit-scrollbar-track': {
                width: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray',
                borderRadius: '24px',
              },
            }}
            maxHeight={361}
            padding={5}
          >
            {messages.map((message) => (
              <Message
                content={message.text}
                key={message.date.seconds}
                senderId={message.senderId}
                avatarAdmin={userChat.avatarAdminUrl}
                avatarUser={userChat.avatarUrl}
              />
            ))}
          </Box>
          <InputSendMessages boxRef={boxRef} />
        </Box>
      </Box>
    )
  );
};

const BoxChat = memo(BoxChatComponent);

export default BoxChat;
