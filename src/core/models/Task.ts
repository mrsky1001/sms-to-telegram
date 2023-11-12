export default class Task {
    id: number
    chatId: string
    name?: string
    keywords: string[]

    constructor(id: number, chatId: string, keywords: string[], name?: string) {
        this.id = id
        this.chatId = chatId
        this.name = name
        this.keywords = keywords
    }
}
