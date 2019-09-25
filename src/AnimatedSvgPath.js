import React, { Fragment } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import * as flubber from "flubber";

const AnimatedSvgPath = props => {
  const { data, oldData } = props;
  const transitions = useTransition(
    oldData,
    (d, i) => `id-${i}`,
    { from: { t: 0 }, initial: { t: 0 }, update: { t: 1 } },
    { reset: true, unique: true }
  );

  return (
    <Fragment>
      {transitions.map(({ item, key, props }, i) => {
        if (!oldData[i] || !data[i]) return <path></path>;
        return (
          <animated.path
            native="true"
            key={key}
            d={props.t.interpolate(flubber.interpolate(oldData[i], data[i]))}
            fill="none"
            stroke="black"
          />
        );
      })}
    </Fragment>
  );
};

export default AnimatedSvgPath;
