import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';
import { terminationType } from '@root/src/core/enum/termination-type.dto';
import { eligibleForRehire } from '@root/src/core/enum/eligible-for-hire.enum';
import { User } from '../../users/entities/user.entity';

@Entity()
export class EmployeeTermination extends BaseModel {
  @Column()
  reason: string;

  @Column({ length: 500 })
  type: terminationType;

  @Column({ length: 500 })
  eligibleForRehire: eligibleForRehire;

  @Column({nullable: true })
  comment: string;
  
  @Column()
  jobInformationId:string;

  @Column()
  userId:string;


  @Column({ nullable: true })
  effectiveDate: Date;

  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
  
  @OneToOne(() => EmployeeJobInformation, (employeeJobInformation) => employeeJobInformation.employeeTermination)
  jobInformation: EmployeeJobInformation;

  @ManyToOne(() => User, (user) => user.employeeTermination)
  user: User;
}