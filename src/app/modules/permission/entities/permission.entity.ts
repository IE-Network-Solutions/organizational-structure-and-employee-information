// import { BaseModel } from 'src/database/base.entity';
import { Entity, Column } from 'typeorm';
import { BaseModel } from '../../../../database/base.model';
/** This is a TypeScript class representing a Permission entity with an id and a unique name and slug columns. */
@Entity()
export class Permission extends BaseModel {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  permissionGroupId: string;
}
