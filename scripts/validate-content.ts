import { courseContent } from '../src/content';
import { validateCourseContent } from '../src/content/schema';

const errors = validateCourseContent(courseContent);

if (errors.length > 0) {
  console.error('Content validation failed:\n');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Content validation passed.');
