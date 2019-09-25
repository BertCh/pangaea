import React, { Fragment } from "react";
import { useSpring, animated } from "react-spring";

import { interpolate } from "flubber";

const AnimatedSvgPath = props => {
  const { data, oldData } = props;
  const end = data[0].d;
  let start = oldData[0].d;
  if (!start) {
    start = end;
  }
  const progress = useSpring({ from: { t: 0 }, to: { t: 1 } });
  console.log(start.slice(0, 20), end.slice(0, 20));
  const interpolator = interpolate(start, end, {
    maxSegmentLength: 0.1
  });

  return (
    <Fragment>
      <animated.path
        d={progress.t.interpolate(interpolator)}
        fill="none"
        stroke="black"
      />
    </Fragment>
  );
};

export default AnimatedSvgPath;
