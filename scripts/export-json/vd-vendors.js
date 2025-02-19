import { rmSync, existsSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { prepareDistFolder, BASE_PATH, getSpecs } from '../helpers.js';

(async () => {
  prepareDistFolder();

  let datetime = new Date().toISOString().slice(0,10);

  const outputPath = path.join(BASE_PATH, 'dist', 'vendors-vd-update-' + datetime + '.json');

  if (existsSync(outputPath)) {
    rmSync(outputPath);
  }

  const db = {
    vendors: {},
  };

  for (const [id, spec] of getSpecs('organizations')) {
    db.vendors[id] = {
      name: spec.field('name').requiredStringValue(),
      description: spec.field('description').optionalStringValue(),
      website_url: spec.field('website_url').optionalStringValue(),
      country: spec.field('country').optionalStringValue(),
      privacy_policy_url: spec
        .field('privacy_policy_url')
        .optionalStringValue(),
      privacy_contact: spec.field('privacy_contact').optionalStringValue(),
      ghostery_id: spec.field('ghostery_id').optionalStringValue(),
    };
  }

  console.log('Exported vendors:', Object.keys(db.vendors).length);

  writeFileSync(outputPath, JSON.stringify(db, null, 2));
})();
