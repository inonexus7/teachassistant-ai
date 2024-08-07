#!/usr/bin/env python3
from openai import OpenAI
import config
import json
import re
import os
import textwrap
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
from gptutils import create_chat_data
import moviepy.editor as mp 
import speech_recognition as sr
import datetime
import requests
from pytube import YouTube
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
    openai.api_key = config.DevelopmentConfig.OPENAI_KEY
    completion = openai.ChatCompletion()
    model = "gpt-3.5-turbo"
    system = "you are a helpfull assistant"
    messages = openhistory(filename)
    if messages:
        message= {"role": "user", "content": prompt}
        messages.append(message)
        response = completion.create(model=model, messages=messages)
    else:
        messages = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
        ]
        response = completion.create(model=model, messages=messages)
    message = response['choices'][0]['message']
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

def download_file(url, local_filename):
    # NOTE the stream=True parameter below
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_filename, 'wb') as f:
            for chunk in r.iter_content(chunk_size=8192): 
                # If you have chunk encoded response uncomment if
                # and set chunk_size parameter to None.
                #if chunk: 
                f.write(chunk)
    return local_filename

def download_youtube_video(url, output_path="."):
    try:
        # Create a YouTube object
        youtube = YouTube(url)

        # Get the highest resolution stream
        video_stream = youtube.streams.get_highest_resolution()

        # Download the video
        video_stream.download(output_path)

        print("Download complete!")

    except Exception as e:
        print(f"Error: {e}")

def get_all_files_in_folder(folder_path):
    file_list = []
    
    # Walk through the folder and its subdirectories
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            file_list.append(os.path.join(root, file))
            
    return file_list

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

def chatyoutube(vidUrl, user_id, prompt, language="english"):
    video_id = get_video_id(vidUrl)
    conversation_id = user_id+video_id
    filename = "ChatHistory/{}_{}.json".format(user_id, video_id)
    quiz = openhistory(filename)
    # summary = summarize(vidUrl, user_id, conversation_id, userinput = 'longv', language=language)
    video_path = f"Download_Videos/{user_id}_{datetime.datetime.now().timestamp()}"
    print('downloading video...')
    download_youtube_video(vidUrl, video_path)
    # Replace "your_folder_path" with the actual path of the folder you want to list files from
    files = get_all_files_in_folder(video_path)
    # download_file(vidUrl, '1_' + video_path)
    # Load the video 
    video_path = files[0]
    video = mp.VideoFileClip(video_path)
    print('save as audio file')
    # Extract the audio from the video
    audio_path = f"{user_id}_{datetime.datetime.now().timestamp()}.wav"
    if video.duration > 100:
        start_time = 0
        end_time = 100
        cliped_video = video.subclip(start_time, end_time)
        audio_file = cliped_video.audio
        audio_file.write_audiofile(audio_path)
    else:
        audio_file = video.audio 
        audio_file.write_audiofile(audio_path)
    openai.api_key = config.DevelopmentConfig.OPENAI_KEY
    audio_file= open(audio_path, "rb")
    transcript = openai.Audio.translate("whisper-1", audio_file)
    summary = transcript['text']
    if len(summary) > 8000:
        summary = summary[: 8000]
    if summary == "Invalid Video link":
        return summary
    if summary == "Invalid YouTube link":
        return summary
    if quiz == None:
        #quiz = get_quiz(vidUrl, user_id, conversation_id, '10', 'true/ false and multiple choice')
        #quiz  = quiz.replace('\n','<br>' )
        fprompt = f"This is a summary for a youtube video:\n\n{summary}\n\nprompt: {prompt}\n\nOnly answer the prompt if its related to the summary, respond in {language}"
    fprompt = f"{quiz}\n\nthis is a quiz for a youtube video, this is it's summary:\n\n{summary}\n\nprompt: {prompt}\n\nOnly answer the prompt if its related to the summary, and you should response wiht answers for each quiz question or problem, respond in {language}"
    messages = [
            {"role": "system", "content": "you are a helpfull assistant"},
            {"role": "user", "content": fprompt}
        ]
    return messages, filename
