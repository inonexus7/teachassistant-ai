import openai
import config
import os
import json
from gptutils import create_chat_data

openai.api_key = config.DevelopmentConfig.OPENAI_KEY

history = []

def genESLActivity(data):
    message = """
            You are a quiz generator. I will give you some information about examination, then you should generate different quiz problems and answers based on these information.

            Difficulty level: {level}
            Language Components: {component}
            Activity Type: {type}
            User Prompt: {prompt}
            Activity Format: {format}
            Activity Length: {len}
            Language: {language}

            Based on these information, your answer should be as follow format:
            problem number, problem
            answer

            The answer has several candidates and only the one candidate should be correct and others are incorrect.

            In case of the Acitivity Type is comprehension, you should generate a short story 2-3 paragraphs and then provide language component questions based on the story. For instance, if you're focusing on the language component of verbs, you can inquire about the number of verbs used in the story. 
            When the Activity Format is Multiple Choice quiz, you should generate Multiplce Choice quiz.
            When the Activity Format is Fill blanks quiz, you should generate Fill Blanks quiz.
            When the Activity Format is Comprehension or False quiz, you should generate comprehension. 
            The problems should be different type.
            And the language of your response should be {language}.
    """.format(level = data['diff_level'], component = data['lang_comp'], type = data['act_type'], prompt = data['user_prompt'], format = data['act_format'], len = data['act_len'], language = data['lang'])

    messages = [{'role': 'user', 'content': message}]
    return messages