import "./main.css";

import * as React from "react";
import * as ReactDOM from "react-dom";
import classNames from "clsx";
import { browser } from "webextension-polyfill-ts";
import { getMessage, T } from "lib/ui/i18n";
import ErrorBoundary from "app/ErrorBoundary";

const Options: React.FC = () => (
  <ErrorBoundary whileMessage="displaying this page" className="min-h-screen">
    <React.Suspense fallback={null}>
      <div className="p-4">
        <T id="thanosWalletOptions">
          {(message) => (
            <h1 className="mb-2 text-xl font-semibold">{message}</h1>
          )}
        </T>

        <div className="my-6">
          <T id="resetExtension">
            {(message) => (
              <button
                className={classNames(
                  "relative",
                  "px-2 py-1",
                  "bg-primary-orange rounded",
                  "border-2 border-primary-orange",
                  "flex items-center",
                  "text-primary-orange-lighter",
                  "text-sm font-semibold",
                  "transition duration-200 ease-in-out",
                  "opacity-90 hover:opacity-100 focus:opacity-100",
                  "shadow-sm hover:shadow focus:shadow"
                )}
                onClick={handleReset}
              >
                {message}
              </button>
            )}
          </T>
        </div>
      </div>
    </React.Suspense>
  </ErrorBoundary>
);

ReactDOM.render(<Options />, document.getElementById("root"));

let resetting = false;
function handleReset() {
  if (resetting) return;
  resetting = true;

  const confirmed = window.confirm(getMessage("resetExtensionConfirmation"));
  if (confirmed) {
    (async () => {
      try {
        await browser.storage.local.clear();
        browser.runtime.reload();
      } catch (err) {
        alert(getMessage("failedToResetExtension", err.message));
      }
    })();
  }

  resetting = false;
}
