export interface ActivityLog {
    id: number
    title: string
    description: string
    date: Date
    user_id: number
    action_type: string
    action_name: string
    user: User
}

export interface User {
    id: number
    email: string
    name: string
    username: string
}