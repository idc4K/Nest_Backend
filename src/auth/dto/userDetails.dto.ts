import { RolesEnum } from 'src/common/enums';
import type { ProviderEnum } from 'src/constants/enum';
import { User } from 'src/user/user';

export interface OAuthProvider {
  provider: ProviderEnum;
  providerId: string;
}

export interface UserDetails {
  email: string;
  displayName?: string; // discord : username
  firstName?: string;
  lastName?: string;
  username?: string;
  password?: string;
  profileImage?: string; // avatar
  providers: Array<OAuthProvider>;
  discordDiscriminator?: string;
}
export type UserWithCredentials = Partial<User> & {
  right?: RolesEnum;
};
