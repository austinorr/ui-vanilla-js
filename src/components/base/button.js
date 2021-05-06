import Component from "./component.js";
import d3 from "../../lib/d3.js";
import store from "../../state.js";

export class ButtonBase extends Component {
  constructor({ parent_id, text, callback, class_string }) {
    super({ store });
    this.parent_id = parent_id;
    this.text = text;
    this.callback = callback;
    this.button;
    this._class = class_string || "";
  }

  get class() {
    return this._class;
  }

  _render() {
    let self = this;
    self.button = d3.select(`#${self.parent_id}`).append("button");

    self.button
      .text(self.text)
      .classed(self.class, true)
      .on("click", self.callback.bind(self));
  }
}
