export enum MessageType {
  FINAL_WORD = 'FINAL_WORD',
  TIME_CAPSULE = 'TIME_CAPSULE',
}

export enum MessageStatus {
  SCHEDULED = 'SCHEDULED',
  DELIVERED = 'DELIVERED',
}

export interface Message {
  id?: string
  type: MessageType
  recipients: string
  status?: MessageStatus
  subject: string
  text: string
  delay: number | null
  scheduled_at: Date | null
  created_at?: Date
  updated_at?: Date
}
