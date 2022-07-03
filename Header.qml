import QtQuick 2.0
import QtQuick.Controls 2.15
import "api.js" as API

Rectangle{
    SplitView.preferredHeight: parent.height * 0.3
    SplitView.preferredWidth: parent.width
    SplitView.minimumHeight: 90

    property alias errorOutputAlias: errorOutput.visible

    Column{
        anchors.fill: parent

        Rectangle{
            id: header
            height: 32
            width: parent.width
            color: colorDark

            Text{
                id: title
                height: parent.height
                color: colorBlue
                text: "ABUSE.CH-LOOKUP"
                font.family: "Consolas"; font.pointSize: 12; font.bold: true
                verticalAlignment: Text.AlignVCenter
                anchors.left: header.left
                anchors.leftMargin: 10

            }

            Text{
                id: errorOutput
                visible: false
                anchors.verticalCenter: parent.verticalCenter
                anchors.horizontalCenter: parent.horizontalCenter
                color: colorRed
                text: "CHECK CONNECTION!"
                font.family: "Consolas"; font.pointSize: 12; font.bold: true
            }

            Rectangle{
                id: btnSearch
                width: 100
                height: 22
                anchors.right: btnAbout.left
                anchors.rightMargin: 4
                anchors.verticalCenter: parent.verticalCenter
                color: colorSearchArea
                radius: 2

                ColorAnimation on color{
                    id: hoverColorBtn
                    to: colorBlue
                    duration: 150
                    running: false
                }

                ColorAnimation on color{
                    id: exitColorBtn
                    to: colorSearchArea
                    duration: 150
                    running: false
                }

                Text{
                    id: txtSearch
                    text: "SEARCH"
                    font.family: "Consolas"; font.pointSize: 11; font.bold: true
                    anchors.centerIn: parent
                    color: colorBlue
                }

                MouseArea{
                    id: btnSearchArea
                    enabled: true
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: "PointingHandCursor"
                    onEntered: {exitColorBtn.stop(); hoverColorBtn.start(); txtSearch.color = colorDark}
                    onExited: {hoverColorBtn.stop(); exitColorBtn.start(); txtSearch.color = colorBlue}

                    onClicked: {
                        inputArr = searchField.text.split('\n').filter(s => s).map(s => s.trim())
                        if(inputArr.length > 0){
                            API.queryIndicatorStart()
                            API.queryAbuseAPI()
                        }
                    }
                }
            }

            Rectangle{
                id: btnAbout
                width: 22
                height: 22
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter
                anchors.rightMargin: 4
                radius: 2
                color: "transparent"

                ColorAnimation on color{
                    id: hoverColorBtn2
                    to: colorBlue
                    duration: 150
                    running: false
                }

                ColorAnimation on color{
                    id: exitColorBtn2
                    to: "transparent"
                    duration: 150
                    running: false
                }

                Text{
                    id: btnAboutTxt
                    text: "?"
                    font.family: "Consolas"; font.pointSize: 11; font.bold: true
                    anchors.centerIn: parent
                    color: colorBlue

                }

                MouseArea{
                    id: btnAboutArea
                    enabled: true
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: "PointingHandCursor"
                    onEntered: {exitColorBtn2.stop(); hoverColorBtn2.start(); btnAboutTxt.color = colorMain}
                    onExited: {hoverColorBtn2.stop(); exitColorBtn2.start(); btnAboutTxt.color = colorBlue}
                    onClicked: {about.visible = true; splitviewMain.visible = false}
                }
            }
        }

        Rectangle{
            id: searchArea
            width: parent.width
            height: parent.height - header.height
            color: colorSearchArea

            Flickable{
                anchors.fill: parent
                anchors.margins: 5
                boundsBehavior: Flickable.StopAtBounds

                TextArea.flickable: TextArea{
                    id: searchField
                    placeholderText: "One search entity per line..."
                    placeholderTextColor: Qt.darker(colorLight)
                    color: colorLight
                    selectedTextColor: colorGrey
                    selectionColor: colorBlue
                    focus: true
                    selectByMouse: true
                    selectByKeyboard: true
                    font.family: "Consolas"; font.pointSize: 12; font.bold: true
                    background:  Rectangle{color: "transparent"; radius: 2; border.color: searchField.focus ? colorBlue : "transparent"}
                    Keys.onTabPressed: nextItemInFocusChain().forceActiveFocus(Qt.TabFocusReason)
                    Keys.onPressed: (event) => {if ( (event.key === Qt.Key_Return) && (event.modifiers & Qt.ControlModifier) ){
                                            inputArr = searchField.text.split('\n').filter(s => s).map(s => s.trim())
                                            if(inputArr.length > 0){
                                                API.queryIndicatorStart()
                                                API.queryAbuseAPI()
                                            }
                                        }
                                    }
                }
            }
        }
    }
}
