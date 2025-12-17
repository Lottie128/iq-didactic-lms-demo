const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with updated SDK (v0.24.1)
// Using gemini-2.0-flash-exp model (latest as of Dec 2024)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Model configuration
const MODEL_NAME = 'gemini-2.0-flash-exp';
const GENERATION_CONFIG = {
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

/**
 * Generate AI-powered course recommendations
 */
const generateCourseRecommendations = async (userProfile, enrolledCourses) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
You are an expert educational advisor. Based on the following user profile and their enrolled courses, recommend 5 relevant courses they should take next.

User Profile:
- Current Level: ${userProfile.level || 1}
- XP Points: ${userProfile.xp || 0}
- Role: ${userProfile.role}
- Education Level: ${userProfile.educationLevel || 'Not specified'}
- Occupation: ${userProfile.occupation || 'Not specified'}

Enrolled Courses:
${enrolledCourses.map(c => `- ${c.title} (${c.category})`).join('\n')}

Provide recommendations in JSON format:
{
  "recommendations": [
    {
      "title": "Course Title",
      "category": "Category",
      "level": "beginner/intermediate/advanced",
      "reason": "Why this course is recommended",
      "skills": ["skill1", "skill2"]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { recommendations: [] };
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    throw new Error('Failed to generate course recommendations');
  }
};

/**
 * Generate personalized learning path
 */
const generateLearningPath = async (userId, targetSkills, currentProgress) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
Create a personalized learning path for a student who wants to learn: ${targetSkills.join(', ')}.

Current Progress:
- Completed Courses: ${currentProgress.completedCourses || 0}
- Total XP: ${currentProgress.xp || 0}
- Current Level: ${currentProgress.level || 1}

Provide a step-by-step learning path in JSON format:
{
  "learningPath": {
    "totalWeeks": 12,
    "phases": [
      {
        "phase": 1,
        "title": "Foundation",
        "weeks": 4,
        "courses": ["Course 1", "Course 2"],
        "skills": ["skill1", "skill2"],
        "description": "What you'll learn"
      }
    ],
    "milestones": [
      {
        "week": 4,
        "achievement": "Build your first project"
      }
    ]
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { learningPath: null };
  } catch (error) {
    console.error('AI Learning Path Error:', error);
    throw new Error('Failed to generate learning path');
  }
};

/**
 * Generate quiz questions for a lesson
 */
const generateQuizQuestions = async (lessonTitle, lessonContent, difficulty = 'intermediate') => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
Generate 5 multiple-choice quiz questions for the following lesson:

Lesson Title: ${lessonTitle}
Difficulty: ${difficulty}

Content Summary:
${lessonContent.substring(0, 500)}

Provide questions in JSON format:
{
  "questions": [
    {
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "explanation": "Why this is correct",
      "difficulty": "easy/medium/hard"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { questions: [] };
  } catch (error) {
    console.error('AI Quiz Generation Error:', error);
    throw new Error('Failed to generate quiz questions');
  }
};

/**
 * Provide personalized study tips
 */
const generateStudyTips = async (userPerformance, weakAreas) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
Provide personalized study tips for a student with the following performance:

Overall Performance: ${userPerformance.averageScore || 0}%
Streak: ${userPerformance.streak || 0} days
Weak Areas: ${weakAreas.join(', ')}

Provide actionable tips in JSON format:
{
  "tips": [
    {
      "category": "Time Management",
      "tip": "Specific actionable advice",
      "priority": "high/medium/low"
    }
  ],
  "focusAreas": ["Area 1", "Area 2"],
  "motivationalMessage": "Encouraging message"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { tips: [], focusAreas: [], motivationalMessage: '' };
  } catch (error) {
    console.error('AI Study Tips Error:', error);
    throw new Error('Failed to generate study tips');
  }
};

/**
 * Analyze code submissions
 */
const analyzeCodeSubmission = async (code, language, expectedOutput) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
Analyze the following ${language} code submission:

\`\`\`${language}
${code}
\`\`\`

Expected Output: ${expectedOutput}

Provide analysis in JSON format:
{
  "isCorrect": true/false,
  "score": 0-100,
  "feedback": "Detailed feedback",
  "strengths": ["Good practice 1", "Good practice 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "codeQuality": {
    "readability": 0-10,
    "efficiency": 0-10,
    "bestPractices": 0-10
  }
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return { isCorrect: false, score: 0, feedback: 'Unable to analyze' };
  } catch (error) {
    console.error('AI Code Analysis Error:', error);
    throw new Error('Failed to analyze code');
  }
};

/**
 * Chat with AI tutor
 */
const chatWithTutor = async (message, context = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
You are an expert AI tutor for the IQ Didactic LMS platform. Answer the student's question helpfully and accurately.

Context:
- Current Course: ${context.courseName || 'General'}
- Student Level: ${context.studentLevel || 1}
- Topic: ${context.topic || 'General Education'}

Student Question:
${message}

Provide a clear, educational response that helps the student learn.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return {
      response: response.text(),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new Error('Failed to get response from AI tutor');
  }
};

/**
 * Generate course outline from topic
 */
const generateCourseOutline = async (topic, level, duration) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = `
Create a comprehensive course outline for:

Topic: ${topic}
Level: ${level}
Duration: ${duration} weeks

Provide the outline in JSON format:
{
  "courseTitle": "Title",
  "description": "Brief description",
  "prerequisites": ["Prerequisite 1", "Prerequisite 2"],
  "learningObjectives": ["Objective 1", "Objective 2"],
  "modules": [
    {
      "week": 1,
      "title": "Module Title",
      "topics": ["Topic 1", "Topic 2"],
      "lessons": [
        {
          "title": "Lesson Title",
          "duration": 30,
          "type": "video",
          "description": "What students will learn"
        }
      ]
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return null;
  } catch (error) {
    console.error('AI Course Outline Error:', error);
    throw new Error('Failed to generate course outline');
  }
};

module.exports = {
  generateCourseRecommendations,
  generateLearningPath,
  generateQuizQuestions,
  generateStudyTips,
  analyzeCodeSubmission,
  chatWithTutor,
  generateCourseOutline
};