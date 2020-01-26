import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne
} from "typeorm";
import { User } from './User';
@Entity()
export class SearchHistory {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: true
    })
    city: string;

    @Column({
        nullable: true
    })
    latitude: number;

    @Column({
        nullable: true
    })
    longitude: number;

    @ManyToOne(type => User, user => user.searchHistory)
    user: User;

    @Column()
    @CreateDateColumn()
    createdAt: Date;

    @Column()
    @UpdateDateColumn()
    updatedAt: Date;
}