<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       title="使用 Kotlin Multiplatform 建立全端應用程式" id="full-stack-development-with-kotlin-multiplatform">
<show-structure for="chapter, procedure" depth="2"/>
<web-summary>
    學習如何在 Kotlin 和 Ktor 中開發跨平台全端應用程式。在本教學中，您將了解如何使用 Kotlin Multiplatform 為 Android、iOS 和桌面平台進行建構，並使用 Ktor 輕鬆處理資料。
</web-summary>
<link-summary>
    學習如何在 Kotlin 和 Ktor 中開發跨平台全端應用程式。
</link-summary>
<card-summary>
    學習如何在 Kotlin 和 Ktor 中開發跨平台全端應用程式。
</card-summary>
<tldr>
    <var name="example_name" value="full-stack-task-manager"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
    <p>
        <b>使用的外掛程式</b>: <Links href="/ktor/server-routing" summary="路由（Routing）是一個核心外掛程式，用於處理伺服器應用程式中的傳入請求。">Routing</Links>,
        <a href="https://kotlinlang.org/api/kotlinx.serialization/">kotlinx.serialization</a>,
        <Links href="/ktor/server-serialization" summary="ContentNegotiation 外掛程式主要有兩個用途：協商用戶端與伺服器之間的媒體類型，以及以特定格式序列化/反序列化內容。">Content Negotiation</Links>,
        <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>,
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin Multiplatform</a>
    </p>
</tldr>
<p>
    在本文中，您將學習如何使用 Kotlin 開發一個全端應用程式，該應用程式可在 Android、iOS 和桌面平台上執行，同時利用 Ktor 進行無縫資料處理。
</p>
<p>完成本教學後，您將了解如何執行以下操作：</p>
<list>
    <li>使用 <a
            href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">
        Kotlin Multiplatform</a> 建立全端應用程式。
    </li>
    <li>了解使用 IntelliJ IDEA 產生的專案。</li>
    <li>建立呼叫 Ktor 服務的 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 用戶端。
    </li>
    <li>在設計的不同層次中重複使用共享類型。</li>
    <li>正確地包含和設定多平台程式庫。</li>
</list>
<p>
    在先前的教學中，我們使用 Task Manager 範例來
    <Links href="/ktor/server-requests-and-responses" summary="了解路由、請求處理和參數的基礎知識，使用 Kotlin 和 Ktor 建構任務管理器應用程式。">處理請求</Links>、
    <Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建構後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。">建立 RESTful API</Links>，並
    <Links href="/ktor/server-integrate-database" summary="了解使用 Exposed SQL 程式庫將 Ktor 服務連接到資料庫儲存庫的過程。">將資料庫與 Exposed 整合</Links>。
    用戶端應用程式保持盡可能簡潔，以便您可以專注於學習 Ktor 的基本原理。
</p>
<p>
    您將建立一個目標為 Android、iOS 和桌面平台的用戶端，並使用 Ktor 服務獲取要顯示的資料。在可能的情況下，您將在用戶端和伺服器之間共享資料類型，從而加快開發速度並減少潛在的錯誤。
</p>
<chapter title="先決條件" id="prerequisites">
    <p>
        與之前的文章一樣，您將使用 IntelliJ IDEA 作為 IDE。要安裝和設定您的環境，請參閱
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/quickstart.html">
            Kotlin Multiplatform 快速入門
        </a> 指南。
    </p>
    <p>
        如果您是首次使用 Compose Multiplatform，建議您在開始本教學之前，先完成
        <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/compose-multiplatform-getting-started.html">
            Compose Multiplatform 入門
        </a>
        教學。為了降低任務的複雜性，您可以專注於單一用戶端平台。例如，如果您從未使用過 iOS，則專注於桌面或 Android 開發可能更明智。
    </p>
</chapter>
<chapter title="建立新專案" id="create-project">
    <p>
        您將使用 IntelliJ IDEA 中的 Kotlin Multiplatform 專案精靈，而不是 Ktor 專案產生器。
        它將建立一個基本的多平台專案，您可以透過用戶端和服務來擴展該專案。用戶端
        可以使用原生 UI 程式庫，例如 SwiftUI，但在本教學中，您將透過使用 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 為所有平台建立共享 UI。
    </p>
    <procedure id="generate-project">
        <step>
            啟動 IntelliJ IDEA。
        </step>
        <step>
            在 IntelliJ IDEA 中，選擇
            <ui-path>File | New | Project</ui-path>
            。
        </step>
        <step>
            在左側面板中，選擇
            <ui-path>Kotlin Multiplatform</ui-path>
            。
        </step>
        <step>
            在
            <ui-path>New Project</ui-path>
            視窗中指定以下欄位：
            <list>
                <li>
                    <ui-path>Name</ui-path>
                    : full-stack-task-manager
                </li>
                <li>
                    <ui-path>Group</ui-path>
                    : com.example.ktor
                </li>
            </list>
        </step>
        <step>
            <p>
                選擇
                <ui-path>Android</ui-path>
                、
                <ui-path>Desktop</ui-path>
                和
                <ui-path>Server</ui-path>
                作為目標平台。
            </p>
        </step>
        <step>
            <p>
                如果您使用 Mac，也請選擇
                <ui-path>iOS</ui-path>
                。確保已選取
                <ui-path>Share UI</ui-path>
                選項。
                <img style="block" src="full_stack_development_tutorial_create_project.png"
                     alt="Kotlin Multiplatform 精靈設定" width="706" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                按一下 <control>Create</control> 按鈕，然後等待 IDE 產生並匯入專案。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="執行服務" id="run-service">
    <procedure id="run-service-procedure">
        <step>
            在
            <ui-path>Project</ui-path>
            檢視中，導覽至
            <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path>
            並開啟
            <Path>Application.kt</Path>
            檔案。
        </step>
        <step>
            按一下 `main()` 函式旁邊的
            <ui-path>Run</ui-path>
            按鈕
            (<img src="intellij_idea_run_icon.svg"
                  style="inline" height="16" width="16"
                  alt="IntelliJ IDEA 執行圖示"/>)
            以啟動應用程式。
            <p>
                <ui-path>Run</ui-path>
                工具視窗中將開啟一個新分頁，其日誌以訊息「Responding at http://0.0.0.0:8080」結尾。
            </p>
        </step>
        <step>
            <p>
                導覽至 <a href="http://0.0.0.0:8080/">http://0.0.0.0:8080/</a> 以開啟應用程式。
                您應該會在瀏覽器中看到 Ktor 顯示的訊息。
                <img src="full_stack_development_tutorial_run.png"
                     alt="Ktor 伺服器瀏覽器回應" width="706"
                     border-effect="rounded" style="block"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="檢查專案" id="examine-project">
    <p>
        <Path>server</Path>
        資料夾是專案中的三個 Kotlin 模組之一。另外兩個是
        <Path>shared</Path>
        和
        <Path>composeApp</Path>
        。
    </p>
    <p>
        <Path>server</Path>
        模組的結構與 <a href="https://start.ktor.io/">Ktor Project Generator</a> 產生的結構非常相似。
        您有一個專用的建置檔案來宣告外掛程式和依賴項，以及一個包含用於建置和啟動 Ktor
        服務的程式碼的來源集：
    </p>
    <img src="full_stack_development_tutorial_server_folder.png"
         alt="Kotlin Multiplatform 專案中 server 資料夾的內容" width="300"
         border-effect="line"/>
    <p>
        如果您查看
        <Path>Application.kt</Path>
        檔案中的路由指令，您將看到 `greet()` 函式的呼叫：
    </p>
    [object Promise]
    <p>
        這會建立 `Greeting` 類型的一個實例，並調用其 `greet()` 方法。
        `Greeting` 類別定義在 <Path>shared</Path> 模組中：
        <img src="full_stack_development_tutorial_shared_module.png"
             alt="在 IntelliJ IDEA 中開啟的 Greeting.kt 和 Platform.kt" width="706"
             border-effect="line" style="block"/>
    </p>
    <p>
        <Path>shared</Path>
        模組包含將跨不同目標平台使用的程式碼。
    </p>
    <p>
        <Path>shared</Path> 模組集中的 <Path>commonMain</Path> 來源包含將在所有平台上使用的類型。
        如您所見，這是定義 `Greeting` 類型的地方。
        這也是您將放置伺服器與所有不同用戶端平台之間共享的通用程式碼的地方。
    </p>
    <p>
        <Path>shared</Path>
        模組還包含每個平台的一個來源集，您希望在這些平台上提供用戶端。這是因為
        在 <Path>commonMain</Path> 中宣告的類型可能需要因目標平台而異的功能。對於
        `Greeting` 類型，您希望使用平台特定的 API 獲取當前平台的名稱。
        這透過 <a
            href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-connect-to-apis.html">預期（expected）
        和實際（actual）宣告</a>來實現。
    </p>
    <p>
        在
        <Path>shared</Path>
        模組的
        <Path>commonMain</Path>
        來源集中，您使用 `expect` 關鍵字宣告一個 `getPlatform()` 函式：
    </p>
    <tabs>
        <tab title="commonMain/Platform.kt" id="commonMain">
            [object Promise]
        </tab>
    </tabs>
    <p>然後，每個目標平台
        必須提供 `getPlatform()` 函式的 `actual` 宣告，如下所示：
    </p>
    <tabs>
        <tab title="Platform.ios.kt" id="iosMain">
            [object Promise]
        </tab>
        <tab title="Platform.android.kt" id="androidMain">
            [object Promise]
        </tab>
        <tab title="Platform.jvm.kt" id="jvmMain">
            [object Promise]
        </tab>
        <tab title="Platform.wasmJs.kt" id="wasmJsMain">
            [object Promise]
        </tab>
    </tabs>
    <p>
        專案中還有一個額外的模組，即
        <Path>composeApp</Path>
        模組。
        它包含 Android、iOS、桌面和網路用戶端應用程式的程式碼。
        這些應用程式目前未連結到 Ktor 服務，但它們確實使用了共享的
        `Greeting` 類別。
    </p>
</chapter>
<chapter title="執行用戶端應用程式" id="run-client-app">
    <p>
        您可以透過執行目標的執行組態來執行用戶端應用程式。要在 iOS 模擬器上執行應用程式，請按照以下步驟操作：
    </p>
    <procedure id="run-ios-app-procedure">
        <step>
            在 IntelliJ IDEA 中，選擇
            <Path>iosApp</Path>
            執行組態和一個模擬裝置。
            <img src="full_stack_development_tutorial_run_configurations.png"
                 alt="執行與偵錯視窗" width="400"
                 border-effect="line" style="block"/>
        </step>
        <step>
            按一下
            <ui-path>Run</ui-path>
            按鈕
            (<img src="intellij_idea_run_icon.svg"
                  style="inline" height="16" width="16"
                  alt="IntelliJ IDEA 執行圖示"/>)
            以執行組態。
        </step>
        <step>
            <p>
                當您執行 iOS 應用程式時，它會在幕後使用 Xcode 進行建置，並在 iOS 模擬器中啟動。
                應用程式會顯示一個按鈕，按一下即可切換圖像。
                <img style="block" src="full_stack_development_tutorial_run_ios.gif"
                     alt="在 iOS 模擬器中執行應用程式" width="300" border-effect="rounded"/>
            </p>
            <p>
                當首次按下按鈕時，當前平台的詳細資訊會添加到其文字中。實現此目的的程式碼位於
                <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager/App.kt</Path>
                ：
            </p>
            [object Promise]
            <p>
                這是一個可組合函式（composable function），您將在本文稍後修改它。目前重要的是它會顯示一個 UI 並使用共享的 `Greeting` 類型，而 `Greeting` 類型又使用了實現通用 `Platform` 介面的平台特定類別。
            </p>
        </step>
    </procedure>
    <p>
        既然您已了解產生專案的結構，您就可以逐步新增任務管理器功能了。
    </p>
</chapter>
<chapter title="新增模型類型" id="add-model-types">
    <p>
        首先，新增模型類型並確保用戶端和伺服器都可以存取它們。
    </p>
    <procedure id="add-model-types-procedure">
        <step>
            導覽至
            <Path>shared/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path>
            並建立一個名為
            <Path>model</Path>
            的新套件。
        </step>
        <step>
            在新套件中，建立一個名為
            <Path>Task.kt</Path>
            的新檔案。
        </step>
        <step>
            <p>
                新增一個 `enum` 來表示優先級，並新增一個 `class` 來表示任務。`Task`
                類別使用 `kotlinx.serialization`
                程式庫中的 `Serializable` 類型進行註解：
            </p>
            [object Promise]
            <p>
                您會注意到匯入和註解都無法編譯。這是因為專案尚未依賴
                `kotlinx.serialization` 程式庫。
            </p>
        </step>
        <step>
            <p>
                導覽至
                <Path>shared/build.gradle.kts</Path>
                並新增序列化外掛程式：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                在同一個檔案中，為
                <Path>commonMain</Path>
                來源集新增一個依賴項：
            </p>
            [object Promise]
        </step>
        <step>
            導覽至
            <Path>gradle/libs.versions.toml</Path>
            並定義以下內容：
            [object Promise]
        </step>
        <!-- the plugin version can also be set in the version catalog -->
        <step>
            在 IntelliJ IDEA 中，選擇
            <ui-path>Build | Sync Project with Gradle Files</ui-path>
            以套用更新。一旦 Gradle 匯入完成，您應該會發現您的
            <Path>Task.kt</Path>
            檔案成功編譯。
        </step>
    </procedure>
    <!-- The following seems like a lot of nuance to cover for this newbie-oriented tutorial.
     I think at this point it's enough to know that the serialization library requires a Gradle plugin.
     If it's important, it would be nice to make the terminology more precise: earlier we said it won't compile, and now
     we're saying it would, so I'm not sure what's going on in the end.
     -->
    <p>
        請注意，即使不包含序列化外掛程式，程式碼也能編譯，但是跨網路序列化 `Task` 物件所需的類型將不會產生。這將在嘗試調用服務時導致執行時錯誤。
    </p>
    <p>
        將序列化外掛程式放置在另一個模組（例如
        <Path>server</Path>
        或
        <Path>composeApp</Path>
        ）中不會在建置時引起錯誤。但同樣地，序列化所需的額外類型將不會產生，從而導致執行時錯誤。
    </p>
</chapter>
<chapter title="建立伺服器" id="create-server">
    <p>
        下一個階段是為我們的任務管理器建立伺服器實作。
    </p>
    <procedure id="create-server-procedure">
        <step>
            導覽至
            <Path>server/src/main/kotlin/com/example/ktor/full_stack_task_manager</Path>
            資料夾並建立一個名為
            <Path>model</Path>
            的子套件。
        </step>
        <step>
            <p>
                在此套件中，建立一個新的
                <Path>TaskRepository.kt</Path>
                檔案，並為我們的儲存庫新增以下介面：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                在同一個套件中，建立一個名為
                <Path>InMemoryTaskRepository.kt</Path>
                的新檔案，其中包含以下類別：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                導覽至
                <Path>server/src/main/kotlin/.../Application.kt</Path>
                ，並將現有程式碼替換為以下實作：
            </p>
            [object Promise]
            <p>
                此實作與之前的教學非常相似，但現在為了簡潔起見，您已將所有路由程式碼放置在 `Application.module()` 函式中。
            </p>
            <p>
                輸入此程式碼並新增匯入後，您會發現多個編譯器錯誤，因為程式碼使用了多個 Ktor 外掛程式，這些外掛程式需要作為依賴項包含，
                包括用於與網路用戶端互動的 <Links href="/ktor/server-cors" summary="所需依賴項：io.ktor:%artifact_name% 程式碼範例：%example_name% 原生伺服器支援：✅">CORS</Links> 外掛程式。
            </p>
        </step>
        <step>
            開啟
            <Path>gradle/libs.versions.toml</Path>
            檔案並定義以下程式庫：
            [object Promise]
        </step>
        <step>
            <p>
                開啟伺服器模組建置檔案（
                <Path>server/build.gradle.kts</Path>
                ）並新增以下依賴項：
            </p>
            [object Promise]
        </step>
        <step>
            再次在主選單中執行 <ui-path>Build | Sync Project with Gradle Files</ui-path>。
            匯入完成後，您應該會發現 `ContentNegotiation` 類型和 `json()` 函式的匯入正常運作。
        </step>
        <step>
            重新執行伺服器。您應該會發現這些路由可以從瀏覽器存取。
        </step>
        <step>
            <p>
                導覽至 <a href="http://0.0.0.0:8080/tasks">http://0.0.0.0:8080/tasks</a>
                和 <a href="http://0.0.0.0:8080/tasks/byPriority/Medium">http://0.0.0.0:8080/tasks/byPriority/Medium</a>
                以查看包含 JSON 格式任務的伺服器回應。
                <img style="block" src="full_stack_development_tutorial_run_server.gif"
                     width="707" border-effect="rounded" alt="瀏覽器中的伺服器回應"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="建立用戶端" id="create-client">
    <p>
        為了讓您的用戶端能夠存取伺服器，您需要包含 Ktor Client。這涉及三種依賴項類型：
    </p>
    <list>
        <li>Ktor Client 的核心功能。</li>
        <li>處理網路的平台特定引擎。</li>
        <li>支援內容協商和序列化。</li>
    </list>
    <procedure id="create-client-procedure">
        <step>
            在
            <Path>gradle/libs.versions.toml</Path>
            檔案中，新增以下程式庫：
            [object Promise]
        </step>
        <step>
            導覽至
            <Path>composeApp/build.gradle.kts</Path>
            並新增以下依賴項：
            [object Promise]
            <p>
                完成此操作後，您可以為您的用戶端新增 `TaskApi` 類型，作為 Ktor Client 的輕量級包裝器。
            </p>
        </step>
        <step>
            在主選單中選擇
            <ui-path>Build | Sync Project with Gradle Files</ui-path>
            以匯入建置檔案中的變更。
        </step>
        <step>
            導覽至
            <Path>composeApp/src/commonMain/kotlin/com/example/ktor/full_stack_task_manager</Path>
            並建立一個名為
            <Path>network</Path>
            的新套件。
        </step>
        <step>
            <p>
                在新套件中，建立一個新的
                <Path>HttpClientManager.kt</Path>
                用於用戶端設定：
            </p>
            [object Promise]
            <p>
                請注意，您應該將 `1.2.3.4` 替換為您當前機器的 IP 位址。您將無法從在 Android 虛擬裝置或
                iOS 模擬器上執行的程式碼呼叫 `0.0.0.0` 或 `localhost`。
                <!-- should we include instructions on finding out the IP address?
                     `ipconfig getifaddr en0`or something -->
            </p>
        </step>
        <step>
            <p>
                在同一個
                <Path>composeApp/.../full_stack_task_manager/network</Path>
                套件中，建立一個新的
                <Path>TaskApi.kt</Path>
                檔案，其中包含以下實作：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                導覽至
                <Path>commonMain/.../App.kt</Path>
                ，並將 App composable 替換為以下實作。
                這將使用 `TaskApi` 類型從伺服器檢索任務列表，然後
                在列中顯示每個任務的名稱：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                當伺服器正在執行時，透過執行 <ui-path>iosApp</ui-path> 執行組態來測試 iOS 應用程式。
            </p>
        </step>
        <step>
            <p>
                按一下 <control>Fetch Tasks</control> 按鈕以顯示任務列表：
                <img style="block" src="full_stack_development_tutorial_run_iOS.png"
                     alt="應用程式在 iOS 上執行" width="363" border-effect="rounded"/>
            </p>
            <note>
                在此示範中，為了清晰起見，我們簡化了流程。在實際應用程式中，避免透過網路傳送未加密的資料至關重要。
            </note>
        </step>
        <step>
            <p>
                在 Android 平台上，您需要明確授予應用程式網路權限，並
                允許它以純文字形式傳送和接收資料。要啟用這些權限，請開啟
                <Path>composeApp/src/androidMain/AndroidManifest.xml</Path>
                並新增以下設定：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                使用 <ui-path>composeApp</ui-path> 執行組態執行 Android 應用程式。
                您現在應該會發現您的 Android 用戶端也能執行了：
                <img style="block" src="full_stack_development_tutorial_run_android.png"
                     alt="應用程式在 Android 上執行" width="350" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                對於桌面用戶端，您應該為包含
                視窗指定尺寸和標題。
                開啟檔案
                <Path>composeApp/src/desktopMain/.../main.kt</Path>
                並透過變更 `title` 和設定 `state` 屬性來修改程式碼：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                使用 <ui-path>composeApp [desktop]</ui-path> 執行組態執行桌面應用程式：
                <img style="block" src="full_stack_development_tutorial_run_desktop_resized.png"
                     alt="應用程式在桌面上執行" width="400" border-effect="rounded"/>
            </p>
        </step>
        <step>
            <p>
                使用 <ui-path>composeApp [wasmJs]</ui-path> 執行組態執行網路用戶端：
            </p>
            <img style="block" src="full_stack_development_tutorial_run_web.png"
                 alt="應用程式在桌面上執行" width="400" border-effect="rounded"/>
        </step>
    </procedure>
</chapter>
<chapter title="改進 UI" id="improve-ui">
    <p>
        用戶端現在正在與伺服器通訊，但這並不是一個有吸引力的 UI。
    </p>
    <procedure id="improve-ui-procedure">
        <step>
            <p>
                開啟位於
                <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path>
                中的
                <Path>App.kt</Path>
                檔案，並將現有的 `App` 替換為以下 `App` 和 `TaskCard`
                composable：
            </p>
            [object Promise]
            <p>
                透過此實作，您的用戶端現在具備了一些基本功能。
            </p>
            <p>
                透過使用 `LaunchedEffect` 類型，所有任務都會在啟動時載入，而 `LazyColumn`
                composable 允許使用者滾動瀏覽任務。
            </p>
            <p>
                最後，建立了一個獨立的 `TaskCard` composable，它又使用一個
                `Card` 來顯示每個 `Task` 的詳細資訊。已新增按鈕來
                刪除和更新任務。
            </p>
        </step>
        <step>
            <p>
                重新執行用戶端應用程式 — 例如，Android 應用程式。
                您現在可以滾動瀏覽任務、查看其詳細資訊並刪除它們：
                <img style="block" src="full_stack_development_tutorial_improved_ui.gif"
                     alt="應用程式在 Android 上執行並改進了 UI" width="350" border-effect="rounded"/>
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="新增更新功能" id="add-update-functionality">
    <p>
        為了完成用戶端，整合允許更新任務詳細資訊的功能。
    </p>
    <procedure id="add-update-func-procedure">
        <step>
            導覽至
            <Path>composeApp/src/commonMain/.../full_stack_task_manager</Path>
            中的
            <Path>App.kt</Path>
            檔案。
        </step>
        <step>
            <p>
                如下所示新增 `UpdateTaskDialog` composable 和必要的匯入：
            </p>
            [object Promise]
            <p>
                這是一個 composable，它使用對話框顯示 `Task` 的詳細資訊。`description`
                和 `priority` 放置在 `TextField` composable 中，以便可以
                更新它們。當使用者按下更新按鈕時，它會觸發 `onConfirm()` 回呼。
            </p>
        </step>
        <step>
            <p>
                更新同一個檔案中的 `App` composable：
            </p>
            [object Promise]
            <p>
                您正在儲存額外的狀態，即當前選定的任務。如果此值
                不為空，則我們調用 `UpdateTaskDialog` composable，並將
                `onConfirm()` 回呼設定為使用 `TaskApi` 向伺服器傳送一個 POST 請求。
            </p>
            <p>
                最後，當您建立 `TaskCard` composable 時，您使用
                `onUpdate()` 回呼來設定 `currentTask` 狀態變數。
            </p>
        </step>
        <step>
            重新執行用戶端應用程式。您現在應該能夠透過使用按鈕來更新每個任務的詳細資訊。
            <img style="block" src="full_stack_development_tutorial_update_task.gif"
                 alt="在 Android 上刪除任務" width="350" border-effect="rounded"/>
        </step>
    </procedure>
</chapter>
<chapter title="下一步" id="next-steps">
    <p>
        在本文中，您已在 Kotlin Multiplatform 應用程式的背景下使用了 Ktor。您現在可以建立一個包含多個服務和用戶端的專案，並針對一系列不同的平台。
    </p>
    <p>
        如您所見，可以在沒有任何程式碼重複或冗餘的情況下建置功能。專案所有層所需的類型可以放置在
        <Path>shared</Path>
        多平台模組中。
        僅服務所需的功能放在
        <Path>server</Path>
        模組中，而僅用戶端所需的功能放在
        <Path>composeApp</Path>
        中。
    </p>
    <p>
        這種開發不可避免地需要用戶端和伺服器技術的知識。但是，您可以使用 <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html">Kotlin
        Multiplatform</a> 程式庫和 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">
        Compose Multiplatform</a> 來最大限度地減少您需要學習的新內容。即使您最初只專注於單一平台，隨著應用程式需求的增長，您也可以輕鬆添加其他平台。
    </p>
</chapter>
</topic>