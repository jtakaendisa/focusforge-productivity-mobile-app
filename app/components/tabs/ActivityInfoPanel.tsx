import { ReactElement, ReactNode } from 'react';
import { styled, View, Text } from 'tamagui';

interface Props {
  isBordered?: boolean;
  title?: string;
  icon?: ReactElement;
  children: ReactNode;
}

const ActivityInfoPanel = ({
  isBordered = true,
  title = '',
  icon,
  children,
}: Props) => {
  return (
    <Container isBordered={isBordered}>
      {!!title.length && (
        <HeadingRow>
          <HeadingIcon>{icon}</HeadingIcon>
          <HeadingLabel>
            <Text>{title}</Text>
          </HeadingLabel>
        </HeadingRow>
      )}
      {children}
    </Container>
  );
};

const Container = styled(View, {
  borderTopWidth: 6,
  marginBottom: 24,
  variants: {
    isBordered: {
      true: {
        borderColor: '$customGray2',
      },
      false: {
        borderColor: 'transparent',
      },
    },
  } as const,
});

const HeadingRow = styled(View, {
  position: 'relative',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  height: 40,
});

const HeadingIcon = styled(View, {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  justifyContent: 'center',
  alignItems: 'center',
  width: 40,
  height: 40,
});

const HeadingLabel = styled(View, {
  paddingHorizontal: 6,
  paddingVertical: 2,
  backgroundColor: '$customGray4',
  borderRadius: 4,
});

export default ActivityInfoPanel;
