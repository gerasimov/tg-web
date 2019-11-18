import { Component, Destroyable, Ref, T } from 'app/core/dom';
import Input from 'app/ui/components/input';
import Button from 'app/ui/components/button';

import MonkeyClose from 'app/ui/assets/TwoFactorSetupMonkeyCloseAndPeek.svg';
import MonkeyCloseAndPeek from 'app/ui/assets/TwoFactorSetupMonkeyCloseAndPeekToIdle.svg';
import { invokeApi } from 'app/core/api/invokeApi';
import { GetNearestDc } from 'app/core/mtproto/functions/help/GetNearestDc'

@Destroyable
@Component
export class PasswordForm {
  @Ref nextRef: any;
  @Ref prevRef: any;
  @Ref formRef: any;
  @Ref showPassRef: any;
  @Ref imgRef: any;
  
  on: any;
  off: any;
  props: any;

  init() {
    const { next, prev } = this.props;
    const { current: form } = this.formRef;
    this.state = {  };

    this.on(this.nextRef.current, 'click', next);
    this.on(this.prevRef.current, 'click', prev);
    this.on(form, 'submit', this.handleSubmit);
    this.on(this.showPassRef.current, 'click', this.handleClickShowPassword);
  }

  destroy = () => {
    const { next, prev } = this.props;

    this.off(this.nextRef.current, 'click', next);
    this.off(this.prevRef.current, 'click', prev);
    this.off(this.formRef.current, 'submit', this.handleSubmit);
    this.off(this.showPassRef.current, 'click', this.handleClickShowPassword);
  };
  
  patch = () => {
    const { showPass } = this.state;

    this.imgRef.current.src = showPass ? MonkeyCloseAndPeek : MonkeyClose;

  };
  
  handleClickShowPassword = e => {
    e.preventDefault();
    
    this.setState({
      showPass: !this.state.showPass
    });
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();

    invokeApi(GetNearestDc).then(this.props.next);
  };

  render = () => (
    <div class="wrap">
      <img ref={this.imgRef} alt="" class="img" src={MonkeyClose} />
      <h1 class="login-title">Enter a Password</h1>
      <p class="login-info">
        Your account is protected with
        <br /> an additional password.
        <button ref={this.prevRef} type="button">Back</button>
      </p>
      <form
        method="post"
        ref={this.formRef}
        class="login-form"
        autocomplete="off"
      >
        <div class="login-form__input input-space">
          <Input placeholder="Password" /><button ref={this.showPassRef}>Show</button>
        </div>

        <div class="login-form__input">
          <Button ref={this.nextRef}>Next</Button>
        </div>
      </form>
    </div>
  );
}
