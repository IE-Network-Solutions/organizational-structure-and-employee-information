// import { BaseModel } from '@root/src/database/base.entity';
import { Gender } from '@root/src/core/enum/gender.enum';
import { BaseModel } from '../../../../database/base.model';
import { MaritalStatus } from '@root/src/core/enum/marital-status.enum';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Nationality } from '../../nationality/entities/nationality.entity';
import { EmployeeDocument } from '../../employee-documents/entities/employee-documents.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class EmployeeInformation extends BaseModel {
  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  maritalStatus: MaritalStatus;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  joinedDate: Date;

  @Column({ nullable: true })
  nationalityId: string;

  @Column({ type: 'json', nullable: true })
  addresses: string;

  @Column({ type: 'json', nullable: true })
  emergencyContact: string;

  @Column({ type: 'json', nullable: true })
  bankInformation: string;

  @Column({ type: 'json', nullable: true })
  additionalInformation: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(
    () => Nationality,
    (nationality) => nationality.employeeInformation,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
  )
  nationality: Nationality;

  // @ManyToOne(() => Tenant, (tenant) => tenant.user, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // tenant: Tenant;

  @OneToMany(
    () => EmployeeDocument,
    (employeeDocument) => employeeDocument.user,
  )
  employeeDocument: EmployeeDocument;

  @OneToOne(() => User, user => user.employeeInformation)
  user: User;
}
