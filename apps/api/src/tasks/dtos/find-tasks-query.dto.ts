import { IsInt, Max, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindTasksQueryDto {
  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === '' ? 10 : Number(value)))
  @IsInt()
  @Min(1)
  @Max(25)
  limit: number = 10;

  @IsOptional()
  @Transform(({ value }) => (value === undefined || value === '' ? 0 : Number(value)))
  @IsInt()
  @Min(0)
  offset: number = 0;
}
