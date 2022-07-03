cmake_minimum_required(VERSION 3.16)

project(AbuseLookup VERSION 0.1 LANGUAGES CXX)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(app_icon_resource_windows "${CMAKE_CURRENT_SOURCE_DIR}/icon.rc")

find_package(Qt6 6.2 COMPONENTS Quick REQUIRED)

qt_add_executable(appAbuseLookup
    main.cpp res.qrc ${app_icon_resource_windows}
)

qt_add_qml_module(appAbuseLookup
    URI AbuseLookup
    VERSION 1.0
    QML_FILES main.qml About.qml Header.qml Output.qml api.js
)

set_target_properties(appAbuseLookup PROPERTIES
    MACOSX_BUNDLE_GUI_IDENTIFIER my.example.com
    MACOSX_BUNDLE_BUNDLE_VERSION ${PROJECT_VERSION}
    MACOSX_BUNDLE_SHORT_VERSION_STRING ${PROJECT_VERSION_MAJOR}.${PROJECT_VERSION_MINOR}
    MACOSX_BUNDLE TRUE
    WIN32_EXECUTABLE TRUE
)

target_compile_definitions(appAbuseLookup
    PRIVATE $<$<OR:$<CONFIG:Debug>,$<CONFIG:RelWithDebInfo>>:QT_QML_DEBUG>)
target_link_libraries(appAbuseLookup
    PRIVATE Qt6::Quick)
