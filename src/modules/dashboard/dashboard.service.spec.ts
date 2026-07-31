import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

describe('DashboardService', () => {
  let service: DashboardService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardService,
        {
          provide: DashboardService,
          useValue: {
            
          }
        }
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
