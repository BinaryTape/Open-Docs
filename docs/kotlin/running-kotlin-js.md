[//]: # (title: 运行 Kotlin/JS)

由于 Kotlin/JS 项目使用 Kotlin 多平台 Gradle 插件进行管理，因此你可以使用相应的任务来运行项目。如果你是从一个空白项目开始的，请确保已准备好一些用于执行的示例代码。
创建文件 `src/jsMain/kotlin/App.kt` 并填入一段简单的“Hello, World”类型的代码段：

```kotlin
fun main() {
    console.log("Hello, Kotlin/JS!")
}
```

根据目标平台的不同，首次运行代码可能需要一些特定于平台的额外设置。

## 运行 Node.js 目标

当使用 Kotlin/JS 以 Node.js 为目标时，你可以直接执行 `jsNodeDevelopmentRun` Gradle 任务。例如，可以通过命令行使用 Gradle 包装器来完成：

```bash
./gradlew jsNodeDevelopmentRun
```

如果你正在使用 IntelliJ IDEA，可以在 Gradle 工具窗口中找到 `jsNodeDevelopmentRun` 操作：

![IntelliJ IDEA 中的 Gradle 运行任务](run-gradle-task.png){width=700}

首次启动时，`kotlin.multiplatform` Gradle 插件将下载所有必需的依赖项以确保运行。
构建完成后，程序将执行，你可以在终端中看到日志输出：

![在 IntelliJ IDEA 的 Kotlin 多平台项目中执行 JS 目标](cli-output.png){width=700}

## 运行浏览器目标

以浏览器为目标时，你的项目需要有一个 HTML 页面。当你开发应用程序时，该页面将由开发服务器提供服务，并且应该嵌入你编译后的 Kotlin/JS 文件。
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

默认情况下，需要引用的项目生成构件（通过 webpack 创建）的名称就是你的项目名称（在本例中为 `js-tutorial`）。如果你将项目命名为 `followAlong`，请确保嵌入的是 `followAlong.js` 而不是 `js-tutorial.js`。

完成这些调整后，启动集成开发服务器。你可以通过命令行使用 Gradle 包装器来执行此操作：

```bash
./gradlew jsBrowserDevelopmentRun
```

在 IntelliJ IDEA 中工作时，你可以在 Gradle 工具窗口中找到 `jsBrowserDevelopmentRun` 操作。

项目构建完成后，嵌入的 `webpack-dev-server` 将开始运行，并打开一个（看似空白的）浏览器窗口，指向你之前指定的 HTML 文件。要验证程序是否正常运行，请打开浏览器的开发者工具（例如，通过右键点击并选择“检查”操作）。
在开发者工具中，导航到控制台，你可以在那里看到执行的 JavaScript 代码的结果：

![浏览器开发者工具中的控制台输出](browser-console-output.png){width=700}

通过这种设置，你可以在每次更改代码后重新编译项目以查看更改。Kotlin/JS 还支持一种更便捷的方式，即在开发时自动重新构建应用程序。
要了解如何设置这种“持续模式”，请查看[相应的教程](dev-server-continuous-compilation.md)。