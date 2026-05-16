import React from 'react';
import { Card } from 'react-bootstrap';

type CandidateKanbanCardProps = {
    fullName: string;
    averageScore: number;
    isDragging?: boolean;
};

const MAX_SCORE = 5;

const CandidateKanbanCard: React.FC<CandidateKanbanCardProps> = ({
    fullName,
    averageScore,
    isDragging = false,
}) => {
    const filledDots = Math.min(MAX_SCORE, Math.max(0, Math.round(averageScore)));

    return (
        <Card
            className={`shadow-sm mb-3 border-0 ${isDragging ? 'border border-primary' : ''}`}
            style={{
                transition: 'box-shadow 0.2s ease, transform 0.2s ease',
                cursor: 'grab',
            }}
        >
            <Card.Body className="p-3">
                <Card.Title className="fs-6 mb-2">{fullName}</Card.Title>
                <div className="d-flex gap-1" aria-label={`Puntuación media: ${averageScore}`}>
                    {Array.from({ length: MAX_SCORE }, (_, index) => (
                        <span
                            key={index}
                            style={{
                                width: 14,
                                height: 14,
                                borderRadius: '50%',
                                backgroundColor: index < filledDots ? '#198754' : '#dee2e6',
                                display: 'inline-block',
                            }}
                        />
                    ))}
                </div>
            </Card.Body>
        </Card>
    );
};

export default CandidateKanbanCard;
