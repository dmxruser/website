document.addEventListener('DOMContentLoaded', () => {
  const blogPostsContainer = document.getElementById('blog-posts');

  async function displayPosts() {
    try {
      // First, fetch the list of posts
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error('Could not fetch posts.json');
      }
      const postFiles = await response.json();

      // Now, fetch and display each post sequentially
      for (const postFile of postFiles) {
        const postResponse = await fetch(`markdown.files/${postFile}`);
        if (!postResponse.ok) {
          console.error(`Failed to fetch ${postFile}`);
          continue; // Skip to the next post
        }
        const markdown = await postResponse.text();
        const htmlContent = marked.parse(markdown);
        
        const postElement = document.createElement('div');
        postElement.classList.add('box');
        postElement.innerHTML = htmlContent;
        blogPostsContainer.appendChild(postElement);
      }

    } catch (error) {
      console.error('Error loading blog posts:', error);
      const errorElement = document.createElement('div');
      errorElement.classList.add('box');
      errorElement.innerHTML = '<h1>Error</h1><p>Could not load blog posts. Please try again later.</p>';
      blogPostsContainer.appendChild(errorElement);
    }
  }

  displayPosts();
});
