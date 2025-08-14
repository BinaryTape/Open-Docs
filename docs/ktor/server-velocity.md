[//]: # (title: Velocity)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[velocity_engine]: https://velocity.apache.org/engine/devel/apidocs/org/apache/velocity/app/VelocityEngine.html

<var name="plugin_name" value="Velocity"/>
<var name="package_name" value="io.ktor.server.velocity"/>
<var name="artifact_name" value="ktor-server-velocity"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="velocity"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许你无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

Ktor 允许你通过安装 [Velocity](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-velocity/io.ktor.server.velocity/-velocity) 插件，将 [Velocity 模板](https://velocity.apache.org/engine/)作为应用中的视图使用。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要将 <code>%artifact_name%</code> 构件包含到构建脚本中：
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
    

## 安装 Velocity {id="install_plugin"}

    <p>
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
        将其传递给指定<Links href="/ktor/server-modules" summary="模块允许你通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ……
    </p>
    <list>
        <li>
            ……在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ……在显式定义的 <code>module</code> 中，这是一个 <code>Application</code> 类的扩展函数。
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
    

可选地，你可以安装 `VelocityTools` 插件，以获得添加标准和自定义 [Velocity 工具](#velocity_tools)的能力。

## 配置 Velocity {id="configure"}
### 配置模板加载 {id="template_loading"}
在 `install` 代码块内部，你可以配置 [VelocityEngine][velocity_engine]。例如，如果你想从 classpath 使用模板，请为 `classpath` 使用一个资源加载器：
[object Promise]

### 在响应中发送模板 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.vl` 模板：
[object Promise]

一个用户的数据模型如下所示：
[object Promise]

要将模板用于指定的 [路由](server-routing.md)，请以如下方式将 `VelocityContent` 传递给 `call.respond` 方法：
[object Promise]

### 添加 Velocity 工具 {id="velocity_tools"}

如果你已经[安装](#install_plugin)了 `VelocityTools` 插件，你可以在 `install` 代码块内部访问 `EasyFactoryConfiguration` 实例，来添加标准和自定义 Velocity 工具，例如：

```kotlin
install(VelocityTools) {
    engine {
        // 引擎配置
        setProperty("resource.loader", "string")
        addProperty("resource.loader.string.name", "myRepo")
        addProperty("resource.loader.string.class", StringResourceLoader::class.java.name)
        addProperty("resource.loader.string.repository.name", "myRepo")
    }
    addDefaultTools() // 添加一个默认工具
    tool("foo", MyCustomTool::class.java) // 添加一个自定义工具
}
```