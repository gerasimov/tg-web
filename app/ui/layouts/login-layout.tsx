import { T, Component, Ref } from "app/core/dom";
import Input from "app/ui/components/input";
import logo from "app/ui/assets/t_logo.png";

import "./login-layout.less";
import Button from "../components/button";

@Component
class LoginLayout {
  @Ref countryInputRef: any;

  @Ref phoneNumberRef: any;

  init = () => {
    const { current: countryInput } = this.countryInputRef;
    const { current: phoneNumberInput } = this.phoneNumberRef;

    if (!countryInput || !phoneNumberInput) {
      return;
    }

    phoneNumberInput.addEventListener("keyup", (e: Event) => {
      if (e.target) {
        console.log(e.target.value);
      }
    });
  };

  render = () => {
    return (
      <main class="l-login">
        <div class="login-box">
          <img class="login-box__logo" src={logo} alt="Telegram" />
          <h1 class="login-title">Sign in to Telegram</h1>
          <p class="login-info">
            Please confirm you country and
            <br /> enter your phone number
          </p>
          <form class="login-form">
            <div class="login-form__input input-space ">
              <Input ref={this.countryInputRef} placeholder="Country" />
            </div>
            <div class="login-form__input">
              <Input ref={this.phoneNumberRef} placeholder="Phone Number" />
            </div>
            <div class="login-form__input input-space ">
              <Button>Submit</Button>
            </div>
          </form>
        </div>
      </main>
    );
  };
}

export default LoginLayout;
