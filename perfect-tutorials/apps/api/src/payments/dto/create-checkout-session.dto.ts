import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCheckoutSessionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  packageId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  clerkUserId?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;
}
