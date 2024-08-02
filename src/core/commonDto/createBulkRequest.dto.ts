
import { IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from '@root/src/app/modules/users/dto/create-user.dto';
import { CreateEmployeeInformationDto } from '@root/src/app/modules/employee-information/dto/create-employee-information.dto';
import { CreateEmployeeJobInformationDto } from '@root/src/app/modules/employee-job-information/dto/create-employee-job-information.dto';
import { CreateEmployeeInformationFormDto } from '@root/src/app/modules/employee-information-form/dto/create-employee-information-form.dto';
import { CreateNationalityDto } from '@root/src/app/modules/nationality/dto/create-nationality.dto';
import { CreateEmployementTypeDto } from '@root/src/app/modules/employment-type/dto/create-employement-type.dto';

export class CreateBulkRequestDto {
    @IsObject()
    @ValidateNested()
    @Type(() => CreateUserDto)
    createUserDto: CreateUserDto;

    @IsObject()
    @ValidateNested()
    @Type(() => CreateEmployeeInformationDto)
    createEmployeeInformationDto: CreateEmployeeInformationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => CreateEmployeeJobInformationDto)
    createEmployeeJobInformationDto: CreateEmployeeJobInformationDto;

    @IsObject()
    @ValidateNested()
    @Type(() => CreateEmployeeInformationFormDto)
    createEmployeeInformationFormDto: CreateEmployeeInformationFormDto;

    @IsObject()
    @ValidateNested()
    @Type(() => CreateNationalityDto)
    createNationalityDto: CreateNationalityDto;

    @IsObject()
    @ValidateNested()
    @Type(() => CreateEmployementTypeDto)
    createEmployementTypeDto: CreateEmployementTypeDto;
}
