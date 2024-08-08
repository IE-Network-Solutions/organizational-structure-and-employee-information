import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class EmployeeDocument extends BaseModel {
  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  documentName: string;

  @Column({ nullable: true })
  documentLink: string;

  @ManyToOne(() => User, user => user.employeeDocument)
  user: User
}
