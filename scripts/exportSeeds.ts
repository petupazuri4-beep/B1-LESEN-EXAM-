import fs from 'fs';
import path from 'path';
import { INITIAL_EXAMS } from '../src/data/exams';

const targetDir = path.resolve(process.cwd(), 'public', 'seeds');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

INITIAL_EXAMS.forEach((exam) => {
  const numStr = String(exam.examNumber).padStart(2, '0');
  const filePath = path.join(targetDir, `exam_${numStr}.json`);
  fs.writeFileSync(filePath, JSON.stringify(exam, null, 2), 'utf-8');
  console.log(`Saved ${filePath}`);
});

console.log('All 10 seed JSON files successfully exported to public/seeds/');
