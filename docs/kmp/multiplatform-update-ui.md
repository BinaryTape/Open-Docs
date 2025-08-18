[//]: # (title: 更新用户界面)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 —— 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是 **使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用程序** 教程的第二部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/multiplatform-create-first-app" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中进行操作 —— 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。这是使用共享逻辑和原生 UI 创建 Kotlin Multiplatform 应用程序教程的第一部分。创建你的 Kotlin Multiplatform 应用程序 更新用户界面 添加依赖项 共享更多逻辑 完善你的项目">创建你的 Kotlin Multiplatform 应用程序</Links><br/>
       <img src="icon-2.svg" width="20" alt="第二步"/> <strong>更新用户界面</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="第三步"/> 添加依赖项<br/>       
       <img src="icon-4-todo.svg" width="20" alt="第四步"/> 共享更多逻辑<br/>
       <img src="icon-5-todo.svg" width="20" alt="第五步"/> 完善你的项目<br/>
    </p>
</tldr>

要构建用户界面，你将使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 工具包来完成项目的 Android 部分，并使用 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 来完成 iOS 部分。
它们都是声明式 UI 框架，你将看到 UI 实现中的相似之处。在这两种情况下，
你都将数据存储在 `phrases` 变量中，然后遍历它以生成一个 `Text` 项的 list。

## 更新 Android 部分

`composeApp` 模块包含一个 Android 应用程序，定义其主 activity 和 UI 视图，并将 `shared` 模块作为常规的 Android 库使用。该应用程序的 UI 使用 Compose Multiplatform 框架。

进行一些更改，并查看它们如何在 UI 中反映出来：

1.  导航到 `composeApp/src/androidMain/kotlin` 中的 `App.kt` 文件。
2.  找到 `Greeting` 类的调用。选择 `greet()` 函数，右键点击它，然后选择 **Go To** | **Declaration or Usages**。
    你将看到它与你在上一步中编辑的 `shared` 模块中的类是同一个。
3.  在 `Greeting.kt` 文件中，更新 `greet()` 函数：

    ```kotlin
    import kotlin.random.Random
    
    fun greet(): List<String> = buildList {
        add(if (Random.nextBoolean()) "Hi!" else "Hello!")
        add("Guess what this is! > ${platform.name.reversed()}!")
    }
    ```

    现在它返回一个字符串的 list。

4.  回到 `App.kt` 文件并更新 `App()` 实现：

    ```kotlin
    @Composable
    @Preview
    fun App() {
        MaterialTheme {
            val greeting = remember { Greeting().greet() }
    
            Column(
                modifier = Modifier
                    .padding(all = 10.dp)
                    .safeContentPadding()
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                greeting.forEach { greeting ->
                    Text(greeting)
                    HorizontalDivider()
                }
            }
        }
    }
    ```

    这里的 `Column` 可组合项显示了每个 `Text` 项，在它们周围添加了 padding 并在它们之间留出空间。

5.  按照 IntelliJ IDEA 的建议导入缺失的依赖项。
6.  现在你可以运行 Android 应用程序，看看它是如何显示字符串 list 的：

    ![Updated UI of Android multiplatform app](first-multiplatform-project-on-android-2.png){width=300}

## 使用 iOS 模块

`iosApp` 目录构建为一个 iOS 应用程序。它依赖并使用 `shared` 模块作为一个 iOS framework。该应用程序的 UI 是用 Swift 编写的。

实现与 Android 应用程序相同的更改：

1.  在 IntelliJ IDEA 中，在 **Project** 工具窗口的项目根目录下找到 `iosApp` 文件夹。
2.  打开 `ContentView.swift` 文件，右键点击 `Greeting().greet()` 调用，然后选择 **Go To** | **Definition**。

    你将看到 `shared` 模块中定义的 Kotlin 函数的 Objective-C 声明。当从 Objective-C/Swift 中使用时，Kotlin 类型会表示为 Objective-C 类型。这里 `greet()` 函数在 Kotlin 中返回 `List<String>`，在 Swift 中则被视为返回 `NSArray<NSString>`。有关类型映射的更多信息，请参见 [Interoperability with Swift/Objective-C](https://kotlinlang.org/docs/native-objc-interop.html)。

3.  更新 SwiftUI 代码以与 Android 应用程序相同的方式显示一个 item list：

    ```Swift
    struct ContentView: View {
       let phrases = Greeting().greet()
    
       var body: some View {
           List(phrases, id: \.self) {
               Text($0)
           }
       }
    }
    ```

    *   `greet()` 调用的结果存储在 `phrases` 变量中（Swift 中的 `let` 类似于 Kotlin 的 `val`）。
    *   `List` 函数生成一个 `Text` 项的 list。

4.  启动 iOS 运行配置以查看更改：

    ![Updated UI of your iOS multiplatform app](first-multiplatform-project-on-ios-2.png){width=300}

## 可能的问题和解决方案

### Xcode 报告调用共享 framework 的代码中存在错误

如果你正在使用 Xcode，你的 Xcode 项目可能仍在使用旧版本的 framework。
要解决此问题，请返回 IntelliJ IDEA 并重新构建项目或启动 iOS 运行配置。

### Xcode 报告导入共享 framework 时出错

如果你正在使用 Xcode，它可能需要清除缓存的二进制文件：尝试通过选择主菜单中的 **Product | Clean Build Folder** 来重置环境。

## 下一步

在本教程的下一部分，你将学习依赖项，并添加一个第三方库来扩展项目的功能。

**[前往下一部分](multiplatform-dependencies.md)**

## 获取帮助

*   **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
*   **Kotlin issue tracker**。 [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。