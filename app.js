const redis = require("redis");
const express = require("express");
const bodyParser = require("body-parser");

const http = require("http");
const path = require("path");

const PORT = 8000;
const REDIS_KEY = "comments";

const app = express();
const redisClient = redis.createClient({ host: "192.168.99.100" });

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/bower", express.static(path.join(__dirname, "bower_components")));

app.route("/comments")
	.post((request, response) => 
	{
		addToDB(request.body, (err, reply) => 
		{
			if(err)
			{
				response.status(500).json({error: err});
			} else
			{
				response.status(200).json({result: "OK"});
			}
		});
	})
	.get((request, response) => 
	{
		redisClient.get(REDIS_KEY, (err, reply) => 
		{
			if(err)
			{
				response.status(500).json({error: err})
			}
			else
			{
				response.json(JSON.parse(reply));
			}
		});	
	});

function addToDB(comment, callback)
{
	redisClient.get(REDIS_KEY, (err, reply) => 
	{
		const comments = JSON.parse(reply);
		comments.push(comment);
		redisClient.set(REDIS_KEY, JSON.stringify(comments), callback)
	});
}

redisClient.on("ready", () => 
{
	console.log("Redis client is READY.");

	redisClient.get(REDIS_KEY, (err, reply) => 
	{
		if(!reply)
		{
			redisClient.set(REDIS_KEY, JSON.stringify([]), listen);
			console.log(REDIS_KEY + ` entry created in Redis database`);
		} 
		else
		{
			console.log(REDIS_KEY + ` entry already exists in Redis database`);
			listen();
		}
	});

	function listen()
	{
		http.createServer(app)
			.listen(PORT, () => console.log("The server is listening to port: " + PORT));
	}

});

redisClient.on("error", console.error);
