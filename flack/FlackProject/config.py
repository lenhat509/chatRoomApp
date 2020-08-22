import json

#create your own config.json file that contain your SECRET_KEY
file = open('config.json')
dic = json.load(file)
class Config:
    SECRET_KEY = dic.get('SECRET_KEY')
