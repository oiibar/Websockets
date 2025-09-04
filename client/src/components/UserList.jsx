function UserList({users}) {
    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.username}>{user.username} — {user.status}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserList;