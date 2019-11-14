import { Component, Destroyable, Ref, T } from 'app/core/dom';
import Input from 'app/ui/components/input';
import Button from 'app/ui/components/button';

import MonkeyClose from 'app/ui/assets/TwoFactorSetupMonkeyClose.svg';

@Destroyable
@Component
export class PasswordForm {
  @Ref nextRef: any;
  @Ref prevRef: any;
  @Ref formRef: any;
  
  on: any;
  off: any;
  props: any;

  init() {
    const { next, prev } = this.props;
    const { current: form } = this.formRef;

    this.on(this.nextRef.current, 'click', next);
    this.on(this.prevRef.current, 'click', prev);
    this.on(form, 'submit', this.handleSubmit);
  }

  destroy = () => {
    const { next, prev } = this.props;

    this.off(this.nextRef.current, 'click', next);
    this.off(this.prevRef.current, 'click', prev);
    this.off(this.formRef.current, 'submit', this.handleSubmit);
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    setTimeout(() => {
      this.props.next();
    }, 1000)

  };

  render = () => (
    <div class="wrap">
      <img alt="" class="img" src={MonkeyClose} />
      <h1 class="login-title">Enter a Password</h1>
      <p class="login-info">
        Your account is protected with
        <br /> an additional password.
        <button ref={this.prevRef}>Back</button>
      </p>
      <form
        method="post"
        ref={this.formRef}
        class="login-form"
        autocomplete="off"
      >
        <div class="login-form__input input-space">
          <Input placeholder="Enter sms" />
        </div>

        <div class="login-form__input">
          <Button ref={this.nextRef}>Next</Button>
        </div>
      </form>
    </div>
  );
}
