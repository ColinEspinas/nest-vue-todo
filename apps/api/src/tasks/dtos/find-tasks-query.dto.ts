import { IsInt, Max, Min, IsOptional, IsIn } from 'class-validator';

import { OrderValues } from '../types/order.type';
import type { Order } from '../types/order.type';
import { Type } from 'class-transformer';

export class FindTasksQueryDto {
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
  @IsIn(OrderValues)
  order?: Order = 'created_desc';
}
