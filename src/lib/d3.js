import "internmap";

import * as array from "d3-array";
import * as color from "d3-color";
import * as dispatch from "d3-dispatch";
import * as drag from "d3-drag";
import * as force from "d3-force";
import * as format from "d3-format";
import * as interpolate from "d3-interpolate";
import * as quadtree from "d3-quadtree";
import * as scale from "d3-scale";
import * as scale_chromatic from "d3-scale-chromatic";
import * as select from "d3-selection";
import * as time from "d3-time";
import * as time_format from "d3-time-format";
import * as timer from "d3-timer";

import { json } from "d3-fetch";
import { Delaunay } from "d3-delaunay";
import * as geo from "d3-geo";
import * as zoom from "d3-zoom";
import * as tile from "d3-tile";

const d3 = Object.assign(
  { json, Delaunay },
  select,
  scale,
  scale_chromatic,
  force,
  geo,
  color,
  dispatch,
  drag,
  array,
  quadtree,
  interpolate,
  tile,
  time,
  timer,
  format,
  time_format,
  zoom
);

export default d3;
window.d3 = d3;
