import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from 'next-app/src/app/state/store';

const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default useAppSelector;
