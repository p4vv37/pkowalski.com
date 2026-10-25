import { cpSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
// Pages cannot redirect image requests. Keep both historical URL prefixes alive,
// while keeping only one copy of each original in the source repository.
cpSync(resolve(root, 'public/wp-content/uploads'), resolve(root, 'dist/wp_portfolio/wp-content/uploads'), { recursive: true });
console.log('Preserved historical /wp_portfolio/wp-content/uploads/ media URLs.');
