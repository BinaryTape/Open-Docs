[//]: # (title: 型別安全 HTML DSL)

[kotlinx.html 程式庫](https://www.github.com/kotlin/kotlinx.html) 提供使用靜態型別 HTML 建置器產生 DOM（文件物件模型） 元素的能力（而且除了 JavaScript 之外，它甚至可在 JVM 目標上使用！）。若要使用此程式庫，請在我們的 `build.gradle.kts` 檔案中加入對應的存儲庫與相依性：

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

加入相依性後，您便可存取用於產生 DOM（文件物件模型） 的各種介面。例如，若要渲染標題、一些文字和連結，以下程式碼片段即已足夠：

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

在瀏覽器中執行此範例時，DOM（文件物件模型） 將以直接的方式組建。使用瀏覽器的開發人員工具檢查網站的 Elements，即可輕鬆確認這一點：

![從 kotlinx.html 渲染網站](rendering-example.png){width=700}

若要進一步了解 `kotlinx.html` 程式庫，請參閱 [GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)，在那裡您可以找到關於如何[建立元素](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)（而不將其加入 DOM（文件物件模型））、[繫結至事件](https://github.com/Kotlin/kotlinx.html/wiki/Events)（如 `onClick`），以及如何將 [CSS 類別套用](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)至 HTML 元素的範例等更多資訊。