import { memo } from 'react';
import { IconType } from 'react-icons';

type Props = {
  icon: IconType;
  dim?: {
    height: number;
    width: number;
  };
  rotate?: number;
};

export default memo(function SVG({ icon, dim, rotate }: Props) {
  const iconRecord = { icon };
  return (
    <iconRecord.icon
      style={{
        height: `${dim ? dim.height : '1'}em`,
        width: `${dim ? dim.width : '1'}em`,
        transform: `rotate(${rotate ? rotate : 0}deg)`,
        fill: 'currentcolor'
      }}
    />
  );
});
