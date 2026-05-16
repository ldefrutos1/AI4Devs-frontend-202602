import React from 'react';
import { render, screen } from '@testing-library/react';
import CandidateKanbanCard from './CandidateKanbanCard';

const GREEN = 'rgb(25, 135, 84)';
const GRAY = 'rgb(222, 226, 230)';

const getScoreDots = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('span[style]')).filter(
    (el) => (el as HTMLElement).style.borderRadius === '50%'
  ) as HTMLElement[];

describe('CandidateKanbanCard', () => {
  it('renders full name', () => {
    render(<CandidateKanbanCard fullName="John Doe" averageScore={4} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders 4 green dots for averageScore 4', () => {
    const { container } = render(
      <CandidateKanbanCard fullName="Jane Smith" averageScore={4} />
    );
    const dots = getScoreDots(container);
    const greenDots = dots.filter((dot) => dot.style.backgroundColor === GREEN);

    expect(dots).toHaveLength(5);
    expect(greenDots).toHaveLength(4);
  });

  it('renders all gray dots for averageScore 0', () => {
    const { container } = render(
      <CandidateKanbanCard fullName="Carlos García" averageScore={0} />
    );
    const dots = getScoreDots(container);
    const greenDots = dots.filter((dot) => dot.style.backgroundColor === GREEN);
    const grayDots = dots.filter((dot) => dot.style.backgroundColor === GRAY);

    expect(dots).toHaveLength(5);
    expect(greenDots).toHaveLength(0);
    expect(grayDots).toHaveLength(5);
  });
});
