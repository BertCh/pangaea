import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import jszip from "jszip";
import PangeaMap from "./PangeaMap";
import { file } from "@babel/types";
import { arch } from "os";

function App() {
  const [state, setState] = useState({
    data: { fileNames: null, archive: null }
  });

  const { archive, fileNames } = state.data;

  useEffect(() => {
    const asyncFetch = async () => {
      const response = await fetch(
        process.env.PUBLIC_URL + "/data/PaleoDEMS_long_lat_elev_csv_v2.zip"
      );
      const buffer = await response.arrayBuffer();
      const archive = await jszip.loadAsync(buffer);
      const fileNames = Object.values(archive.files)
        .filter(f => f.dir === false)
        .map(f => {
          const age = f.name.replace(/.*_/, "").replace(".csv", "");
          return { name: age, value: f.name };
        });

      setState({
        data: {
          archive: archive,
          fileNames: fileNames
        }
      });
    };
    asyncFetch();
  }, []);

  if (!state.data.fileNames)
    return (
      <div>Loading DEM Time Series for the past 540 Ma (timestep of 5Ma)</div>
    );
  console.log(state);
  return (
    <div className="App">
      <PangeaMap fileNames={fileNames} archive={archive} />
    </div>
  );
}

export default App;
