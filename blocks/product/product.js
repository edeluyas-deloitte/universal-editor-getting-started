import { getMetadata } from '../../scripts/aem.js';

export default function decorate(block) {
  console.log('Product Block', block);
  const aemauthorurl = getMetadata('authorurl') || '';
  const aempublishurl = getMetadata('publishurl') || '';
  console.log(aemauthorurl, aempublishurl);
}
