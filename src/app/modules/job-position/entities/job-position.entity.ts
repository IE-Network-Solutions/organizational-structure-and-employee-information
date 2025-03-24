import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, OneToMany, Unique } from 'typeorm';

@Entity()
@Unique(['name', 'tenantId'])

export class JobPosition extends BaseModel {
  @Column()
  name: string;
  @Column({ nullable: true })
  description: string;
@Column({ nullable: true })
  tenantId: string;
}
