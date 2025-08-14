<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="添加服务器依赖项"
       id="server-dependencies" help-id="Gradle">
<show-structure for="chapter" depth="2"/>
<link-summary>了解如何向现有 Gradle/Maven 项目添加 Ktor Server 依赖项。</link-summary>
<p>
    在本主题中，我们将向您展示如何向现有 Gradle/Maven 项目添加 Ktor Server 所需的依赖项。
</p>
<chapter title="配置版本库" id="repositories">
    <p>
        在添加 Ktor 依赖项之前，您需要为该项目配置版本库：
    </p>
    <list>
        <li>
            <p>
                <control>生产</control>
            </p>
            <p>
                Ktor 的生产版本在 Maven 中央版本库中可用。
                您可以在构建脚本中按如下方式声明此版本库：
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
                            您无需在 <Path>pom.xml</Path> 文件中添加 Maven 中央版本库，因为您的项目从
                            <a href="https://maven.apache.org/guides/introduction/introduction-to-the-pom.html#super-pom">Super POM</a> 继承了中央版本库。
                        </p>
                    </note>
                </tab>
            </tabs>
        </li>
        <li>
            <p>
                <control>抢先体验计划 (EAP)</control>
            </p>
            <p>
                要访问 Ktor 的 <a href="https://ktor.io/eap/">EAP</a> 版本，您需要引用 <a href="https://maven.pkg.jetbrains.space/public/p/ktor/eap/io/ktor/">Space 版本库</a>：
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
                请注意，Ktor EAP 可能需要 <a href="https://maven.pkg.jetbrains.space/kotlin/p/kotlin/dev">Kotlin 开发版本库</a>：
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
<chapter title="添加依赖项" id="add-ktor-dependencies">
    <chapter title="核心依赖项" id="core-dependencies">
        <p>
            每个 Ktor 应用程序至少需要以下依赖项：
        </p>
        <list>
            <li>
                <p>
                    <code>ktor-server-core</code>: 包含核心 Ktor 功能。
                </p>
            </li>
            <li>
                <p>
                    一个用于<Links href="/ktor/server-engines" summary="了解处理网络请求的引擎。">引擎</Links>的依赖项（例如，<code>ktor-server-netty</code>）。
                </p>
            </li>
        </list>
        <p>
            对于不同的平台，Ktor 提供带有 <code>-jvm</code> 等后缀的平台特有 artifact，例如 <code>ktor-server-core-jvm</code> 或 <code>ktor-server-netty-jvm</code>。
            请注意，Gradle 会解析给定平台适用的 artifact，而 Maven 不支持此功能。
            这意味着对于 Maven，您需要手动添加平台特有后缀。
            基本 Ktor 应用程序的 <code>dependencies</code> 代码块可能如下所示：
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
    <chapter title="日志依赖项" id="logging-dependency">
        <p>
            Ktor 使用 SLF4J API 作为各种日志框架（例如，Logback 或 Log4j）的门面，并允许您记录应用程序事件。
            要了解如何添加所需的 artifact，请参阅 <a href="server-logging.md#add_dependencies">添加日志依赖项</a>。
        </p>
    </chapter>
    <chapter title="插件依赖项" id="plugin-dependencies">
        <p>
            <Links href="/ktor/server-plugins" summary="插件提供常见功能，例如序列化、内容编码、压缩等。">插件</Links>扩展 Ktor 功能可能需要额外的依赖项。
            您可以从相应主题中了解更多信息。
        </p>
    </chapter>
</chapter>
<var name="target_module" value="server"/>
<chapter title="确保 Ktor 版本一致性" id="ensure-version-consistency">
    <chapter id="using-gradle-plugin" title="使用 Ktor Gradle 插件">
        <p>
            应用 <a href="https://github.com/ktorio/ktor-build-plugins">Ktor Gradle 插件</a>会隐式添加 Ktor BOM 依赖项，并确保所有 Ktor 依赖项都处于相同的版本。在这种情况下，依赖 Ktor artifact 时不再需要指定版本：
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
    <chapter id="using-version-catalog" title="使用已发布的版本目录">
        <p>
            您还可以通过使用已发布的版本目录来集中管理 Ktor 依赖项声明。
            此方法提供以下优势：
        </p>
        <list id="published-version-catalog-benefits">
            <li>
                消除了在您自己的目录中手动声明 Ktor 版本的需要。
            </li>
            <li>
                在单个命名空间下公开每个 Ktor 模块。
            </li>
        </list>
        <p>
            要声明目录，请在
            <Path>settings.gradle.kts</Path>
            中创建您选择名称的版本目录：
        </p>
        [object Promise]
        <p>
            然后，您可以通过引用目录名称在模块的
            <Path>build.gradle.kts</Path>
            中添加依赖项：
        </p>
        [object Promise]
    </chapter>
</chapter>
<chapter title="创建运行应用程序的入口点" id="create-entry-point">
    <p>
        <Links href="/ktor/server-run" summary="了解如何运行服务器 Ktor 应用程序。">运行</Links> Ktor 服务器使用 Gradle/Maven 取决于创建服务器的方式。
        您可以通过以下方式之一指定应用程序主类：
    </p>
    <list>
        <li>
            <p>
                如果您使用 <a href="#embedded-server">embeddedServer</a>，请按如下方式指定主类：
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
                如果您使用 <a href="#engine-main">EngineMain</a>，则需要将其配置为主类。
                对于 Netty，它将如下所示：
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
            如果您打算将应用程序打包为 Fat JAR，那么在配置相应插件时，您还需要考虑创建服务器的方式。
            从以下主题了解更多信息：
        </p>
        <list>
            <li>
                <p>
                    <Links href="/ktor/server-fatjar" summary="了解如何使用 Ktor Gradle 插件创建和运行可执行 fat JAR。">使用 Ktor Gradle 插件创建 fat JAR</Links>
                </p>
            </li>
            <li>
                <p>
                    <Links href="/ktor/maven-assembly-plugin" summary="示例项目：tutorial-server-get-started-maven">使用 Maven Assembly 插件创建 fat JAR</Links>
                </p>
            </li>
        </list>
    </note>
</chapter>
</topic>