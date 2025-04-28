import { Events } from '../GestionEvents/events';
import { Posts } from '../GestionForumPost/Posts';
import { Reclamation } from '../GestionReclamation/Reclamation';
import { Badge } from './Badge';
import { Banned } from './Banned';
import { HistoricTransactions } from './HistoricTransactions';
import { Role } from './Role';
import { UserStatus } from './UserStatus';

export class User {
  id!: number;
  name!: string;
  email!: string;
  role!: Role;
  verified!: boolean;
  image!: string;
  balance!: number;
  signature!: string;
  ban!: Banned | null;
  bio!: string;
  facebook!: string;
  github!: string;
  linkedin!: string;
  badges!: Badge[];
  historicTransactions!: HistoricTransactions[];
  status!: UserStatus;
  posts!: Posts[];
  reclamations!: Reclamation[];
  interests!: Events[];
  
}
