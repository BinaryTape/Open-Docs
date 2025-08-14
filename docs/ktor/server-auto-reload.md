<topic xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       title="自动重载"
       id="server-auto-reload" help-id="Auto_reload">
<tldr>
        <p>
            <b>代码示例</b>:
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>,
            <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">autoreload-embedded-server</a>
        </p>
</tldr>
<link-summary>
        了解如何使用自动重载在代码更改时重新加载应用程序类。
</link-summary>
<p>
        <Links href="/ktor/server-run" summary="了解如何运行 Ktor 服务器应用程序。">重启</Links>服务器在开发期间可能需要一些时间。
        Ktor 允许您通过使用<emphasis>自动重载</emphasis>来克服此限制，它会在代码更改时重新加载应用程序类，并提供快速反馈循环。
        要使用自动重载，请按照以下步骤操作：
</p>
<list style="decimal">
        <li>
            <p>
                <a href="#enable">启用开发模式</a>
            </p>
        </li>
        <li>
            <p>
                （可选）<a href="#watch-paths">配置监视路径</a>
            </p>
        </li>
        <li>
            <p>
                <a href="#recompile">启用更改时重新编译</a>
            </p>
        </li>
</list>
<chapter title="启用开发模式" id="enable">
        <p>
            要使用自动重载，您需要首先<a href="#enable">启用开发模式</a>。
            这取决于您<Links href="/ktor/server-create-and-configure" summary="了解如何根据您的应用程序部署需求创建服务器。">创建和运行服务器</Links>的方式：
        </p>
        <list>
            <li>
                <p>
                    如果您使用 <code>EngineMain</code> 运行服务器，请在<a href="#application-conf">配置文件</a>中启用开发模式。
                </p>
            </li>
            <li>
                <p>
                    如果您使用 <code>embeddedServer</code> 运行服务器，您可以使用
                    <a href="#system-property">io.ktor.development</a>
                    系统属性。
                </p>
            </li>
        </list>
        <p>
            启用开发模式后，Ktor 将自动监视工作目录中的输出文件。
            如果需要，您可以通过指定
            <a href="#watch-paths">监视路径</a>来缩小监视文件夹的范围。
        </p>
</chapter>
<chapter title="配置监视路径" id="watch-paths">
        <p>
            当您<a href="#enable">启用</a>开发模式时，
            Ktor 会开始监视工作目录中的输出文件。
            例如，对于使用 Gradle 构建的 <Path>ktor-sample</Path> 项目，将监视以下文件夹：
        </p>
        [object Promise]
        <p>
            监视路径允许您缩小监视文件夹的范围。
            为此，您可以指定监视路径的一部分。
            例如，要监视 <Path>ktor-sample/build/classes</Path> 子文件夹中的更改，
            请将 <code>classes</code> 作为监视路径传递。
            根据您运行服务器的方式，您可以通过以下方式指定监视路径：
        </p>
        <list>
            <li>
                <p>
                    在 <Path>application.conf</Path> 或 <Path>application.yaml</Path> 文件中，指定 <code>watch</code> 选项：
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    您还可以指定多个监视路径，例如：
                </p>
                <tabs group="config">
                    <tab title="application.conf" group-key="hocon">
                        [object Promise]
                    </tab>
                    <tab title="application.yaml" group-key="yaml">
                        [object Promise]
                    </tab>
                </tabs>
                <p>
                    您可以在此处找到完整示例：<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-engine-main">autoreload-engine-main</a>。
                </p>
            </li>
            <li>
                <p>
                    如果您使用 <code>embeddedServer</code>，请将监视路径作为 <code>watchPaths</code>
                    形参传递：
                </p>
                [object Promise]
                <p>
                    有关完整示例，请参见
                    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/autoreload-embedded-server">
                        autoreload-embedded-server
                    </a>
                    。
                </p>
            </li>
        </list>
</chapter>
<chapter title="更改时重新编译" id="recompile">
        <p>
            由于自动重载会检测输出文件中的更改，
            因此您需要重新构建项目。
            您可以在 IntelliJ IDEA 中手动执行此操作，或者使用 Gradle 的 <code>-t</code> 命令行选项启用持续构建执行。
        </p>
        <list>
            <li>
                <p>
                    要在 IntelliJ IDEA 中手动重新构建项目，请从主菜单中选择
                    <ui-path>Build | Rebuild Project</ui-path>。
                </p>
            </li>
            <li>
                <p>
                    要使用 Gradle 自动重新构建项目，
                    您可以在终端中运行带有 <code>-t</code> 选项的 <code>build</code> 任务：
                </p>
                [object Promise]
                <tip>
                    <p>
                        要在重新加载项目时跳过运行测试，您可以将 <code>-x</code> 选项传递给 <code>build</code> 任务：
                    </p>
                    [object Promise]
                </tip>
            </li>
        </list>
</chapter>