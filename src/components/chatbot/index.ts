import { ChatbotInputPanel } from "@/interfaces/chatbotInputPanel";
import ChatbotItemCard from "./chatbot-item";
import LessonPlan from "./lessonplan";
import QUIZ from "./quiz";
import Essay from "./essay";
import MathQuiz from "./mathquiz";

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
        id: '',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
    {
        id: '',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
    {
        id: '',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
    {
        id: '',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
    {
        id: '',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
    {
        id: '',
        data: LessonPlan
    },
    {
        id: 'General Quiz',
        data: QUIZ
    },
]

export default ChatbotItemCard