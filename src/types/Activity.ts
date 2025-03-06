export enum ActivityType {
  MESSAGE_CREATED = 'MESSAGE_CREATED',
  MESSAGE_DELIVERED = 'MESSAGE_DELIVERED',
  MESSAGE_DELETED = 'MESSAGE_DELETED',
  CHECKED_IN = 'CHECKED_IN',
}

export interface Activity {
  id: number
  timestamp: string
  description: string
  type: ActivityType
}
