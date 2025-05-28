[//]: # (title: 模块)

<tldr>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模块允许你通过路由分组来组织应用程序。</link-summary>

Ktor 允许你使用模块来[组织](server-application-structure.md)应用程序，通过在一个特定模块内定义一组特定的[路由](server-routing.md)。模块是 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 类的一个 *[扩展函数](https://kotlinlang.org/docs/extensions.html)*。在下面的示例中，`module1` 扩展函数定义了一个模块，该模块接受对 `/module1` URL 路径的 GET 请求。

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt" include-lines="3-6,9-15"}

在应用程序中加载模块取决于[创建服务器](server-create-and-configure.topic)的方式：在代码中使用 `embeddedServer` 函数，或使用 `application.conf` 配置文件。

> 请注意，在指定模块中安装的[插件](server-plugins.md#install)对其他已加载的模块有效。

## embeddedServer {id="embedded-server"}

通常，`embeddedServer` 函数隐式地接受一个模块作为 lambda 参数。你可以在 [](server-create-and-configure.topic#embedded-server) 部分中看到示例。你也可以将应用程序逻辑提取到一个单独的模块中，并将其引用作为 `module` 参数传递：

```kotlin
```
{src="snippets/embedded-server-modules/src/main/kotlin/com/example/Application.kt"}

你可以在这里找到完整示例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 配置文件 {id="hocon"}

如果你使用 `application.conf` 或 `application.yaml` 文件来配置服务器，则需要使用 `ktor.application.modules` 属性来指定要加载的模块。

假设你在两个包中定义了三个模块：`com.example` 包中有两个模块，`org.sample` 包中有一个模块。

<tabs>
<tab title="Application.kt">

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/com/example/Application.kt"}

</tab>
<tab title="Sample.kt">

```kotlin
```
{src="snippets/engine-main-modules/src/main/kotlin/org/sample/Sample.kt"}

</tab>
</tabs>

要在配置文件中引用这些模块，你需要提供它们的完全限定名。模块的完全限定名包括类的完全限定名和扩展函数名。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

```shell
```
{src="snippets/engine-main-modules/src/main/resources/application.conf" include-lines="1,5-10"}

</tab>
<tab title="application.yaml" group-key="yaml">

```yaml
```
{src="snippets/engine-main-modules/src/main/resources/_application.yaml" include-lines="1,4-8"}

</tab>
</tabs>

你可以在这里找到完整示例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。