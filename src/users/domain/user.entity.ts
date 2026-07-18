import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  hashedRefreshToken: string | null;

  @Column({ default: false })
  isVerified: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  verificationToken: string | null;
}
