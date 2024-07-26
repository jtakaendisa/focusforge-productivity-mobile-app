import { IconProps } from '@/app/entities';
import Svg, { Path } from 'react-native-svg';

const MedicalFolderSvg = ({ size = 20, fill = 'white' }: IconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 512 448" fill="none">
      <Path
        d="M448 448H64C28.7 448 0 419.3 0 384V64C0 28.7 28.7 0 64 0H192C212.1 0 231.1 9.5 243.2 25.6L262.4 51.2C268.4 59.3 277.9 64 288 64H448C483.3 64 512 92.7 512 128V384C512 419.3 483.3 448 448 448ZM224 176V224H176C167.2 224 160 231.2 160 240V272C160 280.8 167.2 288 176 288H224V336C224 344.8 231.2 352 240 352H272C280.8 352 288 344.8 288 336V288H336C344.8 288 352 280.8 352 272V240C352 231.2 344.8 224 336 224H288V176C288 167.2 280.8 160 272 160H240C231.2 160 224 167.2 224 176Z"
        fill={fill}
      />
    </Svg>
  );
};

export default MedicalFolderSvg;
