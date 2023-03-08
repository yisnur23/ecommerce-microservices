import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductRepository } from './product.repository';
import { Product } from './entities/products.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProductsService', () => {
  let productService: ProductsService;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductRepository,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            getUserProducts: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    productService = module.get<ProductsService>(ProductsService);
    productRepository = module.get<ProductRepository>(ProductRepository);
  });
  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto = {
        title: 'title',
        description: 'sesc',
        price: 2,
        item_count: 2,
      };
      const userId = 'user_id';

      const savedProduct = {
        ...createProductDto,
        user_id: userId,
      } as Product;

      jest.spyOn(productRepository, 'save').mockResolvedValue(savedProduct);

      const result = await productService.createProduct(
        createProductDto,
        userId,
      );

      expect(productRepository.save).toHaveBeenCalledWith({
        ...createProductDto,
        user_id: userId,
      });
      expect(productRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('getProduct', () => {
    it('should return a product by id', async () => {
      const productId = 'id';

      const product = {
        id: productId,
        title: 'title',
        description: 'sesc',
        price: 2,
        item_count: 2,
        user_id: 'user_id',
      };

      jest.spyOn(productRepository, 'findById').mockResolvedValue(product);

      const result = await productService.getProduct(productId);

      expect(productRepository.findById).toHaveBeenCalledWith(productId);
      expect(productRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(product);
    });

    it('should throw an error if the product is not found', async () => {
      const productId = '1';

      jest.spyOn(productRepository, 'findById').mockResolvedValue(undefined);
      try {
        await productService.getProduct(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('product not found');
      }
    });
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const products = [
        {
          id: 'productId',
          title: 'title',
          description: 'sesc',
          price: 2,
          item_count: 2,
          user_id: 'user_id',
        },
      ];

      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      const result = await productService.getAllProducts();

      expect(productRepository.find).toHaveBeenCalledWith({
        take: undefined,
        skip: undefined,
      });
      expect(result).toEqual(products);
    });

    it('should return limited products using take and skip', async () => {
      const products = [
        {
          id: 'productId',
          title: 'title',
          description: 'sesc',
          price: 2,
          item_count: 2,
          user_id: 'user_id',
        },
      ];
      const take = 1;
      const skip = 1;
      jest.spyOn(productRepository, 'find').mockResolvedValue(products);

      const result = await productService.getAllProducts(take, skip);

      expect(productRepository.find).toHaveBeenCalledWith({
        take,
        skip,
      });
      expect(result).toEqual(products);
    });
  });
  describe('getUserProducts', () => {
    it('should return a users products', async () => {
      const userId = 'user_id';
      const products = [
        {
          id: 'productId',
          title: 'title',
          description: 'sesc',
          price: 2,
          item_count: 2,
          user_id: userId,
        },
      ];

      jest
        .spyOn(productRepository, 'getUserProducts')
        .mockResolvedValue(products);

      const result = await productService.getUserProducts(userId);

      expect(productRepository.getUserProducts).toHaveBeenCalledWith(userId);
      expect(result).toEqual(products);
    });
  });
  describe('updateProduct', () => {
    it('should update a product', async () => {
      const productId = '1';
      const updateProductDto = {
        title: 'new product',
        price: 20,
      };
      const product = {
        id: 'productId',
        title: 'title',
        description: 'sesc',
        price: 2,
        item_count: 2,
        user_id: 'user_id',
      };

      jest.spyOn(productRepository, 'findById').mockResolvedValue(product);
      jest.spyOn(productRepository, 'save').mockResolvedValue({
        ...product,
        ...updateProductDto,
      });

      const result = await productService.updateProduct(
        productId,
        updateProductDto,
        product,
      );

      expect(productRepository.save).toHaveBeenCalledWith({
        ...product,
        ...updateProductDto,
      });
      expect(result).toEqual({
        ...product,
        ...updateProductDto,
      });
    });

    it('should throw an error if the product is not found', async () => {
      const productId = '1';
      const updateProductDto = {
        name: 'new product',
        price: 20,
      };

      try {
        await productService.updateProduct(productId, updateProductDto);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('product not found');
      }
    });
  });
  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const productId = '1';
      const product = {
        id: 'productId',
        title: 'title',
        description: 'sesc',
        price: 2,
        item_count: 2,
        user_id: 'user_id',
      };

      jest.spyOn(productRepository, 'remove').mockResolvedValue(undefined);

      await productService.deleteProduct(productId, product);

      expect(productRepository.remove).toHaveBeenCalledWith(product);
    });

    it('should throw an error if the product is not found', async () => {
      const productId = '1';

      try {
        await productService.deleteProduct(productId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual('product not found');
      }
    });
  });
});
