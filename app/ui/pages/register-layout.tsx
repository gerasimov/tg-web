import { T } from 'app/core/dom';
import { Stepper } from 'app/ui/pages/stepper';

import './login-layout.less';

export class RegisterLayout {
  render = () => (
    <main class="l-register">
      <Stepper
        className="register-box"
        steps={{
          0: class {
            render = () => <div>12</div>;
          },
        }}
      />
    </main>
  );
}
