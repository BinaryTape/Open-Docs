[//]: # (title: 型安全なHTML DSL)

[kotlinx.htmlライブラリ](https://www.github.com/kotlin/kotlinx.html)は、静的型付けされたHTMLビルダーを使用してDOM要素を生成する機能を提供します（JavaScriptだけでなく、JVMターゲットでも利用可能です！）。このライブラリを使用するには、対応するリポジトリと依存関係を`build.gradle.kts`ファイルに追加します。

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

依存関係が追加されると、DOMを生成するために提供されるさまざまなインターフェースにアクセスできるようになります。たとえば、見出し、いくつかのテキスト、およびリンクをレンダリングするには、次のスニペットで十分です。

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

この例をブラウザで実行すると、DOMは直接的に組み立てられます。これは、ブラウザの開発者ツールを使用してウェブサイトの「Elements」を確認することで、簡単に確認できます。

![kotlinx.htmlからウェブサイトをレンダリング](rendering-example.png){width=700}

kotlinx.htmlライブラリについてさらに学ぶには、[GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)をご覧ください。そこでは、DOMに追加せずに[要素を作成する](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)方法、`onClick`などの[イベントにバインドする](https://github.com/Kotlin/kotlinx.html/wiki/Events)方法、そしてHTML要素に[CSSクラスを適用する](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)方法の例など、ごく一部ですがさらに多くの情報を見つけることができます。