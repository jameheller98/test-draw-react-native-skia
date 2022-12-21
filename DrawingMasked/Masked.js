import {Mask, Path} from '@shopify/react-native-skia';
import React from 'react';

const Masked = ({drawPath, listCompletedPath, completedFillPath}) => {
  return (
    <Mask mask={<Path path={drawPath.path} color="white" />}>
      {completedFillPath && (
        <Path
          path={completedFillPath.path}
          style="fill"
          color={completedFillPath.color}
        />
      )}
      {listCompletedPath.length > 0 &&
        listCompletedPath.map(completedPath => {
          return completedPath.strokeType.mode === 'backgroundColor' ? (
            <Path
              key={completedPath.id}
              style="fill"
              path={drawPath.path}
              color={completedPath.strokeColor.color}
            />
          ) : (
            <Path
              key={completedPath.id}
              style="stroke"
              strokeCap={completedPath.strokeType.strokeCap}
              strokeJoin={completedPath.strokeType.strokeJoin}
              path={completedPath.path}
              color={completedPath.strokeColor.color}
              strokeWidth={completedPath.strokeType.widthStroke}
            />
          );
        })}
    </Mask>
  );
};

export default Masked;
