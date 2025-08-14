<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="建立、開啟並執行新的 Ktor 專案"
       id="server-create-a-new-project"
       help-id="server_create_a_new_project">
    <show-structure for="chapter" depth="2"/>
    <tldr>
        <var name="example_name" value="tutorial-server-get-started"/>
    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    </tldr>
    <link-summary>
        了解如何開啟、執行並測試 Ktor 伺服器應用程式。
    </link-summary>
    <web-summary>
        開始建構您的第一個 Ktor 伺服器應用程式。在本教學中，您將學習如何建立、開啟並執行新的 Ktor 專案。
    </web-summary>
    <p>
        在本教學中，您將學習如何建立、開啟並執行
        您的第一個 Ktor 伺服器專案。一旦您開始執行，您可以嘗試一系列任務來熟悉
        Ktor。
    </p>
    <p>
        這是引導您開始使用 Ktor
        建構伺服器應用程式的系列教學中的第一個。您可以獨立完成每個教學，
        然而，我們強烈建議您按照建議的順序進行：
    </p>
    <list type="decimal">
        <li>建立、開啟並執行新的 Ktor 專案。</li>
        <li><Links href="/ktor/server-requests-and-responses" summary="透過建構任務管理應用程式，學習使用 Ktor 在 Kotlin 中進行路由、處理請求和參數的基礎知識。">處理請求並產生回應</Links>。</li>
        <li><Links href="/ktor/server-create-restful-apis" summary="學習如何使用 Kotlin 和 Ktor 建構後端服務，其中包含一個產生 JSON 檔案的 RESTful API 範例。">建立產生 JSON 的 RESTful API</Links>。</li>
        <li><Links href="/ktor/server-create-website" summary="學習如何使用 Ktor 和 Thymeleaf 模板在 Kotlin 中建構網站。">使用 Thymeleaf 模板建立網站</Links>。</li>
        <li><Links href="/ktor/server-create-websocket-application" summary="學習如何利用 WebSockets 的強大功能來傳送和接收內容。">建立 WebSocket 應用程式</Links>。</li>
        <li><Links href="/ktor/server-integrate-database" summary="學習如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫的過程。">整合資料庫與 Exposed</Links>。</li>
    </list>
    <chapter id="create-project" title="建立新的 Ktor 專案">
        <p>
            建立新 Ktor 專案最快的方法之一是<a href="#create-project-with-the-ktor-project-generator">使用基於網路的 Ktor 專案產生器</a>。
        </p>
        <p>
            或者，您可以使用<a href="#create_project_with_intellij"> IntelliJ IDEA Ultimate 的專用 Ktor 外掛程式</a>
            或<a href="#create_project_with_ktor_cli_tool"> Ktor CLI 工具</a>來產生專案。
        </p>
        <chapter title="使用 Ktor 專案產生器"
                 id="create-project-with-the-ktor-project-generator">
            <p>
                若要使用 Ktor 專案產生器建立新專案，請依照以下步驟操作：
            </p>
            <procedure>
                <step>
                    <p>導覽至 <a href="https://start.ktor.io/">Ktor 專案產生器</a>。</p>
                </step>
                <step>
                    <p>在
                        <control>專案產物 (Project artifact)</control>
                        欄位中，輸入
                        <Path>com.example.ktor-sample-app</Path>
                        作為您的專案產物名稱。
                        <img src="ktor_project_generator_new_project_artifact_name.png"
                             alt="附有專案產物名稱 org.example.ktor-sample-app 的 Ktor 專案產生器"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <step>
                    <p>按一下
                        <control>配置 (Configure)</control>
                        以開啟設定下拉式選單：
                        <img src="ktor_project_generator_new_project_configure.png"
                             style="block"
                             alt="Ktor 專案設定的展開視圖" border-effect="line" width="706"/>
                    </p>
                    <p>
                        提供以下設定：
                    </p>
                    <list>
                        <li>
    <p>
        <control>建置系統 (Build System)</control>
        :
        選擇所需的<Links href="/ktor/server-dependencies" summary="了解如何將 Ktor 伺服器依賴項新增至現有的 Gradle/Maven 專案。">建置系統</Links>。
        這可以是
        <emphasis>Gradle</emphasis>
        （使用 Kotlin 或 Groovy DSL），或是
        <emphasis>Maven</emphasis>
        。
    </p>
                        </li>
                        <li>
    <p>
        <control>Ktor 版本 (Ktor version)</control>
        :
        選擇所需的 Ktor 版本。
    </p>
                        </li>
                        <li>
    <p>
        <control>引擎 (Engine)</control>
        :
        選擇用於執行伺服器的<Links href="/ktor/server-engines" summary="了解處理網路請求的引擎。">引擎</Links>。
    </p>
                        </li>
                        <li>
    <p>
        <control>設定 (Configuration)</control>
        :
        選擇是否
        在<Links href="/ktor/server-configuration-file" summary="學習如何在設定檔中配置各種伺服器參數。">YAML 或 HOCON 檔案</Links>中指定伺服器參數，或<Links href="/ktor/server-configuration-code" summary="學習如何在程式碼中配置各種伺服器參數。">在程式碼中</Links>指定。
    </p>
                        </li>
                        <li>
    <p>
        <control>包含範例 (Include samples)</control>
        :
        保持此選項啟用以新增外掛程式的範例程式碼。
    </p>
                        </li>
                    </list>
                    <p>對於本教學，您可以保留這些設定的預設值。</p>
                </step>
                <step>
                    <p>按一下
                        <control>完成 (Done)</control>
                        以儲存設定並關閉選單。
                    </p>
                </step>
                <step>
                    <p>您將在下方找到一套可以新增到專案中的<Links href="/ktor/server-plugins" summary="外掛程式提供常見功能，例如序列化、內容編碼、壓縮等。">外掛程式</Links>。外掛程式是構建模組，可在 Ktor 應用程式中提供常見功能，
                        例如身份驗證、序列化和內容編碼、壓縮、Cookie 支援等。
                    </p>
                    <p>為了本教學的目的，您在此階段不需要新增任何外掛程式。</p>
                </step>
                <step>
                    <p>
                        按一下
                        <control>下載 (Download)</control>
                        按鈕以產生並下載您的 Ktor 專案。
                        <img src="ktor_project_generator_new_project_download.png"
                             alt="Ktor 專案產生器下載按鈕"
                             border-effect="line"
                             style="block"
                             width="706"/>
                    </p>
                </step>
                <p>您的下載應自動開始。</p>
            </procedure>
            <p>現在您已產生一個新專案，請繼續<a href="#unpacking">解壓縮並執行您的 Ktor
                專案</a>。</p>
        </chapter>
        <chapter title="使用 IntelliJ IDEA Ultimate 的 Ktor 外掛程式" id="create_project_with_intellij"
                 collapsible="true">
            <p>
                本節說明如何使用 <a
                    href="https://plugins.jetbrains.com/plugin/16008-ktor">Ktor 外掛程式</a>設定 IntelliJ IDEA Ultimate 專案。
            </p>
            <p>
                若要建立新的 Ktor 專案，請<a href="https://www.jetbrains.com/help/idea/run-for-the-first-time.html">開啟 IntelliJ IDEA</a>，並
                依照以下步驟操作：
            </p>
            <procedure>
                <step>
    <p>
        在歡迎畫面中，按一下<control>新增專案 (New Project)</control>。
    </p>
    <p>
        否則，從主選單中選取<ui-path>檔案 (File) | 新增 (New) | 專案 (Project)</ui-path>。
    </p>
                </step>
                <step>
                    <p>
                        在
                        <control>新增專案 (New Project)</control>
                        精靈中，從左側清單中選擇
                        <control>Ktor</control>
                        。
                    </p>
                </step>
                <step>
                    <p>
                        在右側窗格中，您可以指定以下設定：
                    </p>
                    <img src="ktor_idea_new_project_settings.png" alt="Ktor 專案設定" width="706"
                         border-effect="rounded"/>
                    <list>
                        <li>
                            <p>
                                <control>名稱 (Name)</control>
                                :
                                指定專案名稱。輸入
                                <Path>ktor-sample-app</Path>
                                作為您的專案名稱。
                            </p>
                        </li>
                        <li>
                            <p>
                                <control>位置 (Location)</control>
                                :
                                指定專案的目錄。
                            </p>
                        </li>
                        <li>
    <p>
        <control>網站 (Website)</control>
        :
        指定用於產生套件名稱的網域。
    </p>
                        </li>
                        <li>
    <p>
        <control>產物 (Artifact)</control>
        :
        此欄位顯示產生的產物名稱。
    </p>
                        </li>
                        <li>
    <p>
        <control>引擎 (Engine)</control>
        :
        選擇用於執行伺服器的<Links href="/ktor/server-engines" summary="了解處理網路請求的引擎。">引擎</Links>。
    </p>
                        </li>
                        <li>
    <p>
        <control>包含範例 (Include samples)</control>
        :
        保持此選項啟用以新增外掛程式的範例程式碼。
    </p>
                        </li>
                    </list>
                </step>
                <step>
                    <p>
                        按一下
                        <control>進階設定 (Advanced Settings)</control>
                        以展開
                        其他設定選單：
                    </p>
                    <img src="ktor_idea_new_project_advanced_settings.png" alt="Ktor 專案進階設定"
                         width="706" border-effect="rounded"/>
                    <p>
                        提供以下設定：
                    </p>
                    <list>
                        <li>
    <p>
        <control>建置系統 (Build System)</control>
        :
        選擇所需的<Links href="/ktor/server-dependencies" summary="了解如何將 Ktor 伺服器依賴項新增至現有的 Gradle/Maven 專案。">建置系統</Links>。
        這可以是
        <emphasis>Gradle</emphasis>
        （使用 Kotlin 或 Groovy DSL），或是
        <emphasis>Maven</emphasis>
        。
    </p>
                        </li>
                        <li>
    <p>
        <control>Ktor 版本 (Ktor version)</control>
        :
        選擇所需的 Ktor 版本。
    </p>
                        </li>
                        <li>
    <p>
        <control>設定 (Configuration)</control>
        :
        選擇是在<Links href="/ktor/server-configuration-file" summary="學習如何在設定檔中配置各種伺服器參數。">YAML 或 HOCON 檔案</Links>中指定伺服器參數，或<Links href="/ktor/server-configuration-code" summary="學習如何在程式碼中配置各種伺服器參數。">在程式碼中</Links>指定。
    </p>
                        </li>
                    </list>
                    <p>為了本教學的目的，您可以保留這些設定的預設值。</p>
                </step>
                <step>
                    <p>
                        按一下
                        <control>下一步 (Next)</control>
                        以前往下一頁。
                    </p>
                    <img src="ktor_idea_new_project_plugins_list.png" alt="Ktor 外掛程式" width="706"
                         border-effect="rounded"/>
                    <p>
                        在此頁面上，您可以選擇一組<Links href="/ktor/server-plugins" summary="外掛程式提供常見功能，例如序列化、內容編碼、壓縮等。">外掛程式</Links> — 這些構建模組提供了 Ktor 應用程式的常見功能，例如，
                        身份驗證、序列化和內容編碼、壓縮、Cookie 支援等。
                    </p>
                    <p>為了本教學的目的，您在此階段不需要新增任何外掛程式。</p>
                </step>
                <step>
                    <p>
                        按一下
                        <control>建立 (Create)</control>
                        並等待 IntelliJ IDEA 產生專案並
                        安裝依賴項。
                    </p>
                </step>
            </procedure>
            <p>
                現在您已建立一個新專案，請繼續學習如何<a href="#open-explore-run">開啟、
                探索並執行</a>
                應用程式。
            </p>
        </chapter>
        <chapter title="使用 Ktor CLI 工具" id="create_project_with_ktor_cli_tool"
                 collapsible="true">
            <p>
                本節說明如何使用
                <a href="https://github.com/ktorio/ktor-cli">Ktor CLI 工具</a>設定專案。
            </p>
            <p>
                若要建立新的 Ktor 專案，請開啟您選擇的終端機並
                依照以下步驟操作：
            </p>
            <procedure>
                <step>
                    使用以下其中一個命令安裝 Ktor CLI 工具：
                    <tabs>
                        <tab title="macOS/Linux" id="macos-linux">
                            [object Promise]
                        </tab>
                        <tab title="Windows" id="windows">
                            [object Promise]
                        </tab>
                    </tabs>
                </step>
                <step>
                    若要在互動模式下產生新專案，請使用以下命令：
                    [object Promise]
                </step>
                <step>
                    輸入
                    <Path>ktor-sample-app</Path>
                    作為您的專案名稱：
                    <img src="server_create_cli_tool_name_dark.png"
                         alt="在互動模式下使用 Ktor CLI 工具"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>
                        (選用) 您也可以透過編輯專案名稱下方的
                        <ui-path>位置 (Location)</ui-path>
                        路徑來變更專案儲存的位置。
                    </p>
                </step>
                <step>
                    按下
                    <shortcut>Enter</shortcut>
                    以繼續。
                </step>
                <step>
                    在下一步中，您可以搜尋並將<Links href="/ktor/server-plugins" summary="外掛程式提供常見功能，例如序列化、內容編碼、壓縮等。">外掛程式</Links>新增到您的
                    專案中。外掛程式是構建模組，可在 Ktor 應用程式中提供常見功能，
                    例如身份驗證、序列化和內容編碼、壓縮、Cookie 支援等。
                    <img src="server_create_cli_tool_add_plugins_dark.png"
                         alt="使用 Ktor CLI 工具將外掛程式新增至專案"
                         border-effect="rounded"
                         style="block"
                         width="706"/>
                    <p>為了本教學的目的，您在此階段不需要新增任何外掛程式。</p>
                </step>
                <step>
                    按下
                    <shortcut>CTRL+G</shortcut>
                    以產生專案。
                    <p>
                        或者，您可以透過選取
                        <control>建立專案 (CREATE PROJECT (CTRL+G))</control>
                        並按下
                        <shortcut>Enter</shortcut>
                        來產生專案。
                    </p>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="解壓縮並執行您的 Ktor 專案" id="unpacking">
        <p>
            在本節中，您將學習如何從命令列解壓縮、建置並執行專案。以下說明
            假設：
        </p>
        <list type="bullet">
            <li>您已建立並下載名為
                <Path>ktor-sample-app</Path>
                的專案。
            </li>
            <li>此專案已放置在您主目錄中名為
                <Path>myprojects</Path>
                的資料夾中。
            </li>
        </list>
        <p>如有必要，請更改名稱和路徑以符合您的設定。</p>
        <p>開啟您選擇的命令列工具並依照步驟操作：</p>
        <procedure>
            <step>
                <p>在終端機中，導覽至您下載專案的資料夾：</p>
                [object Promise]
            </step>
            <step>
                <p>將 ZIP 封存檔解壓縮到同名資料夾中：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>您的目錄現在將包含 ZIP 封存檔和解壓縮後的資料夾。</p>
            </step>
            <step>
                <p>從該目錄中，導覽至新建立的資料夾：</p>
                [object Promise]
            </step>
            <step>
                <p>在 macOS/UNIX 系統上，您需要讓 gradlew Gradle 輔助指令碼可執行。為此，
                    請使用 <code>chmod</code> 命令：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>若要建置專案，請使用以下命令：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
                <p>如果您看到建置成功，則可以再次透過 Gradle 執行專案。</p>
            </step>
            <step>
                <p>若要執行專案，請使用以下命令：</p>
                <tabs>
                    <tab title="macOS" group-key="macOS">
                        [object Promise]
                    </tab>
                    <tab title="Windows" group-key="windows">
                        [object Promise]
                    </tab>
                </tabs>
            </step>
            <step>
                <p>若要驗證專案是否正在執行，請在輸出中提到的 URL (<a
                        href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>) 開啟瀏覽器。
                    您應該會看到螢幕上顯示「Hello World!」訊息：</p>
                <img src="server_get_started_ktor_sample_app_output.png" alt="產生之 Ktor 專案的輸出"
                     border-effect="line" width="706"/>
            </step>
        </procedure>
        <p>恭喜！您已成功啟動 Ktor 專案。</p>
        <p>請注意，命令列沒有回應，因為底層程序正在忙於執行 Ktor
            應用程式。您可以按下
            <shortcut>CTRL+C</shortcut>
            終止應用程式。
        </p>
    </chapter>
    <chapter title="在 IntelliJ IDEA 中開啟、探索並執行您的 Ktor 專案" id="open-explore-run">
        <chapter title="開啟專案" id="open">
            <p>如果您已安裝 <a href="https://www.jetbrains.com/idea/">IntelliJ IDEA</a>，您可以輕鬆地從命令
                列開啟專案。
            </p>
            <p>
                確保您位於專案資料夾中，然後輸入 <code>idea</code> 命令，後面跟著一個句點以表示當前
                資料夾：
            </p>
            [object Promise]
            <p>
                或者，若要手動開啟專案，請啟動 IntelliJ IDEA。
            </p>
            <p>
                如果歡迎畫面開啟，按一下
                <control>開啟 (Open)</control>
                。否則，請到主選單中的
                <ui-path>檔案 (File) | 開啟 (Open)</ui-path>
                ，然後選取
                <Path>ktor-sample-app</Path>
                資料夾來開啟。
            </p>
            <tip>
                有關管理專案的更多詳細資訊，
                請參閱<a href="https://www.jetbrains.com/help/idea/creating-and-managing-projects.html">IntelliJ IDEA
                文件</a>。
            </tip>
        </chapter>
        <chapter title="探索專案" id="explore">
            <p>無論您選擇哪種選項，專案都應如下所示開啟：</p>
            <img src="server_get_started_idea_project_view.png" alt="IDE 中產生的 Ktor 專案視圖" width="706"/>
            <p>
                為了說明專案佈局，我們展開了
                <control>專案 (Project)</control>
                視圖中的結構並選取了
                <Path>settings-gradle.kts</Path>
                檔案。
            </p>
            <p>
                您將看到執行應用程式的程式碼位於
                <Path>src/main/kotlin</Path>
                下的套件中。預設套件稱為
                <Path>com.example</Path>
                ，並包含一個名為
                <Path>plugins</Path>
                的子套件。
                這些套件中已建立兩個檔案，分別命名為
                <Path>Application.kt</Path>
                和
                <Path>Routing.kt</Path>
            </p>
            <img src="server_get_started_idea_main_folder.png" alt="Ktor 專案 src 資料夾結構" width="400"/>
            <p>專案名稱在
                <Path>settings-gradle.kts</Path>
                中配置。
            </p>
            <img src="server_get_started_idea_settings_file.png" alt="settings.gradle.kt 的內容" width="706"/>
            <p>
                設定檔及其他類型的內容位於
                <Path>src/main/resources</Path>
                資料夾中。
            </p>
            <img src="server_get_started_idea_resources_folder.png" alt="Ktor 專案 resources 資料夾結構"
                 width="400"/>
            <p>
                在
                <Path>src/test/kotlin</Path>
                下的一個套件中已建立一個骨架測試。
            </p>
            <img src="server_get_started_idea_test_folder.png" alt="Ktor 專案 test 資料夾結構" width="400"/>
        </chapter>
        <chapter title="執行專案" id="run">
            <procedure>
                <p>若要在 IntelliJ IDEA 內部執行專案：</p>
                <step>
                    <p>透過按一下右側側邊欄上的 Gradle 圖示 (<img alt="intelliJ IDEA gradle icon"
                                                          src="intellij_idea_gradle_icon.svg" width="16" height="26"/>)
                        開啟<a href="https://www.jetbrains.com/help/idea/jetgradle-tool-window.html">Gradle 工具視窗</a>。</p>
                    <img src="server_get_started_idea_gradle_tab.png" alt="IntelliJ IDEA 中的 Gradle 標籤"
                         border-effect="line" width="706"/>
                </step>
                <step>
                    <p>在此工具視窗中，導覽至
                        <ui-path>任務 (Tasks) | 應用程式 (application)</ui-path>
                        並雙擊
                        <control>執行 (run)</control>
                        任務。
                    </p>
                    <img src="server_get_started_idea_gradle_run.png" alt="IntelliJ IDEA 中的 Gradle 標籤"
                         border-effect="line" width="450"/>
                </step>
                <step>
                    <p>您的 Ktor 應用程式將在 IDE 底部的<a
                            href="https://www.jetbrains.com/help/idea/run-tool-window.html">執行 (Run) 工具視窗</a>中啟動：</p>
                    <img src="server_get_started_idea_run_terminal.png" alt="在終端機中執行的專案" width="706"/>
                    <p>之前在命令列上顯示的相同訊息現在將在
                        <ui-path>執行 (Run)</ui-path>
                        工具視窗中可見。
                    </p>
                </step>
                <step>
                    <p>若要確認專案正在執行，請在指定的 URL
                        (<a href="http://0.0.0.0:8080">http://0.0.0.0:8080</a>) 開啟您的瀏覽器。</p>
                    <p>您應該會再次看到螢幕上顯示「Hello World!」訊息：</p>
                    <img src="server_get_started_ktor_sample_app_output.png" alt="瀏覽器螢幕中的 Hello World"
                         width="706"/>
                </step>
            </procedure>
            <p>
                您可以透過
                <ui-path>執行 (Run)</ui-path>
                工具視窗管理應用程式。
            </p>
            <list type="bullet">
                <li>
                    若要終止應用程式，請按一下停止按鈕 <img src="intellij_idea_terminate_icon.svg"
                                                                             style="inline" height="16" width="16"
                                                                             alt="IntelliJ IDEA 終止圖示"/>
                </li>
                <li>
                    若要重新啟動程序，請按一下重新執行按鈕 <img src="intellij_idea_rerun_icon.svg"
                                                                        style="inline" height="16" width="16"
                                                                        alt="IntelliJ IDEA 重新執行圖示"/>
                </li>
            </list>
            <p>
                這些選項在<a href="https://www.jetbrains.com/help/idea/run-tool-window.html#run-toolbar">IntelliJ IDEA 執行
                工具視窗文件</a>中進一步解釋。
            </p>
        </chapter>
    </chapter>
    <chapter title="要嘗試的其他任務" id="additional-tasks">
        <p>以下是一些您可能希望嘗試的其他任務：</p>
        <list type="decimal">
            <li><a href="#change-the-default-port">變更預設連接埠。</a></li>
            <li><a href="#change-the-port-via-yaml">透過 YAML 變更連接埠。</a></li>
            <li><a href="#add-a-new-http-endpoint">新增新的 HTTP 端點。</a></li>
            <li><a href="#configure-static-content">配置靜態內容。</a></li>
            <li><a href="#write-an-integration-test">編寫整合測試。</a></li>
            <li><a href="#register-error-handlers">註冊錯誤處理程式。</a></li>
        </list>
        <p>
            這些任務不相互依賴，但複雜度逐漸增加。按照聲明的順序嘗試它們是
            逐步學習最簡單的方式。為了簡化並避免重複，以下描述
            假設您按順序嘗試這些任務。
        </p>
        <p>
            在需要編碼的地方，我們已經指定了程式碼和相應的導入。IDE 可能會自動為您新增
            這些導入。
        </p>
        <chapter title="變更預設連接埠" id="change-the-default-port">
            <p>
                在
                <ui-path>專案 (Project)</ui-path>
                視圖中，導覽至
                <Path>src/main/kotlin</Path>
                資料夾，然後進入為您建立的單一套件並依照步驟操作：
            </p>
            <procedure>
                <step>
                    <p>開啟
                        <Path>Application.kt</Path>
                        檔案。您應該會找到類似以下的程式碼：
                    </p>
                    [object Promise]
                </step>
                <step>
                    <p>在 <code>embeddedServer()</code> 函數中，將 <code>port</code> 參數
                        變更為您選擇的其他數字，例如「9292」。</p>
                    [object Promise]
                </step>
                <step>
                    <p>按一下重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新啟動應用程式。</p>
                </step>
                <step>
                    <p>若要驗證您的應用程式是否在新連接埠號下執行，您可以在新的 URL (<a href="http://0.0.0.0:9292">http://0.0.0.0:9292</a>) 開啟您的瀏覽器，或
                        <a href="https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html#creating-http-request-files">在 IntelliJ IDEA 中建立新的 HTTP 請求檔案</a>：</p>
                    <img src="server_get_started_port_change.png"
                         alt="在 IntelliJ IDEA 中使用 HTTP 請求檔案測試連接埠變更" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="透過 YAML 變更連接埠" id="change-the-port-via-yaml">
            <p>
                建立新的 Ktor 專案時，您可以選擇將設定外部儲存，無論是在
                YAML 還是
                HOCON 檔案中：
            </p>
            <img src="ktor_project_generator_configuration_options.png" width="400"
                 alt="Ktor 專案產生器設定選項"/>
            <p>
                如果您選擇外部儲存設定，那麼
                <Path>Application.kt</Path>
                中的程式碼將會是這樣：
            </p>
            [object Promise]
            <p>
                這些將是儲存在
                <Path>src/main/resources/</Path>
                內設定檔中的值：
            </p>
            <tabs>
                <tab title="application.yaml (YAML)" group-key="yaml">
                    [object Promise]
                </tab>
                <tab title="application.conf (HOCON)" group-key="hocon">
                    [object Promise]
                </tab>
            </tabs>
            <p>
                在這種情況下，您不需要更改任何程式碼來變更連接埠號。只需更改 YAML 或 HOCON
                檔案中的值並重新啟動應用程式。變更可以像上面
                <a href="#change-the-default-port">變更預設連接埠</a>一樣進行驗證。
            </p>
        </chapter>
        <chapter title="新增新的 HTTP 端點" id="add-a-new-http-endpoint">
            <p>接下來，您將建立一個新的 HTTP 端點，它將回應 GET 請求。</p>
            <p>
                在
                <ui-path>專案 (Project)</ui-path>
                工具視窗中，導覽至
                <Path>src/main/kotlin/com/example</Path>
                資料夾並依照步驟操作：
            </p>
            <procedure>
                <step>
                    <p>開啟
                        <Path>Application.kt</Path>
                        檔案並找到 <code>configureRouting()</code> 函數。
                    </p>
                </step>
                <step>
                    <p>在 IntelliJ IDEA 中，將游標置於函數名稱上方
                        並按下
                        <shortcut>⌘Cmd+B</shortcut>
                        ，即可導覽至 <code>configureRouting()</code> 函數。
                    </p>
                    <p>或者，您可以透過開啟 <code>Routing.kt</code> 檔案來導覽至該函數。</p>
                    <p>這是您應該看到的程式碼：</p>
                    [object Promise]
                </step>
                <step>
                    <p>若要建立新的端點，請插入下方所示的額外五行程式碼：</p>
                    [object Promise]
                    <p>請注意，您可以將 <code>/test1</code> URL 更改為您喜歡的任何內容。</p>
                </step>
                <step>
                    <p>為了使用 <code>ContentType</code>，請新增以下導入：</p>
                    [object Promise]
                </step>
                <step>
                    <p>按一下重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新啟動應用程式。</p>
                </step>
                <step>
                    <p>在瀏覽器中請求新的 URL (<a
                            href="http://0.0.0.0:9292/test1">http://0.0.0.0:9292/test1</a>)。您
                        應該使用的連接埠號將取決於您是否已嘗試第一個任務 (<a
                                href="#change-the-default-port">變更預設連接埠</a>)。您應該會看到下方顯示的
                        輸出：</p>
                    <img src="server_get_started_add_new_http_endpoint_output.png"
                         alt="顯示「Hello from Ktor」的瀏覽器畫面" width="706"/>
                    <p>如果您已建立 HTTP 請求檔案，您也可以在那裡驗證新的端點：</p>
                    <img src="server_get_started_add_new_http_endpoint.png" alt="IntelliJ IDEA 中的 HTTP 請求檔案"
                         width="450"/>
                    <p>請注意，需要包含三個井號 (###) 的行來分隔不同的請求。</p>
                </step>
            </procedure>
        </chapter>
        <chapter title="配置靜態內容" id="configure-static-content">
            <p>在
                <ui-path>專案 (Project)</ui-path>
                工具視窗中，導覽至
                <Path>src/main/kotlin/com/example/plugins</Path>
                資料夾並依照步驟操作：
            </p>
            <procedure>
                <step>
                    <p>開啟 <code>Routing.kt</code> 檔案。</p>
                    <p>這應該再次是預設內容：</p>
                    [object Promise]
                    <p>對於此任務，您是否已插入
                        <a href="#add-a-new-http-endpoint">新增新的 HTTP 端點</a>中指定的額外端點內容並不重要。</p>
                </step>
                <step>
                    <p>將以下行新增至路由部分：</p>
                    [object Promise]
                    <p>此行的含義如下：</p>
                    <list type="bullet">
                        <li>呼叫 <code>staticResources()</code> 會告知 Ktor，我們希望應用程式能夠
                            提供標準網站內容，例如
                            HTML 和 JavaScript 檔案。儘管此內容可以在瀏覽器中執行，但從
                            伺服器的角度來看，它被視為靜態內容。
                        </li>
                        <li>URL <code>/content</code> 指定了應該用於擷取此內容的路徑。
                        </li>
                        <li>路徑 <code>mycontent</code> 是靜態內容將所在的資料夾名稱。Ktor 將在
                            <code>resources</code> 目錄中尋找此資料夾。
                        </li>
                    </list>
                </step>
                <step>
                    <p>新增以下導入：</p>
                    [object Promise]
                </step>
                <step>
                    <p>在
                        <control>專案 (Project)</control>
                        工具視窗中，右鍵點擊 <code>src/main/resources</code> 資料夾並選擇
                        <control>新增 (New) | 目錄 (Directory)</control>
                        。
                    </p>
                    <p>或者，選取 <code>src/main/resources</code> 資料夾，按下
                        <shortcut>⌘Сmd+N</shortcut>
                        ，然後按一下
                        <control>目錄 (Directory)</control>
                        。
                    </p>
                </step>
                <step>
                    <p>將新目錄命名為 <code>mycontent</code> 並按下
                        <shortcut>↩Enter</shortcut>
                        。
                    </p>
                </step>
                <step>
                    <p>右鍵點擊新建立的資料夾並按一下
                        <control>新增 (New) | 檔案 (File)</control>
                        。
                    </p>
                </step>
                <step>
                    <p>將新檔案命名為「sample.html」並按下
                        <shortcut>↩Enter</shortcut>
                        。
                    </p>
                </step>
                <step>
                    <p>用有效的 HTML 填充新建立的檔案頁面，例如：</p>
                    [object Promise]
                </step>
                <step>
                    <p>按一下重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新啟動應用程式。</p>
                </step>
                <step>
                    <p>當您在 <a href="http://0.0.0.0:9292/content/sample.html">http://0.0.0.0:9292/content/sample.html</a>
                        開啟瀏覽器時，您的範例頁面內容應該會顯示：</p>
                    <img src="server_get_started_configure_static_content_output.png"
                         alt="瀏覽器中靜態頁面的輸出" width="706"/>
                </step>
            </procedure>
        </chapter>
        <chapter title="編寫整合測試" id="write-an-integration-test">
            <p>
                Ktor 支援<Links href="/ktor/server-testing" summary="學習如何使用特殊的測試引擎來測試您的伺服器應用程式。">建立整合測試</Links>，並且您產生的
                專案已捆綁此功能。
            </p>
            <p>若要使用此功能，請依照以下步驟操作：</p>
            <procedure>
                <step>
                    <p>
                        在
                        <Path>src</Path>
                        下建立一個名為「test」的新目錄，以及一個名為「kotlin」的子目錄。
                    </p>
                </step>
                <step>
                    <p>在
                        <Path>src/test/kotlin</Path>
                        內部建立一個名為「com.example」的新套件。
                    </p>
                </step>
                <step>
                    <p>
                        在
                        <Path>src/test/kotlin/com.example</Path>
                        內建立一個名為「ApplicationTest.kt」的新檔案。
                    </p>
                </step>
                <step>
                    <p>開啟 <code>ApplicationTest.kt</code> 檔案並新增以下程式碼：</p>
                    [object Promise]
                    <p><code>testApplication()</code> 方法建立了一個新的 Ktor 實例。此實例
                        在測試環境中運行，而不是像 Netty 這樣的伺服器。
                    </p>
                    <p>然後，您可以使用 <code>application()</code> 方法調用從
                        <code>embeddedServer()</code> 呼叫的相同設定。</p>
                    <p>最後，您可以使用內建的 <code>client</code> 物件和 JUnit 斷言來傳送
                        範例請求並檢查回應。</p>
                </step>
                <step>
                    <p>新增以下所需的導入：</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                該測試可以使用 IntelliJ IDEA 中執行測試的任何標準方式執行。請注意，由於您正在執行
                Ktor 的新實例，因此測試的成功或失敗不取決於您的應用程式是否在
                0.0.0.0 上運行。
            </p>
            <p>
                如果您已成功完成<a href="#add-a-new-http-endpoint">新增新的 HTTP 端點</a>，
                您應該能夠新增此額外測試：
            </p>
            [object Promise]
            <p>需要以下額外導入：</p>
            [object Promise]
        </chapter>
        <chapter title="註冊錯誤處理程式" id="register-error-handlers">
            <p>
                您可以使用<Links href="/ktor/server-status-pages" summary="StatusPages 允許 Ktor 應用程式根據拋出的異常或狀態碼適當地回應任何失敗狀態。">StatusPages
                外掛程式</Links>在您的 Ktor 應用程式中處理錯誤。
            </p>
            <p>
                此外掛程式預設不包含在您的專案中。您可以在 Ktor
                專案產生器中的
                <ui-path>外掛程式 (Plugins)</ui-path>
                部分，或 IntelliJ IDEA 中的專案精靈中將其新增到專案中。由於您已經建立了專案，在接下來的步驟中，
                您將學習如何手動新增和配置此外掛程式。
            </p>
            <p>
                實現此目標有四個步驟：
            </p>
            <list type="decimal">
                <li><a href="#add-dependency">在 Gradle 建置檔案中新增新的依賴項。</a></li>
                <li><a href="#install-plugin-and-specify-handler">安裝外掛程式並指定例外處理程式。</a></li>
                <li><a href="#write-sample-code">編寫範例程式碼以觸發處理程式。</a></li>
                <li><a href="#restart-and-invoke">重新啟動並呼叫範例程式碼。</a></li>
            </list>
            <procedure title="新增新的依賴項" id="add-dependency">
                <p>在
                    <control>專案 (Project)</control>
                    工具視窗中，導覽至專案根資料夾並依照步驟操作：
                </p>
                <step>
                    <p>開啟 <code>build.gradle.kts</code> 檔案。</p>
                </step>
                <step>
                    <p>在依賴項部分新增如下所示的額外依賴項：</p>
                    [object Promise]
                    <p>完成此操作後，您需要重新載入專案以取得此新依賴項。</p>
                </step>
                <step>
                    <p>在 macOS 上按下
                        <shortcut>Shift+⌘Cmd+I</shortcut>
                        或在 Windows 上按下
                        <shortcut>Ctrl+Shift+O</shortcut>
                        以重新載入專案。
                    </p>
                </step>
            </procedure>
            <procedure title="安裝外掛程式並指定例外處理程式"
                       id="install-plugin-and-specify-handler">
                <step>
                    <p>導覽至 <code>Routing.kt</code> 中的 <code>configureRouting()</code> 方法並新增以下程式碼行：</p>
                    [object Promise]
                    <p>這些行會安裝 <code>StatusPages</code> 外掛程式並指定當
                        拋出 <code>IllegalStateException</code> 類型的例外時要執行的動作。</p>
                </step>
                <step>
                    <p>新增以下導入：</p>
                    [object Promise]
                </step>
            </procedure>
            <p>
                請注意，HTTP 錯誤碼通常會在回應中設定，但為了本任務的目的，
                輸出會直接顯示在瀏覽器中。
            </p>
            <procedure title="編寫範例程式碼以觸發處理程式" id="write-sample-code">
                <step>
                    <p>在 <code>configureRouting()</code> 方法中，新增如下所示的額外行：</p>
                    [object Promise]
                    <p>您現在已新增一個 URL 為 <code>/error-test</code> 的端點。當此端點被觸發時，將
                        拋出處理程式中使用的類型例外。</p>
                </step>
            </procedure>
            <procedure title="重新啟動並呼叫範例程式碼" id="restart-and-invoke">
                <step>
                    <p>按一下重新執行按鈕 (<img alt="IntelliJ IDEA 重新執行按鈕圖示"
                                                       src="intellij_idea_rerun_icon.svg" height="16" width="16"/>)
                        以重新啟動應用程式。</p></step>
                <step>
                    <p>在您的瀏覽器中，導覽至 URL <a href="http://0.0.0.0:9292/error-test">http://0.0.0.0:9292/error-test</a>。
                        您應該會看到如下所示的錯誤訊息：</p>
                    <img src="server_get_started_register_error_handler_output.png"
                         alt="顯示訊息「App in illegal state as Too Busy」的瀏覽器畫面" width="706"/>
                </step>
            </procedure>
        </chapter>
    </chapter>
    <chapter title="後續步驟" id="next_steps">
        <p>
            如果您已完成所有額外任務，您現在已掌握配置 Ktor
            伺服器、整合 Ktor 外掛程式以及實作新路由的知識。然而，這僅僅是個開始。要
            更深入了解 Ktor 的基礎概念，請繼續本指南中的下一個教學。
        </p>
        <p>
            接下來，您將學習如何透過建立任務管理應用程式來<Links href="/ktor/server-requests-and-responses" summary="透過建構任務管理應用程式，學習使用 Ktor 在 Kotlin 中進行路由、處理請求和參數的基礎知識。">處理請求並
            產生回應</Links>。
        </p>
    </chapter>
</topic>