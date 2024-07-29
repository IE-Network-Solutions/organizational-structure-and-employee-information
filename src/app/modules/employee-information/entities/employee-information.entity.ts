// import { BaseModel } from '@root/src/database/base.entity';
import { Gender } from '@root/src/core/enum/gender.enum';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { MaritalStatus } from '@root/src/core/enum/marital-status.enum';
// import { MaritalStatus } from '@root/dist/core/enum/marital-status.tenum';
// import { Role } from '../../role/entities/role.entity';

@Entity()
export class EmployeeInformation extends BaseModel {
  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  maritalStatus: MaritalStatus;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  joinedDate: Date;

  @Column({ nullable: true })
  nationalityID: string;

  @Column({ type: 'json', nullable: true })
  addresses: string;

  @Column({ type: 'json', nullable: true })
  emergencyContact: string;

  @Column({ type: 'json', nullable: true })
  bankInformation: string;

  @Column({ type: 'json', nullable: true })
  additionalInformation: string;

  @Column({ nullable: true })
  roleId: string;

  @Column({ nullable: true })
  tenantId: string;

  //   @ManyToOne(() => Role, (role) => role.user, {
  //     onDelete: 'SET NULL',
  //     onUpdate: 'CASCADE',
  //   })
  //   role: Role;

  //   @OneToMany(() => UserPermission, (userPermission) => userPermission.user, {
  //     onDelete: 'SET NULL',
  //     onUpdate: 'CASCADE',
  //   })
  //   userPermissions: UserPermission[];
}
