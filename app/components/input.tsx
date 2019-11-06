import { T } from "../core/dom/t";
import Component, { Ref } from "../core/component";

import Button from "./button";

import "./input.less";

@Component
class Input {
  @Ref inputRef: any;

  @Ref insertButtonRef: any;

  init() {
    const { current: insertButton } = this.insertButtonRef;
    const { current: input } = this.inputRef;

    if (!insertButton || !input) {
      return;
    }

    this.dom.on(insertButton, "click", () => {
      if (input) {
        console.log(input.value);
      }
    });
  }
  render() {
    const { id } = this.props;

    return (
      <div>
        <input
          ref={this.inputRef}
          value={Date.now()}
          className="input"
          placeholder="Text.."
        />
        <Button ref={this.insertButtonRef}>Insert</Button>
      </div>
    );
  }
}

export default Input;
