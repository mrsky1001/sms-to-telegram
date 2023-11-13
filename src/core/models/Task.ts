export default class Task {
    id: number
    chatId: string
    name?: string
    _keywords: string[]

    constructor(id: number, chatId: string, keywords: string[], name?: string) {
        this.id = id
        this.chatId = chatId
        this.name = name
        this._keywords = keywords?.filter((k) => k?.length > 0)
    }

    get keywords() {
        return this._keywords.filter((k) => k?.length > 0)
    }

    set keywords(value: string[]) {
        this._keywords = value
    }
}
