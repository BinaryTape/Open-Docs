[//]: # (title: タイプセーフなHTML DSL)

[kotlinx.htmlライブラリ](https://www.github.com/kotlin/kotlinx.html)は、静的型付けされたHTMLビルダーを使用してDOM要素を生成する機能を提供します (JavaScriptだけでなく、JVMターゲットでも利用可能です！)。このライブラリを使用するには、対応するリポジトリと依存関係を`build.gradle.kts`ファイルに追加します。

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

依存関係が追加されると、DOMを生成するために提供されるさまざまなインターフェースにアクセスできるようになります。例えば、見出し、テキスト、リンクをレンダリングするには、以下のスニペットで十分です。

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

この例をブラウザで実行すると、DOMは単純な方法で組み立てられます。これは、ブラウザの開発者ツールを使用してウェブサイトのElements (要素) を確認することで簡単に確認できます。

![kotlinx.htmlからウェブサイトをレンダリングする](rendering-example.png){width=700}

`kotlinx.html`ライブラリについてさらに学ぶには、[GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started)を参照してください。そこでは、DOMに要素を追加せずに[要素を作成する](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)方法、`onClick`のような[イベントへのバインド](https://github.com/Kotlin/kotlinx.html/wiki/Events)、HTML要素に[CSSクラスを適用する](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)方法など、いくつかの例を挙げると、詳細情報を見つけることができます。