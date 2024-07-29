// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class EmployeeType extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @Column({ nullable: true })
  tenantId: string;
}
