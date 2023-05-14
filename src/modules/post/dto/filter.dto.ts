import { IsNumber, IsOptional, Min } from 'class-validator';

export class FilterDto {
  @IsOptional()
  @IsNumber()
  limit: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  page: number;
}
