[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>

    <p>
        <b>代码示例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links> 支持</b>: ✖️
    </p>
    
</tldr>

Ktor 允许你通过安装 [FreeMarker](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker) 插件，在你的应用程序中使用 [FreeMarker 模板](https://freemarker.apache.org/) 作为视图。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
    

## 安装 FreeMarker {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许你通过对路由进行分组来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
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
    

在 <code>install</code> 代码块内部，你可以[配置](#configure)所需的 [TemplateLoader][freemarker_template_loading] 以加载 FreeMarker 模板。

## 配置 FreeMarker {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载模板，你需要将所需的 [TemplateLoader][freemarker_template_loading] 类型赋值给 <code>templateLoader</code> 属性。例如，以下代码片段使 Ktor 能够查找相对于当前类路径的 <code>templates</code> 包中的模板：
[object Promise]

### 在响应中发送模板 {id="use_template"}
假设你在 <code>resources/templates</code> 中有一个 <code>index.ftl</code> 模板：
[object Promise]

一个用户的数据模型如下所示：
[object Promise]

要将该模板用于指定的[路由](server-routing.md)，请通过以下方式将 <code>FreeMarkerContent</code> 传递给 <code>call.respond</code> 方法：
[object Promise]