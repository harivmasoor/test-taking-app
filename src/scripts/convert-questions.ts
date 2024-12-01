import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface Choice {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  choices: Choice[];
  correctAnswer: string;
  chapter: string;
  section: string;
}

function parseQuestions(content: string): Question[] {
  const questions: Question[] = [];
  const lines = content.split('\n');
  let currentQuestion: Partial<Question> | null = null;
  let currentChoices: Choice[] = [];
  let questionCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;

    // Check if line starts with chapter/section number (e.g., "3.1" or "17.2")
    if (/^\d+\.\d+/.test(line)) {
      const [chapter, section] = line.split(' ')[0].split('.');
      currentQuestion = {
        chapter,
        section: `${chapter}.${section}`
      };
      continue;
    }

    // Check if this is a question
    if (line.endsWith('?')) {
      if (currentQuestion) {
        currentQuestion.id = `${currentQuestion.chapter}.${currentQuestion.section}.${questionCounter++}`;
        currentQuestion.text = line;
        currentChoices = [];
      }
      continue;
    }

    // Check if this is an answer choice
    if (line.startsWith('A)') || line.startsWith('B)') || 
        line.startsWith('C)') || line.startsWith('D)')) {
      const id = line[0];
      const text = line.substring(2).trim();
      currentChoices.push({ id, text });
      continue;
    }

    // Check if this is the answer
    if (line.startsWith('Answer:')) {
      const correctAnswer = line.split(':')[1].trim();
      if (currentQuestion && currentChoices.length === 4) {
        questions.push({
          ...currentQuestion,
          choices: currentChoices,
          correctAnswer
        } as Question);
      }
      continue;
    }
  }

  return questions;
}

// Read the input file and write the JSON output
const inputPath = join(process.cwd(), 'test_questions_sutton.txt');
const outputPath = join(process.cwd(), 'src', 'data', 'questions.json');

const content = readFileSync(inputPath, 'utf-8');
const questions = parseQuestions(content);
writeFileSync(outputPath, JSON.stringify({ questions }, null, 2));

console.log(`Converted ${questions.length} questions to JSON format`);
