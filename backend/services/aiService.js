// Groq API Configuration (much faster and more reliable than Gemini)
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL_NAME = 'llama-3.3-70b-versatile';

/**
 * Helper function to call Groq API
 */
const callGroqAPI = async (messages, temperature = 0.7) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        messages: messages,
        temperature: temperature,
        max_tokens: 8192,
        top_p: 0.95
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Groq API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error(`Failed to get AI response: ${error.message}`);
  }
};

/**
 * Generate AI-powered course recommendations
 */
const generateCourseRecommendations = async (userProfile, enrolledCourses) => {
  try {
    const prompt = `You are an expert educational advisor. Based on the following user profile and their enrolled courses, recommend 5 relevant courses they should take next.

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
}`;

    const messages = [
      { role: 'system', content: 'You are an expert educational advisor. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ];

    const text = await callGroqAPI(messages);
    
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
    const prompt = `Create a personalized learning path for a student who wants to learn: ${targetSkills.join(', ')}.

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
}`;

    const messages = [
      { role: 'system', content: 'You are an expert learning path designer. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ];

    const text = await callGroqAPI(messages);
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
    const prompt = `Generate 5 multiple-choice quiz questions for the following lesson:

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
}`;

    const messages = [
      { role: 'system', content: 'You are an expert quiz creator. Always respond with valid JSON containing exactly 5 questions.' },
      { role: 'user', content: prompt }
    ];

    const text = await callGroqAPI(messages);
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
    const prompt = `Provide personalized study tips for a student with the following performance:

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
}`;

    const messages = [
      { role: 'system', content: 'You are a supportive study coach. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ];

    const text = await callGroqAPI(messages);
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
    const prompt = `Analyze the following ${language} code submission:

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
}`;

    const messages = [
      { role: 'system', content: 'You are an expert code reviewer. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ];

    const text = await callGroqAPI(messages);
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
    const systemPrompt = `You are an expert AI tutor for the IQ Didactic LMS platform. You are helpful, knowledgeable, and encouraging. Answer questions clearly and educationally.

Context:
- Current Course: ${context.courseName || 'General'}
- Student Level: ${context.studentLevel || 1}
- Topic: ${context.topic || 'General Education'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const response = await callGroqAPI(messages);

    return {
      response: response,
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
    const prompt = `Create a comprehensive course outline for:

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
}`;

    const messages = [
      { role: 'system', content: 'You are an expert curriculum designer. Always respond with valid JSON.' },
      { role: 'user', content: prompt }
    ];

    const text = await callGroqAPI(messages);
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