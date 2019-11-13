import { T, Component, Ref } from "app/core/dom";
import Input from "app/ui/components/input";
import Select from "app/ui/components/select";
import Link from "app/ui/router/Link";
import logo from "app/ui/assets/t_logo.svg";

import Button from "app/ui/components/button";
import Checkbox from "app/ui/components/checkbox";

import "./login-layout.less";
import { mtAuth } from 'app/core/mtproto/auth'

const HACK_FOR_DISABLE_AUTOCOMPLETION = "telegram";

@Component
class LoginLayout {
  @Ref countryInputRef: any;

  @Ref phoneNumberRef: any;

  @Ref formRef: any;
  
  @Ref nextRef: any;

  setState: any;

  state: any;

  init = () => {
    const { current: countryInput } = this.countryInputRef;
    const { current: phoneNumberInput } = this.phoneNumberRef;
    const { current: form } = this.formRef;
    const { current: nextButton } = this.nextRef;

    if (!countryInput || !phoneNumberInput || !nextButton) {
      return;
    }

    form.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    nextButton.addEventListener("click", () => {
      history.pushState({}, 'Chat', '/');
    });

    import(/* webpackChunkName: 'countries' */ "app/ui/countries").then(
      ({ default: countries }: any) => {
        const options = Object.keys(countries).reduce(
          (acc: any, country: string) => {
            acc.push({
              label: `${countries[country].i} ${country}`,
              value: country
            });

            return acc;
          },
          []
        );
        this.setState({
          countries: options
        });
      }
    );
  };

  patch = () => {
    const { countries } = this.state;
    const { current: countrySelect } = this.countryInputRef;
    if (countrySelect) {
      countrySelect.initOptions(countries);
    }
  };

  render = () => (
    <main class="l-login">
      <div class="login-box">
        <img class="login-box__logo" src={logo} alt="Telegram" />
        <h1 class="login-title">Sign in to Telegram</h1>
        <p class="login-info">
          Please confirm you country and
          <br /> enter your phone number
        </p>
        <form
          method="post"
          action="/form"
          ref={this.formRef}
          class="login-form"
          autocomplete="off"
        >
          <div class="login-form__input input-space">
            <Select
              name="tg-country"
              ref={this.countryInputRef}
              placeholder="Country"
              autocomplete={HACK_FOR_DISABLE_AUTOCOMPLETION}
              onSelect={(val: string) => console.log(val)}
            />
          </div>
          <div class="login-form__input input-space">
            <Input
              name="tg-phoneNumber"
              pattern="\d"
              autocomplete={HACK_FOR_DISABLE_AUTOCOMPLETION}
              ref={this.phoneNumberRef}
              placeholder="Phone Number"
            />
          </div>
          <div class="login-form__input input-space">
            <Checkbox>Keep me signed in</Checkbox>
          </div>
          <div class="login-form__input">
            <Button ref={this.nextRef}>Next</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginLayout;
