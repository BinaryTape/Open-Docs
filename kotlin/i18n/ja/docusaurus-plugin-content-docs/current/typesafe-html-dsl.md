---
title: "Typesafe HTML DSL"
---
[kotlinx.html ライブラリ](https://www.github.com/kotlin/kotlinx.html)は、静的に型付けされたHTMLビルダーを使用してDOM要素を生成する機能を提供します（JavaScriptの他に、JVMターゲットでも利用できます！）。ライブラリを使用するには、対応するリポジトリと依存関係を`build.gradle.kts`ファイルに含めます。

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

依存関係が含まれると、DOMを生成するために提供されるさまざまなインターフェースにアクセスできます。
見出し、テキスト、およびリンクをレンダリングするには、たとえば、次のスニペットで十分です。

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

この例をブラウザで実行すると、DOMは簡単な方法で組み立てられます。これは、ブラウザの開発者ツールを使用してWebサイトの要素を確認することで簡単に確認できます。

<img src="/img/rendering-example.png" alt="Rendering a website from kotlinx.html" width="700" style={{verticalAlign: 'middle'}}/>

`kotlinx.html`ライブラリの詳細については、[GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)を確認してください。ここでは、DOMに追加せずに[要素を作成](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)する方法、`onClick`などの[イベントへのバインド](https://github.com/Kotlin/kotlinx.html/wiki/Events)方法、HTML要素に[CSSクラスを適用](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)する方法などの詳細情報を確認できます。