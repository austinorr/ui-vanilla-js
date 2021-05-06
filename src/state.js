// import actions from "./actions.js";
// import mutations from "./mutations.js";
import Store from "./lib/store.js";

const state = {
  config: {},
  scenario_name: "New Scenario",
  nereid_host: "../nereid/",
  nereid_state: "state",
  nereid_region: "region",
  facility_types: [],
  facility_type_map: {},
  staged_changes: {},
  default_nodesize: 20,
  max_graph_size: 100,
  // map_mode: true,
  node_types: {
    land_surface: {
      title: "Land Surface",
      color: d3.rgb("limegreen"),
    },
    treatment_facility: {
      title: "Treatment Facility",
      color: d3.rgb("steelblue"),
    },
    treatment_site: {
      title: "Treatment Site",
      color: d3.rgb("orangered"),
      disabled: true,
    },
    none: {
      title: "None",
      color: d3.rgb("dimgrey"),
    },
  },
};

export default new Store({
  // actions,
  // mutations,
  state,
});
