import {
  getAllPositionsService,
  getCandidatesByPositionService,
} from './positionService';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    application: {
      findMany: jest.fn(),
    },
    position: {
      findMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

describe('getAllPositionsService', () => {
  it('should return mapped positions with ISO applicationDeadline', async () => {
    const mockPositions = [
      {
        id: 1,
        title: 'Senior Full-Stack Engineer',
        status: 'Open',
        location: 'Remote',
        applicationDeadline: new Date('2024-12-31T00:00:00.000Z'),
      },
    ];

    jest.spyOn(prisma.position, 'findMany').mockResolvedValue(mockPositions as never);

    const result = await getAllPositionsService();

    expect(prisma.position.findMany).toHaveBeenCalledWith({
      orderBy: { id: 'asc' },
      select: {
        id: true,
        title: true,
        status: true,
        applicationDeadline: true,
        location: true,
      },
    });
    expect(result).toEqual([
      {
        id: 1,
        title: 'Senior Full-Stack Engineer',
        status: 'Open',
        location: 'Remote',
        applicationDeadline: '2024-12-31T00:00:00.000Z',
      },
    ]);
  });

  it('should return null applicationDeadline when not set', async () => {
    jest.spyOn(prisma.position, 'findMany').mockResolvedValue([
      {
        id: 2,
        title: 'Data Scientist',
        status: 'Open',
        location: 'Remote',
        applicationDeadline: null,
      },
    ] as never);

    const result = await getAllPositionsService();

    expect(result[0].applicationDeadline).toBeNull();
  });
});

describe('getCandidatesByPositionService', () => {
  it('should return candidates with their average scores', async () => {
    const mockApplications = [
      {
        id: 1,
        positionId: 1,
        candidateId: 1,
        applicationDate: new Date(),
        currentInterviewStep: 1,
        notes: null,
        candidate: { id: 1, firstName: 'John', lastName: 'Doe' },
        interviewStep: { name: 'Technical Interview' },
        interviews: [{ score: 5 }, { score: 3 }],
      },
    ];

    jest.spyOn(prisma.application, 'findMany').mockResolvedValue(mockApplications as never);

    const result = await getCandidatesByPositionService(1);
    expect(result).toEqual([
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
