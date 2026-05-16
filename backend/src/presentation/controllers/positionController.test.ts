import { getAllPositions, getCandidatesByPosition } from './positionController';
import { Request, Response } from 'express';
import {
  getAllPositionsService,
  getCandidatesByPositionService,
} from '../../application/services/positionService';

jest.mock('../../application/services/positionService');

describe('getAllPositions', () => {
  it('should return 200 and positions data', async () => {
    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockPositions = [
      {
        id: 1,
        title: 'Senior Full-Stack Engineer',
        status: 'Open',
        location: 'Remote',
        applicationDeadline: '2024-12-31T00:00:00.000Z',
      },
    ];

    (getAllPositionsService as jest.Mock).mockResolvedValue(mockPositions);

    await getAllPositions(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockPositions);
  });
});

describe('getCandidatesByPosition', () => {
  it('should return 200 and candidates data', async () => {
    const req = { params: { id: '1' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (getCandidatesByPositionService as jest.Mock).mockResolvedValue([
      {
        fullName: 'John Doe',
        currentInterviewStep: 'Technical Interview',
        averageScore: 4,
        id: 1,
        applicationId: 1,
      },
    ]);

    await getCandidatesByPosition(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      {
        fullName: 'John Doe',
        currentInterviewStep: 'Technical Interview',
        averageScore: 4,
        id: 1,
        applicationId: 1,
      },
    ]);
  });
});
