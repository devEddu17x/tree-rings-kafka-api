import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class StartProcessDTO {
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    imagesUrl: string[];
}