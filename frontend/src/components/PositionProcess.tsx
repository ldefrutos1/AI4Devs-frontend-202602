import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Container, Spinner } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import {
    DragDropContext,
    Draggable,
    Droppable,
    type DropResult,
} from '@hello-pangea/dnd';
import { Link, useParams } from 'react-router-dom';
import CandidateKanbanCard from './CandidateKanbanCard';
import { updateCandidateStage } from '../services/candidateService';
import { getCandidatesByPosition, getInterviewFlow } from '../services/positionService';

type InterviewStep = {
    id: number;
    name: string;
    orderIndex: number;
};

type Candidate = {
    id: number;
    fullName: string;
    currentInterviewStep: string;
    averageScore: number;
    applicationId: number;
};

const UNASSIGNED_COLUMN = 'Otros';

const columnStyle: React.CSSProperties = {
    minWidth: 280,
    maxWidth: 280,
};

const PositionProcess: React.FC = () => {
    const { positionId } = useParams<{ positionId: string }>();
    const [positionName, setPositionName] = useState('');
    const [steps, setSteps] = useState<InterviewStep[]>([]);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [moveError, setMoveError] = useState('');
    const [savingApplicationId, setSavingApplicationId] = useState<number | null>(null);

    useEffect(() => {
        const loadProcess = async () => {
            const id = Number(positionId);
            if (!positionId || Number.isNaN(id)) {
                setError('Identificador de posición no válido');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const [flowData, candidatesData] = await Promise.all([
                    getInterviewFlow(id),
                    getCandidatesByPosition(id),
                ]);

                setPositionName(flowData.positionName);
                setSteps(flowData.interviewFlow.interviewSteps);
                setCandidates(candidatesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar el proceso');
                setPositionName('');
                setSteps([]);
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        loadProcess();
    }, [positionId]);

    const stepNames = useMemo(() => new Set(steps.map((step) => step.name)), [steps]);

    const unassignedCandidates = useMemo(
        () => candidates.filter((candidate) => !stepNames.has(candidate.currentInterviewStep)),
        [candidates, stepNames]
    );

    const handleDragEnd = useCallback(
        async (result: DropResult) => {
            const { destination, source, draggableId } = result;

            if (!destination) return;
            if (destination.droppableId === UNASSIGNED_COLUMN) return;
            if (
                source.droppableId === destination.droppableId &&
                source.index === destination.index
            ) {
                return;
            }

            const applicationId = Number(draggableId);
            const targetStep = steps.find((step) => String(step.id) === destination.droppableId);
            const candidate = candidates.find((c) => c.applicationId === applicationId);

            if (!targetStep || !candidate) return;
            if (candidate.currentInterviewStep === targetStep.name) return;

            const previousCandidates = candidates;

            setCandidates((prev) =>
                prev.map((c) =>
                    c.applicationId === applicationId
                        ? { ...c, currentInterviewStep: targetStep.name }
                        : c
                )
            );
            setMoveError('');

            try {
                setSavingApplicationId(applicationId);
                await updateCandidateStage(candidate.id, candidate.applicationId, targetStep.id);
            } catch (err) {
                setCandidates(previousCandidates);
                setMoveError(
                    err instanceof Error ? err.message : 'Error al actualizar la fase del candidato'
                );
            } finally {
                setSavingApplicationId(null);
            }
        },
        [candidates, steps]
    );

    const renderColumn = (
        droppableId: string,
        title: string,
        columnCandidates: Candidate[],
        options: { isDropDisabled?: boolean } = {}
    ) => (
        <Droppable droppableId={droppableId} isDropDisabled={options.isDropDisabled}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="rounded p-3 flex-shrink-0"
                    style={{
                        ...columnStyle,
                        backgroundColor: snapshot.isDraggingOver ? '#e2e6ea' : '#f0f0f0',
                        transition: 'background-color 0.2s ease',
                    }}
                >
                    <h5 className="fw-semibold mb-3">{title}</h5>
                    {columnCandidates.length === 0 && !snapshot.isDraggingOver ? (
                        <p className="text-muted small mb-0">Sin candidatos</p>
                    ) : (
                        columnCandidates.map((candidate, index) => (
                            <Draggable
                                key={candidate.applicationId}
                                draggableId={String(candidate.applicationId)}
                                index={index}
                                isDragDisabled={savingApplicationId === candidate.applicationId}
                            >
                                {(dragProvided, dragSnapshot) => (
                                    <div
                                        ref={dragProvided.innerRef}
                                        {...dragProvided.draggableProps}
                                        {...dragProvided.dragHandleProps}
                                        style={{
                                            ...dragProvided.draggableProps.style,
                                            opacity:
                                                savingApplicationId === candidate.applicationId
                                                    ? 0.6
                                                    : 1,
                                        }}
                                        className={
                                            dragSnapshot.isDragging ? 'shadow-lg' : undefined
                                        }
                                    >
                                        <CandidateKanbanCard
                                            fullName={candidate.fullName}
                                            averageScore={candidate.averageScore}
                                            isDragging={dragSnapshot.isDragging}
                                        />
                                    </div>
                                )}
                            </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );

    return (
        <Container className="mt-5 mb-5">
            <div className="d-flex align-items-center flex-wrap gap-2 mb-4">
                <Link
                    to="/positions"
                    className="d-inline-flex align-items-center text-decoration-none text-dark"
                    aria-label="Volver al listado de posiciones"
                >
                    <ArrowLeft size={28} />
                </Link>
                <h1 className="mb-0 fs-2 fw-bold">
                    {positionName || 'Proceso de selección'}
                </h1>
            </div>

            {loading && (
                <div className="text-center py-5">
                    <Spinner animation="border" role="status" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}
            {moveError && (
                <Alert variant="danger" onClose={() => setMoveError('')} dismissible>
                    {moveError}
                </Alert>
            )}

            {!loading && !error && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div
                        className="d-flex flex-nowrap gap-3 overflow-auto pb-3"
                        style={{ minHeight: 320 }}
                    >
                        {steps.map((step) => (
                            <React.Fragment key={step.id}>
                                {renderColumn(
                                    String(step.id),
                                    step.name,
                                    candidates.filter(
                                        (c) => c.currentInterviewStep === step.name
                                    )
                                )}
                            </React.Fragment>
                        ))}
                        {unassignedCandidates.length > 0 &&
                            renderColumn(UNASSIGNED_COLUMN, UNASSIGNED_COLUMN, unassignedCandidates, {
                                isDropDisabled: true,
                            })}
                    </div>
                </DragDropContext>
            )}
        </Container>
    );
};

export default PositionProcess;
