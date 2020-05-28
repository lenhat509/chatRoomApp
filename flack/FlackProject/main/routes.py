from flask import Blueprint, request, redirect, render_template, url_for, jsonify, flash, abort
from FlackProject.models import ChannelClass, Message, db
from FlackProject import socketio
from flask_socketio import emit, leave_room, join_room
import json
from datetime import datetime

main = Blueprint('main', __name__)

@main.route('/', methods=["GET"])
def home():
    return render_template('home.html')

@main.route('/register', methods=["GET","POST"])
def register():
    return render_template('register.html')

@main.route('/<string:channel_name>', methods=["GET"])
def to_channel(channel_name):
    channelList = []
    messages = None
    if not db['list'].get(channel_name):
        abort(404)
    for channel in db['list']:
        channelList.append(channel)
    return render_template('flack.html', channelList = channelList, channel = channel_name)

@main.route('/messages', methods=["GET", "POST"])
def messages():
    channel = request.get_data(cache=False).decode('utf-8')
    return jsonify(db['list'][channel])

@socketio.on('new channel')
def new_channel(data):
    channelname = data['channel']
    if db['list'].get(channelname) is None:
        channel = ChannelClass(channelname, [], [])
        db['list'][channelname] = channel.toJson()
        emit('add channel', {'success': True, 'name': channelname}, broadcast=True)
    else:
        emit('add channel', {'success': False}, broadcast=True)

@socketio.on('new message')
def new_message(data):
    msg = Message(data['body'], data['username'], datetime.now().strftime("%Y-%m-%d %H:%M"))
    data['time'] = msg.time
    mList = db['list'][data['channel']]['messages']
    mList.append(msg.toJson())
    if len(mList)>100:
        for i in range(len(mList) - 100):
            mList.remove(mList[0])
    room = data['channel']
    emit('add message', data, room = room)

@socketio.on('join')
def join(data):
    room = data['channel']
    data['stillIn'] = False
    if data['username'] in db['list'][room]['users']:
        data['stillIn'] = True
    db['list'][room]['users'].append(data['username'])
    join_room(room)
    emit ('join announce', data, room = room)

@socketio.on('leave')
def leave(data):
    room = data['channel']
    db['list'][room]['users'].remove(data['username'])
    leave_room(room)
    data['stillIn'] = False
    if data['username'] in db['list'][room]['users']:
        data['stillIn'] = True
    emit('leave announce', data, room = room)
          