import Component from "./base/component.js";
import store from "../state.js";
import { map_mode_toggles } from "./map-modes.js";
import { GraphEditor } from "./graph-editor-leaflet.js";

// init graph editor
const options = {
  id: "graph-editor",
  nodes: [
    {
      id: "0",
      node_type: "treatment_facility",
      size: 50,
    },
    {
      id: "1",
      node_type: "land_surface",
    },
    {
      id: "2",
      node_type: "land_surface",
    },
  ],
  edges: [
    { source: "2", target: "0" },
    { source: "1", target: "0" },
  ],
};

const graph_editor = new GraphEditor(Object.assign(options, store.state));

// init app
export const ui = new Component({
  id: "spa",
  children: [map_mode_toggles, graph_editor],
  _render: function () {
    this.element.classed("grid auto-rows-auto", true);
    let html = `
    <div id="nav" class="grid justify-items-center">
      <div id="map-mode-toggles" class="grid-flow-row"></div>
    </div>
    <div id="workspace">
      <div id="editor-group">
        <div id="scene">
          <div id="map"></div>
          <div id="graph-editor"></div>
        </div>
      </div>
    </div>
    <div id="footer"></div>
    `;
    this.element.html(html);
    // this.element.append("div").attr("id", "map-mode-toggles");
  },
  store: store,
});
