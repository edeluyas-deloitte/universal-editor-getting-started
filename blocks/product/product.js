export default async function decorate(block) {
  const authorurl = 'https://author-p9606-e71941.adobeaemcloud.com'
  const graphUrl = '/graphql/execute.json/ez-eds/get-product-by-path;path=';

  const contentPath =
    block
      .querySelector(':scope div:nth-child(1) > p > a')
      ?.getAttribute('href') || '';

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

  const buttonP = block.querySelector(':scope p.button-container');
  if (buttonP) {
    buttonP.remove();
  }

  const buttonDiv = block.querySelector(':scope div:nth-child(2)> div');

  buttonDiv.classList.add('product-button');

  const lastChildDiv = block.querySelector(':scope div:nth-child(2)');

  if (lastChildDiv) {
    lastChildDiv.remove();
  }

  const contentDiv = block.querySelector(':scope div:nth-child(1)');
  contentDiv.classList.add('product-content');

  contentDiv.innerHTML = `
    <picture class="product-image">
      <img loading="lazy" src="${data.productImage._path}" alt="${data.productName}" />
    </picture>
    <div class="product-info">
      <h3>${data.productName}</h3>
      ${data.productDescription.html}
    </div>
    ${buttonDiv.outerHTML}
  `;
}
