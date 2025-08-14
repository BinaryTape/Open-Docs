[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外的运行时或虚拟机即可运行服务器。">Native server</Links> 支持</b>: ✖️
    </p>
    
</tldr>

Ktor 允许您通过安装 Thymeleaf 插件，在应用程序中使用 [Thymeleaf 模板](https://www.thymeleaf.org/) 作为视图。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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
    

## 安装 Thymeleaf {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，
        请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来组织您的应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 配置 Thymeleaf {id="configure"}
### 配置模板加载 {id="template_loading"}
在 `install` 代码块内部，您可以配置 `ClassLoaderTemplateResolver`。例如，下面的代码片段使 Ktor 能够在当前类路径中查找 `templates` 包内的 `*.html` 模板：
[object Promise]

### 在响应中发送模板 {id="use_template"}
假设您在 `resources/templates` 中有一个 `index.html` 模板：
[object Promise]

用户的数据模型如下所示：
[object Promise]

要将模板用于指定的 [路由](server-routing.md)，请按以下方式将 [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) 传递给 `call.respond` 方法：
[object Promise]

## 示例：自动重新加载 Thymeleaf 模板 {id="auto-reload"}

下面的示例展示了在使用 [开发模式](server-development-mode.topic) 时如何自动重新加载 Thymeleaf 模板。

[object Promise]

您可以在此处找到完整示例：[thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。