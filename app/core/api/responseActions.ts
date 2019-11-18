import { BadServerSalt } from 'app/core/mtproto/types/BadServerSalt';
import { MessageContainer } from 'app/core/mtproto/types/MessageContainer';
import { BadMsgNotification } from 'app/core/mtproto/types/BadMsgNotification';
import { MsgsAck } from 'app/core/mtproto/types/MsgsAck';
import { RpcResult } from 'app/core/mtproto/types/RpcResult';
import authStorage from 'app/core/services/AuthStorage'
import { invokeApi } from 'app/core/api/invokeApi'
import { uintToInt } from 'app/core/mtproto/sharedUtils'
import { NewSessionCreated } from 'app/core/mtproto/types/NewSessionCreated'
import { sentMessages } from 'app/core/api/messageQueue';
import ev from 'app/core/eventEmmiter';

export const actions = {};

export const ackIds = new Set();

function notify(msg) {
  const reply = sentMessages[msg.replyTo];
  if (reply) {
    reply.resolve(msg);
  }
}

// @ts-ignore
actions[BadServerSalt] = function(msg, opts) {
  msg = (msg instanceof ArrayBuffer) ? BadServerSalt.read(msg) : msg;

  authStorage.serverSalt = msg.new_server_salt;
  ackIds.add(msg.msg_id);
  
};


// @ts-ignore
actions[NewSessionCreated] = function(msg, opt) {
  msg = (msg instanceof ArrayBuffer) ? NewSessionCreated.read(msg) : msg;
  authStorage.serverSalt = msg.server_salt;
  ackIds.add(msg.msg_id);

  notify(msg);

  ev.emit('session-created');
}

// @ts-ignore
actions[MessageContainer] = function(buf, options) {
  const { messages } = MessageContainer.read(buf);

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const class_id = uintToInt(msg.msgType);
    ackIds.add(msg.msg_id);


    if ((actions as any)[class_id]) {
      (actions as any)[class_id](msg, options);
    } else {
      notify(msg);
    }
  }
}

// @ts-ignore
actions[BadMsgNotification] = function(msg) {
  msg = msg instanceof  ArrayBuffer ? BadMsgNotification.read(msg) : msg;
  ackIds.add(msg.msg_id);

  notify(msg);
}

// @ts-ignore
actions[MsgsAck] = function(msg, opts) {
  return msg instanceof  ArrayBuffer ? MsgsAck.read(msg) : msg;
}

// @ts-ignore
actions[RpcResult] = function(msg) {
  msg = (msg instanceof ArrayBuffer) ? RpcResult.read(msg) : msg;
  ackIds.add(msg.msg_id);

  notify(msg);
}