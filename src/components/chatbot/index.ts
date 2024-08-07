import { ChatbotInputPanel } from "@/interfaces/chatbot";
import ChatbotItemCard from "./chatbot-item";
import LessonPlan from "./lessonplan";
import QUIZ from "./quiz";
import Essay from "./essay";
import MathQuiz from "./mathquiz";
import MathLesson from "./mathlesson";
import VideoNote from "./videonote";
import VideoQuiz from "./videoquiz";
import AIWritingDetect from "./aiwritingdetect";
import Presentation from "./presentation";
import Report from "./report";
import ESL from "./ESL";
import HomeworkAssignment from "./homework";
import TestCreator from "./testcreator";
import Icebreaker from "./icebreaker";
import DocBot from "./docbot";

export const data: ChatbotInputPanel[] = [
    {
        id: 'Lesson Planning',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
    {
        id: 'Essay Grading',
        data: Essay
    },
    {
        id: 'Maths Quiz',
        data: MathQuiz
    },
    {
        id: 'Math Lesson Planner',
        data: MathLesson
    },
    {
        id: 'Video to notes',
        data: VideoNote
    },
    {
        id: 'Video to Quiz',
        data: VideoQuiz
    },
    {
        id: 'Detect AI-Writing & Plagiarism',
        data: AIWritingDetect
    },
    {
        id: 'PowerPoint Presentation',
        data: Presentation
    },
    {
        id: 'Reports Generator',
        data: Report
    },
    {
        id: 'ESL Activity Suggestion',
        data: ESL
    },
    {
        id: 'Homework Assignment Creator',
        data: HomeworkAssignment
    },
    {
        id: 'Test Creator',
        data: TestCreator
    },
    {
        id: 'Classroom Icebreaker Ideas',
        data: Icebreaker
    },
    {
        id: "Document & Web Link Quiz",
        data: DocBot
    }
]

export default ChatbotItemCard