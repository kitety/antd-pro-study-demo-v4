import request from '@/utils/request';
import { UserRegisterParams, captchaParams } from '@/pages/user/register/new';

export async function fakeRegister(params: UserRegisterParams) {
  return request('/api/users', {
    method: 'POST',
    data: params,
  });
}
export async function getCaptcha(params: captchaParams) {
  return request('/api/sms_code', {
    params,
  });
}
