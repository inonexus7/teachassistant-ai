from flask import Flask, render_template, jsonify, request, send_file, Response
import config
import lessonplannerapi
import quizapi
import math_quiz
import math_lesson
import grade_essay
import ytgpt
import aipresentation
import lesson_comp
from detect_ai import detect_ai, check_plag
from gptutils import get_title
import json
from openai import OpenAI
from getReport import genReport
from creHomework import creHomework
from creTest import createTest
from icebreakerIdeas import icebreaker_Ideas
from getESLActivity import genESLActivity
from getAdditionalAnswer import genAdditionalAns
import translators as tl
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from docx import Document
from pptx import Presentation
import json
from getQuizFromFile import genQuizFromFile
from flask_cors import CORS
from lessonplannerapi import get_links
import jwt
import datetime
import time
from pymongo import MongoClient
import stripe

def page_not_found(e):
  return render_template('404.html'), 404


app = Flask(__name__)
CORS(app)
app.config.from_object(config.config['development'])

app.register_error_handler(404, page_not_found)

stripe.api_key = config.DevelopmentConfig.STRIPE_SECRET_KEY
client = OpenAI(api_key=config.DevelopmentConfig.OPENAI_KEY)
site_url = config.DevelopmentConfig.SITE_URL
webhook_url = config.DevelopmentConfig.WEBHOOK_ENDPOINT

# connect to mongodb
mongo_client = MongoClient(host="mongodb://127.0.0.1", port=27017)
db = mongo_client['assistman']

def createWebhookEndpoints():
    try:
        stripe.WebhookEndpoint.create(url=webhook_url, enabled_events=[
            '*'
        ])
    except Exception as ex:
        print(ex)

def authenticate(request):
    # Retrieve the JWT token from the 'Authorization' header
    auth_header = request.headers.get('Authorization')
    if auth_header:
        # Typically the header will be in the format "Bearer token_here"
        # So, you need to split by space to get the token part
        try:
            token = auth_header.split(' ')[1]
            # Decode the token
            # You need to provide the 'secret' key used to encode the JWT
            # Ensure to catch exceptions that may occur during token decoding
            payload = jwt.decode(token, config.DevelopmentConfig.JWT_SECRET, algorithms=["HS256"])
            user_collection = db['users']
            user = user_collection.find_one({ "email": payload['email'] })
            if user:
                return payload
            else:
                return Response("There is no such user", status=401)
        except jwt.ExpiredSignatureError:
            return Response("Token has expired", status=401)
        except (jwt.InvalidTokenError, Exception) as e:
            return Response("Invalid token", status=401)
    else:
        return Response('No Authorization Header Found', status=401)

def send_messages(messages, model):
    return client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True
    )

def event_stream(messages, filename, reqLink=None):
    model = 'gpt-3.5-turbo'
    if reqLink is not None:
        model = 'gpt-4o'
    for line in send_messages(messages=messages, model=model):
        #print(line)
        text = line.choices[0].delta.content
        if text is not None and len(text): 
            yield text

@app.route('/updatingChatHistory', methods=['POST'])
def updatingChatHistory():
    body = request.get_json()
    user_email = body['email']
    chat_collection = db['chat']
    chat_history = chat_collection.find_one({ 'email': user_email })
    if chat_history is None:
        return Response("Register and try to login again", status=500)
    if chat_history['plan'] == "Free":
        if chat_history['current'] + 1 > chat_history['limit']:
            return jsonify({"msg": "You exceeded the limit!"}), 431
        else:
            chat_collection.update_one({ 'email': user_email }, { '$inc': { 'current': 1 } })
    else:
        lastUpdate_str = chat_history['lastUpdate']
        lastUpdate = datetime.date(int(lastUpdate_str.split('-')[0]), int(lastUpdate_str.split('-')[1]), int(lastUpdate_str.split('-')[2]))
        today = datetime.date.today()
        if today > lastUpdate:
            return jsonify({"msg": "you should pay now!"}), 432
        else:
            if chat_history['current'] + 1 > chat_history['limit']:
                return jsonify({"msg": "You exceeded the limit!"}), 431
            else:
                chat_collection.update_one({ 'email': user_email }, { '$inc': { 'current': 1 } })
    return jsonify({"msg": "success!"}), 200

@app.route('/chatbot/lessonplanner', methods = ['GET', 'POST'])
def lessonplanner():
    # authenciate
    token = authenticate(request)
    body = request.get_json()

    print('Here is your Data: ', body)

    data = body['prompt']
    language = body['language']
    question = str(data)

    messages, filename, links = lessonplannerapi.plan_lessons_chat(question, language)
    
    return Response(event_stream(messages, filename, links), mimetype='text/event-stream')

@app.route('/lessonplanner/chat', methods = ['GET', 'POST'])
def lessonplannerChat():
    token = authenticate(request)
    data = request.get_json()

    print('Here is your Data: ', data)

    conversation_id = data['conversation_id']
    user_id = data['user_id']

    data = data['prompt']
    content = data['content']
    language = data['language']
    question = str(data)

    messages, filename, links = lessonplannerapi.plan_lessons_chat_followup(question, content, user_id,conversation_id, language)
    
    return Response(event_stream(messages, filename, links), mimetype='text/event-stream')

@app.route('/chatbot/quiz', methods = ['POST'])
def quiz():
    token = authenticate(request)
    data = request.get_json()

    print(data)
    data = data['prompt']

    grade = data['grade']
    quiz_topic = data['topic']
    subject = data['subject']
    summary = data['summaryLearningObjectives']
    quiz_type = data['quizType']
    qn = data['numberOfQuestions']
    language = data['lang']
    user_input = f"Grade: {grade}, subject: {subject}, topic: {quiz_topic}, type: {quiz_type}, note: {summary}, number of questions: {qn}"
    res = {}
    #res['quiz'] = quizapi.generate_quiz(user_input, user_id, conversation_id, language)
    #return jsonify(res), 200
    messages, filename = quizapi.generate_quiz(user_input, language)
    return Response(event_stream(messages, filename), mimetype='text/event-stream')

@app.route('/chatbot/gradeEssay', methods = ['POST'])
def grade():
    token = authenticate(request)
    data = request.get_json()
    print(data)
    data = data['prompt']
    if isinstance(data, str):
        data = json.loads(data)
            
    language = data['lang']
    user_input = data
    messages, filename = grade_essay.grade(user_input, language)
    return Response(event_stream(messages, filename), mimetype='text/event-stream')

@app.route("/chatbot/mathquiz/gen", methods=["POST"])
def gen_quiz():
    token = authenticate(request)
    data = request.get_json()

    data = data["prompt"]
    language = data['lang']
    mathproblem = data["problem"]
    multiple = data["quizType"]
    num = data["numberOfQuestions"]
    messages, filename = math_quiz.generate_quiz(mathproblem, multiple, language, num)
    return Response(event_stream(messages, filename), mimetype='text/event-stream')

@app.route("/mathquiz/answer", methods=["POST"])
def answers():
    token = authenticate(request)
    data = request.get_json()
    user_id = data['user_id']
    conversation_id = data['conversation_id']
    data = data['prompt']['body']
    language = data['language']
    messages, filename = math_quiz.reveal_answers(user_id, conversation_id, language)
    return Response(event_stream(messages, filename), mimetype='text/event-stream')

@app.route('/chatbot/math/lesson', methods = ['POST'])
def lesson():
    token = authenticate(request)
    data = request.get_json()

    print(data)
    data = data['prompt']
    question = data
    language = data['lang']

    messages, filename, links = math_lesson.plan_lessons_chat(question, language)
    return Response(event_stream(messages, filename, links), mimetype='text/event-stream')

@app.route('/chatbot/video/summarize', methods = ['POST'])
def summarizevid():
    token = authenticate(request)
    data = request.get_json()
    print('Recieved Data: ', data)
    data = data['prompt']
    url =  data['videoUrl']
    language = data['lang']
    messages, filename = ytgpt.summarize(url, language)
    return Response(event_stream(messages, filename), mimetype='text/event-stream')

@app.route('/chatbot/video/quiz', methods = ['POST'])
def videoquiz():
    token = authenticate(request)
    data = request.get_json()
    print('Recieved Data: ', data)
    
    data = data['prompt']
    vidUrl =  data['videoUrl']
    num_questions =  data['numberOfQuestions']
    quiz_type =  data['quizType']
    language = data['lang']

    messages, filename = ytgpt.get_quiz(vidUrl, num_questions, quiz_type, language)
    return Response(event_stream(messages, filename, True), mimetype='text/event-stream')

@app.route('/chatbot/detectai', methods = ['POST'])
def aidetect():
  token = authenticate(request)
  data = request.get_json()
#   print('Recieved Data: ', data)
  data = data['body']
  text = data['content']
  res = {}
  res['answer'] = detect_ai(text)
  print(res)
  return jsonify(res), 200

@app.route('/chatbot/plagirism', methods = ['POST'])
def plagiarism():
  token = authenticate(request)
  data = request.get_json()
#   print('Recieved Data: ', data)
  data = data['body']
  text = data['content']

  res = {}
  res['answer'] = check_plag(text)
  print(res)
  return jsonify(res), 200

@app.route('/chatbot/powerpoint', methods = ['POST'])
def powerpoint():
    token = authenticate(request)
    data = request.get_json()

    description = data['prompt']['description']
    presenter = data['prompt']['presenter']
    title = data['prompt']['title'].upper()
    number_of_slides = int(data['prompt']['number_of_slides'])
    insert_image = data['prompt']['insert_image']
    isImage = True
    language = data['prompt']['lang']
    
    res = {}
    file_path = aipresentation.get_presentation(description, title, presenter, number_of_slides, insert_image, isImage, language)
    res['presentation_link'] = f"{file_path}"
    return jsonify(res), 200

@app.route('/GeneratedPresentations/<path:path>')
def send_generated_image(path):
    return send_file(f'GeneratedPresentations/{path}.pptx', as_attachment=True)

@app.route('/chatbot/report/answer', methods=['POST'])
def generateReport():
    token = authenticate(request)
    body = request.get_json()
    try:
        response = Response(event_stream(genReport(body['prompt']), "filename"), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!")
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/chatbot/esl/answer', methods=['POST'])
def generateESL():
    token = authenticate(request)
    body = request.get_json()
    try:
        response = Response(event_stream(genESLActivity(body['prompt']), filename="filename"), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!")
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/chatbot/docurl/quiz', methods=['POST'])
def generateGenQuizFromFile():
    token = authenticate(request)
    # Check if the 'file' key is in the request.files dictionary
    body = request.get_json()
    data = body['prompt']
    text = ''
    if 'url' in data:
        url = data['url']
        options = Options()
        options.add_argument('--headless')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-dev-shm-usage')
        driver = webdriver.Chrome(options=options)
        driver.get(url) #https://app.intotheblock.com/category/all?end_offset=20
        time.sleep(3)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        text = soup.get_text()
        # browser = mechanicalsoup.StatefulBrowser()
        # browser.open(url)
        # text = browser.page
        text = str(text)
        text = text[: 10000]
        tokens = text.split(' ')
        if len(tokens) > 4000:
            text = " ".join(tokens[: 4000])
    else:
        text = data['text']
        if len(text) > 90000:
            return jsonify({'msg': 'error!'}), 404
    try:
        response = Response(event_stream(genQuizFromFile(data, text), "filename"), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!", ex)
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/quiz/analyze', methods=['POST'])
def generateAddtionalAnswer_1():
    token = authenticate(request)
    body = request.get_json()
    user_id = body['user_id']
    conversation_id = body['conversation_id']
    question = body['prompt']['prompt']
    oldAnswer = body['prompt']['original'][0]['answer']
    language = body['prompt']['language']
    print(question)
    # oldAnswer = body['realAnswer']
    try:
        response = Response(genAdditionalAns(question=question, oldAnswer=oldAnswer, language=language), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!")
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/translate', methods=['POST'])
def translateWithGoogle():
    token = authenticate(request)
    body = request.get_json()
    lang = body['currentLang']
    text = body['answer']
    result = []
    print(text)
    for item in text:
        subrlt = {}
        for key in item.keys():
            trans = tl.translate_text(item[key], 'google', to_language=lang)
            rlt = { key: trans }
            subrlt = { **subrlt, **rlt }
        result.append(subrlt)
    print('====================== result =======================')
    print(result)
    print('lang to: ', lang)
    return jsonify({'text': result})

@app.route('/chatbot/homework/creator', methods=['POST'])
def createHomework():
    token = authenticate(request)
    body = request.get_json()
    try:
        response = Response(event_stream(creHomework(body['prompt']), "filename"), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!")
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/chatbot/test/creator', methods=['POST'])
def creTest():
    token = authenticate(request)
    body = request.get_json()
    try:
        response = Response(event_stream(createTest(body['prompt']), "filename"), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!")
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/chatbot/icebreaker/ideas', methods=['POST'])
def icebreakerIdeas():
    token = authenticate(request)
    body = request.get_json()
    try:
        response = Response(event_stream(icebreaker_Ideas(body['prompt']), "filename"), mimetype='text/event-stream')
        response.headers.add('Access-Control-Allow-Origin', '*')
    except Exception as ex:
        print("Can't bring data from openai server!")
        return 'Sorry. please ask me again after one minutes'
    return response

@app.route('/api/v1/auth/login', methods=['POST'])
def signinUser():
    body = request.get_json()
    try:
        email = body['email']
        password = body['password']
        user_collection = db['users']
        person = user_collection.find_one({ 'email': email, 'password': password })

        if person:
            payload = {
                'name': person['fullname'],
                'email': person['email']
            }
            token = jwt.encode(payload, config.DevelopmentConfig.JWT_SECRET, algorithm='HS256')
            chat_collection = db['chat']
            chat_history = chat_collection.find_one({ 'email': email })
            if chat_history is None:
                return Response("Register and try to login again", status=500)

            result = {
                'token': token,
                'user': payload,
                'current': chat_history['current'],
                'limit': chat_history['limit'],
                'plan': chat_history['plan']
            }

            return jsonify({ 'result': result }), 200
        else:
            return jsonify({ 'msg': 'there is no such person' }), 424
    except Exception as ex:
        print("Raised an error!", ex)
        return Response("Server Error!", status=500)

@app.route('/api/v1/auth/register', methods=['POST'])
def signupUser():
    try:
        body = request.get_json()
        name = body['name']
        email = body['email']
        password = body['password']
        addr = body['addr']
        phone = body['phone']

        if len(name.strip()) == 0 or len(password) < 8 or len(email) == 0:
            return Response("Invalid value", status=414)
        
        # checking the new user and insert one.
        user_collection = db['users']
        chat_collection = db['chat']
        person = user_collection.find_one({ "email": email})

        if person is not None:
            print("The user who has the email already exists.")
            return Response("Already exist!", status=414)
        else:
            # return jsonify({'result', 'result'})
            result = user_collection.insert_one({'fullname': name, 'email': email, 'password': password, 'addr': addr, 'phone': phone})
            current_date = datetime.date.today()
            chat = chat_collection.insert_one({ 'email': email, 'plan': 'Free', 'current': 0, 'limit': 5, 'lastUpdate': f"{current_date.year}-{current_date.month}-{current_date.day}" })
            return jsonify({ "result": "inserted" }), 200
    except Exception as ex:
        print("Unknown error!")
        print(ex)
        return Response("Server error!", status=500)

@app.route("/getUserState", methods=['POST'])
def getUserState():
    body = request.get_json()
    token = body['token']
    payload = jwt.decode(token, config.DevelopmentConfig.JWT_SECRET, algorithms=["HS256"])
    user_collection = db['chat']
    chat = user_collection.find_one({ 'email': payload['email'] })
    if chat is not None:
        return jsonify({ "plan": chat['plan'], "chat": { "current": chat['current'], "limit": chat['limit'] } }), 200
    else:
        return jsonify({ "msg": "error" }), 414

@app.route("/upgradingPlan", methods=['POST'])
def upgradingPlan():
    body = request.get_json()
    plan = body['plan']
    email = body['email']
    customer = stripe.Customer.create(metadata={
        'plan': json.dumps(plan),
        'email': email
    })
    try:
        session = stripe.checkout.Session.create(
            customer=customer.id,
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": 999,
                    "product_data": {
                        "name": plan['title']
                    }
                },
                "quantity": 1
            }],
            payment_method_types=['card'],
            mode="payment",
            success_url=f"{site_url}/success",
            cancel_url=f"{site_url}/cancel"
        )
        return jsonify({ "payUrl": session.url }), 200
    except Exception as ex:
        print(ex)
        return jsonify({ "msg": "error!" }), 500

@app.route("/api/stripe/webhook", methods=['POST'])
def processWebhook():
    event = request.get_json()
    eType = event['type']
    
    if eType == 'invoice.payment_succeeded':
        print("invoice.payment_succeeded")
        dataObject = event['data']['object']
        if dataObject['billing_reason'] == 'subscription_create':
            subscription_id = dataObject['subscription']
            payment_intent_id = dataObject['payment_intent']
            
            print(f"subscription id: {subscription_id}")
    elif eType == 'invoice.finalized':
        print("invoice.finalized")
    elif eType == 'invoice.payment_failed':
        print('invoice.payment_failed')
    elif eType == 'customer.subscription.deleted':
        print("customer.subscription.deleted")
    elif eType == 'payment_intent.succeeded':
        print("payment_intent.succeeded")
    elif eType == 'payment_method.attached':
        print("payment_method.attached")
    elif eType == 'checkout.session.completed': 
        print('checkout.session.completed')
        checkoutSessionCompleted = event['data']['object']
        customer = stripe.Customer.retrieve(checkoutSessionCompleted['customer'])
        user_email = customer.metadata['email']
        plan = json.loads(customer.metadata['plan'])
        print("customer email: ", user_email)
        print("customer plan: ", plan)
        
        current = 0
        limit = 0
        if plan['title'] == 'Starter':
            current = 0
            limit = 20
        elif plan['title'] == 'Professional':
            current = 0
            limit = 50
        else:
            current = 0
            limit = 5
        
        current_date = datetime.date.today()
        chat_collection = db['chat']
        updated_plan = chat_collection.update_one({ "email": user_email }, { "$set": { "plan": plan['title'], "current": current, "limit": limit, 'lastUpdate': f"{current_date.year}-{current_date.month}-{current_date.day}" } })
        print(f"Server upgraded your plan with {plan['title']}")
    else:
        print("specific event: ", eType)

    return jsonify({ "received": True }), 200

if __name__ == '__main__':
    createWebhookEndpoints()
    app.run(debug=False, host='0.0.0.0', port='5000')
