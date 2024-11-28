import { BaseModel } from "@root/src/database/base.model";
import { Column, Entity, ManyToOne } from "typeorm";
import { Session } from "../../session/entities/session.entity";
@Entity()
export class Month extends BaseModel {
  
    @Column({ type: 'varchar', length: 255 })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @Column({ type: 'uuid' })
    sessionId: string;
  
    @ManyToOne(() => Session, { onDelete: 'CASCADE' })
    session: Session;
  
    @Column({ type: 'timestamp' })
    startDate: Date;
  
    @Column({ type: 'timestamp' })
    endDate: Date;
  
    @Column({ type: 'boolean', default: false })
    active: boolean;
  
    @Column({ type: 'uuid' })
    tenantId: string;
}
