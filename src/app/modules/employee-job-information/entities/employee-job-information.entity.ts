import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { IsEnum } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Branch } from '../../branchs/entities/branch.entity';
import { Department } from '../../departments/entities/department.entity';
import { WorkSchedule } from '../../work-schedules/entities/work-schedule.entity';
import { EmployementType } from '../../employment-type/entities/employement-type.entity';
import { EmployeeTermination } from '../../employee-termination/entities/employee-termination.entity';
import { EmployementContractType } from '@root/src/core/enum/employement-contract-type.enum';
import { JobAction } from '../enum/job-action.enum';
import { JobPosition } from '@root/src/app/modules/job-position/entities/job-position.entity';

@Entity()
export class EmployeeJobInformation extends BaseModel {
  @Column({ nullable: true })
  positionId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  branchId: string;

  @Column({ type: 'boolean', default: true })
  isPositionActive: boolean;

  @Column({ nullable: true })
  effectiveStartDate: Date;

  @Column({ nullable: true })
  effectiveEndDate: Date;

  @Column({ nullable: true })
  employementTypeId: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ type: 'boolean', nullable: true })
  departmentLeadOrNot: boolean;

  @IsEnum({ nullable: true })
  employmentContractType: EmployementContractType;

  @Column({
    type: 'enum',
    enum: JobAction,
    default: JobAction.new,
    nullable: false,
  })
  @IsEnum(JobAction)
  jobAction: JobAction;

  @Column({ nullable: true })
  workScheduleId: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => User, (user) => user.employeeJobInformation)
  user: User;

  @ManyToOne(() => Branch, (branch) => branch.employeeJobInformation)
  branch: Branch;

  @ManyToOne(
    () => EmployementType,
    (employementType) => employementType.employeeJobInformation,
  )
  employementType: EmployementType;

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

  @OneToOne(
    () => EmployeeTermination,
    (employeeTermination) => employeeTermination.jobInformation,
  )
  employeeTermination: EmployeeTermination;

  // @ManyToOne(() => Tenant, tenant => tenant.employeeJobInformation)
  // tenant: Tenant;

  @ManyToOne(() => JobPosition, { nullable: true })
  @JoinColumn({ name: 'positionId' }) // This maps positionId in the DB
  position: JobPosition;
}
