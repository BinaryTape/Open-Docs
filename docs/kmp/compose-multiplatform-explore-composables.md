[//]: # (title: 探索可组合代码)

<secondary-label ref="IntelliJ IDEA"/>
<secondary-label ref="Android Studio"/>

<tldr>
    <p>本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中按照本教程进行操作——这两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。</p>
    <br/>
    <p>这是**使用共享逻辑和 UI 创建 Compose Multiplatform 应用**教程的第二部分。在继续之前，请确保你已完成前面的步骤。</p>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <Links href="/kmp/compose-multiplatform-create-first-app" summary="本教程使用 IntelliJ IDEA，但你也可以在 Android Studio 中按照本教程进行操作——这两个 IDE 都共享相同的核心功能和 Kotlin Multiplatform 支持。这是使用共享逻辑和 UI 创建 Compose Multiplatform 应用教程的第一部分。创建你的 Compose Multiplatform 应用、探索可组合代码、修改项目、创建你自己的应用程序">创建你的 Compose Multiplatform 应用</Links><br/>
      <img src="icon-2.svg" width="20" alt="第二步"/> <strong>探索可组合代码</strong><br/>
      <img src="icon-3-todo.svg" width="20" alt="第三步"/> 修改项目<br/>      
      <img src="icon-4-todo.svg" width="20" alt="第四步"/> 创建你自己的应用程序<br/>
    </p>
</tldr>

让我们仔细研究一下 Kotlin Multiplatform 向导创建的示例可组合项。首先，有一个实现了通用 UI 并在所有平台上均可使用的可组合 `App()` 函数。其次，还有在每个平台上启动此 UI 的平台特定代码。

## 实现可组合函数

在 `shared/src/commonMain/kotlin/App.kt` 文件中，查看 `App()` 函数：

undefined

`App()` 函数是一个带有 `@Composable` 注解的普通 Kotlin 函数。这类函数被称为*可组合函数*或简称为*可组合项*。它们是基于 Jetpack Compose 或 Compose Multiplatform 构建 UI 的基石。

此 `App()` 函数被用作应用 UI 架构的根基，并具有以下结构：

* `MaterialTheme()` 设置应用程序的外观。默认设置可以自定义。例如，你可以选择颜色、形状和排版。
* `Column()` 可组合项控制应用程序的布局。在这里，它在 `AnimatedVisibility()` 可组合项上方显示一个 `Button`。
* `Button()` 包含用于在按钮上方呈现文本的 `Text` 可组合项。
* 调用 `AnimatedVisibility()` 用于在点击按钮时使用动画来显示和隐藏 `Image`。
* `painterResource()` 加载存储为 XML 文件的矢量图像。

`Column()` 函数的 `horizontalAlignment` 参数使其内容居中。但为了使其生效，该列应占据其容器的全部宽度。你可以通过使用 `modifier` 参数来实现。

修饰符 (Modifiers) 是 Jetpack Compose 和 Compose Multiplatform 的核心组件。它们提供了调整 UI 中可组合项外观或行为的主要机制。修饰符是使用 `Modifier` 类型的方法创建的。当你链式调用这些方法时，每次调用都会更改上一次调用返回的 `Modifier`，因此顺序非常重要。有关更多详细信息，请参阅 [Compose Multiplatform 修饰符简介](https://kotlinlang.org/docs/multiplatform/compose-layout-modifiers.html#built-in-modifiers)和详尽的 [Jetpack Compose 修饰符文档](https://developer.android.com/jetpack/compose/modifiers)。

## 管理状态

加载的图像具有持久性：除非用户点击按钮，否则它在重组 (recompositions) 过程中应始终保持显示或隐藏状态。
`App()` 可组合项中的 `showContent` 属性是使用 `mutableStateOf()` 函数构建的，这意味着它是一个可以被观察的状态对象：

```kotlin
var showContent by remember { mutableStateOf(false) }
```

该状态对象被包裹在 `remember()` 调用中，这意味着它被构建一次，随后由框架保留。通过这种方式，`showContent` 属性的值是一个包含布尔值的状态对象。框架会缓存此状态对象，允许可组合项观察它。

当状态值发生改变时，任何观察它的可组合项都会被重新调用。这允许它们生成的任何微件被重绘。这被称为*重组* (recomposition)。

唯一改变状态的地方是在 `Button()` 调用的 `onClick` 形参中。事件处理程序翻转 `showContent` 属性的值。结果，由于父级 `AnimatedVisibility()` 可组合项观察 `showContent`，图像会随着 `Greeting().greet()` 的调用而显示或隐藏。

## 在不同平台上启动 UI

`App()` 函数在每个平台上的执行方式各不相同：

* 在 Android 上，它由 activity 管理。
* 在 iOS 上，由 view controller 管理。
* 在桌面端，由窗口管理。
* 在 Web 端，由容器管理。

让我们分别研究它们。

### 在 Android 上

对于 Android，打开 `androidApp/src/main/kotlin` 中的 `MainActivity.kt` 文件：

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

这是一个名为 `MainActivity` 的 [Android activity](https://developer.android.com/guide/components/activities/intro-activities)，它调用了在通用代码中声明的 `App()` 可组合项。

### 在 iOS 上

对于 iOS，打开 `shared/src/iosMain/kotlin` 中的 `MainViewController.kt` 文件：

```kotlin
fun MainViewController() = ComposeUIViewController { App() }
```

这是一个 [view controller](https://developer.apple.com/documentation/uikit/view_controllers)，其作用与 Android 上的 activity 相同。请注意，iOS 和 Android 类型都只是简单地调用了通用代码中的 `App()` 可组合项。

### 在桌面端

对于桌面端，在 `desktopApp/src/main/kotlin` 中查找 `main.kt` 文件：

```kotlin
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "ComposeDemo"
    ) {
        App()
    }
}
```

* 在这里，`application()` 函数启动了一个新的桌面应用程序。此函数接受一个 lambda表达式，用于初始化 UI。
* 通常，在 `application()` 函数内，你会创建一个 `Window` 并指定其属性以及当窗口关闭时应执行的程序指令 (`onCloseRequest`)。在默认项目中，整个应用程序将关闭 (`::exitApplication`)。
* 在窗口内，你可以放置你的内容。与 Android 和 iOS 一样，唯一的内容就是由 `App()` 可组合项提供的 UI 布局。

在此示例中，`App()` 函数没有声明任何形参。在较大的应用程序中，你通常会将形参传递给平台特定的依赖项。这些依赖项可以手动编写，也可以使用依赖注入库传递。

### 在 Web 上

在 `webApp/src/webMain/kotlin/` 目录下的 `main.kt` 文件中，查看 `main()` 函数：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() {
    ComposeViewport {
        App()
    }
}
```

* `@OptIn(ExperimentalComposeUiApi::class)` 注解告诉编译器，你正在使用的 Compose API 被标记为实验性，并可能在未来版本中发生变化。
* `ComposeViewport{}` 函数为应用程序设置 Compose 环境。
* Web 应用被插入到作为 `ComposeViewport` 函数参数指定的容器中。
* `App()` 函数负责使用 Jetpack Compose 构建应用程序的 UI 组件。

## 下一步

在教程的下一部分中，你将向项目中添加依赖项并修改用户界面。

**[继续进行下一部分](compose-multiplatform-modify-project.md)**

## 获取帮助

* **Kotlin Slack**。获取[邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)并加入 [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) 频道。
* **Kotlin 问题跟踪器**。[报告新问题](https://youtrack.jetbrains.com/newIssue?project=KT)。