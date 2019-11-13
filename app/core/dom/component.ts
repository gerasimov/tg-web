export default function Component(target: any) {
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
