export function handleResponse(response) {
  if (response && response.data) {
    return response.data;
  }
  return response;
}

export function handleError(error) {
  if (error.response) {
    const { status, data } = error.response;

    if (data && data.message) {
      return data.message;
    }

    if (data && data.error) {
      return data.error;
    }

    const statusMessages = {
      400: 'Invalid request. Please check your input.',
      401: 'Unauthorized. Please log in again.',
      403: 'You do not have permission to perform this action.',
      404: 'Resource not found.',
      409: 'Conflict. The resource already exists.',
      422: 'Validation failed. Please check your input.',
      429: 'Too many requests. Please try again later.',
      500: 'Internal server error. Please try again later.',
      502: 'Service temporarily unavailable.',
      503: 'Service unavailable. Please try again later.',
    };

    return statusMessages[status] || `Request failed with status ${status}`;
  }

  if (error.request) {
    return 'No response from server. Please check your connection.';
  }

  return error.message || 'An unexpected error occurred.';
}

export function normalizeResponse(data) {
  if (data === null || data === undefined) {
    return { success: true, data: null, message: null };
  }

  if (data.success !== undefined) {
    return {
      success: data.success,
      data: data.data ?? null,
      message: data.message ?? null,
      meta: data.meta ?? null,
    };
  }

  return {
    success: true,
    data,
    message: null,
  };
}
