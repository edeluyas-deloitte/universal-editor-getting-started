export default function decorate(block) {
  const bgColorClass = [...block.classList].find((cls) => cls.startsWith('bg-'));

  if (bgColorClass) {
    const colorName = bgColorClass.split('-')[1];
    block.style.backgroundColor = colorName;
  }

  const [quoteWrapper] = block.children;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();
  quoteWrapper.replaceChildren(blockquote);
}
