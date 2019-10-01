import React, { Fragment } from "react";
import { animated, useSpring, useTransition } from "react-spring";
import * as flubber from "flubber";

const AnimatedSvgPath = props => {
  const { data, oldData } = props;
  const transitions = useSpring({
    from: { t: 0 },
    to: { t: 1 },
    reset: true,
    unique: true
  });

  return (
    <Fragment>
      {data.map((datum, i) => {
        if (!oldData[i] || !data[i]) return <path></path>;
        return (
          <animated.path
            native="true"
            key={`flubber-${i}`}
            d={transitions.t.interpolate(
              flubber.interpolate(oldData[i], data[i])
            )}
            fill="none"
            stroke="black"
          />
        );
      })}
    </Fragment>
  );
};

export default AnimatedSvgPath;
