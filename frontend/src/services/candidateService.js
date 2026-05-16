import { fetchJson } from './apiClient';

export const updateCandidateStage = (candidateId, applicationId, currentInterviewStep) =>
    fetchJson(`/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, currentInterviewStep }),
    });
