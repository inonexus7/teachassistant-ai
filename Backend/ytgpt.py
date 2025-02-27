#!/usr/bin/env python3
from openai import OpenAI
import config
import json
import re
import textwrap
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from gptutils import create_chat_data
import config

openai_api_key = config.DevelopmentConfig.OPENAI_KEY
client = OpenAI(api_key=openai_api_key)

def openhistory(filename):
    try:
        with open(filename, 'r') as openfile:
            messages = json.load(openfile)
    except:
        messages = None
    return messages

def savehistory(filename, messages):
    with open(filename, "w") as outfile:
        json.dump(messages, outfile)

def aicomplete(prompt, filename):
    # openai.api_key = config.DevelopmentConfig.OPENAI_KEY
    model = "gpt-3.5-turbo"
    system = "you are a helpfull assistant"
    messages = openhistory(filename)
    if messages:
        message= {"role": "user", "content": prompt}
        messages.append(message)
        response = client.chat.completions.create(model=model, messages=messages)
    else:
        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
        response = client.chat.completions.create(model=model, messages=messages)
    message = response.choices[0].message.content
    messages.append(message)
    if filename != 'dontsave':
        savehistory(filename, messages)
    return message['content'].replace('\n','<br>' )

def summarize(vidUrl, userinput=None, language="English"):
    """
    vidUrl: url to the youtube video
    useripnut: for the chat function
    returns: response content
    """
    
    model = "gpt-3.5-turbo"
    system = "you are a helpfull assistant"
    PROMPT_STRING = f"Write a short summary in {language} of the following video:\n\n<<SUMMARY>>\n"
    messages = None
    
    video_id = get_video_id(vidUrl)
    if video_id == "Invalid YouTube link":
        return video_id
    
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    formatter = TextFormatter()
    transcript = formatter.format_transcript(transcript)
    video_length = len(transcript)
    chunk_size = 4000 if video_length >= 25000 else 2000
    chunks = textwrap.wrap(transcript, chunk_size)
    summaries = list()

    for chunk in chunks:
        prompt = PROMPT_STRING.replace("<<SUMMARY>>", chunk)
        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
        response = client.chat.completions.create(model=model, messages=messages)
        summary = re.sub("\s+", " ", response.choices[0].message.content.strip())
        summaries.append(summary)
    chunk_summaries = " ".join(summaries)
    if userinput == 'longv':
        return chunk_summaries
    prompt = PROMPT_STRING.replace("<<SUMMARY>>", chunk_summaries)
    messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
    
    return messages, "filename"

def get_video_id(youtube_link):
    # Define a regular expression pattern to match the video ID
    pattern = r"(?:v=|v\/|vi=|vi\/|youtu.be\/|embed\/|\/v\/|youtu\.be\/|\/e\/|youtu\.be\/|v=|v%3D|youtube.com\/watch\?v=|%2Fvideos%2F|embed%\S+|youtu.be%2F|ytscreen.com\/\?video=|youtube.com\/embed\/)([^#?\&\n]*)"
    # Search for the video ID in the YouTube link using the regular expression pattern
    match = re.search(pattern, youtube_link)
    if match:
        # Extract the video ID from the match object
        video_id = match.group(1)
        return video_id
    else:
        return "Invalid YouTube link"

def generate_quiz(summary, num_questions, quiz_type, language="English"):
    prompt = f"{summary}\n\nBased on the above summary, generate a {quiz_type} quiz with {num_questions} questions.\n\nMake sure to not provide the answers just the questions for the quiz \n\nstart your message with '{quiz_type} quiz:', your response should be in {language}"
    response = aicomplete(prompt, filename='dontsave')
    return response

def get_quiz(vidUrl, num_questions, quiz_type, language="english"):
    messages = None
    video_id = get_video_id(vidUrl)
    if video_id == "Invalid YouTube link":
        return video_id
    
    transcript = YouTubeTranscriptApi.get_transcript(video_id)
    summary = ""
    for segment in transcript:
        summary = summary + segment
    prompt = """
        You are a quiz generator. I will give you some information about examination, then you should generate different quiz problems and answers based on these information.
        
        Quiz type: {type}
        User Prompt: {prompt}
        Number of questions: {num}
        Language: {language}

        Based on these information, your answer should be as follow format:
        problem number, problem
        answer

        When the Quiz type is multiple choice, the answer has several candidates and only the one candidate should be correct and others are incorrect.
        When the Quiz type is short answer, you don't need generate multiple choice answer, only answer shortly.
        When the Quiz type is true or false, you should generate true or false quiz.
        The problems should be different type.
        And the language of your response should be {language}.
    """.format(type=quiz_type, prompt=summary, num=num_questions, language=language)
    messages = [
            # {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
    return messages, "filename"
