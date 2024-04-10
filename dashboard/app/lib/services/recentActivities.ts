import axios, { AxiosInstance } from 'axios';

// Constants
import { END_POINTS } from '@/lib/constants';

// Types
import { IAxiosConfig, TRecentActivities } from '@/lib/interfaces';

export const recentActivitiesHttpService: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

export type TActivity = {
  result: Array<TRecentActivities>;
  totalPage: number
}

export const getRecentActivities = async (
  searchParam?: string,
  config?: IAxiosConfig,
  userId?: string,
  page = 1,
): Promise<{ data: TActivity; }> => {
  const response = (
    await recentActivitiesHttpService.get(
      `${END_POINTS.RECENT_ACTIVITIES}/${userId}/${page}${searchParam || ''}`,
      config,
    )
  ).data;

  return { data: response };
};
