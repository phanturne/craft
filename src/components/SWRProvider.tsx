'use client';

import { SWRConfig } from 'swr';

export default function SWRProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
      }}
    >
      {children}
    </SWRConfig>
  );
} 