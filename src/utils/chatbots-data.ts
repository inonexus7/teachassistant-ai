import { Category, ChatbotItem } from "@/interfaces/chatbot"

export const chatbots_items: Array<ChatbotItem> = [
    {
        id: 1,
        cover: '/images/courses/1.LessonPlanning-Lisa.png',
        title: 'Lesson Planning',
        admin: 'Lisa',
        text: 'The lesson planner assistant chatbot optimizes teaching tasks, providing tailored and efficient support to enhance classroom productivity and organization.',
        category: 'Lesson Planning'
    },
    {
        id: 2,
        cover: '/images/courses/2.Quiz-Qasim.png',
        title: 'General Quiz',
        admin: 'Qasim',
        text: 'QuizBot offers grade-specific quizzes on various subjects, with options like multiple-choice, true/false, and open-ended questions, fostering interactive learning in multiple languages.',
        category: 'Student Engagement & Activity Ideas'
    },
    {
        id: 3,
        cover: '/images/courses/3.AutomatedEssayScoringandFeedback-Elsa.png',
        title: 'Essay Grading',
        admin: 'Elsa',
        text: 'The Essay Grading bot evaluates essays, considering the question, grade level, and language, using default or custom rubrics for comprehensive assessment.',
        category: 'Assessment & Progress Monitoring'
    },
    {
        id: 4,
        cover: '/images/courses/5.MathsQuiz-Matthew.png',
        title: 'Maths Quiz',
        admin: 'Matthew',
        text: 'The Maths Quiz bot generates grade-appropriate math quizzes, featuring problems, varied question types, and language options to enhance mathematical skills.',
        category: 'Student Engagement & Activity Ideas'
    },
    {
        id: 5,
        cover: '/images/courses/6.MathLessonPlanner-Lucy.png',
        title: 'Math Lesson Planner',
        admin: 'Lucy',
        text: 'The Math Lesson Planner bot designs lessons: choose topic, grade, duration, key objectives, and language, for well-structured math teaching plans.',
        category: 'Lesson Planning'
    },
    {
        id: 6,
        cover: '/images/courses/7.Videotonotes-Vincent.png',
        title: 'Video to notes',
        admin: 'Vincent',
        text: 'Effortlessly condense videos into concise teacher-friendly summaries with the Video-to-Notes Bot, enhancing lesson planning and content understanding.',
        category: 'Digital Learning & Teaching Tools'
    },
    {
        id: 7,
        cover: '/images/courses/8.VideotoQuizBot.png',
        title: 'Video to Quiz',
        admin: 'Hunter',
        text: 'Transform videos into interactive quizzes using the Video to Quiz Bot, crafting questions in chosen formats and languages effortlessly.',
        category: 'Student Engagement & Activity Ideas'
    },
    {
        id: 8,
        cover: '/images/courses/9.DetectAI-Writing&Plagiarism-Ali.png',
        title: 'Detect AI-Writing & Plagiarism',
        admin: 'Ali',
        text: 'The Detect AI-Writing & Plagiarism Bot ensures originality by identifying AI-generated content and detecting plagiarism, maintaining academic integrity.',
        category: 'Assessment & Progress Monitoring'
    },
    {
        id: 9,
        cover: '/images/courses/10.PowerPointPresentationPriyanka.png',
        title: 'PowerPoint Presentation',
        admin: 'Priyanka',
        text: 'Create dynamic PowerPoint presentations effortlessly through the user-friendly inputs of the Presentation Bot, simplifying content delivery and engagement.',
        category: 'Digital Learning & Teaching Tools'
    },
    {
        id: 10,
        cover: '/images/courses/11ReportsGeneraor-Bob.png',
        title: 'Reports Generator',
        admin: 'Bob',
        text: 'Effortlessly generate tailored reports for educators and teachers, covering student data and performance, using customizable input fields.',
        category: 'Communication & Professional Learning'
    },
    {
        id: 11,
        cover: '/images/courses/12ESLActivitySuggestionAmira.png',
        title: 'ESL Activity Suggestion',
        admin: 'Amira',
        text: 'The ESL Activity Suggestion Chatbot aids ESL teachers and learners by suggesting custom activities focusing on language components and skill levels.',
        category: 'Special Education & Inclusive Practice'
    },
    {
        id: 12,
        cover: '/images/courses/13Document&WbLinkQuizOmari.png',
        title: 'Document & Web Link Quiz',
        admin: 'Omari',
        text: 'Create quizzes effortlessly by uploading documents (Word, PDF, PowerPoint) or website links, customizing question types and languages.',
        category: 'Student Engagement & Activity Ideas'
    },
    {
        id: 13,
        cover: '/images/courses/14HomeworkAssignmentCreatorIshan.png',
        title: 'Homework Assignment Creator',
        admin: 'Ishan',
        text: 'Efficiently create curriculum-aligned homework assignments for various subjects, specifying question types, objectives, and assignment types for different grade levels.',
        category: 'Assessment & Progress Monitoring'
    },
    {
        id: 14,
        cover: '/images/courses/15TestCreator-Jack.png',
        title: 'Test Creator',
        admin: 'Jack',
        text: 'Facilitate streamlined test creation for educators and teachers by specifying test elements: grade level, subjects, question types, and objectives.',
        category: 'Assessment & Progress Monitoring'
    },
    {
        id: 15,
        cover: '/images/courses/16ClassroomIcebreakerIdeas-Anne.png',
        title: 'Classroom Icebreaker Ideas',
        admin: 'Anne',
        text: 'Access a repository of engaging icebreaker activities, tailored for educators and teachers based on class specifics and learning objectives.',
        category: 'Student Engagement & Activity Ideas'
    },
]

export const categories: Category[] = [
    { title: "Lesson Planning", description: "With our AI teachers, lesson planning is effortless. Just give us the topic, and we'll generate engaging lesson plans, activities, and worksheets. Spend less time on research and design, and more on delivering impactful instruction. Experience the revolution in lesson planning with AI." },
    { title: "Student Engagement & Activity Ideas", description: "With our AI teachers, special education and English as a second language (ESL) instruction are revolutionized. These intelligent bots provide personalized support and resources to meet the unique needs of students in these areas. With our AI teachers, educators gain access to specialized strategies, adaptive materials, and personalized interventions, enhancing their ability to support students with special education requirements or those learning English as a second language. Leveraging AI technology, special education and ESL instruction become more effective and accessible, ensuring every student receives the necessary support for academic success." },
    { title: "Assessment & Progress Monitoring", description: "With our AI teachers, assessment and progress monitoring are transformed. These advanced bots offer efficient and accurate assessment tools, automated grading systems, and personalized feedback. Educators can track student progress effectively and make data-driven decisions to support growth. Embrace the power of AI teachers for streamlined assessment and monitoring of progress." },
    { title: "Digital Learning & Teaching Tools", description: "Our AI teachers revolutionize digital learning and teaching tools. With their advanced capabilities, educators gain access to a wide range of interactive resources and platforms. From virtual simulations to personalized learning tools, AI teachers enhance engagement and cater to diverse learning needs. Experience the transformative power of AI in education." },
    { title: "Communication & Professional Learning", description: "AI teachers also greatly benefit communication and professional learning. These intelligent bots facilitate seamless collaboration among educators, eliminating communication barriers and enabling efficient sharing of ideas and resources. Additionally, AI-powered platforms offer personalized professional development opportunities, providing tailored learning materials and insights for continuous growth. With these AI teachers, educators can enhance communication channels and engage in targeted professional learning, fostering a culture of collaboration and ongoing professional advancement." }
]