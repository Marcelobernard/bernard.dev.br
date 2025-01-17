let lastScrollY = 0;
let scrollThreshold = 50; // Valor de rolagem necessário para esconder o header

document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.fade-in');
  const scrollPosition = window.innerHeight + window.scrollY;

  elements.forEach((element) => {
    const elementPosition = element.offsetTop + element.offsetHeight / 2;
    if (scrollPosition >= elementPosition) {
      element.classList.add('show');
    }
  });

  const header = document.querySelector('header');
  if (window.scrollY > lastScrollY && window.scrollY > scrollThreshold) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollY = window.scrollY;
});

window.onload = () => {
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('scroll'));
};

function showEmoji(emoji) {
  const numberOfEmojis = 10;

  for (let i = 0; i < numberOfEmojis; i++) {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;

    const randomX = Math.random() * window.innerWidth;
    const randomY = Math.random() * window.innerHeight;
    const randomRotation = Math.random() * 360;

    emojiElement.style.position = 'absolute';
    emojiElement.style.left = `${randomX}px`;
    emojiElement.style.top = `${randomY}px`;
    emojiElement.style.fontSize = '5rem';
    emojiElement.style.transform = `rotate(${randomRotation}deg)`;
    emojiElement.style.opacity = 0;
    emojiElement.style.transition = 'opacity 1s ease-in-out';

    document.body.appendChild(emojiElement);

    setTimeout(() => {
      emojiElement.style.opacity = 1;
    }, 10);

    setTimeout(() => {
      emojiElement.style.opacity = 0;
      setTimeout(() => {
        emojiElement.remove();
      }, 1000);
    }, 2000);
  }
}