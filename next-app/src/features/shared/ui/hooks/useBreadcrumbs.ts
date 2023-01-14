import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { join } from 'path';
import { pages } from 'next-app/src/shared/utils/constants';
import { IBreadcrumbs } from 'next-app/src/features/shared/ui/utils/interfaces';

export const useBreadcrumbs = (pageTitle?: string): IBreadcrumbs[] | null => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumbs[] | null>(null);
  const getBreadcrumb = useCallback(
    (value: string) => {
      const key = value.replaceAll(/-/g, '_').toUpperCase();
      return Object.keys(pages).includes(key)
        ? pages[key as keyof typeof pages].title
        : pageTitle
        ? pageTitle.replace(/\\n/g, ' ')
        : value;
    },
    [pageTitle]
  );
  useEffect(() => {
    if (router) {
      const crumbsArr = router.asPath.split('/');
      crumbsArr.shift();
      const breadcrumbsArray: IBreadcrumbs[] = [];
      crumbsArr.map((crumb, i) => {
        const label = getBreadcrumb(crumb);
        const href = join('/', ...crumbsArr.slice(0, i + 1));
        breadcrumbsArray.push({ label: label, href: href });
      });
      setBreadcrumbs(breadcrumbsArray);
    }
  }, [router, getBreadcrumb]);

  return breadcrumbs;
};
