[//]: # (title: JTE)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Jte"/>
<var name="package_name" value="io.ktor.server.jte"/>
<var name="artifact_name" value="ktor-server-jte"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-jte</code>
</p>
<var name="example_name" value="jte"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/jte">
            jte
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外运行时或虚拟机即可运行服务器。">原生服务器</Links> 支持</b>: ✖️
    </p>
    
</tldr>

Ktor 允许您通过安装 Jte [插件](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-jte/io.ktor.server.jte/-jte.html)，在您的应用程序中使用 [JTE 模板](https://github.com/casid/jte) 作为视图。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>Jte</code>，您需要在构建脚本中包含 <code>ktor-server-jte</code> 构件：
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
    

> 要处理 `.kte` 文件，您需要将 `gg.jte:jte-kotlin` 构件添加到您的项目中。

## 安装 Jte {id="install_plugin"}

    <p>
        要将 <code>Jte</code> 插件<a href="#install">安装</a>到应用程序，请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织您的应用程序。">模块</Links>中的 <code>install</code> 函数。以下代码片段展示了如何安装 <code>Jte</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是一个 <code>Application</code> 类的扩展函数。
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
    

在 `install` 代码块内部，您可以[配置](#configure)如何加载 JTE 模板。

## 配置 Jte {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载 JTE 模板，您需要：
1. 创建一个 `CodeResolver`，用于解析模板代码。例如，您可以配置 `DirectoryCodeResolver` 从给定目录加载模板，或者配置 `ResourceCodeResolver` 从应用程序资源加载模板。
2. 使用 `templateEngine` 属性指定模板引擎，该引擎使用创建的 `CodeResolver` 将模板转换为原生 Java/Kotlin 代码。

例如，下面的代码片段使 Ktor 能够在 `templates` 目录中查找 JTE 模板：

[object Promise]

### 在响应中发送模板 {id="use_template"}
假设您在 `templates` 目录中有一个 `index.kte` 模板：
[object Promise]

要将模板用于指定的[路由](server-routing.md)，请以如下方式将 `JteContent` 传递给 `call.respond` 方法：
[object Promise]