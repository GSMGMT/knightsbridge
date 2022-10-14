import { createContext } from 'react';

export const defaulTitle = 'KnightsBridge';

export const TitleContext = createContext<string>(defaulTitle);
