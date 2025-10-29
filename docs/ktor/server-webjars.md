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
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links> 支持</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name% 插件支持提供由 WebJars 提供的客户端库。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 插件支持提供由 [WebJars](https://www.webjars.org/) 提供的客户端库。它允许您将 JavaScript 和 CSS 库等资源作为 [fat JAR](server-fatjar.md) 的一部分进行打包。

## 添加依赖项 {id="add_dependencies"}
要启用 `%plugin_name%`，您需要在构建脚本中包含以下构件：
* 添加 `%artifact_name%` 依赖项：

  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 添加所需客户端库的依赖项。下面的示例展示了如何添加一个 Bootstrap 构件：

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>
  
  您可以将 `$bootstrap_version` 替换为 `bootstrap` 构件的所需版本，例如 `%bootstrap_version%`。

## 安装 %plugin_name% {id="install_plugin"}

<p>
    要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
    请将其传递给指定 <Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links> 中的 <code>install</code> 函数。
    下面的代码片段展示了如何安装 <code>%plugin_name%</code> ……
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 中，它是 <code>Application</code> 类的扩展函数。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 配置 %plugin_name% {id="configure"}

默认情况下，`%plugin_name%` 在 `/webjars` 路径上提供 WebJars 资源。下面的示例展示了如何更改此设置并在 `/assets` 路径上提供任何 WebJars 资源：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.webjars.*

fun Application.module() {
    install(Webjars) {
        path = "assets"
    }
}
```

例如，如果您安装了 `org.webjars:bootstrap` 依赖项，您可以如下添加 `bootstrap.css`：

```html
<head>
    <link rel="stylesheet" href="/assets/bootstrap/bootstrap.css">
</head>
```

请注意，`%plugin_name%` 允许您更改依赖项的版本，而无需更改用于加载它们的路径。

> 您可以在这里找到完整的示例：[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。