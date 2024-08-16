import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { IsEnum } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { EmployementContractType } from '@root/src/core/enum/employementContractType.enum';
import { Branch } from '../../branchs/entities/branch.entity';
import { Department } from '../../departments/entities/department.entity';
import { WorkSchedule } from '../../work-schedules/entities/work-schedule.entity';
import { EmployementType } from '../../employment-type/entities/employement-type.entity';

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

  @Column({ type: 'timestamp', nullable: true })
  effectiveStartDate: Date;

  @Column({ nullable: true })
  effectiveEndDate: Date;

  @Column({ nullable: true })
  employmentTypeId: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ type: 'boolean', nullable: true })
  departmentLeadOrNot: boolean;

  @IsEnum({ nullable: true })
  employmentContractType: EmployementContractType;

  @Column({ nullable: true })
  workScheduleId: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => User, (user) => user.employeeJobInformation)
  user: User;

  @ManyToOne(() => Branch, (branch) => branch.employeeJobInformation)
  branch: Branch;

  @ManyToOne(() => EmployementType, employementType => employementType.employeeJobInformation)
  employementType: EmployementType

  @ManyToOne(
    () => Department,
    (department) => department.employeeJobInformation,
  )
  department: Department;

  @ManyToOne(
    () => WorkSchedule,
    (workSchedule) => workSchedule.employeeJobInformation,
  )
  workSchedule: WorkSchedule;



  // @ManyToOne(() => Tenant, tenant => tenant.employeeJobInformation)
  // tenant: Tenant;
}
