[//]: # (title: 运行 Kotlin/JS)

由于 Kotlin/JS 项目由 Kotlin Multiplatform Gradle 插件管理，因此您可以使用相应的任务运行项目。如果您从一个空白项目开始，请确保有一些示例代码可以执行。创建文件 `src/jsMain/kotlin/App.kt` 并用一个小的“Hello, World”类型代码片段填充它：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

首次运行代码时，根据目标平台的类型，可能需要一些平台特定的额外设置。

## 运行 Node.js 目标

当使用 Kotlin/JS 定位 Node.js 时，您可以简单地执行 `jsNodeDevelopmentRun` Gradle 任务。例如，可以通过命令行使用 Gradle wrapper 来完成此操作：

```bash
./gradlew jsNodeDevelopmentRun
```

如果您正在使用 IntelliJ IDEA，可以在 Gradle 工具窗口中找到 `jsNodeDevelopmentRun` 操作：

![IntelliJ IDEA 中的 Gradle 运行任务](run-gradle-task.png){width=700}

首次启动时，`kotlin.multiplatform` Gradle 插件将下载所有必需的依赖项，以便您开始运行。构建完成后，程序将被执行，您可以在终端中看到日志输出：

![在 IntelliJ IDEA 中的 Kotlin Multiplatform 项目中执行 JS 目标](cli-output.png){width=700}

## 运行浏览器目标

当定位浏览器时，您的项目需要有一个 HTML 页面。当您开发应用程序时，此页面将由开发服务器提供服务，并且应嵌入您编译后的 Kotlin/JS 文件。创建并填充 HTML 文件 `/src/jsMain/resources/index.html`：

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

默认情况下，您项目生成的需要被引用的产物 (artifact)（通过 webpack 创建）的名称是您的项目名称（在本例中为 `js-tutorial`）。如果您将项目命名为 `followAlong`，请确保嵌入 `followAlong.js` 而不是 `js-tutorial.js`。

进行这些调整后，启动集成的开发服务器。您可以通过命令行使用 Gradle wrapper 来完成此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

当在 IntelliJ IDEA 中工作时，您可以在 Gradle 工具窗口中找到 `jsBrowserDevelopmentRun` 操作。

项目构建完成后，嵌入式 `webpack-dev-server` 将开始运行，并打开一个（看似空的）浏览器窗口，指向您之前指定的 HTML 文件。为了验证您的程序是否正确运行，请打开浏览器的开发者工具（例如，右键单击并选择“检查”操作）。在开发者工具中，导航到控制台，您可以在其中看到执行的 JavaScript 代码的结果：

![浏览器开发者工具中的控制台输出](browser-console-output.png){width=700}

通过此设置，您可以在每次代码更改后重新编译项目以查看您的更改。Kotlin/JS 还支持一种更方便的方式，可以在您开发应用程序时自动重新构建。要了解如何设置此*连续模式*，请查看[相应教程](dev-server-continuous-compilation.md)。