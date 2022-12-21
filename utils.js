import {rect, rrect, Skia} from '@shopify/react-native-skia';

export const mapperAttributesToPath = (typeShape, attributes, isBackground) => {
  if (typeShape === 'rect' || typeShape === 'circle') {
    const path = Skia.Path.Make();

    if (typeShape === 'rect') {
      if (isBackground) {
        path.addRRect(
          rrect(
            {
              x: attributes.x,
              y: attributes.y,
              width: attributes.width,
              height: attributes.height,
            },
            10,
            10,
          ),
        );
      } else {
        path.addRect(
          rect(attributes.x, attributes.y, attributes.width, attributes.height),
        );
      }
    }

    if (typeShape === 'circle')
      path.addCircle(attributes.cx, attributes.cy, attributes.r);

    return path;
  }

  if ((typeShape = 'path')) {
    const path = Skia.Path.MakeFromSVGString(attributes.d || '');

    return path;
  }

  return null;
};

export const findIndexContainPointInPaths = (
  listPath,
  points = {x: 0, y: 0},
) => {
  for (let i = listPath.length - 1; i >= 0; i--) {
    if (
      listPath[i].path.contains(points.x, points.y) &&
      listPath[i].style === 'stroke'
    ) {
      return i;
    }
  }

  return -1;
};
