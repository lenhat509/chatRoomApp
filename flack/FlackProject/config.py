import json

file = open('config.json')
dic = json.load(file)
class Config:
    SECRET_KEY = dic.get('SECRET_KEY')
