import Link from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps, FC } from 'react';

const ILink: FC<DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>> = (props) => {
  const href = props.href;
  const isInternal = href && href.startsWith('/');
  const isAnchor = href && href.startsWith('#');
  if (isInternal) {
    return (
      <Link href={href}>
        <a {...props}>{props.children}</a>
      </Link>
    );
  } else if (isAnchor) {
    return <a href={href} {...props} />;
  } else {
    return <a target="_blank" rel="nofollow noreferrer noopener" {...props} />;
  }
};

export default ILink;
