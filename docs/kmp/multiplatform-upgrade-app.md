[//]: # (title: 在 iOS 与 Android 之间共享更多逻辑)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但您也可以在 Android Studio 中学习 – 这两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是《**使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用**》教程的第四部分。在继续之前，请确保您已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">创建您的 Kotlin Multiplatform 应用</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-update-ui.md">更新用户界面</a><br/>
      <img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-dependencies.md">添加依赖项</a><br/>
      <img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>共享更多逻辑</strong><br/>
      <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 结束您的项目<br/>
    </p>
</tldr>

既然您已经使用外部依赖项实现了通用逻辑，现在可以开始添加更复杂的逻辑。网络请求和数据序列化是使用 Kotlin Multiplatform 共享代码的[最常见用例](https://kotlinlang.org/lp/multiplatform/)。了解如何在您的第一个应用程序中实现这些，以便在完成此入门之旅后，您可以在未来的项目中应用它们。

更新后的应用将通过互联网从 [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) 检索数据，并显示 SpaceX 火箭上次成功发射的日期。

> 您可以在我们 GitHub 版本库的两个分支中找到项目的最终状态，它们提供了不同的协程解决方案：
> * [\`main\`]\(https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main) 分支包含 KMP-NativeCoroutines 实现，
> * [\`main-skie\`]\(https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie) 分支包含 SKIE 实现。
>
{style="note"}

## 添加更多依赖项

您需要在项目中添加以下多平台库：

*   [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines)，用于协程处理异步代码，从而实现并发操作。
*   [`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)，用于将 JSON 响应反序列化为实体类对象，以处理网络操作。
*   [Ktor](https://ktor.io/)，一个用于创建 HTTP 客户端以通过互联网检索数据的框架。

### kotlinx.coroutines

要将 `kotlinx.coroutines` 添加到您的项目，请在公共源代码集中指定一个依赖项。为此，请将以下行添加到共享模块的 `build.gradle.kts` 文件中：

```kotlin
kotlin {
    // ... 
    sourceSets {
        commonMain.dependencies {
           // ...
           implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

Multiplatform Gradle 插件会自动将依赖项添加到 `kotlinx.coroutines` 的平台特有（iOS 和 Android）部分。

### kotlinx.serialization

要使用 `kotlinx.serialization` 库，请设置相应的 Gradle 插件。
为此，请在共享模块的 `build.gradle.kts` 文件最开头的现有 `plugins {}` 代码块中添加以下行：

```kotlin
plugins {
    // ...
    kotlin("plugin.serialization") version "%kotlinVersion%"
}
```

### Ktor

您需要将核心依赖项 (`ktor-client-core`) 添加到共享模块的公共源代码集。
您还需要添加支持依赖项：

*   添加 `ContentNegotiation` 功能 (`ktor-client-content-negotiation`)，它允许以特定格式序列化和反序列化内容。
*   添加 `ktor-serialization-kotlinx-json` 依赖项，以指示 Ktor 使用 JSON 格式和 `kotlinx.serialization` 作为序列化库。当接收到响应时，Ktor 将期望 JSON 数据并将其反序列化为数据类。
*   通过在平台源代码集中添加相应构件的依赖项来提供平台引擎 (`ktor-client-android`、`ktor-client-darwin`)。

```kotlin
kotlin {
    // ...
    val ktorVersion = "%ktorVersion%"

    sourceSets {
        commonMain.dependencies {
            // ...

            implementation("io.ktor:ktor-client-core:$ktorVersion")
            implementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
            implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
        }
        androidMain.dependencies {
            implementation("io.ktor:ktor-client-android:$ktorVersion")
        }
        iosMain.dependencies {
            implementation("io.ktor:ktor-client-darwin:$ktorVersion")
        }
    }
}
```

单击 **Sync Gradle Changes** 按钮同步 Gradle 文件。

## 创建 API 请求

您将需要 [SpaceX API](https://github.com/r-spacex/SpaceX-API/tree/master/docs#rspacex-api-docs) 来检索数据，并且您将使用一个方法从 **v4/launches** 端点获取所有发射的列表。

### 添加数据模型

在 `shared/src/commonMain/kotlin/.../greetingkmp` 目录中，创建一个新的 `RocketLaunch.kt` 文件并添加一个数据类，用于存储来自 SpaceX API 的数据：

```kotlin
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class RocketLaunch (
    @SerialName("flight_number")
    val flightNumber: Int,
    @SerialName("name")
    val missionName: String,
    @SerialName("date_utc")
    val launchDateUTC: String,
    @SerialName("success")
    val launchSuccess: Boolean?,
)
```

*   `RocketLaunch` 类使用 `@Serializable` 注解标记，因此 `kotlinx.serialization` 插件可以自动为其生成一个默认的序列化器。
*   `@SerialName` 注解允许您重新定义字段名称，从而可以在数据类中声明具有更易读名称的属性。

### 连接 HTTP 客户端

1.  在 `shared/src/commonMain/kotlin/.../greetingkmp` 目录中，创建一个新的 `RocketComponent` 类。
2.  添加 `httpClient` 属性，以通过 HTTP GET 请求检索火箭发射信息：

    ```kotlin
    import io.ktor.client.*
    import io.ktor.client.plugins.contentnegotiation.*
    import io.ktor.serialization.kotlinx.json.*
    import kotlinx.serialization.json.Json
    
    class RocketComponent {
        private val httpClient = HttpClient {
            install(ContentNegotiation) {
                json(Json {
                    prettyPrint = true
                    isLenient = true
                    ignoreUnknownKeys = true
                })
            }
        }
    }
    ```

    *   [ContentNegotiation Ktor 插件](https://ktor.io/docs/serialization-client.html#register_json) 和 JSON 序列化器会反序列化 GET 请求的结果。
    *   这里的 JSON 序列化器配置为使用 `prettyPrint` 属性以更易读的方式打印 JSON。它在使用 `isLenient` 读取格式错误的 JSON 时更加灵活，并且会忽略在火箭发射模型中未声明的键（`ignoreUnknownKeys`）。

3.  将 `getDateOfLastSuccessfulLaunch()` 挂起函数添加到 `RocketComponent`：

    ```kotlin
    class RocketComponent {
        // ...
        
        private suspend fun getDateOfLastSuccessfulLaunch(): String {
        
        }
    }
    ```

4.  调用 `httpClient.get()` 函数以检索火箭发射信息：

    ```kotlin
    import io.ktor.client.request.*
    import io.ktor.client.call.*

    class RocketComponent {
        // ...
        
        private suspend fun getDateOfLastSuccessfulLaunch(): String {
            val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
        }
    }
    ```

    *   `httpClient.get()` 也是一个挂起函数，因为它需要异步地通过网络检索数据而不会阻塞线程。
    *   挂起函数只能从协程或其他挂起函数中调用。这就是 `getDateOfLastSuccessfulLaunch()` 被标记为 `suspend` 关键字的原因。网络请求在 HTTP 客户端的线程池中执行。

5.  再次更新函数，以在列表中找到上次成功的发射：

    ```kotlin
    class RocketComponent {
        // ...
        
        private suspend fun getDateOfLastSuccessfulLaunch(): String {
            val rockets: List<RocketLaunch> = httpClient.get("https://api.spacexdata.com/v4/launches").body()
            val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
        }
    }
    ```

    火箭发射列表按日期从旧到新排序。

6.  将发射日期从 UTC 转换为您的本地日期并格式化输出：

    ```kotlin
    import kotlinx.datetime.TimeZone
    import kotlinx.datetime.toLocalDateTime
    import kotlin.time.Instant

    class RocketComponent {
        // ...
        
        private suspend fun getDateOfLastSuccessfulLaunch(): String {
            val rockets: List<RocketLaunch> =
                httpClient.get("https://api.spacexdata.com/v4/launches").body()
            val lastSuccessLaunch = rockets.last { it.launchSuccess == true }
            val date = Instant.parse(lastSuccessLaunch.launchDateUTC)
                .toLocalDateTime(TimeZone.currentSystemDefault())
        
            return "${date.month} ${date.day}, ${date.year}"
        }
    }
    ```

    日期将采用 “MMMM DD, YYYY” 格式，例如 2022 年 10 月 5 日。

7.  添加另一个挂起函数 `launchPhrase()`，它将使用 `getDateOfLastSuccessfulLaunch()` 函数创建一个消息：

    ```kotlin
    class RocketComponent {
        // ...
    
        suspend fun launchPhrase(): String =
            try {
                "The last successful launch was on ${getDateOfLastSuccessfulLaunch()} 🚀"
            } catch (e: Exception) {
                println("Exception during getting the date of the last successful launch $e")
                "Error occurred"
            }
    }
    ```

### 创建 Flow

您可以使用 Flow 代替挂起函数。它们会发出一系列值，而不是挂起函数返回的单个值。

1.  打开 `shared/src/commonMain/kotlin` 目录中的 `Greeting.kt` 文件。
2.  向 `Greeting` 类添加一个 `rocketComponent` 属性。该属性将存储包含上次成功发射日期的消息：

    ```kotlin
    private val rocketComponent = RocketComponent()
    ```

3.  将 `greet()` 函数更改为返回 `Flow`：

    ```kotlin
    import kotlinx.coroutines.delay
    import kotlinx.coroutines.flow.Flow
    import kotlinx.coroutines.flow.flow
    import kotlin.time.Duration.Companion.seconds
    
    class Greeting {
        // ...
        fun greet(): Flow<String> = flow {
            emit(if (Random.nextBoolean()) "Hi!" else "Hello!")
            delay(1.seconds)
            emit("Guess what this is! > ${platform.name.reversed()}")
            delay(1.seconds)
            emit(daysPhrase())
            emit(rocketComponent.launchPhrase())
        }
    }
    ```

    *   这里的 `Flow` 是通过 `flow()` 构建器函数创建的，该函数封装了所有语句。
    *   `Flow` 以一秒的延迟发出字符串。最后一个元素仅在网络响应返回后才发出，因此确切的延迟取决于您的网络。

### 添加互联网访问权限

为了访问互联网，Android 应用程序需要相应的权限。由于所有网络请求都来自共享模块，因此将互联网访问权限添加到其清单中是合理的。

使用访问权限更新您的 `composeApp/src/androidMain/AndroidManifest.xml` 文件：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    ...
</manifest>
```

您已经通过将 `greet()` 函数的返回类型更改为 `Flow` 来更新了共享模块的 API。现在您需要更新项目的原生部分，以便它们可以正确处理调用 `greet()` 函数的结果。

## 更新原生 Android UI

由于共享模块和 Android 应用程序都用 Kotlin 编写，因此从 Android 使用共享代码非常简单。

### 引入视图模型

随着应用程序变得越来越复杂，是时候为名为 `MainActivity` 的 [Android Activity](https://developer.android.com/guide/components/activities/intro-activities) 引入视图模型了。它调用实现 UI 的 `App()` 函数。视图模型将管理来自 Activity 的数据，并且在 Activity 经历生命周期变化时不会消失。

1.  将以下依赖项添加到您的 `composeApp/build.gradle.kts` 文件中：

    ```kotlin
    androidMain.dependencies {
        // ...
        implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2")
        implementation("androidx.lifecycle:lifecycle-runtime-compose:2.6.2")
        implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.6.2")
    }
    ```

2.  在 `composeApp/src/androidMain/kotlin/com/jetbrains/greeting/greetingkmp` 目录中，创建一个新的 `MainViewModel` Kotlin 类：

    ```kotlin
    import androidx.lifecycle.ViewModel
    
    class MainViewModel : ViewModel() {
        // ...
    }
    ```

    此类扩展了 Android 的 `ViewModel` 类，这确保了在生命周期和配置更改方面的正确行为。

3.  创建一个 [StateFlow](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/) 类型的 `greetingList` 值及其幕后属性：

    ```kotlin
    import kotlinx.coroutines.flow.MutableStateFlow
    import kotlinx.coroutines.flow.StateFlow
    
    class MainViewModel : ViewModel() {
        private val _greetingList = MutableStateFlow<List<String>>(listOf())
        val greetingList: StateFlow<List<String>> get() = _greetingList
    }
    ```

    *   这里的 `StateFlow` 扩展了 `Flow` 接口，但它只有一个值或状态。
    *   私有幕后属性 `_greetingList` 确保只有此类的客户端才能访问只读的 `greetingList` 属性。

4.  在视图模型的 `init` 函数中，从 `Greeting().greet()` Flow 中收集所有字符串：

    ```kotlin
   import androidx.lifecycle.viewModelScope
   import kotlinx.coroutines.launch
   
   class MainViewModel : ViewModel() {
       private val _greetingList = MutableStateFlow<List<String>>(listOf())
       val greetingList: StateFlow<List<String>> get() = _greetingList
       
       init {
           viewModelScope.launch {
               Greeting().greet().collect { phrase ->
                    //...
               }
           }
       }
    }
    ```

    由于 `collect()` 函数是挂起的，因此 `launch` 协程在视图模型的[作用域](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/)内使用。这意味着 `launch` 协程只会在视图模型生命周期的正确阶段运行。

5.  在 `collect` 尾随 lambda 表达式中，更新 `_greetingList` 的值，将收集到的 `phrase` 附加到 `list` 中的短语列表：

    ```kotlin
    import kotlinx.coroutines.flow.update
   
    class MainViewModel : ViewModel() {
        //...
   
        init {
            viewModelScope.launch {
                Greeting().greet().collect { phrase ->
                    _greetingList.update { list -> list + phrase }
                }
            }
        }
    }
    ```

    `update()` 函数将自动更新值。

### 使用视图模型的 Flow

1.  在 `composeApp/src/androidMain/kotlin` 中，打开 `App.kt` 文件并更新它，替换之前的实现：

    ```kotlin
    import androidx.lifecycle.compose.collectAsStateWithLifecycle
    import androidx.compose.runtime.getValue
    import androidx.lifecycle.viewmodel.compose.viewModel
    
    @Composable
    fun App(mainViewModel: MainViewModel = viewModel()) {
        MaterialTheme {
            val greetings by mainViewModel.greetingList.collectAsStateWithLifecycle()
    
            Column(
                modifier = Modifier
                    .safeContentPadding()
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                greetings.forEach { greeting ->
                    Text(greeting)
                    HorizontalDivider()
                }
            }
        }
    }
    ```

    *   `collectAsStateWithLifecycle()` 函数调用 `greetingList` 从视图模型的 Flow 中收集值，并以生命周期感知的方式将其表示为可组合状态。
    *   当创建一个新的 Flow 时，组合状态将发生变化，并显示一个可滚动的 `Column`，其中包含垂直排列并由分隔符分隔的问候短语。

2.  要查看结果，请重新运行您的 **composeApp** 配置：

    ![Final results](multiplatform-mobile-upgrade-android.png){width=300}

## 更新原生 iOS UI

对于项目的 iOS 部分，您将再次利用 [Model-view-viewmodel](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) 模式，将 UI 连接到包含所有业务逻辑的共享模块。

该模块已在 `ContentView.swift` 文件中通过 `import Shared` 声明导入。

### 引入 ViewModel

在 `iosApp/ContentView.swift` 中，为 `ContentView` 创建一个 `ViewModel` 类，它将为其准备和管理数据。在 `task()` 调用中调用 `startObserving()` 函数以支持并发：

```swift
import SwiftUI
import Shared

struct ContentView: View {
    @ObservedObject private(set) var viewModel: ViewModel

    var body: some View {
        ListView(phrases: viewModel.greetings)
            .task { await self.viewModel.startObserving() }
    }
}

extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: Array<String> = []
        
        func startObserving() {
            // ...
        }
    }
}

struct ListView: View {
    let phrases: Array<String>

    var body: some View {
        List(phrases, id: \.self) {
            Text($0)
        }
    }
}
```

*   `ViewModel` 被声明为 `ContentView` 的扩展，因为它们紧密相关。
*   `ViewModel` 具有一个 `greetings` 属性，它是一个 `String` 短语数组。
    SwiftUI 将 ViewModel (`ContentView.ViewModel`) 与视图 (`ContentView`) 连接起来。
*   `ContentView.ViewModel` 被声明为 `ObservableObject`。
*   `@Published` 包装器用于 `greetings` 属性。
*   `@ObservedObject` 属性包装器用于订阅 ViewModel。

每当此属性更改时，此 ViewModel 都会发出信号。现在您需要实现 `startObserving()` 函数来消费 Flow。

### 选择一个库来从 iOS 消费 Flow

在本教程中，您可以使用 [SKIE](https://skie.touchlab.co/) 或 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 库来帮助您在 iOS 中使用 Flow。
它们都是开源解决方案，支持 Flow 的取消和泛型，而 Kotlin/Native 编译器目前默认不提供这些：

*   SKIE 库增强了 Kotlin 编译器生成的 Objective-C API：SKIE 将 Flow 转换为 Swift 的 `AsyncSequence` 的等效形式。SKIE 直接支持 Swift 的 `async`/`await`，没有线程限制，并具有自动双向取消功能（Combine 和 RxSwift 需要适配器）。SKIE 还提供其他特性，可以从 Kotlin 生成对 Swift 友好的 API，包括将各种 Kotlin 类型桥接到 Swift 的等效类型。它也不需要在 iOS 项目中添加额外的依赖项。
*   KMP-NativeCoroutines 库通过生成必要的包装器来帮助您从 iOS 消费挂起函数和 Flow。
    KMP-NativeCoroutines 支持 Swift 的 `async`/`await` 功能以及 Combine 和 RxSwift。
    使用 KMP-NativeCoroutines 需要在 iOS 项目中添加 SPM 或 CocoaPod 依赖项。

### 选项 1. 配置 KMP-NativeCoroutines {initial-collapse-state="collapsed" collapsible="true"}

> 我们建议使用最新版本的库。
> 查看 [KMP-NativeCoroutines 版本库](https://github.com/rickclephas/KMP-NativeCoroutines/releases) 以了解是否有更新的插件版本可用。
>
{style="note"}

1.  在项目的根 `build.gradle.kts` 文件中（**不是** `shared/build.gradle.kts` 文件），将 KSP (Kotlin Symbol Processor) 和 KMP-NativeCoroutines 插件添加到 `plugins {}` 代码块中：

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp").version("%kspVersion%").apply(false)
        id("com.rickclephas.kmp.nativecoroutines").version("%kmpncVersion%").apply(false)
    }
    ```

2.  在 `shared/build.gradle.kts` 文件中，添加 KMP-NativeCoroutines 插件：

    ```kotlin
    plugins {
        // ...
        id("com.google.devtools.ksp")
        id("com.rickclephas.kmp.nativecoroutines")
    }
    ```

3.  同样在 `shared/build.gradle.kts` 文件中，选择启用实验性的 `@ObjCName` 注解：

    ```kotlin
    kotlin {
        // ...
        sourceSets{
            all {
                languageSettings {
                    optIn("kotlin.experimental.ExperimentalObjCName")
                    optIn("kotlin.time.ExperimentalTime")
                }
            }
            // ...
        }
    }
    ```

4.  单击 **Sync Gradle Changes** 按钮同步 Gradle 文件。

#### 使用 KMP-NativeCoroutines 标记 Flow

1.  打开 `shared/src/commonMain/kotlin` 目录中的 `Greeting.kt` 文件。
2.  将 `@NativeCoroutines` 注解添加到 `greet()` 函数。这将确保插件生成正确的代码以支持 iOS 上的 Flow 处理：

    ```kotlin
    import com.rickclephas.kmp.nativecoroutines.NativeCoroutines
    
    class Greeting {
        // ...
       
        @NativeCoroutines
        fun greet(): Flow<String> = flow {
            // ...
        }
    }
    ```

#### 在 Xcode 中使用 SPM 导入库

1.  转到 **文件** | **在 Xcode 中打开项目**。
2.  在 Xcode 中，右键单击左侧菜单中的 `iosApp` 项目，然后选择 **Add Package Dependencies**。
3.  在搜索栏中，输入包名：

     ```none
    https://github.com/rickclephas/KMP-NativeCoroutines.git
    ```

    ![Importing KMP-NativeCoroutines](multiplatform-import-kmp-nativecoroutines.png){width=700}

4.  在 **Dependency Rule** 下拉列表中，选择 **Exact Version** 项，并在相邻字段中输入 `%kmpncVersion%` 版本。
5.  单击 **Add Package** 按钮：Xcode 将从 GitHub 获取包，并打开另一个窗口以选择包产品。
6.  按照所示将 "KMPNativeCoroutinesAsync" 和 "KMPNativeCoroutinesCore" 添加到您的应用，然后单击 **Add Package**：

    ![Add KMP-NativeCoroutines packages](multiplatform-add-package.png){width=500}

这应该会安装 KMP-NativeCoroutines 包中与 `async/await` 机制协同工作所需的部分。

#### 使用 KMP-NativeCoroutines 库消费 Flow

1.  在 `iosApp/ContentView.swift` 中，更新 `startObserving()` 函数，使用 KMP-NativeCoroutines 的 `asyncSequence()` 函数来消费 `Greeting().greet()` 函数的 Flow：

    ```Swift
    func startObserving() async {
        do {
            let sequence = asyncSequence(for: Greeting().greet())
            for try await phrase in sequence {
                self.greetings.append(phrase)
            }
        } catch {
            print("Failed with error: \(error)")
        }
    }
    ```

    这里的循环和 `await` 机制用于迭代 Flow，并在每次 Flow 发出值时更新 `greetings` 属性。

2.  确保 `ViewModel` 标记有 `@MainActor` 注解。该注解确保 `ViewModel` 中的所有异步操作都在主线程上运行，以符合 Kotlin/Native 的要求：

    ```Swift
    // ...
    import KMPNativeCoroutinesAsync
    import KMPNativeCoroutinesCore
    
    // ...
    extension ContentView {
        @MainActor
        class ViewModel: ObservableObject {
            @Published var greetings: Array<String> = []
    
            func startObserving() async {
                do {
                    let sequence = asyncSequence(for: Greeting().greet())
                    for try await phrase in sequence {
                        self.greetings.append(phrase)
                    }
                } catch {
                    print("Failed with error: \(error)")
                }
            }
        }
    }
    ```

### 选项 2. 配置 SKIE {initial-collapse-state="collapsed" collapsible="true"}

要设置该库，请在 `shared/build.gradle.kts` 中指定 SKIE 插件，然后单击 **Sync Gradle Changes** 按钮。

```kotlin
plugins {
   id("co.touchlab.skie") version "%skieVersion%"
}
```

#### 使用 SKIE 消费 Flow

您将使用循环和 `await` 机制来迭代 `Greeting().greet()` Flow，并在每次 Flow 发出值时更新 `greetings` 属性。

确保 `ViewModel` 标记有 `@MainActor` 注解。
该注解确保 `ViewModel` 中的所有异步操作都在主线程上运行，以符合 Kotlin/Native 的要求：

```Swift
// ...
extension ContentView {
    @MainActor
    class ViewModel: ObservableObject {
        @Published var greetings: [String] = []

        func startObserving() async {
            for await phrase in Greeting().greet() {
                self.greetings.append(phrase)
            }
        }
    }
}
```

### 消费 ViewModel 并运行 iOS 应用

在 `iosApp/iOSApp.swift` 中，更新应用的入口点：

```swift
@main
struct iOSApp: App {
   var body: some Scene {
       WindowGroup {
           ContentView(viewModel: ContentView.ViewModel())
       }
   }
}
```

从 IntelliJ IDEA 运行 **iosApp** 配置，确保您的应用逻辑已同步：

![Final results](multiplatform-mobile-upgrade-ios.png){width=300}

> 您可以在我们 GitHub 版本库的两个分支中找到项目的最终状态，它们提供了不同的协程解决方案：
> * [\`main\`]\(https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main) 分支包含 KMP-NativeCoroutines 实现，
> * [\`main-skie\`]\(https://github.com/kotlin-hands-on/get-started-with-kmp/tree/main-skie) 分支包含 SKIE 实现。
>
{style="note"}

## 下一步

在教程的最后一部分，您将结束您的项目并了解下一步要采取的措施。

**[继续下一部分](multiplatform-wrap-up.md)**

### 另请参阅

*   探索 [挂起函数的各种组合方法](https://kotlinlang.org/docs/composing-suspending-functions.html)。
*   了解更多关于 [与 Objective-C 框架和库的互操作性](https://kotlinlang.org/docs/native-objc-interop.html)。
*   完成关于 [网络和数据存储](multiplatform-ktor-sqldelight.md) 的本教程。

## 获取帮助

*   **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
*   **Kotlin 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。