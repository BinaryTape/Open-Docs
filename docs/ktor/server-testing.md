[//]: # (title: 在 Ktor 服务器中进行测试)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
学习如何使用专门的测试引擎测试你的服务器应用程序。
</link-summary>

Ktor 提供了一个特殊的测试引擎，它不创建 Web 服务器，不绑定到套接字，也不发出任何真实的 HTTP 请求。相反，它直接 Hook 内部机制并直接处理应用程序调用。与运行一个完整的 Web 服务器进行测试相比，这会带来更快的测试执行速度。

## 添加依赖项 {id="add-dependencies"}
要测试 Ktor 服务器应用程序，你需要在构建脚本中包含以下工件：
*   添加 `ktor-server-test-host` 依赖项：

   <var name="artifact_name" value="ktor-server-test-host"/>
   <include from="lib.topic" element-id="add_ktor_artifact_testing"/>

*   添加 `kotlin-test` 依赖项，它提供了一组用于在测试中执行断言的实用函数：

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  <include from="lib.topic" element-id="add_artifact_testing"/>

> 要测试 [Native 服务器](server-native.md#add-dependencies)，请将测试工件添加到 `nativeTest` 源集。

## 测试概述 {id="overview"}

要使用测试引擎，请遵循以下步骤：
1.  创建一个 JUnit 测试类和一个测试函数。
2.  使用 [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 函数设置一个在本地运行的已配置测试应用程序实例。
3.  在测试应用程序内部使用 [Ktor HTTP 客户端](client-create-and-configure.md) 实例向你的服务器发出请求，接收响应，并进行断言。

下面的代码演示了如何测试一个最简单的 Ktor 应用程序，该应用程序接受对 `/` 路径的 GET 请求并响应纯文本。

<tabs>
<tab title="测试">

```kotlin
```
{src="snippets/engine-main/src/test/kotlin/EngineMainTest.kt"}

</tab>

<tab title="应用程序">

```kotlin
```
{src="snippets/engine-main/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

可运行的代码示例在此处提供：[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## 测试应用程序 {id="test-app"}

### 步骤 1：配置测试应用程序 {id="configure-test-app"}

测试应用程序的配置可能包括以下步骤：
-   [添加应用程序模块](#add-modules)
-   [(可选) 添加路由](#add-routing)
-   [(可选) 自定义环境](#environment)
-   [(可选) 模拟外部服务](#external-services)

> 默认情况下，已配置的测试应用程序在[首次客户端调用](#make-request)时启动。
> 或者，你可以调用 `startApplication` 函数手动启动应用程序。
> 如果你需要测试应用程序的[生命周期事件](server-events.md#predefined-events)，这可能会很有用。

#### 添加应用程序模块 {id="add-modules"}

要测试应用程序，其[模块](server-modules.md)应加载到 `testApplication` 中。为此，你必须[显式加载模块](#explicit-module-loading)或[配置环境](#configure-env)以从配置文件中加载它们。

##### 显式加载模块 {id="explicit-module-loading"}

要手动将模块添加到测试应用程序，请使用 `application` 函数：

```kotlin
```
{src="snippets/embedded-server-modules/src/test/kotlin/EmbeddedServerTest.kt" include-symbol="testModule1"}

#### 从配置文件加载模块 {id="configure-env"}

如果你想从配置文件加载模块，请使用 `environment` 函数指定测试的配置文件：

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

当需要在测试期间模拟不同的环境或使用自定义配置设置时，此方法很有用。

> 你还可以在 `application` 块中访问 `Application` 实例。

#### 添加路由 {id="add-routing"}

你可以使用 `routing` 函数向测试应用程序添加路由。
这对于以下用例可能很方便：
-   除了向测试应用程序[添加模块](#add-modules)外，你还可以添加应测试的[特定路由](server-routing.md#route_extension_function)。
-   你可以添加仅在测试应用程序中所需的路由。以下示例展示了如何添加用于在测试中初始化用户[会话](server-sessions.md)的 `/login-test` 端点：
   ```kotlin
   ```
   {src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,31-35,51"}

   你可以在此处找到包含测试的完整示例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 自定义环境 {id="environment"}

要为测试应用程序构建自定义环境，请使用 `environment` 函数。
例如，要为测试使用自定义配置，你可以在 `test/resources` 文件夹中创建一个配置文件，并使用 `config` 属性加载它：

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="17-21,51"}

指定配置属性的另一种方法是使用 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)。如果你想在应用程序启动之前访问应用程序配置，这可能会很有用。以下示例展示了如何使用 `config` 属性将 `MapApplicationConfig` 传递给 `testApplication` 函数：

```kotlin
```
{src="snippets/engine-main-custom-environment/src/test/kotlin/ApplicationTest.kt" include-lines="10-14,21"}

#### 模拟外部服务 {id="external-services"}

Ktor 允许你使用 `externalServices` 函数模拟外部服务。
在此函数内部，你需要调用 `hosts` 函数，该函数接受两个参数：
-   `hosts` 参数接受外部服务的 URL。
-   `block` 参数允许你配置充当外部服务模拟的 `Application`。
   你可以为这个 `Application` 配置路由并安装插件。

以下示例展示了如何使用 `externalServices` 模拟 Google API 返回的 JSON 响应：

```kotlin
```
{src="snippets/auth-oauth-google/src/test/kotlin/ApplicationTest.kt" include-lines="18,36-47,51"}

你可以在此处找到包含测试的完整示例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 步骤 2：（可选）配置客户端 {id="configure-client"}

`testApplication` 通过 `client` 属性提供对具有默认配置的 HTTP 客户端的访问。
如果你需要自定义客户端并安装额外的插件，可以使用 `createClient` 函数。例如，要在测试 POST/PUT 请求中[发送 JSON 数据](#json-data)，你可以安装 [ContentNegotiation](client-serialization.md) 插件：
```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-40,48"}

### 步骤 3：发出请求 {id="make-request"}

要测试你的应用程序，请使用[已配置的客户端](#configure-client)来发出[请求](client-requests.md)并接收[响应](client-responses.md)。[以下示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)展示了如何测试处理 `POST` 请求的 `/customer` 端点：

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-44,48"}

### 步骤 4：断言结果 {id="assert"}

接收到[响应](#make-request)后，你可以通过使用 [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) 库提供的断言来验证结果：

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="31-48"}

## 测试 POST/PUT 请求 {id="test-post-put"}

### 发送表单数据 {id="form-data"}

要在测试 POST/PUT 请求中发送表单数据，你需要设置 `Content-Type` 请求头并指定请求体。为此，你可以分别使用 [header](client-requests.md#headers) 和 [setBody](client-requests.md#body) 函数。以下示例展示了如何使用 `x-www-form-urlencoded` 和 `multipart/form-data` 类型发送表单数据。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

以下来自 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 示例的测试展示了如何使用 `x-www-form-urlencoded` 内容类型发送带表单参数的测试请求。请注意，[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 函数用于从键/值对列表中编码表单参数。

<tabs>
<tab title="测试">

```kotlin
```
{src="snippets/post-form-parameters/src/test/kotlin/formparameters/ApplicationTest.kt"}

</tab>

<tab title="应用程序">

```kotlin
```
{src="snippets/post-form-parameters/src/main/kotlin/formparameters/Application.kt" include-lines="3-16,45-46"}

</tab>
</tabs>

#### multipart/form-data {id="multipart-form-data"}

以下代码演示了如何构建 `multipart/form-data` 并测试文件上传。你可以在此处找到完整的示例：[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

<tabs>
<tab title="测试">

```kotlin
```
{src="snippets/upload-file/src/test/kotlin/uploadfile/UploadFileTest.kt"}

</tab>

<tab title="应用程序">

```kotlin
```
{src="snippets/upload-file/src/main/kotlin/uploadfile/UploadFile.kt"}

</tab>
</tabs>

### 发送 JSON 数据 {id="json-data"}

要在测试 POST/PUT 请求中发送 JSON 数据，你需要创建一个新客户端并安装 [ContentNegotiation](client-serialization.md) 插件，该插件允许以特定格式序列化/反序列化内容。在请求内部，你可以使用 `contentType` 函数指定 `Content-Type` 请求头，并使用 [setBody](client-requests.md#body) 指定请求体。以下[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)展示了如何测试处理 `POST` 请求的 `/customer` 端点。

<tabs>
<tab title="测试">

```kotlin
```
{src="snippets/json-kotlinx/src/test/kotlin/jsonkotlinx/ApplicationTest.kt" include-lines="3-11,31-48"}

</tab>

<tab title="应用程序">

```kotlin
```
{src="snippets/json-kotlinx/src/main/kotlin/jsonkotlinx/Application.kt" include-lines="3-16,25-31,38-44"}

</tab>
</tabs>

## 在测试期间保留 Cookie {id="preserving-cookies"}

如果你需要在测试时在请求之间保留 Cookie，你需要创建一个新客户端并安装 [HttpCookies](client-cookies.md) 插件。在以下来自 [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 示例的测试中，由于 Cookie 被保留，每次请求后重新加载计数都会增加。

<tabs>
<tab title="测试">

```kotlin
```
{src="snippets/session-cookie-client/src/test/kotlin/cookieclient/ApplicationTest.kt"}

</tab>

<tab title="应用程序">

```kotlin
```
{src="snippets/session-cookie-client/src/main/kotlin/cookieclient/Application.kt" include-lines="3-38"}

</tab>
</tabs>

## 测试 HTTPS {id="https"}

如果你需要测试 [HTTPS 端点](server-ssl.md)，请使用 [URLBuilder.protocol](client-requests.md#url) 属性更改用于发出请求的协议：

```kotlin
```
{src="snippets/ssl-engine-main/src/test/kotlin/ApplicationTest.kt" include-lines="3-22"}

你可以在此处找到完整的示例：[ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## 测试 WebSocket {id="testing-ws"}

你可以通过使用客户端提供的 [WebSockets](client-websockets.topic) 插件来测试 [WebSocket 会话](server-websockets.md)：

```kotlin
```
{src="snippets/server-websockets/src/test/kotlin/com/example/ModuleTest.kt"}

## 使用 HttpClient 进行端到端测试 {id="end-to-end"}
除了测试引擎，你还可以使用 [Ktor HTTP 客户端](client-create-and-configure.md) 对你的服务器应用程序进行端到端测试。
在以下示例中，HTTP 客户端向 `TestServer` 发出测试请求：

```kotlin
```
{src="snippets/embedded-server/src/test/kotlin/EmbeddedServerTest.kt"}

有关完整示例，请参阅以下示例：
-   [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)：一个要测试的示例服务器。
-   [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e)：包含用于设置测试服务器的辅助类和函数。