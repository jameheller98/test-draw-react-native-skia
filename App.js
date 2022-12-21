import {Canvas, Skia, useTouchHandler} from '@shopify/react-native-skia';
import _ from 'lodash';
import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView, View} from 'react-native';

import listDrawPath from './dataDrawPathFake.json';
import DrawingMasked from './DrawingMasked';
import {findIndexContainPointInPaths, mapperAttributesToPath} from './utils';

const App = () => {
  const isDrawing = useRef(false);
  const PointRef = useRef({x: 0, y: 0});
  const lengthPathPrevious = useRef(0);
  const [listCompletedPath, setListCompletedPath] = useState([]);
  const [listDrawPathState, setListDrawPathState] = useState(
    listDrawPath.map(drawPath => ({
      ...drawPath,
      path: mapperAttributesToPath(drawPath.typeShape, drawPath.attributes),
    })),
  );

  const onDrawingActive = useCallback(
    ({x, y}) => {
      if (!isDrawing.current) return;

      if (listCompletedPath.length === lengthPathPrevious.current) {
        const path = listCompletedPath[listCompletedPath.length - 1];
        const xMid = (PointRef.current.x + x) / 2;
        const yMid = (PointRef.current.y + y) / 2;

        path.path.quadTo(PointRef.current.x, PointRef.current.y, xMid, yMid);
      }

      PointRef.current = {x, y};
    },
    [listCompletedPath],
  );

  const onDrawingStart = useCallback(
    ({x, y}) => {
      const drawIndexCurrent = findIndexContainPointInPaths(listDrawPathState, {
        x,
        y,
      });

      if (drawIndexCurrent >= 0) {
        const pathSkia = Skia.Path.Make();
        pathSkia.moveTo(0, 0);
        pathSkia.lineTo(0, 0);
        const completedPath = {
          id: _.uniqueId(),
          path: pathSkia.copy(),
          strokeType: {
            id: 1,
            mode: 'color',
            type: 'crayon',
            widthStroke: 7,
            strokeCap: 'round',
            strokeJoin: 'round',
          },
          strokeColor: {
            id: 3,
            color: '#646FBF',
          },
        };

        lengthPathPrevious.current = listCompletedPath.length + 1;

        isDrawing.current = true;

        setListCompletedPath(listCompletedPath =>
          listCompletedPath.concat(completedPath),
        );

        setListDrawPathState(listDrawPathState => {
          const newDrawPath = {
            ...listDrawPathState[drawIndexCurrent],
            completedPaths: listDrawPathState[
              drawIndexCurrent
            ]?.completedPaths?.concat(completedPath) || [completedPath],
            completedPathIds: listDrawPathState[
              drawIndexCurrent
            ]?.completedPathIds?.concat(completedPath.id) || [completedPath.id],
          };

          return [
            ...listDrawPathState.slice(0, drawIndexCurrent),
            newDrawPath,
            ...listDrawPathState.slice(drawIndexCurrent + 1),
          ];
        });
      }

      PointRef.current = {x, y};
    },
    [listDrawPathState, listCompletedPath.length],
  );

  const onDrawingEnd = useCallback(() => {
    isDrawing.current = false;
    PointRef.current = {x: 0, y: 0};
    // createEffectParticles(x, y);
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
      onEnd: onDrawingEnd,
    },
    [onDrawingActive, onDrawingStart, onDrawingEnd],
  );

  return (
    <SafeAreaView>
      <View style={{width: '100%', height: '100%'}}>
        <Canvas onTouch={touchHandler} style={{flex: 1}}>
          {listDrawPathState.map(drawPath => (
            <DrawingMasked
              key={drawPath.id}
              drawPath={drawPath}
              listCompletedPath={drawPath.completedPaths}
            />
          ))}
        </Canvas>
      </View>
    </SafeAreaView>
  );
};

export default App;
