document.addEventListener('DOMContentLoaded', () => {
  const blogPostsContainer = document.getElementById('blog-posts');

  const displayError = (message) => {
    console.error(message);
    const errorElement = document.createElement('div');
    errorElement.classList.add('box');
    errorElement.innerHTML = `<h1>Error</h1><p>${message}</p>`;
    blogPostsContainer.innerHTML = ''; // Clear previous content
    blogPostsContainer.appendChild(errorElement);
  };

  fetch('posts.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok when fetching posts.json.');
      }
      return response.json();
    })
    .then(postFiles => {
      if (!Array.isArray(postFiles)) {
        throw new Error('posts.json is not a valid list.');
      }
      // Create an array of fetch promises
      const fetchPromises = postFiles.map(postFile => {
        return fetch(`markdown.files/${postFile}`)
          .then(response => {
            if (!response.ok) {
              // Log error for the specific file but don't stop the others
              console.error(`Failed to fetch ${postFile}`);
              return null; 
            }
            return response.text();
          });
      });
      // Wait for all fetches to complete
      return Promise.all(fetchPromises);
    })
    .then(markdowns => {
      // Clear any existing content (like error messages)
      blogPostsContainer.innerHTML = ''; 
      
      markdowns.forEach(markdown => {
        // If a fetch failed, the markdown will be null, so we skip it
        if (markdown === null) {
          return;
        }
        
        const htmlContent = marked.parse(markdown);
        const postElement = document.createElement('div');
        postElement.classList.add('box');
        postElement.innerHTML = htmlContent;
        blogPostsContainer.appendChild(postElement);
      });
    })
    .catch(error => {
      displayError(error.message);
    });
});