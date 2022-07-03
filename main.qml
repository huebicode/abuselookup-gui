import QtQuick
import QtQuick.Controls 2.15

Window {
    id: window
    width: 1000
    minimumWidth: 400
    height: 600
    minimumHeight: 300
    visible: true
    title: "Abuse Lookup"
    color: colorDark

    property string colorMain: "#00475a"
    property string colorLight: "#e7e7dc"
    property string colorDark: "#30353B"
    property string colorDarkGrey: Qt.darker(colorLight)
    property string colorGrey: "#4c535d"
    property string colorRed: "#fb5e56"
    property string colorBlue: "#4ec2e5"
    property string colorGreen: "#9fdc78"
    property string colorThreatfox: "#e663a1"
    property string colorURLhaus: "#f5a569"
    property string colorBazaar: "#00c1ff"
    property string colorSearchArea: "#4d545b"

    property variant inputArr: []
    property string urlThreatfox: "https://threatfox-api.abuse.ch/api/v1/"
    property string urlHaus: "https://urlhaus-api.abuse.ch/v1/host/"
    property string urlBazaar: "https://mb-api.abuse.ch/api/v1/"

    property string outputText: ""
    property string nohitText: ""
    property bool nohitAreaVisible: false
    property bool outputAreaVisible: false
    property bool showError: false
    property int counter: 0
    property double percentageIndicator: 0.0

    // ABOUT WINDOW -------------------------------------
    About{id: about}

    // MAIN VIEW ----------------------------------------
    SplitView{
        id: splitviewMain
        visible: true
        anchors.fill: parent
        orientation: Qt.Vertical
        handle: Rectangle{implicitHeight: 4; implicitWidth: 4; color: Qt.darker(colorLight)}

        //HEADER + SEARCH---------------------------------
        Header{id: headerContainer; errorOutputAlias: showError}

        //OUTPUT WINDOW ----------------------------------
        Output{id: outputView; outputTextAlias: outputText; nohitTextAlias: nohitText; nohitArea.visible: nohitAreaVisible; outputAreaAlias.visible: outputAreaVisible}
        //DEBUG WINDOW -----------------------------------
        Rectangle{
            id: debug
            visible: false
            color: colorDark
            SplitView.preferredWidth: parent.width

            Flickable{
                anchors.fill: parent
                anchors.margins: 5
                boundsBehavior: Flickable.StopAtBounds

                TextArea.flickable: TextArea{
                    id: debugTxt
                    readOnly: true
                    color: colorLight
                    selectedTextColor: colorGrey
                    selectionColor: colorBlue
                    selectByMouse: true
                    selectByKeyboard: true
                    font.family: "Consolas"; font.pointSize: 12
                    background:  Rectangle{color: "transparent"; radius: 2; border.color: debugTxt.focus ? colorBlue : "transparent"}
                }
            }
        }

        Keys.onPressed: (event) => {if((event.key === Qt.Key_Q) && (event.modifiers & Qt.ControlModifier)){debug.visible = !debug.visible}}

    }

    Rectangle{
        id: progressIndicator
        visible: false
        width: parent.width * percentageIndicator
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        height: 10
        color: colorBlue
    }
}
