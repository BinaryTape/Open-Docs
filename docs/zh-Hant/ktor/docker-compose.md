<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="docker-compose" title="Docker Compose">
<show-structure for="chapter" depth="2"/>
<tldr>
    <p>
        <control>初始專案</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-db-integration">tutorial-server-db-integration</a>
    </p>
    <p>
        <control>最終專案</control>
        : <a
            href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/tutorial-server-docker-compose">tutorial-server-docker-compose</a>
    </p>
</tldr>
<p>在本主題中，我們將向您展示如何在 <a href="https://docs.docker.com/compose/">Docker Compose</a> 下執行 Ktor 伺服器應用程式。我們將使用在
    <Links href="/ktor/server-integrate-database" summary="學習如何使用 Exposed SQL 函式庫將 Ktor 服務連接到資料庫儲存庫的過程。">整合資料庫</Links> 教學中建立的專案，該專案使用
    <a href="https://github.com/JetBrains/Exposed">Exposed</a> 連接到 <a href="https://www.postgresql.org/docs/">PostgreSQL</a> 資料庫，其中資料庫和網頁應用程式分開執行。</p>
<chapter title="準備應用程式" id="prepare-app">
    <chapter title="提取資料庫設定" id="extract-db-settings">
        <p>
            在 <a href="server-integrate-database.topic#config-db-connection">設定資料庫連接</a> 教學中建立的專案使用硬編碼屬性來建立資料庫連接。</p>
        <p>
            讓我們將 PostgreSQL 資料庫的連接設定提取到一個 <Links href="/ktor/server-configuration-file" summary="學習如何在配置檔案中配置各種伺服器參數。">自訂配置組</Links>。
        </p>
        <procedure>
            <step>
                <p>打開 <Path>src/main/resources</Path> 中的 <Path>application.yaml</Path> 檔案，並將 <code>storage</code> 群組添加到 <code>ktor</code> 群組之外，如下所示：
                </p>
                [object Promise]
                <p>這些設定稍後將在 <a href="#configure-docker">
                    <Path>compose.yml</Path>
                </a> 檔案中配置。
                </p>
            </step>
            <step>
                <p>
                    打開 <Path>src/main/kotlin/com/example/plugins/</Path> 中的 <Path>Databases.kt</Path> 檔案，並更新 <code>configureDatabases()</code> 函式以從配置檔案載入儲存設定：
                </p>
                [object Promise]
                <p>
                    <code>configureDatabases()</code> 函式現在接受 <code>ApplicationConfig</code> 並使用 <code>config.property</code> 載入自訂設定。
                </p>
            </step>
            <step>
                <p>
                    打開 <Path>src/main/kotlin/com/example/</Path> 中的 <Path>Application.kt</Path> 檔案，並將 <code>environment.config</code> 傳遞給 <code>configureDatabases()</code> 以在應用程式啟動時載入連接設定：
                </p>
                [object Promise]
            </step>
        </procedure>
    </chapter>
    <chapter title="配置 Ktor 外掛程式" id="configure-ktor-plugin">
        <p>為了在 Docker 上執行，應用程式需要將所有必需的檔案部署到容器中。根據您使用的建置系統，有不同的外掛程式可以實現此目的：</p>
        <list>
            <li><Links href="/ktor/server-fatjar" summary="學習如何使用 Ktor Gradle 外掛程式建立並執行可執行的 fat JAR。">使用 Ktor Gradle 外掛程式建立 fat JARs</Links></li>
            <li><Links href="/ktor/maven-assembly-plugin" summary="範例專案：tutorial-server-get-started-maven">使用 Maven Assembly 外掛程式建立 fat JARs</Links></li>
        </list>
        <p>在我們的範例中，Ktor 外掛程式已經應用於 <Path>build.gradle.kts</Path> 檔案中。
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="配置 Docker" id="configure-docker">
    <chapter title="準備 Docker 映像檔" id="prepare-docker-image">
        <p>
            為了將應用程式 Docker 化，在專案的根目錄中建立一個新的 <Path>Dockerfile</Path> 並插入以下內容：
        </p>
        [object Promise]
        <tip>
            有關此多階段建置如何運作的更多資訊，請參閱 <a href="docker.md#prepare-docker">準備 Docker 映像檔</a>。
        </tip>
        <tip id="jdk_image_replacement_tip">
  <p>
   此範例使用 Amazon Corretto Docker 映像檔，但您可以將其替換為任何其他合適的替代方案，例如：
  </p>
  <list>
<li><a href="https://hub.docker.com/_/eclipse-temurin">Eclipse Temurin</a></li>
<li><a href="https://hub.docker.com/_/ibm-semeru-runtimes">IBM Semeru</a></li>
<li><a href="https://hub.docker.com/_/ibmjava">IBM Java</a></li>
<li><a href="https://hub.docker.com/_/sapmachine">SAP Machine JDK</a></li>
  </list>
</tip>
    </chapter>
    <chapter title="配置 Docker Compose" id="configure-docker-compose">
        <p>在專案的根目錄中，建立一個新的 <Path>compose.yml</Path> 檔案並添加以下內容：
        </p>
        [object Promise]
        <list>
            <li><code>web</code> 服務用於執行封裝在 <a href="#prepare-docker-image">映像檔</a> 中的 Ktor 應用程式。
            </li>
            <li><code>db</code> 服務使用 <code>postgres</code> 映像檔來建立用於儲存任務的 <code>ktor_tutorial_db</code> 資料庫。
            </li>
        </list>
    </chapter>
</chapter>
<chapter title="建置並執行服務" id="build-run">
    <procedure>
        <step>
            <p>
                執行以下命令來建立包含 Ktor 應用程式的 <a href="#configure-ktor-plugin">fat JAR</a>：
            </p>
            [object Promise]
        </step>
        <step>
            <p>
                使用 <code>docker compose up</code> 命令來建置映像檔並啟動容器：
            </p>
            [object Promise]
        </step>
        <step>
            等待 Docker Compose 完成映像檔建置。
        </step>
        <step>
            <p>
                導航到 <a href="http://localhost:8080/static/index.html">http://localhost:8080/static/index.html</a> 以開啟網頁應用程式。您應該會看到「任務管理器客戶端」頁面，顯示用於過濾和添加新任務的三個表單，以及一個任務表。
            </p>
            <img src="tutorial_server_db_integration_manual_test.gif"
                 alt="顯示任務管理器客戶端的瀏覽器視窗"
                 border-effect="rounded"
                 width="706"/>
        </step>
    </procedure>
</chapter>