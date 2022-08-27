import { Col, Row } from 'react-bootstrap';
import { FiTwitter, FiInstagram } from 'react-icons/fi';

import { Contain, Container, Social } from './styles';

export const Footer = () => (
  <Contain>
    <Container>
      <Row className="justify-content-between">
        <Col xs="auto">
          <span>Copyright © 2022</span>
        </Col>
        <Col xs="auto">
          <Social.Area>
            <Social.Link href="//twitter.com/knightsdaox">
              <FiTwitter />
            </Social.Link>{' '}
            <Social.Link href="//www.instagram.com/knightsdaox/">
              <FiInstagram />
            </Social.Link>
          </Social.Area>
        </Col>
      </Row>
    </Container>
  </Contain>
);
