import { invokeApi } from 'app/core/api/invokeApi';
import { SendCode } from 'app/core/mtproto/functions/auth/SendCode'
import { CancelCode } from 'app/core/mtproto/functions/auth/CancelCode'

export async function sendCode(phone: string): Promise<boolean> {
  const res = await invokeApi(SendCode(phone));
  
  return  res.phone_hash_code;
}

export async function cancelCode(phone: string, phoneHash: string) {
  return await invokeApi(CancelCode(phone, phoneHash));
}