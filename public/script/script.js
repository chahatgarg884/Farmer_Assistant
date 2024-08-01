var module = angular.module("myModule", []);
module.controller("myController", function($scope, $http) {
    let currentStep = 0;
    let userState = "";
    let userSeason = "";

    // Function to handle message sending
    $scope.sendMessage = function() {
        const userInput = document.getElementById("user-input");
        const userMessage = userInput.value.trim();

        if (userMessage) {
            displayMessage(userMessage, "answer");
            userInput.value = "";
            setTimeout(() => {
                handleBotResponse(userMessage);
            }, 1000);
        }
    };

    // Function to display messages in the chat
    function displayMessage(message, type) {
        const chatbox = document.getElementById("chatbox");
        const messageElement = document.createElement("li");
        messageElement.className = "message";

        if (type === "question") {
            messageElement.classList.add("question-container");
            const logoBox = document.createElement("div");
            logoBox.className = "logo-box";
            logoBox.innerHTML = '<span class="material-symbols-rounded">android</span>';
            const questionBox = document.createElement("div");
            questionBox.className = "question-box";
            questionBox.textContent = message;
            messageElement.appendChild(logoBox);
            messageElement.appendChild(questionBox);
        } else if (type === "answer") {
            messageElement.classList.add("answer");
            const answerBox = document.createElement("div");
            answerBox.className = "answer-box";
            answerBox.textContent = message;
            messageElement.appendChild(answerBox);
        } else if (type === "final") {
            messageElement.classList.add("final");
            messageElement.textContent = message;
        }

        chatbox.appendChild(messageElement);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Function to handle bot responses
    function handleBotResponse(message) {
        if (currentStep === 0) {
            userState = message;
            displayMessage(`You've selected ${userState}. Please select the season:`, "question");
            displaySeasonOptions();
            currentStep++;
        } else if (currentStep === 1) {
            userSeason = message;
            displayMessage(`You've selected the season: ${message}.`, "question");
            displayMessage(`Please wait while we fetch the data for ${userState} in ${message} season.`, "question");

            // Fetch data based on state and season
            $scope.fetchData(userState, userSeason);
            currentStep++;
        }
    }

    // Function to display season options
    function displaySeasonOptions() {
        const chatbox = document.getElementById("chatbox");
        const optionsList = document.createElement("ul");
        optionsList.className = "options-list";

        const seasons = ["Kharif", "Rabi", "Zaid"];
        seasons.forEach(season => {
            const optionItem = document.createElement("li");
            const optionButton = document.createElement("button");
            optionButton.textContent = season;
            optionButton.addEventListener("click", () => {
                displayMessage(season, "answer");
                handleBotResponse(season);
            });
            optionItem.appendChild(optionButton);
            optionsList.appendChild(optionItem);
        });

        chatbox.appendChild(optionsList);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Function to display data in a table
    function displayDataInTable(data) {
        const chatbox = document.getElementById("chatbox");
        const table = document.createElement("table");
        table.className = "table table-hover table-warning";

        if (data.length > 0) {
            const headers = Object.keys(data[0]);
            const headerRow = document.createElement("tr");

            headers.forEach(header => {
                const th = document.createElement("th");
                th.textContent = header;
                headerRow.appendChild(th);
            });

            table.appendChild(headerRow);

            data.forEach(item => {
                const row = document.createElement("tr");
                Object.values(item).forEach(value => {
                    const td = document.createElement("td");
                    td.textContent = value;
                    row.appendChild(td);
                });
                table.appendChild(row);
            });
        } else {
            const noDataMessage = document.createElement("p");
            noDataMessage.textContent = "No data found for the selected criteria.";
            chatbox.appendChild(noDataMessage);
        }

        chatbox.appendChild(table);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    // Fetch data from the server
    $scope.fetchData = function(state, season) {
        const url = `/fetch-data?state=${encodeURIComponent(state)}&season=${encodeURIComponent(season)}`;
        $http.get(url).then(function(response) {
            displayDataInTable(response.data);
        }, function() {
            displayMessage("Failed to fetch data. Please try again later.", "question");
        });
    };

    // Reset chat
    $scope.resetChat = function() {
        const chatbox = document.getElementById("chatbox");
        chatbox.innerHTML = "";
        currentStep = 0;
        userState = "";
        userSeason = "";
        setTimeout(() => {
            displayMessage("Hello! Welcome to the Farming Assistance Chatbot.", "question");
            displayMessage("Please enter your state:", "question");
        }, 500);
    };

    document.getElementById("send-btn").addEventListener("click", $scope.sendMessage);
    document.getElementById("user-input").addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $scope.sendMessage();
        }
    });

    document.getElementById("new-chat-btn").addEventListener("click", $scope.resetChat);

    // Initialize the chat on page load
    $scope.resetChat();
});
