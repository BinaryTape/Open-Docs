[//]: # (title: ReactとKotlin/JSでWebアプリケーションを構築する — チュートリアル)

<no-index/>

このチュートリアルでは、Kotlin/JSと[React](https://reactjs.org/)フレームワークを使用してブラウザアプリケーションを構築する方法を説明します。学習内容は次のとおりです。

*   一般的なReactアプリケーションの構築に関連するタスクを完了します。
*   [KotlinのDSL](type-safe-builders.md)が、可読性を損なうことなく、概念を簡潔かつ統一的に表現するためにどのように使用できるかを探り、フル機能のアプリケーションを完全にKotlinで記述できるようにします。
*   既製のnpmコンポーネントの使用方法、外部ライブラリの使用方法、および最終アプリケーションの公開方法を学びます。

出力されるのは、[KotlinConf](https://kotlinconf.com/)イベント専用の_KotlinConf Explorer_ Webアプリで、カンファレンストークへのリンクが含まれます。ユーザーはすべてのトークを1ページで視聴し、既読または未読としてマークできます。

このチュートリアルは、Kotlinの事前知識と、HTMLおよびCSSの基本的な知識があることを前提としています。Reactの基本的な概念を理解していると、いくつかのサンプルコードの理解に役立つかもしれませんが、厳密には必須ではありません。

> 最終的なアプリケーションは[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)から入手できます。
>
{style="note"}

## 開始する前に

1.  最新バージョンの[IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)をダウンロードしてインストールします。
2.  [プロジェクトテンプレート](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle)をクローンし、IntelliJ IDEAで開きます。このテンプレートには、必要なすべての構成と依存関係を含む基本的なKotlin Multiplatform Gradleプロジェクトが含まれています。

    *   `build.gradle.kts`ファイル内の依存関係とタスク:

    ```kotlin
    dependencies {
        // React, React DOM + Wrappers
        implementation(enforcedPlatform("org.jetbrains.kotlin-wrappers:kotlin-wrappers-bom:1.0.0-pre.430"))
        implementation("org.jetbrains.kotlin-wrappers:kotlin-react")
        implementation("org.jetbrains.kotlin-wrappers:kotlin-react-dom")

        // Kotlin React Emotion (CSS)
        implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")

        // Video Player
        implementation(npm("react-player", "2.12.0"))

        // Share Buttons
        implementation(npm("react-share", "4.4.1"))

        // Coroutines & serialization
        implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
    }
    ```

    *   `src/jsMain/resources/index.html`にあるHTMLテンプレートページ。このチュートリアルで使用するJavaScriptコードを挿入するためのものです。

    ```html
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Hello, Kotlin/JS!</title>
    </head>
    <body>
        <div id="root"></div>
        <script src="confexplorer.js"></script>
    </body>
    </html>
    ```
    {validate="false"}

    Kotlin/JSプロジェクトは、ビルド時にすべてのコードとその依存関係がプロジェクトと同じ名前の単一のJavaScriptファイル（`confexplorer.js`）に自動的にバンドルされます。典型的な[JavaScriptの慣習](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)として、スクリプトの前にブラウザがすべてのページ要素をロードすることを保証するために、bodyのコンテンツ（`root` divを含む）が最初にロードされます。

*   `src/jsMain/kotlin/Main.kt`内のコードスニペット:

    ```kotlin
    import kotlinx.browser.document

    fun main() {
        document.bgColor = "red"
    }
    ```

### 開発サーバーを実行する

デフォルトでは、Kotlin Multiplatform Gradleプラグインには組み込みの`webpack-dev-server`のサポートが付属しており、手動でサーバーを設定することなくIDEからアプリケーションを実行できます。

プログラムがブラウザで正常に実行されることをテストするには、IntelliJ IDEA内のGradleツールウィンドウから`run`または`browserDevelopmentRun`タスク（`other`または`kotlin browser`ディレクトリで利用可能）を呼び出して開発サーバーを起動します。

![Gradle tasks list](browser-development-run.png){width=700}

ターミナルからプログラムを実行するには、代わりに`./gradlew run`を使用します。

プロジェクトがコンパイルされバンドルされると、ブラウザウィンドウに空の赤いページが表示されます。

![Blank red page](red-page.png){width=700}

### ホットリロード / 連続モードを有効にする

変更を加えるたびにプロジェクトを手動でコンパイルして実行する必要がないように、_[連続コンパイル](dev-server-continuous-compilation.md)_モードを設定します。続行する前に、実行中のすべての開発サーバーインスタンスを停止してください。

1.  IntelliJ IDEAがGradleの`run`タスクを初めて実行した後に自動的に生成する実行構成を編集します。

    ![Edit a run configuration](edit-configurations-continuous.png){width=700}

2.  **Run/Debug Configurations**ダイアログで、`--continuous`オプションを実行構成の引数に追加します。

    ![Enable continuous mode](continuous-mode.png){width=700}

    変更を適用した後、IntelliJ IDEA内の**Run**ボタンを使用して開発サーバーを再度起動できます。ターミナルから連続Gradleビルドを実行するには、代わりに`./gradlew run --continuous`を使用します。

3.  この機能をテストするには、Gradleタスクが実行中に`Main.kt`ファイルでページの色を青に変更します。

    ```kotlin
    document.bgColor = "blue"
    ```

    するとプロジェクトが再コンパイルされ、リロード後、ブラウザページは新しい色になります。

開発プロセス中、開発サーバーを連続モードで実行し続けることができます。変更を加えると、自動的にページをリビルドしてリロードします。

> プロジェクトのこの状態は、`master`ブランチの[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)で見つけることができます。
>
{style="note"}

## Webアプリのドラフトを作成する

### Reactで最初の静的ページを追加する

アプリに簡単なメッセージを表示させるには、`Main.kt`ファイルのコードを次のように置き換えます。

```kotlin
import kotlinx.browser.document
import react.*
import emotion.react.css
import csstype.Position
import csstype.px
import react.dom.html.ReactHTML.h1
import react.dom.html.ReactHTML.h3
import react.dom.html.ReactHTML.div
import react.dom.html.ReactHTML.p
import react.dom.html.ReactHTML.img
import react.dom.client.createRoot
import kotlinx.serialization.Serializable

fun main() {
    val container = document.getElementById("root") ?: error("Couldn't find root container!")
    createRoot(container).render(Fragment.create {
        h1 {
            +"Hello, React+Kotlin/JS!"
        }
    })
}
```
{validate="false"}

*   `render()`関数は、[kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom)に、[フラグメント](https://reactjs.org/docs/fragments.html)内の最初のHTML要素を`root`要素にレンダリングするように指示します。この要素は、テンプレートに含まれていた`src/jsMain/resources/index.html`で定義されたコンテナです。
*   コンテンツは`<h1>`ヘッダーであり、タイプセーフなDSLを使用してHTMLをレンダリングします。
*   `h1`はラムダパラメータを取る関数です。文字列リテラルの前に`+`記号を追加すると、[演算子オーバーロード](operator-overloading.md)を使用して`unaryPlus()`関数が実際に呼び出されます。これにより、文字列が囲まれたHTML要素に追加されます。

プロジェクトが再コンパイルされると、ブラウザにこのHTMLページが表示されます。

![An HTML page example](hello-react-js.png){width=700}

### HTMLをKotlinのタイプセーフなHTML DSLに変換する

React用のKotlinの[ラッパー](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md)には、純粋なKotlinコードでHTMLを記述できるようにする[ドメイン固有言語（DSL）](type-safe-builders.md)が付属しています。このように、JavaScriptの[JSX](https://reactjs.org/docs/introducing-jsx.html)に似ています。ただし、このマークアップがKotlinであるため、オートコンプリートや型チェックなど、静的型付け言語のすべてのメリットが得られます。

将来のWebアプリの従来のHTMLコードとKotlinのタイプセーフなバリアントを比較してください。

<tabs>
<tab title="HTML">

```html
<h1>KotlinConf Explorer</h1>
<div>
    <h3>Videos to watch</h3>
    <p>John Doe: Building and breaking things</p>
    <p>Jane Smith: The development process</p>
    <p>Matt Miller: The Web 7.0</p>
    <h3>Videos watched</h3>
    <p>Tom Jerry: Mouseless development</p>
</div>
<div>
    <h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder">
</div>
```

</tab>
<tab title="Kotlin">

```kotlin
h1 {
    +"KotlinConf Explorer"
}
div {
    h3 {
        +"Videos to watch"
    }
    p {
        + "John Doe: Building and breaking things"
    }
    p {
        +"Jane Smith: The development process"
    }
    p {
        +"Matt Miller: The Web 7.0"
    }
    h3 {
        +"Videos watched"
    }
    p {
        +"Tom Jerry: Mouseless development"
    }
}
div {
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
       src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"
    }
}
```

</tab>
</tabs>

Kotlinコードをコピーし、`main()`関数内の`Fragment.create()`関数呼び出しを更新して、以前の`h1`タグを置き換えます。

ブラウザがリロードされるのを待ちます。ページは次のようになるはずです。

![The web app draft](website-draft.png){width=700}

### マークアップでKotlinコンストラクトを使用して動画を追加する

このDSLを使用してKotlinでHTMLを記述することにはいくつかの利点があります。ループ、条件、コレクション、文字列補間など、通常のKotlinコンストラクトを使用してアプリを操作できます。

ハードコードされた動画リストをKotlinオブジェクトのリストに置き換えることができます。

1.  `Main.kt`に、すべての動画属性を1か所に保持するための`Video`[データクラス](data-classes.md)を作成します。

    ```kotlin
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

2.  未視聴の動画と視聴済みの動画の2つのリストをそれぞれ作成します。これらの宣言を`Main.kt`のファイルレベルに追加します。

    ```kotlin
    val unwatchedVideos = listOf(
        Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
        Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
        Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
    )

    val watchedVideos = listOf(
        Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
    )
    ```

3.  これらの動画をページで使用するには、未視聴の`Video`オブジェクトのコレクションを反復処理するためのKotlinの`for`ループを記述します。「Videos to watch」の下にある3つの`p`タグを次のスニペットに置き換えます。

    ```kotlin
    for (video in unwatchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

4.  「Videos watched」に続く単一のタグのコードも同様に修正します。

    ```kotlin
    for (video in watchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

ブラウザがリロードされるのを待ちます。レイアウトは以前と同じままであるはずです。ループが機能していることを確認するために、リストにさらに動画を追加できます。

### タイプセーフなCSSでスタイルを追加する

[Emotion](https://emotion.sh/docs/introduction)ライブラリ用の[kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/)ラッパーは、CSS属性（動的なものも含む）をJavaScriptと共にHTMLと並行して指定できるようにします。概念的には、これは[CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js)に似ていますが、Kotlin向けです。DSLを使用する利点は、Kotlinコードコンストラクトを使用して書式設定ルールを表現できることです。

このチュートリアルのテンプレートプロジェクトには、すでに`kotlin-emotion`を使用するために必要な依存関係が含まれています。

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

`kotlin-emotion`を使用すると、HTML要素`div`と`h3`内に`css`ブロックを指定でき、そこでスタイルを定義できます。

動画プレイヤーをページの右上隅に移動するには、CSSを使用して動画プレイヤー（スニペットの最後の`div`）のコードを調整します。

```kotlin
div {
    css {
        position = Position.absolute
        top = 10.px
        right = 10.px
    }
    h3 {
        +"John Doe: Building and breaking things"
    }
    img {
        src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
    }
}
```

他のスタイルも自由に試してみてください。たとえば、`fontFamily`を変更したり、UIに`color`を追加したりできます。

## アプリコンポーネントを設計する

Reactの基本的な構成要素は_[コンポーネント](https://reactjs.org/docs/components-and-props.html)_と呼ばれます。コンポーネント自体は、他のより小さなコンポーネントで構成することもできます。コンポーネントを組み合わせることで、アプリケーションを構築します。コンポーネントを汎用性と再利用性を持たせるように構造化すると、コードやロジックを重複させることなく、アプリの複数の部分でそれらを使用できるようになります。

`render()`関数の内容は通常、基本的なコンポーネントを記述します。現在のアプリケーションのレイアウトは次のようになっています。

![Current layout](current-layout.png){width=700}

アプリケーションを個々のコンポーネントに分解すると、各コンポーネントがその責任を処理する、より構造化されたレイアウトになります。

![Structured layout with components](structured-layout.png){width=700}

コンポーネントは特定の機能をカプセル化します。コンポーネントを使用すると、ソースコードが短くなり、読みやすく理解しやすくなります。

### メインコンポーネントを追加する

アプリケーションの構造の作成を開始するには、まず`root`要素へのレンダリング用のメインコンポーネントである`App`を明示的に指定します。

1.  `src/jsMain/kotlin`フォルダーに新しい`App.kt`ファイルを作成します。
2.  このファイル内に、次のスニペットを追加し、`Main.kt`からタイプセーフなHTMLをその中に移動します。

    ```kotlin
    import kotlinx.coroutines.async
    import react.*
    import react.dom.*
    import kotlinx.browser.window
    import kotlinx.coroutines.*
    import kotlinx.serialization.decodeFromString
    import kotlinx.serialization.json.Json
    import emotion.react.css
    import csstype.Position
    import csstype.px
    import react.dom.html.ReactHTML.h1
    import react.dom.html.ReactHTML.h3
    import react.dom.html.ReactHTML.div
    import react.dom.html.ReactHTML.p
    import react.dom.html.ReactHTML.img

    val App = FC<Props> {
        // typesafe HTML goes here, starting with the first h1 tag!
    }
    ```

    `FC`関数は[関数コンポーネント](https://reactjs.org/docs/components-and-props.html#function-and-class-components)を作成します。

3.  `Main.kt`ファイルで、`main()`関数を次のように更新します。

    ```kotlin
    fun main() {
        val container = document.getElementById("root") ?: error("Couldn't find root container!")
        createRoot(container).render(App.create())
    }
    ```

    これで、プログラムは`App`コンポーネントのインスタンスを作成し、それを指定されたコンテナにレンダリングします。

Reactの概念に関する詳細情報については、[ドキュメントとガイド](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)を参照してください。

### リストコンポーネントを抽出する

`watchedVideos`リストと`unwatchedVideos`リストはそれぞれ動画のリストを含むため、単一の再利用可能なコンポーネントを作成し、リストに表示されるコンテンツのみを調整することが理にかなっています。

`VideoList`コンポーネントは`App`コンポーネントと同じパターンに従います。`FC`ビルダー関数を使用し、`unwatchedVideos`リストのコードを含んでいます。

1.  `src/jsMain/kotlin`フォルダーに新しい`VideoList.kt`ファイルを作成し、次のコードを追加します。

    ```kotlin
    import kotlinx.browser.window
    import react.*
    import react.dom.*
    import react.dom.html.ReactHTML.p

    val VideoList = FC<Props> {
        for (video in unwatchedVideos) {
            p {
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

2.  `App.kt`で、パラメータなしで呼び出すことにより`VideoList`コンポーネントを使用します。

    ```kotlin
    // . . .

    div {
        h3 {
            +"Videos to watch"
        }
        VideoList()

        h3 {
            +"Videos watched"
        }
        VideoList()
    }

    // . . .
    ```

    現時点では、`App`コンポーネントは`VideoList`コンポーネントによって表示されるコンテンツを制御できません。これはハードコードされているため、同じリストが2回表示されます。

### コンポーネント間でデータを渡すためのpropsを追加する

`VideoList`コンポーネントを再利用するため、異なるコンテンツで埋めることができる必要があります。項目のリストを属性としてコンポーネントに渡す機能を追加できます。Reactでは、これらの属性は_props_と呼ばれます。コンポーネントのpropsがReactで変更されると、フレームワークはコンポーネントを自動的に再レンダリングします。

`VideoList`には、表示する動画のリストを含むpropが必要です。`VideoList`コンポーネントに渡せるすべてのpropsを保持するインターフェースを定義します。

1.  `VideoList.kt`ファイルに次の定義を追加します。

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
    }
    ```
    `external`[修飾子](js-interop.md#external-modifier)は、インターフェースの実装が外部で提供されることをコンパイラに伝えるため、コンパイラは宣言からJavaScriptコードを生成しようとしません。

2.  `VideoList`のクラス定義を調整し、`FC`ブロックにパラメータとして渡されるpropsを利用するようにします。

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        for (video in props.videos) {
            p {
                key = video.id.toString()
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

    `key`属性は、`props.videos`の値が変更されたときにReactレンダラーが何をすべきかを理解するのに役立ちます。キーを使用して、リストのどの部分を更新する必要があるか、どの部分が同じままであるかを決定します。リストとキーに関する詳細情報については、[Reactガイド](https://reactjs.org/docs/lists-and-keys.html)を参照してください。

3.  `App`コンポーネントで、子コンポーネントが適切な属性でインスタンス化されていることを確認します。`App.kt`で、`h3`要素の下にある2つのループを、`unwatchedVideos`および`watchedVideos`の属性を伴う`VideoList`の呼び出しに置き換えます。
    Kotlin DSLでは、`VideoList`コンポーネントに属するブロック内でそれらを割り当てます。

    ```kotlin
    h3 {
        +"Videos to watch"
    }
    VideoList {
        videos = unwatchedVideos
    }
    h3 {
        +"Videos watched"
    }
    VideoList {
        videos = watchedVideos
    }
    ```

リロード後、ブラウザはリストが正しくレンダリングされていることを表示します。

### リストをインタラクティブにする

まず、ユーザーがリストエントリをクリックしたときにポップアップするアラートメッセージを追加します。`VideoList.kt`に、現在の動画でアラートをトリガーする`onClick`ハンドラ関数を追加します。

```kotlin
// . . .

p {
    key = video.id.toString()
    onClick = {
        window.alert("Clicked $video!")
    }
    +"${video.speaker}: ${video.title}"
}

// . . .
```

ブラウザウィンドウのリスト項目をクリックすると、次のようなアラートウィンドウで動画に関する情報が得られます。

![Browser alert window](alert-window.png){width=700}

> `onClick`関数をラムダとして直接定義するのは簡潔であり、プロトタイピングに非常に役立ちます。ただし、Kotlin/JSで等価性が[現在機能する](https://youtrack.jetbrains.com/issue/KT-15101)方法のため、パフォーマンス的にはクリックハンドラを渡すための最も最適化された方法ではありません。レンダリングパフォーマンスを最適化したい場合は、関数を変数に格納して渡すことを検討してください。
>
{style="tip"}

### 値を保持するための状態を追加する

ユーザーにアラートを出すだけでなく、選択した動画を▶三角形でハイライト表示する機能を追加できます。そのためには、このコンポーネント固有の_状態_を導入します。

状態はReactのコア概念の1つです。モダンなReact（いわゆる_Hooks API_を使用する）では、状態は[`useState`フック](https://reactjs.org/docs/hooks-state.html)を使用して表現されます。

1.  `VideoList`宣言の先頭に次のコードを追加します。

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        var selectedVideo: Video? by useState(null)

    // . . .
    ```
    {validate="false"}

    *   `VideoList`関数コンポーネントは状態（現在の関数呼び出しとは独立した値）を保持します。状態はnull許容で、`Video?`型です。デフォルト値は`null`です。
    *   Reactの`useState()`関数は、フレームワークに、関数の複数回の呼び出しにわたって状態を追跡するように指示します。たとえば、デフォルト値を指定しても、Reactはデフォルト値が最初にのみ割り当てられることを保証します。状態が変更されると、コンポーネントは新しい状態に基づいて再レンダリングされます。
    *   `by`キーワードは、`useState()`が[委譲プロパティ](delegated-properties.md)として機能することを示します。他の変数と同様に、値を読み書きします。`useState()`の背後にある実装は、状態を機能させるために必要な機構を処理します。

    State Hookに関する詳細については、[Reactドキュメント](https://reactjs.org/docs/hooks-state.html)を参照してください。

2.  `VideoList`コンポーネントの`onClick`ハンドラとテキストを次のように変更します。

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        var selectedVideo: Video? by useState(null)
        for (video in props.videos) {
            p {
                key = video.id.toString()
                onClick = {
                    selectedVideo = video
                }
                if (video == selectedVideo) {
                    +"▶ "
                }
                +"${video.speaker}: ${video.title}"
            }
        }
    }
    ```

    *   ユーザーが動画をクリックすると、その値が`selectedVideo`変数に割り当てられます。
    *   選択したリストエントリがレンダリングされると、三角形が前に追加されます。

    状態管理に関する詳細については、[React FAQ](https://reactjs.org/docs/faq-state.html)を参照してください。

ブラウザを確認し、リストの項目をクリックしてすべてが正しく機能していることを確認します。

## コンポーネントを構成する

現在、2つの動画リストは独自に機能しており、各リストは選択された動画を追跡しています。ユーザーは、未視聴リストと視聴済みリストでそれぞれ1つずつ、2つの動画を選択できます。プレイヤーは1つしかないにもかかわらずです。

![Two videos are selected in both lists simultaneously](two-videos-select.png){width=700}

リストは、それ自体の中と、兄弟リストの両方でどの動画が選択されているかを追跡できません。理由は、選択された動画が_リスト_の状態の一部ではなく、_アプリケーション_の状態の一部であるためです。これは、個々のコンポーネントから状態を_持ち上げる_必要があることを意味します。

### 状態を持ち上げる (ステートのリフトアップ)

Reactは、propsが親コンポーネントから子コンポーネントにのみ渡されることを保証します。これにより、コンポーネントがハードワイヤードされるのを防ぎます。

コンポーネントが兄弟コンポーネントの状態を変更したい場合、親を介してそうする必要があります。その時点で、状態は子コンポーネントのいずれにも属さなくなり、全体的な親コンポーネントに属するようになります。

コンポーネントから親への状態の移行プロセスは_状態のリフトアップ_と呼ばれます。アプリの場合、`App`コンポーネントに`currentVideo`を状態として追加します。

1.  `App.kt`の`App`コンポーネントの定義の先頭に次を追加します。

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)

        // . . .
    }
    ```

    `VideoList`コンポーネントはもはや状態を追跡する必要がありません。代わりに、現在の動画をpropとして受け取ります。

2.  `VideoList.kt`の`useState()`呼び出しを削除します。
3.  `VideoList`コンポーネントが選択された動画をpropとして受け取れるように準備します。そのためには、`VideoListProps`インターフェースを拡張して`selectedVideo`を含めます。

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
        var selectedVideo: Video?
    }
    ```

4.  三角形の条件を`state`の代わりに`props`を使用するように変更します。

    ```kotlin
    if (video == props.selectedVideo) {
        +"▶ "
    }
    ```

### ハンドラを渡す

現時点では、propに値を割り当てる方法がないため、`onClick`関数は現在の設定では機能しません。親コンポーネントの状態を変更するには、状態を再度持ち上げる必要があります。

Reactでは、状態は常に親から子へと流れます。そのため、子コンポーネントの1つから_アプリケーション_状態を変更するには、ユーザーインタラクションを処理するロジックを親コンポーネントに移動し、そのロジックをpropとして渡す必要があります。Kotlinでは、変数が[関数の型](lambdas.md#function-types)を持つことができることを忘れないでください。

1.  `VideoListProps`インターフェースを再度拡張し、`Video`を受け取り`Unit`を返す関数である変数`onSelectVideo`を含むようにします。

    ```kotlin
    external interface VideoListProps : Props {
        // ...
        var onSelectVideo: (Video) -> Unit
    }
    ```

2.  `VideoList`コンポーネントで、`onClick`ハンドラに新しいpropを使用します。

    ```kotlin
    onClick = {
        props.onSelectVideo(video)
    }
    ```

    これで、`VideoList`コンポーネントから`selectedVideo`変数を削除できます。

3.  `App`コンポーネントに戻り、2つの動画リストそれぞれに`selectedVideo`と`onSelectVideo`のハンドラを渡します。

    ```kotlin
    VideoList {
        videos = unwatchedVideos // and watchedVideos respectively
        selectedVideo = currentVideo
        onSelectVideo = { video ->
            currentVideo = video
        }
    }
    ```

4.  視聴済みの動画リストについても前のステップを繰り返します。

ブラウザに戻り、動画を選択したときに、選択が重複することなく2つのリスト間を移動することを確認してください。

## その他のコンポーネントを追加する

### 動画プレイヤーコンポーネントを抽出する

現在プレースホルダー画像である、別の自己完結型コンポーネントである動画プレイヤーを作成できます。動画プレイヤーは、トークのタイトル、トークの著者、および動画へのリンクを知る必要があります。この情報は各`Video`オブジェクトにすでに含まれているため、propとして渡し、その属性にアクセスできます。

1.  新しい`VideoPlayer.kt`ファイルを作成し、`VideoPlayer`コンポーネントの次の実装を追加します。

    ```kotlin
    import csstype.*
    import react.*
    import emotion.react.css
    import react.dom.html.ReactHTML.button
    import react.dom.html.ReactHTML.div
    import react.dom.html.ReactHTML.h3
    import react.dom.html.ReactHTML.img

    external interface VideoPlayerProps : Props {
        var video: Video
    }

    val VideoPlayer = FC<VideoPlayerProps> { props ->
        div {
            css {
                position = Position.absolute
                top = 10.px
                right = 10.px
            }
            h3 {
                +"${props.video.speaker}: ${props.video.title}"
            }
            img {
                src = "https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"              
            }
        }
    }
    ```

2.  `VideoPlayerProps`インターフェースが`VideoPlayer`コンポーネントがnull許容ではない`Video`を取ることを指定しているため、`App`コンポーネントでこれを適切に処理するようにしてください。

    `App.kt`で、動画プレイヤーの以前の`div`スニペットを次のように置き換えます。

    ```kotlin
    currentVideo?.let { curr ->
        VideoPlayer {
            video = curr
        }
    }
    ```

    [`let`スコープ関数](scope-functions.md#let)は、`VideoPlayer`コンポーネントが`state.currentVideo`がnullでない場合にのみ追加されることを保証します。

これで、リストのエントリをクリックすると、動画プレイヤーが表示され、クリックしたエントリからの情報が入力されます。

### ボタンを追加して接続する

ユーザーが動画を視聴済みまたは未視聴としてマークし、2つのリスト間で移動できるようにするには、`VideoPlayer`コンポーネントにボタンを追加します。

このボタンは2つの異なるリスト間で動画を移動するため、状態変更を処理するロジックを`VideoPlayer`から_持ち上げ_、親からpropとして渡す必要があります。動画が視聴済みかどうかに応じて、ボタンは異なる外観になるべきです。これもpropとして渡す必要がある情報です。

1.  `VideoPlayer.kt`の`VideoPlayerProps`インターフェースを拡張して、これら2つのケースのプロパティを含めます。

    ```kotlin
    external interface VideoPlayerProps : Props {
        var video: Video
        var onWatchedButtonPressed: (Video) -> Unit
        var unwatchedVideo: Boolean
    }
    ```

2.  これで、実際のコンポーネントにボタンを追加できます。次のスニペットを`VideoPlayer`コンポーネントの本文、`h3`タグと`img`タグの間にコピーします。

    ```kotlin
    button {
        css {
            display = Display.block
            backgroundColor = if (props.unwatchedVideo) NamedColor.lightgreen else NamedColor.red
        }
        onClick = {
            props.onWatchedButtonPressed(props.video)
        }
        if (props.unwatchedVideo) {
            +"Mark as watched"
        } else {
            +"Mark as unwatched"
        }
    }
    ```

    スタイルを動的に変更できるKotlin CSS DSLの助けを借りて、基本的なKotlin `if`式を使用してボタンの色を変更できます。

### 動画リストをアプリケーション状態に移動する

次に、`App`コンポーネントの`VideoPlayer`使用箇所を調整します。ボタンがクリックされると、動画は未視聴リストから視聴済みリストに、またはその逆に移動されるべきです。これらのリストは実際に変更できるようになったため、それらをアプリケーション状態に移動します。

1.  `App.kt`の`App`コンポーネントの先頭に、`useState()`呼び出しを含む次のプロパティを追加します。

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)
        var unwatchedVideos: List<Video> by useState(listOf(
            Video(1, "Opening Keynote", "Andrey Breslav", "https://youtu.be/PsaFVLr8t4E"),
            Video(2, "Dissecting the stdlib", "Huyen Tue Dao", "https://youtu.be/Fzt_9I733Yg"),
            Video(3, "Kotlin and Spring Boot", "Nicolas Frankel", "https://youtu.be/pSiZVAeReeg")
        ))
        var watchedVideos: List<Video> by useState(listOf(
            Video(4, "Creating Internal DSLs in Kotlin", "Venkat Subramaniam", "https://youtu.be/JzTeAM8N1-o")
        ))

        // . . .
    }
    ```

2.  すべてのデモデータが`watchedVideos`と`unwatchedVideos`のデフォルト値に直接含まれているため、ファイルレベルの宣言はもはや必要ありません。`Main.kt`で、`watchedVideos`と`unwatchedVideos`の宣言を削除します。
3.  動画プレイヤーに属する`App`コンポーネントの`VideoPlayer`の呼び出し箇所を次のように変更します。

    ```kotlin
    VideoPlayer {
        video = curr
        unwatchedVideo = curr in unwatchedVideos
        onWatchedButtonPressed = {
            if (video in unwatchedVideos) {
                unwatchedVideos = unwatchedVideos - video
                watchedVideos = watchedVideos + video
            } else {
                watchedVideos = watchedVideos - video
                unwatchedVideos = unwatchedVideos + video
            }
        }
    }
    ```

ブラウザに戻り、動画を選択し、ボタンを数回押して、動画が2つのリスト間を移動することを確認してください。

## npmからパッケージを使用する

アプリを使用可能にするために、実際に動画を再生する動画プレイヤーと、コンテンツを共有するのに役立ついくつかのボタンがまだ必要です。

Reactには、このような機能を自分で構築する代わりに使用できる、既製のコンポーネントが豊富に揃ったエコシステムがあります。

### 動画プレイヤーコンポーネントを追加する

プレースホルダーの動画コンポーネントを実際のYouTubeプレイヤーに置き換えるには、npmの`react-player`パッケージを使用します。これは動画を再生でき、プレイヤーの外観を制御できます。

コンポーネントのドキュメントとAPIの説明については、GitHubの[README](https://www.npmjs.com/package/react-player)を参照してください。

1.  `build.gradle.kts`ファイルを確認します。`react-player`パッケージはすでに含まれているはずです。

    ```kotlin
    dependencies {
        // ...
        // Video Player
        implementation(npm("react-player", "2.12.0"))
        // ...
    }
    ```

    ご覧のとおり、npmの依存関係は、ビルドファイルの`dependencies`ブロックで`npm()`関数を使用してKotlin/JSプロジェクトに追加できます。Gradleプラグインは、Yarnパッケージマネージャーの独自のバンドルされたインストールを使用して、これらの依存関係のダウンロードとインストールを処理します。

2.  Reactアプリケーション内からJavaScriptパッケージを使用するには、[外部宣言](js-interop.md)を提供することで、Kotlinコンパイラに何を期待するかを伝える必要があります。

    新しい`ReactYouTube.kt`ファイルを作成し、次のコンテンツを追加します。

    ```kotlin
    @file:JsModule("react-player")
    @file:JsNonModule

    import react.*

    @JsName("default")
    external val ReactPlayer: ComponentClass<dynamic>
    ```

    コンパイラが`ReactPlayer`のような外部宣言を認識すると、対応するクラスの実装が依存関係によって提供されると仮定し、そのためのコードを生成しません。

    最後の2行は、`require("react-player").default;`のようなJavaScriptのimportと同等です。これらは、コンポーネントが実行時に`ComponentClass<dynamic>`に準拠することが確実であることをコンパイラに伝えます。

ただし、この構成では、`ReactPlayer`が受け入れるpropsのジェネリック型が`dynamic`に設定されています。これは、コンパイラが任意のコードを受け入れることを意味し、実行時に問題を引き起こすリスクがあります。

より良い代替案は、どのようなプロパティがこの外部コンポーネントのpropsに属するかを指定する`external interface`を作成することです。コンポーネントの[README](https://www.npmjs.com/package/react-player)でpropsのインターフェースについて学ぶことができます。この場合、`url`と`controls`のpropsを使用します。

1.  `dynamic`を外部インターフェースに置き換えることで、`ReactYouTube.kt`の内容を調整します。

    ```kotlin
    @file:JsModule("react-player")
    @file:JsNonModule

    import react.*

    @JsName("default")
    external val ReactPlayer: ComponentClass<ReactPlayerProps>

    external interface ReactPlayerProps : Props {
        var url: String
        var controls: Boolean
    }
    ```

2.  これで、新しい`ReactPlayer`を使用して、`VideoPlayer`コンポーネントの灰色のプレースホルダーの長方形を置き換えることができます。`VideoPlayer.kt`で、`img`タグを次のスニペットに置き換えます。

    ```kotlin
    ReactPlayer {
        url = props.video.videoUrl
        controls = true
    }
    ```

### ソーシャルシェアボタンを追加する

アプリケーションのコンテンツを共有する簡単な方法は、メッセンジャーやメール用のソーシャルシェアボタンを用意することです。これにも既製のReactコンポーネメント、たとえば[react-share](https://github.com/nygardk/react-share/blob/master/README.md)を使用できます。

1.  `build.gradle.kts`ファイルを確認します。このnpmライブラリはすでに含まれているはずです。

    ```kotlin
    dependencies {
        // ...
        // Share Buttons
        implementation(npm("react-share", "4.4.1"))
        // ...
    }
    ```

2.  Kotlinから`react-share`を使用するには、さらに基本的な外部宣言を記述する必要があります。GitHubの[例](https://github.com/nygardk/react-share/blob/master/demo/Demo.tsx#L61)を見ると、シェアボタンが2つのReactコンポーネント、たとえば`EmailShareButton`と`EmailIcon`で構成されていることがわかります。異なる種類のシェアボタンとアイコンはすべて同じ種類のインターフェースを持ちます。
    動画プレイヤーですでに行ったのと同じ方法で、各コンポーネントの外部宣言を作成します。

    新しい`ReactShare.kt`ファイルに次のコードを追加します。

    ```kotlin
    @file:JsModule("react-share")
    @file:JsNonModule

    import react.ComponentClass
    import react.Props

    @JsName("EmailIcon")
    external val EmailIcon: ComponentClass<IconProps>

    @JsName("EmailShareButton")
    external val EmailShareButton: ComponentClass<ShareButtonProps>

    @JsName("TelegramIcon")
    external val TelegramIcon: ComponentClass<IconProps>

    @JsName("TelegramShareButton")
    external val TelegramShareButton: ComponentClass<ShareButtonProps>

    external interface ShareButtonProps : Props {
        var url: String
    }

    external interface IconProps : Props {
        var size: Int
        var round: Boolean
    }
    ```

3.  アプリケーションのユーザーインターフェースに新しいコンポーネントを追加します。`VideoPlayer.kt`で、`ReactPlayer`の使用直前の`div`に2つのシェアボタンを追加します。

    ```kotlin
    // . . .

    div {
        css {
             position = Position.absolute
             top = 10.px
             right = 10.px
         }
        EmailShareButton {
            url = props.video.videoUrl
            EmailIcon {
                size = 32
                round = true
            }
        }
        TelegramShareButton {
            url = props.video.videoUrl
            TelegramIcon {
                size = 32
                round = true
            }
        }
    }

    // . . .
    ```

これでブラウザを確認し、ボタンが実際に機能するかどうかを確認できます。ボタンをクリックすると、動画のURLを含む_共有ウィンドウ_が表示されるはずです。ボタンが表示されない、または機能しない場合は、広告ブロッカーやソーシャルメディアブロッカーを無効にする必要があるかもしれません。

![Share window](social-buttons.png){width=700}

[react-share](https://github.com/nygardk/react-share/blob/master/README.md#features)で利用可能な他のソーシャルネットワーク用のシェアボタンについても、このステップを自由に繰り返してください。

## 外部REST APIを使用する

これで、アプリでハードコードされたデモデータを実際のREST APIからのデータに置き換えることができます。

このチュートリアルでは、[小さなAPI](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1)があります。これは単一のエンドポイント`videos`のみを提供し、リストから要素にアクセスするための数値パラメータを取ります。ブラウザでAPIにアクセスすると、APIから返されるオブジェクトが`Video`オブジェクトと同じ構造を持っていることがわかります。

### KotlinからJS機能を使用する

ブラウザにはすでに多種多様な[Web API](https://developer.mozilla.org/en-US/docs/Web/API)が付属しています。Kotlin/JSにはこれらのAPIのラッパーがすぐに使用できる状態で含まれているため、Kotlin/JSからそれらを使用することもできます。一例は、HTTPリクエストを行うために使用される[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)です。

最初の潜在的な問題は、`fetch()`のようなブラウザAPIが非ブロッキング操作を実行するために[コールバック](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)を使用することです。複数のコールバックを連続して実行する必要がある場合、それらをネストする必要があります。当然、コードは深くインデントされ、機能のピースが次々と積み重ねられていき、読みにくくなります。

これを克服するために、Kotlinのコルーチンを使用できます。これは、このような機能に対するより良いアプローチです。

2番目の問題は、JavaScriptの動的型付けの性質から生じます。外部APIから返されるデータの型に関する保証はありません。これを解決するには、`kotlinx.serialization`ライブラリを使用できます。

`build.gradle.kts`ファイルを確認します。関連するスニペットはすでに存在するはずです。

```kotlin
dependencies {
    // . . .

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
}
```

### シリアライゼーションを追加する

外部APIを呼び出すと、JSON形式のテキストが返ってきます。これはまだKotlinオブジェクトに変換されて扱えるようにする必要があります。

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)は、JSON文字列からKotlinオブジェクトへのこれらの種類の変換を記述することを可能にするライブラリです。

1.  `build.gradle.kts`ファイルを確認します。対応するスニペットはすでに存在するはずです。

    ```kotlin
    plugins {
        // . . .
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }

    dependencies {
        // . . .

        // Serialization
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.5.0")
    }
    ```

2.  最初の動画をフェッチする準備として、シリアライゼーションライブラリに`Video`クラスについて伝える必要があります。`Main.kt`で、その定義に`@Serializable`アノテーションを追加します。

    ```kotlin
    @Serializable
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

### 動画をフェッチする

APIから動画をフェッチするには、`App.kt`（または新しいファイル）に次の関数を追加します。

```kotlin
suspend fun fetchVideo(id: Int): Video {
    val response = window
        .fetch("https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/$id")
        .await()
        .text()
        .await()
    return Json.decodeFromString(response)
}
```

*   _停止関数_ `fetch()`は、指定された`id`を持つ動画をAPIからフェッチします。この応答には時間がかかる場合があるため、結果を`await()`します。次に、コールバックを使用する`text()`が応答からボディを読み取ります。その後、その完了を`await()`します。
*   関数の値を返す前に、`kotlinx.coroutines`の関数である`Json.decodeFromString`に渡します。これは、リクエストから受信したJSONテキストを適切なフィールドを持つKotlinオブジェクトに変換します。
*   `window.fetch`関数呼び出しは`Promise`オブジェクトを返します。通常は、`Promise`が解決され、結果が利用可能になったときに呼び出されるコールバックハンドラを定義する必要があります。しかし、コルーチンでは、それらのPromiseを`await()`できます。`await()`のような関数が呼び出されるたびに、メソッドはその実行を停止（中断）します。`Promise`が解決できるようになると、その実行が再開されます。

ユーザーに動画の選択肢を提供するために、上記の同じAPIから25本の動画をフェッチする`fetchVideos()`関数を定義します。すべてのリクエストを同時に実行するには、Kotlinのコルーチンによって提供される[`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)機能を使用します。

1.  `App.kt`に次の実装を追加します。

    ```kotlin
    suspend fun fetchVideos(): List<Video> = coroutineScope {
        (1..25).map { id ->
            async {
                fetchVideo(id)
            }
        }.awaitAll()
    }
    ```

    [構造化並行処理](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency)の原則に従い、実装は`coroutineScope`でラップされます。その後、25個の非同期タスク（リクエストごとに1つ）を開始し、それらすべてが完了するのを待つことができます。

2.  これで、アプリケーションにデータを追加できます。`mainScope`の定義を追加し、`App`コンポーネントが次のスニペットで始まるように変更します。デモ値を`emptyLists`インスタンスに置き換えるのも忘れないでください。

    ```kotlin
    val mainScope = MainScope()

    val App = FC<Props> {
        var currentVideo: Video? by useState(null)
        var unwatchedVideos: List<Video> by useState(emptyList())
        var watchedVideos: List<Video> by useState(emptyList())

        useEffectOnce {
            mainScope.launch {
                unwatchedVideos = fetchVideos()
            }
        }

    // . . .
    ```
    {validate="false"}

    *   [`MainScope()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html)はKotlinの構造化並行処理モデルの一部であり、非同期タスクが実行されるスコープを作成します。
    *   `useEffectOnce`は別のReact_フック_（具体的には、[`useEffect`](https://reactjs.org/docs/hooks-effect.html)フックの簡略化されたバージョン）です。コンポーネントが_副作用_を実行することを示します。自身をレンダリングするだけでなく、ネットワーク経由で通信も行います。

ブラウザを確認します。アプリケーションは実際のデータを表示するはずです。

![Fetched data from API](website-api-data.png){width=700}

ページをロードすると:

*   `App`コンポーネントのコードが呼び出されます。これにより、`useEffectOnce`ブロック内のコードが開始されます。
*   `App`コンポーネントは、視聴済みおよび未視聴の動画の空のリストでレンダリングされます。
*   APIリクエストが完了すると、`useEffectOnce`ブロックがそれを`App`コンポーネントの状態に割り当てます。これにより、再レンダリングがトリガーされます。
*   `App`コンポーネントのコードが再度呼び出されますが、`useEffectOnce`ブロックは2回目は実行_されません_。

コルーチンがどのように機能するかについて詳細な理解を得たい場合は、[コルーチンに関するこのチュートリアル](coroutines-and-channels.md)を確認してください。

## プロダクションおよびクラウドにデプロイする

アプリケーションをクラウドに公開し、他の人々がアクセスできるようにする時が来ました。

### プロダクションビルドをパッケージ化する

すべての資産をプロダクションモードでパッケージ化するには、IntelliJ IDEAのツールウィンドウを介して、または`./gradlew build`を実行して、Gradleの`build`タスクを実行します。これにより、DCE（デッドコード削除）などのさまざまな改善を適用して、最適化されたプロジェクトビルドが生成されます。

ビルドが完了すると、デプロイに必要なすべてのファイルが`/build/dist`に見つかります。これには、JavaScriptファイル、HTMLファイル、およびアプリケーションを実行するために必要なその他のリソースが含まれます。これらを静的HTTPサーバーに配置したり、GitHub Pagesを使用して提供したり、選択したクラウドプロバイダーでホストしたりできます。

### Herokuにデプロイする

Herokuを使用すると、独自のドメインで到達可能なアプリケーションを簡単に起動できます。彼らの無料枠は開発目的には十分であるはずです。

1.  [アカウントを作成](https://signup.heroku.com/)します。
2.  [CLIクライアントをインストールして認証](https://devcenter.heroku.com/articles/heroku-cli)します。
3.  プロジェクトルートにいる間にターミナルで次のコマンドを実行して、Gitリポジトリを作成し、Herokuアプリをアタッチします。

    ```bash
    git init
    heroku create
    git add .
    git commit -m "initial commit"
    ```

4.  Herokuで実行される通常のJVMアプリケーション（KtorやSpring Bootで記述されたものなど）とは異なり、アプリは静的HTMLページとJavaScriptファイルを生成するため、それに応じて提供される必要があります。プログラムを適切に提供するために必要なビルドパックを調整できます。

    ```bash
    heroku buildpacks:set heroku/gradle
    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
    ```

5.  `heroku/gradle`ビルドパックが適切に実行されるようにするには、`stage`タスクが`build.gradle.kts`ファイルにある必要があります。このタスクは`build`タスクと同等であり、対応するエイリアスはファイルの最後にすでに含まれています。

    ```kotlin
    // Heroku Deployment
    tasks.register("stage") {
        dependsOn("build")
    }
    ```

6.  `buildpack-static`を設定するために、プロジェクトルートに新しい`static.json`ファイルを追加します。
7.  ファイル内に`root`プロパティを追加します。

    ```xml
    {
        "root": "build/distributions"
    }
    ```
    {validate="false"}

8.  これで、たとえば次のコマンドを実行してデプロイをトリガーできます。

    ```bash
    git add -A
    git commit -m "add stage task and static content root configuration"
    git push heroku master
    ```

> メインではないブランチからプッシュしている場合は、たとえば`git push heroku feature-branch:main`のように、`main`リモートにプッシュするようにコマンドを調整してください。
>
{style="tip"}

デプロイが成功すると、インターネット上でアプリケーションにアクセスするために人々が使用できるURLが表示されます。

![Web app deployment to production](deployment-to-production.png){width=700}

> プロジェクトのこの状態は、`finished`ブランチの[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)で見つけることができます。
>
{style="note"}

## 次にすること

### その他の機能を追加する {initial-collapse-state="collapsed" collapsible="true"}

結果として得られるアプリを出発点として、React、Kotlin/JSなどのより高度なトピックを探求できます。

*   **検索**。たとえば、タイトルや著者でトークのリストをフィルターするための検索フィールドを追加できます。Reactで[HTMLフォーム要素がどのように機能するか](https://reactjs.org/docs/forms.html)について学びましょう。
*   **永続化**。現在、アプリケーションはページがリロードされるたびに視聴者のウォッチリストを追跡できなくなります。[Ktor](https://ktor.io/)などのKotlinで利用可能なWebフレームワークのいずれかを使用して、独自のバックエンドを構築することを検討してください。または、[クライアントに情報を保存する方法](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)を調べてください。
*   **複雑なAPI**。多くのデータセットとAPIが利用可能です。あらゆる種類のデータをアプリケーションに取り込むことができます。たとえば、[猫の写真のビジュアライザー](https://thecatapi.com/)や、[ロイヤリティフリーのストックフォトAPI](https://unsplash.com/developers)を構築できます。

### スタイルを改善する: レスポンシブネスとグリッド {initial-collapse-state="collapsed" collapsible="true"}

アプリケーションのデザインはまだ非常にシンプルで、モバイルデバイスや狭いウィンドウでは見栄えが悪いでしょう。CSS DSLをさらに探求して、アプリをよりアクセスしやすくしましょう。

### コミュニティに参加して助けを得る {initial-collapse-state="collapsed" collapsible="true"}

問題を報告し、助けを得るための最良の方法は、[kotlin-wrappers課題トラッカー](https://github.com/JetBrains/kotlin-wrappers/issues)です。問題のチケットが見つからない場合は、自由に新しいものを提出してください。公式の[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)に参加することもできます。そこには`#javascript`と`#react`のチャンネルがあります。

### コルーチンについて詳しく学ぶ {initial-collapse-state="collapsed" collapsible="true"}

同時実行コードをどのように記述できるかについてもっと知りたい場合は、[コルーチンに関するチュートリアル](coroutines-and-channels.md)を確認してください。

### Reactについて詳しく学ぶ {initial-collapse-state="collapsed" collapsible="true"}

基本的なReactの概念とそれがKotlinにどのように変換されるかを知ったので、[Reactのドキュメント](https://react.dev/learn)に概説されている他の概念をKotlinに変換できます。