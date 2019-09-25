import React, { Fragment } from "react";
import { animated, useSpring } from "react-spring";
import * as flubber from "flubber";

const AnimatedSvgPath = props => {
  const { data, oldData } = props;
  console.log(props);
  // const minLength = oldData.length < data.length ? oldData.length : data.length;
  // const slicedOldData = oldData.slice(0, minLength);
  // const slicedData = data.slice(0, minLength);
  const progress = useSpring({ from: { t: 0 }, to: { t: 1 } }, { reset: true });
  const interpolater = time => {
    return flubber.interpolate(oldData, data)(time);
  };

  return (
    <Fragment>
      <animated.path
        d={progress.t.interpolate(interpolater)}
        fill="none"
        stroke="black"
      />
    </Fragment>
  );
};

export default AnimatedSvgPath;
