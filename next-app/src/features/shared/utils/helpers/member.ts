import { IMember, MemberRawType } from '@features/shared/utils/interfaces';
import { checkRole } from '@features/shared/utils/helpers/helpers';

export function getMember(member: MemberRawType): IMember {
  return {
    id: member.id,
    name: member.name ?? null,
    role: member.role ? checkRole(member.role) : null
  };
}
