import { T } from 'app/core/dom';

interface InputProps {
  placeholder: string;
}

class Input {
  render = ({ placeholder = '', ...props }: InputProps) => (
    <input className="input" placeholder={placeholder} {...props} />
  );
}

export default Input;
