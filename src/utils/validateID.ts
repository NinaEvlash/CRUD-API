import { validate } from 'uuid';

export const isValidUUID = (id: string) => validate(id);
