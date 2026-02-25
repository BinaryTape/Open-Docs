[//]: # (title: タイプセーフな HTML DSL)

[kotlinx.html ライブラリ](https://www.github.com/kotlin/kotlinx.html)は、静的に型付けされた HTML ビルダーを使用して DOM 要素を生成する機能を提供します（JavaScript に加えて、JVM ターゲットでも利用可能です！）。ライブラリを使用するには、対応するリポジトリと依存関係を `build.gradle.kts` ファイルに追加します：

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

依存関係を追加すると、DOM を生成するために提供されているさまざまなインターフェースにアクセスできるようになります。たとえば、見出し、テキスト、リンクをレンダリングするには、以下のスニペットで十分です：

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

この例をブラウザで実行すると、DOM が直感的な方法で組み立てられます。これは、ブラウザの開発者ツールを使用してウェブサイトの要素（Elements）を確認することで簡単に確認できます：

![kotlinx.html からウェブサイトをレンダリングする例](rendering-example.png){width=700}

`kotlinx.html` ライブラリの詳細については、[GitHub Wiki](https://github.com/Kotlin/kotlinx.html/wiki/Getting-started) を確認してください。そこでは、DOM に追加せずに[要素を作成する](https://github.com/Kotlin/kotlinx.html/wiki/DOM-trees)方法、`onClick` のような[イベントへのバインド](https://github.com/Kotlin/kotlinx.html/wiki/Events)、HTML 要素に [CSS クラスを適用する](https://github.com/Kotlin/kotlinx.html/wiki/Elements-CSS-classes)方法など、多くの情報を見つけることができます。