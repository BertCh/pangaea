import React, { useState, useEffect } from "react";
import { csvParse } from "d3-dsv";
import { contours } from "d3-contour";

const PangeaMap = props => {
  const { fileNames, archive } = props;
  const thresholds = [-Infinity, 1];
  console.log(props);
  const [selection, select] = useState({ selection: 0 });
  const [dem, setDEM] = useState({ data: null });
  useEffect(() => {
    const asyncProcessing = async () => {
      const map = await archive.file(fileNames[0].value).async("text");
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
      console.log(dem);
      const contoursData = contours()
        .thresholds(thresholds)
        .size([dem.width, dem.height])(dem.data);
      setDEM({ data: dem, contours: contoursData });
    };
    if (fileNames) {
      asyncProcessing();
    }
  }, [fileNames, selection, archive]);
  if (!dem.data) return <div>processing Digital elevation model</div>;
  console.log(dem);
  return <div>PangeaMaps</div>;
};

export default PangeaMap;
