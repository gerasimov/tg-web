import { on, off } from 'app/core/dom/utils'

export default function Component(target: any) {
  target.prototype.on = on;
  
  target.prototype.off = off;
  
  target.prototype.setState = function(chunk: any) {
    this.state = { ...this.state, ...chunk };
    this.update();
  };

  target.prototype.update = function() {
    if (this.patch) {
      this.patch(this.props, this.state);
    }
  };
}
