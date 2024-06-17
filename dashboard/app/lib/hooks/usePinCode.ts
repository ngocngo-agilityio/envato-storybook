// Libs
import { useDisclosure } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

// Constants
import { END_POINTS } from '@/lib/constants';

// Services
import { mainHttpService } from '@/lib/services';

// Types
import { EActivity, TPinCodeForm } from '@/lib/interfaces';
import { logActivity } from '../utils';

export type PinCodeResponse = {
  message: string;
};

export const usePinCode = () => {
  const { mutate: setNewPinCode, isPending: isSetNewPinCode } = useMutation({
    mutationFn: async (data: TPinCodeForm) => {
      const { userId, pinCode } = data || {};

      // await mainHttpService.post<TRecentActivities>({
      //   path: END_POINTS.RECENT_ACTIVITIES,
      //   data: {
      //     userId,
      //     actionName: EActivity.CREATE_PIN_CODE,
      //   },
      // });

      return mainHttpService.post<PinCodeResponse>({
        path: END_POINTS.CREATE_PIN,
        data: {
          pinCode,
          userId,
        },
        userId,
        actionName: EActivity.CREATE_PIN_CODE,
        onActivity: logActivity,
      });
    },
  });

  const { mutate: confirmPinCode, isPending: isConfirmPinCode } = useMutation({
    mutationFn: async (data: TPinCodeForm) => {
      const { userId, pinCode } = data || {};

      // await mainHttpService.post<TRecentActivities>({
      //   path: END_POINTS.RECENT_ACTIVITIES,
      //   data: {
      //     userId,
      //     actionName: EActivity.ACTIVE_PIN_CODE,
      //   },
      // });

      return await mainHttpService.post<PinCodeResponse>({
        path: END_POINTS.CONFIRM_PIN,
        data: {
          pinCode,
          userId,
        },
        actionName: EActivity.ACTIVE_PIN_CODE,
        userId,
        onActivity: logActivity,
      });
    },
  });

  // const handleSetPinCode = useCallback(async (data: TPinCodeForm) => {
  //   try {
  //     return await mainHttpService.post<ResponsePinCode>({
  //       path: END_POINTS.CREATE_PIN,
  //       data: {
  //         pinCode: data.pinCode,
  //         userId: data.userId,
  //       },
  //       actionName: EActivity.CREATE_PIN_CODE,
  //       onActivity: logActivity,
  //     });
  //   } catch (error) {
  //     const { message } = error as AxiosError;

  //     throw new Error(message);
  //   }
  // }, []);

  // const handleConfirmPinCode = useCallback(async (data: TPinCodeForm) => {
  //   try {
  //     return await mainHttpService.post<ResponsePinCode>({
  //       path: END_POINTS.CONFIRM_PIN,
  //       data: {
  //         pinCode: data.pinCode,
  //         userId: data.userId,
  //       },

  //       actionName: EActivity.ACTIVE_PIN_CODE,
  //       userId: data.userId,
  //       onActivity: logActivity,
  //     });
  //   } catch (error) {
  //     const { message } = error as AxiosError;

  //     throw new Error(message);
  //   }
  // }, []);

  const {
    isOpen: isSetPinCodeModalOpen,
    onClose: onCloseSetPinCodeModal,
    onOpen: onOpenSetPinCodeModal,
  } = useDisclosure();

  const {
    isOpen: isConfirmPinCodeModalOpen,
    onClose: onCloseConfirmPinCodeModal,
    onOpen: onOpenConfirmPinCodeModal,
  } = useDisclosure();

  return {
    isSetNewPinCode,
    isConfirmPinCode,
    setNewPinCode,
    confirmPinCode,
    isSetPinCodeModalOpen,
    onCloseSetPinCodeModal,
    onOpenSetPinCodeModal,
    isConfirmPinCodeModalOpen,
    onCloseConfirmPinCodeModal,
    onOpenConfirmPinCodeModal,
  };
};
