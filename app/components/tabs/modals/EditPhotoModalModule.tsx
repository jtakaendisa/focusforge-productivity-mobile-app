import { getTokenValue, styled, Text, View } from 'tamagui';
import BinSvg from '../../icons/BinSvg';
import CameraSvg from '../../icons/CameraSvg';
import GallerySvg from '../../icons/GallerySvg';
import RippleButton from '../RippleButton';

interface Props {
  onCameraPress: () => void;
  onGalleryPress: () => void;
  onRemovePress: () => void;
}

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
          <RippleButton flex onPress={onCameraPress}>
            <Button>
              <CameraSvg size={24} fill={customGray1} />
              <ButtonText>Camera</ButtonText>
            </Button>
          </RippleButton>
          <RippleButton flex onPress={onGalleryPress}>
            <Button>
              <GallerySvg size={24} fill={customGray1} />
              <ButtonText>Gallery</ButtonText>
            </Button>
          </RippleButton>
          <RippleButton flex onPress={onRemovePress}>
            <Button>
              <BinSvg size={24} fill={customRed1} />
              <ButtonText color="$customRed1">Remove</ButtonText>
            </Button>
          </RippleButton>
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
});

const ButtonsContainer = styled(View, {
  height: 120,
  flexDirection: 'row',
  alignItems: 'center',
});

const Button = styled(View, {
  justifyContent: 'center',
  alignItems: 'center',
  gap: 4,
  height: '100%',
  width: '100%',
});

const ButtonText = styled(Text, {
  fontSize: 12,
  color: '$customGray1',
});

export default EditPhotoModalModule;
