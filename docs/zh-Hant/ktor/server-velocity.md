[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

Ktor 允許您透過安裝 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 外掛程式，在應用程式中將 [Velocity 模板](https://velocity.apache.org/engine/) 作為視圖使用。

## 添加依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建構腳本中包含 <code>%artifact_name%</code> 構件：
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
    

## 安裝 Velocity {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函數。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴充函數。
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
    

您可以選擇安裝 <code>VelocityTools</code> 外掛程式，以具備添加標準和自訂 [Velocity 工具](#velocity_tools) 的能力。

## 配置 Velocity {id="configure"}
### 配置模板載入 {id="template_loading"}
在 <code>install</code> 區塊內部，您可以配置 [VelocityEngine][velocity_engine]。例如，如果您想從類別路徑中使用模板，請為 <code>classpath</code> 使用資源載入器：
[object Promise]

### 在回應中傳送模板 {id="use_template"}
想像您在 <code>resources/templates</code> 中有一個 <code>index.vl</code> 模板：
[object Promise]

一個使用者資料模型如下所示：
[object Promise]

若要將模板用於指定的 [路由](server-routing.md)，請以下列方式將 <code>VelocityContent</code> 傳遞給 <code>call.respond</code> 方法：
[object Promise]

### 添加 Velocity 工具 {id="velocity_tools"}

如果您已[安裝](#install_plugin) <code>VelocityTools</code> 外掛程式，您可以在 <code>install</code> 區塊內部存取 <code>EasyFactoryConfiguration</code> 實例，以添加標準和自訂 Velocity 工具，例如：

```kotlin
install(VelocityTools) {
    engine {
        // 引擎配置
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // 添加預設工具
    tool("foo", MyCustomTool::class.java) // 添加自訂工具
}
```