import { Container, Typography, Box } from '@mui/material';
import PricingTable from '@/components/stripe/PricingTable';


export default function Home() {
  return (
    <Container maxWidth="md">

      <Box>
        <PricingTable />
      </Box>
    </Container>
  );
}
