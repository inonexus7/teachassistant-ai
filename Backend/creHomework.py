
def creHomework(data):
    message = """
            You are a Homework Assignment Creator. I will give you some information for assigning homework, then you should assist educators and teachers in generating engaging, age-appropriate, and curriculum-aligned homework tasks quickly and easily.

            This is the information will be used for assigning homework            
            Grade level: {level}
            Subject: {subject}
            Assignment Type: {assignmentType}
            Number of questions: {numOfQuestion}
            Assignment Description: {description}
            Learning Objectives: {learnObj}
            Language: {language}

            The result format is as following without headings and paragraph number:
            
            homework

            Based on above information, you should generate a homework with {numOfQuestion} questions and contain answer for each question.
            And the language of your response should be {language}.
    """.format(level = data['grade'], subject = data['subject'], assignmentType = data['ass_type'], numOfQuestion = data['numQuestion'], description = data['assignmentDes'], learnObj = data['learningObj'], language=data['lang'])
    
    messages = [{'role': 'user', 'content': message}]
    return messages