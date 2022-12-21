// ~Libraries
import {Group, Path} from '@shopify/react-native-skia';
import React, {memo} from 'react';
import Masked from './Masked';

const DrawingMasked = ({
  drawPath,
  listCompletedPath = [],
  completedFillPath = null,
  scaleRatio = 1,
}) => {
  return (
    <Group transform={[{scale: scaleRatio}]}>
      {drawPath && (
        <Group>
          <Path
            style={drawPath.style}
            strokeCap="round"
            path={drawPath.path}
            color={drawPath.strokeColor}
            strokeWidth={
              !drawPath.isBrush ? 1 : drawPath.strokeType.widthStroke * 2
            }
            antiAlias={true}
          />
          {drawPath.style !== 'fill' && drawPath.isBrush && (
            <Path path={drawPath.path} color="#FFFFFF" />
          )}
        </Group>
      )}
      {drawPath.style !== 'fill' && drawPath.isBrush && (
        <Masked
          drawPath={drawPath}
          listCompletedPath={listCompletedPath}
          completedFillPath={completedFillPath}
        />
      )}
    </Group>
  );
};

export default memo(DrawingMasked);
