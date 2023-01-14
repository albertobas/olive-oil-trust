import { useDispatch } from 'react-redux';
import { AppDispatch } from 'next-app/src/app/state/store';

const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export default useAppDispatch;
