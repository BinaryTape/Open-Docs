[//]: # (title: 状态页)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
StatusPages 允许 Ktor 应用程序根据抛出的异常或状态码适当响应任何失败状态。
</link-summary>

StatusPages 插件允许 Ktor 应用程序根据抛出的异常或状态码[响应](server-responses.md)任何失败状态。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>StatusPages</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
    

## 安装 StatusPages {id="install_plugin"}

    <p>
        要将 <code>StatusPages</code> 插件<a href="#install">安装</a>到应用程序，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来构建应用程序。">模块</Links>中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>StatusPages</code> ...
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
    

## 配置 StatusPages {id="configure"}

StatusPages 插件提供了三个主要的配置选项：

- [异常](#exceptions)：根据映射的异常类配置响应
- [状态](#status)：配置针对状态码值的响应
- [状态文件](#status-file)：配置来自类路径的文件响应

### 异常 {id="exceptions"}

<code>exception</code> 处理程序允许您处理导致 <code>Throwable</code> 异常的调用。在最基本的情况下，可以为任何异常配置 <code>500</code> HTTP 状态码：

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

您还可以检测特定异常并响应所需内容：

[object Promise]

### 状态 {id="status"}

<code>status</code> 处理程序提供了根据状态码响应特定内容的功能。以下示例展示了如何在服务器上资源缺失（<code>404</code> 状态码）时响应请求：

[object Promise]

### 状态文件 {id="status-file"}

<code>statusFile</code> 处理程序允许您根据状态码提供 HTML 页面。假设您的项目在 <code>resources</code> 文件夹中包含 <code>error401.html</code> 和 <code>error402.html</code> HTML 页面。在这种情况下，您可以按如下方式使用 <code>statusFile</code> 处理 <code>401</code> 和 <code>402</code> 状态码：
[object Promise]

<code>statusFile</code> 处理程序会将 <code>#</code> 字符替换为已配置状态列表中对应的状态码值。

> 您可以在此处找到完整示例：[status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)。