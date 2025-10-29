[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，可讓您在無需額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

<link-summary>
%plugin_name% 插件可啟用提供由 WebJars 提供的用戶端函式庫。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html) 插件可啟用提供由 [WebJars](https://www.webjars.org/) 提供的用戶端函式庫。它允許您將 JavaScript 和 CSS 函式庫等資產打包為您的 [獨立 JAR 檔](server-fatjar.md) 的一部分。

## 新增依賴 {id="add_dependencies"}
若要啟用 %plugin_name%，您需要將以下構件包含在建置腳本中：
* 新增 <code>%artifact_name%</code> 依賴：

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

* 新增所需用戶端函式庫的依賴。下方範例展示如何新增 Bootstrap 構件 (artifact)：

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
  
  您可以將 <code>$bootstrap_version</code> 替換為 <code>bootstrap</code> 構件 (artifact) 的所需版本，例如 <code>%bootstrap_version%</code>。

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函式。
    下方程式碼片段展示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函式呼叫內。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內，這是 <code>Application</code> 類別的擴充函式。
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

預設情況下，%plugin_name% 在 <code>/webjars</code> 路徑上提供 WebJars 資產。下方範例展示如何更改此設定並在 <code>/assets</code> 路徑上提供任何 WebJars 資產：

```kotlin
import io.ktor.server.application.*
import io.ktor.server.webjars.*

fun Application.module() {
    install(Webjars) {
        path = "assets"
    }
}
```

例如，如果您已經安裝了 <code>org.webjars:bootstrap</code> 依賴，您可以按如下方式新增 <code>bootstrap.css</code>：

```html
<head>
    <link rel="stylesheet" href="/assets/bootstrap/bootstrap.css">
</head>
```

請注意，%plugin_name% 允許您更改依賴的版本，而無需更改用於載入它們的路徑。

> 您可以在此處找到完整範例：[webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。