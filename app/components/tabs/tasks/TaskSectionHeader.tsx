import { View, Text, styled } from 'tamagui';

import { toFormattedSectionTitle } from '@/app/utils';

interface Props {
  title: string;
}

const TaskSectionHeader = ({ title }: Props) => {
  return (
    <Container>
      <HeaderLabel>
        <HeaderText>{toFormattedSectionTitle(title)}</HeaderText>
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
  borderColor: '$customGray2',
});

const HeaderLabel = styled(View, {
  paddingVertical: 2,
  paddingHorizontal: 8,
  backgroundColor: '$customGray4',
  borderRadius: 8,
});

const HeaderText = styled(Text, {
  fontSize: 12,
});

export default TaskSectionHeader;
