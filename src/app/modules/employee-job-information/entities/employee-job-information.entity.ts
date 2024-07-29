import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';

@Entity()
export class EmployeeJobInformation extends BaseModel {
  @Column({ nullable: true })
  jobTitle: string;

  // @ManyToOne(() => User, user => user.jobInformations)
  // userId: string;

  // @ManyToOne(() => Branch, branch => branch.jobInformations)
  // branchId: string;

  // @Column({ type: 'boolean' })
  // isPositionActive: boolean;

  // @Column({ type: 'timestamp' })
  // effectiveStartDate: Date;

  // @Column({ type: 'timestamp', nullable: true })
  // effectiveEndDate: Date;

  // @ManyToOne(() => EmploymentType, employmentType => employmentType.jobInformations)
  // employmentTypeId: string;

  // @ManyToOne(() => Department, department => department.jobInformations)
  // departmentId: string;

  // @Column({ type: 'boolean' })
  // departmentLeadOrNot: boolean;

  // @Column({ type: 'enum', enum: ['permanent', 'contractual'] })
  // employmentContractType: string;

  // @ManyToOne(() => WorkSchedule, workSchedule => workSchedule.jobInformations)
  // workScheduleId: string;

  // @Column({ nullable: true })
  // tenantId: string;
}
