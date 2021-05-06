import Component from "./base/component.js";
import { getTruthy } from "../lib/util.js";
// import { d3 } from "../lib/d3.js";
import { ButtonBase } from "./base/button.js";

const parent_id = "map-mode-toggles";
const class_string = "map-mode-toggle";

const toggleMapMode = new ButtonBase({
  parent_id: parent_id,
  text: "Map",
  class_string: class_string,
  callback: function () {
    let m = !getTruthy(this, "store.state.map_mode");
    this.button.classed("active", m);
    // d3.select("#map").classed("hidden", m);
    this.store.dispatch("isMapMode", { map_mode: m });
  },
});

const toggleConstantNodeArea = new ButtonBase({
  parent_id: parent_id,
  text: "Change to Fixed Area",
  class_string: class_string,
  callback: function () {
    let m = !getTruthy(this, "store.state.const_node_area");
    this.button.classed("active", m);
    this.button.text(m ? "Change to Fixed Size" : "Change to Fixed Area");
    this.store.dispatch("isConstNodeArea", { const_node_area: m });
    console.log(m);
  },
});

const toggleAddNodeMode = new ButtonBase({
  parent_id: parent_id,
  text: "Add Node(s)",
  class_string: class_string,
  callback: function () {
    let m = !getTruthy(this, "store.state.add_node_mode");
    this.button.classed("active", m);
    this.store.dispatch("isAddNodeMode", { add_node_mode: m });
  },
});

export const map_mode_toggles = new Component({
  id: parent_id,
  children: [toggleMapMode, toggleConstantNodeArea, toggleAddNodeMode],
});
