import { useRouter } from 'next/router';
import styles from '@features/shared/styles/modules/breadcrumbs/Breadcrumbs.module.css';
import { useBreadcrumbs } from '@features/shared/ui/hooks/useBreadcrumbs';
import ILink from '@features/shared/ui/links/ILink';

export default function Breadcrumbs({ pageTitle }: { pageTitle?: string }): JSX.Element {
  const router = useRouter();
  const breadcrumbs = useBreadcrumbs(pageTitle);
  return (
    <>
      {breadcrumbs && (
        <div className={styles.container}>
          <nav aria-label="Breadcrumb">
            <ol>
              {breadcrumbs.map((breadcrumb) => {
                return (
                  <li key={breadcrumb.href}>
                    {breadcrumb.href === router.asPath ? (
                      breadcrumb.label
                    ) : (
                      <ILink href={breadcrumb.href}>{breadcrumb.label}</ILink>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      )}
    </>
  );
}
