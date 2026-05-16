import { fetchJson } from './apiClient';
import { getInterviewFlow } from './positionService';

jest.mock('./apiClient');

describe('getInterviewFlow', () => {
  it('unwraps nested response and sorts steps by orderIndex', async () => {
    fetchJson.mockResolvedValue({
      interviewFlow: {
        positionName: 'Senior Full-Stack Engineer',
        interviewFlow: {
          id: 1,
          description: 'Standard process',
          interviewSteps: [
            { id: 2, name: 'Technical Interview', orderIndex: 2 },
            { id: 1, name: 'Initial Screening', orderIndex: 1 },
          ],
        },
      },
    });

    const result = await getInterviewFlow(1);

    expect(fetchJson).toHaveBeenCalledWith('/position/1/interviewflow');
    expect(result.positionName).toBe('Senior Full-Stack Engineer');
    expect(result.interviewFlow.interviewSteps.map((step) => step.name)).toEqual([
      'Initial Screening',
      'Technical Interview',
    ]);
  });
});
