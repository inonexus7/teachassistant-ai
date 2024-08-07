
def icebreaker_Ideas(data):
    message = """
            You are a icebreaker idea generator. I will give you some information for generating icebreaker idea, then you should assist users, typically educators or administrators, in generating customized icebreaker idea from a given information.
            This report can cover various aspects, such as student performance, attendance, assessment results, or any data relevant to the user's needs.

            This is the information will be used for generating icebreaker ideas.            
            Grade level: {level}
            Subject: {subject}
            Goals/Objectives (For example focus on team building, communication skills, or introducing a new topic): {goals_objectives}
            Class Size: {class_size}
            Duration: {duration}
            Total Number of Ideas: {thenumideas}
            Materials/Resources (For example, they might have access to whiteboards, props, or technology): {materials_resources} 
            Preferred Style (icebreaker activity, such as games, discussions, role-playing, or creative exercises) : {preferred_style}
            Language: {language}

            The result format is as following without headings and paragraph number:
            1.Icebreaker Idea 
            content
            2.Icebreaker Idea 
            content...

            your result should have {thenumideas} icebreakers.
            And the language of your response should be {language}.
    """.format(level = data['grade'], subject = data['subject'], goals_objectives = data['goals/objectives'], class_size = data['class_Size'], duration = data['duration'], thenumideas = data['num_Ideas'], materials_resources = data['materials/resources'], preferred_style = data['preferredStyle'], language=data['lang'])
    
    messages = [{'role': 'user', 'content': message}]
    return messages