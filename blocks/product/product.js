import { getMetadata } from '../../scripts/aem.js';

/**
 * 
 * @param {Element} block
 */
export default async function decorate(block) {
  const aemauthorurl = getMetadata('authorurl') || '';
  const aempublishurl = getMetadata('publishurl') || '';
  console.log(aemauthorurl, aempublishurl);
}