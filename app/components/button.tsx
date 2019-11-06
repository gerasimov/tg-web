import { T } from "../core/dom/t";
import Component from "../core/component";

import "./button.less";

@Component
class Button {
  render() {
    const { children } = this.props;

    return <button className="button">{children}</button>;
  }
}

export default Button;
