import { ManagerKeyResponse } from '@taquito/rpc';
import { MichelCodecPacker } from '@taquito/taquito';
import { validateAddress, ValidationResult } from '@taquito/utils';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import { FastRpcClient } from 'lib/taquito-fast-rpc';

import { TempleAccount, TempleAccountType } from './types';

export const loadFastRpcClient = memoizee((rpc: string) => new FastRpcClient(rpc), { max: 5 });

export const michelEncoder = new MichelCodecPacker();

export function loadChainId(rpcUrl: string) {
  const rpc = loadFastRpcClient(rpcUrl);

  return rpc.getChainId();
}

export function hasManager(manager: ManagerKeyResponse) {
  return manager && typeof manager === 'object' ? !!manager.key : !!manager;
}

export function usdToAssetAmount(
  usd?: BigNumber,
  assetUsdPrice?: number,
  assetDecimals?: number,
  roundingMode?: BigNumber.RoundingMode
) {
  return !usd || assetUsdPrice === undefined
    ? undefined
    : usd.div(assetUsdPrice).decimalPlaces(assetDecimals || 0, roundingMode ?? BigNumber.ROUND_DOWN);
}

export function tzToMutez(tz: BigNumber.Value) {
  const bigNum = new BigNumber(tz);
  if (bigNum.isNaN()) return bigNum;
  return bigNum.times(10 ** 6).integerValue();
}

export function mutezToTz(mutez: BigNumber.Value) {
  const bigNum = new BigNumber(mutez);
  if (bigNum.isNaN()) return bigNum;
  return bigNum.integerValue().div(10 ** 6);
}

export function atomsToTokens(x: BigNumber.Value, decimals: number) {
  return new BigNumber(x).integerValue().shiftedBy(-decimals);
}

export function tokensToAtoms(x: BigNumber.Value, decimals: number) {
  return new BigNumber(x).shiftedBy(decimals).integerValue();
}

export function isAddressValid(address: string) {
  return validateAddress(address) === ValidationResult.VALID;
}

export function isKTAddress(address: string) {
  return address?.startsWith('KT');
}

export const isValidContractAddress = (address: string) => isAddressValid(address) && isKTAddress(address);

export function formatOpParamsBeforeSend(params: any, sourcePkh?: string) {
  if (params.kind === 'origination' && params.script) {
    const newParams = { ...params, ...params.script };
    newParams.init = newParams.storage;
    delete newParams.script;
    delete newParams.storage;
    return newParams;
  }

  if (params.kind === 'transaction' && sourcePkh) {
    return { ...params, source: sourcePkh };
  }

  return params;
}

export const isAccountOfActableType = (account: TempleAccount) =>
  !(account.type === TempleAccountType.WatchOnly || account.type === TempleAccountType.ManagedKT);
