// Libs
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

// Constants
import { END_POINTS, DEFAULT_PAGE } from '@/lib/constants';

// Types
import { TEventsResponse } from '@/lib/interfaces';

// Services
import { mainHttpService } from '@/lib/services';

// Stores
import { authStore } from '@/lib/stores';

export const useGetEvents = () => {
  const user = authStore((state) => state.user);

  const { id: userId = '' } = user || {};

  const { data: res, ...rest } = useQuery<AxiosResponse<TEventsResponse>>({
    queryKey: [END_POINTS.EVENT, userId],
    queryFn: () =>
      mainHttpService.get<TEventsResponse>({
        path: END_POINTS.EVENT,
        userId,
        page: DEFAULT_PAGE,
      }),
  });

  const { result = [], totalPage = 0 } = res?.data || {};

  return {
    data: result,
    totalPage,
    ...rest,
  };
};
