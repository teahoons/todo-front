import apiClient from "./api";

export default {
    login(username, password) {
        console.log('login')
        return apiClient.post('/auth/login', {
            username: username,
            password: password
        })
    },
    register(username, password) {
        return apiClient.post('/auth/register', {
            username: username,
            password: password,
            authority: 'USER'
        })
    }
}