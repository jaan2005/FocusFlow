import type { Task, ChatMessage } from '../types';

// Enhanced AI response system that works like ChatGPT
export async function generateAIResponse(userInput: string, conversationHistory: ChatMessage[] = []): Promise<string> {
  // Simulate realistic API delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
  
  const input = userInput.toLowerCase();
  const context = analyzeUserIntent(input, conversationHistory);
  
  // Handle different types of queries like ChatGPT
  if (context.isScheduleRequest) {
    return generateIntelligentSchedule(context);
  } else if (context.isQuestionAbout) {
    return generateKnowledgeResponse(context);
  } else if (context.isAdviceRequest) {
    return generateAdviceResponse(context);
  } else if (context.isProblemSolving) {
    return generateProblemSolvingResponse(context);
  } else if (context.isExplanationRequest) {
    return generateExplanationResponse(context);
  } else if (context.isCreativeRequest) {
    return generateCreativeResponse(context);
  } else {
    return generateGeneralResponse(context);
  }
}

function analyzeUserIntent(input: string, history: ChatMessage[]) {
  const context = {
    originalInput: input,
    isScheduleRequest: false,
    isQuestionAbout: null as string | null,
    isAdviceRequest: false,
    isProblemSolving: false,
    isExplanationRequest: false,
    isCreativeRequest: false,
    timeSpecific: null as string | null,
    subject: null as string | null,
    urgency: 'normal',
    tone: 'helpful',
    conversationHistory: history,
    hasTimeRange: false,
    timeRanges: [] as string[]
  };

  // Schedule detection with better context understanding
  const scheduleKeywords = ['schedule', 'plan', 'routine', 'timetable', 'organize', 'time', 'when', 'study plan', 'work plan', 'create a', 'design'];
  
  if (scheduleKeywords.some(keyword => input.includes(keyword))) {
    context.isScheduleRequest = true;
    
    // Extract time ranges from input
    const timeRangeMatches = input.match(/(\d{1,2})\s*(?:am|pm)?\s*(?:to|until|-)\s*(\d{1,2})\s*(?:am|pm)?/gi);
    if (timeRangeMatches) {
      context.hasTimeRange = true;
      context.timeRanges = timeRangeMatches;
    }
    
    // Better time detection - check for multiple time periods
    if (input.includes('morning') && input.includes('evening')) {
      context.timeSpecific = 'morning-evening';
    } else if (input.includes('morning') && input.includes('night')) {
      context.timeSpecific = 'morning-night';
    } else if (input.includes('evening') && input.includes('night')) {
      context.timeSpecific = 'evening-night';
    } else if (input.includes('night') || input.includes('midnight') || input.includes('late') || 
               input.includes('10 pm') || input.includes('11 pm') || input.includes('12 am') || 
               input.includes('1 am') || input.includes('2 am')) {
      context.timeSpecific = 'night';
    } else if (input.includes('morning') || input.includes('early') || input.includes('dawn') || 
               input.includes('5 am') || input.includes('6 am') || input.includes('7 am') || 
               input.includes('8 am') || input.includes('9 am')) {
      context.timeSpecific = 'morning';
    } else if (input.includes('evening') || input.includes('after work') || 
               input.includes('6 pm') || input.includes('7 pm') || input.includes('8 pm') || 
               input.includes('9 pm') || input.includes('10 pm')) {
      context.timeSpecific = 'evening';
    } else if (input.includes('afternoon') || input.includes('lunch') || 
               input.includes('1 pm') || input.includes('2 pm') || input.includes('3 pm')) {
      context.timeSpecific = 'afternoon';
    }
  }

  // Question detection
  const questionWords = ['what', 'how', 'why', 'when', 'where', 'who', 'which', 'explain', 'tell me about'];
  if (questionWords.some(word => input.includes(word))) {
    context.isQuestionAbout = extractSubject(input);
    if (input.includes('explain') || input.includes('how does') || input.includes('what is')) {
      context.isExplanationRequest = true;
    }
  }

  // Advice detection
  const adviceKeywords = ['help', 'advice', 'suggest', 'recommend', 'should i', 'what do you think', 'opinion'];
  if (adviceKeywords.some(keyword => input.includes(keyword))) {
    context.isAdviceRequest = true;
  }

  // Problem solving detection
  const problemKeywords = ['problem', 'issue', 'solve', 'fix', 'error', 'trouble', 'stuck', 'challenge'];
  if (problemKeywords.some(keyword => input.includes(keyword))) {
    context.isProblemSolving = true;
  }

  // Creative request detection
  const creativeKeywords = ['create', 'write', 'generate', 'make', 'design', 'compose', 'story', 'poem', 'idea'];
  if (creativeKeywords.some(keyword => input.includes(keyword))) {
    context.isCreativeRequest = true;
  }

  return context;
}

function extractSubject(input: string): string {
  // Extract the main subject from questions
  const subjects = {
    'quantum': 'quantum physics',
    'ai': 'artificial intelligence',
    'machine learning': 'machine learning',
    'programming': 'programming',
    'javascript': 'JavaScript',
    'python': 'Python',
    'react': 'React',
    'health': 'health and wellness',
    'fitness': 'fitness and exercise',
    'nutrition': 'nutrition',
    'business': 'business',
    'marketing': 'marketing',
    'finance': 'finance',
    'investment': 'investing',
    'science': 'science',
    'history': 'history',
    'geography': 'geography',
    'math': 'mathematics',
    'physics': 'physics',
    'chemistry': 'chemistry',
    'biology': 'biology'
  };

  for (const [key, value] of Object.entries(subjects)) {
    if (input.includes(key)) {
      return value;
    }
  }

  return 'general topic';
}

function generateIntelligentSchedule(context: any): string {
  const { timeSpecific, originalInput } = context;
  
  // Handle combined morning and evening requests
  if (timeSpecific === 'morning-evening') {
    if (originalInput.includes('study') && originalInput.includes('exercise')) {
      return `🌅🌆 **Morning & Evening Routine (Study + Exercise Focus)**

## 🌅 **MORNING ROUTINE (5:00 AM - 9:00 AM)**

| Time | Activity | Purpose |
|------|----------|---------|
| **5:00 - 5:15 AM** | Wake Up + Hydrate + Pray/Meditate | Mental clarity, spiritual focus |
| **5:15 - 5:45 AM** | Light Stretching + Breathing Exercises | Body activation, mindfulness |
| **5:45 - 6:30 AM** | **Workout (Bodyweight/Run/Yoga)** | Physical strength & discipline |
| **6:30 - 6:50 AM** | Cooldown + Quick Shower | Refresh and energize |
| **6:50 - 7:10 AM** | Nutritious Breakfast | Fuel for focus |
| **7:10 - 9:00 AM** | **Deep Study Session (110 min)** | Peak brain power = maximum learning |

## 🌆 **EVENING ROUTINE (6:00 PM - 10:00 PM)**

| Time | Activity | Purpose |
|------|----------|---------|
| **6:00 - 6:30 PM** | Light Snack + Walk/Stretch | Digest + loosen up |
| **6:30 - 8:00 PM** | **Focused Study Session (90 min)** | Revision, practice, projects |
| **8:00 - 8:30 PM** | Dinner + Family/Social Time | Nutrition & emotional health |
| **8:30 - 9:15 PM** | Light Reading / Notes Review | Calm reinforcement of learning |
| **9:15 - 10:00 PM** | Wind Down (no screens) + Plan Next Day | Clear mind before sleep |

## 💡 **Key Success Tips:**
- **Morning = New Learning** (brain is fresh and ready)
- **Evening = Review & Practice** (consolidate the day's knowledge)
- **Exercise Variety**: Alternate between cardio, strength, and flexibility
- **Study Breaks**: Use 25-min Pomodoro sessions with 5-min breaks
- **Sleep Schedule**: Aim for 10 PM bedtime for 7+ hours of quality rest
- **Hydration**: Drink water consistently throughout both sessions
- **No Screens**: 1 hour before bed for better sleep quality

## 🎯 **Weekly Adjustments:**
- **Monday/Wednesday/Friday**: High-intensity workouts + challenging subjects
- **Tuesday/Thursday**: Moderate exercise + review sessions
- **Weekend**: Longer study blocks + outdoor activities

This routine maximizes both physical fitness and academic performance by leveraging your natural energy cycles!`;
    } else if (originalInput.includes('study')) {
      return `📚 **Morning & Evening Study Routine**

## 🌅 **MORNING STUDY BLOCK (5:00 AM - 9:00 AM)**

**5:00 - 5:30 AM**: Gentle Wake-Up & Preparation
- Drink large glass of water
- Light stretching and breathing
- Review study goals for the day
- Prepare study materials and snacks

**5:30 - 7:00 AM**: Deep Learning Session 1 (90 min)
- Tackle your most challenging subject
- Use active recall and spaced repetition
- Take notes and create mind maps
- Focus on new concepts and difficult topics

**7:00 - 7:15 AM**: Active Break
- Walk outside for fresh air
- Light physical movement
- Healthy breakfast preparation

**7:15 - 7:45 AM**: Nutritious Breakfast
- Protein-rich meal for sustained energy
- Review flashcards while eating
- Plan afternoon priorities

**7:45 - 9:00 AM**: Study Session 2 (75 min)
- Practice problems and applications
- Review previous day's material
- Prepare for upcoming classes/exams

## 🌆 **EVENING STUDY BLOCK (6:00 PM - 10:00 PM)**

**6:00 - 6:30 PM**: Transition & Setup
- Light snack and hydration
- Review morning's accomplishments
- Organize evening study materials
- Set specific goals for the session

**6:30 - 8:00 PM**: Focused Study Session (90 min)
- Review and consolidate morning learning
- Work on assignments and projects
- Practice past papers or exercises
- Use different study methods (visual, auditory)

**8:00 - 8:30 PM**: Dinner Break
- Balanced meal for brain fuel
- Brief relaxation and social time
- Avoid heavy foods that cause drowsiness

**8:30 - 9:30 PM**: Final Study Session (60 min)
- Light review and memorization
- Prepare for tomorrow's classes
- Organize notes and materials
- Quick self-testing

**9:30 - 10:00 PM**: Wind Down & Planning
- Review day's achievements
- Plan tomorrow's study priorities
- Relaxation and preparation for sleep
- No screens for better sleep quality

## 🧠 **Study Optimization Tips:**
- Use the **Pomodoro Technique** (25 min study + 5 min break)
- **Morning**: New and challenging material
- **Evening**: Review, practice, and consolidation
- Keep study environment cool and well-lit
- Take breaks every 90 minutes for optimal focus`;
    } else if (originalInput.includes('exercise') || originalInput.includes('workout')) {
      return `💪 **Morning & Evening Exercise Routine**

## 🌅 **MORNING WORKOUT (5:00 AM - 9:00 AM)**

**5:00 - 5:15 AM**: Wake-Up & Activation
- Gentle stretching in bed
- Drink water and light breathing exercises
- Set positive intentions for the day

**5:15 - 5:30 AM**: Dynamic Warm-Up
- Joint mobility exercises
- Light cardio (marching, arm circles)
- Activate core and major muscle groups

**5:30 - 6:30 AM**: Main Workout Session
- **Monday/Wednesday/Friday**: Strength training (full body)
- **Tuesday/Thursday**: Cardio (running, cycling, HIIT)
- **Saturday**: Yoga or flexibility focus
- **Sunday**: Active recovery (walking, light stretching)

**6:30 - 6:45 AM**: Cool Down & Stretching
- Static stretches for worked muscles
- Deep breathing and relaxation
- Hydration and recovery

**6:45 - 7:15 AM**: Post-Workout Care
- Shower and personal hygiene
- Change into fresh clothes
- Prepare workout gear for evening

**7:15 - 8:00 AM**: Recovery Breakfast
- Protein for muscle recovery
- Complex carbs for energy
- Fruits and vegetables for nutrients

**8:00 - 9:00 AM**: Active Recovery
- Light walk or gentle movement
- Meal prep for the day
- Plan evening workout

## 🌆 **EVENING WORKOUT (6:00 PM - 10:00 PM)**

**6:00 - 6:15 PM**: Pre-Workout Preparation
- Light snack (if needed)
- Change into workout clothes
- Review workout plan

**6:15 - 6:30 PM**: Warm-Up & Mobility
- Dynamic stretching
- Joint mobility work
- Gradual heart rate increase

**6:30 - 7:30 PM**: Main Evening Session
- **Strength Days**: Focus on different muscle groups than morning
- **Cardio Days**: Moderate intensity, longer duration
- **Flexibility Days**: Yoga, Pilates, or deep stretching
- **Sports Days**: Basketball, tennis, swimming

**7:30 - 7:45 PM**: Cool Down
- Gradual heart rate reduction
- Static stretching
- Breathing exercises

**7:45 - 8:30 PM**: Post-Workout Nutrition
- Protein and carb recovery meal
- Plenty of hydration
- Anti-inflammatory foods

**8:30 - 9:30 PM**: Recovery Activities
- Foam rolling or self-massage
- Gentle stretching or yoga
- Prepare for next day's workouts

**9:30 - 10:00 PM**: Evening Wind-Down
- Relaxation and stress relief
- Plan tomorrow's activities
- Prepare for quality sleep

## 🏆 **Weekly Exercise Schedule:**
- **Monday**: Upper body strength (AM) + Core/abs (PM)
- **Tuesday**: Cardio intervals (AM) + Yoga (PM)
- **Wednesday**: Lower body strength (AM) + Swimming/sports (PM)
- **Thursday**: HIIT workout (AM) + Flexibility (PM)
- **Friday**: Full body strength (AM) + Active recovery (PM)
- **Saturday**: Long cardio (AM) + Recreation (PM)
- **Sunday**: Gentle yoga (AM) + Rest/planning (PM)`;
    } else {
      return generateMorningEveningCombined(context);
    }
  }
  
  // Night-specific schedules
  if (timeSpecific === 'night') {
    if (originalInput.includes('study')) {
      return `🌙 **Late Night Study Schedule**

**10:00 PM - 10:15 PM**: Prepare study environment
- Set up comfortable lighting (warm, not too bright)
- Prepare healthy snacks and water
- Turn off distracting notifications
- Review what you'll study tonight

**10:15 PM - 11:45 PM**: Deep Focus Session 1
- Study your most challenging subject first
- Use active recall techniques
- Take notes and summarize key points
- Avoid passive reading

**11:45 PM - 12:00 AM**: Active Break
- Light stretching or walk around
- Hydrate and have a small healthy snack
- Fresh air if possible
- Avoid screens during break

**12:00 AM - 1:30 AM**: Deep Focus Session 2
- Continue with complex material
- Practice problems or exercises
- Create mind maps or diagrams
- Test your understanding

**1:30 AM - 1:45 AM**: Final Break
- Gentle movement and hydration
- Prepare for final session
- Quick review of progress

**1:45 AM - 2:30 AM**: Review & Consolidation
- Review everything studied tonight
- Create summary notes
- Plan tomorrow's study priorities
- Prepare for quality sleep

**2:30 AM - 3:00 AM**: Wind Down
- Light reading or relaxation
- Prepare for restful sleep
- Set alarm for adequate rest

💡 **Night Study Tips:**
- Keep room temperature cool (65-68°F)
- Use blue light filters on devices
- Stay hydrated but limit caffeine after midnight
- Take breaks every 90 minutes for optimal focus`;
    } else {
      return `🌃 **Productive Night Schedule**

**9:00 PM - 10:00 PM**: Evening Transition
- Finish dinner and light cleanup
- Review day's accomplishments
- Set intentions for night activities

**10:00 PM - 11:30 PM**: Personal Projects
- Work on passion projects or hobbies
- Creative writing or artistic pursuits
- Skill development or online courses

**11:30 PM - 12:00 AM**: Reflection & Planning
- Journal about the day
- Plan tomorrow's priorities
- Gratitude practice

**12:00 AM - 1:00 AM**: Learning Time
- Read books or articles
- Watch educational content
- Practice new skills

**1:00 AM - 2:00 AM**: Relaxation & Self-Care
- Gentle yoga or meditation
- Skincare routine
- Calming music or podcasts

**2:00 AM - 2:30 AM**: Prepare for Sleep
- Organize tomorrow's essentials
- Create peaceful sleep environment
- Wind-down activities`;
    }
  }
  
  // Morning-specific schedules
  if (timeSpecific === 'morning') {
    return generateMorningRoutine(context);
  }

  // Evening-specific schedules
  if (timeSpecific === 'evening') {
    return generateEveningRoutine(context);
  }

  // Default comprehensive schedule
  return generateComprehensiveSchedule(context);
}

function generateMorningEveningCombined(context: any): string {
  return `🌅🌆 **Complete Morning & Evening Routine**

## 🌅 **MORNING ROUTINE (5:00 AM - 9:00 AM)**

| Time | Activity | Purpose |
|------|----------|---------|
| **5:00 - 5:20 AM** | Gentle Wake-Up + Hydration | Body activation, mental clarity |
| **5:20 - 5:40 AM** | Meditation + Gratitude Practice | Mindfulness, positive mindset |
| **5:40 - 6:30 AM** | Exercise (Cardio/Strength/Yoga) | Physical health, energy boost |
| **6:30 - 6:50 AM** | Shower + Personal Care | Refresh and prepare |
| **6:50 - 7:20 AM** | Healthy Breakfast | Nutrition for sustained energy |
| **7:20 - 9:00 AM** | Productive Work/Study Time | Peak mental performance |

## 🌆 **EVENING ROUTINE (6:00 PM - 10:00 PM)**

| Time | Activity | Purpose |
|------|----------|---------|
| **6:00 - 6:30 PM** | Transition + Light Movement | Decompress from day |
| **6:30 - 7:30 PM** | Dinner + Social Time | Nutrition, relationships |
| **7:30 - 8:30 PM** | Personal Projects/Learning | Growth, skill development |
| **8:30 - 9:00 PM** | Reflection + Planning | Process day, prepare tomorrow |
| **9:00 - 9:30 PM** | Relaxation Activities | Stress relief, enjoyment |
| **9:30 - 10:00 PM** | Wind Down for Sleep | Prepare for quality rest |

## 🎯 **Success Principles:**
- **Consistency**: Same times daily for habit formation
- **Balance**: Mix of productivity, health, and relaxation
- **Flexibility**: Adjust based on daily needs
- **Preparation**: Set up environment for success
- **Recovery**: Adequate rest between sessions

This routine creates a powerful framework for daily success and well-being!`;
}

function generateMorningRoutine(context: any): string {
  const routines = [
    `🌅 **Energizing Morning Routine**

06:00 - 06:15 Wake up gently, drink water, light stretching
06:15 - 06:45 Morning exercise or yoga
06:45 - 07:15 Refreshing shower and get dressed
07:15 - 07:45 Nutritious breakfast with protein
07:45 - 08:00 Review daily goals and set intentions
08:00 - 08:30 Tackle most important task (peak energy)
08:30 - 09:00 Check emails and respond to urgent items
09:00 - 10:30 Deep work session on priority project
10:30 - 10:45 Movement break and hydration
10:45 - 12:00 Continue focused work`,

    `☀️ **Productive Morning Schedule**

05:45 - 06:15 Early wake-up, meditation, gratitude practice
06:15 - 06:45 Cardio workout or brisk walk
06:45 - 07:15 Shower and morning skincare routine
07:15 - 07:45 Healthy breakfast and vitamins
07:45 - 08:15 Reading or learning (personal development)
08:15 - 09:45 High-priority work (when mind is fresh)
09:45 - 10:00 Coffee break and light snack
10:00 - 11:30 Creative work or problem-solving
11:30 - 11:45 Quick walk or stretching
11:45 - 12:30 Administrative tasks and planning`,

    `🌱 **Mindful Morning Routine**

06:30 - 07:00 Gentle wake-up, breathing exercises
07:00 - 07:30 Journaling and intention setting
07:30 - 08:00 Mindful breakfast preparation and eating
08:00 - 08:30 Light exercise or tai chi
08:30 - 09:00 Shower and mindful grooming
09:00 - 10:30 Most challenging work task
10:30 - 10:45 Mindful break with tea
10:45 - 12:00 Collaborative work or meetings
12:00 - 12:30 Lunch preparation with awareness`
  ];

  return routines[Math.floor(Math.random() * routines.length)];
}

function generateEveningRoutine(context: any): string {
  const routines = [
    `🌆 **Relaxing Evening Schedule**

17:00 - 18:00 Transition from work, light walk
18:00 - 19:00 Dinner preparation and mindful eating
19:00 - 19:30 Clean up and organize space
19:30 - 20:30 Personal hobby or creative time
20:30 - 21:00 Connect with family/friends
21:00 - 21:30 Light reading or podcast
21:30 - 22:00 Prepare for tomorrow, plan priorities
22:00 - 22:30 Relaxation (bath, music, meditation)
22:30 - 23:00 Wind down routine, gratitude practice
23:00 Prepare for restful sleep`,

    `🎯 **Productive Evening Routine**

17:30 - 18:30 Exercise or gym session
18:30 - 19:00 Post-workout shower and change
19:00 - 20:00 Healthy dinner with protein
20:00 - 20:30 Review day's accomplishments
20:30 - 21:30 Learning time (course, book, skill)
21:30 - 22:00 Plan tomorrow's top 3 priorities
22:00 - 22:30 Personal care and hygiene routine
22:30 - 23:00 Relaxing activity (music, gentle yoga)
23:00 - 23:30 Digital detox and bedroom preparation
23:30 Sleep time for 7-8 hours rest`,

    `💫 **Balanced Evening Schedule**

17:00 - 18:00 Decompress from work day
18:00 - 19:00 Cook and enjoy dinner
19:00 - 19:30 Light household tasks
19:30 - 20:30 Social time or entertainment
20:30 - 21:00 Personal project or hobby
21:00 - 21:30 Reflect on day, journal briefly
21:30 - 22:00 Prepare clothes and items for tomorrow
22:00 - 22:30 Skincare and self-care routine
22:30 - 23:00 Reading or calming activity
23:00 Wind down for quality sleep`
  ];

  return routines[Math.floor(Math.random() * routines.length)];
}

function generateComprehensiveSchedule(context: any): string {
  const schedules = [
    `📅 **Optimized Daily Schedule**

**Morning (6:00 AM - 12:00 PM)**
6:00 - 7:00 AM: Morning routine and energizing breakfast
7:00 - 9:00 AM: High-priority deep work (peak mental energy)
9:00 - 9:15 AM: Movement break and hydration
9:15 - 11:00 AM: Continued focused work session
11:00 - 11:15 AM: Quick break and healthy snack
11:15 AM - 12:00 PM: Administrative tasks and planning

**Afternoon (12:00 PM - 6:00 PM)**
12:00 - 1:00 PM: Lunch break and mental reset
1:00 - 2:30 PM: Collaborative work or meetings
2:30 - 2:45 PM: Energizing break
2:45 - 4:30 PM: Creative work and problem-solving
4:30 - 4:45 PM: Brief relaxation break
4:45 - 6:00 PM: Wrap-up tasks and tomorrow's planning

**Evening (6:00 PM - 10:00 PM)**
6:00 - 7:00 PM: Exercise or physical activity
7:00 - 8:00 PM: Dinner and family time
8:00 - 9:00 PM: Personal hobbies or learning
9:00 - 10:00 PM: Relaxation and preparation for sleep`,

    `🎯 **Productivity-Focused Schedule**

**Early Start (5:30 AM - 9:00 AM)**
5:30 - 6:30 AM: Morning routine and goal setting
6:30 - 8:00 AM: Most important project work
8:00 - 8:15 AM: Active break and breakfast
8:15 - 9:00 AM: Secondary priority tasks

**Core Hours (9:00 AM - 5:00 PM)**
9:00 - 10:30 AM: Deep work session
10:30 - 10:45 AM: Movement break
10:45 AM - 12:00 PM: Collaborative work
12:00 - 1:00 PM: Lunch and mental break
1:00 - 2:30 PM: Administrative work
2:30 - 2:45 PM: Refreshing break
2:45 - 4:30 PM: Learning and skill development
4:30 - 5:00 PM: Daily review and progress tracking

**Evening (5:00 PM - 9:00 PM)**
5:00 - 6:00 PM: Exercise and physical activity
6:00 - 7:00 PM: Dinner and social time
7:00 - 8:00 PM: Personal projects or hobbies
8:00 - 9:00 PM: Relaxation and wind-down`
  ];

  return schedules[Math.floor(Math.random() * schedules.length)];
}

function generateKnowledgeResponse(context: any): string {
  const { isQuestionAbout, originalInput } = context;
  
  if (originalInput.includes('quantum')) {
    return `🔬 **Quantum Physics Explained**

Quantum physics is the branch of physics that studies matter and energy at the smallest scales - typically atoms and subatomic particles. Here are the key concepts:

**Core Principles:**
• **Wave-Particle Duality**: Particles can behave like waves and vice versa
• **Uncertainty Principle**: You can't know both position and momentum precisely
• **Superposition**: Particles can exist in multiple states simultaneously
• **Entanglement**: Particles can be mysteriously connected across distances

**Real-World Applications:**
• Computer processors and memory
• MRI machines in hospitals
• Laser technology
• GPS satellites (require quantum corrections)
• Emerging quantum computers

**Mind-Bending Facts:**
• A particle can be in two places at once until observed
• Quantum tunneling allows particles to pass through barriers
• Quantum computers could solve certain problems exponentially faster

**Getting Started:**
If you're interested in learning more, I recommend starting with popular science books like "Quantum Theory Cannot Hurt You" by Marcus Chown or online courses from MIT or Stanford.

Would you like me to explain any specific quantum concept in more detail?`;
  }

  if (originalInput.includes('ai') || originalInput.includes('artificial intelligence')) {
    return `🤖 **Artificial Intelligence Explained**

AI is the simulation of human intelligence in machines programmed to think and learn like humans.

**Types of AI:**
• **Narrow AI**: Designed for specific tasks (like me, Siri, or chess programs)
• **General AI**: Human-level intelligence across all domains (not yet achieved)
• **Superintelligence**: AI that surpasses human intelligence (theoretical)

**How AI Works:**
• **Machine Learning**: Algorithms that improve through experience
• **Neural Networks**: Systems inspired by the human brain
• **Deep Learning**: Multi-layered neural networks for complex patterns
• **Natural Language Processing**: Understanding and generating human language

**Current Applications:**
• Virtual assistants and chatbots
• Image and speech recognition
• Recommendation systems (Netflix, Spotify)
• Autonomous vehicles
• Medical diagnosis and drug discovery
• Financial trading and fraud detection

**Future Possibilities:**
• More sophisticated personal assistants
• Advanced robotics and automation
• Breakthrough scientific discoveries
• Enhanced creativity and problem-solving tools

**Ethical Considerations:**
• Job displacement and economic impact
• Privacy and surveillance concerns
• Bias in AI decision-making
• The need for responsible AI development

Would you like to know more about any specific aspect of AI?`;
  }

  // Default knowledge response
  return `🧠 **About ${isQuestionAbout || 'Your Topic'}**

I'd be happy to help explain this topic! However, I need a bit more specific information to give you the most accurate and helpful response.

**What I can help with:**
• Scientific concepts and theories
• Technology and programming
• History and current events
• Health and wellness
• Business and finance
• Arts and culture
• And much more!

**To give you the best answer, could you:**
• Be more specific about what aspect interests you?
• Let me know your current knowledge level?
• Tell me what you'd like to use this information for?

For example, instead of "tell me about science," try "explain how photosynthesis works" or "what are the basics of climate change?"

Feel free to ask your question again with more details, and I'll provide a comprehensive, easy-to-understand explanation!`;
}

function generateAdviceResponse(context: any): string {
  const { originalInput } = context;
  
  if (originalInput.includes('career') || originalInput.includes('job')) {
    return `💼 **Career Advice**

Here's some thoughtful career guidance:

**Finding Your Path:**
• Identify your core values and what motivates you
• Assess your natural strengths and skills
• Consider what problems you enjoy solving
• Think about the lifestyle you want to maintain

**Building Skills:**
• Focus on both technical and soft skills
• Embrace continuous learning and adaptation
• Seek feedback and mentorship opportunities
• Build a portfolio of your best work

**Networking & Relationships:**
• Cultivate genuine professional relationships
• Attend industry events and join professional groups
• Maintain connections even when you don't need anything
• Be generous with your knowledge and help others

**Making Decisions:**
• Don't just chase money - consider growth potential
• Evaluate company culture and values alignment
• Think long-term about where you want to be
• Trust your instincts but also seek diverse perspectives

**Staying Resilient:**
• View setbacks as learning opportunities
• Maintain work-life balance to avoid burnout
• Keep developing new skills to stay relevant
• Build an emergency fund for security

What specific aspect of your career would you like to discuss further?`;
  }

  if (originalInput.includes('relationship') || originalInput.includes('dating')) {
    return `💕 **Relationship Advice**

Building healthy relationships takes effort and understanding:

**Communication is Key:**
• Listen actively and empathetically
• Express your needs clearly and kindly
• Address conflicts directly but respectfully
• Practice vulnerability and emotional honesty

**Building Strong Foundations:**
• Shared values and life goals matter
• Maintain your individual identity and interests
• Support each other's growth and dreams
• Create positive shared experiences and memories

**Navigating Challenges:**
• Disagreements are normal - focus on resolution
• Learn each other's love languages
• Practice forgiveness and let go of grudges
• Seek professional help when needed

**Red Flags to Watch For:**
• Lack of respect for boundaries
• Controlling or manipulative behavior
• Inability to communicate or resolve conflicts
• Fundamental incompatibility in values

**Self-Care in Relationships:**
• Don't lose yourself in the relationship
• Maintain friendships and personal interests
• Work on your own emotional health
• Know your worth and don't settle for less

What specific relationship situation would you like guidance on?`;
  }

  return `🌟 **General Life Advice**

Here are some universal principles for living well:

**Personal Growth:**
• Embrace lifelong learning and curiosity
• Step outside your comfort zone regularly
• Practice self-reflection and mindfulness
• Set meaningful goals and work toward them consistently

**Relationships:**
• Invest time in people who matter to you
• Practice empathy and active listening
• Be reliable and trustworthy
• Surround yourself with positive, supportive people

**Health & Wellness:**
• Prioritize sleep, nutrition, and exercise
• Manage stress through healthy coping mechanisms
• Take care of your mental health
• Create boundaries between work and personal life

**Financial Wisdom:**
• Live below your means and save regularly
• Invest in your future self
• Avoid unnecessary debt
• Build an emergency fund for peace of mind

**Finding Purpose:**
• Identify what gives your life meaning
• Contribute to something larger than yourself
• Use your unique talents to help others
• Stay true to your values and principles

What specific area of life would you like more detailed advice about?`;
}

function generateProblemSolvingResponse(context: any): string {
  const { originalInput } = context;
  
  return `🔧 **Problem-Solving Approach**

Let's work through this systematically:

**Step 1: Define the Problem Clearly**
• What exactly is the issue you're facing?
• When did it start and what might have triggered it?
• Who or what is affected by this problem?
• What have you already tried?

**Step 2: Gather Information**
• What resources do you have available?
• Are there similar problems others have solved?
• What constraints or limitations exist?
• What would an ideal solution look like?

**Step 3: Generate Solutions**
• Brainstorm multiple approaches (quantity over quality first)
• Consider both conventional and creative solutions
• Think about short-term fixes vs. long-term solutions
• Ask: "What would someone else do in this situation?"

**Step 4: Evaluate Options**
• What are the pros and cons of each approach?
• Which solutions are most feasible given your resources?
• What are the potential risks and benefits?
• Which option aligns best with your goals?

**Step 5: Take Action**
• Start with the most promising solution
• Break it down into manageable steps
• Set a timeline and track progress
• Be prepared to adjust if needed

**Step 6: Learn and Improve**
• What worked well and what didn't?
• What would you do differently next time?
• How can you prevent similar problems?

Could you share more details about the specific problem you're facing? I'd be happy to help you work through it step by step!`;
}

function generateExplanationResponse(context: any): string {
  const { originalInput } = context;
  
  if (originalInput.includes('how does') || originalInput.includes('how do')) {
    return `🔍 **How Things Work**

I'd love to explain how something works! To give you the best explanation, I need to know specifically what you're curious about.

**I can explain:**
• **Technology**: How computers, internet, smartphones work
• **Science**: How photosynthesis, gravity, electricity work
• **Body**: How digestion, memory, muscles work
• **Systems**: How economies, governments, ecosystems work
• **Processes**: How learning, habits, relationships work

**My explanation style:**
• Start with the big picture, then dive into details
• Use analogies and examples you can relate to
• Break complex concepts into simple steps
• Include practical applications and real-world examples

**For the best explanation:**
• Be specific about what aspect interests you most
• Let me know your background knowledge level
• Tell me if you prefer simple overviews or detailed explanations

For example:
• "How does the internet work?" → I'll explain data packets, servers, protocols
• "How do habits form?" → I'll cover the habit loop, neuroscience, practical tips
• "How does photosynthesis work?" → I'll break down the chemical process step by step

What would you like me to explain? Ask away!`;
  }

  return `📚 **Explanation Ready!**

I'm here to break down complex topics into understandable explanations!

**What I can explain:**
• Scientific concepts and natural phenomena
• How technology and systems work
• Historical events and their significance
• Mathematical and logical concepts
• Social and psychological principles
• Creative and artistic techniques

**My approach:**
• Clear, jargon-free language
• Step-by-step breakdowns
• Real-world examples and analogies
• Visual descriptions when helpful
• Practical applications and implications

Just ask me to explain anything you're curious about, and I'll make it as clear and engaging as possible!

What would you like to understand better?`;
}

function generateCreativeResponse(context: any): string {
  const { originalInput } = context;
  
  if (originalInput.includes('story') || originalInput.includes('write')) {
    return `✨ **Creative Writing**

I'd be delighted to help with creative writing! Here are some options:

**What I can create:**
• Short stories in any genre (sci-fi, fantasy, mystery, romance, etc.)
• Poems (haiku, sonnets, free verse, lyrics)
• Character descriptions and backstories
• Plot outlines and story ideas
• Dialogue and scene writing
• Creative non-fiction pieces

**To create something perfect for you:**
• What genre or style interests you?
• Any specific themes, characters, or settings?
• What length are you thinking? (short paragraph, full story, etc.)
• Is this for fun, school, or a specific purpose?

**Example prompts:**
• "Write a short sci-fi story about time travel"
• "Create a poem about autumn"
• "Help me develop a character for my novel"
• "Write a funny dialogue between two unlikely friends"

**Or I can help you:**
• Overcome writer's block with prompts and exercises
• Improve existing writing with feedback and suggestions
• Develop your writing skills and techniques
• Brainstorm ideas for your projects

What kind of creative writing would you like to explore together?`;
  }

  return `🎨 **Creative Assistance**

I'm excited to help with your creative project!

**I can help create:**
• Written content (stories, poems, scripts, articles)
• Ideas and concepts for projects
• Problem-solving for creative challenges
• Brainstorming and inspiration
• Structure and organization for creative work

**Creative process support:**
• Overcoming creative blocks
• Developing ideas from concept to completion
• Feedback and constructive suggestions
• Techniques and methods for different mediums
• Inspiration and motivation

**Just tell me:**
• What type of creative work you're interested in
• Your experience level and goals
• Any specific requirements or constraints
• Whether you want me to create something or help you create

I'm here to spark creativity and help bring your ideas to life! What creative adventure shall we embark on?`;
}

function generateGeneralResponse(context: any): string {
  const responses = [
    `Hello! I'm Mini ChatGPT, your AI assistant. I'm here to help with a wide variety of questions and tasks.

**I can help you with:**
• Creating schedules and planning your day
• Answering questions on virtually any topic
• Providing advice and guidance
• Explaining complex concepts simply
• Solving problems step by step
• Creative writing and brainstorming
• Learning new skills and subjects

**Just ask me anything like:**
• "Plan my study schedule for tonight"
• "Explain how photosynthesis works"
• "Give me advice about career decisions"
• "Help me solve this problem"
• "Write a short story about space"
• "What's the best way to learn Spanish?"

I'm designed to understand context and provide helpful, detailed responses. What would you like to explore today?`,

    `Hi there! I'm your Mini ChatGPT assistant, ready to help with whatever you need.

**Popular things I help with:**
• **Planning & Scheduling**: Daily routines, study plans, work schedules
• **Learning & Education**: Explanations, tutorials, study help
• **Problem Solving**: Step-by-step solutions and troubleshooting
• **Creative Projects**: Writing, brainstorming, idea generation
• **Life Advice**: Career, relationships, personal development
• **General Knowledge**: Science, history, technology, current events

**I'm designed to:**
• Understand your specific needs and context
• Provide detailed, helpful responses
• Adapt my communication style to what works best for you
• Remember our conversation to give better follow-up answers

Feel free to ask me anything - from practical questions to creative challenges to deep philosophical discussions. What's on your mind?`,

    `Welcome! I'm Mini ChatGPT, your intelligent AI companion.

**What makes me different:**
• I understand context and nuance in conversations
• I can handle complex, multi-part questions
• I provide detailed, thoughtful responses
• I adapt to your communication style and needs
• I can help with both practical tasks and creative projects

**Try asking me:**
• Complex questions that require detailed explanations
• For help with planning and organization
• About topics you're curious to learn about
• For creative assistance with writing or ideas
• For advice on personal or professional matters
• To solve problems or work through challenges

I'm here to be genuinely helpful and engaging. What would you like to talk about or work on together?`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export function parseScheduleFromText(text: string): Task[] {
  const tasks: Task[] = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  lines.forEach((line, index) => {
    const timeMatch = line.match(/(\d{1,2}:\d{2})\s*(?:AM|PM)?\s*-\s*(\d{1,2}:\d{2})\s*(?:AM|PM)?/);
    const taskMatch = line.match(/(?:\d{1,2}:\d{2}\s*(?:AM|PM)?\s*-\s*\d{1,2}:\d{2}\s*(?:AM|PM)?)?\s*[:\-]?\s*(.+)/);
    
    if (taskMatch) {
      const taskText = taskMatch[1]
        .replace(/^[-•*]\s*/, '')
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .trim();
      
      if (taskText && taskText.length > 3 && !taskText.includes('**') && !taskText.includes('##')) {
        tasks.push({
          id: `task-${Date.now()}-${index}`,
          text: taskText,
          completed: false,
          startTime: timeMatch ? timeMatch[1] : undefined,
          endTime: timeMatch ? timeMatch[2] : undefined,
          priority: 'medium',
          category: detectCategory(taskText)
        });
      }
    }
  });
  
  return tasks;
}

function detectCategory(taskText: string): string {
  const text = taskText.toLowerCase();
  
  if (text.includes('work') || text.includes('meeting') || text.includes('project') || text.includes('email') || text.includes('admin')) {
    return 'work';
  } else if (text.includes('study') || text.includes('learn') || text.includes('read') || text.includes('exam') || text.includes('research')) {
    return 'learning';
  } else if (text.includes('exercise') || text.includes('workout') || text.includes('gym') || text.includes('run') || text.includes('fitness')) {
    return 'fitness';
  } else if (text.includes('eat') || text.includes('meal') || text.includes('breakfast') || text.includes('lunch') || text.includes('dinner') || text.includes('cook')) {
    return 'health';
  } else if (text.includes('family') || text.includes('friend') || text.includes('social') || text.includes('hobby') || text.includes('relax')) {
    return 'personal';
  } else if (text.includes('break') || text.includes('rest') || text.includes('walk') || text.includes('stretch')) {
    return 'break';
  } else {
    return 'general';
  }
}