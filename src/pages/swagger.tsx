import dynamic from 'next/dynamic';
import { getSwaggerSpec } from '@/utils/swagger';

const SwaggerUI = dynamic<{ spec: any }>(() => import('swagger-ui-react'), {
  ssr: false,
});

export default function SwaggerPage({ spec }: { spec: any }) {
  return (
    <div style={{ height: '100vh' }}>
      <SwaggerUI spec={spec} />
    </div>
  );
}

export async function getStaticProps() {
  const spec = getSwaggerSpec();
  return {
    props: {
      spec,
    },
  };
}
