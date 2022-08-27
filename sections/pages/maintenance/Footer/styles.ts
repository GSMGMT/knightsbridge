import styled from 'styled-components';

export const Contain = styled.footer`
  margin-top: auto;
  border-top: 1px solid #e6e8ec;

  color: #777e91;
  font-size: 12px;
  line-height: 20px;

  background-color: white;
`;

export const Container = styled.div.attrs({ className: 'container' })`
  padding-top: 20px !important;
  padding-bottom: 20px !important;
`;

const SocialArea = styled.div`
  font-size: 20px;

  display: flex;
  flex-direction: row;
  column-gap: 20px;
`;
const SocialLink = styled.a.attrs({ target: '_blank' })`
  color: inherit;

  transition: color 0.2s;

  &:hover {
    color: #273990;
  }
`;
export const Social = {
  Area: SocialArea,
  Link: SocialLink,
};
