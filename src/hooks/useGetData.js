import { useEffect, useState} from 'react';
import axios from 'axios';
import BASE_URL from '../config';

const useGetData = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const path = 'api/products';
      try {
        const { data: response } = await axios.get(`${BASE_URL}/${path}`);
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