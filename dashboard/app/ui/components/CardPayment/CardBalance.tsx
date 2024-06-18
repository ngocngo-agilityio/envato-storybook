import { ReactElement, memo, useCallback, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {
  Center,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

// Components
import { Eye, EyeSlash } from '@/ui/components/Icons';
import { Modal, PinCode } from '..';

// Constants
import {
  ERROR_MESSAGES,
  IMAGES,
  STATUS,
  SUCCESS_MESSAGES,
} from '@/lib/constants';

// Hooks
import { useAuth, usePinCode } from '@/lib/hooks';

// Store
import { TAuthStoreData, authStore } from '@/lib/stores';

// Utils
import { customToast, formatDecimalNumber } from '@/lib/utils';

// Types
import { TPinCodeForm, TUserDetail } from '@/lib/interfaces';

type TBalanceStatus = {
  balance: string;
  iconBalance: ReactElement;
};

export type TCardProps = {
  balance: number;
  userPinCode: string;
  isLoadingConfirmPinCode: boolean;
  isLoadingSetPinCode: boolean;
  onConfirmPinCode: (pinCode: string, callback: () => void) => void;
  onSetNewPinCode: (pinCode: string, callback: () => void) => void;
};
const Card = ({
  balance,
  userPinCode,
  isLoadingConfirmPinCode,
  isLoadingSetPinCode,
  onConfirmPinCode,
  onSetNewPinCode,
}: TCardProps) => {
  const { isOpen: isShowBalance, onToggle: onToggleShowBalance } =
    useDisclosure({ defaultIsOpen: true });

  const {
    // isSetNewPinCode,
    // isConfirmPinCode,
    // setNewPinCode,
    // confirmPinCode,
    isConfirmPinCodeModalOpen,
    isSetPinCodeModalOpen,
    onCloseConfirmPinCodeModal,
    onCloseSetPinCodeModal,
    onOpenConfirmPinCodeModal,
    onOpenSetPinCodeModal,
  } = usePinCode();

  const { iconBalance, balance: balanceStatus }: TBalanceStatus = {
    iconBalance: isShowBalance ? <EyeSlash /> : <Eye />,
    balance: isShowBalance ? '******' : `$${formatDecimalNumber(balance)}`,
  };

  const {
    control: setPinCodeControl,
    handleSubmit: handleSubmitSetPinCode,
    formState: { isValid: isSetValid },
    reset: resetSetPinCodeForm,
  } = useForm<TPinCodeForm>({});

  const {
    control: confirmPinCodeControl,
    handleSubmit: handleSubmitConfirmPinCode,
    formState: { isValid: isConfirmValid },
    reset: resetConfirmPinCodeForm,
  } = useForm<TPinCodeForm>({
    defaultValues: {
      pinCode: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  // const user = authStore((state): TAuthStoreData['user'] => state.user);

  // const { setUser } = useAuth();

  // const toast = useToast();

  const handleToggleShowBalance = useCallback(() => {
    if (!isShowBalance) {
      onToggleShowBalance();

      return;
    }

    !userPinCode ? onOpenSetPinCodeModal() : onOpenConfirmPinCodeModal();
  }, [
    isShowBalance,
    onOpenConfirmPinCodeModal,
    onOpenSetPinCodeModal,
    onToggleShowBalance,
    userPinCode,
  ]);

  // const handleSetNewPinCodeSuccess = useCallback(
  //   (user: Omit<TUserDetail, 'password'>, pinCode: string) => {
  //     setUser({ user: { ...user, pinCode } });
  //     onCloseSetPinCodeModal();
  //     resetSetPinCodeForm();

  //     toast(
  //       customToast(
  //         SUCCESS_MESSAGES.SET_PIN_CODE.title,
  //         SUCCESS_MESSAGES.SET_PIN_CODE.description,
  //         STATUS.SUCCESS,
  //       ),
  //     );
  //   },
  //   [onCloseSetPinCodeModal, resetSetPinCodeForm, setUser, toast],
  // );

  // const handleSetNewPinCodeError = useCallback(() => {
  //   toast(
  //     customToast(
  //       ERROR_MESSAGES.SET_PIN_CODE.title,
  //       ERROR_MESSAGES.SET_PIN_CODE.description,
  //       STATUS.ERROR,
  //     ),
  //   );
  // }, [toast]);

  // const handleConfirmPinCodeSuccess = useCallback(async () => {
  //   onCloseConfirmPinCodeModal();
  //   resetConfirmPinCodeForm({
  //     pinCode: '',
  //   });
  //   onToggleShowBalance();

  //   toast(
  //     customToast(
  //       SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
  //       SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
  //       STATUS.SUCCESS,
  //     ),
  //   );
  // }, [
  //   onCloseConfirmPinCodeModal,
  //   onToggleShowBalance,
  //   resetConfirmPinCodeForm,
  //   toast,
  // ]);

  // const handleConfirmPinCodeError = useCallback(() => {
  //   toast(
  //     customToast(
  //       ERROR_MESSAGES.CONFIRM_PIN_CODE.title,
  //       ERROR_MESSAGES.CONFIRM_PIN_CODE.description,
  //       STATUS.ERROR,
  //     ),
  //   );
  //   resetConfirmPinCodeForm();
  // }, [resetConfirmPinCodeForm, toast]);

  const onSubmitPinCode: SubmitHandler<TPinCodeForm> = useCallback(
    async (data) => {
      const pinCode = data.pinCode;
      userPinCode
        ? onConfirmPinCode(pinCode, resetConfirmPinCodeForm)
        : onSetNewPinCode(pinCode, resetSetPinCodeForm);

      // if (user) {
      //   data.userId = user.id;
      //   if (!user?.pinCode) {
      //     setNewPinCode(data, {
      //       onSuccess: () => handleSetNewPinCodeSuccess(user, data.pinCode),
      //       onError: handleSetNewPinCodeError,
      //     });
      // try {
      //   await handleSetPinCode(data);
      //   setUser({ user: { ...user, pinCode: data.pinCode } });
      //   onCloseSetPinCodeModal();
      //   resetSetPinCodeForm();
      //   toast(
      //     customToast(
      //       SUCCESS_MESSAGES.SET_PIN_CODE.title,
      //       SUCCESS_MESSAGES.SET_PIN_CODE.description,
      //       STATUS.SUCCESS,
      //     ),
      //   );
      // } catch (error) {
      //   toast(
      //     customToast(
      //       SUCCESS_MESSAGES.SET_PIN_CODE.title,
      //       SUCCESS_MESSAGES.SET_PIN_CODE.description,
      //       STATUS.SUCCESS,
      //     ),
      //   );
      // }
      // } else {
      //   confirmPinCode(data, {
      //     onSuccess: handleConfirmPinCodeSuccess,
      //     onError: handleConfirmPinCodeError,
      //   });
      // try {
      //   await handleConfirmPinCode(data);
      //   onCloseConfirmPinCodeModal();
      //   resetConfirmPinCodeForm({
      //     pinCode: '',
      //   });
      //   onToggleShowBalance();
      //   toast(
      //     customToast(
      //       SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
      //       SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
      //       STATUS.SUCCESS,
      //     ),
      //   );
      // } catch (error) {
      //   toast(
      //     customToast(
      //       ERROR_MESSAGES.CONFIRM_PIN_CODE.title,
      //       ERROR_MESSAGES.CONFIRM_PIN_CODE.description,
      //       STATUS.ERROR,
      //     ),
      //   ),
      //     resetConfirmPinCodeForm();
      // }
      //   }
      // }
    },
    [
      onConfirmPinCode,
      onSetNewPinCode,
      resetConfirmPinCodeForm,
      resetSetPinCodeForm,
      userPinCode,
    ],
  );

  const handleCloseSetPinCodeModal = useCallback(() => {
    onCloseSetPinCodeModal();
    resetSetPinCodeForm();
  }, [onCloseSetPinCodeModal, resetSetPinCodeForm]);

  const handleCloseConfirmPinCodeModal = useCallback(() => {
    onCloseConfirmPinCodeModal();
    resetConfirmPinCodeForm();
  }, [onCloseConfirmPinCodeModal, resetConfirmPinCodeForm]);

  const pinCodeModalBody = useMemo(
    () =>
      userPinCode ? (
        <PinCode
          control={confirmPinCodeControl}
          isDisabled={!isConfirmValid || isLoadingConfirmPinCode}
          isLoading={isLoadingConfirmPinCode}
          onSubmit={handleSubmitConfirmPinCode(onSubmitPinCode)}
          onClose={handleCloseConfirmPinCodeModal}
        />
      ) : (
        <PinCode
          control={setPinCodeControl}
          isDisabled={!isSetValid || isLoadingSetPinCode}
          isLoading={isLoadingSetPinCode}
          onSubmit={handleSubmitSetPinCode(onSubmitPinCode)}
          onClose={handleCloseSetPinCodeModal}
        />
      ),
    [
      confirmPinCodeControl,
      handleCloseConfirmPinCodeModal,
      handleCloseSetPinCodeModal,
      handleSubmitConfirmPinCode,
      handleSubmitSetPinCode,
      isConfirmValid,
      isLoadingConfirmPinCode,
      isLoadingSetPinCode,
      isSetValid,
      onSubmitPinCode,
      setPinCodeControl,
      userPinCode,
    ],
  );

  return (
    <>
      <Center>
        <Flex
          flexDir="column"
          bgImage={IMAGES.CARD_PAYMENT.url}
          justifyContent="flex-end"
          borderRadius="lg"
          bgPosition="center"
          bgSize={{ base: 'cover', sm: 'unset' }}
          bgRepeat="no-repeat"
          p={2}
          w={{ base: '100%', sm: 340 }}
          h={{ base: 180, sm: 200 }}
        >
          <Flex alignItems="center" gap={{ base: 1, sm: 3 }}>
            <Text variant="textSm" color="secondary.300">
              Balance
            </Text>
            <IconButton
              aria-label="eye"
              data-testid="btn-eye"
              icon={iconBalance}
              w="fit-content"
              bg="none"
              onClick={handleToggleShowBalance}
              sx={{
                _hover: {
                  bg: 'none',
                },
              }}
            />
          </Flex>
          <Text
            color="common.white"
            variant="text3Xl"
            fontWeight="semibold"
            fontSize={{ base: 'md', sm: '3xl' }}
            lineHeight={{ base: 'unset', sm: 'lg' }}
          >
            {balanceStatus}
          </Text>
        </Flex>
      </Center>

      {/*Set PIN code Modal */}
      {isSetPinCodeModalOpen && (
        <Modal
          title="Please set the PIN code to your account"
          isOpen={isSetPinCodeModalOpen}
          onClose={handleCloseSetPinCodeModal}
          body={pinCodeModalBody}
        />
      )}

      {/*Confirm PIN code Modal */}
      {isConfirmPinCodeModalOpen && (
        <Modal
          title="Please enter your PIN code"
          isOpen={isConfirmPinCodeModalOpen}
          onClose={handleCloseConfirmPinCodeModal}
          body={pinCodeModalBody}
        />
      )}
    </>
  );
};

const CardBalance = memo(Card);

export default CardBalance;
