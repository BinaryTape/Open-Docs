[//]: # (title: 让你的 Android 应用程序在 iOS 上运行 – 教程)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
<p>本教程使用 Android Studio，但你也可以在 IntelliJ IDEA 中学习。当<a href="quickstart.md">正确配置</a>后，这两个 IDE 都具备相同的核心功能和 Kotlin Multiplatform 支持。</p>
</tldr>

本教程演示如何使现有的 Android 应用程序跨平台，使其能够在 Android 和 iOS 上运行。你将能够一次性在同一个地方为 Android 和 iOS 编写代码。

本教程使用一个[示例 Android 应用程序](https://github.com/Kotlin/kmp-integration-sample)，它有一个用于输入用户名和密码的单个屏幕。凭据经过验证并保存到内存数据库中。

为了让你的应用程序在 iOS 和 Android 上都能运行，你首先需要通过将部分代码移动到**共享模块**来使其跨平台。之后，你将在 Android 应用程序中使用你的跨平台代码，然后在新的 iOS 应用程序中使用相同的代码。

> 如果你不熟悉 Kotlin Multiplatform，请先学习如何[从头创建跨平台应用程序](quickstart.md)。
>
{style="tip"}

## 准备开发环境

1. 在快速入门中，完成[设置 Kotlin Multiplatform 开发环境](quickstart.md#set-up-the-environment)的说明。

   > 你需要一台装有 macOS 的 Mac 才能完成本教程中的某些步骤，例如运行 iOS 应用程序。这是 Apple 的要求。
   >
   {style="note"}

2. 在 Android Studio 中，从版本控制创建新项目：

   ```text
   https://github.com/Kotlin/kmp-integration-sample
   ```

   > `master` 分支包含项目的初始状态 – 一个简单的 Android 应用程序。要查看包含 iOS 应用程序和共享模块的最终状态，请切换到 `final` 分支。
   >
   {style="tip"}

3. 切换到 **Project** 视图：

   ![Project view](switch-to-project.png){width="513"}

## 使你的代码跨平台

要使你的代码跨平台，请按照以下步骤操作：

1. [决定哪些代码要跨平台](#decide-what-code-to-make-cross-platform)
2. [为跨平台代码创建共享模块](#create-a-shared-module-for-cross-platform-code)
3. [测试代码共享](#add-code-to-the-shared-module)
4. [将共享模块依赖项添加到 Android 应用程序](#add-a-dependency-on-the-shared-module-to-your-android-application)
5. [使业务逻辑跨平台](#make-the-business-logic-cross-platform)
6. [在 Android 上运行你的跨平台应用程序](#run-your-cross-platform-application-on-android)

### 决定哪些代码要跨平台

决定 Android 应用程序的哪些代码更适合与 iOS 共享，哪些代码应保留为原生代码。一个简单的规则是：尽可能多地共享你想要重用的代码。业务逻辑在 Android 和 iOS 上通常是相同的，因此它是重用的绝佳候选者。

在你的示例 Android 应用程序中，业务逻辑存储在 `com.jetbrains.simplelogin.androidapp.data` 包中。你未来的 iOS 应用程序将使用相同的逻辑，因此你也应该使其跨平台。

![Business logic to share](business-logic-to-share.png){width=366}

### 为跨平台代码创建共享模块

用于 iOS 和 Android 的跨平台代码将存储在**共享模块**中。Android Studio 和 IntelliJ IDEA 都提供了用于创建 Kotlin Multiplatform 共享模块的向导。

创建一个共享模块，以连接到现有 Android 应用程序和未来的 iOS 应用程序：

1. 在 Android Studio 中，从主菜单中选择 **File** | **New** | **New Module**。
2. 在模板列表中，选择 **Kotlin Multiplatform Shared Module**。将库名称保留为 `shared`，并输入包名：

   ```text
   com.jetbrains.simplelogin.shared
   ```

3. 点击 **Finish**。向导会创建一个共享模块，相应地更改构建脚本，并开始 Gradle 同步。
4. 设置完成后，你将在 `shared` 目录中看到以下文件结构：

   ![Final file structure inside the shared directory](shared-directory-structure.png){width="341"}

5. 确保 `shared/build.gradle.kts` 文件中的 `kotlin.androidLibrary.minSdk` 属性与 `app/build.gradle.kts` 文件中同名属性的值匹配。

### 将代码添加到共享模块

现在你有了共享模块，将一些要共享的通用代码添加到 `commonMain/kotlin/com.jetbrains.simplelogin.shared` 目录中：

1. 创建一个包含以下代码的新 `Greeting` 类：

    ```kotlin
    package com.jetbrains.simplelogin.shared

    class Greeting {
        private val platform = getPlatform()

        fun greet(): String {
            return "Hello, ${platform.name}!"
        }
    }
    ```

2. 将已创建文件中的代码替换为以下内容：

     * 在 `commonMain/Platform.kt` 中：

         ```kotlin
         package com.jetbrains.simplelogin.shared
       
         interface Platform {
             val name: String
         }
        
         expect fun getPlatform(): Platform
         ```
     
     * 在 `androidMain/Platform.android.kt` 中：

         ```kotlin
         package com.jetbrains.simplelogin.shared
         
         import android.os.Build

         class AndroidPlatform : Platform {
             override val name: String = "Android ${Build.VERSION.SDK_INT}"
         }

         actual fun getPlatform(): Platform = AndroidPlatform()
         ```
     * 在 `iosMain/Platform.ios.kt` 中：

         ```kotlin
         package com.jetbrains.simplelogin.shared
       
         import platform.UIKit.UIDevice

         class IOSPlatform: Platform {
             override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
         }

         actual fun getPlatform(): Platform = IOSPlatform()
         ```

如果你想更好地理解生成项目的布局，请参阅 [Kotlin Multiplatform 项目结构基础](multiplatform-discover-project.md)。

### 将共享模块依赖项添加到 Android 应用程序

要在 Android 应用程序中使用跨平台代码，请将共享模块连接到它，将业务逻辑代码移动到那里，并使此代码跨平台。

1. 将共享模块依赖项添加到 `app/build.gradle.kts` 文件中：

    ```kotlin
    dependencies {
        // ...
        implementation(project(":shared"))
    }
    ```

2. 按照 IDE 的建议或使用 **File** | **Sync Project with Gradle Files** 菜单项同步 Gradle 文件。
3. 在 `app/src/main/java/` 目录中，打开 `com.jetbrains.simplelogin.androidapp.ui.login` 包中的 `LoginActivity.kt` 文件。
4. 为了确保共享模块已成功连接到你的应用程序，通过向 `onCreate()` 方法添加 `Log.i()` 调用，将 `greet()` 函数的结果输出到日志中：

    ```kotlin
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        Log.i("Login Activity", "Hello from shared module: " + (Greeting().greet()))
   
        // ...
    }
    ```
5. 按照 IDE 的建议导入缺少的类。
6. 在工具栏中，点击 `app` 下拉菜单，然后点击调试图标：

   ![App from list to debug](app-list-android.png){width="300"}

7. 在 **Logcat** 工具窗口中，在日志中搜索 "Hello"，你将找到来自共享模块的问候语：

   ![Greeting from the shared module](shared-module-greeting.png){width="700"}

### 使业务逻辑跨平台

你现在可以将业务逻辑代码提取到 Kotlin Multiplatform 共享模块中，并使其独立于平台。这对于在 Android 和 iOS 上重用代码是必要的。

1. 将业务逻辑代码 `com.jetbrains.simplelogin.androidapp.data` 从 `app` 目录移动到 `shared/src/commonMain` 目录中的 `com.jetbrains.simplelogin.shared` 包中。

   ![Drag and drop the package with the business logic code](moving-business-logic.png){width=300}

2. 当 Android Studio 询问你想要做什么时，选择移动包，然后批准重构。

   ![Refactor the business logic package](refactor-business-logic-package.png){width=300}

3. 忽略所有关于平台依赖代码的警告，然后点击 **Refactor Anyway**。

   ![Warnings about platform-dependent code](warnings-android-specific-code.png){width=450}

4. 通过将其替换为跨平台 Kotlin 代码或使用[期望与实际声明](multiplatform-connect-to-apis.md)连接到 Android 特有的 API，来移除 Android 特有的代码。详情请参阅以下部分：

   #### 用跨平台代码替换 Android 特有的代码 {initial-collapse-state="collapsed" collapsible="true"}
   
   为了使你的代码在 Android 和 iOS 上都能良好运行，请尽可能地将已移动的 `data` 目录中的所有 JVM 依赖项替换为 Kotlin 依赖项。

   1. 在 `LoginDataValidator` 类中，将 `android.utils` 包中的 `Patterns` 类替换为符合电子邮件验证模式的 Kotlin 正则表达式：
   
       ```kotlin
       // Before
       private fun isEmailValid(email: String) = Patterns.EMAIL_ADDRESS.matcher(email).matches()
       ```
   
       ```kotlin
       // After
       private fun isEmailValid(email: String) = emailRegex.matches(email)
       
       companion object {
           private val emailRegex = 
               ("[a-zA-Z0-9\\+\\.\\_\\%\\-\\+]{1,256}" +
                   "\\@" +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,64}" +
                   "(" +
                   "\\." +
                   "[a-zA-Z0-9][a-zA-Z0-9\\-]{0,25}" +
                   ")+").toRegex()
       }
       ```
   
   2. 移除 `Patterns` 类的导入指令：
   
       ```kotlin
       import android.util.Patterns
       ```

   3. 在 `LoginDataSource` 类中，将 `login()` 函数中的 `IOException` 替换为 `RuntimeException`。`IOException` 在 Kotlin/JVM 中不可用。

          ```kotlin
          // Before
          return Result.Error(IOException("Error logging in", e))
          ```

          ```kotlin
          // After
          return Result.Error(RuntimeException("Error logging in", e))
          ```

   4. 同时移除 `IOException` 的导入指令：

       ```kotlin
       import java.io.IOException
       ```

   #### 从跨平台代码连接到平台特有的 API {initial-collapse-state="collapsed" collapsible="true"}
   
   在 `LoginDataSource` 类中，`fakeUser` 的通用唯一标识符 (UUID) 是使用 `java.util.UUID` 类生成的，该类在 iOS 上不可用。
   
   ```kotlin
   val fakeUser = LoggedInUser(java.util.UUID.randomUUID().toString(), "Jane Doe")
   ```
   
   尽管 Kotlin 标准库提供了一个[实验性的 UUID 生成类](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.uuid/-uuid/)，但为了练习，我们在此示例中使用平台特有的功能来完成。
   
   为共享代码中的 `randomUUID()` 函数提供 `expect` 声明，并在相应的源代码集中为每个平台（Android 和 iOS）提供其 `actual` 实现。你可以了解更多关于[连接到平台特有的 API](multiplatform-connect-to-apis.md) 的信息。
   
   1. 将 `login()` 函数中的 `java.util.UUID.randomUUID()` 调用更改为 `randomUUID()` 调用，你将为每个平台实现它：
   
       ```kotlin
       val fakeUser = LoggedInUser(randomUUID(), "Jane Doe")
       ```
   
   2. 在 `shared/src/commonMain` 目录的 `com.jetbrains.simplelogin.shared` 包中创建 `Utils.kt` 文件，并提供 `expect` 声明：
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       expect fun randomUUID(): String
       ```
   
   3. 在 `shared/src/androidMain` 目录的 `com.jetbrains.simplelogin.shared` 包中创建 `Utils.android.kt` 文件，并提供 Android 中 `randomUUID()` 的 `actual` 实现：
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import java.util.*
      
       actual fun randomUUID() = UUID.randomUUID().toString()
       ```
   
   4. 在 `shared/src/iosMain` 目录的 `com.jetbrains.simplelogin.shared` 中创建 `Utils.ios.kt` 文件，并提供 iOS 中 `randomUUID()` 的 `actual` 实现：
   
       ```kotlin
       package com.jetbrains.simplelogin.shared
       
       import platform.Foundation.NSUUID
      
       actual fun randomUUID(): String = NSUUID().UUIDString()
       ```
   
   5. 在 `shared/src/commonMain` 目录的 `LoginDataSource.kt` 文件中导入 `randomUUID` 函数：
   
      ```kotlin
      import com.jetbrains.simplelogin.shared.randomUUID
      ```
   
现在，Kotlin 将为 Android 和 iOS 使用平台特有的 UUID 实现。

### 在 Android 上运行你的跨平台应用程序

运行你的 Android 跨平台应用程序，确保它像以前一样工作。

![Android login application](android-login.png){width=300}

## 使你的跨平台应用程序在 iOS 上运行

一旦你的 Android 应用程序跨平台化，你就可以创建一个 iOS 应用程序并在其中重用共享业务逻辑。

1. [在 Xcode 中创建 iOS 项目](#create-an-ios-project-in-xcode)
2. [配置 iOS 项目以使用 KMP framework](#configure-the-ios-project-to-use-a-kmp-framework)
3. [在 Android Studio 中设置 iOS 运行配置](#set-up-an-ios-run-configuration-in-android-studio)
4. [在 iOS 项目中使用共享模块](#use-the-shared-module-in-the-ios-project)

### 在 Xcode 中创建 iOS 项目

1. 在 Xcode 中，点击 **File** | **New** | **Project**。
2. 选择 iOS 应用程序模板，然后点击 **Next**。

   ![iOS project template](ios-project-wizard-1.png){width=700}

3. 将产品名称指定为 "simpleLoginIOS"，然后点击 **Next**。

   ![iOS project settings](ios-project-wizard-2.png){width=700}

4. 对于项目位置，选择存储你的跨平台应用程序的目录，例如 `kmp-integration-sample`。

在 Android Studio 中，你将得到以下结构：

![iOS project in Android Studio](ios-project-in-as.png){width=194}

你可以将 `simpleLoginIOS` 目录重命名为 `iosApp`，以与跨平台项目的其他[顶层](#top-level)目录保持一致。要做到这一点，请关闭 Xcode，然后将 `simpleLoginIOS` 目录重命名为 `iosApp`。如果在 Xcode 打开的情况下重命名文件夹，你将收到警告，并且可能会损坏你的项目。

![Renamed iOS project directory in Android Studio](ios-directory-renamed-in-as.png){width=194}

### 配置 iOS 项目以使用 KMP framework

你可以直接设置 iOS 应用与 Kotlin Multiplatform 构建的 framework 之间的集成。本方法的替代方案在 [iOS 集成方法概述](multiplatform-ios-integration-overview.md)中有所介绍，但它们超出了本教程的范围。

1. 在 Android Studio 中，右键点击 `iosApp/simpleLoginIOS.xcodeproj` 目录，然后选择 **Open In** | **Open In Associated Application** 以在 Xcode 中打开 iOS 项目。
2. 在 Xcode 中，通过双击 **Project** 导航器中的项目名称来打开 iOS 项目设置。

3. 在左侧的 **Targets** 部分，选择 **simpleLoginIOS**，然后点击 **Build Phases** 标签页。

4. 点击 **+** 图标并选择 **New Run Script Phase**。

    ![Add a run script phase](xcode-run-script-phase-1.png){width=700}

4. 将以下脚本粘贴到运行脚本字段中：

    ```text
    cd "$SRCROOT/.."
    ./gradlew :shared:embedAndSignAppleFrameworkForXcode
    ```

   ![Add the script](xcode-run-script-phase-2.png){width=700}

5. 禁用 **Based on dependency analysis** 选项。

   这可确保 Xcode 在每次构建期间都运行脚本，并且不会每次都警告缺少输出依赖项。

6. 将 **Run Script** 阶段上移，放置在 **Compile Sources** 阶段之前：

   ![Move the Run Script phase](xcode-run-script-phase-3.png){width=700}

7. 在 **Build Settings** 标签页上，在 **Build Options** 下禁用 **User Script Sandboxing** 选项：

   ![User Script Sandboxing](disable-sandboxing-in-xcode-project-settings.png){width=700}

   > 如果你有不同于默认 `Debug` 或 `Release` 的自定义构建配置，请在 **Build Settings** 标签页的 **User-Defined** 下添加 `KOTLIN_FRAMEWORK_BUILD_TYPE` 设置，并将其设置为 `Debug` 或 `Release`。
   >
   {style="note"}

8. 在 Xcode 中构建项目（主菜单中的 **Product** | **Build**）。如果一切配置正确，项目应该成功构建（你可以安全地忽略“构建阶段将在每次构建期间运行”的警告）。
   
    > 如果你在禁用 **User Script Sandboxing** 选项之前构建了项目，构建可能会失败：Gradle daemon 进程可能已被沙盒化，需要重新启动。在再次构建项目之前，通过在项目目录（在本例中为 `kmp-integration-sample`）中运行此命令来停止它：
    > 
    > ```shell
    > ./gradlew --stop
    > ```
    > 
    {style="note"}

### 在 Android Studio 中设置 iOS 运行配置

确认 Xcode 设置正确后，返回 Android Studio：

1. 在主菜单中选择 **File | Sync Project with Gradle Files**。Android Studio 会自动生成一个名为 **simpleLoginIOS** 的运行配置。

   Android Studio 会自动生成一个名为 **simpleLoginIOS** 的运行配置，并将 `iosApp` 目录标记为链接的 Xcode 项目。

2. 在运行配置列表中，选择 **simpleLoginIOS**。选择一个 iOS 模拟器，然后点击 **Run** 以检查 iOS 应用程序是否正常运行。

   ![The iOS run configuration in the list of run configurations](ios-run-configuration-simplelogin.png){width="400"}

### 在 iOS 项目中使用共享模块

`shared` 模块的 `build.gradle.kts` 文件将每个 iOS 目标平台的 `binaries.framework.baseName` 属性定义为 `sharedKit`。这是 Kotlin Multiplatform 为 iOS 应用构建供其使用的 framework 的名称。

为了测试集成，请在 Swift 代码中添加对通用代码的调用：

1. 在 Android Studio 中，打开 `iosApp/simpleloginIOS/ContentView.swift` 文件并导入 framework：

   ```swift
   import sharedKit
   ```

2. 为了检查它是否正确连接，将 `ContentView` 结构更改为使用跨平台应用程序共享模块中的 `greet()` 函数：

   ```swift
   struct ContentView: View {
       var body: some View {
           Text(Greeting().greet())
           .padding()
       }
   }
   ```

3. 使用 Android Studio iOS 运行配置运行应用程序，查看结果：

   ![Greeting from the shared module](xcode-iphone-hello.png){width=300}

4. 再次更新 `ContentView.swift` 文件中的代码，以使用共享模块中的业务逻辑来渲染应用程序 UI：

   ```kotlin
   ```
   {src="android-ios-tutorial/ContentView.swift" initial-collapse-state="collapsed" collapsible="true"}

5. 在 `simpleLoginIOSApp.swift` 文件中，导入 `sharedKit` 模块并为 `ContentView()` 函数指定实参：

    ```swift
    import SwiftUI
    import sharedKit
    
    @main
    struct SimpleLoginIOSApp: App {
        var body: some Scene {
            WindowGroup {
                ContentView(viewModel: .init(loginRepository: LoginRepository(dataSource: LoginDataSource()), loginValidator: LoginDataValidator()))
            }
        }
    }
    ```

6. 再次运行 iOS 运行配置，查看 iOS 应用是否显示登录表单。
7. 输入 "Jane" 作为用户名，"password" 作为密码。
8. 由于你已[提前设置了集成](#configure-the-ios-project-to-use-a-kmp-framework)，iOS 应用会使用通用代码验证输入：

   ![Simple login application](xcode-iphone-login.png){width=300}

## 享受成果 – 只需更新一次逻辑

现在你的应用程序已跨平台。你可以在 `shared` 模块中更新业务逻辑，并在 Android 和 iOS 上看到结果。

1. 更改用户密码的验证逻辑："password" 不应是有效选项。为此，请更新 `LoginDataValidator` 类的 `checkPassword()` 函数（要快速找到它，请按两次 <shortcut>Shift</shortcut>，粘贴类名，然后切换到 **Classes** 标签页）：

   ```kotlin
   package com.jetbrains.simplelogin.shared.data
   
   class LoginDataValidator {
   //...
       fun checkPassword(password: String): Result {
           return when {
               password.length < 5 -> Result.Error("Password must be >5 characters")
               password.lowercase() == "password" -> Result.Error("Password shouldn't be \"password\"")
               else -> Result.Success
           }
       }
   //...
   }
   ```

2. 从 Android Studio 运行 iOS 和 Android 应用程序，查看更改：

   ![Android and iOS applications password error](android-iphone-password-error.png){width=600}

你可以查看本教程的[最终代码](https://github.com/Kotlin/kmp-integration-sample/tree/final)。

## 还能共享什么？

你已经共享了应用程序的业务逻辑，但你也可以决定共享应用程序的其他层。例如，`ViewModel` 类代码对于 [Android](https://github.com/Kotlin/kmp-integration-sample/blob/final/app/src/main/java/com/jetbrains/simplelogin/androidapp/ui/login/LoginViewModel.kt) 和 [iOS 应用程序](https://github.com/Kotlin/kmp-integration-sample/blob/final/iosApp/SimpleLoginIOS/ContentView.swift#L84)几乎相同，如果你的移动应用程序应该拥有相同的演示层，你可以共享它。

## 接下来是什么？

一旦你的 Android 应用程序跨平台化，你可以继续并：

* [添加多平台库依赖项](multiplatform-add-dependencies.md)
* [添加 Android 依赖项](multiplatform-android-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)

你可以使用 Compose Multiplatform 在所有平台上创建统一的 UI：

* [了解 Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md)
* [探索 Compose Multiplatform 可用资源](compose-multiplatform-resources.md)
* [创建具有共享逻辑和 UI 的应用](compose-multiplatform-create-first-app.md)

你还可以查看社区资源：

* [视频：如何将 Android 项目迁移到 Kotlin Multiplatform](https://www.youtube.com/watch?v=vb-Pt8SdfEE&t=1s)
* [视频：3 种方法让你的 Kotlin JVM 代码为 Kotlin Multiplatform 做好准备](https://www.youtube.com/watch?v=X6ckI1JWjqo)