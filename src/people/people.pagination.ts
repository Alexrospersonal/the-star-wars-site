import { Transform, TransformFnParams } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationType {
    @IsOptional()
    @IsInt()
    @Transform((param: TransformFnParams) => parseInt(param.value, 10))
    skip?: number;
}

