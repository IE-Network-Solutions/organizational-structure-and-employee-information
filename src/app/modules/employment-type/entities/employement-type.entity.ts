// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
export class EmploymentType extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @OneToMany(() => EmployeeJobInformation, employeeJobInformation => employeeJobInformation.employmentType)
  employeeJobInformation: EmployeeJobInformation;

  //   @ManyToOne(() => Tenant, tenant => tenant.employeeInformationForm)
  //   tenant: Tenant;
}
