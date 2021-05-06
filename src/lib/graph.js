export class Graph {
  // https://github.com/ChristophKuper/d3-graph-editor/blob/master/src/GraphEditor.js
  constructor(nodes, edges, options) {
    this.nodes = nodes || [];
    this.edges = edges || [];
    this.options = options || {};
    this.resolve_links();
  }

  resolve_links() {
    let that = this;
    this.edges.forEach(function (d) {
      let src = d.source;
      let tgt = d.target;

      d.source = that.nodes.find((n) => n.id === src);
      d.target = that.nodes.find((n) => n.id === tgt);
    });

    let xloc = this.options.width || 600;
    let yloc = this.options.height || 400;

    this.nodes.forEach(function (d) {
      if (!d.x) {
        d.x = xloc / 2 + (xloc / 3) * (Math.random() - 1);
      }

      if (!d.y) {
        d.y = yloc / 2 + (yloc / 3) * (Math.random() - 1);
      }
    });
  }
}
