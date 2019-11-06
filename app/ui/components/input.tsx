import { T, Component } from "app/core/dom";

import "./input.less";

interface InputProps {
  placeholder: string;
}

@Component
class Input {
  render = ({ placeholder }: InputProps) => (
    <input className="input" placeholder={placeholder} />
  );
}

export default Input;
