import { BaseModel } from '@root/src/database/base.model';
import {
  Column,
  Entity,
  ManyToOne,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Branch } from '../../branchs/entities/branch.entity';

@Entity()
@Tree('closure-table')
export class Department extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ length: 500, type: 'varchar' })
  description: string;
  @Column({ type: 'uuid' })
  branchId: string;

  @Column({ type: 'uuid', nullable: false })
  tenantId: string;
  @TreeChildren()
  department: Department[];

  @TreeParent()
  parent: Department;

  @Column({ type: 'int' })
  level: number;

  @ManyToOne(() => Branch, (bra) => bra.departments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  branch: Branch;
}
