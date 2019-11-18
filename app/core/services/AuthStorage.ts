import dcSwitcher from 'app/core/services/DCSwitcher';
import { bytesFromHex, bytesToHex } from 'app/core/mtproto/crypto/shared';
import { rng_get_bytes } from 'app/core/vendors/SecureRandom'


function authField(target: AuthStorage, field: string) {
  const tmpFieldName = `${dcSwitcher.getDc()}_${field}`;
    
  Object.defineProperty(target, field, {
    get(): any {
      // @ts-ignore
      if (this[tmpFieldName]) {
        // @ts-ignore
        return this[tmpFieldName];
      }

      // @ts-ignore
      let data = localStorage.getItem(`${dcSwitcher.getDc()}-${field}`);

      if (!data) {
        return;
      }
      
      return bytesFromHex(data);
    },
    
    set(val: any): void {
      if (!val) {
        return;
      }

      // @ts-ignore
      const valBytes = typeof val === 'string' ? bytesFromHex(val) : val;

      this[tmpFieldName] = valBytes;
      // @ts-ignore
      localStorage.setItem(`${dcSwitcher.getDc()}-${field}`, bytesToHex(valBytes));
    }
  });
}

export class AuthStorage {
  @authField
  public authKey?: number[];
  
  @authField
  public authKeyID?: number[];

  @authField
  public serverSalt?: number[];

  public sessionID?: number[] = rng_get_bytes(new Array(8));
  
  
}

export default new AuthStorage();
