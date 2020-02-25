import * as React from "react";
import constate from "constate";
import useSWR from "swr";
import { browser } from "webextension-polyfill-ts";
import {
  ThanosMessageType,
  ThanosStatus,
  ThanosRequest,
  ThanosResponse
} from "lib/thanos/types";

const NO_RES_ERROR_MESSAGE = "Invalid response recieved";

export const [ThanosFrontProvider, useThanosFront] = constate(() => {
  const fetchState = React.useCallback(async () => {
    const res = await sendMessage({ type: ThanosMessageType.GetStateRequest });
    assertResponse(res.type === ThanosMessageType.GetStateResponse);
    return res.state;
  }, []);

  const stateSWR = useSWR("stub", fetchState, {
    suspense: true,
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const state = stateSWR.data!;

  React.useEffect(() => {
    browser.runtime.onMessage.addListener(handleMessage);

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };

    function handleMessage(msg: any) {
      switch (msg?.type) {
        case ThanosMessageType.StateUpdated:
          stateSWR.revalidate();
          break;
      }
    }
  }, [stateSWR]);

  const { status, accounts } = state;
  const idle = status === ThanosStatus.Idle;
  const locked = status === ThanosStatus.Locked;
  const ready = status === ThanosStatus.Ready;

  const [accIndex, setAccIndex] = React.useState(0);
  const account = accounts[accIndex];

  React.useEffect(() => {
    if (accIndex >= accounts.length) {
      setAccIndex(0);
    }
  }, [accounts, accIndex, setAccIndex]);

  const registerWallet = React.useCallback(
    async (mnemonic: string, password: string) => {
      const res = await sendMessage({
        type: ThanosMessageType.NewWalletRequest,
        mnemonic,
        password
      });
      assertResponse(res.type === ThanosMessageType.NewWalletResponse);
    },
    []
  );

  const unlock = React.useCallback(async (password: string) => {
    const res = await sendMessage({
      type: ThanosMessageType.UnlockRequest,
      password
    });
    assertResponse(res.type === ThanosMessageType.UnlockResponse);
  }, []);

  const lock = React.useCallback(async () => {
    const res = await sendMessage({
      type: ThanosMessageType.LockRequest
    });
    assertResponse(res.type === ThanosMessageType.LockResponse);
  }, []);

  const createAccount = React.useCallback(async () => {
    const res = await sendMessage({
      type: ThanosMessageType.CreateAccountRequest
    });
    assertResponse(res.type === ThanosMessageType.CreateAccountResponse);
  }, []);

  const revealMnemonic = React.useCallback(async (password: string) => {
    const res = await sendMessage({
      type: ThanosMessageType.RevealMnemonicRequest,
      password
    });
    assertResponse(res.type === ThanosMessageType.RevealMnemonicResponse);
    return res.mnemonic;
  }, []);

  return {
    status,
    idle,
    locked,
    ready,
    accounts,
    accIndex,
    account,

    // Callbacks
    setAccIndex,
    registerWallet,
    unlock,
    lock,
    createAccount,
    revealMnemonic
  };
});

async function sendMessage(msg: ThanosRequest) {
  const res = await browser.runtime.sendMessage(msg);
  assertResponse("type" in res);
  return res as ThanosResponse;
}

function assertResponse(condition: any): asserts condition {
  if (!condition) {
    throw new Error(NO_RES_ERROR_MESSAGE);
  }
}
