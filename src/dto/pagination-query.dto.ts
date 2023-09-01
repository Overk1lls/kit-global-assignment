import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

interface ToNumberOptions {
  default?: number;
  min?: number;
  max?: number;
}

export function toNumber(value: string, opts: ToNumberOptions = {}): number {
  let parsedValue = parseInt(value || opts.default.toString(), 10);

  if (isNaN(parsedValue)) {
    parsedValue = opts.default;
  }

  if (opts.min) {
    if (parsedValue < opts.min) {
      parsedValue = opts.min;
    }

    if (parsedValue > opts.max) {
      parsedValue = opts.max;
    }
  }

  return parsedValue;
}

export class PaginationQueryDto {
  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => toNumber(value, { default: 0, min: 0 }))
  @IsNumber()
  @IsOptional()
  skip?: number;
}
