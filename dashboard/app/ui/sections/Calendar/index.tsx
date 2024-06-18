'use client';

// Libs
import { useCallback, useId, useMemo, useState } from 'react';
import { Box, Grid, GridItem, useToast } from '@chakra-ui/react';
import { InView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

// Hooks
import { useAuth, useEvents, usePinCode } from '@/lib/hooks';

// Types
import { TEvent, TPinCodeForm, TUserDetail } from '@/lib/interfaces';

// Constants
import { ERROR_MESSAGES, STATUS, SUCCESS_MESSAGES } from '@/lib/constants';

// Utils
import { customToast } from '@/lib/utils';

// Components
import { Calendar } from '@/ui/components';
import { TAuthStoreData, authStore } from '@/lib/stores';

// dynamic loading components
const CardPayment = dynamic(() => import('@/ui/components/CardPayment'));

const CalendarSection = () => {
  const toast = useToast();
  const [date, setDate] = useState(new Date());

  // Stores
  const user = authStore((state): TAuthStoreData['user'] => state.user);
  const { setUser } = useAuth();

  // Events
  const {
    data: events = [],
    isLoading: isLoadingEvents,
    isAddEvent,
    addEvent,
    isUpdateEvent,
    updateEvent,
    isDeleteEvent,
    deleteEvent,
  } = useEvents();

  // Pin code
  const {
    isSetNewPinCode,
    isConfirmPinCode,
    setNewPinCode,
    confirmPinCode,
    onCloseSetPinCodeModal,
    onCloseConfirmPinCodeModal,
  } = usePinCode();

  const { pinCode = '', id: userId = '' } = user || {};

  const isLoading =
    isLoadingEvents || isAddEvent || isUpdateEvent || isDeleteEvent;

  const formattedEvents = useMemo(
    () =>
      events.map((event) => {
        const { eventName = '', startTime, endTime } = event || {};

        return {
          ...event,
          title: eventName,
          start: dayjs(startTime).toDate(),
          end: dayjs(endTime).toDate(),
        };
      }),
    [events],
  );

  const handleAddEventSuccess = useCallback(
    (eventDate: Date) => {
      setDate(eventDate);

      toast(
        customToast(
          SUCCESS_MESSAGES.CREATE_EVENT_SUCCESS.title,
          SUCCESS_MESSAGES.CREATE_EVENT_SUCCESS.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [toast],
  );

  const handleAddEventError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.CREATE_EVENT_FAIL.title,
        ERROR_MESSAGES.CREATE_EVENT_FAIL.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleAddEvent = useCallback(
    (data: Omit<TEvent, '_id'>) => {
      const { startTime } = data;
      const eventDate = new Date(startTime);

      addEvent(data, {
        onSuccess: () => handleAddEventSuccess(eventDate),
        onError: handleAddEventError,
      });
    },
    [addEvent, handleAddEventError, handleAddEventSuccess],
  );

  const handleUpdateEventSuccess = useCallback(
    (eventDate: Date) => {
      setDate(eventDate);

      toast(
        customToast(
          SUCCESS_MESSAGES.UPDATE_EVENT_SUCCESS.title,
          SUCCESS_MESSAGES.UPDATE_EVENT_SUCCESS.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [toast],
  );

  const handleUpdateEventError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.UPDATE_EVENT_FAIL.title,
        ERROR_MESSAGES.UPDATE_EVENT_FAIL.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleUpdateEvent = useCallback(
    (data: TEvent) => {
      const { startTime } = data;
      const eventDate = new Date(startTime);

      const payload = {
        ...data,
        eventId: data._id,
      };

      updateEvent(payload, {
        onSuccess: () => handleUpdateEventSuccess(eventDate),
        onError: handleUpdateEventError,
      });
    },
    [handleUpdateEventError, handleUpdateEventSuccess, updateEvent],
  );

  const handleDeleteEventSuccess = useCallback(() => {
    toast(
      customToast(
        SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS.title,
        SUCCESS_MESSAGES.DELETE_EVENT_SUCCESS.description,
        STATUS.SUCCESS,
      ),
    );
  }, [toast]);

  const handleDeleteEventError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.DELETE_EVENT_FAIL.title,
        ERROR_MESSAGES.DELETE_EVENT_FAIL.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      const payload = {
        eventId,
      };

      deleteEvent(payload, {
        onSuccess: handleDeleteEventSuccess,
        onError: handleDeleteEventError,
      });
    },
    [deleteEvent, handleDeleteEventError, handleDeleteEventSuccess],
  );

  const handleSetNewPinCodeSuccess = useCallback(
    (pinCode: string, callback: () => void) => {
      setUser({ user: { ...user, pinCode } });
      onCloseSetPinCodeModal();
      // resetSetPinCodeForm();

      callback();

      toast(
        customToast(
          SUCCESS_MESSAGES.SET_PIN_CODE.title,
          SUCCESS_MESSAGES.SET_PIN_CODE.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [onCloseSetPinCodeModal, setUser, toast, user],
  );

  const handleSetNewPinCodeError = useCallback(() => {
    toast(
      customToast(
        ERROR_MESSAGES.SET_PIN_CODE.title,
        ERROR_MESSAGES.SET_PIN_CODE.description,
        STATUS.ERROR,
      ),
    );
  }, [toast]);

  const handleConfirmPinCodeSuccess = useCallback(
    async (callback: () => void) => {
      onCloseConfirmPinCodeModal();
      // resetConfirmPinCodeForm({
      //   pinCode: '',
      // });

      // onToggleShowBalance();

      callback();

      toast(
        customToast(
          SUCCESS_MESSAGES.CONFIRM_PIN_CODE.title,
          SUCCESS_MESSAGES.CONFIRM_PIN_CODE.description,
          STATUS.SUCCESS,
        ),
      );
    },
    [onCloseConfirmPinCodeModal, toast],
  );

  const handleConfirmPinCodeError = useCallback(
    (callback: () => void) => {
      toast(
        customToast(
          ERROR_MESSAGES.CONFIRM_PIN_CODE.title,
          ERROR_MESSAGES.CONFIRM_PIN_CODE.description,
          STATUS.ERROR,
        ),
      );

      callback();
    },
    [toast],
  );

  const handleConfirmPinCode = (pinCode: string, callback: () => void) => {
    const payload = {
      userId,
      pinCode,
    };

    confirmPinCode(payload, {
      onSuccess: () => handleConfirmPinCodeSuccess(callback),
      onError: () => handleConfirmPinCodeError(callback),
    });
  };

  const handleSetNewPinCode = (pinCode: string, callback: () => void) => {
    const payload = {
      userId,
      pinCode,
    };

    setNewPinCode(payload, {
      onSuccess: () => handleSetNewPinCodeSuccess(pinCode, callback),
      onError: () => handleSetNewPinCodeError(),
    });
  };

  return (
    <Grid
      bg="background.body.primary"
      py={12}
      px={{ base: 6, xl: 12 }}
      templateColumns={{ base: 'repeat(1, 1fr)', '2xl': 'repeat(4, 1fr)' }}
      display={{ sm: 'block', md: 'grid' }}
      gap={{ base: 0, '2xl': 12 }}
    >
      <GridItem colSpan={3}>
        <Box
          as="section"
          bgColor="background.component.primary"
          borderRadius={8}
          px={{ base: 4, md: 10 }}
          py={{ base: 4, md: 5 }}
        >
          <Calendar
            events={formattedEvents}
            date={date}
            isLoading={isLoading}
            onSetDate={setDate}
            onAddEvent={handleAddEvent}
            onEditEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </Box>
      </GridItem>

      <InView>
        {({ inView, ref }) => (
          <GridItem mt={{ base: 6, '2xl': 0 }} ref={ref}>
            {inView && (
              <CardPayment
                isLoadingSetPinCode={isSetNewPinCode}
                isLoadingConfirmPinCode={isConfirmPinCode}
                userPinCode={pinCode}
                onConfirmPinCode={handleConfirmPinCode}
                onSetNewPinCode={handleSetNewPinCode}
              />
            )}
          </GridItem>
        )}
      </InView>
    </Grid>
  );
};

export default CalendarSection;
