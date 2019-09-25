import React, { useState, useEffect, Fragment } from "react";
import { csvParse } from "d3-dsv";
import { contours } from "d3-contour";
import { geoEquirectangular, geoPath, geoIdentity } from "d3-geo";
import { polygon } from "@turf/helpers";
import area from "@turf/area";
import AnimatedSvgPath from "./AnimatedSvgPath";

const PangeaMap = props => {
  const { fileNames, archive } = props;
  const thresholds = [-Infinity, 1];
  const [viewport, updateViewport] = useState({
    width: 1300,
    height: 1000,
    latitude: 37.77,
    longitude: -122.41,
    zoom: 8
  });
  const [selection, select] = useState(1);
  const [dem, setDEM] = useState({ data: null });
  useEffect(() => {
    const asyncProcessing = async () => {
      let oldDem, oldContours;
      if (selection > 0) {
        const map = await archive
          .file(fileNames[selection - 1].value)
          .async("text");
        const parsedData = csvParse(map.replace(/\r/g, "\n"))
          // Standardize field names
          .map(p => {
            let lon = p["# lon"] !== undefined ? p["# lon"] : p.longitude;
            let lat = p.lat !== undefined ? p.lat : p.latitude;
            let elev = p.elev !== undefined ? p.elev : p.elevation;
            return { lon, lat, elev };
          });
        const vals = parsedData
          .filter(d => d.lon < 180 && d.lat > -90)
          .map(d => d.elev);

        const dem = Object({
          width: 360,
          height: 180,
          data: vals
        });
        const contoursData = contours()
          .thresholds([thresholds[0], thresholds[1]])
          .size([dem.width, dem.height])(dem.data);
        oldDem = dem;
        oldContours = contoursData;
      } else {
        oldDem = null;
        oldContours = null;
      }

      const map = await archive.file(fileNames[selection].value).async("text");
      const parsedData = csvParse(map.replace(/\r/g, "\n"))
        // Standardize field names
        .map(p => {
          let lon = p["# lon"] !== undefined ? p["# lon"] : p.longitude;
          let lat = p.lat !== undefined ? p.lat : p.latitude;
          let elev = p.elev !== undefined ? p.elev : p.elevation;
          return { lon, lat, elev };
        });
      const vals = parsedData
        .filter(d => d.lon < 180 && d.lat > -90)
        .map(d => d.elev);

      const dem = Object({
        width: 360,
        height: 180,
        data: vals
      });
      const contoursData = contours()
        .thresholds(thresholds)
        .size([dem.width, dem.height])(dem.data);
      setDEM({
        demData: { dem: dem, oldDem: oldDem },
        contoursData: { newContours: contoursData, oldContours: oldContours }
      });
    };
    if (fileNames) {
      asyncProcessing();
    }
  }, [fileNames, selection, archive, thresholds[0], thresholds[1]]);
  if (!dem.demData) return <div>processing Digital elevation model</div>;

  const { demData, contoursData } = dem;

  const height = 960;
  const width = 500;
  const pathGenerator = geoPath(
    geoIdentity().fitSize([height, width], contoursData.newContours[1])
  );
  const minLength =
    contoursData.oldContours[1].coordinates.length <
    contoursData.newContours[1].coordinates.length
      ? contoursData.oldContours[1].coordinates
      : contoursData.newContours[1].coordinates;
  const sortedOld = contoursData.oldContours[1].coordinates.sort((d1, d2) => {
    return area(polygon(d2)) - area(polygon(d1));
  });
  const sortedNew = contoursData.newContours[1].coordinates.sort((d1, d2) => {
    return area(polygon(d2)) - area(polygon(d1));
  });

  return (
    <Fragment>
      <input
        type="range"
        min={0}
        max={fileNames.length}
        value={selection}
        className="slider"
        onChange={e => select(e.target.value)}
      />
      <svg height="100%" width="100%">
        <AnimatedSvgPath
          oldData={minLength.map((d, i) =>
            pathGenerator(polygon(sortedOld[i]))
          )}
          data={minLength.map((d, i) => pathGenerator(polygon(sortedNew[i])))}
          pathGenerator={pathGenerator}
          fill="none"
          stroke="black"
        />
      </svg>
    </Fragment>
  );
};

export default PangeaMap;
