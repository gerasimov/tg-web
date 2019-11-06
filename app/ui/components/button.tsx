import { T, Component } from "app/core/dom";

import "./button.less";

interface ButtonProps {
  children: any;
}

@Component
class Button {
  render = ({ children }: ButtonProps) => (
    <button className="button">{children}</button>
  );
}

export default Button;
