import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
export class Branch extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;
  @Column({ length: 500, type: 'varchar' })
  description: string;
  @Column({ length: 500, type: 'varchar' })
  location: string;
  @Column({ type: 'varchar' })
  contactNumber: string;
  @Column({ type: 'varchar' })
  contactEmail: string;
  @Column({ type: 'uuid', nullable: true })
  tenantId: string;
  @OneToMany(() => Department, (dep) => dep.department)
  departments: Department[];

  @OneToMany(() => EmployeeJobInformation, employeeJobInformation => employeeJobInformation.branch)
  employeeJobInformation: EmployeeJobInformation;
}
