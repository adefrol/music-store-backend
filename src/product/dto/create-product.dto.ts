import { Brand } from 'src/brand/entities/brand.entity';
import { Category } from 'src/category/entities/category.entity';

export class CreateProductDto {
  id: number;

  brand: Brand;

  model: string;

  category: Category;

  price: string;

  description: string;

  image: string;

  extra_parameters: string;
}
