import { useEffect, useRef, useState } from 'react';
import ILink from '@features/shared/ui/links/ILink';
import { IMenuItemExtended } from '@app/ui/layouts/NavBar';
import styles from '@app/styles/modules/layout/MenuItem.module.css';
import MenuDropdown from '@app/ui/layouts/MenuDropdown';

type Props = { menuItem: IMenuItemExtended };

function MenuItem({ menuItem }: Props): JSX.Element {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const ref = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    const handler = (event: Event) => {
      if (isExpanded && ref.current && !ref.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isExpanded]);
  return (
    <li
      ref={ref}
      className={styles.menuItem}
      onMouseEnter={() => {
        setIsExpanded(true);
      }}
      onMouseLeave={() => {
        setIsExpanded(false);
      }}
      onClick={() => {
        setIsExpanded((b) => !b);
      }}
    >
      {menuItem.submenu ? (
        <>
          <ILink aria-haspopup="menu" aria-expanded={isExpanded} href={menuItem.url ? menuItem.url : undefined}>
            {menuItem.title}
          </ILink>
          <MenuDropdown submenuItem={menuItem.submenu} isExpanded={isExpanded} />
        </>
      ) : (
        <ILink href={menuItem.url ? menuItem.url : undefined}>{menuItem.title}</ILink>
      )}
    </li>
  );
}

export default MenuItem;
