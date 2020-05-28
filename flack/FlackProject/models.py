from datetime import datetime
class ChannelClass:
    def __init__(self, name, messages, c_user):
        self.name = name
        self.messages = messages
        self.c_user= c_user
    def toJson(self):
        dic = {'messages':[], 'users':[]}
        for message in self.messages:
            dic['messages'].append(message.toJson())
        for user in self.c_user:
            dic['users'].append(user)
        return dic

class Message:
    def __init__(self, body, username, time):
        self.body = body
        self.username = username
        self.time = time
    def toJson(self):
        dic = {'body': self.body, 'username': self.username, 'time':self.time}
        return dic
        
msg1= Message('hi every one', 'lenhat', datetime.now().strftime("%Y-%m-%d %H:%M"))
msg2= Message('hello, long time to see', 'lenhat123', datetime.now().strftime("%Y-%m-%d %H:%M"))
channel1 = ChannelClass('BBC channel', [], [])
channel1.messages.append(msg1)
channel1.messages.append(msg2)

msg3= Message('Good evening!!', 'Alex Stephen', datetime.now().strftime("%Y-%m-%d %H:%M"))
msg4= Message('How are you guys', 'lenhat123', datetime.now().strftime("%Y-%m-%d %H:%M"))
channel2 = ChannelClass('ABC channel', [], [])
channel2.messages.append(msg3)
channel2.messages.append(msg4)
db = {'list':{channel1.name:channel1.toJson(), channel2.name:channel2.toJson()}}