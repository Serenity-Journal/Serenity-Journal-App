import Typography from '@mui/material/Typography';

import Meta from '@/components/Meta';
import { FullSizeCenteredFlexBox } from '@/components/styled';

function Page1() {
  return (
    <>
      <Meta title="page 1" />
      <FullSizeCenteredFlexBox>
        <Typography variant="h3">TODO: Login located at {'src/pages/Register'}</Typography>
        <a href={'/login'}>Register Button</a>
      </FullSizeCenteredFlexBox>
    </>
  );
}

export default Page1;
