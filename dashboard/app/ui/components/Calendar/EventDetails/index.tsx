// Libs
import { useCallback, memo, useState } from 'react';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import dynamic from 'next/dynamic';

const Modal = dynamic(() => import('@/ui/components/common/Modal'));

const ConfirmDeleteModal = dynamic(
  () => import('@/ui/components/common/Table/Body/ConfirmDeleteModal'),
);

interface EventDetailProps {
  id: string;
  title: string;
  time: string;
  onEdit: (id: string) => void;
  onCancel: () => void;
}

const EventDetailComponent = ({
  id,
  title,
  time,
  onEdit,
  onCancel,
}: EventDetailProps) => {
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);

  const handleToggleConfirmModal = useCallback(() => {
    setIsOpenConfirmModal((prev) => !prev);
  }, []);

  const handleClickEdit = useCallback(() => {
    onEdit(id);
  }, [id, onEdit]);

  // TODO: Update later
  const handleOpenConfirmModal = () => {
    handleToggleConfirmModal();
  };

  return (
    <>
      <Box minW={{ md: 500 }}>
        <Heading>{title}</Heading>
        <Flex gap={{ base: 4, md: 6 }}>
          <Text>{time}</Text>

          <Flex gap={3}>
            <EditIcon
              w={5}
              h={5}
              onClick={handleClickEdit}
              style={{ cursor: 'pointer' }}
            />
            <DeleteIcon
              w={5}
              h={5}
              onClick={handleOpenConfirmModal}
              style={{ cursor: 'pointer' }}
            />
          </Flex>
        </Flex>

        <Flex mt={6} justifyContent="end">
          <Button
            w={{ base: 120, md: 176 }}
            bg="orange.300"
            _hover={{ bg: 'orange.400' }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Flex>
      </Box>

      {isOpenConfirmModal && (
        <Modal
          isOpen={isOpenConfirmModal}
          onClose={handleToggleConfirmModal}
          title="Delete Event"
          body={
            <ConfirmDeleteModal
              itemName="ddd"
              onDeleteProduct={() => {}}
              onCloseModal={handleToggleConfirmModal}
            />
          }
          haveCloseButton
        />
      )}
    </>
  );
};

const EventDetail = memo(EventDetailComponent);

export default EventDetail;
