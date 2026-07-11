import api from './api';

export const getUsersByRole = (role) => api.get(`/users/by-role/${role}`);

export default { getUsersByRole };
