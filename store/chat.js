export const state = () => ({
    chat: {},
    messages: []
})
export const mutations = {
    add (state, text) {
        state.chat.push({
            text,
            done: false
        })
    },
    set (state, updateObj) {
        if (!state.chat[updateObj.prop]) {
            state.chat[updateObj.prop] = {}
        }
        state[updateObj.prop] = updateObj.value
    },
    remove (state, { todo }) {
        state.chat.splice(state.list.indexOf(todo), 1)
    },
    toggle (state, todo) {
        todo.done = !todo.done
    },
    addChatMessage (state, message) {
        state.messages.push(message)
    }
}
