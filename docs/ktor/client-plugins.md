[//]: # (title: 客户端插件)

<link-summary>了解提供常见功能（例如日志、序列化、授权等）的插件。</link-summary>

许多**应用程序**需要超出**应用程序**逻辑范围的常见**功能**。这可能包括像[日志](client-logging.md)、[序列化](client-serialization.md)或[授权](client-auth.md)等。所有这些都在 Ktor 中通过我们称之为“**插件**”的方式提供。

## 添加插件**依赖项** {id="plugin-dependency"}
插件可能需要单独的[**依赖项**](client-dependencies.md)。**例如**，[Logging](client-logging.md) 插件要求在**构建**脚本中添加 `ktor-client-logging` **artifact**：

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

你可以从所需插件的相关主题中了解所需的**依赖项**。

## 安装插件 {id="install"}
要安装插件，你需要将其传递给 [**客户端**配置**代码块**](client-create-and-configure.md#configure-client)内的 `install` **函数**。**例如**，安装 `Logging` 插件如下所示：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

## 配置插件 {id="configure_plugin"}
你可以在 `install` **代码块**内配置插件。**例如**，对于 [Logging](client-logging.md) 插件，你可以指定日志记录器、日志级别以及过滤日志消息的条件：
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

## 创建自定义插件 {id="custom"}
要了解如何创建自定义插件，请参考 [Custom client plugins](client-custom-plugins.md)。