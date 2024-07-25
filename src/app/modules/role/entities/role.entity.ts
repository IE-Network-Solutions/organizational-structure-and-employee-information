// import { BaseModel } from 'src/database/base.entity';
import { Entity, Column, OneToMany, AfterSoftRemove, DataSource } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
// import { User } from '../../users/entities/user.entity';
// import { RolePermission } from '../../role-permission/entities/role-permission.entity';
@Entity()
export class Role extends BaseModel {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  // @OneToMany(() => User, (user) => user.role)
  // user: User[];

  // @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {
  //   onDelete: 'SET NULL',
  //   onUpdate: 'CASCADE',
  // })

}
