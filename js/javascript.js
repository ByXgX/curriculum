const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('filled');
        observer.unobserve(entry.target); 
      } else {
        entry.target.classList.remove('filled');
      }
    });
  });

  const animatedFills = document.querySelectorAll('.animated-fill');
  animatedFills.forEach(card => {
    observer.observe(card);
  });

