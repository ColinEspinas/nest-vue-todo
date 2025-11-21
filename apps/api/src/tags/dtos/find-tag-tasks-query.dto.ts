import { IsInt, Max, Min, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

const orderValues = [
  'created_desc',
  'created_asc',
  'deadline_asc',
  'deadline_desc',
  'priority_asc',
  'priority_desc',
] as const;

type Order = (typeof orderValues)[number];

export class FindTagTasksQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(25)
  limit: number = 10;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @IsIn(orderValues)
  order?: Order = 'created_desc';
}
