import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { User } from '../../users/entities/user.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
export class BasicSalary extends BaseModel {
  @Column({ type: 'decimal', nullable: true })
  basicSalary: number;

  @Column({ type: 'uuid' })
  jobInfoId: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.basicSalaries)
  user: User;

  @ManyToOne(() => EmployeeJobInformation, (jobInfo) => jobInfo.basicSalaries)
  jobInfo: EmployeeJobInformation;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
}
