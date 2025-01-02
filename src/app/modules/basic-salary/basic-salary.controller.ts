import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BasicSalaryService } from './basic-salary.service';
import { CreateBasicSalaryDto } from './dto/create-basic-salary.dto';
import { UpdateBasicSalaryDto } from './dto/update-basic-salary.dto';
import { BasicSalary } from './entities/basic-salary.entity';

@Controller('basic-salary')
export class BasicSalaryController {
  constructor(private readonly basicSalaryService: BasicSalaryService) {}

  @Post()
  create(@Body() createBasicSalaryDto: CreateBasicSalaryDto) {
    return this.basicSalaryService.create(createBasicSalaryDto);
  }

  @Get()
  findAll() {
    return this.basicSalaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.basicSalaryService.findOne(id);
  }

  @Get('user/:userId')
  async findAllByUserId(
    @Param('userId') userId: string,
  ): Promise<BasicSalary[]> {
    return this.basicSalaryService.findAllByUserId(userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBasicSalaryDto: UpdateBasicSalaryDto,
  ) {
    return this.basicSalaryService.update(id, updateBasicSalaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.basicSalaryService.remove(id);
  }
}
