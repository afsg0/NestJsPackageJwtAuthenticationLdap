import { JwtSecrets } from "./jwt-secrets.interface";

export interface ConsumerAppService {
  getWelcome: (name: string) => string;
  licenseState: () => any;
  initRenewTokenSecrets(): JwtSecrets;
  getJwtSecrets: () => JwtSecrets;
  singleSignOn: (req: any,res: any) => any;
  chpasswd: (username: string,password: string) => any;
}