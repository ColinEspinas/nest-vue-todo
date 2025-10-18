import { IsNotEmpty, IsString, MaxLength, IsIn, IsOptional, Matches } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Title must be less than 50 characters' })
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(256, { message: 'Content must be less than 256 characters' })
  content: string;

  @IsString()
  @IsIn(['high', 'medium', 'low'], { message: 'Priority must be high, medium, or low' })
  priority: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'Execution date must be in DD/MM/YYYY format',
  })
  executionDate?: string;
}
