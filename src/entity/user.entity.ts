import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Users {
  constructor(partial?: Partial<Users | Users[]>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ length: 100, nullable: false })
  @Index()
  @Expose()
  username: string;

  @Column({ length: 4096 })
  password: string;

  @Column({ default: true })
  @Expose()
  status: boolean;

  @Column({ default: false })
  @Expose()
  isAdmin: boolean;
  
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public update_at: Date;
}
