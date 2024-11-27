import { BaseModel } from '@root/src/database/base.model';
import { Column, Entity, OneToMany } from 'typeorm';
import { Organization } from '../../organizations/entities/organization.entity';
@Entity()
export class OrganizationFile extends BaseModel {
  @Column({ type: 'json' })
  files: string[];
  @Column({ type: 'uuid' })
  tenantId: string;

  @OneToMany(() => Organization, (org) => org.organizationFile)
  organizations: Organization[];
}
