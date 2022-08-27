import styled from 'styled-components';

import LogoV from '@public/images/logo.svg';

export const Container = styled.div`
  display: flex;
  justify-content: center;

  padding-top: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e6e8ec;

  background-color: white;
`;

export const Logo = styled(LogoV)`
  max-width: 100%;
  height: auto;
`;
