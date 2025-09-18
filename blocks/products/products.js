import { getMetadata } from '../../scripts/aem.js';

export const graphqlUrl = '/graphql/execute.json/ez-eds/get-product-by-path;path=';

function areContentPathEmpty(parent) {
  // fetch all the 1st div in each Product Block
  const contentPathDiv = parent.querySelectorAll(':scope > div > div:nth-child(1)');

  // immediately return true if the node is empty
  // content path should not be empty on any Product Block
  return Array.from(contentPathDiv).some((div) => div.childNodes.length === 0);
}

function getProductFields(productBlock) {
  return Array.from(productBlock).map((block) => {
    const contentPath = block.querySelector(':scope .button-container a')?.getAttribute('href') || '';
    const buttonText = block.querySelector(':scope div:nth-child(2) p')?.textContent.trim() || 'Find out more';
    const buttonUrl = block.querySelector(':scope div:nth-child(3) a')?.href || '#';

    return {
      contentPath,
      buttonText,
      buttonUrl,
    };
  });
}

async function getProductDataByContentPath(contentPath) {
  console.log('getProductDataByContentPath');
  const authorUrl = getMetadata('keywords');
  let url = `${authorUrl}${graphqlUrl}${contentPath}`;
  if (url.endsWith('.html')) {
    url = url.slice(0, -5);
  }
   console.log('url', url);
  const options = { credentials: 'include' };

  try {
    const response = await fetch(url, options);
    console.log('response', response);
    const cf = await response.json();
    const cfData = cf?.data?.productByPath?.item || '';
    return cfData;
  } catch (error) {
    throw new Error(`Failed to fetch GraphQL Data: ${error.message}`);
  }
}

function createProductBlock(product) {
  const authorUrl = getMetadata('keywords');
  const card = document.createElement('div');
  card.classList.add('product', 'block', 'product-card');

  const picture = document.createElement('picture');

  const sourceWebp = document.createElement('source');
  sourceWebp.type = 'image/png';
  sourceWebp.srcset = `${authorUrl}${product.productImage?.path.replace(/\.\w+$/, '.png') || ''}`;
  picture.appendChild(sourceWebp);

  const img = document.createElement('img');
  img.src = `${authorUrl}${product.productImage?.path || ''}`;
  img.alt = product.productName || 'Product image';
  img.classList.add('product-image');
  picture.appendChild(img);

  card.appendChild(picture);

  const content = document.createElement('div');
  content.classList.add('product-content');

  const title = document.createElement('h3');
  title.textContent = product.productName || '';
  content.appendChild(title);

  const desc = document.createElement('div');
  desc.classList.add('product-description');
  desc.innerHTML = product.productDescription?.html || '';
  content.appendChild(desc);

  const link = document.createElement('a');
  link.href = product.buttonUrl;
  link.textContent = product.buttonText;
  link.classList.add('product-link');
  content.appendChild(link);

  card.appendChild(content);

  return card;
}

export default async function decorate(block) {
  if (!areContentPathEmpty(block)) {
    console.log('block', block);
    const productBlockDiv = document.querySelectorAll(':scope .products.block > div');
    console.log('productBlockDiv', productBlockDiv[0].outerHTML);
    console.log('productBlockDiv', productBlockDiv[1].outerHTML);
    const productsData = getProductFields(productBlockDiv);
    // block.innerHTML = '';
    console.log('productsData', productsData);

    // const productBlocks = await Promise.all(
    //   productsData.map(async (product) => {
    //     const productData = await getProductDataByContentPath(product.contentPath);

    //     const combinedData = {
    //       ...product,
    //       ...productData,
    //     };

    //     return createProductBlock(combinedData);
    //   }),
    // );

    // productBlocks.forEach((productBlock) => {
    //   block.appendChild(productBlock);
    // });
  }
}
