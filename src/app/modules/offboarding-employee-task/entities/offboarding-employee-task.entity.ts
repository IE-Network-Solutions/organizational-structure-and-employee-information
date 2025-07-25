import { BaseModel } from '@root/src/database/base.model';
import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { EmployeeTermination } from '../../employee-termination/entities/employee-termination.entity';

@Entity()
export class OffboardingEmployeeTask extends BaseModel {
  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  completedDate: Date;

  @Column({ nullable: true })
  tenantId: string;

  @Column({ nullable: true })
  employeTerminationId: string;

  @Column({ nullable: true })
  approverId: string;

  @ManyToOne(
    () => EmployeeTermination,
    (employeeTermination) => employeeTermination.offboardingEmployeeTask,
    { onDelete: 'CASCADE' },
  )
  employeTermination: EmployeeTermination;

  @ManyToOne(() => User, (user) => user.offboardingEmployeeTask, {
    onDelete: 'SET NULL',
  })
  approver: User;
}
