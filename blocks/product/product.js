export default async function decorate(block) {
  console.block(block);
  const url =
    "https://author-p9606-e71941.adobeaemcloud.com/graphql/execute.json/ez-eds/get-credit-card-products";

  const cfRequest = await fetch(url)
    .then((response) => response.json())
    .then((contentFragment) => {
      let products = "";
      if (contentFragment.data) {
        products = contentFragment.data;
      }
      return products;
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    });

  console.log("cfRequest", cfRequest);
}
