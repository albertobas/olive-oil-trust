import { useDispatch } from 'react-redux';
import { AppDispatch } from '@app/state/store';

const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export default useAppDispatch;
