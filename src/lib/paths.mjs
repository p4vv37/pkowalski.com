/** Prefix only local, root-relative URLs. Remote URLs and hashes stay intact. */
export function withBase(path, base = '/') {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const prefix = base.replace(/\/$/, '');
  return `${prefix}${path}`;
}

export function stripBase(path, base = '/') {
  const prefix = base.replace(/\/$/, '');
  return prefix && (path === prefix || path.startsWith(`${prefix}/`))
    ? path.slice(prefix.length) || '/'
    : path;
}

export function resolveLegacyUrl(input, routes, base = '/') {
  const url = new URL(input, 'https://www.pkowalski.com');
  const id = url.searchParams.get('p') || url.searchParams.get('page_id');
  let target = id ? routes.ids[id] : undefined;
  const path = stripBase(decodeURI(url.pathname), base).replace(/\/?$/, '/');
  if (!target && url.searchParams.get('rara-portfolio') === 'portfolio') target = '/';
  if (!target) target = routes.paths[path];
  if (!target) return null;
  const result = withBase(target, base);
  url.searchParams.delete('p');
  url.searchParams.delete('page_id');
  url.searchParams.delete('rara-portfolio');
  const query = url.searchParams.toString();
  const destination = `${result}${query ? `?${query}` : ''}${url.hash}`;
  return destination === `${url.pathname}${url.search}${url.hash}` ? null : destination;
}
