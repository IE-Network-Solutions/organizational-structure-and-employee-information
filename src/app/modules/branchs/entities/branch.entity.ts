import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';

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
  @Column({ type: 'uuid' })
  tenantId: string;
  @OneToMany(() => Department, (dep) => dep.department)
  departments: Department[];
}
