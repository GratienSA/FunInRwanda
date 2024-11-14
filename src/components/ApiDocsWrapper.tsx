'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicSwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const ApiDocsWrapper = () => {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    fetch('/api/swagger')
      .then((response) => response.json())
      .then((data) => setSpec(data));
  }, []);

  if (!spec) {
    return <div>Loading...</div>;
  }

  return <DynamicSwaggerUI spec={spec} />;
};

export default ApiDocsWrapper;