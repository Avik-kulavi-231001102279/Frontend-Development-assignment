import axios from 'axios';

const API = 'http://localhost:5000/api/employees';

export const fetchEmployees = (search = '', department = '') => {
  const params = {};
  if (search) params.search = search;
  if (department) params.department = department;
  return axios.get(API, { params });
};

export const addEmployee = (data) => axios.post(API, data);

export const editEmployee = (id, data) => axios.put(`${API}/${id}`, data);

export const removeEmployee = (id) => axios.delete(`${API}/${id}`);
