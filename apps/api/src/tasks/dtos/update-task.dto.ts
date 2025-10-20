import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsIn,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['high', 'low', 'medium'])
  priority?: 'high' | 'low' | 'medium';

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;
}
