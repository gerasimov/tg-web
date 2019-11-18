import { Component, Destroyable, Ref, T } from 'app/core/dom';
import Input from 'app/ui/components/input';
import Button from 'app/ui/components/button';

import MonkeyClose from 'app/ui/assets/TwoFactorSetupMonkeyClose.svg';
import { invokeApi } from 'app/core/api/invokeApi';
import { GetNearestDc } from 'app/core/mtproto/functions/help/GetNearestDc';
import { sendCode } from 'app/ui/services/auth';
import { SignIn } from 'app/core/mtproto/functions/auth/SignIn';
import { bytesToHex } from 'app/core/mtproto/crypto/shared';

@Destroyable
@Component
export class SmsForm {
  @Ref nextRef: any;
  @Ref prevRef: any;
  @Ref formRef: any;
  @Ref codeRef: any;

  on: any;
  off: any;
  props: any;

  init() {
    const { prev } = this.props;
    const { current: form } = this.formRef;

    this.on(this.prevRef.current, 'click', prev);
    this.on(form, 'submit', this.handleSubmit);
  }

  destroy = () => {
    const { prev } = this.props;

    this.off(this.prevRef.current, 'click', prev);
    this.off(this.formRef.current, 'submit', this.handleSubmit);
  };

  handleSubmit = async (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      console.log(this.codeRef.current.value);
      this.props.main.authData = await invokeApi(
        SignIn(
          this.props.main.phone,
          bytesToHex(this.props.main.hashPhone.phone_hash_code),
          this.codeRef.current.value,
        ),
      );
      console.log(this);
      this.props.next();
    } catch (e) {
      this.props.next();
    }
  };

  render = () => (
    <div class="wrap">
      <img alt="" class="img" src={MonkeyClose} />
      <h1 class="login-title">{this.props.main.phone}</h1>
      <p class="login-info">
        We have sent you an SMS
        <br /> with the code.
        <button ref={this.prevRef}>Back</button>
      </p>
      <form
        method="post"
        ref={this.formRef}
        class="login-form"
        autocomplete="off"
      >
        <div class="login-form__input input-space">
          <Input placeholder="Code" ref={this.codeRef} />
        </div>

        <div class="login-form__input">
          <Button>Next</Button>
        </div>
      </form>
    </div>
  );
}
