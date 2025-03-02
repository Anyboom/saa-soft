import type { TypeRecordEnum } from '@/enum/type-record.enum.ts'

export type UserType = {
  id: string | null;
  mark: { text: string }[];
  type: TypeRecordEnum;
  login: string;
  password: string | null;
}
