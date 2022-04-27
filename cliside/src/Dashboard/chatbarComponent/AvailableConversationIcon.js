import {ChatName,ListOfUsers} from "./chatname.js"

export const AvailableConversationTiles = ({index, conversation, chatchanger, chatName, usersinvolved, lastMessaged})=> {
    return <div key={index} data-chatid={conversation.chat_id} onClick={chatchanger} tabIndex={0}>{chatName ? <ChatName {...{ chatName }} /> : <ListOfUsers {...{ usersinvolved }} />}{/*displays chatname if there is one - otherwide it  shows array of recipients */}<span className='last_messaged'>Last Messaged:{lastMessaged}</span></div>;
}