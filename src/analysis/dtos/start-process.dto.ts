import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ImageProcessDTO {
    @IsString()
    @IsNotEmpty()
    key: string;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    coordinatesX: number;
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    coordinatesY: number;
}

export class StartProcessDTO {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ImageProcessDTO)
    images: ImageProcessDTO[];
}