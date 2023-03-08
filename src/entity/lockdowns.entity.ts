import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';

@Entity()
@Unique(['agent', 'company'])
export class Lockdowns {
  constructor(partial?: Partial<Lockdowns | Lockdowns[]>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  @Expose() // npm i --save class-validator class-transformer
  id: string;

  // @CreateDateColumn({ type: "datetime", default: () => moment().format()})
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Index()
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;

  @Column({ length: 1024, nullable: true })
  @Expose()
  operator: string;

  @Column({ length: 1024 })
  @Expose()
  @Index()
  agent: string;

  @Column({ length: 1024 })
  @Expose()
  @Index()
  company: string;

  @Column({ default: true })
  @Expose()
  status: boolean;
}
