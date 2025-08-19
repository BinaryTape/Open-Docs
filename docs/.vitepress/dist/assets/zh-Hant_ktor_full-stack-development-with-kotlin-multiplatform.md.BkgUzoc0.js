import{_ as M,a as x,b as P,c as I,d as z,e as j,f as K,g as D,h as O,i as R,j as H,k as B,l as N,m as U}from"./chunks/full_stack_development_tutorial_update_task.Cf-lbZdc.js";import{_ as E,C as a,c as L,o as J,G as l,w as i,j as o,a as n}from"./chunks/framework.Bksy39di.js";const Z=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"zh-Hant/ktor/full-stack-development-with-kotlin-multiplatform.md","filePath":"zh-Hant/ktor/full-stack-development-with-kotlin-multiplatform.md","lastUpdated":1755457140000}'),W={name:"zh-Hant/ktor/full-stack-development-with-kotlin-multiplatform.md"};function F(G,t,q,V,$,X){const T=a("show-structure"),v=a("web-summary"),w=a("link-summary"),C=a("card-summary"),m=a("Links"),b=a("tldr"),f=a("list"),d=a("chapter"),e=a("step"),u=a("ui-path"),g=a("control"),p=a("procedure"),r=a("Path"),s=a("code-block"),k=a("tab"),y=a("tabs"),A=a("note"),S=a("topic");return J(),L("div",null,[l(S,{"xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","xsi:noNamespaceSchemaLocation":"https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd",title:"使用 Kotlin 多平台建置全端應用程式",id:"full-stack-development-with-kotlin-multiplatform"},{default:i(()=>[l(T,{for:"chapter, procedure",depth:"2"}),l(v,null,{default:i(()=>t[0]||(t[0]=[n(" 瞭解如何在 Kotlin 和 Ktor 中開發跨平台全端應用程式。在本教學中，您將 探索如何使用 Kotlin 多平台為 Android、iOS 和桌面平台建置應用程式，並使用 Ktor 輕鬆處理資料。 ")])),_:1}),l(w,null,{default:i(()=>t[1]||(t[1]=[n(" 瞭解如何在 Kotlin 和 Ktor 中開發跨平台全端應用程式。 ")])),_:1}),l(C,null,{default:i(()=>t[2]||(t[2]=[n(" 瞭解如何在 Kotlin 和 Ktor 中開發跨平台全端應用程式。 ")])),_:1}),l(b,null,{default:i(()=>[t[14]||(t[14]=o("p",null,[o("b",null,"程式碼範例"),n(": "),o("a",{href:"https://github.com/ktorio/ktor-documentation/tree/3.2.3/codeSnippets/snippets/full-stack-task-manager"}," full-stack-task-manager ")],-1)),o("p",null,[t[5]||(t[5]=o("b",null,"使用的外掛程式",-1)),t[6]||(t[6]=n(": ")),l(m,{href:"/ktor/server-routing",summary:"路由 (Routing) 是伺服器應用程式中用於處理傳入請求的核心外掛程式。"},{default:i(()=>t[3]||(t[3]=[n("Routing")])),_:1}),t[7]||(t[7]=n("、 ")),t[8]||(t[8]=o("a",{href:"https://kotlinlang.org/api/kotlinx.serialization/"},"kotlinx.serialization",-1)),t[9]||(t[9]=n("、 ")),l(m,{href:"/ktor/server-serialization",summary:"ContentNegotiation 外掛程式有兩個主要目的：在用戶端與伺服器之間協商媒體類型，並以特定格式序列化/反序列化內容。"},{default:i(()=>t[4]||(t[4]=[n("Content Negotiation")])),_:1}),t[10]||(t[10]=n("、 ")),t[11]||(t[11]=o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform",-1)),t[12]||(t[12]=n("、 ")),t[13]||(t[13]=o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"},"Kotlin Multiplatform",-1))])]),_:1}),t[310]||(t[310]=o("p",null," 在本文中，您將學習如何使用 Kotlin 開發一個全端應用程式，它可以在 Android、iOS 和桌面平台運行，同時利用 Ktor 進行無縫資料處理。 ",-1)),t[311]||(t[311]=o("p",null,"完成本教學後，您將了解如何執行以下操作：",-1)),l(f,null,{default:i(()=>t[15]||(t[15]=[o("li",null,[n("使用 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"}," Kotlin Multiplatform"),n(" 建立全端應用程式。 ")],-1),o("li",null,"理解使用 IntelliJ IDEA 產生的專案。",-1),o("li",null,[n("建立呼叫 Ktor 服務的 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),n(" 用戶端。 ")],-1),o("li",null,"在設計的不同層級之間重複使用共享類型。",-1),o("li",null,"正確包含和配置多平台函式庫。",-1)])),_:1}),o("p",null,[t[19]||(t[19]=n(" 在之前的教學中，我們使用任務管理器 (Task Manager) 範例來 ")),l(m,{href:"/ktor/server-requests-and-responses",summary:"透過建置任務管理器應用程式，學習使用 Kotlin 和 Ktor 進行路由、處理請求和參數的基本知識。"},{default:i(()=>t[16]||(t[16]=[n("處理請求")])),_:1}),t[20]||(t[20]=n("、 ")),l(m,{href:"/ktor/server-create-restful-apis",summary:"學習如何使用 Kotlin 和 Ktor 建置後端服務，其中包含產生 JSON 檔案的 RESTful API 範例。"},{default:i(()=>t[17]||(t[17]=[n("建立 RESTful API")])),_:1}),t[21]||(t[21]=n("，以及 ")),l(m,{href:"/ktor/server-integrate-database",summary:"學習將 Ktor 服務連接到 Exposed SQL 函式庫資料庫儲存庫的過程。"},{default:i(()=>t[18]||(t[18]=[n("整合 Exposed 資料庫")])),_:1}),t[22]||(t[22]=n("。 用戶端應用程式盡可能保持簡約，以便您能專注於學習 Ktor 的基礎知識。 "))]),t[312]||(t[312]=o("p",null," 您將建立一個針對 Android、iOS 和桌面平台的用戶端，使用 Ktor 服務來 獲取要顯示的資料。在可能的情況下，您將在用戶端和伺服器之間共享資料類型， 加快開發速度並減少潛在錯誤。 ",-1)),l(d,{title:"先決條件",id:"prerequisites"},{default:i(()=>t[23]||(t[23]=[o("p",null,[n(" 與之前的文章一樣，您將使用 IntelliJ IDEA 作為 IDE。要安裝和配置您的 環境，請參閱 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html"}," Kotlin Multiplatform 快速入門 "),n(" 指南。 ")],-1),o("p",null,[n(" 如果這是您第一次使用 Compose Multiplatform，我們建議您先完成 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html"}," Compose Multiplatform 入門 "),n(" 教學，再開始本教學。為了降低任務的複雜性，您可以專注於單一用戶端平台。例如，如果您從未使用過 iOS，那麼專注於桌面或 Android 開發可能更明智。 ")],-1)])),_:1}),l(d,{title:"建立新專案",id:"create-project"},{default:i(()=>[t[54]||(t[54]=o("p",null,[n(" 請改用 IntelliJ IDEA 中的 Kotlin Multiplatform 專案精靈，而非 Ktor 專案產生器。 它將建立一個基本的多平台專案，您可以擴展該專案以包含 用戶端和服務。用戶端既可以使用原生 UI 函式庫，例如 SwiftUI，但在本教學中 您將透過使用 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"},"Compose Multiplatform"),n(" 為所有平台建立共享 UI。 ")],-1)),l(p,{id:"generate-project"},{default:i(()=>[l(e,null,{default:i(()=>t[24]||(t[24]=[n(" 啟動 IntelliJ IDEA。 ")])),_:1}),l(e,null,{default:i(()=>[t[26]||(t[26]=n(" 在 IntelliJ IDEA 中，選擇 ")),l(u,null,{default:i(()=>t[25]||(t[25]=[n("File | New | Project")])),_:1}),t[27]||(t[27]=n(" 。 "))]),_:1}),l(e,null,{default:i(()=>[t[29]||(t[29]=n(" 在左側面板中，選擇 ")),l(u,null,{default:i(()=>t[28]||(t[28]=[n("Kotlin Multiplatform")])),_:1}),t[30]||(t[30]=n(" 。 "))]),_:1}),l(e,null,{default:i(()=>[t[36]||(t[36]=n(" 在 ")),l(u,null,{default:i(()=>t[31]||(t[31]=[n("New Project")])),_:1}),t[37]||(t[37]=n(" 視窗中指定以下欄位： ")),l(f,null,{default:i(()=>[o("li",null,[l(u,null,{default:i(()=>t[32]||(t[32]=[n("Name")])),_:1}),t[33]||(t[33]=n(" : full-stack-task-manager "))]),o("li",null,[l(u,null,{default:i(()=>t[34]||(t[34]=[n("Group")])),_:1}),t[35]||(t[35]=n(" : com.example.ktor "))])]),_:1})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[41]||(t[41]=n(" 選擇 ")),l(u,null,{default:i(()=>t[38]||(t[38]=[n("Android")])),_:1}),t[42]||(t[42]=n(" 、 ")),l(u,null,{default:i(()=>t[39]||(t[39]=[n("Desktop")])),_:1}),t[43]||(t[43]=n(" 和 ")),l(u,null,{default:i(()=>t[40]||(t[40]=[n("Server")])),_:1}),t[44]||(t[44]=n(" 作為目標平台。 "))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[47]||(t[47]=n(" 如果您使用的是 Mac，也請選擇 ")),l(u,null,{default:i(()=>t[45]||(t[45]=[n("iOS")])),_:1}),t[48]||(t[48]=n(" 。確保已選取 ")),l(u,null,{default:i(()=>t[46]||(t[46]=[n("Share UI")])),_:1}),t[49]||(t[49]=n(" 選項。 ")),t[50]||(t[50]=o("img",{style:{},src:M,alt:"Kotlin Multiplatform 精靈設定",width:"706","border-effect":"rounded"},null,-1))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[52]||(t[52]=n(" 按一下 ")),l(g,null,{default:i(()=>t[51]||(t[51]=[n("Create")])),_:1}),t[53]||(t[53]=n(" 按鈕，等待 IDE 產生並匯入專案。 "))])]),_:1})]),_:1})]),_:1}),l(d,{title:"執行服務",id:"run-service"},{default:i(()=>[l(p,{id:"run-service-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[58]||(t[58]=n(" 在 ")),l(u,null,{default:i(()=>t[55]||(t[55]=[n("Project")])),_:1}),t[59]||(t[59]=n(" 視圖中，導覽至 ")),l(r,null,{default:i(()=>t[56]||(t[56]=[n("server/src/main/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[60]||(t[60]=n(" 並開啟 ")),l(r,null,{default:i(()=>t[57]||(t[57]=[n("Application.kt")])),_:1}),t[61]||(t[61]=n(" 檔案。 "))]),_:1}),l(e,null,{default:i(()=>[t[67]||(t[67]=n(" 按一下 ")),l(u,null,{default:i(()=>t[62]||(t[62]=[n("Run")])),_:1}),t[68]||(t[68]=n(" 按鈕 (")),t[69]||(t[69]=o("img",{src:x,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 執行圖示"},null,-1)),t[70]||(t[70]=n(") 在 ")),t[71]||(t[71]=o("code",null,"main()",-1)),t[72]||(t[72]=n(" 函式旁邊以啟動應用程式。 ")),o("p",null,[l(u,null,{default:i(()=>t[63]||(t[63]=[n("Run")])),_:1}),t[64]||(t[64]=n(" 工具視窗中將開啟一個新分頁，日誌結尾顯示訊息「Responding at ")),t[65]||(t[65]=o("a",{href:"http://0.0.0.0:8080",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080",-1)),t[66]||(t[66]=n("」。 "))])]),_:1}),l(e,null,{default:i(()=>t[73]||(t[73]=[o("p",null,[n(" 導覽至 "),o("a",{href:"http://0.0.0.0:8080/"},[o("a",{href:"http://0.0.0.0:8080/",target:"_blank",rel:"noreferrer"},"http://0.0.0.0:8080/")]),n(" 以開啟應用程式。 您應該會在瀏覽器中看到 Ktor 顯示的訊息。 "),o("img",{src:P,alt:"Ktor 伺服器瀏覽器回應",width:"706","border-effect":"rounded",style:{}})],-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"檢查專案",id:"examine-project"},{default:i(()=>[o("p",null,[l(r,null,{default:i(()=>t[74]||(t[74]=[n("server")])),_:1}),t[77]||(t[77]=n(" 資料夾是專案中三個 Kotlin 模組之一。另外兩個是 ")),l(r,null,{default:i(()=>t[75]||(t[75]=[n("shared")])),_:1}),t[78]||(t[78]=n(" 和 ")),l(r,null,{default:i(()=>t[76]||(t[76]=[n("composeApp")])),_:1}),t[79]||(t[79]=n(" 。 "))]),o("p",null,[l(r,null,{default:i(()=>t[80]||(t[80]=[n("server")])),_:1}),t[81]||(t[81]=n(" 模組的結構與 ")),t[82]||(t[82]=o("a",{href:"https://start.ktor.io/"},"Ktor Project Generator",-1)),t[83]||(t[83]=n(" 產生的結構非常相似。 您有一個專用的建置檔案來 宣告外掛程式和相依性，以及一個包含用於建置和啟動 Ktor 服務的程式碼來源集： "))]),t[129]||(t[129]=o("img",{src:I,alt:"Kotlin Multiplatform 專案中伺服器資料夾的內容",width:"300","border-effect":"line"},null,-1)),o("p",null,[t[85]||(t[85]=n(" 如果您查看 ")),l(r,null,{default:i(()=>t[84]||(t[84]=[n("Application.kt")])),_:1}),t[86]||(t[86]=n(" 檔案中的路由指令，您將看到對 ")),t[87]||(t[87]=o("code",null,"greet()",-1)),t[88]||(t[88]=n(" 函式的呼叫： "))]),l(s,{lang:"kotlin",code:`            fun Application.module() {
                routing {
                    get("/") {
                        call.respondText("Ktor: \${Greeting().greet()}")
                    }
                }
            }`}),o("p",null,[t[90]||(t[90]=n(" 這會建立一個 ")),t[91]||(t[91]=o("code",null,"Greeting",-1)),t[92]||(t[92]=n(" 類型的實例並調用其 ")),t[93]||(t[93]=o("code",null,"greet()",-1)),t[94]||(t[94]=n(" 方法。 ")),t[95]||(t[95]=o("code",null,"Greeting",-1)),t[96]||(t[96]=n(" 類別定義在 ")),l(r,null,{default:i(()=>t[89]||(t[89]=[n("shared")])),_:1}),t[97]||(t[97]=n(" 模組中： ")),t[98]||(t[98]=o("img",{src:z,alt:"Greeting.kt 和 Platform.kt 在 IntelliJ IDEA 中開啟",width:"706","border-effect":"line",style:{}},null,-1))]),o("p",null,[l(r,null,{default:i(()=>t[99]||(t[99]=[n("shared")])),_:1}),t[100]||(t[100]=n(" 模組包含將在不同目標平台中使用的程式碼。 "))]),o("p",null,[l(r,null,{default:i(()=>t[101]||(t[101]=[n("shared")])),_:1}),t[103]||(t[103]=n(" 模組集中的 ")),l(r,null,{default:i(()=>t[102]||(t[102]=[n("commonMain")])),_:1}),t[104]||(t[104]=n(" 來源集保存著將在所有平台中使用的類型。 如您所見，這就是 ")),t[105]||(t[105]=o("code",null,"Greeting",-1)),t[106]||(t[106]=n(" 類型定義的地方。 這也是您將放置伺服器和所有不同用戶端平台之間共享的通用程式碼的地方。 "))]),o("p",null,[l(r,null,{default:i(()=>t[107]||(t[107]=[n("shared")])),_:1}),t[109]||(t[109]=n(" 模組還包含您希望提供用戶端的每個平台的來源集。這是因為 在 ")),l(r,null,{default:i(()=>t[108]||(t[108]=[n("commonMain")])),_:1}),t[110]||(t[110]=n(" 中宣告的類型可能需要因目標平台而異的功能。對於 ")),t[111]||(t[111]=o("code",null,"Greeting",-1)),t[112]||(t[112]=n(" 類型，您希望使用平台特定 API 獲取當前平台的名稱。 這透過 ")),t[113]||(t[113]=o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html"},"預期 (expected) 和實際 (actual) 宣告",-1)),t[114]||(t[114]=n("實現。 "))]),o("p",null,[t[117]||(t[117]=n(" 在 ")),l(r,null,{default:i(()=>t[115]||(t[115]=[n("shared")])),_:1}),t[118]||(t[118]=n(" 模組的 ")),l(r,null,{default:i(()=>t[116]||(t[116]=[n("commonMain")])),_:1}),t[119]||(t[119]=n(" 來源集中，您使用 ")),t[120]||(t[120]=o("code",null,"expect",-1)),t[121]||(t[121]=n(" 關鍵字宣告 ")),t[122]||(t[122]=o("code",null,"getPlatform()",-1)),t[123]||(t[123]=n(" 函式： "))]),l(y,null,{default:i(()=>[l(k,{title:"commonMain/Platform.kt",id:"commonMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform`})]),_:1})]),_:1}),t[130]||(t[130]=o("p",null,[n("然後每個目標平台 必須提供 "),o("code",null,"getPlatform()"),n(" 函式的 "),o("code",null,"actual"),n(" 宣告，如下所示： ")],-1)),l(y,null,{default:i(()=>[l(k,{title:"Platform.ios.kt",id:"iosMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import platform.UIKit.UIDevice

class IOSPlatform: Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
}

actual fun getPlatform(): Platform = IOSPlatform()`})]),_:1}),l(k,{title:"Platform.android.kt",id:"androidMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android \${Build.VERSION.SDK_INT}"
}

actual fun getPlatform(): Platform = AndroidPlatform()`})]),_:1}),l(k,{title:"Platform.jvm.kt",id:"jvmMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

class JVMPlatform: Platform {
    override val name: String = "Java \${System.getProperty("java.version")}"
}

actual fun getPlatform(): Platform = JVMPlatform()`})]),_:1}),l(k,{title:"Platform.wasmJs.kt",id:"wasmJsMain"},{default:i(()=>[l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

class WasmPlatform : Platform {
    override val name: String = "Web with Kotlin/Wasm"
}

actual fun getPlatform(): Platform = WasmPlatform()`})]),_:1})]),_:1}),o("p",null,[t[125]||(t[125]=n(" 專案中還有一個額外的模組，即 ")),l(r,null,{default:i(()=>t[124]||(t[124]=[n("composeApp")])),_:1}),t[126]||(t[126]=n(" 模組。 它包含 Android、iOS、桌面和網頁用戶端應用程式的程式碼。 這些應用程式目前未連結到 Ktor 服務，但它們確實使用了共享的 ")),t[127]||(t[127]=o("code",null,"Greeting",-1)),t[128]||(t[128]=n(" 類別。 "))])]),_:1}),l(d,{title:"執行用戶端應用程式",id:"run-client-app"},{default:i(()=>[t[145]||(t[145]=o("p",null," 您可以透過執行目標的執行設定來執行用戶端應用程式。要在 iOS 模擬器上運行 應用程式，請按照以下步驟操作： ",-1)),l(p,{id:"run-ios-app-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[132]||(t[132]=n(" 在 IntelliJ IDEA 中，選擇 ")),l(r,null,{default:i(()=>t[131]||(t[131]=[n("iosApp")])),_:1}),t[133]||(t[133]=n(" 執行設定和一個模擬裝置。 ")),t[134]||(t[134]=o("img",{src:j,alt:"執行與偵錯視窗",width:"400","border-effect":"line",style:{}},null,-1))]),_:1}),l(e,null,{default:i(()=>[t[136]||(t[136]=n(" 按一下 ")),l(u,null,{default:i(()=>t[135]||(t[135]=[n("Run")])),_:1}),t[137]||(t[137]=n(" 按鈕 (")),t[138]||(t[138]=o("img",{src:x,style:{},height:"16",width:"16",alt:"IntelliJ IDEA 執行圖示"},null,-1)),t[139]||(t[139]=n(") 來執行設定。 "))]),_:1}),l(e,null,{default:i(()=>[t[143]||(t[143]=o("p",null,[n(" 當您執行 iOS 應用程式時，它會在幕後使用 Xcode 建置，並在 iOS 模擬器中啟動。 應用程式會顯示一個按鈕，點擊時會切換圖片。 "),o("img",{style:{},src:K,alt:"在 iOS 模擬器中執行應用程式",width:"300","border-effect":"rounded"})],-1)),o("p",null,[t[141]||(t[141]=n(" 首次按下按鈕時，會將當前平台的詳細資訊新增到其文字中。實現此目的的程式碼位於 ")),l(r,null,{default:i(()=>t[140]||(t[140]=[n("composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt")])),_:1}),t[142]||(t[142]=n(" ： "))]),l(s,{lang:"kotlin",code:`            @Composable
            fun App() {
                MaterialTheme {
                    var greetingText by remember { mutableStateOf("Hello World!") }
                    var showImage by remember { mutableStateOf(false) }
                    Column(
                        Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Button(onClick = {
                            greetingText = "Compose: \${Greeting().greet()}"
                            showImage = !showImage
                        }) {
                            Text(greetingText)
                        }
                        AnimatedVisibility(showImage) {
                            Image(
                                painterResource(Res.drawable.compose_multiplatform),
                                null
                            )
                        }
                    }
                }
            }`}),t[144]||(t[144]=o("p",null,[n(" 這是一個可組合函式，您將在本文稍後修改它。目前重要的是它會顯示一個 UI，並使用共享的 "),o("code",null,"Greeting"),n(" 類型，而 "),o("code",null,"Greeting"),n(" 類型又使用了實現通用 "),o("code",null,"Platform"),n(" 介面的平台特定類別。 ")],-1))]),_:1})]),_:1}),t[146]||(t[146]=o("p",null," 現在您已了解生成專案的結構，您可以逐步新增任務 管理員功能。 ",-1))]),_:1}),l(d,{title:"新增模型類型",id:"add-model-types"},{default:i(()=>[t[176]||(t[176]=o("p",null," 首先，新增模型類型並確保用戶端和伺服器都可以存取它們。 ",-1)),l(p,{id:"add-model-types-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[149]||(t[149]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[147]||(t[147]=[n("shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[150]||(t[150]=n(" 並建立一個名為 ")),l(r,null,{default:i(()=>t[148]||(t[148]=[n("model")])),_:1}),t[151]||(t[151]=n(" 的新套件。 "))]),_:1}),l(e,null,{default:i(()=>[t[153]||(t[153]=n(" 在新套件內，建立一個名為 ")),l(r,null,{default:i(()=>t[152]||(t[152]=[n("Task.kt")])),_:1}),t[154]||(t[154]=n(" 的新檔案。 "))]),_:1}),l(e,null,{default:i(()=>[t[155]||(t[155]=o("p",null,[n(" 新增一個 "),o("code",null,"enum"),n(" 來表示優先級，以及一個 "),o("code",null,"class"),n(" 來表示任務。 "),o("code",null,"Task"),n(" 類別使用 "),o("code",null,"kotlinx.serialization"),n(" 函式庫中的 "),o("code",null,"Serializable"),n(" 類型進行註解： ")],-1)),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

import kotlinx.serialization.Serializable

enum class Priority {
    Low, Medium, High, Vital
}

@Serializable
data class Task(
    val name: String,
    val description: String,
    val priority: Priority
)`}),t[156]||(t[156]=o("p",null,[n(" 您會注意到匯入和註解都無法編譯。這是因為專案尚未 對 "),o("code",null,"kotlinx.serialization"),n(" 函式庫有相依性。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[158]||(t[158]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[157]||(t[157]=[n("shared/build.gradle.kts")])),_:1}),t[159]||(t[159]=n(" 並新增序列化外掛程式： "))]),l(s,{lang:"kotlin",code:`plugins {
    //...
    kotlin("plugin.serialization") version "2.1.21"
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[161]||(t[161]=n(" 在同一個檔案中，為 ")),l(r,null,{default:i(()=>t[160]||(t[160]=[n("commonMain")])),_:1}),t[162]||(t[162]=n(" 來源集新增一個相依性： "))]),l(s,{lang:"kotlin",code:`    sourceSets {
        commonMain.dependencies {
            // put your Multiplatform dependencies here
            implementation(libs.kotlinx.serialization.json)
        }
        //...
    }`})]),_:1}),l(e,null,{default:i(()=>[t[164]||(t[164]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[163]||(t[163]=[n("gradle/libs.versions.toml")])),_:1}),t[165]||(t[165]=n(" 並定義以下內容： ")),l(s,{lang:"toml",code:`[versions]
kotlinxSerializationJson = "1.8.1"

[libraries]
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinxSerializationJson" }`})]),_:1}),l(e,null,{default:i(()=>[t[168]||(t[168]=n(" 在 IntelliJ IDEA 中，選擇 ")),l(u,null,{default:i(()=>t[166]||(t[166]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[169]||(t[169]=n(" 以套用更新。一旦 Gradle 匯入完成，您應該會發現您的 ")),l(r,null,{default:i(()=>t[167]||(t[167]=[n("Task.kt")])),_:1}),t[170]||(t[170]=n(" 檔案成功編譯。 "))]),_:1})]),_:1}),t[177]||(t[177]=o("p",null,[n(" 請注意，如果沒有包含序列化外掛程式，程式碼也能夠編譯，然而， 透過網路序列化 "),o("code",null,"Task"),n(" 物件所需的類型將不會產生。這會導致在嘗試調用服務時出現執行時期錯誤。 ")],-1)),o("p",null,[t[173]||(t[173]=n(" 將序列化外掛程式放置在另一個模組（例如 ")),l(r,null,{default:i(()=>t[171]||(t[171]=[n("server")])),_:1}),t[174]||(t[174]=n(" 或 ")),l(r,null,{default:i(()=>t[172]||(t[172]=[n("composeApp")])),_:1}),t[175]||(t[175]=n(" ）不會在建置時期造成錯誤。但同樣地，序列化所需的額外類型將不會產生，導致執行時期錯誤。 "))])]),_:1}),l(d,{title:"建立伺服器",id:"create-server"},{default:i(()=>[t[211]||(t[211]=o("p",null," 下一個階段是為我們的任務管理器建立伺服器實作。 ",-1)),l(p,{id:"create-server-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[180]||(t[180]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[178]||(t[178]=[n("server/src/main/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[181]||(t[181]=n(" 資料夾並建立一個名為 ")),l(r,null,{default:i(()=>t[179]||(t[179]=[n("model")])),_:1}),t[182]||(t[182]=n(" 的子套件。 "))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[184]||(t[184]=n(" 在此套件內，建立一個新的 ")),l(r,null,{default:i(()=>t[183]||(t[183]=[n("TaskRepository.kt")])),_:1}),t[185]||(t[185]=n(" 檔案並為我們的儲存庫新增以下介面： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

interface TaskRepository {
    fun allTasks(): List<Task>
    fun tasksByPriority(priority: Priority): List<Task>
    fun taskByName(name: String): Task?
    fun addOrUpdateTask(task: Task)
    fun removeTask(name: String): Boolean
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[187]||(t[187]=n(" 在同一個套件中，建立一個名為 ")),l(r,null,{default:i(()=>t[186]||(t[186]=[n("InMemoryTaskRepository.kt")])),_:1}),t[188]||(t[188]=n(" 的新檔案，其中包含以下類別： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.model

class InMemoryTaskRepository : TaskRepository {
    private var tasks = listOf(
        Task("Cleaning", "Clean the house", Priority.Low),
        Task("Gardening", "Mow the lawn", Priority.Medium),
        Task("Shopping", "Buy the groceries", Priority.High),
        Task("Painting", "Paint the fence", Priority.Low),
        Task("Cooking", "Cook the dinner", Priority.Medium),
        Task("Relaxing", "Take a walk", Priority.High),
        Task("Exercising", "Go to the gym", Priority.Low),
        Task("Learning", "Read a book", Priority.Medium),
        Task("Snoozing", "Go for a nap", Priority.High),
        Task("Socializing", "Go to a party", Priority.High)
    )

    override fun allTasks(): List<Task> = tasks

    override fun tasksByPriority(priority: Priority) = tasks.filter {
        it.priority == priority
    }

    override fun taskByName(name: String) = tasks.find {
        it.name.equals(name, ignoreCase = true)
    }

    override fun addOrUpdateTask(task: Task) {
        var notFound = true

        tasks = tasks.map {
            if (it.name == task.name) {
                notFound = false
                task
            } else {
                it
            }
        }
        if (notFound) {
            tasks = tasks.plus(task)
        }
    }

    override fun removeTask(name: String): Boolean {
        val oldTasks = tasks
        tasks = tasks.filterNot { it.name == name }
        return oldTasks.size > tasks.size
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[190]||(t[190]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[189]||(t[189]=[n("server/src/main/kotlin/.../Application.kt")])),_:1}),t[191]||(t[191]=n(" 並將現有程式碼替換為以下實作： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.model.InMemoryTaskRepository
import com.example.ktor.full_stack_task_manager.model.Priority
import com.example.ktor.full_stack_task_manager.model.Task
import io.ktor.http.*
import io.ktor.serialization.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    embeddedServer(Netty, port = SERVER_PORT, host = "0.0.0.0", module = Application::module)
        .start(wait = true)
}

fun Application.module() {
    install(ContentNegotiation) {
        json()
    }
    install(CORS) {
        allowHeader(HttpHeaders.ContentType)
        allowMethod(HttpMethod.Delete)
        // For ease of demonstration we allow any connections.
        // Don't do this in production.
        anyHost()
    }
    val repository = InMemoryTaskRepository()

    routing {
        route("/tasks") {
            get {
                val tasks = repository.allTasks()
                call.respond(tasks)
            }
            get("/byName/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                val task = repository.taskByName(name)
                if (task == null) {
                    call.respond(HttpStatusCode.NotFound)
                    return@get
                }
                call.respond(task)
            }
            get("/byPriority/{priority}") {
                val priorityAsText = call.parameters["priority"]
                if (priorityAsText == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@get
                }
                try {
                    val priority = Priority.valueOf(priorityAsText)
                    val tasks = repository.tasksByPriority(priority)


                    if (tasks.isEmpty()) {
                        call.respond(HttpStatusCode.NotFound)
                        return@get
                    }
                    call.respond(tasks)
                } catch (ex: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
            post {
                try {
                    val task = call.receive<Task>()
                    repository.addOrUpdateTask(task)
                    call.respond(HttpStatusCode.NoContent)
                } catch (ex: IllegalStateException) {
                    call.respond(HttpStatusCode.BadRequest)
                } catch (ex: JsonConvertException) {
                    call.respond(HttpStatusCode.BadRequest)
                }
            }
            delete("/{taskName}") {
                val name = call.parameters["taskName"]
                if (name == null) {
                    call.respond(HttpStatusCode.BadRequest)
                    return@delete
                }
                if (repository.removeTask(name)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}`}),t[195]||(t[195]=o("p",null,[n(" 此實作與之前的教學非常相似，不同之處在於，為了簡化起見，現在您已將所有路由程式碼放置在 "),o("code",null,"Application.module()"),n(" 函式中。 ")],-1)),o("p",null,[t[193]||(t[193]=n(" 輸入此程式碼並新增匯入後，您將發現多個編譯器錯誤，因為程式碼使用了多個需要包含為相依性的 Ktor 外掛程式， 包括用於與網頁用戶端互動的 ")),l(m,{href:"/ktor/server-cors",summary:"所需相依性：io.ktor:%artifact_name% 程式碼範例：full-stack-task-manager 原生伺服器支援：✅"},{default:i(()=>t[192]||(t[192]=[n("CORS")])),_:1}),t[194]||(t[194]=n(" 外掛程式。 "))])]),_:1}),l(e,null,{default:i(()=>[t[197]||(t[197]=n(" 開啟 ")),l(r,null,{default:i(()=>t[196]||(t[196]=[n("gradle/libs.versions.toml")])),_:1}),t[198]||(t[198]=n(" 檔案並定義以下函式庫： ")),l(s,{lang:"toml",code:`[libraries]
ktor-serialization-kotlinx-json-jvm = { module = "io.ktor:ktor-serialization-kotlinx-json-jvm", version.ref = "ktor" }
ktor-server-content-negotiation-jvm = { module = "io.ktor:ktor-server-content-negotiation-jvm", version.ref = "ktor" }
ktor-server-cors-jvm = { module = "io.ktor:ktor-server-cors-jvm", version.ref = "ktor" }`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[200]||(t[200]=n(" 開啟伺服器模組建置檔案 ( ")),l(r,null,{default:i(()=>t[199]||(t[199]=[n("server/build.gradle.kts")])),_:1}),t[201]||(t[201]=n(" ) 並新增以下相依性： "))]),l(s,{lang:"kotlin",code:`dependencies {
    //...
    implementation(libs.ktor.serialization.kotlinx.json.jvm)
    implementation(libs.ktor.server.content.negotiation.jvm)
    implementation(libs.ktor.server.cors.jvm)
}`})]),_:1}),l(e,null,{default:i(()=>[t[203]||(t[203]=n(" 再次從主功能表選擇 ")),l(u,null,{default:i(()=>t[202]||(t[202]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[204]||(t[204]=n("。 匯入完成後，您應該會發現 ")),t[205]||(t[205]=o("code",null,"ContentNegotiation",-1)),t[206]||(t[206]=n(" 類型和 ")),t[207]||(t[207]=o("code",null,"json()",-1)),t[208]||(t[208]=n(" 函式的匯入正常運作。 "))]),_:1}),l(e,null,{default:i(()=>t[209]||(t[209]=[n(" 重新執行伺服器。您應該會發現可以從瀏覽器存取路由。 ")])),_:1}),l(e,null,{default:i(()=>t[210]||(t[210]=[o("p",null,[n(" 導覽至 "),o("a",{href:"http://0.0.0.0:8080/tasks"}),n(" 和 "),o("a",{href:"http://0.0.0.0:8080/tasks/byPriority/Medium"}),n(" 以查看伺服器以 JSON 格式回應的任務。 "),o("img",{style:{},src:D,width:"707","border-effect":"rounded",alt:"瀏覽器中的伺服器回應"})],-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"建立用戶端",id:"create-client"},{default:i(()=>[t[272]||(t[272]=o("p",null," 為了讓您的用戶端能夠存取伺服器，您需要包含 Ktor Client。這涉及到三種類型的相依性： ",-1)),l(f,null,{default:i(()=>t[212]||(t[212]=[o("li",null,"Ktor Client 的核心功能。",-1),o("li",null,"用於處理網路連線的平台特定引擎。",-1),o("li",null,"內容協商和序列化的支援。",-1)])),_:1}),l(p,{id:"create-client-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[214]||(t[214]=n(" 在 ")),l(r,null,{default:i(()=>t[213]||(t[213]=[n("gradle/libs.versions.toml")])),_:1}),t[215]||(t[215]=n(" 檔案中，新增以下函式庫： ")),l(s,{lang:"toml",code:`[libraries]
ktor-client-android = { module = "io.ktor:ktor-client-android", version.ref = "ktor" }
ktor-client-cio = { module = "io.ktor:ktor-client-cio", version.ref = "ktor" }
ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
ktor-client-wasm = { module = "io.ktor:ktor-client-js-wasm-js", version.ref = "ktor"}
ktor-serialization-kotlinx-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }`})]),_:1}),l(e,null,{default:i(()=>[t[217]||(t[217]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[216]||(t[216]=[n("composeApp/build.gradle.kts")])),_:1}),t[218]||(t[218]=n(" 並新增以下相依性： ")),l(s,{lang:"kotlin",code:`kotlin {

    //...
    sourceSets {
        val desktopMain by getting
        
        androidMain.dependencies {
            //...
            implementation(libs.ktor.client.android)
        }
        commonMain.dependencies {
            //...
            implementation(libs.ktor.client.core)
            implementation(libs.ktor.client.content.negotiation)
            implementation(libs.ktor.serialization.kotlinx.json)
        }
        desktopMain.dependencies {
            //...
            implementation(libs.ktor.client.cio)
        }
        iosMain.dependencies {
            implementation(libs.ktor.client.darwin)
        }
        wasmJsMain.dependencies {
            implementation(libs.ktor.client.wasm)
        }
    }
}`}),t[219]||(t[219]=o("p",null,[n(" 完成此操作後，您可以為用戶端新增一個 "),o("code",null,"TaskApi"),n(" 類型，作為 Ktor Client 的輕量封裝。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[t[221]||(t[221]=n(" 從主功能表選擇 ")),l(u,null,{default:i(()=>t[220]||(t[220]=[n("Build | Sync Project with Gradle Files")])),_:1}),t[222]||(t[222]=n(" 以匯入建置檔案中的變更。 "))]),_:1}),l(e,null,{default:i(()=>[t[225]||(t[225]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[223]||(t[223]=[n("composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager")])),_:1}),t[226]||(t[226]=n(" 並建立一個名為 ")),l(r,null,{default:i(()=>t[224]||(t[224]=[n("network")])),_:1}),t[227]||(t[227]=n(" 的新套件。 "))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[229]||(t[229]=n(" 在新套件內，為用戶端配置建立一個新的 ")),l(r,null,{default:i(()=>t[228]||(t[228]=[n("HttpClientManager.kt")])),_:1}),t[230]||(t[230]=n(" ： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.network

import io.ktor.client.HttpClient
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

fun createHttpClient() = HttpClient {
    install(ContentNegotiation) {
        json(Json {
            encodeDefaults = true
            isLenient = true
            coerceInputValues = true
            ignoreUnknownKeys = true
        })
    }
    defaultRequest {
        host = "1.2.3.4"
        port = 8080
    }
}`}),t[231]||(t[231]=o("p",null,[n(" 請注意，您應該將 "),o("code",null,"1.2.3.4"),n(" 替換為您當前機器的 IP 位址。您將 無法從 Android 虛擬裝置或 iOS 模擬器上運行的程式碼向 "),o("code",null,"0.0.0.0"),n(" 或 "),o("code",null,"localhost"),n(" 發出呼叫。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[234]||(t[234]=n(" 在相同的 ")),l(r,null,{default:i(()=>t[232]||(t[232]=[n("composeApp/.../full_stack_task_manager/network")])),_:1}),t[235]||(t[235]=n(" 套件中，建立一個新的 ")),l(r,null,{default:i(()=>t[233]||(t[233]=[n("TaskApi.kt")])),_:1}),t[236]||(t[236]=n(" 檔案，並加入以下實作： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager.network

import com.example.ktor.full_stack_task_manager.model.Task
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType

class TaskApi(private val httpClient: HttpClient) {

    suspend fun getAllTasks(): List<Task> {
        return httpClient.get("tasks").body()
    }

    suspend fun removeTask(task: Task) {
        httpClient.delete("tasks/\${task.name}")
    }

    suspend fun updateTask(task: Task) {
        httpClient.post("tasks") {
            contentType(ContentType.Application.Json)
            setBody(task)
        }
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[238]||(t[238]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[237]||(t[237]=[n("commonMain/.../App.kt")])),_:1}),t[239]||(t[239]=n(" 並將現有的 App 可組合函式替換為以下實作。 這將使用 ")),t[240]||(t[240]=o("code",null,"TaskApi",-1)),t[241]||(t[241]=n(" 類型從伺服器檢索任務列表，然後 在欄位中顯示每個任務的名稱： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.network.TaskApi
import com.example.ktor.full_stack_task_manager.network.createHttpClient
import com.example.ktor.full_stack_task_manager.model.Task
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import kotlinx.coroutines.launch

@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        val tasks = remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()

        Column(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = {
                scope.launch {
                    tasks.value = taskApi.getAllTasks()
                }
            }) {
                Text("Fetch Tasks")
            }
            for (task in tasks.value) {
                Text(task.name)
            }
        }
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[243]||(t[243]=n(" 在伺服器運行時，透過執行 ")),l(u,null,{default:i(()=>t[242]||(t[242]=[n("iosApp")])),_:1}),t[244]||(t[244]=n(" 執行設定來測試 iOS 應用程式。 "))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[246]||(t[246]=n(" 按一下 ")),l(g,null,{default:i(()=>t[245]||(t[245]=[n("Fetch Tasks")])),_:1}),t[247]||(t[247]=n(" 按鈕以顯示任務列表： ")),t[248]||(t[248]=o("img",{style:{},src:O,alt:"應用程式在 iOS 上執行",width:"363","border-effect":"rounded"},null,-1))]),l(A,null,{default:i(()=>t[249]||(t[249]=[n(" 在此示範中，我們為求清晰而簡化了流程。在實際應用中，避免透過網路傳送未加密的資料至關重要。 ")])),_:1})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[251]||(t[251]=n(" 在 Android 平台上，您需要明確授予應用程式網路權限並 允許它以明文形式傳送和接收資料。要啟用這些權限，請開啟 ")),l(r,null,{default:i(()=>t[250]||(t[250]=[n("composeApp/src/androidMain/AndroidManifest.xml")])),_:1}),t[252]||(t[252]=n(" 並新增以下設定： "))]),l(s,{lang:"xml",code:`                    <manifest>
                        ...
                        <application
                                android:usesCleartextTraffic="true">
                        ...
                        ...
                        </application>
                        <uses-permission android:name="android.permission.INTERNET"/>
                    </manifest>`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[254]||(t[254]=n(" 使用 ")),l(u,null,{default:i(()=>t[253]||(t[253]=[n("composeApp")])),_:1}),t[255]||(t[255]=n(" 執行設定來執行 Android 應用程式。 您現在應該會發現您的 Android 用戶端也能運行： ")),t[256]||(t[256]=o("img",{style:{},src:R,alt:"應用程式在 Android 上執行",width:"350","border-effect":"rounded"},null,-1))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[258]||(t[258]=n(" 對於桌面用戶端，您應該為包含視窗指定尺寸和標題。 開啟 ")),l(r,null,{default:i(()=>t[257]||(t[257]=[n("composeApp/src/desktopMain/.../main.kt")])),_:1}),t[259]||(t[259]=n(" 檔案並透過更改 ")),t[260]||(t[260]=o("code",null,"title",-1)),t[261]||(t[261]=n(" 和設定 ")),t[262]||(t[262]=o("code",null,"state",-1)),t[263]||(t[263]=n(" 屬性來修改程式碼： "))]),l(s,{lang:"kotlin",code:`package com.example.ktor.full_stack_task_manager

import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    val state = WindowState(
        size = DpSize(400.dp, 600.dp),
        position = WindowPosition(200.dp, 100.dp)
    )
    Window(
        title = "Task Manager (Desktop)",
        state = state,
        onCloseRequest = ::exitApplication
    ) {
        App()
    }
}`})]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[265]||(t[265]=n(" 使用 ")),l(u,null,{default:i(()=>t[264]||(t[264]=[n("composeApp [desktop]")])),_:1}),t[266]||(t[266]=n(" 執行設定來執行桌面應用程式： ")),t[267]||(t[267]=o("img",{style:{},src:H,alt:"應用程式在桌面上執行",width:"400","border-effect":"rounded"},null,-1))])]),_:1}),l(e,null,{default:i(()=>[o("p",null,[t[269]||(t[269]=n(" 使用 ")),l(u,null,{default:i(()=>t[268]||(t[268]=[n("composeApp [wasmJs]")])),_:1}),t[270]||(t[270]=n(" 執行設定來執行網頁用戶端： "))]),t[271]||(t[271]=o("img",{style:{},src:B,alt:"應用程式在桌面上執行",width:"400","border-effect":"rounded"},null,-1))]),_:1})]),_:1})]),_:1}),l(d,{title:"改進使用者介面 (UI)",id:"improve-ui"},{default:i(()=>[t[288]||(t[288]=o("p",null," 用戶端現在正在與伺服器通訊，但這很難說是一個美觀的 UI。 ",-1)),l(p,{id:"improve-ui-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[o("p",null,[t[275]||(t[275]=n(" 開啟位於 ")),l(r,null,{default:i(()=>t[273]||(t[273]=[n("composeApp/src/commonMain/.../full_stack_task_manager")])),_:1}),t[276]||(t[276]=n(" 中的 ")),l(r,null,{default:i(()=>t[274]||(t[274]=[n("App.kt")])),_:1}),t[277]||(t[277]=n(" 檔案，並將現有的 ")),t[278]||(t[278]=o("code",null,"App",-1)),t[279]||(t[279]=n(" 替換為以下的 ")),t[280]||(t[280]=o("code",null,"App",-1)),t[281]||(t[281]=n(" 和 ")),t[282]||(t[282]=o("code",null,"TaskCard",-1)),t[283]||(t[283]=n(" 可組合函式： "))]),l(s,{lang:"kotlin","collapsed-title-line-number":"31",collapsible:"true",code:`package com.example.ktor.full_stack_task_manager

import com.example.ktor.full_stack_task_manager.network.TaskApi
import com.example.ktor.full_stack_task_manager.model.Priority
import com.example.ktor.full_stack_task_manager.model.Task
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeContentPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CornerSize
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ktor.full_stack_task_manager.network.createHttpClient
import kotlinx.coroutines.launch

@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        var tasks by remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()

        LaunchedEffect(Unit) {
            tasks = taskApi.getAllTasks()
        }

        LazyColumn(
            modifier = Modifier
                .safeContentPadding()
                .fillMaxSize()
        ) {
            items(tasks) { task ->
                TaskCard(
                    task,
                    onDelete = {
                        scope.launch {
                            taskApi.removeTask(it)
                            tasks = taskApi.getAllTasks()
                        }
                    },
                    onUpdate = {
                    }
                )
            }
        }
    }
}

@Composable
fun TaskCard(
    task: Task,
    onDelete: (Task) -> Unit,
    onUpdate: (Task) -> Unit
) {
    fun pickWeight(priority: Priority) = when (priority) {
        Priority.Low -> FontWeight.SemiBold
        Priority.Medium -> FontWeight.Bold
        Priority.High, Priority.Vital -> FontWeight.ExtraBold
    }

    Card(
        modifier = Modifier.fillMaxWidth().padding(4.dp),
        shape = RoundedCornerShape(CornerSize(4.dp))
    ) {
        Column(modifier = Modifier.padding(10.dp)) {
            Text(
                "\${task.name}: \${task.description}",
                fontSize = 20.sp,
                fontWeight = pickWeight(task.priority)
            )

            Row {
                OutlinedButton(onClick = { onDelete(task) }) {
                    Text("Delete")
                }
                Spacer(Modifier.width(8.dp))
                OutlinedButton(onClick = { onUpdate(task) }) {
                    Text("Update")
                }
            }
        }
    }
}`}),t[284]||(t[284]=o("p",null," 透過此實作，您的用戶端現在擁有了一些基本功能。 ",-1)),t[285]||(t[285]=o("p",null,[n(" 透過使用 "),o("code",null,"LaunchedEffect"),n(" 類型，所有任務在啟動時載入，而 "),o("code",null,"LazyColumn"),n(" 可組合函式允許使用者捲動瀏覽任務。 ")],-1)),t[286]||(t[286]=o("p",null,[n(" 最後，建立了一個單獨的 "),o("code",null,"TaskCard"),n(" 可組合函式，它又使用一個 "),o("code",null,"Card"),n(" 來顯示每個 "),o("code",null,"Task"),n(" 的詳細資訊。已經新增了按鈕以 刪除和更新任務。 ")],-1))]),_:1}),l(e,null,{default:i(()=>t[287]||(t[287]=[o("p",null,[n(" 重新執行用戶端應用程式 — 例如 Android 應用程式。 您現在可以捲動瀏覽任務、查看其詳細資訊並刪除它們： "),o("img",{style:{},src:N,alt:"應用程式在 Android 上以改進的 UI 運行",width:"350","border-effect":"rounded"})],-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"新增更新功能",id:"add-update-functionality"},{default:i(()=>[t[300]||(t[300]=o("p",null," 為了完善用戶端，請整合允許更新任務詳細資訊的功能。 ",-1)),l(p,{id:"add-update-func-procedure"},{default:i(()=>[l(e,null,{default:i(()=>[t[291]||(t[291]=n(" 導覽至 ")),l(r,null,{default:i(()=>t[289]||(t[289]=[n("composeApp/src/commonMain/.../full_stack_task_manager")])),_:1}),t[292]||(t[292]=n(" 中的 ")),l(r,null,{default:i(()=>t[290]||(t[290]=[n("App.kt")])),_:1}),t[293]||(t[293]=n(" 檔案。 "))]),_:1}),l(e,null,{default:i(()=>[t[294]||(t[294]=o("p",null,[n(" 新增 "),o("code",null,"UpdateTaskDialog"),n(" 可組合函式和必要的匯入，如下所示： ")],-1)),l(s,{lang:"kotlin",code:`import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.window.Dialog

@Composable
fun UpdateTaskDialog(
    task: Task,
    onConfirm: (Task) -> Unit
) {
    var description by remember { mutableStateOf(task.description) }
    var priorityText by remember { mutableStateOf(task.priority.toString()) }
    val colors = TextFieldDefaults.colors(
        focusedTextColor = Color.Blue,
        focusedContainerColor = Color.White,
    )

    Dialog(onDismissRequest = {}) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(4.dp),
            shape = RoundedCornerShape(CornerSize(4.dp))
        ) {
            Column(modifier = Modifier.padding(10.dp)) {
                Text("Update \${task.name}", fontSize = 20.sp)
                TextField(
                    value = description,
                    onValueChange = { description = it },
                    label = { Text("Description") },
                    colors = colors
                )
                TextField(
                    value = priorityText,
                    onValueChange = { priorityText = it },
                    label = { Text("Priority") },
                    colors = colors
                )
                OutlinedButton(onClick = {
                    val newTask = Task(
                        task.name,
                        description,
                        try {
                            Priority.valueOf(priorityText)
                        } catch (e: IllegalArgumentException) {
                            Priority.Low
                        }
                    )
                    onConfirm(newTask)
                }) {
                    Text("Update")
                }
            }
        }
    }
}`}),t[295]||(t[295]=o("p",null,[n(" 這是一個可組合函式，它透過對話框顯示 "),o("code",null,"Task"),n(" 的詳細資訊。"),o("code",null,"description"),n(" 和 "),o("code",null,"priority"),n(" 放置在 "),o("code",null,"TextField"),n(" 可組合函式中，以便可以 更新。當使用者按下更新按鈕時，它會觸發 "),o("code",null,"onConfirm()"),n(" 回呼。 ")],-1))]),_:1}),l(e,null,{default:i(()=>[t[296]||(t[296]=o("p",null,[n(" 更新同一個檔案中的 "),o("code",null,"App"),n(" 可組合函式： ")],-1)),l(s,{lang:"kotlin",code:`@Composable
fun App() {
    MaterialTheme {
        val httpClient = createHttpClient()
        val taskApi = remember { TaskApi(httpClient) }
        var tasks by remember { mutableStateOf(emptyList<Task>()) }
        val scope = rememberCoroutineScope()
        var currentTask by remember { mutableStateOf<Task?>(null) }

        LaunchedEffect(Unit) {
            tasks = taskApi.getAllTasks()
        }

        if (currentTask != null) {
            UpdateTaskDialog(
                currentTask!!,
                onConfirm = {
                    scope.launch {
                        taskApi.updateTask(it)
                        tasks = taskApi.getAllTasks()
                    }
                    currentTask = null
                }
            )
        }

        LazyColumn(modifier = Modifier
            .safeContentPadding()
            .fillMaxSize()
        ) {
            items(tasks) { task ->
                TaskCard(
                    task,
                    onDelete = {
                        scope.launch {
                            taskApi.removeTask(it)
                            tasks = taskApi.getAllTasks()
                        }
                    },
                    onUpdate = {
                        currentTask = task
                    }
                )
            }
        }
    }
}`}),t[297]||(t[297]=o("p",null,[n(" 您正在儲存額外的狀態部分，即選定的當前任務。如果此值不為 null， 那麼我們調用我們的 "),o("code",null,"UpdateTaskDialog"),n(" 可組合函式，並將 "),o("code",null,"onConfirm()"),n(" 回呼設定為使用 "),o("code",null,"TaskApi"),n(" 向伺服器發送 POST 請求。 ")],-1)),t[298]||(t[298]=o("p",null,[n(" 最後，當您建立 "),o("code",null,"TaskCard"),n(" 可組合函式時，您使用 "),o("code",null,"onUpdate()"),n(" 回呼來設定 "),o("code",null,"currentTask"),n(" 狀態變數。 ")],-1))]),_:1}),l(e,null,{default:i(()=>t[299]||(t[299]=[n(" 重新執行用戶端應用程式。您現在應該能夠使用按鈕更新每個任務的詳細資訊。 "),o("img",{style:{},src:U,alt:"在 Android 上刪除任務",width:"350","border-effect":"rounded"},null,-1)])),_:1})]),_:1})]),_:1}),l(d,{title:"後續步驟",id:"next-steps"},{default:i(()=>[t[308]||(t[308]=o("p",null," 在本文中，您已在 Kotlin Multiplatform 應用程式的上下文中使用 Ktor。您現在可以 建立一個包含多個服務和用戶端，針對各種不同平台的專案。 ",-1)),o("p",null,[t[304]||(t[304]=n(" 如您所見，在沒有任何程式碼重複或冗餘的情況下建置功能是可能的。 專案所有層所需的類型可以放置在 ")),l(r,null,{default:i(()=>t[301]||(t[301]=[n("shared")])),_:1}),t[305]||(t[305]=n(" 多平台模組中。 服務才需要的功能放在 ")),l(r,null,{default:i(()=>t[302]||(t[302]=[n("server")])),_:1}),t[306]||(t[306]=n(" 模組中，而用戶端才需要的功能則放在 ")),l(r,null,{default:i(()=>t[303]||(t[303]=[n("composeApp")])),_:1}),t[307]||(t[307]=n(" 中。 "))]),t[309]||(t[309]=o("p",null,[n(" 這種開發不可避免地需要同時具備用戶端和伺服器技術的知識。但您可以使用 "),o("a",{href:"https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"},"Kotlin Multiplatform"),n(" 函式庫和 "),o("a",{href:"https://www.jetbrains.com/lp/compose-multiplatform/"}," Compose Multiplatform"),n(" 來最大程度地減少您需要學習的新內容。即使您最初 只專注於單一平台，隨著您的應用程式需求增長，您也可以輕鬆新增其他平台。 ")],-1))]),_:1})]),_:1})])}const _=E(W,[["render",F]]);export{Z as __pageData,_ as default};
