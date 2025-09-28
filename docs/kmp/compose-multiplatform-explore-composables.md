[//]: # (title: 探索可组合代码)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中学习 – 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是**使用共享逻辑和 UI 创建 Compose Multiplatform 应用**教程的第二部分。在继续之前，请确保你已完成之前的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中学习 – 这两个 IDE 共享相同的核心功能和 Kotlin Multiplatform 支持。这是创建 Compose Multiplatform 应用并共享逻辑和 UI 教程的第一部分。创建你的 Compose Multiplatform 应用 探索可组合代码 修改项目 创建你自己的应用程序">创建你的 Compose Multiplatform 应用</Links><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>探索可组合代码</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改项目<br/>      
      <img src="icon-4-todo.svg" width="20" alt="第四步"/> 创建你自己的应用程序<br/>
    </p>
</tldr>

让我们仔细研究一下 Kotlin Multiplatform 向导创建的示例可组合项。首先，有一个
可组合的 `App()` 函数，它实现了公共 UI，并且可以在所有平台中使用。其次，有用于在每个平台启动此 UI 的
平台特有代码。

## 实现可组合函数

在 `composeApp/src/commonMain/kotlin/App.kt` 文件中，查看 `App()` 函数：

```kotlin
@Composable
@Preview
fun App() {
    MaterialTheme {
        var showContent by remember { mutableStateOf(false) }
        Column(
            modifier = Modifier
                .background(MaterialTheme.colorScheme.primaryContainer)
                .safeContentPadding()
                .fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Button(onClick = { showContent = !showContent }) {
                Text("Click me!")
            }
            AnimatedVisibility(showContent) {
                val greeting = remember { Greeting().greet() }
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Image(painterResource(Res.drawable.compose_multiplatform), null)
                    Text("Compose: $greeting")
                }
            }
        }
    }
}
```

`App()` 函数是一个常规的 Kotlin 函数，标注有 `@Composable`。这类函数被称为 _可组合函数_
或简称 _可组合项_。它们是基于 Compose Multiplatform 的 UI 的构建块。

可组合函数具有以下通用结构：

*   `MaterialTheme` 设置应用程序的外观。默认设置可自定义。例如，你可以选择颜色、形状和排版。
*   `Column` 可组合项控制应用程序的布局。在这里，它在 `AnimatedVisibility` 可组合项上方显示一个 `Button`。
*   `Button` 包含 `Text` 可组合项，它渲染一些文本。
*   `AnimatedVisibility` 使用动画显示和隐藏 `Image`。
*   `painterResource` 加载存储在 XML 资源中的矢量图标。

`Column` 的 `horizontalAlignment` 形参使其内容居中。但要使其生效，该列应占据其容器的全部宽度。这是通过 `modifier` 形参实现的。

修饰符是 Compose Multiplatform 的关键组件。这是你用于调整 UI 中可组合项外观或行为的主要机制。修饰符使用 `Modifier` 类型的方法创建。当你链式调用这些方法时，每次调用都可以更改从上次调用返回的 `Modifier`，这使得顺序变得重要。
关于更多详细信息，请参见 [JetPack Compose 文档](https://developer.android.com/jetpack/compose/modifiers)。

### 管理状态

示例可组合项的最后一个方面是如何管理状态。`App` 可组合项中的 `showContent` 属性使用 `mutableStateOf()` 函数构建，这意味着它是一个可以被观察的状态对象：

```kotlin
var showContent by remember { mutableStateOf(false) }
```

该状态对象被 `remember()` 函数调用包装，这意味着它被构建一次，然后由框架保留。通过执行此操作，你创建了一个属性，其值是包含布尔值的状态对象。框架缓存此状态对象，允许可组合项观察它。

当状态值改变时，任何观察它的可组合项都会被重新调用。这使得它们产生的任何控件都可以被重新绘制。这被称为 _重组_。

在你的应用程序中，状态唯一改变的地方是按钮的点击事件中。`onClick` 事件处理程序反转 `showContent` 属性的值。因此，图像会随 `Greeting().greet()` 调用一起显示或隐藏，因为父 `AnimatedVisibility` 可组合项观察 `showContent`。

## 在不同平台启动 UI

`App()` 函数在每个平台上的执行方式不同。在 Android 上，它由 activity 管理；在 iOS 上，由 view controller 管理；在桌面端，由 window 管理；在 Web 上，由 container 管理。让我们分别查看它们。

### 在 Android 上

对于 Android，打开 `composeApp/src/androidMain/kotlin` 中的 `MainActivity.kt` 文件：

```kotlin
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)

        setContent {
            App()
        }
    }
}
```

这是一个名为 `MainActivity` 的 [Android activity](https://developer.android.com/guide/components/activities/intro-activities)，它调用 `App` 可组合项。

### 在 iOS 上

对于 iOS，打开 `composeApp/src/iosMain/kotlin` 中的 `MainViewController.kt` 文件：

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

这是一个 [view controller](https://developer.apple.com/documentation/uikit/view_controllers)，扮演与 Android 上的 activity 相同的角色。请注意，iOS 和 Android 类型都只是简单地调用 `App` 可组合项。

### 在桌面端

对于桌面端，查看 `composeApp/src/jvmMain/kotlin` 中的 `main()` 函数：

```kotlin
fun main() = application {
    Window(onCloseRequest = ::exitApplication, title = "ComposeDemo") {
        App()
    }
}
```

*   在这里，`application()` 函数启动一个新的桌面应用程序。
*   此函数接受一个 lambda 表达式，你在其中初始化 UI。通常，你创建一个 `Window` 并指定属性和指令，指示程序在窗口关闭时应如何反应。在这种情况下，整个应用程序都会关闭。
*   在此窗口内，你可以放置你的内容。与 Android 和 iOS 一样，唯一的内容是 `App()` 函数。

目前，`App` 函数没有声明任何形参。在更大的应用程序中，你通常会向平台特有的依赖项传递形参。这些依赖项可以手动创建，也可以使用依赖注入库创建。

### 在 Web 上

在 `composeApp/src/webMain/kotlin/main.kt` 文件中，查看 `main()` 函数：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        App()
    }
}
```

*   `@OptIn(ExperimentalComposeUiApi::class)` 注解告诉编译器你正在使用标记为实验性的 API，该 API 可能会在未来版本中更改。
*   `ComposeViewport()` 函数为应用程序设置 Compose 环境。
*   Web 应用被插入到作为 `ComposeViewport` 函数形参指定的 container 中。
*   `App()` 函数负责使用 Jetpack Compose 构建应用程序的 UI 组件。

`main.kt` 文件位于 `webMain` 目录中，其中包含 Web 目标平台的公共代码。

## 下一步

在本教程的下一部分，你将向项目添加一个依赖项并修改用户界面。

**[进入下一部分](compose-multiplatform-modify-project.md)**

## 获取帮助

*   **Kotlin Slack**。获取 [邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 并加入 #multiplatform 频道。
*   **Kotlin 问题追踪器**。 [报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。