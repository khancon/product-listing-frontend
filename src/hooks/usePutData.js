import { useEffect, useState} from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const usePutData = ({ payload }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const path = 'api/products';
      const [id, name, price] = payload

      if (!id || !name || price === ''){
        setError('Name and price are required.');
        return;
      }

      try {
        const { data: response } = await axios.put(`${BASE_URL}/${path}/${id}`, payload);
        setData(response);
      } catch (error) {
        console.error(error)
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return {
    data,
    loading,
  };
};

export default useGetData;