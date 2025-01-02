import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { User } from '../../users/entities/user.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
export class BasicSalary extends BaseModel {
  @Column()
  basicSalary: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @ManyToOne(() => User, (user) => user.basicSalaries)
  user: User;

  @ManyToOne(() => EmployeeJobInformation, (jobInfo) => jobInfo.basicSalaries)
  jobInfo: EmployeeJobInformation;
}
