import logo from 'app/ui/assets/t_logo.svg';
import Select from 'app/ui/components/select';
import Input from 'app/ui/components/input';
import Checkbox from 'app/ui/components/checkbox';
import Button from 'app/ui/components/button';
import { Component, Destroyable, Ref, T } from 'app/core/dom';

import countries from 'app/ui/countries';

const countryOptions = Object.keys(countries).reduce(
  (acc: any, country: string) => {
    acc.push({
      label: `${countries[country].i} ${country}`,
      value: country,
    });

    return acc;
  },
  [],
);

const HACK_FOR_DISABLE_AUTOCOMPLETION = 'telegram';

@Destroyable
@Component
class CountryPhone {
  @Ref countryInputRef: any;
  @Ref phoneNumberRef: any;
  @Ref formRef: any;

  setState: any;
  state: any;
  on: any;
  off: any;
  props: any;

  init() {
    const { current: form } = this.formRef;

    this.on(form, 'submit', this.handleSubmit);
  }
  
  destroy = () => {
    this.off(this.formRef.current, 'submit', this.handleSubmit);
  }
  
  handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    this.props.next();
  }

  render = () => (
    <div class="wrap">
      <img class="login-box__logo" src={logo} alt="Telegram" />
      <h1 class="login-title">Sign in to Telegram</h1>
      <p class="login-info">
        Please confirm you country and
        <br /> enter your phone number
      </p>
      <form
        method="post"
        ref={this.formRef}
        class="login-form"
        autocomplete="off"
      >
        <div class="login-form__input input-space">
          <Select
            name="tg-country"
            options={countryOptions}
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
          <Button>Next</Button>
        </div>
      </form>
    </div>
  );
}

export { CountryPhone };
