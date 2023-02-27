import { Test, TestingModule } from '@nestjs/testing';
import { UserAddress } from './address.entity';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';
import { AuthenticatedUser } from '@app/types/user.type';

describe('AddressController', () => {
  let controller: AddressController;
  let addressService: AddressService;
  let user: AuthenticatedUser;
  let address: UserAddress;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      providers: [
        {
          provide: AddressService,
          useValue: {
            createAddress: jest.fn(),
            findAllAddresses: jest.fn(),
            findAddressById: jest.fn(),
            updateAddress: jest.fn(),
            deleteAddress: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AddressController>(AddressController);
    addressService = module.get<AddressService>(AddressService);
    user = {
      id: 'id',
      email: 'user@email.com',
    };
    address = {
      id: 'address_id',
      name: 'name',
      street_address: 'street',
      city: 'city',
      state: 'state',
      country: 'country',
      zip_code: 'zip_code',
    } as UserAddress;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createAddress', () => {
    it('should create address', async () => {
      // eslint-disable-next-line
      const { id, ...addressDto } = address;
      jest.spyOn(addressService, 'createAddress').mockResolvedValue(address);
      const result = await controller.createAddress(addressDto, user);
      expect(addressService.createAddress).toBeCalledTimes(1);
      expect(addressService.createAddress).toBeCalledWith(addressDto, user.id);
      expect(result).toEqual(address);
    });
  });

  describe('findAllAddresses', () => {
    it('should return all addresses', async () => {
      const addresses = [address];
      jest
        .spyOn(addressService, 'findAllAddresses')
        .mockResolvedValue(addresses);
      const result = await controller.findAllAddresses({
        id: 'user_id',
        email: 'user@email.com',
      });
      expect(addressService.findAllAddresses).toBeCalledTimes(1);
      expect(result).toEqual(addresses);
    });
  });

  describe('findAddressById', () => {
    it('should return address by id', async () => {
      jest.spyOn(addressService, 'findAddressById').mockResolvedValue(address);
      const result = await controller.findAddress(address.id, address);
      expect(addressService.findAddressById).toBeCalledTimes(1);
      expect(addressService.findAddressById).toBeCalledWith(
        address.id,
        address,
      );
      expect(result).toEqual(address);
    });
  });

  describe('updateAddress', () => {
    it('should update address', async () => {
      const { id } = address;
      const updateDto = {
        city: 'city',
      };
      jest.spyOn(addressService, 'updateAddress').mockResolvedValue({
        ...address,
        ...updateDto,
      });
      const result = await controller.updateAddress(
        address.id,
        updateDto,
        address,
      );
      expect(addressService.updateAddress).toBeCalledTimes(1);
      expect(addressService.updateAddress).toBeCalledWith(
        id,
        updateDto,
        address,
      );
      expect(result).toEqual({
        ...address,
        ...updateDto,
      });
    });
  });

  describe('deleteAddress', () => {
    it('should delete address', async () => {
      jest.spyOn(addressService, 'deleteAddress').mockResolvedValue(address);
      const result = await controller.deleteAddress(address.id, address);
      expect(addressService.deleteAddress).toBeCalledTimes(1);
      expect(addressService.deleteAddress).toBeCalledWith(address.id, address);
      expect(result).toEqual(address);
    });
  });
});
