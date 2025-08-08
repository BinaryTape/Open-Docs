[//]: # (title: 运行 Kotlin/JS)

由于 Kotlin/JS 项目由 Kotlin Multiplatform Gradle 插件管理，因此您可以使用相应的任务来运行项目。如果您正在从一个空白项目开始，请确保您有一些示例代码可供执行。
创建文件 `src/jsMain/kotlin/App.kt` 并用一个小的“Hello, World”类型的代码片段填充它：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根据目标平台的不同，首次运行代码可能需要一些平台特有的额外设置。

## 运行 Node.js 目标平台

当使用 Kotlin/JS 针对 Node.js 时，您只需执行 `jsNodeDevelopmentRun` Gradle 任务。例如，这可以通过命令行使用 Gradle wrapper 来完成：

```bash
./gradlew jsNodeDevelopmentRun
```

如果您正在使用 IntelliJ IDEA，可以在 Gradle 工具窗口中找到 `jsNodeDevelopmentRun` 操作：

![IntelliJ IDEA 中的 Gradle 运行任务](run-gradle-task.png){width=700}

首次启动时，`kotlin.multiplatform` Gradle 插件将下载所有必要的依赖项，以便让您正常运行。
构建完成后，程序将执行，您可以在终端中看到日志输出：

![在 IntelliJ IDEA 中执行 Kotlin Multiplatform 项目中的 JS 目标平台](cli-output.png){width=700}

## 运行浏览器目标平台

当针对浏览器时，您的项目需要一个 HTML 页面。在您开发应用程序时，该页面将由开发服务器提供服务，并且应该嵌入您的已编译 Kotlin/JS 文件。
创建并填充 HTML 文件 `/src/jsMain/resources/index.html`：

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

默认情况下，您项目生成的 artifact（通过 webpack 创建）需要被引用的名称是您的项目名称（在本例中为 `js-tutorial`）。如果您将项目命名为 `followAlong`，请确保嵌入 `followAlong.js` 而不是 `js-tutorial.js`。

进行这些调整后，启动集成开发服务器。您可以通过命令行使用 Gradle wrapper 来完成此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

当在 IntelliJ IDEA 中工作时，您可以在 Gradle 工具窗口中找到 `jsBrowserDevelopmentRun` 操作。

项目构建完成后，嵌入式 `webpack-dev-server` 将开始运行，并会打开一个（看起来是空的）浏览器窗口，指向您之前指定的 HTML 文件。为了验证您的程序是否正常运行，请打开浏览器的开发者工具（例如通过右键点击并选择 _Inspect_ 操作）。
在开发者工具内部，导航到控制台，您可以在其中看到已执行 JavaScript 代码的结果：

![浏览器开发者工具中的控制台输出](browser-console-output.png){width=700}

通过此设置，您可以在每次代码更改后重新编译项目以查看您的更改。Kotlin/JS 还支持一种更便捷的方式，即在您开发应用程序时自动重建它。
要了解如何设置此“_持续模式_”，请查看[相应教程](dev-server-continuous-compilation.md)。