
def genQuizFromFile(data, text):
    message = """
            You are a quiz generator. I will give you some information for generating quiz, then you should generate different quiz problems and answers based on these information.
            You should respond with less than 4000 tokens.

            Number of questions: {numOfQuestion}
            Quiz Type: {quizType}
            Document: '{reference}'
            Language: {language}

            Based on these information, your answer should be as follow format:
            problem number, problem
            answer

            If content of Document is empty, all you have to do is response with 'Your document is empty. Please check your upload file.'.
            Otherwise, the answer has several candidates and only the one candidate should be correct and others are incorrect.
            And You should also generate only {numOfQuestion} problems

            In case of the Quiz Type is True or False, you should only generate a quiz that answer should be true or false.
            In case of the Quiz Type is Multi-choice, you should only generate a quiz that has several questions and only on answer.
            In case of the Quiz Type is Short Answer, you should only generate a quiz that has short answer question, it means that you don't need generate multiple choice answer, only answer shortly.
            
            And the response is written by language - {language}.
    """.format(numOfQuestion = data['ques_len'], quizType = data['quizType'], reference = text, language = data['lang'])
    # print("question: ", message)
    messages = [{'role': 'user', 'content': message}]
    return messages