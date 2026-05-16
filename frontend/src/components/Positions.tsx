import React, { useEffect, useState } from 'react';
import { Alert, Card, Container, Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getPositions } from '../services/positionService';

type Position = {
    id: number;
    title: string;
    status: string;
    location: string;
    applicationDeadline: string | null;
};

const mapStatusLabel = (status: string): string => {
    const labels: Record<string, string> = {
        Open: 'Abierto',
        Draft: 'Borrador',
        Closed: 'Cerrado',
        Filled: 'Contratado',
    };
    return labels[status] ?? status;
};

const getStatusBadgeClass = (status: string): string => {
    const label = mapStatusLabel(status);
    if (label === 'Abierto') return 'bg-warning';
    if (label === 'Contratado') return 'bg-success';
    if (label === 'Borrador') return 'bg-secondary';
    return 'bg-warning';
};

const formatDeadline = (deadline: string | null): string => {
    if (!deadline) return '—';
    return new Date(deadline).toLocaleDateString('es-ES');
};

const Positions: React.FC = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadPositions = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getPositions();
                setPositions(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error al cargar las posiciones');
                setPositions([]);
            } finally {
                setLoading(false);
            }
        };

        loadPositions();
    }, []);

    return (
        <Container className="mt-5">
            <h2 className="text-center mb-4">Posiciones</h2>
            <Row className="mb-4">
                <Col md={3}>
                    <Form.Group controlId="filterTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por título"
                            className="shadow-sm"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="filterDate">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            className="shadow-sm"
                        />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="filterStatus">
                        <Form.Label>Estado</Form.Label>
                        <Form.Control as="select" className="shadow-sm">
                            <option value="">Todos</option>
                            <option value="open">Abierto</option>
                            <option value="filled">Contratado</option>
                            <option value="closed">Cerrado</option>
                            <option value="draft">Borrador</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group controlId="filterManager">
                        <Form.Label>Manager</Form.Label>
                        <Form.Control as="select" className="shadow-sm">
                            <option value="">Todos</option>
                            <option value="john_doe">John Doe</option>
                            <option value="jane_smith">Jane Smith</option>
                            <option value="alex_jones">Alex Jones</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" role="status" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <Row>
                    {positions.map((position) => (
                        <Col md={4} key={position.id} className="mb-4">
                            <Card className="shadow-sm">
                                <Card.Body className="p-4">
                                    <Card.Title>{position.title}</Card.Title>
                                    <Card.Text>
                                        <strong>Ubicación:</strong> {position.location}<br />
                                        <strong>Deadline:</strong> {formatDeadline(position.applicationDeadline)}
                                    </Card.Text>
                                    <span className={`badge ${getStatusBadgeClass(position.status)} text-white`}>
                                        {mapStatusLabel(position.status)}
                                    </span>
                                    <div className="d-flex justify-content-between mt-3">
                                        <Link
                                            to={`/positions/${position.id}/process`}
                                            className="text-decoration-none"
                                        >
                                            <Button variant="primary">Ver proceso</Button>
                                        </Link>
                                        <Button variant="secondary">Editar</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default Positions;

