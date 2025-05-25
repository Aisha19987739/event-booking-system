// src/hooks/useRegister.ts
import api from '../sevices/api'; // تأكد من مسار الملف صحيح

export const useRegister = () => {
  const register = async (name: string, email: string, password: string) => {
    const response = await api.post('/api/auth/register', {
      name,
      email,
      password,
      username:''
    });

    return response.data;
  };

  return { register };
};
