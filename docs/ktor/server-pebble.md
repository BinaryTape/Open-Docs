[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许您在无需额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

Ktor 允许您通过安装 [Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble) 插件，在您的应用程序中使用 [Pebble 模板](https://pebbletemplates.io/) 作为视图。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
    

## 安装 Pebble {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序中，
        将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
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
    

在 <code>install</code> 代码块内部，您可以[配置](#configure) [PebbleEngine.Builder][pebble_engine_builder] 以加载 Pebble 模板。

## 配置 Pebble {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载模板，您需要使用 [PebbleEngine.Builder][pebble_engine_builder] 配置如何加载模板。例如，以下代码片段使 Ktor 能够在相对于当前类路径的 `templates` 包中查找模板：

[object Promise]

### 在响应中发送模板 {id="use_template"}
假设您在 `resources/templates` 中有 `index.html` 模板：

[object Promise]

用户的数据模型如下所示：

[object Promise]

要将模板用于指定的[路由](server-routing.md)，请按以下方式将 `PebbleContent` 传递给 `call.respond` 方法：

[object Promise]