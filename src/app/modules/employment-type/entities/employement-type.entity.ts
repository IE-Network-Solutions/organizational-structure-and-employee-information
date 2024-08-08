// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany } from 'typeorm';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';

@Entity()
export class EmployementType extends BaseModel {
  @Column({ length: 500, nullable: true })
  name: string;

  @OneToMany(() => EmployeeJobInformation, employeeJobInformation => employeeJobInformation.employmentType)
  employeeJobInformation: EmployeeJobInformation;

  @Column({ nullable: true })
  tenantId?: string;

  //   @ManyToOne(() => Tenant, tenant => tenant.employeeInformationForm)
  //   tenant: Tenant;
}
