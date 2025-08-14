[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许你无需额外运行时或虚拟机即可运行服务器。">原生服务器</Links> 支持</b>: ✖️
    </p>
    
</tldr>

Ktor 允许你通过安装 [Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) 插件，在你的应用程序中使用 [Mustache 模板](https://github.com/spullara/mustache.java) 作为视图。

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
    

## 安装 Mustache {id="install_plugin"}

    <p>
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许你通过分组路由来组织你的应用程序。">模块</Links>中的 <code>install</code> 函数。
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
    

在 `install` 代码块内部，你可以[配置](#template_loading) [MustacheFactory][mustache_factory] 以加载 Mustache 模板。

## 配置 Mustache {id="configure"}
### 配置模板加载 {id="template_loading"}
要加载模板，你需要将 [MustacheFactory][mustache_factory] 赋值给 `mustacheFactory` 属性。例如，下面的代码片段使 Ktor 能够相对于当前类路径在 `templates` 包中查找模板：
[object Promise]

### 在响应中发送模板 {id="use_template"}
假设你在 `resources/templates` 中有一个 `index.hbs` 模板：
[object Promise]

用户的模型数据如下所示：
[object Promise]

要将模板用于指定 [route](server-routing.md)，请按以下方式将 `MustacheContent` 传递给 `call.respond` 方法：
[object Promise]