import Component from "./base/component.js";
import store from "../state.js";
import * as util from "../lib/util.js";
import { Graph } from "../lib/graph.js";
import d3 from "../lib/d3.js";
import "leaflet";

export class GraphEditor extends Component {
  constructor(options) {
    super({ store, id: options.id });

    let self = this;

    self.store.events.subscribe("expandCollapsePanel", () => self.resize());
    self.store.events.subscribe("currentNodeData", () => self.update());
    self.store.events.subscribe("isMapMode", () => self.toggleMapMode());
    self.store.events.subscribe("isConstNodeArea", () =>
      self.toggleConstNodeArea()
    );
    self.store.events.subscribe("isAddNodeMode", () =>
      self.toggleAddOrMoveNode()
    );

    this.options = options || {};
    this._nodes = this.options.nodes || [];
    this._edges = this.options.edges || [];

    this.default_nodesize = this.options.default_nodesize || 12;

    this._nodes.map((d) =>
      d.size ? d : Object.assign(d, { size: self.default_nodesize })
    );

    this.charge = this.options.charge || -300;
    this.edge_distance = this.options.edge_distance || 80;
    this.node_types = this.options.node_types || {};
    this.onNodeSelected =
      typeof this.options.onNodeSelected !== "undefined"
        ? this.options.onNodeSelected
        : function () {};

    this.onNodeUnSelected =
      typeof this.options.onNodeUnSelected !== "undefined"
        ? this.options.onNodeUnSelected
        : function () {};

    this.width = this.options.width || "100%";
    this.height = this.options.height || "100%";

    // this.map_mode = true;
  }

  get map_mode() {
    return util.getTruthy(this, "store.state.map_mode");
  }

  get const_node_area() {
    return util.getTruthy(this, "store.state.const_node_area");
  }

  get add_node_mode() {
    return util.getTruthy(this, "store.state.add_node_mode");
  }

  resize() {
    let self = this;
    this.bbox = d3.select(`#${self.id}`).node().getBoundingClientRect();
    this.width = this.bbox.width;
    this.height = this.bbox.height;

    this.svg.attr("width", this.width).attr("height", this.height);
    // this.force
    // .force("center", d3.forceCenter(this.width / 2, this.height / 2))
    // .force("x", d3.forceX(this.width / 2))
    // .force("y", d3.forceY(this.height / 2))
    // .alpha(0.5)
    // .restart();
  }

  makeMapMarker(d) {
    let self = this;
    if (!d.hasOwnProperty("lat") || !d.hasOwnProperty("lng")) {
      d = Object.assign(d, self.map.containerPointToLatLng(d));
    }

    if (!d.hasOwnProperty("_map_marker")) {
      d._map_marker = new L.circleMarker(d, {
        radius: 1.1 * self.recalculateNodeSize(d),
        color: "#5d78ff",
        fillColor: "#f03",
        // fillOpacity: 0.2,
        opacity: 1,
        title: "test",
        draggable: true,
      }).addTo(self.map);
    }

    return d;
  }

  toggleMapMode() {
    let self = this;
    d3.select("#map").classed("hidden", !self.map_mode);

    // self.circle.selectAll(".node").classed("hidden", self.map_mode);

    // self.path
    //   .style("stroke", self.map_mode ? "#333" : "#000")
    //   .style("stroke-width", self.map_mode ? "2px" : "4px");

    // self.container
    //   .selectAll("#end-arrow")
    //   .attr("fill", self.map_mode ? "#333" : "#000");

    if (self.map_mode) {
      self.graph.nodes.forEach((d) => {
        // return self.makeMapMarker(d);
      });
    }

    // self.tick();
  }

  toggleConstNodeArea() {
    this.tick();
  }

  toggleAddOrMoveNode() {
    let self = this;
    // self.circle.selectAll(".node").classed("hidden", !self.add_node_mode);
    self.svg.style("pointer-events", self.add_node_mode ? "all" : "none");
  }

  render() {
    let self = this;

    // let oldBoxZoomMouseDown = L.Map.BoxZoom.prototype._onMouseDown;

    // L.Map.BoxZoom.prototype._onMouseDown = function (ev) {
    //   // Worry only about ctrlKey...
    //   // if (ev.ctrlKey) {
    //   //   return false;
    //   // }
    //   // // ...and let the previous event handler worry about shift and primary button
    //   // oldBoxZoomMouseDown.call(this, ev);
    // };

    self.mapCenter = new L.LatLng(32.71, -117.16);

    // let mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    let tilelayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      // "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community",
      }
    );

    // self.map = L.map(self.id).setView(self.mapCenter, 15);
    self.map = L.map("map", {
      // zoomDelta: 0.5,
      zoomSnap: 0,
      wheelPxPerZoomLevel: 120,
      // zoomControl: false,
      layers: [tilelayer],
    }).setView(self.mapCenter, 16);

    d3.select("#map").classed("hidden", !self.map_mode);

    // L.svg({ clickable: true }).addTo(self.map); // we have to make the svg layer clickable

    // const overlay = d3.select(self.map.getPanes().overlayPane);
    // self.svg = overlay.select("svg"); //.attr("pointer-events", "auto");

    // tilelayer.addTo(self.map);

    // Disable mouse zoom as this causes drift
    // self.map.scrollWheelZoom.disable();

    // let toggleMapModeButton = d3
    //   .select("#nav")
    //   .append("button")
    //   .text("map mode")
    //   .classed("btn btn-secondary btn-sm", true)
    //   // .style("pointer-events", "all")
    //   .on("click", self.toggleMapMode.bind(self));

    // Object.entries({
    //   width: "100px",
    //   height: "40px",
    //   // "background-color": "lightgreen",
    // }).forEach(([prop, val]) => toggleMapModeButton.style(prop, val));

    self.svg = d3
      .select(`#${self.id}`)
      // .append("svg")
      // .classed("graph-container", true)
      .classed("network_svg", true)
      .append("svg")
      // .attr("class", "graph_svg")
      .on("contextmenu", (event) => {
        event.preventDefault();
      })
      .style("width", self.width)
      .style("height", self.height);

    self.container = self.svg.append("g").style("pointer-events", "all");

    self.bbox = self.svg.node().getBoundingClientRect();
    self.width = self.bbox.width;
    self.height = self.bbox.height;
    self.colors = d3.scaleOrdinal(d3.schemeCategory10);

    // initialize late so we can place nodes in the middle of the bbox.
    self.graph = new Graph(self._nodes, self._edges, self.bbox);

    self.recalculateLatLng();

    self.force = d3
      .forceSimulation()
      // .force(
      //   "link",
      //   d3
      //     .forceLink()
      //     .id((d) => d.id)
      //     .distance(self.edge_distance) // edit distance
      // )
      // .force("charge", d3.forceManyBody().strength(self.charge)) //  edit charge
      // // .force("center", d3.forceCenter(this.width / 2, this.height / 2))

      // .force("x", d3.forceX(self.width / 2))
      // .force("y", d3.forceY(self.height / 2))
      // .alphaDecay(0.03)
      .on("tick", self.tick.bind(self));

    // init D3 drag support
    self.drag = d3
      .drag()
      // Mac Firefox doesn't distinguish between left/right click when Ctrl is held...
      .filter((event) => event.button === 0 || event.button === 2)
      .on("start", (event, d) => {
        if (!event.active) self.force.alphaTarget(0.3).restart();

        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
        d.x = d.fx;
        d.y = d.fy;
        self.redrawMapMarkers();

        // d = Object.assign(d, self.map.containerPointToLatLng(d));
        // d = util.del(d, ["fx", "fy"]);
        // delete d.fx;
        // delete d.fy;
      })
      .on("end", (event, d) => {
        //   self.recalculateLatLng();
        d = Object.assign(d, self.map.containerPointToLatLng(d));
        d = util.del(d, ["fx", "fy"]);
      });

    // define arrow markers for graph links
    self.container
      .append("svg:defs")
      .append("svg:marker")
      .attr("id", "end-arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 5)
      .attr("markerWidth", 3)
      .attr("markerHeight", 3)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");
    // .attr("fill", "#000");

    self.dragLine = self.container
      .append("svg:path")
      .attr("class", "link dragline hidden")
      .attr("d", "M0,0L0,0");

    self.path = self.container.append("svg:g").selectAll("path");
    self.circle = self.container.append("svg:g").selectAll("g");

    //status saves
    self._selected_node = null;
    self._selected_edge = null;
    self._mousedown_edge = null;
    self._mousedown_node = null;
    self._mouseup_node = null;
    self._lastKeyDown = -1;

    self.svg
      .on("mousedown", self.mousedown_addNode.bind(self))
      .on("mouseup", self.mouseup.bind(self))
      .on("mouseenter", self.mouseenter.bind(self))
      .on("mouseleave", self.mouseleave.bind(self));

    // self.svg.call(
    //   d3
    //     .zoom()
    //     .scaleExtent([0.1, 4])
    //     .filter(() => !self.map_mode && d3.event.shiftKey)

    //     .on("zoom", function () {
    //       console.log("zooming");
    //       self.container.attr("transform", d3.event.transform);
    //     })
    // );

    d3.select(window)
      .on("mousemove", self.mousemove.bind(self))
      .on("keydown", self.keydown.bind(self))
      .on("keyup", self.keyup.bind(self));

    self.initTooltip();

    self.update();

    // window.addEventListener("resize", () => {
    //   self.resize.bind(self)();
    //   setTimeout(function () {
    //     self.map.invalidateSize();
    //   }, 200);

    //   console.log("resized");
    // });

    // self.map.on("moveend", self.update.bind(self));
    self.map
      .on("zoom", () => {
        // self.circle.transition().duration(1000).ease(d3.easeCubic);
        self.recalculatePoint.bind(self)();
        console.log("zooming");
      })
      .on("move moveend", () => {
        self.recalculatePoint.bind(self)();
        // store.dispatch("currentNodeData", {
        //   current_node_data: self.graph.nodes[2],
        // });
      });

    store.dispatch("currentNodeData", {
      current_node_data: self.graph.nodes[2],
    });
  }

  recalculateLatLng() {
    let self = this;
    self.graph.nodes.map((n) =>
      Object.assign(n, self.map.containerPointToLatLng(n))
    );
    // .map((n) => {
    //   delete n.fx;
    //   delete n.fy;
    // });
  }

  recalculatePoint() {
    let self = this;

    self.graph.nodes.map((n) =>
      Object.assign(n, self.map.latLngToContainerPoint(n))
    );
    // .map((n) => {
    //   delete n.fx;
    //   delete n.fy;
    // });
    self.force.restart();
    // self.update();
  }

  recalculateNodeSize(d) {
    let self = this;
    let s = self.const_node_area
      ? d.size *
        (Math.pow(2, self.map.getZoom()) / Math.pow(2, self.map.getMaxZoom()))
      : d.size;
    return s;
  }

  tick() {
    //update edge position
    let self = this;

    self.path.attr("d", (d) => {
      const deltaX = d.target.x - d.source.x;
      const deltaY = d.target.y - d.source.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const normX = deltaX / dist;
      const normY = deltaY / dist;
      const sourcePadding = self.recalculateNodeSize(d.source);
      const targetPadding = 5 + self.recalculateNodeSize(d.target);
      // const sourcePadding = d.source.size;
      // const targetPadding = 5 + d.target.size;
      const sourceX = d.source.x + sourcePadding * normX;
      const sourceY = d.source.y + sourcePadding * normY;
      const targetX = d.target.x - targetPadding * normX;
      const targetY = d.target.y - targetPadding * normY;

      if (
        deltaX * (targetX - sourceX) < 0 ||
        deltaY * (targetY - sourceY) < 0
      ) {
        return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`;
      }

      // console.log(
      //   deltaX,
      //   deltaY,
      //   `M${sourceX},${sourceY}L${targetX},${targetY}`
      // );

      return `M${sourceX},${sourceY}L${targetX},${targetY}`;
    });

    self.circle
      .selectAll(".node")
      .attr("r", (d) => self.recalculateNodeSize(d) * 0.95);

    self.circle.attr("transform", (d) => `translate(${d.x},${d.y})`);

    self.redrawMapMarkers();
  }
  initTooltip() {}
  getColor(d) {
    let node_info = util.get(store.state.node_types, d.node_type);
    return d3.rgb(util.get(node_info, "color") || "lightgrey");
  }

  redrawMapMarkers() {
    let self = this;
    if (self.map_mode) {
      self.graph.nodes.map(
        (d) => d
        // d._map_marker
        //   .setLatLng({ lat: d.lat, lng: d.lng })
        //   .setRadius(self.recalculateNodeSize(d))
      );
    }
  }

  update() {
    let self = this,
      links,
      nodes;

    // self.recalculatePoint();

    links = this.graph.edges;
    nodes = this.graph.nodes;

    this.path = this.path.data(links);

    // let d = nodes[2];

    // update existing links
    this.path
      .classed("selected", (d) => d === self._selected_edge)
      .style("marker-end", "url(#end-arrow)");

    // remove old links
    this.path.exit().remove();

    // add new links
    this.path = this.path
      .enter()
      .append("svg:path")
      .classed("link", true)
      .classed("selected", (d) => d === self._selected_edge)
      .style("marker-end", "url(#end-arrow)")

      .on("mousedown", (event, d) => {
        if (event.ctrlKey) return;

        // select link
        self._mousedown_edge = d;
        self._selected_edge =
          self._mousedown_edge === self._selected_edge
            ? null
            : self._mousedown_edge;
        self._selected_node = null;
        self.update();
      })
      .merge(this.path);

    // circle (node) group
    // NB: the function arg is crucial here! nodes are known by id, not by index!
    this.circle = this.circle.data(nodes, (d) => d.id);

    // update existing nodes (selected visual states)
    this.circle
      .selectAll(".node")
      // .transition()
      // .attr("class", (d) => "node " + (d.node_type || ""))
      .attr(
        "r",
        (d) => self.recalculateNodeSize(d) - 15
        // d.size *
        // (Math.pow(2, self.map.getZoom()) / Math.pow(2, self.map.getMaxZoom()))
      )
      .style("fill", (d) => {
        let c = self.getColor(d);
        return d === self._selected_node ? c.brighter() : c;
      })
      .style("stroke", (d) => self.getColor(d).darker().toString());

    // update text
    this.circle.selectAll("text").text((d) => d.id);

    // remove old nodes
    this.circle.exit().remove();

    // add new nodes
    // https://stackoverflow.com/questions/20708442/d3-js-chart-not-updated-with-new-data
    const g = this.circle.enter().append("svg:g");

    g.append("circle")
      .classed("node", true)
      // .attr("class", (d) => "node " + (d.node_type || ""))
      // .attr(
      //   "r",
      //   (d) => self.recalculateNodeSize(d) - 15
      //   // d.size *
      //   // (Math.pow(2, self.map.getZoom()) / Math.pow(2, self.map.getMaxZoom()))
      // )
      // // .attr("r", (d) => d.size || self.default_nodesize)
      // .style("fill", (d) => {
      //   let c = self.getColor(d);
      //   return d === self._selected_node ? c.brighter() : c;
      // })
      // .style("stroke", (d) => self.getColor(d).darker().toString())

      .on("mouseover", function (event, d) {
        if (
          !self._selected_node &&
          !(util.get(self, "store.state.current_node_data.id") === d.id)
        ) {
          // only change with hover if there's no node currently selected.
          // self.tooltip_show(d);
          self.store.dispatch("currentNodeData", { current_node_data: d });

          // self.tooltip_move(d);
        }

        if (!self._mousedown_node || d === self._mousedown_node) return;
        // enlarge target node
        d3.select(this).attr("transform", "scale(1.1)");
      })
      .on("mouseout", function (event, d) {
        // self.tooltip_hide();
        if (!self._mousedown_node || d === self._mousedown_node) return;
        // unenlarge target node
        d3.select(this).attr("transform", "");
      })
      .on("mousedown", (event, d) => {
        if (event.shiftKey || event.ctrlKey) return;

        // select node
        self._mousedown_node = d;

        if (self._mousedown_node === self._selected_node) {
          self._selected_node = null;
          self.onNodeUnSelected(self._mousedown_node);
          // store.dispatch("currentNodeData", { current_node_data: undefined });
          self.store.dispatch("isNodeSelected", { is_node_selected: false });
        } else {
          self._selected_node = self._mousedown_node;
          // self.tooltip_show(d);
          store.dispatch("currentNodeData", { current_node_data: d });

          store.dispatch("isNodeSelected", { is_node_selected: true });
          // self.tooltip_move(d);
          self.onNodeSelected(self._mousedown_node);
        }
        self._selected_edge = null;

        // reposition drag line
        self.dragLine
          .style("marker-end", "url(#end-arrow)")
          .classed("hidden", false)
          .attr(
            "d",
            `M${self._mousedown_node.x},${self._mousedown_node.y}L${self._mousedown_node.x},${self._mousedown_node.y}`
          );

        self.update();
      })
      .on("wheel scroll", null)
      // (event, d) => {
      // event.preventDefault();
      // console.log("scrolling", d.id);
      // })
      .on("mouseup", function (event, d) {
        if (!self._mousedown_node) return;

        // needed by FF
        self.dragLine.classed("hidden", true).style("marker-end", "");

        // check for drag-to-self
        self._mouseup_node = d;
        if (self._mouseup_node === self._mousedown_node) {
          self.resetMouseVars();
          return;
        }

        // unenlarge target node
        d3.select(this).attr("transform", "");

        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        // const isRight = self._mousedown_node.id < self._mouseup_node.id;
        const source = self._mousedown_node;
        const target = self._mouseup_node;

        const link = links.filter(
          (l) => l.source === source && l.target === target
        )[0];
        if (link) {
          // link[isRight ? "right" : "left"] = true;
        } else {
          links.push({ source, target });
        }

        // select new link
        self._selected_edge = link;
        self._selected_node = null;
        self.update();
      });

    // show node IDs
    g.append("text")
      .attr("x", 0)
      .attr("y", 4)
      .attr("class", "id")
      .text((d) => d.id);

    this.circle = g.merge(this.circle);

    // set the graph in motion

    this.force.nodes(nodes); //.force("link").links(links);
    if (!this.map_mode) {
      console.log("not map");
      //   this.force
      //     // .force("link")
      //     // .links(links)
      //     .force("bounds", function boxingForce() {
      //       for (let node of nodes) {
      //         node.x = Math.max(20, Math.min(self.width - 20, node.x));
      //         node.y = Math.max(20, Math.min(self.height - 20, node.y));
      //       }
      //     })
      //     .alpha(0.3)
      //     .restart();
    } else {
    }

    this.force.restart();
  }

  mouseenter() {
    this.svg.classed("listening-to-keys", true);
  }

  mouseleave() {
    this.svg.classed("listening-to-keys", false);
  }

  mousedown_addNode(event) {
    let self = this;
    // because :active only works in WebKit?
    this.svg.classed("active", true);

    if (
      event.shiftKey ||
      event.ctrlKey ||
      this._mousedown_node ||
      this._mousedown_edge
    )
      return;
    console.log("add node");

    // insert new node at point
    const point = d3.pointer(event, this.container.node());
    console.log(point);
    const node = {
      id: util.randomString(5),
      // reflexive: false,
      x: point[0],
      y: point[1],
      size: self.default_nodesize,
    };
    this.graph.nodes.push(
      Object.assign(node, self.map.containerPointToLatLng(node))
    );

    self.update();
    self.force.restart();
    console.log(node);
    // this.onNodeSelected(node);
  }

  mouseup() {
    if (this._mousedown_node) {
      // hide drag line
      this.dragLine.classed("hidden", true).style("marker-end", "");
    }

    // because :active only works in WebKit?
    this.svg.classed("active", false);

    // clear mouse event vars
    this.resetMouseVars();
  }

  mousemove(event) {
    if (!this._mousedown_node) return;

    // update drag line
    const point = d3.pointer(event, this.container.node());
    this.dragLine.attr(
      "d",
      `M${this._mousedown_node.x},${this._mousedown_node.y}L${point[0]},${point[1]}`
    );
  }

  resetMouseVars() {
    this._mousedown_node = null;
    this._mouseup_node = null;
    this._mousedown_edge = null;
  }

  spliceLinksForNode(node) {
    const toSplice = this.graph.edges.filter(
      (l) => l.source === node || l.target === node
    );
    for (const l of toSplice) {
      this.graph.edges.splice(this.graph.edges.indexOf(l), 1);
    }
  }

  keydown(event) {
    let self = this;
    if (!this.svg.classed("listening-to-keys")) return false;
    // d3.event.preventDefault();

    if (this._lastKeyDown !== -1) return;
    this._lastKeyDown = event.keyCode;

    // ctrl
    if (event.keyCode === 17) {
      this.circle.call(self.drag);
      this.svg.classed("ctrl", true);
      return;
    }

    if (event.shiftKey) {
      d3.select(`#${self.id}`).style("pointer-events", "auto");
      return;
    }

    if (!this._selected_node && !this._selected_edge) return;

    switch (event.keyCode) {
      case 8: // backspace
      case 46: // delete
        if (this._selected_node) {
          this.graph.nodes.splice(
            this.graph.nodes.indexOf(this._selected_node),
            1
          );
          this.spliceLinksForNode(this._selected_node);
        } else if (this._selected_edge) {
          this.graph.edges.splice(
            this.graph.edges.indexOf(this._selected_edge),
            1
          );
        }
        this._selected_edge = null;
        this._selected_node = null;
        this.update();
        break;
      case 66: // B
        if (this._selected_edge) {
          // set link direction to both left and right
          this._selected_edge.left = true;
          this._selected_edge.right = true;
        }
        this.update();
        break;
      case 76: // L
        if (this._selected_edge) {
          // set link direction to left only
          this._selected_edge.left = true;
          this._selected_edge.right = false;
        }
        this.update();
        break;
      case 82: // R
        if (this._selected_node) {
          // toggle node reflexivity
          this._selected_node.reflexive = !this._selected_node.reflexive;
        } else if (this._selected_edge) {
          // set link direction to right only
          this._selected_edge.left = false;
          this._selected_edge.right = true;
        }
        this.update();
        break;
      case 85: // u = un - Pin
        if (this._selected_node) {
          // toggle node reflexivity
          this._selected_node.fx = null;
          this._selected_node.fy = null;
        }
        this.update();
        break;
    }
  }

  keyup(event) {
    this._lastKeyDown = -1;
    d3.select(`#${this.id}`).style("pointer-events", "none");

    // ctrl
    if (event.keyCode === 17) {
      this.circle.on(".drag", null);
      this.svg.classed("ctrl", false);
    }
  }
}
