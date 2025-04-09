---
title: "Typesafe HTML DSL"
---
[kotlinx.html 函式庫](https://www.github.com/kotlin/kotlinx.html)提供了使用靜態類型 HTML 建立器來產生 DOM 元素的能力（而且除了 JavaScript 之外，它甚至可以在 JVM 目標上使用！）。若要使用此函式庫，請將對應的儲存庫和依賴項包含到我們的 `build.gradle.kts` 檔案中：

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

一旦包含了依賴項，你就可以存取提供的不同介面來產生 DOM。
例如，要呈現標題、一些文字和一個連結，以下程式碼片段就足夠了：

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

當在瀏覽器中執行此範例時，DOM 將以直接的方式組裝。通過使用瀏覽器的開發者工具檢查網站的 Elements（元素），可以很容易地確認這一點：

<img src="/img/rendering-example.png" alt="Rendering a website from kotlinx.html" width="700" style={{verticalAlign: 'middle'}}/>

要了解更多關於 `kotlinx.html` 函式庫的資訊，請查看 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，你可以在其中找到更多關於如何[建立元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)而不將它們添加到 DOM、[綁定到事件](https://github.com/Kotlin/kotlinx.html/wiki/Events)（如 `onClick`）以及如何將 [CSS 類別套用到](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes) 你的 HTML 元素（僅舉幾例）的範例。