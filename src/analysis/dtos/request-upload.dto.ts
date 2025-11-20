import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsArray, ValidateNested } from "class-validator";
import { ALLOWED_IMAGES } from "../enums/allowed-images.enum";

export class AllowedImagesDTO {
    @IsNotEmpty()
    @IsString()
    filename: string;
    @IsNotEmpty()
    @IsEnum(ALLOWED_IMAGES)
    contentType: ALLOWED_IMAGES;
}
export class RequestUploadDTO {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AllowedImagesDTO)
    images: AllowedImagesDTO[];
}