[//]: # (title: 客戶端插件)

<link-summary>
熟悉提供常見功能的插件，例如日誌記錄、序列化、授權等。
</link-summary>

許多應用程式需要超出其應用邏輯範圍的共同功能。這可能是像[日誌記錄](client-logging.md)、[序列化](client-serialization.md)或[授權](client-auth.md)等。所有這些都在 Ktor 中透過我們稱之為 **Plugins** 的方式提供。

## 添加插件依賴 {id="plugin-dependency"}
一個插件可能需要單獨的[依賴](client-dependencies.md)。例如，[Logging](client-logging.md) 插件要求在構建腳本中添加 `ktor-client-logging` artifact：

<var name="artifact_name" value="ktor-client-logging"/>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

您可以從所需插件的主題中了解您需要的依賴。

## 安裝插件 {id="install"}
要安裝插件，您需要將其傳遞給[客戶端配置塊](client-create-and-configure.md#configure-client)內的 `install` 函數。例如，安裝 `Logging` 插件如下所示：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

## 配置插件 {id="configure_plugin"}
您可以在 `install` 塊內配置插件。例如，對於 [Logging](client-logging.md) 插件，您可以指定日誌記錄器、日誌級別以及過濾日誌消息的條件：
```kotlin
runBlocking {
    val client = HttpClient(CIO) {
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.HEADERS
            filter { request ->
                request.url.host.contains("ktor.io")
            }
            sanitizeHeader { header -> header == HttpHeaders.Authorization }
```

## 創建自定義插件 {id="custom"}
要了解如何創建自定義插件，請參閱[自定義客戶端插件](client-custom-plugins.md)。