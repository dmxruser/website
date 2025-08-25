const fs = require('fs').promises;
const path = require('path');

const postsDir = path.join(__dirname, 'markdown.files');
const outputFile = path.join(__dirname, 'posts.json');

async function build() {
  try {
    const files = await fs.readdir(postsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    // Optional: Sort files, for example, by name. 
    // For more advanced sorting like by date, you'd need to read file metadata or frontmatter.
    const sortedFiles = (await Promise.all(markdownFiles.map(async file => {
      const stats = await fs.stat(path.join(postsDir, file));
      return { file, birthtime: stats.birthtime };
    })))
    .sort((a, b) => b.birthtime - a.birthtime)
    .map(fileObj => fileObj.file);

    await fs.writeFile(outputFile, JSON.stringify(sortedFiles, null, 2));
    console.log('Successfully created posts.json with the following files:', markdownFiles);
  } catch (error) {
    console.error('Error building posts list:', error);
    process.exit(1); // Exit with an error code
  }
}

build();
