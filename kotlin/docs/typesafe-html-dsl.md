---
title: "类型安全的 HTML DSL"
---
[kotlinx.html 库](https://www.github.com/kotlin/kotlinx.html) 提供了使用静态类型 HTML 构建器生成 DOM 元素的能力（此外，它甚至可以在 JVM 目标上使用！）。要使用该库，请将相应的仓库和依赖项添加到我们的 `build.gradle.kts` 文件中：

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

一旦包含依赖项，你就可以访问提供的不同接口来生成 DOM。例如，要渲染一个标题、一些文本和一个链接，以下代码段就足够了：

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

在浏览器中运行此示例时，DOM 将以一种直接的方式组装。通过使用浏览器的开发者工具检查网站的 Elements（元素）可以很容易地确认这一点：

<img src="/img/rendering-example.png" alt="Rendering a website from kotlinx.html" width="700" style={{verticalAlign: 'middle'}}/>

要了解更多关于 `kotlinx.html` 库的信息，请查看 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，在那里你可以找到更多关于如何在不将元素添加到 DOM 的情况下 [创建元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)、[绑定到事件](https://github.com/Kotlin/kotlinx.html/wiki/Events) （如 `onClick`）以及如何将 [CSS 类](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) 应用到你的 HTML 元素等示例。