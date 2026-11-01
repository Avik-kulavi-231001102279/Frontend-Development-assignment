/**
 * Attendify - Typed/Convenient Redux Hooks
 */

import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default { useAppDispatch, useAppSelector };
