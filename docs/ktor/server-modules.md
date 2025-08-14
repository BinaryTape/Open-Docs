[//]: # (title: 模块)

<tldr>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模块允许您通过对路由进行分组来组织您的应用程序。</link-summary>

Ktor 允许您通过在特定模块内定义一组特定的[路由](server-routing.md)来使用模块[组织](server-application-structure.md)应用程序。模块是 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 类的 _[扩展函数](https://kotlinlang.org/docs/extensions.html)_。在下面的示例中，`module1` 扩展函数定义了一个模块，该模块接受对 `/module1` URL 路径发出的 GET 请求。

[object Promise]

在应用程序中加载模块取决于[创建服务器](server-create-and-configure.topic)的方式：是在代码中使用 `embeddedServer` 函数，还是使用 `application.conf` 配置文件。

> 请注意，安装在指定模块中的[插件](server-plugins.md#install)对其他已加载的模块也有效。

## embeddedServer {id="embedded-server"}

通常，`embeddedServer` 函数会隐式地将模块作为 lambda 实参接受。您可以在 [](server-create-and-configure.topic#embedded-server) 部分查看示例。您也可以将应用程序逻辑提取到单独的模块中，并将该模块的引用作为 `module` 形参传递：

[object Promise]

您可以在此处找到完整示例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 配置文件 {id="hocon"}

如果您使用 `application.conf` 或 `application.yaml` 文件来配置服务器，则需要使用 `ktor.application.modules` 属性来指定要加载的模块。

假设您在两个包中定义了三个模块：`com.example` 包中有两个模块，`org.sample` 包中有一个模块。

<tabs>
<tab title="Application.kt">

[object Promise]

</tab>
<tab title="Sample.kt">

[object Promise]

</tab>
</tabs>

要在配置文件中引用这些模块，您需要提供它们的完全限定名。完全限定模块名包括类的完全限定名和扩展函数名。

<tabs group="config">
<tab title="application.conf" group-key="hocon">

[object Promise]

</tab>
<tab title="application.yaml" group-key="yaml">

[object Promise]

</tab>
</tabs>

您可以在此处找到完整示例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 并发模块加载

创建应用程序模块时，您可以使用可挂起函数。它们允许事件在应用程序启动时异步运行。为此，请添加 `suspend` 关键字：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

您还可以独立启动所有应用程序模块，这样当一个模块挂起时，其他模块不会被阻塞。这允许依赖注入的非顺序加载，在某些情况下，还可以加快加载速度。

### 配置选项

以下 Gradle 配置属性可用：

| 属性                                | 类型                        | 描述                                           | 默认值      |
|-------------------------------------|-----------------------------|------------------------------------------------|-------------|
| `ktor.application.startup`          | `sequential` / `concurrent` | 定义应用程序模块的加载方式                     | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 应用程序模块加载的超时时间（以毫秒为单位） | `100000`    |

### 启用并发模块加载

要选择启用并发模块加载，请将以下属性添加到您的 `gradle.properties` 文件中：

```none
ktor.application.startup = concurrent
```

对于依赖注入，您可以按出现顺序加载以下模块而不会出现问题：

```kotlin
suspend fun Application.installEvents() {
    // 挂起直到提供
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 并发模块加载是一个单线程进程。它有助于避免由于应用程序内部共享状态中的不安全集合而导致的线程问题。
>
{style="note"}