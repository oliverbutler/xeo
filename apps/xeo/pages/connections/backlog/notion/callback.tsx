import { CentredLoader } from '@xeo/ui';
import { Content } from 'components/Content';
import { NextSeo } from 'next-seo';
import { NextRouter, useRouter } from 'next/router';
import { useEffect } from 'react';
import { apiPost } from 'utils/api';
import { PostNotionCallback } from 'pages/api/connections/notion/callback';
import { toast } from 'react-toastify';

const handleCallback = async (router: NextRouter) => {
  const { data, error } = await apiPost<PostNotionCallback>(
    '/api/connections/notion/callback',
    {
      code: router.query.code as string,
      state: JSON.parse(router.query.state as string),
    }
  );

  if (error) {
    toast.error(error.body?.message || error.generic);
    router.push('/connections');
    return;
  }

  toast.success(data?.successMessage);
  router.push('/connections');
};

export function Index() {
  const router = useRouter();

  useEffect(() => {
    handleCallback(router);
  }, [router]);

  return (
    <Content>
      <NextSeo
        title={`Xeo Backlog`}
        description={`View Xeo Backlog and add or remove members`}
      />
      <CentredLoader />
    </Content>
  );
}

export default Index;
