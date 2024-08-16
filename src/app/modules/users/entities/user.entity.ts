// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany, ManyToOne, OneToOne } from 'typeorm';
import { Role } from '../../role/entities/role.entity';
import { UserPermission } from '../../user-permission/entities/user-permission.entity';
import { EmployeeJobInformation } from '../../employee-job-information/entities/employee-job-information.entity';
import { EmployeeDocument } from '../../employee-documents/entities/employee-documents.entity';
import { EmployeeInformation } from '../../employee-information/entities/employee-information.entity';
@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  firstName: string;

  @Column({ length: 500, type: 'varchar' })
  middleName: string;

  @Column({ length: 500, type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  profileImageDownload: string;

  @Column({ unique: true, length: 50, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  roleId: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Role, (role) => role.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  role: Role;

  @Column({ type: 'varchar', nullable: true })
  firebaseId: string;

  // @ManyToOne(() => Tenant, (tenant) => tenant.user, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })
  // tenant: Tenant;

  @OneToMany(() => UserPermission, (userPermissions) => userPermissions.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  userPermissions: UserPermission[];

  @OneToMany(
    () => EmployeeJobInformation,
    (employeeJobInformation) => employeeJobInformation.user,
  )
  employeeJobInformation: EmployeeJobInformation;

  @OneToMany(
    () => EmployeeDocument,
    (employeeDocument) => employeeDocument.user,
  )
  employeeDocument: EmployeeDocument;

  @OneToOne(
    () => EmployeeInformation,
    (employeeInformation) => employeeInformation.user,
  )
  employeeInformation: EmployeeInformation;
}
