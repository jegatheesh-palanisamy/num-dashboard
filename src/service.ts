import axios from 'axios';

export const fetchDataSetByIndex = (index: number) =>
  axios.get(`${process.env.REACT_APP_BASE_URL}/dataset?set_index=${index}`);
