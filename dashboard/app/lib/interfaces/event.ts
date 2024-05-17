export interface TEvent {
  _id: string;
  eventName: string;
  startTime: string;
  endTime: string;
}

export interface TEventsResponse {
  result: TEvent[];
  totalPage: number;
}
