import { T, Component, Ref, Destroyable } from "app/core/dom";
import Input from "app/ui/components/input";

interface SelectItem {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectItem[];
  name: string;
  autocomplete: string;
  placeholder: string;
  ref: any;
  onSelect: (res: string) => void;
}

@Destroyable
@Component
class Select {
  @Ref inputRef: any;

  @Ref listRef: any;

  setState: any;

  constructor(
    private readonly state: any,
    private readonly props: SelectProps,
    private readonly rootEl: HTMLElement
  ) {
    this.state = {
      show: false,
      value: null
    };
  }

  init() {
    this.props.ref.current = this;
    this.inputRef.current.addEventListener("click", this.handleInputClick);
    this.rootEl.addEventListener("click", this.handleDelegateItem);
    document.documentElement.addEventListener(
      "click",
      this.handleDocumentClick
    );
  }

  destroy = () => {
    document.documentElement.removeEventListener(
      "click",
      this.handleDocumentClick
    );
    this.props.ref.current = null;
    this.inputRef.current.removeEventListener("click", this.handleInputClick);
    this.rootEl.removeEventListener("click", this.handleDelegateItem);

    this.inputRef.current = null;
    this.listRef.current = null;
  };

  patch = () => {
    const { show } = this.state;

    if (this.listRef.current) {
      if (show) {
        this.listRef.current.classList.add("show");
      } else {
        this.listRef.current.classList.remove("show");
      }
    }
  };

  handleInputClick = () => {
    this.setState({ show: true });
  };

  handleDelegateItem = (e: any) => {
    const { target } = e;

    if (target.classList.contains("select-list__item")) {
      const value = target.getAttribute("data-value");
      this.setState({ show: false, value });

      this.props.onSelect(value);
    }
  };

  handleDocumentClick = (e: any) => {
    const { target } = e;

    if (!target || !this.rootEl.contains(target)) {
      return this.setState({ show: false });
    }
  };

  initOptions = (options: SelectItem[]) => {
    const { current: listEl } = this.listRef;

    const doc = document.createDocumentFragment();

    options.forEach((option: any) =>
      doc.appendChild(this.renderOption(option))
    );

    listEl.appendChild(doc);
  };

  renderOption = ({ label, value }: SelectItem) => (
    <li class="select-list__item" data-value={value}>
      {label}
    </li>
  );

  render = ({ options = [], name, autocomplete, placeholder }: SelectProps) => {
    const { show } = this.state;

    return (
      <div class="select">
        <Input
          placeholder={placeholder}
          autocomplete={autocomplete}
          name={name}
          ref={this.inputRef}
        />
        <ul class={`select-list ${show ? "show" : ""}`} ref={this.listRef}>
          {options.map(this.renderOption)}
        </ul>
      </div>
    );
  };
}

export default Select;
