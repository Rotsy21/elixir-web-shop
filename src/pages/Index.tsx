
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Rediriger vers la page d'accueil
    navigate('/');
  }, [navigate]);
  
  return null;
};

export default Index;
