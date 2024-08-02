import { BaseModel } from '@root/src/database/base.model';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Branch } from '../../branchs/entities/branch.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
@Tree('closure-table')
export class Department extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ length: 500, type: 'varchar', nullable: true })
  description: string;
  @Column({ type: 'uuid', nullable: true })
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

  @OneToMany(() => EmployeeJobInformation, employeeJobInformation => employeeJobInformation.branch)
  employeeJobInformation: EmployeeJobInformation;
}
