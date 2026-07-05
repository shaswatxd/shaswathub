"use client";

import dynamic from 'next/dynamic';

const PageClient = dynamic(() => import('./components/PageClient'), { ssr: false });

export default function Page() {
  return <PageClient />;
}
