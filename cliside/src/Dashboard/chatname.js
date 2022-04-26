const ListOfUsers = ({usersinvolved})=>{
    return <p className='chatname'>{usersinvolved.map((users) => { return users + ' '; })}</p>;
}

const ChatName = ({chatName})=>{
    return <p className='chatname'>{chatName}</p>
}

export {ChatName,ListOfUsers}