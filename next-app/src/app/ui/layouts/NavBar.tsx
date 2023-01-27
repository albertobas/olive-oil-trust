import {
  isCertifier,
  isDependentCreator,
  isDistributor,
  isIndependentCreator,
  isRetailer,
  pages
} from 'next-app/src/shared/utils/constants';
import styles from 'src/app/styles/modules/layout/NavBar.module.css';
import MenuItem from 'next-app/src/app/ui/layouts/MenuItem';
import useAppSelector from 'next-app/src/shared/ui/hooks/useAppSelector';
import ILink from 'next-app/src/features/shared/ui/links/ILink';
import SVG from 'next-app/src/features/shared/ui/svg/SVG';
import { BiCommand } from 'react-icons/bi';
import { MdOutlineExplore } from 'react-icons/md';

export interface IMenuItem {
  title: string;
  url?: string;
}
export interface IMenuItemExtended extends IMenuItem {
  submenu?: IMenuItem[];
}
const tokensMenuItems = { title: pages.TOKENS.title, url: pages.TOKENS.url };
const escrowMenuItems = { title: pages.ESCROWS.title, url: pages.ESCROWS.url };
const exploreMenuItems = {
  title: pages.EXPLORE.title,
  url: pages.EXPLORE.url,
  submenu: [
    { title: pages.CERTIFICATES.title, url: pages.CERTIFICATES.url },
    escrowMenuItems,
    { title: pages.TOKEN_TYPES.title, url: pages.TOKEN_TYPES.url },
    tokensMenuItems
  ]
};
const managementMenuItem = { title: pages.MANAGEMENT.title, url: pages.MANAGEMENT.url };

const myEscrowsMenuItem = { title: pages.MY_ESCROWS.title, url: pages.MY_ESCROWS.url };
const myParticipationsMenuItem = { title: pages.MY_PARTICIPATIONS.title, url: pages.MY_PARTICIPATIONS.url };
const myTokensMenuItem = { title: pages.MY_TOKENS.title, url: pages.MY_TOKENS.url };
const myTokenTypesMenuItem = { title: pages.MY_TOKEN_TYPES.title, url: pages.MY_TOKEN_TYPES.url };
const myCertificatesMenuItem = { title: pages.MY_CERTIFICATES.title, url: pages.MY_CERTIFICATES.url };
const basicMenuItems = [
  {
    ...managementMenuItem,
    submenu: [myParticipationsMenuItem, myTokensMenuItem]
  },
  exploreMenuItems
];

function NavBar(): JSX.Element {
  const { data } = useAppSelector((state) => state.account);
  const moduleId = data && data.contract && data.contract.moduleId;
  const menuItems: IMenuItemExtended[] | null = moduleId
    ? isCertifier(moduleId)
      ? [
          {
            ...managementMenuItem,
            submenu: [myCertificatesMenuItem]
          },
          exploreMenuItems
        ]
      : isIndependentCreator(moduleId)
      ? [
          {
            ...managementMenuItem,
            submenu: [myEscrowsMenuItem, myTokensMenuItem, myTokenTypesMenuItem]
          },
          exploreMenuItems
        ]
      : isDependentCreator(moduleId)
      ? [
          {
            ...managementMenuItem,
            submenu: [myEscrowsMenuItem, myParticipationsMenuItem, myTokenTypesMenuItem, myTokensMenuItem]
          },
          exploreMenuItems
        ]
      : isDistributor(moduleId) || isRetailer(moduleId)
      ? [
          {
            ...managementMenuItem,
            submenu: [myEscrowsMenuItem, myParticipationsMenuItem, myTokensMenuItem]
          },
          exploreMenuItems
        ]
      : basicMenuItems
    : basicMenuItems;

  return (
    <nav>
      <ul className={styles.menuList}>
        {menuItems &&
          menuItems.map((menuItem, index) => {
            return <MenuItem key={index} menuItem={menuItem} />;
          })}
      </ul>
      <ul className={styles.menuListSm}>
        <li>
          <ILink href={pages.MANAGEMENT.url} title={pages.MANAGEMENT.title}>
            <SVG icon={BiCommand} />
          </ILink>
        </li>
        <li>
          <ILink href={pages.EXPLORE.url} title={pages.EXPLORE.title}>
            <SVG icon={MdOutlineExplore} />
          </ILink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
