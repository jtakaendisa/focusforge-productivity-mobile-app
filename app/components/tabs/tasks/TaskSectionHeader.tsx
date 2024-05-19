import { View, Text, styled } from 'tamagui';

interface Props {
  title: string;
}

const TaskSectionHeader = ({ title }: Props) => {
  return (
    <Container>
      <HeaderLabel>
        <HeaderText>{title}</HeaderText>
      </HeaderLabel>
    </Container>
  );
};

const Container = styled(View, {
  justifyContent: 'center',
  alignItems: 'flex-start',
  height: 50,
  paddingLeft: 6,
  borderBottomWidth: 1,
  borderColor: '#262626',
});

const HeaderLabel = styled(View, {
  paddingVertical: 2,
  paddingHorizontal: 8,
  backgroundColor: 'rgba(140, 140, 140, 0.25)',
  borderRadius: 8,
});

const HeaderText = styled(Text, {
  fontSize: 12,
});

export default TaskSectionHeader;
