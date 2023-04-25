import { generateAbilityForEntity } from '@app/auth/generate.ability';
import { Product } from './entities/products.entity';

export const ProductAbility = generateAbilityForEntity(Product);
