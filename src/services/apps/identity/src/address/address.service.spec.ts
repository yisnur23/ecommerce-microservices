import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserAddress } from './address.entity';
import { User } from '../user/user.entity';
import { AddressRepository } from './address.repository';
import { AddressService } from './address.service';
import { UserService } from '../user/user.service';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: AddressRepository;
  let userService: UserService;
  let user: User;
  let address: UserAddress;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        {
          provide: UserService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
        {
          provide: AddressRepository,
          useValue: {
            findAddressById: jest.fn(),
            findAddressesByUserId: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get<AddressRepository>(AddressRepository);
    userService = module.get<UserService>(UserService);

    user = {
      id: 'user_id',
      username: 'username',
      email: 'user@email.com',
    } as User;

    address = {
      id: 'address_id',
      name: 'name',
      street_address: 'street',
      city: 'city',
      state: 'state',
      country: 'country',
      zip_code: 'zip_code',
      user,
    } as UserAddress;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAddress', () => {
    it('should create an address', async () => {
      // eslint-disable-next-line
      const { id, ...addressDto } = address;

      jest.spyOn(addressRepository, 'save').mockResolvedValue(address);
      jest.spyOn(userService, 'findUserById').mockResolvedValue(user);
      const result = await service.createAddress(addressDto, user.id);
      expect(userService.findUserById).toHaveBeenCalledTimes(1);
      expect(userService.findUserById).toHaveBeenCalledWith(user.id);
      expect(addressRepository.save).toHaveBeenCalledTimes(1);
      expect(addressRepository.save).toHaveBeenCalledWith(addressDto);
      expect(result).toEqual(address);
    });
  });

  describe('findAllAddresses', () => {
    it('should return all addresses', async () => {
      const addresses = [address];
      jest
        .spyOn(addressRepository, 'findAddressesByUserId')
        .mockResolvedValue(addresses);
      const result = await service.findAllAddresses(user.id);
      expect(addressRepository.findAddressesByUserId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(addresses);
    });
  });

  describe('findAddressById', () => {
    it('should return address by id', async () => {
      const result = await service.findAddressById(address.id, address);
      expect(result).toEqual(address);
    });
    it('should throw not found exception if address is not found', async () => {
      try {
        await service.findAddressById(address.id, null);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`address with id ${address.id} not found`);
      }
    });
  });

  describe('updateAddress', () => {
    it('should update address', async () => {
      const { id, ...addressDto } = address;

      jest
        .spyOn(addressRepository, 'save')
        .mockResolvedValue({ ...address, ...addressDto });
      const result = await service.updateAddress(
        address.id,
        addressDto,
        address,
      );

      expect(addressRepository.save).toHaveBeenCalledTimes(1);
      expect(addressRepository.save).toHaveBeenCalledWith({
        ...address,
        ...addressDto,
      });
      expect(result).toEqual({ ...address, ...addressDto });
    });
  });
  describe('deleteAddress', () => {
    it('should delete address', async () => {
      jest.spyOn(addressRepository, 'remove').mockResolvedValue(address);
      const result = await service.deleteAddress(address.id, address);

      expect(addressRepository.remove).toHaveBeenCalledTimes(1);
      expect(addressRepository.remove).toHaveBeenCalledWith(address);
      expect(result).toEqual(address);
    });
  });
});
