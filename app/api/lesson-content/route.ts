/**
 * Lesson Content API Route
 * 
 * Serves markdown lesson content files from the file system.
 * Validates file paths to prevent directory traversal attacks.
 * 
 * @route GET /api/lesson-content?file={filename}
 * @access Public
 * 
 * @query {string} file - Lesson markdown filename (must end with _lesson.md)
 * 
 * @returns {Object} { content: string } - Markdown content
 * @returns {Object} { error: string } - Error message if file not found
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const file = searchParams.get('file');

    if (!file) {
      return NextResponse.json({ error: 'File parameter required' }, { status: 400 });
    }

    // Security: Only allow reading from instructions directory
    if (!file.includes('_lesson.md')) {
      return NextResponse.json({ error: 'Invalid file' }, { status: 400 });
    }

    // Determine course folder from filename
    const courseFolder = file.includes('_maths_')
      ? 'maths'
      : 'computerscience';

    const filePath = join(process.cwd(), 'public', 'data', courseFolder, 'instructions', file);
    const content = await readFile(filePath, 'utf-8');

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading lesson content:', error);
    return NextResponse.json({ error: 'Content not found' }, { status: 404 });
  }
}
