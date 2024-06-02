import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CoreEntity } from '../../../lib/utils/Base.Entity';
import { CartItem } from '../../cart-item/entities/CartItem.Entity';
import { Category } from '../../category/entities/Category.Entity';
import { Review } from '../../review/entities/Review.Entity';

@Entity('products')
export class Product extends CoreEntity {
  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ApiProperty()
  @Column({ type: 'number', nullable: false })
  categoryId: number;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  productName: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 4000, nullable: false })
  productDescription: string;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  productImageUrl: string;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  bookings: number;

  @ApiProperty()
  @Column({ type: 'varchar', nullable: false })
  productPrice: string;

  //virtual property
  @ApiProperty()
  rating: number;
}
