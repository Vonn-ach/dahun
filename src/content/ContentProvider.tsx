import { useMemo, type ReactNode } from 'react';
import { ContentContext, createContentStore, type ContentSource } from './context';

interface ContentProviderProps {
  source: ContentSource;
  children: ReactNode;
}

export function ContentProvider({ source, children }: ContentProviderProps) {
  const store = useMemo(() => createContentStore(source), [source]);
  return <ContentContext.Provider value={store}>{children}</ContentContext.Provider>;
}
