import request from "axios"


// PYTHON SERVER INSTANCE
export let instance = request.create({
            baseURL:"https://appreporting.herokuapp.com",
            headers:{}
        })