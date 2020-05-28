import json

file = open('C:\\Users\\Le Nhat\\VSC project\\flack\\FlackProject\\config.json')
dic = json.load(file)
class Config:
    SECRET_KEY = dic.get('SECRET_KEY')