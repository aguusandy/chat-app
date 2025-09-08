# 📩 Chat App 


This little project implements a real-time chat app using React and Django. 
Also, implement Websocket with redis-channel for the consuming of the messages in real time.

###

## Download and run it

1. Clone the repository

   ```bash
    git clone https://github.com/aguusandy/chat-app
   ```

2. Run the Docker

   ```bash
    cd chat-app
    docker compose up --build
   ```
###
## ✅ Recommendations
- #### Run the migrations
While the docker containers are running, open a terminal and run this command:
```
docker compose run backend python chat_app/manage.py migrate
```

- #### Create a superuser
It's recommended to create a superuser for the app, so you can use de 'admin' path. 
To create a **superuser** for the app, run the following command in a terminal:
```
docker compose run backend python chat_app/manage.py createsuperuser
```
###
## ⚙️ Libraries
- **ReactJS + Vite**
- **Django Rest Framework**
- **Redis-Channels**
- **SQLite**
- **Docker and Kubernets**
- **Langchain**
- **Ollama**

###
## 🛢️ Database Diagram
The next ER Diagram represents the tables used in this project.
With the objective of reducing the coding time, the SQLite was used as a predetermined database.
 <p align="center">
  <img src="https://github.com/aguusandy/chat-app/blob/master/imgs/der_chat_app.png" alt="DER" width="700"/>
</p>
### 

# 🤖 Chat Bot
This project also implements a chatbot using LLMs models. Keeping the structure of the Websocket consumer, the chatbot is implemented as a specific user 'bot'.

The migration **0001_create_bot_user.py** in the accounts app is crucial for the chatbot, because this migration creates the user that will be instanced in the ChatConsumer.  

If you run the command of the migration suggested en **Recommendations** it should work fine. If you didn't or the 0001 migration didn't pass, please run the following command.

```
docker compose run backend python chat_app/manage.py migrate accounts 0001
```

### ChatBot Class
The ChatBot Class is defined in chat_app/utils.py for easy access.
This class contains the LLM model and the thread_id (the same id of the chat_id). The base language is English, but it can be change by passing as an argument of the class. The prompt_template is quite simple, so it can be rewriten for the specific politics.

The chatbot was made it with Langchain and Ollama, because it was orientated for AI models running locally. But, if you have a key for Cloud AI, small changes in the code and the docker-compose should make it work.

The model used was **llama3.2** running on the localhost port **11434** and the ollama host is defined in the docker-compose.

#### Who works:
The ChatBot class is instanced if the 'bot' user was added to the chat. If a message if receive in the consumer, this message will be sent to the ChatBot. 

The message is used as the question, so the invoke function will return the answer of the AI model, and this answer creates another message in the chat.
