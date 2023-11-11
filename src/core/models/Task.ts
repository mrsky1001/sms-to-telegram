export default class Task {
    id: number
    chatId: string
    keywords: string[]

    constructor(id: number, chatId: string, keywords: string[]) {
        this.id = id
        this.chatId = chatId
        this.keywords = keywords
    }
}
