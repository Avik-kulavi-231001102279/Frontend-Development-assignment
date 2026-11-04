import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleTheme, setTheme } from '../features/settings/settingsSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggle = () => {
    dispatch(toggleTheme());
  };

  const setSpecificTheme = (newTheme) => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme: toggle,
    setTheme: setSpecificTheme,
  };
};

export default useTheme;

