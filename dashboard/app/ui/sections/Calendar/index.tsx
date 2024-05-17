'use client';

// Libs
import { useMemo } from 'react';
import { Box, Flex, Grid, GridItem } from '@chakra-ui/react';
import { InView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import moment from 'moment';

// Hooks
import { useGetEvents } from '@/lib/hooks';

// Components
import { Indicator } from '@/ui/components';

// dynamic loading components
const Calendar = dynamic(() => import('@/ui/components/Calendar'));
const CardPayment = dynamic(() => import('@/ui/components/CardPayment'));

const CalendarSection = () => {
  // Fetch events
  const { data: events = [], isLoading: isLoadingEvents } = useGetEvents();

  const formattedEvents = useMemo(
    () =>
      events.map((event) => {
        const { eventName = '', startTime = '', endTime = '' } = event || {};

        return {
          ...event,
          title: eventName,
          startTime: moment(startTime).toDate(),
          endTime: moment(endTime).toDate(),
        };
      }),
    [events],
  );

  // TODO: Update later
  const handleAddEvent = () => {};

  // TODO: Update later
  const handleUpdateEvent = () => {};

  return (
    <Indicator isOpen={isLoadingEvents}>
      <Grid
        bg="background.body.primary"
        py={12}
        px={{ base: 6, xl: 12 }}
        templateColumns={{ base: 'repeat(1, 1fr)', '2xl': 'repeat(4, 1fr)' }}
        display={{ sm: 'block', md: 'grid' }}
        gap={{ base: 0, '2xl': 12 }}
      >
        <InView>
          {({ inView, ref }) => (
            <GridItem colSpan={3} ref={ref}>
              {inView && (
                <Box
                  as="section"
                  bgColor="background.component.primary"
                  borderRadius={8}
                  px={10}
                  py={5}
                >
                  <Calendar
                    events={formattedEvents}
                    onAddEvent={handleAddEvent}
                    onEditEvent={handleUpdateEvent}
                  />
                </Box>
              )}
            </GridItem>
          )}
        </InView>
        <InView>
          {({ inView, ref }) => (
            <GridItem mt={{ base: 6, '2xl': 0 }} ref={ref}>
              {inView && (
                <Flex
                  direction={{ base: 'column', lg: 'row', xl: 'column' }}
                  gap={6}
                >
                  <CardPayment />
                </Flex>
              )}
            </GridItem>
          )}
        </InView>
      </Grid>
    </Indicator>
  );
};

export default CalendarSection;
