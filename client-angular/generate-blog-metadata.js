const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const BLOG_DIR = './src/assets/blog-posts'; // Directory containing blog articles
const ARTICLES_FILE = path.join(BLOG_DIR, 'blog-articles.json');
const CATEGORIES_FILE = path.join(BLOG_DIR, 'blog-categories.json');

/**
 * Extract YAML metadata from Markdown content.
 * @param {string} fileContent - The full content of the Markdown file.
 * @returns {Object|null} Parsed metadata object or null if invalid.
 */
const extractMetadata = (fileContent) => {
  const parts = fileContent.split('---');
  if (parts.length >= 3) {
    try {
      return yaml.parse(parts[1]);
    } catch (err) {
      console.error('Error parsing YAML metadata:', err.message);
    }
  }
  return null;
};

/**
 * Recursively get all Markdown files in a directory.
 * @param {string} dir - Directory to search for files.
 * @returns {Array<string>} List of file paths.
 */
const getAllMarkdownFiles = (dir) => {
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((files, item) => {
    const itemPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      return files.concat(getAllMarkdownFiles(itemPath));
    }
    if (item.isFile() && item.name.endsWith('.md')) {
      return files.concat(itemPath);
    }
    return files;
  }, []);
};

/**
 * Generate metadata JSON from Markdown files.
 */
const generateMetadata = () => {
  console.log(`Generating metadata from blog posts...`);

  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Error: Blog directory "${BLOG_DIR}" does not exist.`);
    return;
  }

  const files = getAllMarkdownFiles(BLOG_DIR);

  console.log(`Processing ${files.length} Markdown files.`);

  const articles = files
    .map((filePath) => {
      const content = fs.readFileSync(filePath, 'utf-8');
      const meta = extractMetadata(content);

      if (meta) {
        // Extract category from the relative path
        const relativePath = path.relative(BLOG_DIR, filePath);
        const category = path.dirname(relativePath).split(path.sep).join(' > '); // Primary category

        return {
          id: path.basename(filePath, '.md'), // Use filename without extension as a unique identifier
          category, // Primary category derived from the directory structure
          ...meta, // Include YAML frontmatter properties (e.g., tags, title, etc.)
        };
      }

      console.warn(
        `Skipping file due to missing/invalid metadata: ${filePath}`,
      );
      return null;
    })
    .filter(Boolean); // Filter out null results

  if (!articles.length) {
    console.error('No valid metadata found. Exiting without creating JSON.');
    return;
  }

  // Extract unique categories from tags (new Set removes duplicates)
  const categories = [
    ...new Set(
      articles.flatMap((article) => article.tags || []), // Flatten all tags into a single array
    ),
  ].sort(); // Sort alphabetically for consistency

  // Write articles metadata to JSON file
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
  console.log(`Articles metadata file created/updated: ${ARTICLES_FILE}`);

  // Write categories to JSON file
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
  console.log(`Categories metadata file created/updated: ${CATEGORIES_FILE}`);
};

// Run the script
generateMetadata();
