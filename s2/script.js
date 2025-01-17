let lastScrollY = 0;

document.addEventListener('scroll', () => {
  const elements = document.querySelectorAll('.fade-in');
  const scrollPosition = window.innerHeight + window.scrollY;

  elements.forEach((element) => {
    const elementPosition = element.offsetTop + element.offsetHeight / 2;

    if (scrollPosition >= elementPosition) {
      element.classList.add('show');
    }
  });
});

document.addEventListener('scroll', () => {
  const layers = document.querySelectorAll('.parallax-layer');
  const scrollTop = window.pageYOffset;

  layers.forEach((layer, index) => {
    const depth = (index + 1) * 20;
    layer.style.transform = `translateY(${scrollTop / depth}px) scale(${1 + index * 0.1})`;
  });
});  

document.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  const layer1 = document.querySelector('#layer1');
  const layer2 = document.querySelector('#layer2');

  if (scrollY < windowHeight) {
    layer1.classList.add('visible');
    layer2.classList.remove('visible');
  } else {
    layer1.classList.remove('visible');
    layer2.classList.add('visible');
  }
});

document.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > lastScrollY) {
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
    const emojiContainer = document.getElementById('emoji-container');
    emojiContainer.textContent = emoji;
    
    // Aparece o emoji
    emojiContainer.classList.add('show');
    
    // Esconde o emoji após 2 segundos
    setTimeout(() => {
      emojiContainer.classList.remove('show');
    }, 2000);
  }
  
