[//]: # (title: 类型安全的 HTML DSL)

[kotlinx.html 库](https://www.github.com/kotlin/kotlinx.html) 提供了使用静态类型的 HTML 构建器生成 DOM 元素的能力（除了 JavaScript，它甚至在 JVM 目标上也可用！）。要使用该库，请将相应的仓库和依赖项添加到我们的 `build.gradle.kts` 文件中：

```kotlin
repositories {
    // ...
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-js"))
    implementation("org.jetbrains.kotlinx:kotlinx-html-js:0.8.0")
    // ...
}
```

一旦包含该依赖项，您就可以访问为生成 DOM 提供的不同接口。例如，要渲染一个标题、一些文本和一个链接，以下代码片段就足够了：

```kotlin
import kotlinx.browser.*
import kotlinx.html.*
import kotlinx.html.dom.*

fun main() {
    document.body!!.append.div {
        h1 {
            +"Welcome to Kotlin/JS!"
        }
        p {
            +"Fancy joining this year's "
            a("https://kotlinconf.com/") {
                +"KotlinConf"
            }
            +"?"
        }
    }
}
```

在浏览器中运行此示例时，DOM 将以一种直接的方式组装。这可以通过使用浏览器的开发者工具检查网站的元素来轻松确认：

![从 kotlinx.html 渲染的网站](rendering-example.png){width=700}

要了解更多关于 `kotlinx.html` 库的信息，请查阅 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，您可以在其中找到更多关于如何 [创建元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees) 而无需将其添加到 DOM 的信息，以及如何 [绑定事件](https://github.com/Kotlin/kotlinx.html/wiki/Events) 例如 `onClick`，以及如何将 [CSS 类](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) 应用到 HTML 元素的示例，这只是其中的一小部分。