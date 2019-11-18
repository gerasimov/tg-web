import { T } from 'app/core/dom';

import { CountryPhone } from 'app/ui/pages/login/country-phone';
import { SmsForm } from 'app/ui/pages/login/sms-form';
import { PasswordForm } from 'app/ui/pages/login/password-form';

import { Stepper } from 'app/ui/pages/stepper';

import './login-layout.less';

class LoginLayout {
  onEnd = () => {
    history.pushState('', '', '/');
  };

  render = () => (
    <main class="l-login">
      <Stepper
        className="login-box"
        innerProps={{
          main: this,
        }}
        steps={{
          0: CountryPhone,
          1: SmsForm,
          2: PasswordForm
        }}
        onEnd={this.onEnd}
      />
    </main>
  );
}

export default LoginLayout;
