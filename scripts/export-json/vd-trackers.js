import { rmSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { prepareDistFolder, BASE_PATH, getSpecs } from '../helpers.js';

(async () => {
  prepareDistFolder();

  let datetime = new Date().toISOString().slice(0,10);

  const outputPath = path.join(BASE_PATH, 'dist', 'trackers-vd-update-' + datetime + '.json');

  if (existsSync(outputPath)) {
    rmSync(outputPath);
  }

  const db = {
    trackers: {},
  };

  for (const [id, spec] of getSpecs('patterns')) {
    db.trackers[id] = {
      name: spec.field('name').requiredStringValue(),
      category: spec.field('category').requiredStringValue(),
      vendor_id: spec.field('organization').optionalStringValue(),
      alias: spec.field('alias').optionalStringValue(),
      website_url: spec.field('website_url').optionalStringValue(),
      domains: [],
    };

    const domains = spec.field('domains').optionalStringValue();
    if (domains) {
      for (const line of domains.split(/[\r\n]+/g)) {
        const trimmed = line.trim();
        if (trimmed) {
          db.trackers[id].domains.push(trimmed);
        }
      }
    }
  }

  console.log('Exported trackers:', Object.keys(db.trackers).length);

  writeFileSync(outputPath, JSON.stringify(db, null, 2));
})();
