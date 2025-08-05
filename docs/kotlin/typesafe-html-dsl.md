[//]: # (title: 类型安全的 HTML DSL)

[kotlinx.html 库](https://www.github.com/kotlin/kotlinx.html) 提供了使用静态类型的 HTML 构建器生成 DOM 元素的能力（除了 JavaScript，它甚至可以在 JVM 目标平台使用！）。要使用此库，请在我们的 `build.gradle.kts` 文件中包含相应的仓库和依赖项：

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

一旦包含该依赖项，您就可以访问所提供的不同接口来生成 DOM。要渲染一个标题、一些文本和一个链接，例如，以下代码片段就足够了：

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

当在浏览器中运行此示例时，DOM 将以直接了当的方式被组装。通过使用浏览器的开发者工具检测网站的元素，可以轻松证实这一点：

![Rendering a website from kotlinx.html](rendering-example.png){width=700}

要了解更多关于 `kotlinx.html` 库的信息，请查阅 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，您可以在其中找到更多关于如何 [创建元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees) 而不将其添加到 DOM、[绑定到事件](https://github.com/Kotlin/kotlinx.html/wiki/Events)（例如 `onClick`），以及如何将 [CSS 类应用于](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) HTML 元素的示例，这只是其中的一小部分。