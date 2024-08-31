import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
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

  @Column({nullable:true})
  jobInformationId: string;

  @Column()
  userId: string;
  
  @Column({default:true})
  isActive: boolean;

  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;

  @OneToOne(
    () => EmployeeJobInformation,
    (employeeJobInformation) => employeeJobInformation.employeeTermination,
  )
  @JoinColumn({name:'jobInformationId'})
  jobInformation: EmployeeJobInformation;

  @ManyToOne(() => User, (user) => user.employeeTermination)
  user: User;

  @OneToMany(
    () => OffboardingEmployeeTask,
    (offboardingEmployeeTask) => offboardingEmployeeTask.approver,
  )
 
  offboardingEmployeeTask: OffboardingEmployeeTask;

}
