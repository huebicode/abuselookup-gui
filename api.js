//QUERY VARS
const qLIMIT = 20
let tries = 0
let percentage = 0
let requests = 0

function queryIndicatorStart(){
    percentageIndicator = 0.0
    counter = 0
    tries = 0
    percentage = 0
    requests = 0

    showError = false
    progressIndicator.visible = true

    btnSearchArea.cursorShape = "BusyCursor"
    btnSearchArea.enabled = false
    btnAboutArea.cursorShape = "BusyCursor"
    btnAboutArea.enabled = false

    header.color = colorBlue
    title.color = colorDark
    btnAboutTxt.color = colorDark
    btnSearch.color = colorBlue
    txtSearch.color = colorDark
}

function queryIndicatorFinish(){


    btnSearchArea.cursorShape = "PointingHandCursor"
    btnSearchArea.enabled = true
    btnAboutArea.cursorShape = "PointingHandCursor"
    btnAboutArea.enabled = true

    header.color = colorDark
    title.color = colorBlue
    btnAboutTxt.color = colorBlue
    btnSearch.color = colorSearchArea
    txtSearch.color = colorBlue

    progressIndicator.visible = false
}

//COMMON IMPHASHES
const dotNET1 = "f34d5f2d4577ed6d9ceec516c1f5a744"
const dotNET2 = "dae02f32a21e03ce65412f6e56942daa"
const autoIT = "afcdf79be1557326c854b6e20cb900a7"
const goBIN = "f0070935b15a909b9dc00be7997e6112"
const goBIN2 = "c7269d59926fa4252270f407e4dab043"

function queryAbuseAPI(){

    let localcounter = 0

    for(let i = 0; i < inputArr.length; i++){
        let inpt = inputArr[i].toLowerCase()

        //IMPHASH
        if(inpt.startsWith("imphash:")){
            inpt = inpt.slice(8).trim()

            //CHECK FOR COMMON IMPHASHES
            if(inpt === dotNET1 || inpt === dotNET2 || inpt === autoIT || inpt === goBIN || inpt === goBIN2) {
                localcounter++
                setOutputHeader()
                let sig = ""
                let notes = ""
                if (inpt === dotNET1 || inpt === dotNET2) { sig = "imphash dotNET"; notes = "no lookup - common imphash"; }
                else if(inpt === autoIT){ sig = "imphash AutoIt"; notes = "no lookup - common imphash";}
                else if(inpt === goBIN || inpt === goBIN2){ sig = "imphash Golang"; notes = "no lookup - try gimphash" }

                outputText
                        += "-".padEnd(pPLAT)
                        + divider()
                        + sig.padEnd(pMALW)
                        + divider()
                        + "-".padEnd(pDATE)
                        + divider()
                        + "-".padEnd(pTAGS)
                        + divider()
                        + notes.padEnd(pNOTE)
                        + divider()
                        + inpt + "<br>"

                if(inputArr.length === 1) {
                    queryIndicatorFinish()
                    break
                }
                else {
                    continue
                }
            }

            //IMPHASH REQUEST
            counter++
            requests++
            apiRequest("POST", urlBazaar, 'query=get_imphash&imphash=' + inpt + '&limit=' + qLIMIT, bazaarImphashOutput, inpt, "MalBazaar Imphash")
            continue
        }

        //GIMPHASH REQUEST
        else if(inpt.startsWith("gimphash:")){
            inpt = inpt.slice(9).trim()
            counter++
            requests++
            apiRequest("POST", urlBazaar, 'query=get_gimphash&gimphash=' + inpt + '&limit=' + qLIMIT, bazaarGimphashOutput, inpt, "MalBazaar Gimphash")
            continue
        }

        //SERIAL NUMBER REQUEST
        else if(inpt.startsWith("serial_number:")){
            inpt = inpt.slice(14).trim()
            counter++
            requests++
            apiRequest("POST", urlBazaar, 'query=get_certificate&serial_number=' + inpt, bazaarSerialOutput, inpt, "MalBazaar Serial")
            continue
        }

        //URLHAUS REQUEST
        else if((inpt.includes(".") || inpt.includes(":")) && !(inpt.startsWith("http://") || inpt.startsWith("https://"))) {

            counter++
            requests++
            apiRequest("POST", urlHaus, 'host=' + inpt, urlOutput, inpt, "URLhaus")
        }

        //MALWARE BAZAAR REQUEST
        else if((inpt.length === 32 || inpt.length === 40 || inpt.length === 64) && !(inpt.includes(".") || inpt.includes(":"))){

            counter++
            requests++
            apiRequest("POST", urlBazaar, 'query=get_info&hash=' + inpt, bazaarOutput, inpt, "MalBazaar")
        }

        //THREATFOX REQUEST
        counter++
        requests++
        apiRequest("POST", urlThreatfox, '{ "query": "search_ioc", "search_term": "'+ inpt +'"}', foxOutput, inpt, "ThreatFox")

    }

    if(inputArr.length === localcounter){
        queryIndicatorFinish()
    }

}

function apiRequest(method, url, data, callback, inputVal, platform) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader('User-Agent','Abuse-Lookup-GUI')
    xhr.setRequestHeader("accept", "application/json")
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")

    xhr.onreadystatechange = function(){
        if(xhr.readyState === XMLHttpRequest.DONE){
            let response = xhr.responseText

            if(!response){
                tries++
                if(tries > 10000) {
                    showError = true
                    queryIndicatorFinish()
                    return
                }
                apiRequest(method, url, data, callback, inputVal, platform)
                return
            }

            callback(response, inputVal)

            debugTxt.text
                    += "\n-------------------------\n"
                    + platform + ": " + inputVal
                    + "\n-------------------------\n"
                    + response
            counter--
            percentage++
            percentageIndicator = (percentage / requests).toFixed(2)
            if(counter === 0){
                queryIndicatorFinish()
            }
        }
    }

    xhr.send(data)
}

//PADDING CONSTS
const pPLAT = 10
const pMALW = 17
const pDATE = 17
const pTAGS = 28
const pNOTE = 28


function bazaarOutput(callback, inputVal){

    let output = JSON.parse(callback)

    if(output["query_status"] === "ok"){
        setOutputHeader()
        let data = output["data"][0]

        //MALWARE SIG
        let sig = getMalsig(data["signature"])

        //TAGS
        let tags = getTags(data["tags"])

        //FILENAME
        let fileName = data["file_name"]
        if(fileName){
            if(fileName.length > pNOTE) fileName = truncate(fileName, pNOTE)
            else fileName = fileName.padEnd(pNOTE)
            fileName = "<font color=" + colorBazaar + ">" + fileName + "</font>"
        } else {
            fileName = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pNOTE) + "</font>"
        }

        outputText
                += "<font color=" + colorBazaar + ">" + "MalBazaar".padEnd(pPLAT) + "</font>"
                + divider()
                + sig
                + divider()
                + data["first_seen"].slice(0, -3).padEnd(pDATE)
                + divider()
                + tags
                + divider()
                + fileName
                + divider()
                + inputVal + "<br>"

    } else {
        noHit()
        nohitText += "MalBazaar: " + inputVal + "<br>"
    }
}

function bazaarImphashOutput(callback, inputVal){

    let output = JSON.parse(callback)

    if(output["query_status"] === "ok"){
        setOutputHeader()

        let objects = output["data"]

        let sigSet = new Set()
        for(let i in objects){
            sigSet.add(objects[i]["signature"])
        }

        //MALWARE LIST (TAGS)
        let malList = []
        for(let item of sigSet){
            if(item) malList.push(item)
        }
        if(malList.length === 0) malList = null
        let tags = getTags(malList)

        //OBJECTS COUNT (NOTES)
        let objectCount = objects.length
        if(objectCount >= qLIMIT){
            objectCount = "sample count: " + objectCount + "+"
            objectCount = objectCount.padEnd(pNOTE)
        }
        else if(objectCount > 0){
            objectCount = "sample count: " + objectCount
            objectCount = objectCount.padEnd(pNOTE)
        }
        else {objectCount = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pNOTE) + "</font>"}

        outputText
                += "<font color=" + colorBazaar + ">" + "MalBazaar".padEnd(pPLAT) + "</font>"
                + divider()
                + "<font color=" + colorRed + ">" + "imphash found".padEnd(pMALW) + "</font>"
                + divider()
                + output["data"][0]["first_seen"].slice(0, -3).padEnd(pDATE)
                + divider()
                + tags
                + divider()
                + objectCount
                + divider()
                + inputVal + "<br>"

    } else {
        noHit()
        nohitText += "MalBazaarImp: " + inputVal + "<br>"
    }
}

function bazaarGimphashOutput(callback, inputVal){

    let output = JSON.parse(callback)

    if(output["query_status"] === "ok"){
        setOutputHeader()

        let objects = output["data"]

        let sigSet = new Set()
        for(let i in objects){
            sigSet.add(objects[i]["signature"])
        }

        //MALWARE LIST (TAGS)
        let malList = []
        for(let item of sigSet){
            if(item) malList.push(item)
        }
        if(malList.length === 0) malList = null
        let tags = getTags(malList)

        //OBJECTS COUNT (NOTES)
        let objectCount = objects.length
        if(objectCount >= qLIMIT){
            objectCount = "sample count: " + objectCount + "+"
            objectCount = objectCount.padEnd(pNOTE)
        }
        else if(objectCount > 0){
            objectCount = "sample count: " + objectCount
            objectCount = objectCount.padEnd(pNOTE)
        }
        else {objectCount = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pNOTE) + "</font>"}

        outputText
                += "<font color=" + colorBazaar + ">" + "MalBazaar".padEnd(pPLAT) + "</font>"
                + divider()
                + "<font color=" + colorRed + ">" + "gimphash found".padEnd(pMALW) + "</font>"
                + divider()
                + output["data"][0]["first_seen"].slice(0, -3).padEnd(pDATE)
                + divider()
                + tags
                + divider()
                + objectCount
                + divider()
                + inputVal + "<br>"

    } else {
        noHit()
        nohitText += "MalBazaarGimp: " + inputVal + "<br>"
    }
}

function bazaarSerialOutput(callback, inputVal){

    let output = JSON.parse(callback)

    if(output["query_status"] === "ok"){
        setOutputHeader()

        let objects = output["data"]

        let sigSet = new Set()
        for(let i in objects){
            sigSet.add(objects[i]["signature"])
        }

        //MALWARE LIST (TAGS)
        let malList = []
        for(let item of sigSet){
            if(item) malList.push(item)
        }
        if(malList.length === 0) malList = null
        let tags = getTags(malList)

        //OBJECTS COUNT (NOTES)
        let objectCount = objects.length

        if(objectCount > 0){
            objectCount = "sample count: " + objectCount
            objectCount = objectCount.padEnd(pNOTE)
        }
        else {objectCount = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pNOTE) + "</font>"}

        outputText
                += "<font color=" + colorBazaar + ">" + "MalBazaar".padEnd(pPLAT) + "</font>"
                + divider()
                + "<font color=" + colorRed + ">" + "serial found".padEnd(pMALW) + "</font>"
                + divider()
                + output["data"][0]["first_seen"].slice(0, -3).padEnd(pDATE)
                + divider()
                + tags
                + divider()
                + objectCount
                + divider()
                + inputVal + "<br>"

    } else {
        noHit()
        nohitText += "MalBazaarSer: " + inputVal + "<br>"
    }
}

function urlOutput(callback, inputVal){

    let output = JSON.parse(callback)

    if(output["query_status"] === "ok"){
        setOutputHeader()
        let data = output["urls"][0]

        //MALWARE SIG
        let sig = getMalsig(data["threat"])

        //TAGS
        let tags = getTags(data["tags"])

        //STATUS
        let status = data["url_status"]
        if(status){
            if(status === "online") status = "<font color=" + colorURLhaus + ">" + status.padEnd(pNOTE) + "</font>"
            else status = "<font color=" + colorDarkGrey + ">" + status.padEnd(pNOTE) + "</font>"
        } else {
            status = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pNOTE) + "</font>"
        }

        outputText
                += "<font color=" + colorURLhaus + ">" + "URLhaus".padEnd(pPLAT) + "</font>"
                + divider()
                + sig
                + divider()
                + output["firstseen"].slice(0,-7).padEnd(pDATE)
                + divider()
                + tags
                + divider()
                + status
                + divider()
                + inputVal + "<br>"

    } else {
        noHit()
        nohitText += "URLhaus: " + inputVal + "<br>"
    }
}

function foxOutput(callback, inputVal){

    let output = JSON.parse(callback)

    if(output["query_status"] === "ok"){
        setOutputHeader()
        let data = output["data"][0]

        //MALWARE SIG
        let sig = getMalsig(data["malware_printable"])

        //TAGS
        let tags = getTags(data["tags"])

        //CONFIDENCE
        let confPercentage = data["confidence_level"]
        let confidence = data["confidence_level"].toString()

        if(confPercentage){
            confidence = "confidence " + confidence + "%"
            if(confPercentage >= 51) confidence = "<font color=" + colorGreen + ">" + confidence.padEnd(pNOTE) + "</font>"
            else confidence = "<font color=" + colorURLhaus + ">" + confidence.padEnd(pNOTE) + "</font>"
        } else {
            confidence = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pNOTE) + "</font>"
        }


        outputText
                += "<font color=" + colorThreatfox + ">" + "ThreatFox".padEnd(pPLAT) + "</font>"
                + divider()
                + sig
                + divider()
                + data["first_seen"].slice(0,-7).padEnd(pDATE)
                + divider()
                + tags
                + divider()
                + confidence
                + divider()
                + inputVal + "<br>"

    } else {
        noHit()
        nohitText += "ThreatFox: " + inputVal + "<br>"
    }
}

function noHit(){
    if(!nohitAreaVisible) nohitAreaVisible = true
    if(nohitText.length === 0) nohitText = "not found<br>"
}

function setOutputHeader(){
    if(!outputAreaVisible) outputAreaVisible = true
    if(outputText.length === 0){
        outputText = "<style>body{white-space: pre;}</style><body>"
                +"Platform".padEnd(pPLAT)
                +"<font color=" + colorDarkGrey +">|</font>"
                +"Malware".padEnd(pMALW)
                +"<font color=" + colorDarkGrey +">|</font>"
                +"Date".padEnd(pDATE)
                +"<font color=" + colorDarkGrey +">|</font>"
                +"Tags".padEnd(pTAGS)
                +"<font color=" + colorDarkGrey +">|</font>"
                +"Notes".padEnd(pNOTE)
                +"<font color=" + colorDarkGrey +">|</font>"
                +"IOC<br>"
    }
}

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '&hellip;' : str
}

function getTags(arrPath){
    let tags = ""
    if(arrPath){
        let tagsArr = arrPath
        if(tagsArr.length > 1) {
            tagsArr.forEach((x,i) => tags = tags.concat(x + " "))
            tags = tags.padEnd(pTAGS)
        } else tags = tagsArr[0].padEnd(pTAGS)

        if(tags.length > pTAGS) tags = truncate(tags, pTAGS)

        tags = "<font color=" + colorGreen + ">" + tags + "</font>"

    } else {
        tags = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pTAGS) + "</font>"
    }

    return tags
}

function getMalsig(strPath){
    let sig = ""

    if(!strPath){
        sig = "<font color=" + colorDarkGrey + ">" + "n/a".padEnd(pMALW) + "</font>"
    } else {
        sig = strPath.padEnd(pMALW)
        if(sig.length > pMALW) sig = truncate(sig, pMALW)
        sig = "<font color=" + colorRed + ">" + sig + "</font>"
    }

    return sig
}

function divider(){return "<font color=" + colorDarkGrey +">|</font>"}








