import { IsString, IsOptional, MinLength, MaxLength, IsIn, IsDate, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(256)
  description: string;

  @IsString()
  @IsIn(['high', 'low', 'medium'])
  priority: 'high' | 'low' | 'medium';

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  deadline?: Date;

  @IsArray()
  @IsString({ each: true })
  tagIds: string[] = [];
}
