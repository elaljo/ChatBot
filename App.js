const mybutton = document.getElementById("MyButton");
const inputbox = document.getElementById("container-input")
const Myinput = document.getElementById("MyInput")
const opptext = document.getElementById("opp-text")
const ChatContainer = document.getElementById("Chat-container")

async function GetAnswer(input){
    try {
        const response = await fetch("http://localhost:5000/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const Answer = document.createElement("div");
        
        // Handle different response types
        if (data.error) {
            Answer.textContent = `Error: ${data.error}`;
        } else if (data.weather) {
            // Weather response
            const weather = data.weather;
            if (typeof weather === 'string') {
                Answer.textContent = weather;
            } else {
                Answer.textContent = `Weather in ${weather.name}: ${weather.main.temp}°C, ${weather.weather[0].description}`;
            }
        } else if (data.message) {
            // Regular chat response
            Answer.textContent = data.message;
        } else {
            Answer.textContent = "Sorry, I couldn't process your request.";
        }
        
        Answer.classList.add("Answer-text");
        ChatContainer.appendChild(Answer);
        
    } catch (error) {
        console.error('Error fetching response:', error);
        const Answer = document.createElement("div");
        Answer.textContent = "Sorry, there was an error processing your request.";
        Answer.classList.add("Answer-text");
        ChatContainer.appendChild(Answer);
    }
}

Myinput.addEventListener("keydown", event =>{
    if (event.key === "Enter"){
        const message = Myinput.value.trim();
        if (message){
            if (opptext.parentElement)
                opptext.parentElement.remove();
            if (ChatContainer.style.display === "none" || !ChatContainer.style.display)
                ChatContainer.style.display = "block";
            const Question = document.createElement("div");
            Question.textContent = message;
            Question.classList.add("Question-text");
            ChatContainer.appendChild(Question);
            GetAnswer(message);
            Myinput.value = "";
        }
    }
})

// mybutton.addEventListener("click", event=> {
//     const message = Myinput.value.trim();
//     if (message)
//     {
//             opptext.parentElement.remove();
//             ChatContainer.style.height = "80vh";
//             // messages.push(message);
//             Question.style.display = "block";
//             Question.innerHTML += `<p>${message}</p>`;
//             Myinput.value = "";
//             // Answer.style.display = "block";
//             // Answer.innerHTML += `<p>${message}</p>`;
//     }
// })