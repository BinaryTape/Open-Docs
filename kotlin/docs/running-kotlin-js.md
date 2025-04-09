---
title: "运行 Kotlin/JS"
---
由于 Kotlin/JS 项目由 Kotlin Multiplatform Gradle 插件管理，因此你可以使用相应的任务来运行你的项目。如果你从一个空白项目开始，请确保你有一些示例代码可以执行。
创建文件 `src/jsMain/kotlin/App.kt` 并用一个小的 "Hello, World" 类型的代码片段填充它：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根据目标平台的不同，可能需要一些特定于平台的额外设置才能首次运行你的代码。

## 运行 Node.js 目标

当使用 Kotlin/JS 以 Node.js 为目标时，你可以简单地执行 `jsNodeDevelopmentRun` Gradle 任务。例如，这可以通过命令行使用 Gradle 包装器来完成：

```bash
./gradlew jsNodeDevelopmentRun
```

如果你正在使用 IntelliJ IDEA，你可以在 Gradle 工具窗口中找到 `jsNodeDevelopmentRun` 操作：

<img src="/img/run-gradle-task.png" alt="Gradle Run task in IntelliJ IDEA" width="700" style={{verticalAlign: 'middle'}}/>

首次启动时，`kotlin.multiplatform` Gradle 插件将下载所有必需的依赖项，以便让你启动并运行。
构建完成后，程序将被执行，你可以在终端中看到日志输出：

<img src="/img/cli-output.png" alt="在 IntelliJ IDEA 的 Kotlin Multiplatform 项目中执行 JS 目标" width="700" style={{verticalAlign: 'middle'}}/>

## 运行浏览器目标

当以浏览器为目标时，你的项目需要有一个 HTML 页面。在你开发应用程序时，此页面将由开发服务器提供，并且应嵌入你编译后的 Kotlin/JS 文件。
创建并填充一个 HTML 文件 `/src/jsMain/resources/index.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>JS Client</title>
</head>
<body>
<script src="js-tutorial.js"></script>
</body>
</html>
```

默认情况下，你的项目生成的工件（通过 webpack 创建）的名称（需要被引用）是你的项目名称（在本例中为 `js-tutorial`）。如果你将你的项目命名为 `followAlong`，请确保嵌入 `followAlong.js` 而不是 `js-tutorial.js`。

完成这些调整后，启动集成的开发服务器。你可以通过 Gradle 包装器从命令行执行此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

当从 IntelliJ IDEA 工作时，你可以在 Gradle 工具窗口中找到 `jsBrowserDevelopmentRun` 操作。

项目构建完成后，嵌入的 `webpack-dev-server` 将开始运行，并将打开一个（看似空的）浏览器窗口，指向你之前指定的 HTML 文件。要验证你的程序是否正确运行，请打开浏览器的开发者工具（例如，右键单击并选择 _Inspect_ 操作）。
在开发者工具中，导航到控制台，在那里你可以看到执行的 JavaScript 代码的结果：

<img src="/img/browser-console-output.png" alt="浏览器开发者工具中的控制台输出" width="700" style={{verticalAlign: 'middle'}}/>

通过此设置，你可以在每次代码更改后重新编译你的项目以查看你的更改。Kotlin/JS 还支持一种更方便的方式，即在你开发应用程序时自动重建应用程序。
要了解如何设置此 _continuous mode_（持续模式），请查看 [corresponding tutorial](dev-server-continuous-compilation)（相应的教程）。