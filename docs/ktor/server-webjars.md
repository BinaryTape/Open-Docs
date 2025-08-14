[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="模块允许您通过分组路由来组织应用程序。">原生服务器</Links> 支持</b>: ✖️
    </p>
    
</tldr>

<link-summary>
%plugin_name% 插件支持提供由 WebJars 提供的客户端库。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 插件支持提供由 [WebJars](https://www.webjars.org/) 提供的客户端库。它允许您将 JavaScript 和 CSS 库等资产打包为 [fat JAR](server-fatjar.md) 的一部分。

## 添加依赖项 {id="add_dependencies"}
要启用 %plugin_name%，您需要在构建脚本中包含以下构件：
* 添加 %artifact_name% 依赖项：

  
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
    

* 添加一个所需客户端库的依赖项。以下示例展示了如何添加 Bootstrap 构件：

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  
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
    
  
  您可以将 `$bootstrap_version` 替换为 `bootstrap` 构件的所需版本，例如 `%bootstrap_version%`。

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
        将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用中。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 中，这是一个 <code>Application</code> 类的扩展函数。
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
    

## 配置 %plugin_name% {id="configure"}

默认情况下，%plugin_name% 在 `/webjars` 路径下提供 WebJars 资产。以下示例展示了如何更改此设置并在 `/assets` 路径下提供任何 WebJars 资产：

[object Promise]

例如，如果您已安装 `org.webjars:bootstrap` 依赖项，您可以添加 `bootstrap.css` 如下所示：

[object Promise]

请注意，%plugin_name% 允许您更改依赖项的版本，而无需更改用于加载它们的路径。

> 您可以在此处找到完整示例：[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。