import { modules } from 'next-app/src/shared/utils/constants';

export type Module = typeof modules[keyof typeof modules];
