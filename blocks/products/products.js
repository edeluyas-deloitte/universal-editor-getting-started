export default async function decorate(block) {
  if (!hasAnyEmptyDiv(block)) {
    const productBlock = document.querySelectorAll('.products.block > div');
    const productsData = getProductFields(productBlock);
    
    block.innerHTML = '';
    for (const product of productsData) {
      const productData = await getProductDataByContentPath(product.contentPath);
      const combinedData = {
        ...product,
        ...productData,
      };
      const itemBlock = createItemBlock(combinedData);
      block.appendChild(itemBlock);
    }
  }
}

function hasAnyEmptyDiv(parent) {
  // Get all direct child divs inside the parent
  const children = parent.querySelectorAll(':scope > div');

  // Return true if any child div contains at least one empty div or empty content
  return Array.from(children).some(childDiv => {
    const childNodes = Array.from(childDiv.childNodes);

    // If no child nodes, treat as empty div present
    if (childNodes.length === 0) return true;

    // Check if any child node is an empty div or whitespace text
    return childNodes.some(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        return node.tagName === 'DIV' && node.innerHTML.trim() === '';
      } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim() === '';
      }
      // Other nodes ignore
      return false;
    });
  });
}

function getProductFields(productBlock) {
  return Array.from(productBlock).map((block) => {
    const contentPath = block.querySelector(':scope .button-container a')?.getAttribute('href') || '';
    const buttonText = block.querySelector(':scope div:nth-child(2) p')?.textContent.trim() || '';
    const buttonUrl = block.querySelector(':scope div:nth-child(3) a')?.href || '';

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
      throw new Error(`Failed to fetch GraphQL Data: ${error.message}`);
    });
}

function createItemBlock(item) {
  const authorurl = 'https://author-p9606-e71941.adobeaemcloud.com';

  const card = document.createElement('div');
  card.classList.add('item-card');

  const picture = document.createElement('picture');

  const sourceWebp = document.createElement('source');
  sourceWebp.type = 'image/png';
  sourceWebp.srcset = `${authorurl}${item.productImage?.path.replace(/\.\w+$/, '.png') || ''}`;
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
