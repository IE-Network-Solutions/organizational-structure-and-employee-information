import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.entity';
import { PaginationDto } from '@root/src/core/commonDto/pagination-dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ApiTags } from '@nestjs/swagger';
import { EncryptionService } from '@root/src/core/services/encryption.service';

@Controller('branchs')
@ApiTags('Branchs')
export class BranchesController {
  constructor(
    private readonly branchsService: BranchesService,
    private readonly encryptionService: EncryptionService,
  ) {}
  @Post()
  async createBranch(
    @Req() req: Request,
    @Body() createBranchDto: CreateBranchDto,
  ): Promise<Branch> {
    const tenantId = req['tenantId'];
    return await this.branchsService.createBranch(createBranchDto, tenantId);
  }


 @Post('test-encryption')
  async testEncryption(@Body() data: any) {
    // console.log('Received data in controller:', data);
  }
  @Post('encrypt-text')
  async encryptText(@Body() body: { text: string | any }) {
    // console.log('Original data to encrypt:', body.text);
    
    let encryptedText;
    if (typeof body.text === 'string') {
      encryptedText = this.encryptionService.encryptText(body.text);
    } else {
      // If it's an object, use encryptObject instead
      encryptedText = this.encryptionService.encryptObject(body.text); 
    }
   // console.log('Encrypted text:', encryptedText);
    // return {
    //   originalData: body.text,
    //   encryptedText: encryptedText,
    //   timestamp: new Date().toISOString()
    // };
  }

  @Get()
  async findAllBranch(
    @Req() req: Request,
    @Query()
    paginationOptions?: PaginationDto,
  ): Promise<Pagination<Branch>> {
    const tenantId = req['tenantId'];
    return await this.branchsService.findAllBranchs(
      paginationOptions,
      tenantId,
    );
  }

  @Get(':id')
  async findOneBranch(@Param('id') id: string): Promise<Branch> {
    return await this.branchsService.findOneBranch(id);
  }

  @Patch(':id')
  async updateBranch(
    @Param('id') id: string,
    @Body() updateBranchDto: UpdateBranchDto,
    @Req() req: Request,
  ): Promise<Branch> {
    const tenantId = req['tenantId'];
    return await this.branchsService.updateBranch(id, updateBranchDto, tenantId);
  }

  @Delete(':id')
  async removeBranch(@Param('id') id: string): Promise<Branch> {
    return await this.branchsService.removeBranch(id);
  }
  
}
