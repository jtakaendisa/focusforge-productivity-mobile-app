import Svg, { Path } from 'react-native-svg';
import { Text, View, getTokenValue, styled } from 'tamagui';

import Switch from './Switch';

interface Props {
  value: 0 | 1;
  onToggle: () => void;
}

const SettingCard = ({ value, onToggle }: Props) => {
  const customRed1 = getTokenValue('$customRed1');

  return (
    <Container>
      <SettingInfo>
        <Svg width="23" height="22" viewBox="0 0 23 22" fill="none">
          <Path
            d="M14.1935 2.12903L16.3226 2.83871L14.1935 3.54839L13.4839 5.67742L12.7742 3.54839L10.6452 2.83871L12.7742 2.12903L13.4839 0L14.1935 2.12903ZM19.5161 8.16129L22.7097 9.22581L19.5161 10.2903L18.4516 13.4839L17.3871 10.2903L14.1935 9.22581L17.3871 8.16129L18.4516 4.96774L19.5161 8.16129ZM8.51613 4.96774C9.44758 4.96774 10.3435 5.11855 11.1863 5.39355C10.2327 5.76169 9.38992 6.35161 8.72016 7.10121C7.70887 8.22782 7.09677 9.72258 7.09677 11.3548C7.09677 14.8145 9.84677 17.631 13.2798 17.7375C13.3464 17.7375 13.4173 17.7419 13.4839 17.7419C14.4597 17.7419 15.3867 17.5246 16.2161 17.1298C15.7238 18.1677 15.0274 19.0859 14.1847 19.8399C12.6766 21.1839 10.6895 22 8.51613 22C3.81452 22 0 18.1855 0 13.4839C0 9.0129 3.44194 5.34919 7.81976 4.99435C8.0504 4.97661 8.28105 4.96774 8.51613 4.96774ZM2.12903 13.4839C2.12903 17.0101 4.98992 19.871 8.51613 19.871C9.32782 19.871 10.104 19.7202 10.8137 19.4452C7.42056 18.323 4.96774 15.125 4.96774 11.3548C4.96774 10.0508 5.26048 8.81331 5.78387 7.70887C3.62379 8.73347 2.12903 10.9335 2.12903 13.4839Z"
            fill={customRed1}
          />
        </Svg>
        <SettingTitle>Dark Mode</SettingTitle>
      </SettingInfo>
      <Switch value={value ? 1 : 0} onToggle={onToggle} />
    </Container>
  );
};

const Container = styled(View, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 16,
  marginBottom: 14,
  backgroundColor: '$customGray3',
  borderRadius: 12,
});

const SettingInfo = styled(View, {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
});

const SettingTitle = styled(Text, {
  fontSize: 14,
});

export default SettingCard;
