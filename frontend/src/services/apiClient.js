const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export const fetchJson = async (path, options = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, options);
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const message =
            (data && (data.message || data.error)) ||
            `Error ${response.status}: ${response.statusText}`;
        throw new Error(message);
    }

    return data;
};
