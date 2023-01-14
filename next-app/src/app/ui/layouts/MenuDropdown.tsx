import { IMenuItem } from 'next-app/src/app/ui/layouts/NavBar';
import MenuItem from 'next-app/src/app/ui/layouts/MenuItem';
import styles from 'src/app/styles/modules/layout/MenuDropdown.module.css';

type Props = { submenuItem: IMenuItem[]; isExpanded: boolean };

function MenuDropdown({ submenuItem, isExpanded }: Props): JSX.Element {
  return (
    <ul className={`${styles.menuDropdown} ${!isExpanded && styles.hide}`}>
      {submenuItem.map((submenu, index) => (
        <MenuItem key={index} menuItem={submenu} />
      ))}
    </ul>
  );
}

export default MenuDropdown;
