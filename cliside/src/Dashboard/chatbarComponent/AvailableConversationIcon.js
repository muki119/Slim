import {ChatName,ListOfUsers} from "./chatname.js"

export const AvailableConversationTiles = ({index, conversation, chatchanger, chatName, usersinvolved, lastMessaged})=> {
    return <div key={index} data-chatid={conversation.chat_id} onClick={chatchanger} tabIndex={0}>{chatName ? <ChatName {...{ chatName }} /> : <ListOfUsers {...{ usersinvolved }} />}<span className='last_messaged'>Last Messaged:{lastMessaged}</span></div>;
}