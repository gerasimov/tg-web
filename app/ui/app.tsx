import { T } from 'app/core/dom';
import LoginLayout from 'app/ui/pages/login-layout';
import ChatLayout from 'app/ui/pages/chat-layout';

import { RegisterLayout } from 'app/ui/pages/register-layout';
import { invokeApi } from 'app/core/mtproto/invokeApi';
import { InitConnection } from 'app/core/mtproto/functions/InitConnection';

import route, { initializeRoutes } from 'app/ui/router/history';

import 'app/ui/styles/base.less';
import { InvokeWithLayer } from 'app/core/mtproto/functions/InvokeWithLayer';
import { HelpGetNearestDc } from 'app/core/mtproto/functions/HelpGetNearestDc';

class App {
  rootEl: any;

  init = async () => {
    route('/login', () => this.renderPage(<LoginLayout />));
    route('/register', () => this.renderPage(<RegisterLayout />));
    route('/', () => this.renderPage(<ChatLayout />));
    await Promise.resolve()
      .then(initializeRoutes)
      .then(() =>
        invokeApi(
          InvokeWithLayer.create(
            InitConnection.create(HelpGetNearestDc.create()),
          ),
        ),
      )
      .then(x => console.log(HelpGetNearestDc.read(x)))
      .catch(e => console.error(e));
  };

  renderPage = (el: any) => {
    if (this.rootEl.firstChild) {
      this.rootEl.firstChild.replaceWith(el);
    } else {
      this.rootEl.appendChild(el);
    }
  };

  render = () => <div class="tg-app" />;
}

export default App;
