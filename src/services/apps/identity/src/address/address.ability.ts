import { generateAbilityForEntity } from '@app/auth/generate.ability';
import { UserAddress } from './address.entity';

export const UserAddressAbility = generateAbilityForEntity(UserAddress);
