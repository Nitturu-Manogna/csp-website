const fetchData = async () => {
    const response = await fetch('diseases.json');
    const data = await response.json();
    return data;
}

let diseases = [];
const suggestionsList = document.getElementById('suggestions');
fetchData().then(data => diseases = data);
document.getElementById('symptoms').addEventListener('input', (event) => {
    const inputText = event.target.value;
    if (inputText.length > 0) {
        const suggestions = generateSuggestions(inputText);
        displaySuggestions(suggestions);
    }
    else {
        suggestionsList.style.display = 'none';
    }
});

const generateSuggestions = (inputValue) => {
    const suggestions = new Set();
    const inputSort = inputValue.split(',').map(symptom => symptom.trim().toLowerCase());
    const lastSymptom = inputSort[inputSort.length - 1];
    if (lastSymptom) {
        diseases.forEach(disease => {
            disease.symptoms.forEach(symptom => {
                if (symptom.toLowerCase().includes(lastSymptom.toLowerCase())) {
                    suggestions.add(symptom.toLowerCase());
                }
            });
        });
    }
    return Array.from(suggestions);
}

const displaySuggestions = (suggestions) => {
    suggestionsList.innerHTML = '';
    suggestions.forEach(symptom => {
        suggestionsList.style.display = 'block';
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.textContent = symptom;
        suggestionItem.onclick = () => {
            const input = document.getElementById('symptoms');
            const currentSymptoms = input.value.split(',').map(symptom => symptom.trim());
            if (!currentSymptoms.includes(symptom)) {
                currentSymptoms[currentSymptoms.length - 1] = symptom;
                input.value = currentSymptoms.join(', ');
            }
            else {
                currentSymptoms[currentSymptoms.length - 1] = "";
                input.value = currentSymptoms.join(', ');
            }
            suggestionsList.style.display = 'none';
        };
        suggestionsList.appendChild(suggestionItem);
    });
}

const checkSymptoms = () => {
    const input = document.getElementById('symptoms').value.toLowerCase().split(',').map(symptom => symptom.trim());
    if (input == "") {
        return;
    }
    const result = document.getElementById('result');
    let matched = [];
    diseases.forEach(disease => {
        const matchingSymptoms = input.every(inputSymptom =>
            disease.symptoms.some(diseaseSymptom =>
                diseaseSymptom.toLowerCase().includes(inputSymptom) || inputSymptom.includes(diseaseSymptom.toLowerCase())
            )
        );
        if (matchingSymptoms) {
            matched.push(disease);
        }
    });
    if (matched.length > 0) {
        let output = '';
        matched.forEach(disease => {
            output += `
                <h2>${disease.disease}</h2>
                <p><strong>Symptoms:</strong> ${disease.symptoms.join(', ')}</p>
                <p><strong>Description:</strong> ${disease.description}</p>
                <p><strong>Remedies:</strong> ${disease.remedies.join(', ')}</p>
            `;
        });
        const newPage = window.open('', '_blank');
        newPage.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Results Page</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <style>
                body:has(strong){
                    font-size: 3vh;
                }
        
                h2{
                    color: rgba(9, 57, 97);
                    font-size: 4vh;
                }
        
                .heading {
                    margin-top: 15vh;
                }
        
                .info {
                    display: flex;
                    animation:transitionBottom 1s;
                }
        
                .left {
                    position: fixed;
                    margin-top: 3vh;
                    margin-left:3vh;
                }

                img{
                    border-radius:50%;
                    width:100%;
                    height:100%;
                    box-shadow:7px 7px 12px rgb(9, 57, 97);
                }
        
                .right {
                    text-align: left;
                    margin-left: 670px;
                }
                 
                @media (max-width: 1024px) {
                    .info {
                        flex-direction: column;
                    }

                    .left {
                        position: unset;
                        justify-content: center;
                        margin-left:0;
                    }

                    .right {
                        margin: 0 auto;
                        text-align: center;
                    }
                }

                @media (max-width: 655px) {
                    body:has(strong){
                        font-size:2.5vh;
                    }
                        
                    .heading {
                        font-size: 3.5vh;
                        margin-top:25vh;
                    }

                    h2{
                        font-size:3.5vh;
                    }
                }
            </style>
            <body>
                <section class="navbar">
                    <h1>Symptom Checker<br><span>(Your digital health aide)</span></h1>
                    <div class="navbar-right">
                        <a href="checker.html">Check Symptoms</a>
                        <a href="index.html">Back To Home</a>
                    </div>
                </section>
                <h1 class="heading">All Possible Diagnoses</h1>
                <section class="info">
                    <div class="left">
                        <img class="image" src="symptom checker 3.jpg">
                    </div>
                    <div class="right">
                        ${output}
                    </div>
                </section>
            </body>
            </html>
        `);
    } else {
        alert("No matching diseases found. Please check your symptoms and try again.");
    }
}

const clearForm = () => {
    document.getElementById('symptoms').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('suggestions').innerHTML = '';
}
