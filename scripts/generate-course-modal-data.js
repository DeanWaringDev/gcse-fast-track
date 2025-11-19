/**
 * Generate Course Modal Data
 * 
 * Parses summary.md files from each course folder and generates
 * structured JSON data for the course info modal.
 * 
 * Run with: node scripts/generate-course-modal-data.js
 */

const fs = require('fs');
const path = require('path');

// Course slugs to process
const courseSlugs = ['maths', 'computerscience'];

// Color assignments for categories
const categoryColors = {
  // Maths categories
  'Shape': 'blue',
  'Algebra': 'purple',
  'Number': 'green',
  'Data': 'orange',
  'Probability': 'red',
  'Exam Practice': 'indigo',
  'Mixed Practice': 'cyan',
  'Problem Solving': 'pink',
  
  // Computer Science categories
  'Data Representation': 'blue',
  'Computer Systems': 'purple',
  'Algorithms': 'green',
  'Programming': 'cyan',
  'Databases': 'orange',
  'Networks': 'indigo',
  'Cyber Security': 'red',
  'Software': 'pink',
  'Ethics and Law': 'yellow',
  'Boolean Logic': 'lime',
  'Data Structures': 'teal',
  'Emerging Technologies': 'violet',
  'Revision': 'gray',
};

// Emoji assignments for categories
const categoryEmojis = {
  // Maths categories
  'Shape': '📐',
  'Algebra': '🔢',
  'Number': '🔢',
  'Data': '📊',
  'Probability': '🎲',
  'Exam Practice': '📝',
  'Mixed Practice': '🔄',
  'Problem Solving': '💡',
  
  // Computer Science categories
  'Data Representation': '💾',
  'Computer Systems': '🖥️',
  'Algorithms': '🔄',
  'Programming': '💻',
  'Databases': '🗄️',
  'Networks': '🌐',
  'Cyber Security': '🔒',
  'Software': '⚙️',
  'Ethics and Law': '⚖️',
  'Boolean Logic': '🔌',
  'Data Structures': '📚',
  'Emerging Technologies': '🚀',
  'Revision': '📖',
};

/**
 * Parse markdown table to extract category data
 */
function parseContentBreakdownTable(content) {
  const categories = [];
  
  // Find the table section
  const tableMatch = content.match(/\| Category \| Lessons \| Free \| Topics Covered \|[\s\S]*?\n\n/);
  if (!tableMatch) {
    console.warn('Could not find content breakdown table');
    return categories;
  }
  
  const tableText = tableMatch[0];
  const rows = tableText.split('\n').filter(line => line.trim() && !line.includes('---'));
  
  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row.trim()) continue;
    
    // Parse table row: | **Category** | Lessons | Free | Topics |
    const columns = row.split('|').map(col => col.trim()).filter(col => col);
    
    if (columns.length >= 4) {
      const name = columns[0].replace(/\*\*/g, '').trim();
      const lessonCount = parseInt(columns[1]) || 0;
      const freeLessons = parseInt(columns[2]) || 0;
      const topics = columns[3].trim();
      
      if (name && lessonCount > 0) {
        categories.push({
          name,
          emoji: categoryEmojis[name] || '📌',
          lessonCount,
          freeLessons,
          topics,
          color: categoryColors[name] || 'gray',
        });
      }
    }
  }
  
  return categories;
}

/**
 * Extract foundation and higher tier descriptions
 */
function extractTierDescriptions(content) {
  let foundation = "Essential content for grades 1-5";
  let higher = "Advanced topics for grades 6-9";
  
  // Look for Foundation Tier section - get the line after the heading
  const foundationMatch = content.match(/### \*\*Foundation Tier[^]*?\*\*\)\s*\n([^\n]+)/);
  if (foundationMatch && foundationMatch[1]) {
    const desc = foundationMatch[1].trim();
    if (desc && !desc.includes('###') && !desc.includes('---')) {
      foundation = desc;
    }
  }
  
  // Look for Higher Tier section - get the description and bullet points
  const higherMatch = content.match(/### \*\*Higher Tier[^]*?\*\*\)\s*\n([^\n]+)\n([\s\S]*?)(?:\n---|\n##)/);
  if (higherMatch) {
    const desc = higherMatch[1].trim();
    const bulletsSection = higherMatch[2];
    
    // Extract bullet points
    const lines = bulletsSection.split('\n')
      .map(line => line.replace(/^[-*]\s*/, '').trim())
      .filter(line => line && line.startsWith('') && !line.includes('###') && !line.includes('---'))
      .slice(0, 4); // Take first 4 bullet points
    
    if (lines.length > 0) {
      higher = lines.join(', ');
    } else if (desc && !desc.includes('including:')) {
      higher = desc;
    }
  }
  
  return { foundation, higher };
}

/**
 * Process a single course
 */
function processCourse(courseSlug) {
  const summaryPath = path.join(__dirname, '..', 'public', 'data', courseSlug, 'summary.md');
  
  if (!fs.existsSync(summaryPath)) {
    console.warn(`Summary file not found: ${summaryPath}`);
    return null;
  }
  
  console.log(`Processing ${courseSlug}...`);
  const content = fs.readFileSync(summaryPath, 'utf-8');
  
  // Extract data
  const categories = parseContentBreakdownTable(content);
  const { foundation, higher } = extractTierDescriptions(content);
  
  const courseData = {
    slug: courseSlug,
    categories,
    foundation,
    higher,
  };
  
  // Write individual course data file
  const outputPath = path.join(__dirname, '..', 'public', 'data', courseSlug, 'modal-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(courseData, null, 2));
  console.log(`✓ Generated: ${outputPath}`);
  
  return courseData;
}

/**
 * Main execution
 */
function main() {
  console.log('Generating course modal data...\n');
  
  const allCourseData = {};
  
  for (const slug of courseSlugs) {
    const courseData = processCourse(slug);
    if (courseData) {
      allCourseData[slug] = courseData;
    }
  }
  
  // Also create a combined file for convenience
  const combinedPath = path.join(__dirname, '..', 'public', 'data', 'course-modal-data.json');
  fs.writeFileSync(combinedPath, JSON.stringify(allCourseData, null, 2));
  console.log(`\n✓ Generated combined file: ${combinedPath}`);
  
  console.log('\n✅ Course modal data generation complete!');
}

main();
