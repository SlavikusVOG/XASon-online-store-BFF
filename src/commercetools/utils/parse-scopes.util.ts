export function parseScopes(scopes?: string): string[] {
  return (scopes ?? '').split(' ').filter(Boolean);
}
