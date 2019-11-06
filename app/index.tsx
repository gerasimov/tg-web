import { T } from "app/core/dom";
import App from "app/ui/app";

const rootEl = document.getElementById("root");

if (rootEl) {
  rootEl.appendChild(T(App, {}));
}
