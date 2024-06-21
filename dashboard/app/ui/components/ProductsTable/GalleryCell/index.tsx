// Libs
import { memo } from 'react';
import { Box, Flex, Td } from '@chakra-ui/react';
import Image from 'next/image';
import isEqual from 'react-fast-compare';

// Constants
import { IMAGES } from '@/lib/constants';

// Utils
import { generatePlaceholder } from '@/lib/utils';

interface Props {
  imageURLs?: string[];
  name: string;
}

const GalleryCell = ({ imageURLs = [], name }: Props) => (
  <Td
    py={5}
    pr={5}
    pl={0}
    fontSize="md"
    color="text.primary"
    fontWeight="semibold"
    textAlign="left"
    w={{ base: 150, md: 20 }}
  >
    <Flex
      alignItems="center"
      gap="10px"
      minW={180}
      borderRadius="15px"
      w={{ base: 100, '3xl': 150, '5xl': 250 }}
    >
      <Box pos="relative" w={{ base: 50, lg: 100 }} h={{ base: 50, lg: 100 }}>
        <Image
          src={imageURLs.toString() || IMAGES.SIGN_UP.url}
          alt={`Image of ${name}`}
          fill
          sizes="100vw"
          placeholder="blur"
          blurDataURL={generatePlaceholder(40, 40)}
          style={{
            objectFit: 'cover',
            borderRadius: '15px',
          }}
        />
      </Box>
    </Flex>
  </Td>
);

const GalleryCellMemorized = memo(GalleryCell, isEqual);

export default GalleryCellMemorized;
