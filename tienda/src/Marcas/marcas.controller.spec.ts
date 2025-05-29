import { Test, TestingModule } from '@nestjs/testing';
import { MarcasController } from './marcas.controller';

describe('MarcasController', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MarcasController], // Use the class, not the variable
    }).compile();

    controller = module.get(MarcasController); // Use the class, not the variable
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});