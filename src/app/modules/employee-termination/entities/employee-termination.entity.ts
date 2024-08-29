import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';
import { User } from '../../users/entities/user.entity';
import { TerminationType } from '@root/src/core/enum/termination-type.dto';
import { EligibleForRehire } from '@root/src/core/enum/eligible-for-hire.enum';
import { OffboardingEmployeeTask } from '../../offboarding-employee-task/entities/offboarding-employee-task.entity';

@Entity()
export class EmployeeTermination extends BaseModel {
  @Column()
  reason: string;

  @Column({ length: 500 })
  type: TerminationType;

  @Column({ length: 500 })
  eligibleForRehire: EligibleForRehire;

  @Column({ nullable: true })
  comment: string;

  @Column()
  jobInformationId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;

  @OneToOne(
    () => EmployeeJobInformation,
    (employeeJobInformation) => employeeJobInformation.employeeTermination,
  )
  jobInformation: EmployeeJobInformation;

  @ManyToOne(() => User, (user) => user.employeeTermination)
  user: User;

  @OneToMany(
    () => OffboardingEmployeeTask,
    (offboardingEmployeeTask) => offboardingEmployeeTask.approver,
  )
  offboardingEmployeeTask: OffboardingEmployeeTask;

}
