import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { EmploymentType } from '../../employment-type/entities/employement-type.entity';
import { IsEnum } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { EmployementContractType } from '@root/src/core/enum/employementContractType.enum';

@Entity()
export class EmployeeJobInformation extends BaseModel {
  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  branchId: string;

  @Column({ type: 'boolean', default: true })
  isPositionActive: boolean;

  @Column({ type: 'timestamp' })
  effectiveStartDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  effectiveEndDate: Date;

  @Column({ nullable: true })
  employmentTypeId: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ type: 'boolean' })
  departmentLeadOrNot: boolean;

  @IsEnum({ nullable: true })
  employmentContractType: EmployementContractType;

  @Column()
  workScheduleId: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => User, user => user.employeeJobInformation)
  user: User;

  // @ManyToOne(() => Branch, branch => branch.employeeJobInformation)
  // branch: Branch;

  @ManyToOne(() => EmploymentType, employmentType => employmentType.employeeJobInformation)
  employmentType: EmploymentType

  // @ManyToOne(() => Department, department => department.employeeJobInformation)
  // department: Department;

  // @ManyToOne(() => WorkSchedule, workSchedule => workSchedule.employeeJobInformation)
  // workSchedule: WorkSchedule

  // @ManyToOne(() => Tenant, tenant => tenant.employeeJobInformation)
  // tenant: Tenant;
}
