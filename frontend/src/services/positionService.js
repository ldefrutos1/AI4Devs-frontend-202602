import { fetchJson } from './apiClient';

export const getPositions = () => fetchJson('/position');

export const getCandidatesByPosition = (positionId) =>
    fetchJson(`/position/${positionId}/candidates`);

export const getInterviewFlow = async (positionId) => {
    const data = await fetchJson(`/position/${positionId}/interviewflow`);
    const payload = data.interviewFlow;

    return {
        positionName: payload.positionName,
        interviewFlow: {
            id: payload.interviewFlow.id,
            description: payload.interviewFlow.description,
            interviewSteps: [...payload.interviewFlow.interviewSteps].sort(
                (a, b) => a.orderIndex - b.orderIndex
            ),
        },
    };
};
