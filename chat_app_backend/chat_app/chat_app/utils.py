import os
# Configura OLLAMA_BASE_URL desde la variable de entorno OLLAMA_HOST, o usa valor por defecto
os.environ["OLLAMA_BASE_URL"] = os.environ.get("OLLAMA_HOST", "http://127.0.0.1:11434")

import os

# ChatBot imports
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing_extensions import Annotated, TypedDict
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, StateGraph
from langchain.chat_models import init_chat_model
from langchain_core.messages import HumanMessage
from typing import Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from typing_extensions import Annotated, TypedDict
from chats.models import Chat, ChatParticipant

# RAG imports
from langchain_ollama.llms import OllamaLLM
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

from channels.db import database_sync_to_async


class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    language: str

class ChatBot:

    def __init__(self, thread_id: str, language: str = "English"):
        # model: llama3.2 by ollama
        self.model = init_chat_model("llama3.2", model_provider="ollama")
        # name of the thread 
        self.thread_id = thread_id
        # language of the conversation
        self.language = language
        # prompt template
        self.prompt_template = ChatPromptTemplate.from_messages(
            [
            (
                "system",
                "You talk like a kind artificial assistant. You are a helpful assistant. You try to respond to every question with helpful information. Answer all questions to the best of your ability in {language}.",
                ),
                MessagesPlaceholder(variable_name="messages"),
            ]
        )

        workflow = StateGraph(state_schema=State)

        workflow.add_edge(START, "model")
        workflow.add_node("model", self._call_model)
        # workflow.add_edge("model", END)
        
        self.memory = MemorySaver()
        self.app = workflow.compile(checkpointer=self.memory)


    def _call_model(self, state: State):
        prompt = self.prompt_template.invoke(state)
        response = self.model.invoke(prompt)
        return {"messages": [response]}
    
    # async def call_model(state: MessagesState):
        # response = await model.ainvoke(state["messages"])
        # return {"messages": response}

    def answer(self, question: str) -> str:
        messages = []
        messages = messages + [HumanMessage(question)]
        result = self.app.invoke(
            {"messages": messages, "language": self.language}, 
            {"configurable": {"thread_id": self.thread_id}}
        )
        response = result["messages"][-1].content
        return response



class RagBot:
    def __init__(self, model_name="llama3.2", embed_model="mxbai-embed-large", db_location="./chrome_langchain_db"):
        # LLM and prompt
        self.model = OllamaLLM(model=model_name, base_url="http://ollama:11434")
        self.template = """
            You are an assistant that answers questions based on the provided context. The context is about files and documents.
            You should answer based in the context and you don't try to invent false information. If you can't answer the question, you retrive a response saying that you don't have the information to answer that.

            Context:
            {context}

            Question: {question}

            Answer:
        """
        self.prompt = ChatPromptTemplate.from_template(self.template)
        self.chain = self.prompt | self.model
        self.db_location = db_location
        self.embeddings = OllamaEmbeddings(model=embed_model, base_url="http://ollama:11434")
        self.vector_store = None
        self.retriever = None
        self.documents = []
        self.texts = []

    def load_pdfs(self, pdf_files):
        add_documents = not os.path.exists(self.db_location)
        print(f"add_documents: {add_documents}")
        if add_documents:
            documents = []
            ids = []
            for i, pdf_file in enumerate(pdf_files):
                print(f'Path: {os.path.abspath("pdfs/" + pdf_file)} - exists: {os.path.exists("pdfs/" + pdf_file)}')
                if os.path.exists('pdfs/' + pdf_file):
                    loader = PyPDFLoader('pdfs/' + pdf_file)
                    loaded = loader.load()
                    documents.extend(loaded)
                    ids.append(i)
                    print(f"Loaded {pdf_file}: {len(loaded)} pages")
                else:
                    print(f"File not found: {pdf_file}")
            print(f"Total pages of documents loaded: {len(documents)}")
            self.documents = documents
            self.split_loaded_documents()
        else:
            print("Documents already loaded")
            self.documents = []
        self.store_chunks()
        return self.documents

    def split_loaded_documents(self):
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        self.texts = text_splitter.split_documents(self.documents)
        # print(f"Total text chunks created: {len(self.texts)}")
        return self.texts

    def store_chunks(self):
        self.vector_store = Chroma(
            collection_name="pdf_seeker",
            persist_directory=self.db_location,
            embedding_function=self.embeddings
        )
        if self.documents:
            self.vector_store.add_documents(documents=self.documents)
        self.retriever = self.vector_store.as_retriever()

    def ask(self, question):
        if not self.retriever:
            raise Exception("Retriever not initialized. Call store_chunks() first.")
        search = self.retriever.invoke(question)
        context = "\n\n".join([doc.page_content for doc in search])
        result = self.chain.invoke({"context": context, "question": question})
        return result

    def interactive(self):
        while True:
            question = input("Enter your question (q to quit): ")
            if question.lower() in ["exit", "quit", "q"]:
                break
            print(self.ask(question))

    def select_pdf(self):
        pdf_dir = "pdfs"
        pdf_files = [f for f in os.listdir(pdf_dir) if f.endswith('.pdf')]
        print("Available PDF files:")
        for idx, pdf_file in enumerate(pdf_files):
            print(f"{idx}: {pdf_file}")
        selected_indices = input("Enter the indices of the PDF files to load (comma-separated): ")
        selected_indices = [int(idx.strip()) for idx in selected_indices.split(',')]
        selected_pdfs = [pdf_files[idx] for idx in selected_indices if 0 <= idx < len(pdf_files)]
        self.load_pdfs(selected_pdfs)
        print(f"Selected PDFs: {selected_pdfs}")

@database_sync_to_async
def is_bot_chat(chat: int) -> bool:
    chat = Chat.objects.get(pk=chat)
    if chat is not None:
        participants = ChatParticipant.objects.filter(chat=chat)
        for participant in participants:
            if participant.user.username == "bot":
                return True
    return False


