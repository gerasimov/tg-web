import { T } from "app/core/dom";

interface ButtonProps {
  children: any;
}

class Button {
  render = ({ children, ...props }: ButtonProps) => (
    <button className="button" {...props}>
      {children}
    </button>
  );
}

export default Button;
