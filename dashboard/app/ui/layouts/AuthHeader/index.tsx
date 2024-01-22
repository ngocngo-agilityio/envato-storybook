import { Heading as HeadingChakra, Text, VStack } from '@chakra-ui/react';
import { memo } from 'react';

type THeadingProps = {
  title: string;
  isForgotPasswordPage?: boolean;
};

const AuthHeaderComponent = ({
  title,
  isForgotPasswordPage = false,
}: THeadingProps): JSX.Element => (
  <VStack as="header">
    <HeadingChakra
      as="h1"
      fontSize={{ base: '3xl', md: '4xl' }}
      fontFamily="secondary"
      fontWeight="semibold"
      textAlign="center"
    >
      {title}
    </HeadingChakra>
    {!isForgotPasswordPage && (
      <Text fontSize="md" color="text.secondary" fontWeight="medium">
        Send, spend and save smarter
      </Text>
    )}
  </VStack>
);

const Heading = memo(AuthHeaderComponent);

export default Heading;
