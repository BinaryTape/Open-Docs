```xml
<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="新增伺服器相依性"
       id="server-dependencies" help-id="Gradle">
    <show-structure for="chapter" depth="2"/>
    <link-summary>了解如何將 Ktor 伺服器相依性新增到現有的 Gradle/Maven 專案。</link-summary>
    <p>
        在本主題中，我們將向您展示如何將 Ktor 伺服器所需的相依性新增到現有的 Gradle/Maven 專案。
    </p>
    <chapter title="設定儲存庫" id="repositories">
        <p>
            在新增 Ktor 相依性之前，您需要為此專案設定儲存庫：
        </p>
        <list>
            <li>
                <p>
                    <control>正式版</control>
                </p>
                <p>
                    Ktor 的正式版發佈可在 Maven 中央儲存庫中取得。
                    您可以在建置腳本中宣告此儲存庫，如下所示：
                </p>
                <tabs group="languages">
                    <tab title="Gradle (Kotlin)" group-key="kotlin">
                        [object Promise]
                    </tab>
                    <tab title="Gradle (Groovy)" group-key="groovy">
                        [object Promise]
                    </tab>
                    <tab title="Maven" group-key="maven">
                        <note>
                            <p>
                                您無需在 <Path>pom.xml</Path> 檔案中新增 Maven 中央儲存庫，因為您的專案從
                                <a href="https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom">Super POM</a> 繼承了中央儲存庫。
                            </p>
                        </note>
                    </tab>
                </tabs>
            </li>
            <li>
                <p>
                    <control>搶先體驗計畫 (EAP)</control>
                </p>
                <p>
                    要取得 Ktor 的 <a href="https://ktor.io/eap/">EAP</a> 版本，您需要參考 <a href="https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/">Space 儲存庫</a>：
                </p>
                <tabs group="languages">
                    <tab title="Gradle (Kotlin)" group-key="kotlin">
                        [object Promise]
                    </tab>
                    <tab title="Gradle (Groovy)" group-key="groovy">
                        [object Promise]
                    </tab>
                    <tab title="Maven" group-key="maven">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    請注意，Ktor EAP 可能需要 <a href="https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev">Kotlin 開發儲存庫</a>：
                </p>
                <tabs group="languages">
                    <tab title="Gradle (Kotlin)" group-key="kotlin">
                        [object Promise]
                    </tab>
                    <tab title="Gradle (Groovy)" group-key="groovy">
                        [object Promise]
                    </tab>
                    <tab title="Maven" group-key="maven">
                        [object Promise]
                    </tab>
                </tabs>
            </li>
        </list>
    </chapter>
    <chapter title="新增相依性" id="add-ktor-dependencies">
        <chapter title="核心相依性" id="core-dependencies">
            <p>
                每個 Ktor 應用程式至少需要以下相依性：
            </p>
            <list>
                <li>
                    <p>
                        <code>ktor-server-core</code>：包含 Ktor 核心功能。
                    </p>
                </li>
                <li>
                    <p>
                        <Links href="/ktor/server-engines" summary="了解處理網路請求的引擎。">引擎</Links>的相依性 (例如，<code>ktor-server-netty</code>)。
                    </p>
                </li>
            </list>
            <p>
                對於不同的平台，Ktor 提供了帶有 <code>-jvm</code> 等後綴的平台專用構件，例如 <code>ktor-server-core-jvm</code> 或 <code>ktor-server-netty-jvm</code>。
                請注意，Gradle 會解析適用於給定平台的構件，而 Maven 不支援此功能。
                這表示對於 Maven，您需要手動新增平台專用後綴。
                基本 Ktor 應用程式的 <code>dependencies</code> 區塊可能如下所示：
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
                <tab title="Maven" group-key="maven">
                    [object Promise]
                </tab>
            </tabs>
        </chapter>
        <chapter title="記錄相依性" id="logging-dependency">
            <p>
                Ktor 使用 SLF4J API 作為各種記錄框架（例如 Logback 或 Log4j）的門面，並允許您記錄應用程式事件。
                要了解如何新增所需的構件，請參閱<a href="server-logging.md#add_dependencies">新增記錄器相依性</a>。
            </p>
        </chapter>
        <chapter title="外掛程式相依性" id="plugin-dependencies">
            <p>
                <Links href="/ktor/server-plugins" summary="外掛程式提供常見功能，例如序列化、內容編碼、壓縮等。">外掛程式</Links>擴展 Ktor 功能可能需要額外的相依性。
                您可以從相關主題中了解更多資訊。
            </p>
        </chapter>
    </chapter>
    <var name="target_module" value="server"/>
    <chapter title="確保 Ktor 版本一致性" id="ensure-version-consistency">
        <chapter id="using-gradle-plugin" title="使用 Ktor Gradle 外掛程式">
            <p>
                應用 <a href="https://github.com/ktorio/ktor-build-plugins">Ktor Gradle 外掛程式</a>
                隱式新增 Ktor BOM 相依性，並確保所有 Ktor 相依性都使用相同版本。在這種情況下，當依賴 Ktor
                構件時，您不再需要指定版本：
            </p>
            <tabs group="languages">
                <tab title="Gradle (Kotlin)" group-key="kotlin">
                    [object Promise]
                </tab>
                <tab title="Gradle (Groovy)" group-key="groovy">
                    [object Promise]
                </tab>
            </tabs>
        </chapter>
        <chapter id="using-version-catalog" title="使用已發布的版本目錄">
            <p>
                您也可以透過使用已發布的版本目錄來集中管理 Ktor 相依性宣告。
                此方法提供以下優點：
            </p>
            <list id="published-version-catalog-benefits">
                <li>
                    無需在您自己的目錄中手動宣告 Ktor 版本。
                </li>
                <li>
                    在單一命名空間下公開每個 Ktor 模組。
                </li>
            </list>
            <p>
                要宣告目錄，請在
                <Path>settings.gradle.kts</Path>
                中建立一個您選擇的名稱的版本目錄：
            </p>
            [object Promise]
            <p>
                然後，您可以在模組的
                <Path>build.gradle.kts</Path>
                中透過引用目錄名稱來新增相依性：
            </p>
            [object Promise]
        </chapter>
    </chapter>
    <chapter title="建立應用程式執行入口點" id="create-entry-point">
        <p>
            <Links href="/ktor/server-run" summary="了解如何執行 Ktor 伺服器應用程式。">執行</Links> Ktor 伺服器使用 Gradle/Maven 的方式取決於 <Links href="/ktor/server-create-and-configure" summary="了解如何根據您的應用程式部署需求建立伺服器。">建立伺服器</Links>的方式。
            您可以透過以下其中一種方式指定應用程式主類別：
        </p>
        <list>
            <li>
                <p>
                    如果您使用 <a href="#embedded-server">embeddedServer</a>，請如下指定主類別：
                </p>
                <tabs group="languages">
                    <tab title="Gradle (Kotlin)" group-key="kotlin">
                        [object Promise]
                    </tab>
                    <tab title="Gradle (Groovy)" group-key="groovy">
                        [object Promise]
                    </tab>
                    <tab title="Maven" group-key="maven">
                        [object Promise]
                    </tab>
                </tabs>
            </li>
            <li>
                <p>
                    如果您使用 <a href="#engine-main">EngineMain</a>，您需要將其設定為主類別。
                    對於 Netty，它將如下所示：
                </p>
                <tabs group="languages">
                    <tab title="Gradle (Kotlin)" group-key="kotlin">
                        [object Promise]
                    </tab>
                    <tab title="Gradle (Groovy)" group-key="groovy">
                        [object Promise]
                    </tab>
                    <tab title="Maven" group-key="maven">
                        [object Promise]
                    </tab>
                </tabs>
            </li>
        </list>
        <note>
            <p>
                如果您要將應用程式打包為 Fat JAR，您還需要在配置相應外掛程式時，考量建立伺服器的方式。
                從以下主題了解更多資訊：
            </p>
            <list>
                <li>
                    <p>
                        <Links href="/ktor/server-fatjar" summary="了解如何使用 Ktor Gradle 外掛程式建立和執行可執行 Fat JAR。">使用 Ktor Gradle 外掛程式建立 Fat JAR</Links>
                    </p>
                </li>
                <li>
                    <p>
                        <Links href="/ktor/maven-assembly-plugin" summary="範例專案：tutorial-server-get-started-maven">使用 Maven Assembly 外掛程式建立 Fat JAR</Links>
                    </p>
                </li>
            </list>
        </note>
    </chapter>
</topic>