import React, { FC } from "react"

export interface ChatbotInputPanel {
    id: string;
    data: FC;
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
