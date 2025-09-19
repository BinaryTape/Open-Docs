[//]: # (title: 深度链接)

深度链接是一种导航机制，它允许操作系统通过将用户带到对应应用程序中的特定目的地来处理自定义链接。

深度链接是应用链接（Android 上的称谓）或通用链接（iOS 术语）的更通用情况：它们是应用程序与特定网址的经过验证的连接。关于它们的具体信息，请参阅 [Android 应用链接](https://developer.android.com/training/app-links)和 [iOS 通用链接](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content/)的文档。

深度链接对于将外部输入引入应用程序也很有用，例如，在 OAuth 授权的情况下：你可以解析深度链接并获取 OAuth 令牌，而无需强制用户进行视觉导航。

> 由于外部输入可能是恶意的，请务必遵循[安全指南](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)以妥善缓解与处理原始深度链接 URI 相关的风险。
>
{style="warning"}

要在 Compose Multiplatform 中实现深度链接：

1.  [在应用程序配置中注册深度链接方案](#register-deep-links-schemas-in-the-operating-system)
2.  [将特定深度链接分配给导航图中的目的地](#assign-deep-links-to-destinations)
3.  [处理应用程序接收到的深度链接](#handle-received-deep-links)

## 设置

要在 Compose Multiplatform 中使用深度链接，请按如下方式设置依赖项。

在 Gradle 目录中列出以下版本、库和插件：

```ini
[versions]
compose-multiplatform = "%org.jetbrains.compose%"
agp = "8.9.0"

# 支持深度链接的多平台 Navigation 库版本
androidx-navigation = "%org.jetbrains.androidx.navigation%"

# 与 Compose Multiplatform 1.8.0 兼容的最低 Kotlin 版本
kotlin = "2.1.0"

# 实现类型安全路由所需的序列化库
kotlinx-serialization = "1.7.3"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "androidx-navigation" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinx-serialization" }

[plugins]
multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
compose = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
kotlinx-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
android-application = { id = "com.android.application", version.ref = "agp" }
```

向共享模块的 `build.gradle.kts` 添加额外的依赖项：

```kotlin
plugins {
    // ...
    alias(libs.plugins.kotlinx.serialization)
}

// ...

kotlin {
    // ...
    sourceSets {
        commonMain.dependencies {
            // ...
            implementation(libs.androidx.navigation.compose)
            implementation(libs.kotlinx.serialization.json)
        }
    }
}
```

## 在操作系统中注册深度链接方案

每个操作系统都有其处理深度链接的方式。查阅特定目标平台的文档会更可靠：

*   对于 Android 应用程序，深度链接方案在 `AndroidManifest.xml` 文件中声明为 intent filter。关于如何正确设置 intent filter，请参见 [Android 文档](https://developer.android.com/training/app-links/deep-linking?hl=en#adding-filters)。
*   对于 iOS 和 macOS 应用程序，深度链接方案在 `Info.plist` 文件中，于 [CFBundleURLTypes](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes) 键中声明。

    > Compose Multiplatform [提供一个 Gradle DSL](compose-native-distribution.md#information-property-list-on-macos) 以向 macOS 应用程序的 `Info.plist` 添加值。对于 iOS，你可以在 KMP 项目中直接编辑该文件，或[使用 Xcode GUI 注册方案](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme)。
    >
    {style="note"}
*   对于 Windows 应用程序，深度链接方案可以通过向 [Windows 注册表](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))添加包含必要信息的键（适用于 Windows 8 及更早版本）或在[包清单](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation)中指定扩展（适用于 Windows 10 和 11）来声明。这可以通过安装脚本或第三方分发包生成器（例如 [Hydraulic Conveyor](https://conveyor.hydraulic.dev/)）完成。Compose Multiplatform 不支持在项目本身内部进行此配置。

    > 确保不要使用 Windows [保留的方案](https://learn.microsoft.com/en-us/windows/apps/develop/launch/reserved-uri-scheme-names#reserved-uri-scheme-names)之一。
    >
    {style="tip"}
*   对于 Linux，深度链接方案可以在分发包中包含的 `.desktop` 文件中注册。

## 将深度链接分配给目的地

声明为导航图一部分的目的地有一个可选的 `deepLinks` 形参，它可以存放对应的 `NavDeepLink` 对象 list。每个 `NavDeepLink` 描述一个应匹配目的地的 URI 模式——你可以定义多个 URI 模式，它们都应导向同一个屏幕。

您可以为路由定义的深度链接数量没有限制。

### 深度链接的通用 URI 模式

通用 URI 模式应匹配整个 URI。你可以使用形参的占位符，从目的地内接收到的 URI 中提取它们。

通用 URI 模式的规则：

*   没有方案的 URI 假定以 `http://` 或 `https://` 开头。因此 `uriPattern = "example.com"` 匹配 `http://example.com` 和 `https://example.com`。
*   `{placeholder}` 匹配一个或多个字符（`example.com/name={name}` 匹配 `https://example.com/name=Bob`）。要匹配零个或多个字符，请使用 `.*` 通配符（`example.com/name={.*}` 匹配 `https://example.com/name=` 以及 `name` 的任何值）。
*   路径占位符的形参是必需的，而匹配查询占位符是可选的。例如，模式 `example.com/users/{id}?arg1={arg1}&arg2={arg2}`：
    *   不匹配 `http://www.example.com/users?arg1=one&arg2=two`，因为路径中必需的部分（`id`）缺失。
    *   匹配 `http://www.example.com/users/4?arg2=two` 和 `http://www.example.com/users/4?arg1=one`。
    *   也匹配 `http://www.example.com/users/4?other=random`，因为冗余的查询形参不影响匹配。
*   如果多个可组合项的 `navDeepLink` 匹配接收到的 URI，则行为是不确定的。请确保你的深度链接模式不相交。如果你需要多个可组合项处理相同的深度链接模式，请考虑添加路径或查询形参，或使用中间目的地来可预测地路由用户。

### 路由类型的生成 URI 模式

你可以避免完全写出 URI 模式：Navigation 库可以根据路由的形参自动生成 URI 模式。

要使用此方法，请这样定义深度链接：

```kotlin
composable<PlantDetail>(
    deepLinks = listOf(
        navDeepLink<PlantDetail>(basePath = "demo://example.com/plant")
    )
) { ... }
```

这里 `PlantDetail` 是你用于目的地的路由类型，而 `basePath` 中的 "plant" 是 `PlantDetail` 数据类的序列化名称。

URI 模式的其余部分将按如下方式生成：

*   必需的形参作为路径形参附加（例如：`/{id}`）
*   具有默认值（可选形参）的形参作为查询形参附加（例如：`?name={name}`）
*   集合作为查询形参附加（例如：`?items={value1}&items={value2}`)
*   形参顺序与路由定义中字段的顺序匹配。

因此，例如，此路由类型：

```kotlin
@Serializable data class PlantDetail(
  val id: String,
  val name: String,
  val colors: List<String>,
  val latinName: String? = null,
)
```

由库生成以下 URI 模式：

```none
<basePath>/{id}/{name}/?colors={color1}&colors={color2}&latinName={latinName}
```

### 向目的地添加深度链接的示例

在此示例中，我们向目的地分配了多个深度链接，然后从接收到的 URI 中提取形参值：

```kotlin
@Serializable @SerialName("dlscreen") data class DeepLinkScreen(val name: String)

// ...

val firstBasePath = "demo://example1.org"

NavHost(
    navController = navController,
    startDestination = FirstScreen
) {
    // ...

    composable<DeepLinkScreen>(
        deepLinks = listOf(
            // 这个可组合项应同时处理 demo://example1.org 和 demo://example2.org 的链接
            navDeepLink { uriPattern = "$firstBasePath?name={name}" },
            navDeepLink { uriPattern = "demo://example2.org/name={name}" },
            // 生成的模式只处理形参，
            // 所以我们为路由类型添加了序列化名称
            navDeepLink<DeepLinkScreen>(basePath = "$firstBasePath/dlscreen"),
        )
    ) {
        // 如果应用程序接收到 URI `demo://example1.org/dlscreen/Jane/`，
        // 它会匹配生成的 URI 模式（name 是必需的形参，并已在路径中给出），
        // 你可以自动将其映射到路由类型
        val deeplink: DeepLinkScreen = backStackEntry.toRoute()
        val nameGenerated = deeplink.name

        // 如果应用程序接收到只匹配通用模式的 URI，
        // 例如 `demo://example1.com/?name=Jane`
        // 你需要直接解析该 URI
        val nameGeneral = backStackEntry.arguments?.read { getStringOrNull("name") }

        // 可组合内容
    }
}
```

对于 Web，深度链接的工作方式略有不同：由于 Compose Multiplatform for Web 制作的是单页应用程序，你需要将深度链接 URI 模式的所有形参放入 URL 片段中（在 `#` 字符之后），并确保所有形参都经过 URL 编码。

如果 URL 片段符合 URI 模式规则，你仍然可以使用 `backStackEntry.toRoute()` 方法来解析形参。关于在 Web 应用程序中访问和解析 URL 的详细信息，以及浏览器导航的特点，请参见 [undefined](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)。

```kotlin
composable<DeepLinkScreen>(
        deepLinks = listOf(
            // 对于默认的 Compose Multiplatform 设置，localhost:8080
            // 是通过 wasmJsBrowserDevelopmentRun Gradle 任务运行的本地开发端点
            navDeepLink { uriPattern = "localhost:8080/#dlscreen%2F{name}" },
        )
    ) { ... }
```

> 与任何其他单页 Web 应用程序一样，你可以避免在 Web 上使用 URL 片段。为此，你必须配置 Web 服务器以将适当的请求重定向到应用程序，并重写[导航路由到浏览器地址的默认映射](compose-navigation-routing.md#full-url-customization)。
>
{style="tip"}

## 处理接收到的深度链接

在 Android 上，发送到应用程序的深度链接 URI 作为触发深度链接的 `Intent` 的一部分可用。跨平台实现需要一种通用方式来监听深度链接。

我们来创建一个最简实现：

1.  在公共代码中声明一个用于存储和缓存 URI 的单例，并带有一个外部 URI 监听器。
2.  在必要时，实现发送从操作系统接收到的 URI 的平台特有调用。
3.  在主可组合项中设置新深度链接的监听器。

### 声明带 URI 监听器的单例

在 `commonMain` 中，在顶层声明单例对象：

```kotlin
object ExternalUriHandler {
    // 用于在监听器设置前 URI 到达时的存储
    private var cached: String? = null

    var listener: ((uri: String) -> Unit)? = null
        set(value) {
            field = value
            if (value != null) {
                // 当设置了监听器且 `cached` 不为空时，
                // 立即使用缓存的 URI 调用监听器
                cached?.let { value.invoke(it) }
                cached = null
            }
        }

    // 当新 URI 到达时，缓存它。
    // 如果监听器已设置，则立即调用它并清除缓存。
    fun onNewUri(uri: String) {
        cached = uri
        listener?.let {
            it.invoke(uri)
            cached = null
        }
    }
}
```

### 实现对单例的平台特有调用

对于桌面 JVM 和 iOS，你都需要显式传递从系统接收到的 URI。

在 `jvmMain/.../main.kt` 中，解析每个必要操作系统的命令行实参，并将接收到的 URI 传递给单例：

```kotlin
// 导入单例
import org.company.app.ExternalUriHandler

fun main() {
    if(System.getProperty("os.name").indexOf("Mac") > -1) {
        Desktop.getDesktop().setOpenURIHandler { uri ->
            ExternalUriHandler.onNewUri(uri.uri.toString())
        }
    }
    else {
        ExternalUriHandler.onNewUri(args.getOrNull(0).toString())
    }

    application {
         // ...
    }
}
```

对于 iOS，在 Swift 代码中添加一个处理传入 URI 的 `application()` 变体：

```swift
// 导入 KMP 模块以访问单例
import ComposeApp

func application(
    _ application: UIApplication,
    open uri: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
    // 将完整的 URI 发送给单例
    ExternalUriHandler.shared.onNewUri(uri: uri.absoluteString)
        return true
    }
```

> 关于从 Swift 访问单例的命名约定，请参见 [Kotlin/Native 文档](https://kotlinlang.org/docs/native-objc-interop.html#kotlin-singletons)。
>
{style="tip"}

### 设置监听器

你可以使用 `DisposableEffect(Unit)` 来设置监听器并在可组合项不再活跃时清理它。例如：

```kotlin
internal fun App(navController: NavHostController = rememberNavController()) = AppTheme {

    // 由于 `Unit` 永不改变，因此该 effect 只会生成一次
    DisposableEffect(Unit) {
        // 设置监听器以调用 `NavController.navigate()`，
        // 用于列出了匹配 `navDeepLink` 的可组合项
        ExternalUriHandler.listener = { uri ->
            navController.navigate(NavUri(uri))
        }
        // 当可组合项不再活跃时移除监听器
        onDispose {
            ExternalUriHandler.listener = null
        }
    }

    // 复用本文前面提到的示例
    NavHost(
        navController = navController,
        startDestination = FirstScreen
    ) {
        // ...

        composable<DeepLinkScreen>(
            deepLinks = listOf(
                navDeepLink { uriPattern = "$firstBasePath?name={name}" },
                navDeepLink { uriPattern = "demo://example2.com/name={name}" },
            )
        ) {
            // 可组合内容
        }
    }
}
```

## 结果

现在你可以看到完整工作流程：当用户打开 `demo://` URI 时，操作系统将其与注册的方案匹配。然后：
*   如果处理深度链接的应用程序已关闭，单例会接收 URI 并缓存它。当主可组合函数启动时，它会调用单例并导航到与缓存 URI 匹配的深度链接。
*   如果处理深度链接的应用程序已打开，监听器已设置，因此当单例接收到 URI 时，应用程序会立即导航到它。