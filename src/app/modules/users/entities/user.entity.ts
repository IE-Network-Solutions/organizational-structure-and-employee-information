// import { BaseModel } from '@root/src/database/base.entity';
import { BaseModel } from '../../../../database/base.model';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class User extends BaseModel {
  @Column({ length: 500, type: 'varchar' })
  firstName: string;

  @Column({ length: 500, type: 'varchar' })
  middleName: string;

  @Column({ length: 500, type: 'varchar' })
  lastName: string;

  @Column({ unique: true, length: 50, type: 'varchar' })
  email: string;

  @Column('json', { nullable: true })
  profileImage: string;

  @Column({ nullable: true })
  roleId: string;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Role, (role) => role.user, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  role: Role;
}
