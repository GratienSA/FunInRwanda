// pages/api-docs.tsx
import { swaggerSpec } from '@/swagger';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';


const ApiDocs = () => {
  return <SwaggerUI spec={swaggerSpec} />;
};

export default ApiDocs;
