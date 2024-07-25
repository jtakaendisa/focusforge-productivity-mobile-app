import { getTokenValue, styled, Text, View } from 'tamagui';
import BinSvg from '../../icons/BinSvg';
import CameraSvg from '../../icons/CameraSvg';
import GallerySvg from '../../icons/GallerySvg';

interface Props {
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
}

const SVG_SIZE = 24;

const EditPhotoModalModule = ({
  onCameraPress,
  onGalleryPress,
  onRemovePress,
}: Props) => {
  const customGray1 = getTokenValue('$customGray1');
  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <HeadingContainer>
        <HeadingText>Edit Profile Photo</HeadingText>
      </HeadingContainer>
      <MainContent>
        <ButtonsContainer>
          <Button onPress={onCameraPress}>
            <CameraSvg size={24} fill={customGray1} />
            <ButtonText>Camera</ButtonText>
          </Button>
          <Button onPress={onGalleryPress}>
            <GallerySvg size={24} fill={customGray1} />
            <ButtonText>Gallery</ButtonText>
          </Button>
          <Button onPress={onRemovePress}>
            <BinSvg size={24} fill={customRed1} />
            <ButtonText color={customRed1}>Remove</ButtonText>
          </Button>
        </ButtonsContainer>
      </MainContent>
    </Container>
  );
};

const Container = styled(View, {
  width: '80%',
  borderRadius: 16,
  backgroundColor: '$customGray3',
});

const HeadingContainer = styled(View, {
  alignItems: 'center',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderColor: '$customGray2',
});

const HeadingText = styled(Text, {
  fontSize: 16,
});

const MainContent = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 32,
  paddingVertical: 20,
});

const ButtonsContainer = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
});

const Button = styled(View, {
  justifyContent: 'space-between',
  alignItems: 'center',
  width: 64,
  height: 64,
  paddingVertical: 8,
});

const ButtonText = styled(Text, {
  fontSize: 12,
  color: '$customGray1',
});

export default EditPhotoModalModule;
