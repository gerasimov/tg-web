import { Component, Destroyable, Ref, T } from 'app/core/dom';
import Input from 'app/ui/components/input';
import Button from 'app/ui/components/button';

import MonkeyClose from 'app/ui/assets/TwoFactorSetupMonkeyClose.svg';

@Destroyable
@Component
export class SmsForm {
  @Ref nextRef: any;
  @Ref prevRef: any;
  @Ref formRef: any;
  
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
    
    setTimeout(() => {
      this.props.next();
    }, 1000)

    //history.pushState(null, 'test', '/');
  }

  render = () => (
    <div class="wrap">
      <img alt="" class="img" src={MonkeyClose} />
      <h1 class="login-title">+33 1 23 45 67 89</h1>
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
          <Input />
        </div>

        <div class="login-form__input">
          <Button>Next</Button>
        </div>
      </form>
    </div>
  );
}
