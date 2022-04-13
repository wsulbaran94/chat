module.exports = {
    MONGO_URI: (process.env.NODE_ENV === 'production') ? 
        process.env.DB_URI : "mongodb+srv://wans:aILbyjJwmhRVmEKE@cluster0.8l4h4.mongodb.net/chatDb?retryWrites=true&w=majority",
    JWT_SECRET:"m5XaAedwLg",
    API_PORT:4000
}