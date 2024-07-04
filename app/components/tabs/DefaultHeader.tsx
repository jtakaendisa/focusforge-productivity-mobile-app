import { styled, View, Text } from 'tamagui';
import HeaderLeftActions from './HeaderLeftActions';
import HeaderRightActions from './HeaderRightActions';

interface Props {
  height: number;
  title: string;
}

const DefaultHeader = ({ height, title }: Props) => {
  return (
    <Container height={height}>
      <Row>
        <LeftActionsContainer>
          <HeaderLeftActions />
        </LeftActionsContainer>
        <TitleContainer>
          <Title>{title}</Title>
        </TitleContainer>
        <HeaderRightActions />
      </Row>
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: 'pink',
});

const Row = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
});

const LeftActionsContainer = styled(View, {
  marginLeft: 8,
  marginRight: 16,
});

const TitleContainer = styled(View, {
  flex: 1,
});

const Title = styled(Text, {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#fff',
});

export default DefaultHeader;
