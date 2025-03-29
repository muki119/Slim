const ListOfUsers = ({usersInvolved})=>{
    return <>{usersInvolved && <p className='chatname'>{usersInvolved.map((users) => { return users + ' '; })}</p>}</> // displays all other users in chat
}

const ChatName = ({chatName})=>{
    return <p className='chatname'>{chatName}</p>  // displays chat name 
}

export {ChatName,ListOfUsers}