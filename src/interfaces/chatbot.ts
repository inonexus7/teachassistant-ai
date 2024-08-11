import React, { FC } from "react"

export interface ChatbotInputPanel {
    id: string;
    data: FC<ChatbotProps> | FC<AIWritingDetectChatbotProps>;
}

export interface ChatbotProps {
    setAnswer: (message: string) => void;
    clearAnswer: () => void;
}

export interface ChatbotItem {
    id: number | string
    cover: string
    title: string
    admin: string
    text: string
    category: string
}

export interface AIWritingDetectChatbotProps {
    clearAnswer: () => void;
    setDetect: (v: boolean) => void;
    setPlag: (v: boolean) => void;
    setDetectAnswer: (v: any) => void;
    setPlagAnswer: (v: any) => void;
    detect: boolean;
    plag: boolean;
}

export interface Category {
    title: string,
    description: string
}