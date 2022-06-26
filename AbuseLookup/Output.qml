import QtQuick 2.0
import QtQuick.Controls 2.15

SplitView{
    SplitView.preferredHeight: debug.visible ? parent.height * 0.1 : parent.height * 0.7
    handle: Rectangle{implicitHeight: 4; implicitWidth: 4; color: Qt.darker(colorLight)}

    property alias outputTextAlias: outputTxt.text
    property alias nohitTextAlias: nohitsTxt.text
    property alias nohitArea: nohitsArea
    property alias outputAreaAlias: outputArea


    Rectangle{
        id: outputArea
        SplitView.preferredWidth: parent.width * 0.7
        color: colorDark

        Flickable{
            anchors.fill: parent
            anchors.margins: 5
            boundsBehavior: Flickable.StopAtBounds

            TextArea.flickable: TextArea{
                id: outputTxt
                textFormat: "RichText"
                readOnly: true
                selectByMouse: true
                selectByKeyboard: true
                font.family: "Consolas"; font.pointSize: 12; font.bold: true
                color: colorLight
                selectedTextColor: colorGrey
                selectionColor: colorBlue
                background:  Rectangle{color: "transparent"; radius: 2; border.color: outputTxt.focus ? colorBlue : "transparent"}

            }
        }
    }
    Rectangle{
        id: nohitsArea
        SplitView.preferredWidth: parent.width * 0.3
        color: colorDark

        Flickable{
            anchors.fill: parent
            anchors.margins: 5
            boundsBehavior: Flickable.StopAtBounds

            TextArea.flickable: TextArea{
                id: nohitsTxt
                textFormat: "RichText"
                readOnly: true
                selectByMouse: true
                selectByKeyboard: true
                font.family: "Consolas"; font.pointSize: 12; font.bold: true
                color: Qt.darker(colorLight)
                selectedTextColor: colorGrey
                selectionColor: colorBlue
                background:  Rectangle{color: "transparent"; radius: 2; border.color: nohitsTxt.focus ? colorBlue : "transparent"}
            }

        }
    }
}
