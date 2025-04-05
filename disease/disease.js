async function diagnoseDisease() {
    const formElement = document.getElementById("diagnosisForm");
    const resultElement = document.getElementById("result");
    const refreshButton = document.getElementById("refreshButton");

    // Hide form and show diagnosis message
    formElement.style.display = "none";
    resultElement.innerHTML = "<p><strong>Diagnosing...</strong></p>";

    // Get form values
    const animalType = document.getElementById("animalType").value;
    const breed = document.getElementById("breed").value;
    const age = document.getElementById("age").value;
    const gender = document.getElementById("gender").value;
    const weight = document.getElementById("weight").value;
    const generalSymptoms = document.getElementById("generalSymptoms").value;
    const digestiveIssues = document.getElementById("digestiveIssues").value;
    const respiratoryIssues = document.getElementById("respiratoryIssues").value;
    const skinIssues = document.getElementById("skinIssues").value;
    const reproductiveIssues = document.getElementById("reproductiveIssues").value;
    const neurologicalIssues = document.getElementById("neurologicalIssues").value;
    const calvingHistory = document.getElementById("calvingHistory").value;
    const diet = document.getElementById("diet").value;
    const vaccination = document.getElementById("vaccination").value;
    const livingConditions = document.getElementById("livingConditions").value;

    // API Configuration
    const apiKey = "AIzaSyB22rNrIv5uZPjxyVwR1c7v2kaU8ilTM94"; // Replace with your actual API key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Prompt for AI
    const promptText = `The following animal needs a diagnosis:
    - **Type:** ${animalType}  
    - **Breed:** ${breed}  
    - **Age:** ${age} years  
    - **Gender:** ${gender}  
    - **Weight:** ${weight} kg  
    - **Symptoms:**  
      - General: ${generalSymptoms}  
      - Digestive: ${digestiveIssues}  
      - Respiratory: ${respiratoryIssues}  
      - Skin: ${skinIssues}  
      - Reproductive: ${reproductiveIssues}  
      - Neurological: ${neurologicalIssues}  
    - **Additional Factors:**  
      - Calving History: ${calvingHistory}  
      - Diet: ${diet}  
      - Vaccination: ${vaccination}  
      - Living Conditions: ${livingConditions}  

    What is the most likely disease? Format the response in an easy-to-read structured manner, and avoid using markdown or asterisks.`;  

    const requestBody = {
        contents: [{ parts: [{ text: promptText }] }]
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        let botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

        // Remove asterisks or markdown
        botReply = botReply.replace(/\*\*\*/g, "").replace(/\*\*/g, "").replace(/\*/g, "");

        // Apply typing effect
        typeResponse(botReply);

        // Show refresh button
        refreshButton.style.display = "block";

    } catch (error) {
        resultElement.innerHTML = "<p style='color: red;'><strong>Error:</strong> Unable to fetch diagnosis. Please check your API key and internet connection.</p>";
        console.error("Error:", error);
        refreshButton.style.display = "block"; // Show refresh button in case of error
    }
}

// Function to simulate a typing effect
function typeResponse(text) {
    const resultElement = document.getElementById("result");
    resultElement.innerHTML = ""; // Clear previous content
    let index = 0;

    function type() {
        if (index < text.length) {
            resultElement.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, 15); // Adjust speed if needed
        }
    }

    type();
}

// Function to refresh the form
function refreshForm() {
    document.getElementById("diagnosisForm").reset(); // Reset form fields
    document.getElementById("diagnosisForm").style.display = "block"; // Show form
    document.getElementById("result").innerHTML = ""; // Clear result
    document.getElementById("refreshButton").style.display = "none"; // Hide refresh button
}
