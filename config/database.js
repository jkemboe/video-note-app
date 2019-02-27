if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI:'mongodb://jkemboe:<commandme007!@~>@cluster0-shard-00-00-iqpul.mongodb.net:27017,cluster0-shard-00-01-iqpul.mongodb.net:27017,cluster0-shard-00-02-iqpul.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'}
} else {
    module.exports = {mongoURI: 'mongodb://localhost/video-dev'}
}