import streamlit as st
from weather import get_weather, get_coordinates, get_soil_moisture
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import AIMessage, HumanMessage
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Groq model name and API key
llm = ChatGroq(model="Llama-3.3-70b-Versatile", api_key=os.getenv("GROQ_API_KEY"))

# Initialize chat history
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = ChatMessageHistory()

# Define the prompt template
prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a weather analysis assistant that provides detailed insights using real-time weather data.
    Focus STRICTLY on the data provided and avoid any assumptions or generalizations. Do not answer any other questions. POLITELY REDIRECT THOSE QUESTIONS. Analyze the following aspects:
    1. Current weather conditions and description
    2. Temperature analysis (actual vs feels like)
    3. Humidity levels and implications
    4. Wind speed and its effects
    5. Soil moisture conditions and agricultural implications
    Provide specific analysis based on the provided weather data.
    I WANT YOU TO PRESENT THE OUTPUT IN A KEY VALUE FORMAT"""),
    ("human", """Analyze the following weather data for {location}:
    Location Details:
    {coordinates}
    Weather Information:
    {weather_info}
    Soil Conditions:
    {soil_moisture}
    Please provide a comprehensive analysis of these conditions."""),
    MessagesPlaceholder(variable_name="chat_history"),
])

chain = prompt | llm | StrOutputParser()

def process_weather_query(location):
    """Process weather data for a given location"""
    try:
        # Get API keys from environment variables
        google_maps_token = os.getenv("google_maps_token")
        openweather_api_key = os.getenv("openweather_api_key")

        # Get coordinates
        coordinates = get_coordinates(location, google_maps_token)
        if not coordinates:
            return "Could not get coordinates for this location."

        # Get weather data
        weather_info = get_weather(coordinates[0], coordinates[1], openweather_api_key)

        # Get soil moisture
        soil_moisture = get_soil_moisture(coordinates[0], coordinates[1])

        return {
            "location": location,
            "coordinates": f"({coordinates[0]}, {coordinates[1]})",
            "weather_info": weather_info,
            "soil_moisture": soil_moisture
        }
    except Exception as e:
        return f"Error processing weather data: {str(e)}"

# Streamlit app
st.title("Weather Analysis Assistant")

# User input for location
location = st.text_input("Enter location:")

if st.button("Analyze Weather"):
    if location:
        with st.spinner("Analyzing weather data..."):
            weather_data = process_weather_query(location)
            
            if isinstance(weather_data, dict):
                try:
                    # Invoke the model with weather data
                    response = chain.invoke({
                        "location": weather_data["location"],
                        "coordinates": weather_data["coordinates"],
                        "weather_info": weather_data["weather_info"],
                        "soil_moisture": weather_data["soil_moisture"],
                        "chat_history": st.session_state.chat_history.messages
                    })

                    # Add interaction to chat history
                    st.session_state.chat_history.add_user_message(f"Analyze weather for {location}")
                    st.session_state.chat_history.add_ai_message(response)

                    # Display response
                    st.subheader("Analysis:")
                    st.write(response)
                except Exception as e:
                    st.error(f"Error analyzing weather data: {str(e)}")
            else:
                st.error(weather_data)  # Display error message
    else:
        st.warning("Please enter a location.")

# Display chat history
if st.checkbox("Show Chat History"):
    st.subheader("Chat History")
    for message in st.session_state.chat_history.messages:
        if isinstance(message, HumanMessage):
            st.write(f"User: {message.content}")
        elif isinstance(message, AIMessage):
            st.write(f"AI: {message.content}")
