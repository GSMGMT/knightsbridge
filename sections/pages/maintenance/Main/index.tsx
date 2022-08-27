import { Row, Col } from 'react-bootstrap';
import { HiOutlineArrowSmRight } from 'react-icons/hi';

import { navigation } from '@navigation';

import {
  Container,
  Description,
  Ilustration,
  Info,
  Subtitle,
  Title,
  Button,
} from './styles';

export const Main = () => (
  <section>
    <Container>
      <Row className="justify-content-between">
        <Col lg={6} xl={5}>
          <Subtitle>Nothing here for now</Subtitle>
          <Title>Under construction</Title>
          <Info>
            <Description>
              Knightsbridge is working on new features and improvements. We will
              be back soon.
            </Description>
            <Description>
              In the meantime join our community on telegram or go to home.
            </Description>
          </Info>
          <Button href="//t.me/knightsDAO" as="a" target="_blank">
            <span>Go to Telegram</span>
            <HiOutlineArrowSmRight className="icon" />
          </Button>
          <Button href={navigation.app.discover} as="a">
            <span>Discover</span> <HiOutlineArrowSmRight className="icon" />
          </Button>
        </Col>
        <Col lg={6}>
          <Ilustration />
        </Col>
      </Row>
    </Container>
  </section>
);
