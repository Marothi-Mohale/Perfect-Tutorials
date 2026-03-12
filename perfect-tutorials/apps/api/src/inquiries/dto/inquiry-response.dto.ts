import { InquiryStatus } from '@prisma/client';

export class InquiryResponseDto {
  id!: string;
  firstName!: string;
  lastName!: string | null;
  email!: string;
  phone!: string | null;
  levelOfStudy!: string;
  subject!: string;
  message!: string | null;
  status!: InquiryStatus;
  createdAt!: string;
  updatedAt!: string;
}
