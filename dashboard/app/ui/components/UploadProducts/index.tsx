// Libs
import React, { memo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Text,
  Input,
  ResponsiveValue,
  FormLabel,
  Image,
  Flex,
} from '@chakra-ui/react';

// Components
import { Loading } from '..';

// Constants
import { IMAGES } from '@/lib/constants';

// Services
import { useImageUploader } from '@/lib/hooks';

export type TUploadImageProductsProps = {
  label: string;
  isError?: boolean;
  images?: string[];
  onUploadError: (message: string) => void;
  onChange: (value: string[]) => void;
};

const UploadProductsComponent = ({
  label,
  images = [],
  isError = false,
  onChange,
  onUploadError,
}: TUploadImageProductsProps) => {
  const [previewURL, setPreviewURL] = useState<string[]>(images);
  const { onDrop } = useImageUploader({
    onChange,
    onUploadError,
    setPreviewURL,
  });

  const { getRootProps, getInputProps, isFileDialogActive } = useDropzone({
    onDrop,
  });

  return (
    <Flex w="100%" flexDirection="column">
      <FormLabel
        htmlFor="file"
        cursor="pointer"
        color="text.secondary"
        marginInlineEnd={0}
        minW="max-content"
      >
        {label}
        <Flex mt="20px" flexDirection="column" alignItems="center" gap={3}>
          {isFileDialogActive && <Loading />}
          <Flex
            alignItems="center"
            justify="center"
            gap={3}
            w={{ base: 320, md: 474 }}
            flexWrap="wrap"
          >
            {previewURL
              .slice(0, 3)
              ?.map((v) => (
                <Image
                  key={v}
                  w={{ base: 320, md: 150 }}
                  h={{ base: 320, md: 150 }}
                  src={v || IMAGES.SIGN_UP.url}
                  alt={IMAGES.AVATAR_SIGN_UP.alt}
                  fallbackSrc={IMAGES.SIGN_UP.url}
                  borderRadius={20}
                  objectFit="contain"
                />
              ))}
          </Flex>
          <Flex alignItems="center" gap={3}>
            {previewURL
              .slice(3, 5)
              ?.map((v) => (
                <Image
                  key={v}
                  w={{ base: 100, md: 150 }}
                  h={{ base: 100, md: 150 }}
                  src={v || IMAGES.SIGN_UP.url}
                  alt={IMAGES.AVATAR_SIGN_UP.alt}
                  fallbackSrc={IMAGES.SIGN_UP.url}
                />
              ))}
          </Flex>
        </Flex>
      </FormLabel>
      <Box
        {...getRootProps()}
        border="1px"
        borderColor={isError ? 'primary.200' : 'primary.600'}
        borderRadius="md"
        p={4}
        textAlign="center"
        cursor="pointer"
        _hover={{ borderColor: 'green.500' }}
        bg="background.body.primary"
      >
        <Input
          {...getInputProps()}
          size={undefined as ResponsiveValue<string> | undefined}
          data-testid="field-image"
        />

        <Text>Drag drop some files here, or click to select files</Text>
      </Box>
    </Flex>
  );
};

const UploadProducts = memo(UploadProductsComponent);

export default UploadProducts;
