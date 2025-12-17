const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate quiz questions using Gemini AI
 * @param {string} courseTitle - Course title
 * @param {string} courseDescription - Course description
 * @param {string} lessonContent - Optional lesson content for context
 * @param {number} questionCount - Number of questions to generate (default: 5)
 * @returns {Promise<Array>} Array of quiz questions
 */
async function generateQuizQuestions(courseTitle, courseDescription, lessonContent = '', questionCount = 5) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert educator creating quiz questions for an online course.

Course Title: ${courseTitle}
Course Description: ${courseDescription}
${lessonContent ? `\nLesson Content: ${lessonContent}` : ''}

Generate ${questionCount} multiple-choice quiz questions that test understanding of this course material.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (A, B, C, or D)
4. A brief explanation of why the answer is correct

Format your response as valid JSON array like this:
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Explanation here"
  }
]

IMPORTANT: Return ONLY the JSON array, no additional text or markdown formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    // Parse the JSON response
    const questions = JSON.parse(cleanedText);

    // Validate and format questions
    return questions.map((q, index) => ({
      id: Date.now() + index,
      question: q.question,
      type: 'multiple-choice',
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || ''
    }));

  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`Failed to generate quiz questions: ${error.message}`);
  }
}

/**
 * Generate lesson content suggestions using Gemini AI
 * @param {string} lessonTitle - Lesson title
 * @param {string} courseContext - Course context
 * @returns {Promise<string>} Generated content
 */
async function generateLessonContent(lessonTitle, courseContext) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are an expert educator creating lesson content for an online course.

Lesson Title: ${lessonTitle}
Course Context: ${courseContext}

Generate comprehensive, educational content for this lesson. Include:
- Introduction
- Key concepts
- Examples
- Summary

Format the content in Markdown for easy reading.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`Failed to generate lesson content: ${error.message}`);
  }
}

/**
 * Chat with AI Teacher
 * @param {string} question - Student's question
 * @param {string} context - Course/lesson context
 * @returns {Promise<string>} AI response
 */
async function chatWithAI(question, context = '') {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = context 
      ? `You are a helpful AI teacher assistant. Context: ${context}\n\nStudent Question: ${question}\n\nProvide a clear, educational response.`
      : `You are a helpful AI teacher assistant.\n\nStudent Question: ${question}\n\nProvide a clear, educational response.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`AI chat failed: ${error.message}`);
  }
}

module.exports = {
  generateQuizQuestions,
  generateLessonContent,
  chatWithAI
};
