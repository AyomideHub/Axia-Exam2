require('dotenv').config()
const express = require('express')
const connectdb = require('./db/connectdb')
const cookieParser = require('cookie-parser')
const UserRoute = require('./routes/user.route')
const PostRoute = require('./routes/post.route')
const notFound = require('./middlewares/NotFouind')


const app = express()

// middleware
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


// routes
app.get('/', (req, res) => {
	res.status(200).send('<h1> Hello world </h1>')
})

app.use('/api/v1/user', UserRoute)
app.use('/api/v1/post', PostRoute)



// error
app.use(notFound)


const port = process.env.PORT || 5000

const start = async () => {
	try {
		await connectdb(process.env.MONGO_LOCAL)
		app.listen(port, () => {
			console.log(`server is running on port ${port}`);
		})
	} catch (error) {
		console.log(error);
		
	}
}

start()