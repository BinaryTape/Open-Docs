[//]: # (title: 型別安全 HTML DSL)

[kotlinx.html 函式庫](https://www.github.com/kotlin/kotlinx.html) 提供了使用靜態型別 HTML 建構器來產生 DOM 元素的能力（除了 JavaScript，它甚至在 JVM 目標上也可用！）。要使用此函式庫，請將相應的儲存庫和依賴項加入到我們的 `build.gradle.kts` 檔案中：

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

一旦包含此依賴項，您就可以存取用於產生 DOM 的不同介面。
例如，若要渲染一個標題、一些文字和一個連結，以下程式碼片段就足夠了：

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

在瀏覽器中執行此範例時，DOM 將以直接的方式組裝。這可以透過使用瀏覽器的開發人員工具檢查網站的元素 (Elements) 輕鬆確認：

![從 kotlinx.html 渲染網站](rendering-example.png){width=700}

若要進一步了解 `kotlinx.html` 函式庫，請查看 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，您可以在其中找到更多有關如何[建立元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)而不將其加入 DOM、如何[綁定事件](https://github.com/Kotlin/kotlinx.html/wiki/Events)（例如 `onClick`），以及如何將[CSS 類別](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)套用到 HTML 元素的範例，僅舉幾例。