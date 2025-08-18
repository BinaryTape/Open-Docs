[//]: # (title: 创建跨平台移动应用程序)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="tutorial-client-kmm"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
<b>视频</b>: <a href="https://youtu.be/_Q62iJoNOfg">Ktor 在 Kotlin Multiplatform Mobile 项目中用于网络</a> 
</p>
</tldr>

<link-summary>
了解如何创建 Kotlin Multiplatform Mobile 应用程序。
</link-summary>

Ktor HTTP 客户端可用于多平台项目。在本教程中，我们将创建一个简单的 Kotlin Multiplatform Mobile 应用程序，它将发送请求并接收纯 HTML 文本形式的响应体。

> 要了解如何创建你的第一个 Kotlin Multiplatform Mobile 应用程序，请参阅 [创建你的第一个跨平台移动应用](https://kotlinlang.org/docs/multiplatform-mobile-create-first-app.html)。

## 前提条件 {id="prerequisites"}

首先，你需要在合适的操作系统上安装必要的工具，以设置跨平台移动开发环境。关于如何执行此操作，请参阅 [设置环境](https://kotlinlang.org/docs/multiplatform-mobile-setup.html) 部分。

> 你需要一台装有 macOS 的 Mac 电脑来完成本教程中的某些步骤，其中包括编写 iOS 特有的代码和运行 iOS 应用程序。
>
{style="note"}

## 创建新项目 {id="new-project"}

要启动新的 Kotlin Multiplatform 项目，有两种方法可用：

- 你可以在 Android Studio 中从模板创建项目。
- 或者，你可以使用 [Kotlin Multiplatform Wizard](https://kmp.jetbrains.com/) 来生成新项目。该向导提供了自定义项目设置的选项，例如，你可以选择排除 Android 支持或包含 Ktor Server。

为了本教程的目的，我们将演示从模板创建项目的过程：

1. 在 Android Studio 中，选择 **File | New | New Project**。
2. 在项目模板列表中选择 **Kotlin Multiplatform App**，然后点击 **Next**。
3. 指定你的应用程序名称，然后点击 **Next**。在本教程中，应用程序名称为 `KmmKtor`。
4. 在下一页，保留默认设置并点击 **Finish** 创建新项目。现在，等待项目设置完成。首次执行此操作时，下载和设置所需组件可能需要一些时间。
   > 要查看生成的完整多平台项目结构，请在 [Project view](https://developer.android.com/studio/projects#ProjectView) 中从 **Android** 切换到 **Project**。

## 配置构建脚本 {id="build-script"}

### 更新 Kotlin Gradle 插件 {id="update_gradle_plugins"}

打开 `gradle/libs.versions.toml` 文件并将 Kotlin 版本更新到最新：

```kotlin
kotlin = "2.1.20"
```

### 添加 Ktor 依赖项 {id="ktor-dependencies"}

要在项目中使用 Ktor HTTP 客户端，你需要添加至少两个依赖项：客户端依赖项和引擎依赖项。

在 `gradle/libs.versions.toml` 文件中添加 Ktor 版本：

```kotlin
[versions]
ktor = "3.2.3"
```

<p>
    要使用 Ktor 的 <b>抢先体验预览</b> 版本，你需要添加一个 <a href="#repositories">Space 版本库</a>。
</p>

然后，定义 Ktor 客户端和引擎库：

```kotlin
kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
kotlinx-coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }
```

要添加这些依赖项，请打开 `shared/build.gradle.kts` 文件并按照以下步骤操作：

1. 要在公共代码中使用 Ktor 客户端，请将依赖项 `ktor-client-core` 添加到 `commonMain` 源代码集：
   ```kotlin
   sourceSets {
       commonMain.dependencies {
           implementation(libs.ktor.client.core)
       }
   }
   ```

2. 将每个所需平台的 [引擎依赖项](client-engines.md) 添加到相应的源代码集：
    - 对于 Android，将 `ktor-client-okhttp` 依赖项添加到 `androidMain` 源代码集：
      ```kotlin
      androidMain.dependencies {
          implementation(libs.ktor.client.okhttp)
      }
      ```

      对于 Android，你还可以使用 [其他引擎类型](client-engines.md#jvm-android)。
    - 对于 iOS，将 `ktor-client-darwin` 依赖项添加到 `iosMain`：
      ```kotlin
      iosMain.dependencies {
          implementation(libs.ktor.client.darwin)
      }
      ```

### 添加协程 {id="coroutines"}

要在 [Android 代码](#android-activity) 中使用协程，你需要将 `kotlinx.coroutines` 添加到你的项目：

1. 打开 `gradle/libs.versions.toml` 文件并指定协程版本和库：

    ```kotlin
    [versions]
    coroutines = "1.9.0"
    [libraries]
    kotlin-test = { module = "org.jetbrains.kotlin:kotlin-test", version.ref = "kotlin" }
    kotlinx-coroutines-android = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-android", version.ref = "coroutines" }
    
    ```

2. 打开 `build.gradle.kts` 文件并将 `kotlinx-coroutines-core` 依赖项添加到 `commonMain` 源代码集：

    ```kotlin
    sourceSets {
        commonMain.dependencies {
            implementation(libs.ktor.client.core)
            implementation(libs.kotlinx.coroutines.core)
        }
    }
    ```

3. 然后，打开 `androidApp/build.gradle.kts` 并添加 `kotlinx-coroutines-android` 依赖项：

```kotlin
    implementation(libs.compose.ui)
}
```

点击 `gradle.properties` 文件右上角的 **Sync Now** 以安装添加的依赖项。

## 更新你的应用程序 {id="code"}

### 共享代码 {id="shared-code"}

要更新 Android 和 iOS 之间共享的代码，请打开 `shared/src/commonMain/kotlin/com/example/kmmktor/Greeting.kt` 文件并将以下代码添加到 `Greeting` 类：

```kotlin
package com.example.kmmktor

import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.client.statement.*

class Greeting {
    private val client = HttpClient()

    suspend fun greeting(): String {
        val response = client.get("https://ktor.io/docs/")
        return response.bodyAsText()
    }
}
```

- 要创建 HTTP 客户端，将调用 `HttpClient` 构造函数。
- 挂起函数 `greeting` 用于发出 [请求](client-requests.md) 并接收 [响应](client-responses.md) 体作为字符串值。

### Android 代码 {id="android-activity"}

要在 Android 代码中调用挂起函数 `greeting`，我们将使用 [rememberCoroutineScope](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary#rememberCoroutineScope(kotlin.Function0))。

打开 `androidApp/src/main/java/com/example/kmmktor/android/MainActivity.kt` 文件并按如下方式更新 `MainActivity` 代码：

```kotlin
package com.example.kmmktor.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.kmmktor.Greeting
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyApplicationTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val scope = rememberCoroutineScope()
                    var text by remember { mutableStateOf("Loading") }
                    LaunchedEffect(true) {
                        scope.launch {
                            text = try {
                                Greeting().greeting()
                            } catch (e: Exception) {
                                e.localizedMessage ?: "error"
                            }
                        }
                    }
                    GreetingView(text)
                }
            }
        }
    }
}

@Composable
fun GreetingView(text: String) {
    Text(text = text)
}

@Preview
@Composable
fun DefaultPreview() {
    MyApplicationTheme {
        GreetingView("Hello, Android!")
    }
}

```

在创建的作用域内，我们可以调用共享的 `greeting` 函数并处理可能的异常。

### iOS 代码 {id="ios-view"}

1. 打开 `iosApp/iosApp/iOSApp.swift` 文件并更新应用程序的入口点：
   ```Swift
   import SwiftUI
   
   @main
   struct iOSApp: App {
   	var body: some Scene {
   		WindowGroup {
   			ContentView(viewModel: ContentView.ViewModel())
   		}
   	}
   }
   ```

2. 打开 `iosApp/iosApp/ContentView.swift` 文件并按如下方式更新 `ContentView` 代码：
   ```Swift
   import SwiftUI
   import shared
   
   struct ContentView: View {
       @ObservedObject private(set) var viewModel: ViewModel
   
       var body: some View {
           Text(viewModel.text)
       }
   }
   
   extension ContentView {
       class ViewModel: ObservableObject {
           @Published var text = "Loading..."
           init() {
               Greeting().greeting { greeting, error in
                   DispatchQueue.main.async {
                       if let greeting = greeting {
                           self.text = greeting
                       } else {
                           self.text = error?.localizedDescription ?? "error"
                       }
                   }
               }
           }
       }
   }
   ```

   在 iOS 上，挂起函数 `greeting` 可作为带回调的函数使用。

## 在 Android 上启用互联网访问 {id="android-internet"}

我们需要做的最后一件事是为 Android 应用程序启用互联网访问。打开 `androidApp/src/main/AndroidManifest.xml` 文件并使用 `uses-permission` 元素启用所需权限：

```xml
<manifest>
    <uses-permission android:name="android.permission.INTERNET" />
    <application>
        ...
    </application>
</manifest> 
```

## 运行你的应用程序 {id="run"}

要在 Android 或 iOS 模拟器上运行创建的多平台应用程序，请选择 **androidApp** 或 **iosApp**，然后点击 **Run**。
模拟器应将接收到的 HTML 文档显示为纯文本。

<Tabs>
<TabItem title="Android">

![Android simulator](tutorial_client_kmm_android.png){width="381"}

</TabItem>
<TabItem title="iOS">

![iOS simulator](tutorial_client_kmm_ios.png){width="351"}

</TabItem>
</Tabs>