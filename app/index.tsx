import { T } from 'app/core/dom';
import App from 'app/ui/app';
import { invokeApi } from 'app/core/api/invokeApi';
import { InvokeWithLayer } from 'app/core/mtproto/functions/InvokeWithLayer';
import { InitConnection } from 'app/core/mtproto/functions/InitConnection';
import ev from 'app/core/eventEmmiter';
import { GetConfig } from 'app/core/mtproto/functions/help/GetConifg';
import { HttpWait } from 'app/core/mtproto/functions/HttpWait';

const rootEl = document.getElementById('root');

if (rootEl) {
  rootEl.appendChild(<App />);
}

invokeApi(InvokeWithLayer(InitConnection()));
function wait() {
  invokeApi(
    HttpWait({ max_delay: 500, wait_after: 150, max_wait: 25000 }),
  ).finally(() => {
    setTimeout(wait, 1000);
  });
}
wait();

ev.on('auth-done', () => {
  invokeApi(InvokeWithLayer(InitConnection())).then(x => {
    console.log('ok');
  });
});

invokeApi(GetConfig).then(res => console.log(res));
