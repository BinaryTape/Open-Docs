[//]: # (title: 更新用户界面)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中跟随操作 – 这两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是 **创建带有共享逻辑和原生 UI 的 Kotlin Multiplatform 应用** 教程的第二部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-create-first-app.md">创建你的 Kotlin Multiplatform 应用</a><br/>
       <img src="icon-2.svg" width="20" alt="Second step"/> <strong>更新用户界面</strong><br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> 添加依赖项<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 共享更多逻辑<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> 完成你的项目<br/>
    </p>
</tldr>

要构建用户界面，你将使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 工具包用于项目的 Android 部分，并使用 [SwiftUI](https://developer.apple.com/xcode/swiftui/) 用于 iOS 部分。
它们都是声明式 UI 框架，你会在 UI 实现中看到相似之处。在这两种情况下，你都将数据存储在 `phrases` 变量中，然后迭代它以生成一个 `Text` 项的 list。

## 更新 Android 部分

`composeApp` 模块包含一个 Android 应用程序，定义了其主 activity 和 UI 视图，并使用 `shared` 模块作为一个普通的 Android 库。该应用程序的 UI 使用 Compose Multiplatform 框架。

进行一些更改，看看它们如何在 UI 中体现出来：

1. 导航到 `composeApp/src/androidMain/kotlin` 目录下的 `App.kt` 文件。
2. 找到 `Greeting` 类调用。选择 `greet()` 函数，右键点击它，然后选择 **Go To** | **Declaration or Usages**。
   你会看到它是你在上一步中编辑过的 `shared` 模块中的同一个类。
3. 在 `Greeting.kt` 文件中，更新 `greet()` 函数：

   ```kotlin
   import kotlin.random.Random
   
   fun greet(): List<String> = buildList {
       add(if (Random.nextBoolean()) "Hi!" else "Hello!")
       add("Guess what this is! > ${platform.name.reversed()}!")
   }
   ```

   现在它返回一个字符串 list。

4. 返回 `App.kt` 文件并更新 `App()` 实现：

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

   在这里，`Column` 可组合项显示了每个 `Text` 项，在它们周围添加了内边距并在它们之间添加了间距。

5. 按照 IntelliJ IDEA 的建议导入缺失的依赖项。
6. 现在你可以运行 Android 应用，查看它如何显示字符串 list：

   ![Updated UI of Android multiplatform app](first-multiplatform-project-on-android-2.png){width=300}

## 使用 iOS 模块

`iosApp` 目录构建为 iOS 应用程序。它依赖并使用 `shared` 模块作为一个 iOS framework。该应用的 UI 是用 Swift 编写的。

实现与 Android 应用相同的更改：

1. 在 IntelliJ IDEA 中，在 **Project** 工具窗口的项目根目录下找到 `iosApp` 文件夹。
2. 打开 `ContentView.swift` 文件，右键点击 `Greeting().greet()` 调用，然后选择 **Go To** | **Definition**。

    你会看到为 `shared` 模块中定义的 Kotlin 函数生成的 Objective-C 声明。从 Objective-C/Swift 使用时，Kotlin 类型表示为 Objective-C 类型。在这里，`greet()` 函数在 Kotlin 中返回 `List<String>`，从 Swift 看来则返回 `NSArray<NSString>`。有关类型映射的更多信息，请参见 [与 Swift/Objective-C 的互操作](https://kotlinlang.org/docs/native-objc-interop.html)。

3. 更新 SwiftUI 代码以与 Android 应用相同的方式显示一个项 list：

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

    * `greet()` 调用的结果存储在 `phrases` 变量中（Swift 中的 `let` 类似于 Kotlin 的 `val`）。
    * `List` 函数生成一个 `Text` 项 list。

4. 启动 iOS 运行配置以查看更改：

    ![Updated UI of your iOS multiplatform app](first-multiplatform-project-on-ios-2.png){width=300}

## 可能出现的问题和解决方案

### Xcode 报告调用共享 framework 的代码中存在错误

如果你正在使用 Xcode，你的 Xcode project 可能仍在使用旧版本的 framework。
要解决此问题，请返回 IntelliJ IDEA 并重构建项目或启动 iOS 运行配置。

### Xcode 报告导入共享 framework 时出错

如果你正在使用 Xcode，它可能需要清除缓存的二进制文件：尝试通过选择主菜单中的 **Product | Clean Build Folder** 来重置环境。

## 下一步

在教程的下一部分中，你将了解依赖项并添加一个第三方库来扩展你的项目的功能性。

**[继续下一部分](multiplatform-dependencies.md)**

## 获取帮助

*   **Kotlin Slack**。获取 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入
    `#multiplatform` 频道。
*   **Kotlin issue tracker**。 [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。