import {DecisionTree} from "./libraries/decisiontree.js"
import {VegaTree} from "./libraries/vegatree.js"

//
// DATA
//
const csvFile = "data/diabetes.csv"
const trainingLabel = "Label"
const ignored = ["Label", "Pregnant", "Bp", "Skin", "Insulin", "Age"]

const viewAccuracy = document.getElementById("accuracy");
const actuallyTrue = document.getElementById("true");
const falseTrue = document.getElementById("falseTrue");
const actuallyFalse = document.getElementById("false");
const falseFalse = document.getElementById("falseFalse")
//
// laad csv data als json
//
function loadData() {
    Papa.parse(csvFile, {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => trainModel(results.data)   // gebruik deze data om te trainen
    })
}

//
// MACHINE LEARNING - Decision Tree
//
function trainModel(data) {
    // todo : splits data in traindata en testdata
    data.sort(() => (Math.random() - 0.5))

    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)


    // maak het algoritme aan
    let decisionTree = new DecisionTree({
        ignoredAttributes: ignored,
        trainingSet: trainData,
        categoryAttr: trainingLabel,
        maxTreeDepth: 8
    })

    // Teken de boomstructuur - DOM element, breedte, hoogte, decision tree
    let visual = new VegaTree('#view', 800, 400, decisionTree.toJSON())


    // todo : maak een prediction met een sample uit de testdata


    let correctAmount = 0;

    let predictedTrue = 0;
    let predictedFalseTrue = 0;
    let predictedFalse = 0;
    let predictedFalseFalse = 0;

    for (let row of testData) {
        let prediction = decisionTree.predict(row)
        if (prediction == row.Label) {
            correctAmount++
        }
        if (prediction == 1 && row.Label == 1) {
            predictedTrue++
        }
        if (prediction == 1 && row.Label == 0) {
            predictedFalseTrue++
        }
        if (prediction == 0 && row.Label == 0) {
            predictedFalse++
        }
        if (prediction == 0 && row.Label == 1) {
            predictedFalseFalse++
        }
    }


    // todo : maak een prediction met een sample uit de testdata
    let accuracy = ((correctAmount / testData.length) * 100);
    console.log(accuracy);
    viewAccuracy.innerText = `Accuracy is ${Math.round(accuracy)}%`;

    // todo : bereken de accuracy met behulp van alle test data
    actuallyTrue.innerText = `${predictedTrue}`;
    actuallyFalse.innerText = `${predictedFalse}`;
    falseTrue.innerText = `${predictedFalseTrue}`;
    falseFalse.innerText = `${predictedFalseFalse}`;

    //Save
    let json = decisionTree.stringify()
    console.log(json)
}

loadData()