export default async function decorate(block) {
  const authorurl = 'https://author-p9606-e71941.adobeaemcloud.com';
  const graphUrl = '/graphql/execute.json/ez-eds/get-product-by-path;path=';

  const contentPath = block.querySelector(':scope div:nth-child(1) > p > a') ?.getAttribute('href') || '';

  console.log('Content Path:', contentPath);

  const url = `${authorurl}${graphUrl}${contentPath}`;

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
      console.error('Error fetching data:', error);
      return null;
    });

  console.log(block)

  const cfButton = block.querySelector(':scope p.button-container');
  if (cfButton) {
    cfButton.remove();
  }

  const buttonText = block.querySelector(':scope div:nth-child(2)> div > p').innerHTML;
  const buttonHref = block.querySelector(':scope div:nth-child(3) > div > p > a') ?.getAttribute('href') || '#';

  const productButtonA = document.createElement('a');
  productButtonA.setAttribute('href', buttonHref);
  productButtonA.innerHTML = buttonText;

  const buttonTextP = block.querySelector(':scope div:nth-child(2) > div > p');
  if (buttonTextP) {
    buttonTextP.remove();
  }

  const productButtonDiv = block.querySelector(':scope div:nth-child(2) > div');
  productButtonDiv.classList.add('product-button');
  productButtonDiv.appendChild(productButtonA);

  const buttonTextDiv = block.querySelector(':scope div:nth-child(2)');

  if (buttonTextDiv) {
    buttonTextDiv.remove();
  }

  const productContentDiv = block.querySelector(':scope div:nth-child(1)');
  productContentDiv.classList.add('product-content');

  productContentDiv.innerHTML = `
    <picture class="product-image">
      <img loading="lazy" src="${authorurl}${data.productImage._path}" alt="${data.productName}" />
    </picture>
    <div class="product-info">
      <h3>${data.productName}</h3>
      ${data.productDescription.html}
    </div>
    ${productButtonDiv.outerHTML}
  `;


}
