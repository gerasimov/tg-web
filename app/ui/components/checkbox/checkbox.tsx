import { T } from 'app/core/dom';

interface CheckboxProps {
  children: any;
}

class Checkbox {
  render = ({ children }: CheckboxProps) => (
    <label class="checkbox">
      <input type="checkbox" />
      <span class="checkbox-mark" />
      <span class="checkbox-title">{children}</span>
    </label>
  );
}

export default Checkbox;
