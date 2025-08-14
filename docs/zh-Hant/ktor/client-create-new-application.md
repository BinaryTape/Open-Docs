```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
   title="建立用戶端應用程式"
   id="client-create-new-application"
   help-id="getting_started_ktor_client;client-getting-started;client-get-started;client-create-a-new-application">
<show-structure for="chapter" depth="2"/>
<tldr>
    <var name="example_name" value="tutorial-client-get-started"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>
<link-summary>
    建立您的第一個用戶端應用程式，用於傳送請求及接收回應。
</link-summary>
<p>
    Ktor 包含一個多平台非同步 HTTP 用戶端，允許您<Links href="/ktor/client-requests" summary="瞭解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭和請求主體。">發出請求</Links>並<Links href="/ktor/client-responses" summary="瞭解如何接收回應、取得回應主體以及取得回應參數。">處理回應</Links>，
    透過<Links href="/ktor/client-plugins" summary="熟悉提供常見功能的外掛程式，例如日誌記錄、序列化、授權等。">外掛程式</Links>擴展其功能，例如<Links href="/ktor/client-auth" summary="Auth 外掛程式處理用戶端應用程式中的身份驗證和授權。">身份驗證</Links>、
    <Links href="/ktor/client-serialization" summary="ContentNegotiation 外掛程式有兩個主要目的：協商客戶端與伺服器之間的媒體類型，以及在傳送請求和接收回應時以特定格式序列化/反序列化內容。">JSON 序列化</Links>，以及更多。
</p>
<p>
    在本教學中，我們將向您展示如何建立您的第一個 Ktor 用戶端應用程式，該應用程式會傳送請求並印出回應。
</p>
<chapter title="先決條件" id="prerequisites">
<p>
    在開始本教學之前，
    <a href="https://www.jetbrains.com/help/idea/installation-guide.html">安裝 IntelliJ IDEA Community 或
        Ultimate 版</a>。
</p>
</chapter>
<chapter title="建立新專案" id="new-project">
    <p>
        您可以在現有專案中手動<Links href="/ktor/client-create-and-configure" summary="瞭解如何建立和設定 Ktor 用戶端。">建立並設定</Links> Ktor 用戶端，但從頭開始的便捷方式是使用
        IntelliJ IDEA 內建的 Kotlin 外掛程式來產生新專案。
    </p>
    <p>
        若要建立新的 Kotlin 專案，
        <a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">開啟 IntelliJ IDEA</a> 並按照
        以下步驟操作：
    </p>
    <procedure>
        <step>
<p>
    在歡迎畫面，點擊<control>新專案</control>。
</p>
<p>
    或者，從主選單中，選擇<ui-path>檔案 | 新增 | 專案</ui-path>。
</p>
        </step>
        <step>
            <p>
                在「
                <control>新專案</control>
                」精靈中，從左側列表中選擇
                <control>Kotlin</control>
                。
            </p>
        </step>
        <step>
            <p>
                在右側窗格中，指定以下設定：
            </p>
            <img src="client_get_started_new_project.png" alt="IntelliJ IDEA 中的新 Kotlin 專案視窗"
                 border-effect="rounded"
                 width="706"/>
            <list id="kotlin_app_settings">
                <li>
                    <p>
                        <control>名稱</control>
                        : 指定專案名稱。
                    </p>
                </li>
                <li>
                    <p>
                        <control>位置</control>
                        : 指定專案目錄。
                    </p>
                </li>
                <li>
                    <p>
                        <control>建置系統</control>
                        : 確保
                        <control>Gradle</control>
                        已選取。
                    </p>
                </li>
                <li>
                    <p>
                        <control>Gradle DSL</control>
                        : 選擇
                        <control>Kotlin</control>
                        。
                    </p>
                </li>
                <li>
                    <p>
                        <control>新增範例程式碼</control>
                        : 選取此選項以在產生的專案中包含範例程式碼。
                    </p>
                </li>
            </list>
        </step>
        <step>
            <p>
                點擊<control>建立</control>並等待 IntelliJ IDEA 產生專案並安裝依賴項。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="新增依賴項" id="add-dependencies">
    <p>
        讓我們為 Ktor 用戶端新增所需的依賴項。
    </p>
    <procedure>
        <step>
            <p>
                開啟
                <Path>gradle.properties</Path>
                檔案，並加入以下行以指定 Ktor 版本：
            </p>
            [object Promise]
            <note id="eap-note">
                <p>
                    若要使用 Ktor 的 EAP 版本，您需要新增一個<a href="#repositories">Space 儲存庫</a>。
                </p>
            </note>
        </step>
        <step>
            <p>
                開啟
                <Path>build.gradle.kts</Path>
                檔案，並在依賴項區塊中加入以下成品：
            </p>
            [object Promise]
            <list>
                <li><code>ktor-client-core</code> 是一個核心依賴項，提供主要的用戶端功能，
                </li>
                <li>
                    <code>ktor-client-cio</code> 是用於處理網路請求的<Links href="/ktor/client-engines" summary="瞭解處理網路請求的引擎。">引擎</Links>的依賴項。
                </li>
            </list>
        </step>
        <step>
            <p>
                點擊
                <control>載入 Gradle 變更</control>
                圖示，位於
                <Path>build.gradle.kts</Path>
                檔案的右上角，以安裝新加入的依賴項。
            </p>
            <img src="client_get_started_load_gradle_changes_name.png" alt="載入 Gradle 變更" width="706"/>
        </step>
    </procedure>
</chapter>
<chapter title="建立用戶端" id="create-client">
    <p>
        若要新增用戶端實作，請導覽至
        <Path>src/main/kotlin</Path>
        並按照以下步驟操作：
    </p>
    <procedure>
        <step>
            <p>
                開啟
                <Path>Main.kt</Path>
                檔案，並將現有程式碼替換為以下實作：
            </p>
            [object Promise]
            <p>
                在 Ktor 中，用戶端由 <a
                    href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html">HttpClient</a>
                類別表示。
            </p>
        </step>
        <step>
            <p>
                使用 <a href="https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html"><code>HttpClient.get()</code></a> 方法來<Links href="/ktor/client-requests" summary="瞭解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭和請求主體。">發出 GET 請求</Links>。
                一個<Links href="/ktor/client-responses" summary="瞭解如何接收回應、取得回應主體以及取得回應參數。">回應</Links>將作為 <code>HttpResponse</code> 類別
                物件接收。
            </p>
            [object Promise]
            <p>
                加入以上程式碼後，IDE 會顯示 <code>get()</code> 函式的以下錯誤：
                <emphasis>暫停函式 'get' 只能從協程 (coroutine) 或另一個暫停函式呼叫
                </emphasis>
                。
            </p>
            <img src="client_get_started_suspend_error.png" alt="暫停函式錯誤" width="706"/>
            <p>
                若要解決此問題，您需要使 <code>main()</code> 函式暫停 (suspending)。
            </p>
            <tip>
                若要瞭解更多關於呼叫 <code>suspend</code> 函式，請參閱 <a
                    href="https://kotlinlang.org/docs/coroutines-basics.html">協程基礎</a>。
            </tip>
        </step>
        <step>
            <p>
                在 IntelliJ IDEA 中，點擊定義旁邊的紅色燈泡，然後選擇
                <control>將 main 設為 suspend</control>
                。
            </p>
            <img src="client_get_started_suspend_error_fix.png" alt="將 main 設為 suspend" width="706"/>
        </step>
        <step>
            <p>
                使用 <code>println()</code> 函式來印出伺服器返回的<a href="#status">狀態碼</a>，並使用 <code>close()</code> 函式來
                關閉串流並釋放與其相關的任何資源。該
                <Path>Main.kt</Path>
                檔案應如下所示：
            </p>
            [object Promise]
        </step>
    </procedure>
</chapter>
<chapter title="執行您的應用程式" id="make-request">
    <p>
        若要執行您的應用程式，請導覽至
        <Path>Main.kt</Path>
        檔案，並按照以下步驟操作：
    </p>
    <procedure>
        <step>
            <p>
                在 IntelliJ IDEA 中，點擊 <code>main()</code> 函式旁邊的裝訂線圖示，然後選擇
                <control>執行 'MainKt'</control>
                。
            </p>
            <img src="client_get_started_run_main.png" alt="執行應用程式" width="706"/>
        </step>
        <step>
            等待 IntelliJ IDEA 執行應用程式。
        </step>
        <step>
            <p>
                您將在 IDE 底部的
                <control>執行</control>
                窗格中看到輸出。
            </p>
            <img src="client_get_started_run_output_with_warning.png" alt="伺服器回應" width="706"/>
            <p>
                儘管伺服器回應了 <code>200 OK</code> 訊息，
                您還會看到一條錯誤訊息，指出 SLF4J 未能找到
                <code>StaticLoggerBinder</code> 類別，預設使用無操作 (NOP) 日誌記錄器
                實作。這表示日誌記錄已停用。
            </p>
            <p>
                您現在擁有一個可運作的用戶端應用程式。然而，若要修正此警告並能夠透過日誌記錄偵錯
                HTTP 呼叫，<a href="#enable-logging">需要額外的步驟</a>。
            </p>
        </step>
    </procedure>
</chapter>
<chapter title="啟用日誌記錄" id="enable-logging">
    <p>
        由於 Ktor 在 JVM 上使用 SLF4J 抽象層進行日誌記錄，因此若要啟用日誌記錄，您需要
        <a href="#jvm">提供一個日誌記錄框架</a>，例如
        <a href="https://logback.qos.ch/">Logback</a>。
    </p>
    <procedure id="enable-logging-procedure">
        <step>
            <p>
                在
                <Path>gradle.properties</Path>
                檔案中，指定日誌記錄框架的版本：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                開啟
                <Path>build.gradle.kts</Path>
                檔案，並在依賴項區塊中加入以下成品：
            </p>
            [object Promise]
        </step>
        <step>
            點擊
            <control>載入 Gradle 變更</control>
            圖示以安裝新加入的依賴項。
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 重新執行圖示"/>) 以重新啟動
    應用程式。
</p>
        </step>
        <step>
            <p>
                您應該不再看到錯誤，但相同的 <code>200 OK</code> 訊息將顯示在
                IDE 底部的
                <control>執行</control>
                窗格中。
            </p>
            <img src="client_get_started_run_output.png" alt="伺服器回應" width="706"/>
            <p>
                這樣，您就啟用了日誌記錄。若要開始查看日誌，您需要新增日誌記錄
                配置。
            </p>
        </step>
        <step>
            <p>導覽至
                <Path>src/main/resources</Path>
                並建立一個新的
                <Path>logback.xml</Path>
                檔案，其中包含以下實作：
            </p>
            [object Promise]
        </step>
        <step>
<p>
    在 IntelliJ IDEA 中，點擊重新執行按鈕 (<img src="intellij_idea_rerun_icon.svg"
                                                       style="inline" height="16" width="16"
                                                       alt="IntelliJ IDEA 重新執行圖示"/>) 以重新啟動
    應用程式。
</p>
        </step>
        <step>
            <p>
                您現在應該能夠在<control>執行</control>窗格中，在印出的回應上方看到追蹤日誌：
            </p>
            <img src="client_get_started_run_output_with_logs.png" alt="伺服器回應" width="706"/>
        </step>
    </procedure>
    <tip>
        Ktor 透過<Links href="/ktor/client-logging" summary="所需依賴項：io.ktor:ktor-client-logging
        程式碼範例：%example_name%">日誌記錄</Links>外掛程式提供了一種簡單明瞭的方式來新增 HTTP 呼叫日誌，而新增
        配置檔案則允許您在複雜應用程式中微調日誌記錄行為。
    </tip>
</chapter>
<chapter title="下一步" id="next-steps">
    <p>
        若要更好地理解和擴展此配置，請探索如何
        <Links href="/ktor/client-create-and-configure" summary="瞭解如何建立和設定 Ktor 用戶端。">建立並設定 Ktor 用戶端</Links>。
    </p>
</chapter>
</topic>