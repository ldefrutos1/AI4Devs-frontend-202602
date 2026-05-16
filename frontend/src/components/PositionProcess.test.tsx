import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PositionProcess from './PositionProcess';
import * as positionService from '../services/positionService';

jest.mock('../services/positionService');

jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Droppable: ({ children }: { children: (a: unknown, b: unknown) => React.ReactNode }) =>
    children(
      { innerRef: jest.fn(), droppableProps: {}, placeholder: null },
      { isDraggingOver: false }
    ),
  Draggable: ({ children }: { children: (a: unknown, b: unknown) => React.ReactNode }) =>
    children(
      { innerRef: jest.fn(), draggableProps: { style: {} }, dragHandleProps: {} },
      { isDragging: false }
    ),
}));

const mockFlow = {
  positionName: 'Senior Full-Stack Engineer',
  interviewFlow: {
    id: 1,
    description: 'Standard process',
    interviewSteps: [
      { id: 1, name: 'Initial Screening', orderIndex: 1, interviewFlowId: 1, interviewTypeId: 1 },
      { id: 2, name: 'Technical Interview', orderIndex: 2, interviewFlowId: 1, interviewTypeId: 2 },
    ],
  },
};

const mockCandidates = [
  {
    id: 1,
    fullName: 'John Doe',
    currentInterviewStep: 'Technical Interview',
    averageScore: 5,
    applicationId: 1,
  },
  {
    id: 3,
    fullName: 'Carlos García',
    currentInterviewStep: 'Initial Screening',
    averageScore: 0,
    applicationId: 4,
  },
];

const renderProcess = (path = '/positions/1/process') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/positions/:positionId/process" element={<PositionProcess />} />
      </Routes>
    </MemoryRouter>
  );

describe('PositionProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (positionService.getInterviewFlow as jest.Mock).mockResolvedValue(mockFlow);
    (positionService.getCandidatesByPosition as jest.Mock).mockResolvedValue(mockCandidates);
  });

  it('shows position title, columns and candidates in correct columns', async () => {
    renderProcess();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Senior Full-Stack Engineer' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Initial Screening')).toBeInTheDocument();
    expect(screen.getByText('Technical Interview')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Carlos García')).toBeInTheDocument();
    expect(positionService.getInterviewFlow).toHaveBeenCalledWith(1);
    expect(positionService.getCandidatesByPosition).toHaveBeenCalledWith(1);
  });

  it('shows error for invalid position id', async () => {
    renderProcess('/positions/abc/process');

    await waitFor(() => {
      expect(screen.getByText('Identificador de posición no válido')).toBeInTheDocument();
    });

    expect(positionService.getInterviewFlow).not.toHaveBeenCalled();
    expect(positionService.getCandidatesByPosition).not.toHaveBeenCalled();
  });
});
