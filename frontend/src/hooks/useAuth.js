import { create } from 'zustand';
import axios from '../lib/axios';

const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    try {
      localStorage.removeItem('token');
      set({ user: null });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}));

export const useAuth = () => {
  const { user, loading, setUser, setLoading, logout } = useAuthStore();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await axios.get('/api/auth/me');
      setUser(data);
    } catch (error) {
      console.error('Fetch user error:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, []);

  return { user, loading, logout, refetch: fetchUser };
};

export default useAuth;