import { getMetadata } from '../../scripts/aem.js';

export default async function decorate(block) {
  console.log(block);
  const aemauthorurl = getMetadata('authorurl') || '';
  const aempublishurl = getMetadata('publishurl') || '';
  console.log(aemauthorurl, aempublishurl);
}
