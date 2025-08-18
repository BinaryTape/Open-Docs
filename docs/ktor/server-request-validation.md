[//]: # (title: 请求验证)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name% 提供了验证传入请求体的功能。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 插件提供了验证传入请求体的功能。如果安装了带有[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，你可以验证原始请求体或指定的请求对象属性。如果请求体验证失败，该插件会抛出 `RequestValidationException` 异常，可以使用 [StatusPages](server-status-pages.md) 插件来处理。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要在构建脚本中引入 <code>%artifact_name%</code> artifact：
</p>
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

## 安装 %plugin_name% {id="install_plugin"}

<p>
    要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
    请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许你通过对路由进行分组来组织你的应用程序。">模块</Links>中的 <code>install</code> 函数。
    下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函数调用内部。
    </li>
    <li>
        ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的扩展函数。
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
<p>
    <code>%plugin_name%</code> 插件也可以<a href="#install-route">安装到特定的路由</a>。
    如果你需要针对不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能会很有用。
</p>

## 配置 %plugin_name% {id="configure"}

配置 `%plugin_name%` 涉及三个主要步骤：

1. [接收请求体内容](#receive-body)。
2. [配置验证函数](#validation-function)。
3. [处理验证异常](#validation-exception)。

### 1. 接收请求体 {id="receive-body"}

%plugin_name%` 插件会在你使用类型参数调用 **[receive](server-requests.md#body_contents)** 函数时验证请求体。例如，下面的代码片段展示了如何以 `String` 值接收请求体：`

```kotlin
routing {
    post("/text") {
        val body = call.receive<String>()
        call.respond(body)
    }
}
```

### 2. 配置验证函数 {id="validation-function"}

要验证请求体，请使用 `validate` 函数。
此函数返回一个 `ValidationResult` 对象，表示成功或不成功的验证结果。
对于不成功的结果，会抛出 **[RequestValidationException](#validation-exception)** 异常。

<code>validate</code> 函数有两个重载，允许你通过两种方式验证请求体：

- 第一个 <code>validate</code> 重载允许你将请求体作为指定类型的对象进行访问。
   下面的示例展示了如何验证表示 `String` 值的请求体：
   ```kotlin
   install(RequestValidation) {
       validate<String> { bodyText ->
           if (!bodyText.startsWith("Hello"))
               ValidationResult.Invalid("Body text should start with 'Hello'")
           else ValidationResult.Valid
       }
   }
   ```

   如果你安装了配置了特定[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，你可以验证对象属性。从[示例：验证对象属性](#example-object)了解更多。

- 第二个 <code>validate</code> 重载接受 `ValidatorBuilder`，并允许你提供自定义的验证规则。
   你可以从[示例：验证字节数组](#example-byte-array)了解更多。

### 3. 处理验证异常 {id="validation-exception"}

如果请求验证失败，`%plugin_name%` 会抛出 `RequestValidationException` 异常。
此异常允许你访问请求体，并获取此请求的所有验证失败原因。

你可以使用 [StatusPages](server-status-pages.md) 插件来处理 `RequestValidationException` 异常，如下所示：

```kotlin
install(StatusPages) {
    exception<RequestValidationException> { call, cause ->
        call.respond(HttpStatusCode.BadRequest, cause.reasons.joinToString())
    }
}
```

你可以在这里找到完整示例：[request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 示例：验证对象属性 {id="example-object"}

在此示例中，我们将探讨如何使用 `%plugin_name%` 插件验证对象属性。
假设服务器接收到一个带有以下 JSON 数据的 `POST` 请求：

```HTTP
POST http://0.0.0.0:8080/json
Content-Type: application/json

{
  "id": -1,
  "firstName": "Jet",
  "lastName": "Brains"
}
```

要添加 `id` 属性的验证，请按照以下步骤操作：

1. 创建描述上述 JSON 对象的 `Customer` 数据类：
   ```kotlin
   @Serializable
   data class Customer(val id: Int, val firstName: String, val lastName: String)
   ```

2. 安装带有 [JSON 序列化器](server-serialization.md#register_json) 的 `ContentNegotiation` 插件：
   ```kotlin
   install(ContentNegotiation) {
       json()
   }
   ```

3. 在服务器端接收 `Customer` 对象，如下所示：
   ```kotlin
   post("/json") {
       val customer = call.receive<Customer>()
       call.respond(customer)
   }
   ```
4. 在 `%plugin_name%` 插件配置中，添加 `id` 属性的验证，以确保其落在指定区间内：
   ```kotlin
   install(RequestValidation) {
       validate<Customer> { customer ->
           if (customer.id <= 0)
               ValidationResult.Invalid("A customer ID should be greater than 0")
           else ValidationResult.Valid
       }
   }
   ```
   
   在这种情况下，如果 `id` 值小于或等于 `0`，`%plugin_name%` 将会抛出 **[RequestValidationException](#validation-exception)** 异常。

## 示例：验证字节数组 {id="example-byte-array"}

在此示例中，我们将探讨如何验证作为字节数组接收到的请求体。
假设服务器接收到一个带有以下文本数据的 `POST` 请求：

```HTTP
POST http://localhost:8080/array
Content-Type: text/plain

-1
```

要将数据作为字节数组接收并验证它，请执行以下步骤：

1. 在服务器端接收数据，如下所示：
   ```kotlin
   post("/array") {
       val body = call.receive<ByteArray>()
       call.respond(String(body))
   }
   ```
2. 要验证接收到的数据，我们将使用第二个 <code>validate</code> [函数重载](#validation-function)，它接受 `ValidatorBuilder` 并允许你提供自定义的验证规则：
   ```kotlin
   install(RequestValidation) {
       validate {
           filter { body ->
               body is ByteArray
           }
           validation { body ->
               check(body is ByteArray)
               val intValue = String(body).toInt()
               if (intValue <= 0)
                   ValidationResult.Invalid("A value should be greater than 0")
               else ValidationResult.Valid
           }
       }
   }
   ```