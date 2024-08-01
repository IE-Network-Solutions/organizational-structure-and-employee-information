// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';

@Entity()
export class Nationality extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  name: string;

  @OneToMany(() => EmployeeInformation, (employeeInformation) => employeeInformation.nationality)
  employeeInformation: EmployeeInformation[];
}
