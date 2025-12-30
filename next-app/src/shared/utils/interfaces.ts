import { modules } from '@shared/utils/constants';

export type Module = (typeof modules)[keyof typeof modules];
