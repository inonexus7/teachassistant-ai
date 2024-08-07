from openai import OpenAI
import config
import os
import json
from gptutils import create_chat_data

api_key = config.DevelopmentConfig.OPENAI_KEY
client = OpenAI(api_key=api_key)

history = []

def genReport(data):
    message = """
            You are a report generator. I will give you some information for generating report, then you should assist users, typically educators or administrators, in generating customized reports from a given information.
            This report can cover various aspects, such as student performance, attendance, assessment results, or any data relevant to the user's needs.

            This is the information will be used for generating report            
            Grade level: {level}
            Subject: {subject}
            Student Name: {student_name}
            Gender: {gender}
            Level of performance: {levelOfPerformance}
            Areas of improvement: {areas}
            Key accomplishments: {keys}
            Number of paragraphs: {numOfParag}
            Number of characteristics: {characters}
            Language: {language}

            The result format is as following without headings and paragraph number:
            'Report'
            content
        
            Based on above information, you should generate a report with {numOfParag} paragraphs and the answer is written by language - {language}.

    """.format(level = data['grade'], subject = data['subject'], student_name = data['std_name'], gender = data['gender'], levelOfPerformance = data['performance'], areas = data['area_improv'], keys = data['key_accompl'], numOfParag=data['num_pg'], language=data['lang'], characters=data['num_charaters'])

    messages = [{'role': 'user', 'content': message}]
    return messages