const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI client
// The client automatically picks up GEMINI_API_KEY from environment variables
const ai = new GoogleGenAI({});

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
    const prompt = `You are an expert educator creating quiz questions for an online course.

Course Title: ${courseTitle}
Course Description: ${courseDescription}
${lessonContent ? `\nLesson Content: ${lessonContent}` : ''}

Generate ${questionCount} multiple-choice quiz questions that test understanding of this course material.

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (0 for A, 1 for B, 2 for C, 3 for D)
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

    // Use gemini-2.5-flash model (latest and fastest)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text;

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
 * @returns {Promise<string>} Generated content in Markdown
 */
async function generateLessonContent(lessonTitle, courseContext) {
  try {
    const prompt = `You are an expert educator creating lesson content for an online course.

Lesson Title: ${lessonTitle}
Course Context: ${courseContext}

Generate comprehensive, educational content for this lesson. Include:
- Introduction (what students will learn)
- Key concepts (2-3 main points)
- Detailed explanations
- Practical examples
- Summary and key takeaways

Format the content in Markdown for easy reading. Make it engaging and educational.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text;

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
    const prompt = context 
      ? `You are a helpful AI teacher assistant helping students with their studies.

Context: ${context}

Student Question: ${question}

Provide a clear, educational, and encouraging response. Be concise but thorough.`
      : `You are a helpful AI teacher assistant.

Student Question: ${question}

Provide a clear, educational, and encouraging response.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    return response.text;

  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`AI chat failed: ${error.message}`);
  }
}

/**
 * Generate course outline/curriculum
 * @param {string} courseTitle - Course title
 * @param {string} courseDescription - Course description
 * @param {number} lessonCount - Number of lessons to generate
 * @returns {Promise<Array>} Array of lesson titles and descriptions
 */
async function generateCourseOutline(courseTitle, courseDescription, lessonCount = 10) {
  try {
    const prompt = `You are an expert curriculum designer for online courses.

Course Title: ${courseTitle}
Course Description: ${courseDescription}

Generate a comprehensive course outline with ${lessonCount} lessons.

For each lesson, provide:
1. Lesson title
2. Brief description (2-3 sentences)
3. Key learning objectives

Format as JSON array:
[
  {
    "title": "Lesson Title",
    "description": "Brief description",
    "objectives": ["Objective 1", "Objective 2"]
  }
]

IMPORTANT: Return ONLY the JSON array.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text;
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```\n?/g, '');
    }

    return JSON.parse(cleanedText);

  } catch (error) {
    console.error('Gemini AI Error:', error);
    throw new Error(`Failed to generate course outline: ${error.message}`);
  }
}

module.exports = {
  generateQuizQuestions,
  generateLessonContent,
  chatWithAI,
  generateCourseOutline
};
