"use client";

import { Provider } from 'jotai';

export function JotaiProvider({ children }) {
  return <Provider>{children}</Provider>;
}
