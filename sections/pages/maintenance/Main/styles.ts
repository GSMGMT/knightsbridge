import styled from 'styled-components';

import IlustrationV from '@public/images/ilustration.svg';

export const Container = styled.div.attrs({ className: 'container' })`
  padding-top: 100px !important;
`;

export const Ilustration = styled(IlustrationV)`
  max-width: 100%;
  width: 100%;
  height: auto;

  @media (max-width: 991px) {
    display: none !important;
  }
`;

export const Title = styled.h1`
  margin-top: 12px;
  margin-bottom: 20px;

  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 64px;
  line-height: 1;
  letter-spacing: -0.02em;
  color: #23262f;
`;

export const Subtitle = styled.h2`
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: #777e91;
  text-transform: uppercase;

  margin: 0;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;

  margin-bottom: 32px;
`;

export const Description = styled.p`
  color: #777e91;

  margin: 0;
`;

export const Button = styled.a`
  background: #0063f5;

  color: #fcfcfd !important;
  text-decoration: none;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  line-height: 16px;
  font-size: 14px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  column-gap: 12px;

  width: fit-content;
  border: none;
  padding: 12px 16px;
  border-radius: 90px;

  transition: column-gap 0.2s, font-size 0.2s;

  .icon {
    font-size: 16px;
  }
  &:hover {
    column-gap: 20px;
  }

  & + & {
    margin-top: 12px;
  }
`;
