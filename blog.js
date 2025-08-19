document.addEventListener('DOMContentLoaded', () => {
  const blogPostsContainer = document.getElementById('blog-posts');

  fetch('post.md')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    })
    .then(markdown => {
      const htmlContent = marked.parse(markdown);
      const postElement = document.createElement('div');
      postElement.classList.add('box');
      postElement.innerHTML = htmlContent;
      blogPostsContainer.appendChild(postElement);
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      const errorElement = document.createElement('div');
      errorElement.classList.add('box');
      errorElement.innerHTML = '<h1>Error loading post</h1><p>Could not fetch the blog post. Please try again later.</p>';
      blogPostsContainer.appendChild(errorElement);
    });
});
