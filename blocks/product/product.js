export default async function decorate(block) {
  const authorurl = 'https://author-p9606-e71941.adobeaemcloud.com';
  const graphUrl = '/graphql/execute.json/ez-eds/get-product-by-path;path=';

  const contentPath = block.querySelector(':scope div:nth-child(1) > p > a')?.innerHTML || '';

  let url = `${authorurl}${graphUrl}${contentPath}`;
  if (url.endsWith('.html')) {
    url = url.replace(0, -5);
  }

  const options = { credentials: 'include' };

  const data = await fetch(url, options)
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

  const cfButton = block.querySelector(':scope p.button-container');
  if (cfButton) {
    cfButton.remove();
  }

  const buttonText = block.querySelector(':scope div:nth-child(2)> div > p').innerHTML;
  const buttonHref = block.querySelector(':scope div:nth-child(3) > div > p > a')?.getAttribute('href') || '#';

  const productButtonA = document.createElement('a');
  productButtonA.setAttribute('href', buttonHref);
  productButtonA.setAttribute('target', '_blank');
  productButtonA.innerHTML = buttonText;

  const buttonTextP = block.querySelector(':scope div:nth-child(2) > div > p');
  if (buttonTextP) {
    buttonTextP.remove();
  }

  const productButtonDiv = block.querySelector(':scope div:nth-child(2) > div');
  productButtonDiv.classList.add('product-button');
  productButtonDiv.appendChild(productButtonA);
  // Remove all other divs except the first one
  // We only need the first div to hold the product content
  // The other divs were used to hold the button text, link, and target
  // which we have already extracted and used to create the button
  // So we can safely remove them
  const divs = block.querySelectorAll(':scope div > div');
  divs.forEach((div, index) => {
    if (index > 0) div.remove();
  });

  const productContentDiv = block.querySelector(':scope div:nth-child(1)');
  productContentDiv.classList.add('product-content');

  productContentDiv.innerHTML = `
    <picture class="product-image">
      <img loading="lazy" src="${authorurl}${data.productImage.path}" alt="${data.productName}" />
    </picture>
    <div class="product-info">
      <h3>${data.productName}</h3>
      ${data.productDescription.html}
    </div>
    ${productButtonDiv.outerHTML}
  `;
}
