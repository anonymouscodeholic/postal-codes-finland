const fs = require('fs')
const process = require('process');

// The source file
const datFileName = 'PCF.dat'
// The destination file
const jsonFileName = 'postalcodes.json'

function readAndParse() {
    if (!fs.existsSync(datFileName)) {
        console.log(`No such file ${datFileName}`)
        return null
    }

    
    const lines = fs.readFileSync(datFileName, {encoding: "latin1"})
        .toString()
        .split("\n")

    return lines
        .map((line) => {
            const format = /^PONOT(\d{8})(\d{5})(.{30})(.{30})(.{12})(.{12})(.{8})(\d{1})(.{5})(.{30})(.{30})(.{3})(.{20})(.{20})(.{1})$/

            if (line.trim().length === 0) {
                return null;
            } 

            const m = line.match(format)
            if (m === null) {
                console.log(`Parse fail ${line}`)
                return null
            }
            var field = 1
            const runDate = m[field++]
            const postalCode = m[field++]
            const nameFinnish = m[field++].trim()
            const nameSwedish = m[field++].trim()
            const shortNameFinnish = m[field++].trim()
            const shortNameSwedish = m[field++].trim()
            const firstDate = m[field++]
            const typeCode = m[field++]
            const adminAreaCode = m[field++].trim()
            const adminAreaFinnish = m[field++].trim()
            const adminAreaSwedish = m[field++].trim()
            const municipalityCode = m[field++].trim()
            const municipalityFinnish = m[field++].trim()
            const municipalitySwedish = m[field++].trim()
            const municipalityLanguageCode = m[field++].trim()

            return {
                runDate,
                postalCode,
                nameFinnish,
                nameSwedish,
                shortNameFinnish,
                shortNameSwedish,
                firstDate,
                typeCode,
                adminAreaCode,
                adminAreaFinnish,
                adminAreaSwedish,
                municipalityCode,
                municipalityFinnish,
                municipalitySwedish,
                municipalityLanguageCode
            }
        })
        .filter((line) => line !== null)
}

function dumpToFile(postalCodeData) {
    if (fs.existsSync(jsonFileName)) {
        fs.unlinkSync(jsonFileName)
    }
    fs.writeFileSync(jsonFileName, JSON.stringify(postalCodeData))
    return true
}

const postalCodeData = readAndParse();
if (postalCodeData === null) {
    console.log("Failed to read and parse!");
    process.exitCode = 1;
} else {
    if (dumpToFile(postalCodeData)) {
        console.log(`Successfully wrote output to ${jsonFileName}`)
    }
}