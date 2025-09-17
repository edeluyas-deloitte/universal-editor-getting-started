export default async function decorate(block) {
  if (!hasOnlyEmptyDivs(block)) {
    const productsData = getProductFields(productBlock);
    if (productsData) {
      block.innerHTML = '';
      for (const product of productsData) {
        const productData = await getProductDataByContentPath(
          product.contentPath
        );
        const combinedData = {
          ...product,
          ...productData,
        };
        const itemBlock = createItemBlock(combinedData);
        block.appendChild(itemBlock);
      }
    }
  }

  const productBlock = document.querySelectorAll('.products.block > div');
}

function hasOnlyEmptyDivs(parent) {
  const children = parent.querySelectorAll(':scope > div');

  return Array.from(children).every((childDiv) => {
    const childNodes = Array.from(childDiv.childNodes);

    if (childNodes.length === 0) return true;

    return childNodes.every((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.tagName === 'DIV' && node.innerHTML.trim() === '';
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() === '';
      }
      return true;
    });
  });
}

function getProductFields(productBlock) {
  return Array.from(productBlock).map((block) => {
    const contentPath =
      block.querySelector(':scope .button-container a')?.getAttribute('href') ||
      '';
    const buttonText =
      block.querySelector(':scope div:nth-child(2) p')?.textContent.trim() ||
      '';
    const buttonUrl =
      block.querySelector(':scope div:nth-child(3) a')?.href || '';

    return {
      contentPath,
      buttonText,
      buttonUrl,
    };
  });
}

async function getProductDataByContentPath(contentPath) {
  const authorurl = 'https://author-p9606-e71941.adobeaemcloud.com';
  const graphUrl = '/graphql/execute.json/ez-eds/get-product-by-path;path=';
  let url = `${authorurl}${graphUrl}${contentPath}`;
  if (url.endsWith('.html')) {
    url = url.replace(0, -5);
  }

  const options = { credentials: 'include' };

  return await fetch(url, options)
    .then((response) => response.json())
    .then((cf) => {
      let cfData = '';
      if (cf.data) {
        cfData = cf.data.productByPath.item;
      }
      return cfData;
    })
    .catch((error) => {
      console.log('Error fetching data:', error);
      return null;
    });
}

function createItemBlock(item) {
  const authorurl = 'https://author-p9606-e71941.adobeaemcloud.com';

  const card = document.createElement('div');
  card.classList.add('item-card');

  const picture = document.createElement('picture');

  const sourceWebp = document.createElement('source');
  sourceWebp.type = 'image/webp';
  sourceWebp.srcset = `${authorurl}${
    item.productImage?.path.replace(/\.\w+$/, '.webp') || ''
  }`;
  picture.appendChild(sourceWebp);

  const img = document.createElement('img');
  img.src = `${authorurl}${item.productImage?.path || ''}`;
  img.alt = item.productName || 'Item image';
  img.classList.add('item-image');
  picture.appendChild(img);

  card.appendChild(picture);

  const content = document.createElement('div');
  content.classList.add('item-content');

  const title = document.createElement('h3');
  title.textContent = item.productName || '';
  content.appendChild(title);

  const desc = document.createElement('div');
  desc.classList.add('item-description');
  desc.innerHTML = item.productDescription?.html || '';
  content.appendChild(desc);

  const link = document.createElement('a');
  link.href = item.buttonUrl || '#';
  link.textContent = item.buttonText || 'Find out more';
  link.classList.add('item-link');
  content.appendChild(link);

  card.appendChild(content);

  return card;
}
