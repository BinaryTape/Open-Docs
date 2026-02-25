[//]: # (title: 类型安全 HTML DSL)

[kotlinx.html](https://www.github.com/kotlin/kotlinx.html)库提供了使用静态类型 HTML 构建器生成 DOM（文档对象模型）元素的能力（除了 JavaScript，它甚至还可用于 JVM 目标！）。要使用该库，请在`build.gradle.kts`文件中包含相应的仓库和依赖项：

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

包含依赖项后，您就可以访问用于生成 DOM（文档对象模型）的各种接口。例如，以下代码段足以渲染一个标题、一些文本和一个链接：

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

在浏览器中运行此示例时，DOM（文档对象模型）将以直截了当的方式组装。通过使用浏览器的开发者工具检查网站的 Elements（元素），可以轻松确认这一点：

![从 kotlinx.html 渲染网站](rendering-example.png){width=700}

要详细了解`kotlinx.html`库，请查看 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，您可以在其中找到更多信息，例如如何[创建元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)而无需将其添加到 DOM（文档对象模型）中、[绑定到事件](https://github.com/Kotlin/kotlinx.html/wiki/Events)（如 `onClick`），以及如何向 HTML 元素[应用 CSS 类](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)的示例等。