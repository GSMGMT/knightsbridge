import { Header } from '@sections/pages/maintenance/Header';
import { Main } from '@sections/pages/maintenance/Main';
import { Footer } from '@sections/pages/maintenance/Footer';
import { Container } from '@styles/pages/404';

const NotFound = () => (
  <Container className="d-flex flex-column min-vh-100">
    <Header />
    <Main />
    <Footer />
  </Container>
);
export default NotFound;
