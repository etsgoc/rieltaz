import { Link } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'soft' | 'ghost';
  size?: 'md' | 'lg';
  to?: string;
  href?: string;
  block?: boolean;
  icon?: ReactNode;
}

export default function Button({ variant = 'primary', size = 'md', to, href, block, icon, children, className = '', ...rest }: Props) {
  const cls = `btn btn-${variant} btn-${size}${block ? ' btn-block' : ''} ${className}`;
  const inner = <>{icon}{children}</>;
  if (to) return <Link className={cls} to={to}>{inner}</Link>;
  if (href) return <a className={cls} href={href} target="_blank" rel="noreferrer">{inner}</a>;
  return <button className={cls} {...rest}>{inner}</button>;
}
