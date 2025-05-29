[//]: # (title: ReactとKotlin/JSでWebアプリケーションを構築する — チュートリアル)

<no-index/>

このチュートリアルでは、Kotlin/JSと[React](https://reactjs.org/)フレームワークを使ってブラウザアプリケーションを構築する方法を学びます。具体的には以下の内容を行います。

*   一般的なReactアプリケーションの構築に関連するタスクを完了する。
*   [KotlinのDSL](type-safe-builders.md)が、簡潔かつ統一的に概念を表現しつつ可読性を損なわないようにどのように利用できるかを探求し、完全にKotlinで本格的なアプリケーションを記述できるようにする。
*   既製のnpmコンポーネントの使用方法、外部ライブラリの使用方法、および最終アプリケーションの公開方法を学ぶ。

成果物として、[KotlinConf](https://kotlinconf.com/)イベントに特化した_KotlinConf Explorer_ウェブアプリが作成され、カンファレンストークへのリンクが含まれます。ユーザーはすべてのトークを1つのページで視聴し、視聴済みまたは未視聴としてマークすることができます。

このチュートリアルは、Kotlinの事前知識とHTMLおよびCSSの基本的な知識があることを前提としています。Reactの基本的な概念を理解していると、一部のサンプルコードの理解に役立つかもしれませんが、厳密には必須ではありません。

> 最終アプリケーションは[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)から入手できます。
>
{style="note"}

## 開始する前に

1.  [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)の最新バージョンをダウンロードしてインストールします。
2.  [プロジェクトテンプレート](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle)をクローンし、IntelliJ IDEAで開きます。このテンプレートには、必要なすべての構成と依存関係が含まれた基本的なKotlin Multiplatform Gradleプロジェクトが含まれています。

    *   `build.gradle.kts`ファイルの依存関係とタスク:

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

    *   このチュートリアルで使用するJavaScriptコードを挿入するための、`src/jsMain/resources/index.html`にあるHTMLテンプレートページ:

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

    Kotlin/JSプロジェクトは、ビルド時にすべてのコードとその依存関係を、プロジェクトと同じ名前である`confexplorer.js`という単一のJavaScriptファイルに自動的にバンドルします。一般的な[JavaScriptの慣習](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)として、ブラウザがスクリプトの前にすべてのページ要素を読み込むことを保証するために、ボディの内容（`root` divを含む）が最初にロードされます。

*   `src/jsMain/kotlin/Main.kt`にあるコードスニペット:

    ```kotlin
    import kotlinx.browser.document

    fun main() {
        document.bgColor = "red"
    }
    ```

### 開発サーバーを起動する

デフォルトでは、Kotlin Multiplatform Gradleプラグインには組み込みの`webpack-dev-server`のサポートが含まれており、手動でサーバーを設定することなくIDEからアプリケーションを実行できます。

プログラムがブラウザで正常に実行されることをテストするには、IntelliJ IDEA内のGradleツールウィンドウから`run`または`browserDevelopmentRun`タスク（`other`または`kotlin browser`ディレクトリで利用可能）を呼び出して開発サーバーを起動します。

![Gradle tasks list](browser-development-run.png){width=700}

ターミナルからプログラムを実行するには、代わりに`./gradlew run`を使用します。

プロジェクトがコンパイルされバンドルされると、ブラウザウィンドウに赤い空白のページが表示されます。

![Blank red page](red-page.png){width=700}

### ホットリロード / 連続モードを有効にする

変更を加えるたびに手動でプロジェクトをコンパイルおよび実行する必要がないように、_[連続コンパイル](dev-server-continuous-compilation.md)_モードを設定します。続行する前に、実行中の開発サーバーインスタンスをすべて停止していることを確認してください。

1.  Gradleの`run`タスクを初めて実行した後にIntelliJ IDEAが自動生成する実行構成を編集します:

    ![Edit a run configuration](edit-configurations-continuous.png){width=700}

2.  **Run/Debug Configurations**ダイアログで、実行構成の引数に`--continuous`オプションを追加します:

    ![Enable continuous mode](continuous-mode.png){width=700}

    変更を適用した後、IntelliJ IDEA内の**Run**ボタンを使用して開発サーバーを再起動できます。ターミナルから連続Gradleビルドを実行するには、代わりに`./gradlew run --continuous`を使用します。

3.  この機能をテストするには、Gradleタスクの実行中に`Main.kt`ファイルのページの色を青に変更します:

    ```kotlin
    document.bgColor = "blue"
    ```

    するとプロジェクトが再コンパイルされ、リロード後にブラウザページが新しい色になります。

開発プロセス中は、開発サーバーを連続モードで実行したままにできます。変更を加えると、自動的にページが再ビルドおよびリロードされます。

> この状態のプロジェクトは、`master`ブランチの[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)で確認できます。
>
{style="note"}

## ウェブアプリのドラフトを作成する

### Reactで最初の静的ページを追加する

アプリで簡単なメッセージを表示するには、`Main.kt`ファイルのコードを以下に置き換えます。

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

*   `render()`関数は、[kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom)に、[フラグメント](https://reactjs.org/docs/fragments.html)内の最初のHTML要素を`root`要素にレンダリングするよう指示します。この要素は、テンプレートに含まれていた`src/jsMain/resources/index.html`で定義されているコンテナです。
*   内容は`<h1>`ヘッダーで、型安全なDSLを使用してHTMLをレンダリングします。
*   `h1`はラムダパラメータを取る関数です。文字列リテラルの前に`+`記号を追加すると、実際には[演算子オーバーロード](operator-overloading.md)を使用して`unaryPlus()`関数が呼び出されます。これは、文字列を囲まれたHTML要素に追加します。

プロジェクトが再コンパイルされると、ブラウザはこのHTMLページを表示します。

![An HTML page example](hello-react-js.png){width=700}

### HTMLをKotlinの型安全なHTML DSLに変換する

React用のKotlinの[ラッパー](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README.md)には、純粋なKotlinコードでHTMLを記述することを可能にする[ドメイン固有言語 (DSL)](type-safe-builders.md)が付属しています。この点では、JavaScriptの[JSX](https://reactjs.org/docs/introducing-jsx.html)に似ています。しかし、このマークアップがKotlinであるため、オートコンプリートや型チェックなど、静的型付け言語のすべての利点が得られます。

将来のウェブアプリの従来のHTMLコードと、Kotlinでの型安全なバリアントを比較します。

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

### マークアップでKotlinのコンストラクトを使用して動画を追加する

このDSLを使用してKotlinでHTMLを記述することにはいくつかの利点があります。ループ、条件、コレクション、文字列補間など、通常のKotlinのコンストラクトを使用してアプリを操作できます。

これで、ハードコードされた動画リストをKotlinオブジェクトのリストに置き換えることができます。

1.  `Main.kt`に、すべての動画属性を1か所にまとめるための`Video` [データクラス](data-classes.md)を作成します:

    ```kotlin
    data class Video(
        val id: Int,
        val title: String,
        val speaker: String,
        val videoUrl: String
    )
    ```

2.  未視聴動画と視聴済み動画の2つのリストをそれぞれ作成します。これらの宣言を`Main.kt`のファイルレベルに追加します:

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

3.  これらの動画をページで使用するには、Kotlinの`for`ループを記述して未視聴の`Video`オブジェクトのコレクションを反復処理します。「視聴する動画」の下にある3つの`p`タグを次のスニペットに置き換えます:

    ```kotlin
    for (video in unwatchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

4.  「視聴済み動画」に続く単一のタグのコードを修正するために、同じプロセスを適用します。

    ```kotlin
    for (video in watchedVideos) {
        p {
            +"${video.speaker}: ${video.title}"
        }
    }
    ```

ブラウザがリロードされるのを待ちます。レイアウトは以前と同じままのはずです。ループが機能していることを確認するために、リストにさらに動画を追加できます。

### 型安全なCSSでスタイルを追加する

[Emotion](https://emotion.sh/docs/introduction)ライブラリ用の[kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/)ラッパーは、CSS属性（動的なものも含む）をJavaScriptとHTMLのすぐ隣で指定することを可能にします。概念的には、これは[CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js)に似ていますが、Kotlin向けです。DSLを使用する利点は、Kotlinコードのコンストラクトを使用して書式設定ルールを表現できることです。

このチュートリアルのテンプレートプロジェクトには、`kotlin-emotion`を使用するために必要な依存関係がすでに含まれています。

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

`kotlin-emotion`を使用すると、HTML要素`div`と`h3`内に`css`ブロックを指定し、そこでスタイルを定義できます。

動画プレーヤーをページ右上の角に移動するには、CSSを使用して動画プレーヤーのコード（スニペットの最後の`div`）を調整します。

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

Reactの基本的な構成要素は_[コンポーネント](https://reactjs.org/docs/components-and-props.html)_と呼ばれます。コンポーネント自体も、他のより小さなコンポーネントで構成できます。コンポーネントを組み合わせることで、アプリケーションを構築します。コンポーネントを汎用的で再利用可能なように構造化すれば、コードやロジックを重複させることなく、アプリの複数の部分でそれらを使用できるようになります。

`render()`関数の内容は、一般的に基本的なコンポーネントを記述します。現在のアプリケーションのレイアウトは次のようになっています。

![Current layout](current-layout.png){width=700}

アプリケーションを個々のコンポーネントに分解すると、各コンポーネントがそれぞれの責務を処理する、より構造化されたレイアウトになります。

![Structured layout with components](structured-layout.png){width=700}

コンポーネントは特定の機能をカプセル化します。コンポーネントを使用すると、ソースコードが短くなり、読み書きが容易になります。

### メインコンポーネントを追加する

アプリケーションの構造の作成を開始するには、まず`root`要素へのレンダリングのためのメインコンポーネントである`App`を明示的に指定します。

1.  `src/jsMain/kotlin`フォルダに新しい`App.kt`ファイルを作成します。
2.  このファイル内に次のスニペットを追加し、`Main.kt`から型安全なHTMLをそこへ移動します:

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

    `FC`関数は、[関数コンポーネント](https://reactjs.org/docs/components-and-props.html#function-and-class-components)を作成します。

3.  `Main.kt`ファイルで、`main()`関数を次のように更新します:

    ```kotlin
    fun main() {
        val container = document.getElementById("root") ?: error("Couldn't find root container!")
        createRoot(container).render(App.create())
    }
    ```

    これでプログラムは`App`コンポーネントのインスタンスを作成し、指定されたコンテナにレンダリングします。

Reactの概念の詳細については、[ドキュメントとガイド](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)を参照してください。

### リストコンポーネントを抽出する

`watchedVideos`と`unwatchedVideos`の各リストが動画のリストを含んでいるため、単一の再利用可能なコンポーネントを作成し、リストに表示される内容だけを調整するのは理にかなっています。

`VideoList`コンポーネントは`App`コンポーネントと同じパターンに従います。`FC`ビルダー関数を使用し、`unwatchedVideos`リストのコードを含んでいます。

1.  `src/jsMain/kotlin`フォルダに新しい`VideoList.kt`ファイルを作成し、以下のコードを追加します:

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

2.  `App.kt`で、`VideoList`コンポーネントをパラメータなしで呼び出して使用します:

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

    今のところ、`App`コンポーネントは`VideoList`コンポーネントによって表示されるコンテンツを制御できません。これはハードコードされているため、同じリストが2回表示されます。

### コンポーネント間でデータを渡すためにpropsを追加する

`VideoList`コンポーネントを再利用するため、異なるコンテンツで埋められるようにする必要があります。アイテムのリストをコンポーネントへの属性として渡す機能を追加できます。Reactでは、これらの属性は_props_と呼ばれます。コンポーネントのpropsがReactで変更されると、フレームワークは自動的にコンポーネントを再レンダリングします。

`VideoList`の場合、表示する動画のリストを含むpropsが必要になります。`VideoList`コンポーネントに渡すことができるすべてのpropsを保持するインターフェースを定義します。

1.  `VideoList.kt`ファイルに以下の定義を追加します:

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
    }
    ```
    [external](js-interop.md#external-modifier)修飾子は、インターフェースの実装が外部で提供されることをコンパイラに伝え、宣言からJavaScriptコードを生成しようとしないようにします。

2.  `VideoList`のクラス定義を調整し、`FC`ブロックにパラメータとして渡されるpropsを使用するようにします:

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

    `key`属性は、Reactレンダラーが`props.videos`の値が変更されたときに何をすべきかを判断するのに役立ちます。キーを使用して、リストのどの部分を更新する必要があり、どれが同じままであるかを決定します。リストとキーの詳細については、[Reactガイド](https://reactjs.org/docs/lists-and-keys.html)を参照してください。

3.  `App`コンポーネントで、子コンポーネントが適切な属性でインスタンス化されていることを確認します。`App.kt`で、`h3`要素の下にある2つのループを、`unwatchedVideos`と`watchedVideos`の属性を持つ`VideoList`の呼び出しに置き換えます。Kotlin DSLでは、`VideoList`コンポーネントに属するブロック内でそれらを割り当てます:

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

リロード後、ブラウザはリストが正しくレンダリングされることを示します。

### リストをインタラクティブにする

まず、ユーザーがリストのエントリをクリックしたときにポップアップするアラートメッセージを追加します。`VideoList.kt`で、現在の動画を含むアラートをトリガーする`onClick`ハンドラー関数を追加します。

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

ブラウザウィンドウのリストアイテムのいずれかをクリックすると、次のようなアラートウィンドウで動画に関する情報が表示されます。

![Browser alert window](alert-window.png){width=700}

> ラムダとして直接`onClick`関数を定義するのは簡潔でプロトタイプ作成に非常に便利です。しかし、Kotlin/JSでの等価性の[現在の動作](https://youtrack.jetbrains.com/issue/KT-15101)のため、パフォーマンスの観点からは、クリックハンドラーを渡す最も最適化された方法ではありません。レンダリングパフォーマンスを最適化したい場合は、関数を変数に格納して渡すことを検討してください。
>
{style="tip"}

### 値を保持するための状態を追加する

ユーザーにアラートを出すだけでなく、選択された動画を▶︎の三角形で強調表示する機能を追加できます。そのためには、このコンポーネントに固有の_状態_を導入します。

状態はReactのコア概念の1つです。現代のReact（いわゆる_Hooks API_を使用）では、状態は[`useState`フック](https://reactjs.org/docs/hooks-state.html)を使用して表現されます。

1.  `VideoList`宣言の先頭に以下のコードを追加します:

    ```kotlin
    val VideoList = FC<VideoListProps> { props ->
        var selectedVideo: Video? by useState(null)

    // . . .
    ```
    {validate="false"}

    *   `VideoList`関数コンポーネントは状態（現在の関数呼び出しとは独立した値）を保持します。状態はnull許容で、`Video?`型を持ちます。そのデフォルト値は`null`です。
    *   Reactの`useState()`関数は、関数の複数の呼び出しにわたって状態を追跡するようフレームワークに指示します。たとえば、デフォルト値を指定しても、Reactはデフォルト値が最初にのみ割り当てられることを保証します。状態が変化すると、コンポーネントは新しい状態に基づいて再レンダリングされます。
    *   `by`キーワードは、`useState()`が[委譲プロパティ](delegated-properties.md)として機能することを示します。他の変数と同様に、値を読み書きします。`useState()`の背後にある実装は、状態を機能させるために必要な機構を処理します。

    State Hookについてさらに詳しく知るには、[Reactドキュメント](https://reactjs.org/docs/hooks-state.html)を参照してください。

2.  `onClick`ハンドラーと`VideoList`コンポーネントのテキストを次のように変更します:

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
    *   選択されたリストエントリがレンダリングされると、三角形が先頭に追加されます。

    状態管理の詳細については、[React FAQ](https://reactjs.org/docs/faq-state.html)を参照してください。

ブラウザを確認し、リスト内の項目をクリックしてすべてが正しく機能していることを確認します。

## コンポーネントを構成する

現在、2つの動画リストはそれぞれ独立して機能しており、各リストが選択された動画を追跡しています。プレイヤーが1つしかないにもかかわらず、ユーザーは未視聴リストと視聴済みリストの両方からそれぞれ1つずつ、合計2つの動画を選択できます。

![Two videos are selected in both lists simultaneously](two-videos-select.png){width=700}

リストは、自身の中と、兄弟リストの中の両方でどの動画が選択されているかを追跡することはできません。その理由は、選択された動画が_リスト_の状態ではなく、_アプリケーション_の状態の一部であるためです。これは、個々のコンポーネントから状態を_持ち上げる_必要があることを意味します。

### 状態を持ち上げる (Lift state)

Reactは、propsが親コンポーネントから子コンポーネントにのみ渡されることを保証します。これにより、コンポーネントが密結合になるのを防ぎます。

コンポーネントが兄弟コンポーネントの状態を変更したい場合、それは親コンポーネントを介して行う必要があります。その時点で、状態はもはや子コンポーネントのいずれにも属さず、全体を統括する親コンポーネントに属します。

コンポーネントから親への状態の移行プロセスは_状態の持ち上げ_（lifting state）と呼ばれます。アプリでは、`currentVideo`を`App`コンポーネントの状態として追加します。

1.  `App.kt`で、`App`コンポーネントの定義の先頭に以下を追加します:

    ```kotlin
    val App = FC<Props> {
        var currentVideo: Video? by useState(null)

        // . . .
    }
    ```

    `VideoList`コンポーネントは状態を追跡する必要がなくなります。代わりに、現在の動画をプロパティとして受け取ります。

2.  `VideoList.kt`の`useState()`呼び出しを削除します。
3.  選択された動画をpropとして受け取るように`VideoList`コンポーネントを準備します。そのためには、`VideoListProps`インターフェースを拡張して`selectedVideo`を含めます:

    ```kotlin
    external interface VideoListProps : Props {
        var videos: List<Video>
        var selectedVideo: Video?
    }
    ```

4.  三角形の条件を、`state`の代わりに`props`を使用するように変更します:

    ```kotlin
    if (video == props.selectedVideo) {
        +"▶ "
    }
    ```

### ハンドラーを渡す

現時点では、propに値を割り当てる方法がないため、`onClick`関数は現在の設定では機能しません。親コンポーネントの状態を変更するには、再度状態を持ち上げる必要があります。

Reactでは、状態は常に親から子へと流れます。そのため、子コンポーネントの1つから_アプリケーション_の状態を変更するには、ユーザーインタラクションを処理するロジックを親コンポーネントに移動し、そのロジックをpropとして渡す必要があります。Kotlinでは、変数に[関数の型](lambdas.md#function-types)を持たせることができることを忘れないでください。

1.  `VideoListProps`インターフェースを再度拡張し、`Video`を受け取り`Unit`を返す関数である変数`onSelectVideo`を含むようにします:

    ```kotlin
    external interface VideoListProps : Props {
        // ...
        var onSelectVideo: (Video) -> Unit
    }
    ```

2.  `VideoList`コンポーネントで、新しいpropを`onClick`ハンドラーで使用します:

    ```kotlin
    onClick = {
        props.onSelectVideo(video)
    }
    ```

    これで、`selectedVideo`変数を`VideoList`コンポーネントから削除できます。

3.  `App`コンポーネントに戻り、`selectedVideo`と`onSelectVideo`のハンドラーを2つの動画リストそれぞれに渡します:

    ```kotlin
    VideoList {
        videos = unwatchedVideos // and watchedVideos respectively
        selectedVideo = currentVideo
        onSelectVideo = { video ->
            currentVideo = video
        }
    }
    ```

4.  視聴済み動画リストに対しても前のステップを繰り返します。

ブラウザに戻り、動画を選択したときに選択が重複なく2つのリスト間を移動することを確認してください。

## その他のコンポーネントを追加する

### 動画プレーヤーコンポーネントを抽出する

これで、現在プレースホルダー画像である、別の自己完結型コンポーネントである動画プレーヤーを作成できます。動画プレーヤーは、トークのタイトル、トークの著者、および動画へのリンクを知る必要があります。この情報は各`Video`オブジェクトにすでに含まれているため、propとして渡してその属性にアクセスできます。

1.  新しい`VideoPlayer.kt`ファイルを作成し、以下の実装を`VideoPlayer`コンポーネントに追加します:

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

2.  `VideoPlayerProps`インターフェースが`VideoPlayer`コンポーネントがnull許容でない`Video`を受け取ることを指定しているため、`App`コンポーネントでそれに応じた処理を確実に行います。

    `App.kt`で、動画プレーヤーの以前の`div`スニペットを以下に置き換えます。

    ```kotlin
    currentVideo?.let { curr ->
        VideoPlayer {
            video = curr
        }
    }
    ```

    [`let`スコープ関数](scope-functions.md#let)は、`VideoPlayer`コンポーネントが`state.currentVideo`がnullでない場合にのみ追加されることを保証します。

これでリストのエントリをクリックすると動画プレーヤーが表示され、クリックされたエントリの情報が読み込まれます。

### ボタンを追加して接続する

ユーザーが動画を視聴済みまたは未視聴としてマークし、2つのリスト間で移動できるようにするには、`VideoPlayer`コンポーネントにボタンを追加します。

このボタンは2つの異なるリスト間で動画を移動するため、状態変更を処理するロジックを`VideoPlayer`から_持ち上げ_、親からpropとして渡す必要があります。ボタンは、動画が視聴済みかどうかに基づいて異なる表示になるはずです。これもpropとして渡す必要がある情報です。

1.  `VideoPlayer.kt`の`VideoPlayerProps`インターフェースを拡張して、それら2つのケースのプロパティを含めます:

    ```kotlin
    external interface VideoPlayerProps : Props {
        var video: Video
        var onWatchedButtonPressed: (Video) -> Unit
        var unwatchedVideo: Boolean
    }
    ```

2.  これで、実際のコンポーネントにボタンを追加できます。以下のスニペットを`VideoPlayer`コンポーネントのボディ、`h3`タグと`img`タグの間にコピーします:

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

    スタイルを動的に変更できるKotlin CSS DSLの助けを借りて、基本的なKotlinの`if`式を使用してボタンの色を変更できます。

### 動画リストをアプリケーションの状態に移動する

ここで、`App`コンポーネント内の`VideoPlayer`の使用箇所を調整します。ボタンがクリックされると、動画は未視聴リストから視聴済みリストへ、またはその逆に移動するはずです。これらのリストは実際に変更できるようになったため、それらをアプリケーションの状態に移動します。

1.  `App.kt`で、以下のプロパティを`useState()`呼び出しとともに`App`コンポーネントの先頭に追加します:

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
    {validate="false"}

2.  すべてのデモデータが`watchedVideos`と`unwatchedVideos`のデフォルト値に直接含まれているため、ファイルレベルの宣言は不要になりました。`Main.kt`で、`watchedVideos`と`unwatchedVideos`の宣言を削除します。
3.  動画プレーヤーに属する`App`コンポーネントの`VideoPlayer`の呼び出し箇所を次のように変更します:

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

ブラウザに戻り、動画を選択してボタンを数回押します。動画は2つのリスト間を移動します。

## npmのパッケージを使用する

アプリを使用可能にするには、実際に動画を再生する動画プレーヤーと、コンテンツを共有するためのいくつかのボタンが必要です。

Reactには豊富なエコシステムがあり、この機能を自分で構築する代わりに、既製のコンポーネントをたくさん使用できます。

### 動画プレーヤーコンポーネントを追加する

プレースホルダーの動画コンポーネントを実際のYouTubeプレーヤーに置き換えるには、npmの`react-player`パッケージを使用します。これは動画を再生でき、プレーヤーの表示を制御できます。

コンポーネントのドキュメントとAPIの説明については、GitHubの[README](https://www.npmjs.com/package/react-player)を参照してください。

1.  `build.gradle.kts`ファイルを確認します。`react-player`パッケージはすでに含まれているはずです:

    ```kotlin
    dependencies {
        // ...
        // Video Player
        implementation(npm("react-player", "2.12.0"))
        // ...
    }
    ```

    ご覧のように、ビルドファイルの`dependencies`ブロックで`npm()`関数を使用することで、Kotlin/JSプロジェクトにnpm依存関係を追加できます。その後、Gradleプラグインがこれらの依存関係のダウンロードとインストールを代行します。これを行うために、独自のバンドルされた[Yarn](https://yarnpkg.com/)パッケージマネージャーのインストールを使用します。

2.  Reactアプリケーション内からJavaScriptパッケージを使用するには、[外部宣言](js-interop.md)を提供してKotlinコンパイラに何を期待するかを伝える必要があります。

    新しい`ReactYouTube.kt`ファイルを作成し、以下の内容を追加します。

    ```kotlin
    @file:JsModule("react-player")
    @file:JsNonModule

    import react.*

    @JsName("default")
    external val ReactPlayer: ComponentClass<dynamic>
    ```

    コンパイラが`ReactPlayer`のような外部宣言を見ると、対応するクラスの実装が依存関係によって提供されると仮定し、そのコードを生成しません。

    最後の2行は、`require("react-player").default;`のようなJavaScriptインポートと同等です。これらは、コンポーネントが実行時に`ComponentClass<dynamic>`に準拠することが確実であることをコンパイラに伝えます。

しかし、この設定では、`ReactPlayer`が受け入れるpropsのジェネリック型が`dynamic`に設定されています。これは、コンパイラがあらゆるコードを受け入れることを意味し、実行時に問題を引き起こすリスクがあります。

より良い代替案は、この外部コンポーネントのpropsにどのようなプロパティが属するかを指定する`external interface`を作成することです。コンポーネントの[README](https://www.npmjs.com/package/react-player)でpropsのインターフェースについて学ぶことができます。この場合、`url`と`controls`のpropsを使用します。

1.  `ReactYouTube.kt`の内容を、`dynamic`を外部インターフェースに置き換えることで調整します:

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

2.  これで、新しい`ReactPlayer`を使用して、`VideoPlayer`コンポーネントの灰色のプレースホルダー四角形を置き換えることができます。`VideoPlayer.kt`で、`img`タグを以下のスニペットに置き換えます:

    ```kotlin
    ReactPlayer {
        url = props.video.videoUrl
        controls = true
    }
    ```

### ソーシャルシェアボタンを追加する

アプリケーションのコンテンツを共有する簡単な方法は、メッセンジャーやメール用のソーシャルシェアボタンを用意することです。これにも既製のReactコンポーネントを使用できます。たとえば、[react-share](https://github.com/nygardk/react-share/blob/master/README.md)があります。

1.  `build.gradle.kts`ファイルを確認します。このnpmライブラリはすでに含まれているはずです:

    ```kotlin
    dependencies {
        // ...
        // Share Buttons
        implementation(npm("react-share", "4.4.1"))
        // ...
    }
    ```

2.  Kotlinから`react-share`を使用するには、さらに基本的な外部宣言を記述する必要があります。GitHubの[例](https://github.com/nygardk/react-share/blob/master/demo/Demo.tsx#L61)を見ると、シェアボタンはたとえば`EmailShareButton`と`EmailIcon`という2つのReactコンポーネントで構成されていることがわかります。異なる種類のシェアボタンとアイコンはすべて同じインターフェースを持っています。動画プレーヤーの場合と同じ方法で、各コンポーネントの外部宣言を作成します。

    新しい`ReactShare.kt`ファイルに以下のコードを追加します。

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

3.  アプリケーションのユーザーインターフェースに新しいコンポーネントを追加します。`VideoPlayer.kt`で、`ReactPlayer`の使用直前の`div`内に2つのシェアボタンを追加します:

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

ブラウザを確認し、ボタンが実際に機能するかどうかを確認できます。ボタンをクリックすると、動画のURLを含む_共有ウィンドウ_が表示されるはずです。ボタンが表示されない、または機能しない場合は、広告ブロッカーやソーシャルメディアブロッカーを無効にする必要があるかもしれません。

![Share window](social-buttons.png){width=700}

[react-share](https://github.com/nygardk/react-share/blob/master/README.md#features)で利用可能な他のソーシャルネットワークのシェアボタンでも、この手順を自由に繰り返してください。

## 外部REST APIを使用する

これで、アプリ内のハードコードされたデモデータを、REST APIからの実際のデータに置き換えることができます。

このチュートリアルでは、[小さなAPI](https://my-json-server.typicode.com/kotlin-hands-on/kotlinconf-json/videos/1)があります。これは`videos`という単一のエンドポイントのみを提供し、リストから要素にアクセスするための数値パラメータを取ります。ブラウザでAPIにアクセスすると、APIから返されるオブジェクトが`Video`オブジェクトと同じ構造を持っていることがわかります。

### KotlinからJSの機能を使用する

ブラウザにはすでに多種多様な[Web API](https://developer.mozilla.org/en-US/docs/Web/API)が搭載されています。Kotlin/JSにはこれらのAPIのラッパーがすぐに含まれているため、Kotlin/JSからそれらを使用することもできます。一例として、HTTPリクエストの作成に使用される[fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)があります。

最初の潜在的な問題は、`fetch()`のようなブラウザAPIが非ブロッキング操作を実行するために[コールバック](https://developer.mozilla.org/en-US/docs/Glossary/Callback_function)を使用することです。複数のコールバックが連続して実行されるべき場合、それらはネストする必要があります。当然、コードは深くインデントされ、ますます多くの機能が互いに入れ子になり、読みづらくなります。

これを克服するために、そのような機能にはより良いアプローチであるKotlinのコルーチンを使用できます。

2つ目の問題は、JavaScriptの動的な型付けの性質から生じます。外部APIから返されるデータの型について保証はありません。これを解決するために、`kotlinx.serialization`ライブラリを使用できます。

`build.gradle.kts`ファイルを確認します。関連するスニペットはすでに存在しているはずです。

```kotlin
dependencies {
    // . . .

    // Coroutines & serialization
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.6.4")
}
```

### シリアライズを追加する

外部APIを呼び出すと、JSON形式のテキストが返されます。これは、Kotlinオブジェクトとして操作できるように変換する必要があります。

[`kotlinx.serialization`](https://github.com/Kotlin/kotlinx.serialization)は、JSON文字列からKotlinオブジェクトへの変換を記述できるようにするライブラリです。

1.  `build.gradle.kts`ファイルを確認します。対応するスニペットはすでに存在しているはずです:

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

2.  最初の動画をフェッチする準備として、シリアライズライブラリに`Video`クラスについて伝える必要があります。`Main.kt`で、その定義に`@Serializable`アノテーションを追加します:

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

APIから動画をフェッチするには、`App.kt`（または新しいファイル）に以下の関数を追加します。

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

*   _中断関数_である`fetch()`は、与えられた`id`を持つ動画をAPIからフェッチします。この応答には時間がかかる場合があるため、結果を`await()`します。次に、コールバックを使用する`text()`が応答からボディを読み取ります。その後、その完了を`await()`します。
*   関数の値を返す前に、`kotlinx.coroutines`の関数である`Json.decodeFromString`に渡します。これは、リクエストから受け取ったJSONテキストを適切なフィールドを持つKotlinオブジェクトに変換します。
*   `window.fetch`関数呼び出しは`Promise`オブジェクトを返します。通常、`Promise`が解決され結果が利用可能になったときに呼び出されるコールバックハンドラーを定義する必要があります。しかし、コルーチンを使用すると、それらのプロミスを`await()`できます。`await()`のような関数が呼び出されると、メソッドはその実行を停止（中断）します。`Promise`が解決可能になると、その実行が続行されます。

ユーザーに動画の選択肢を提供するために、上記のAPIから25本の動画をフェッチする`fetchVideos()`関数を定義します。すべてのリクエストを並行して実行するには、Kotlinのコルーチンが提供する[`async`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)機能を使用します。

1.  `App.kt`に以下の実装を追加します:

    ```kotlin
    suspend fun fetchVideos(): List<Video> = coroutineScope {
        (1..25).map { id ->
            async {
                fetchVideo(id)
            }
        }.awaitAll()
    }
    ```

    [構造化された並行処理](https://kotlinlang.org/docs/coroutines-basics.html#structured-concurrency)の原則に従い、実装は`coroutineScope`でラップされています。これにより、25個の非同期タスク（リクエストごとに1つ）を開始し、それらすべてが完了するのを待つことができます。

2.  これでアプリケーションにデータを追加できます。`mainScope`の定義を追加し、`App`コンポーネントが以下のスニペットで始まるように変更します。デモ値を`emptyLists`インスタンスに置き換えることも忘れないでください:

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

    *   [`MainScope()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-main-scope.html)はKotlinの構造化された並行処理モデルの一部であり、非同期タスクが実行されるスコープを作成します。
    *   `useEffectOnce`はもう1つのReact _フック_（特に、[`useEffect`](https://reactjs.org/docs/hooks-effect.html)フックの簡易版）です。コンポーネントが_副作用_を実行することを示します。これは自身をレンダリングするだけでなく、ネットワーク経由で通信も行います。

ブラウザを確認します。アプリケーションは実際のデータを表示するはずです:

![Fetched data from API](website-api-data.png){width=700}

ページをロードすると:

*   `App`コンポーネントのコードが呼び出されます。これにより、`useEffectOnce`ブロックのコードが開始されます。
*   `App`コンポーネントは、視聴済み動画と未視聴動画の空のリストでレンダリングされます。
*   APIリクエストが完了すると、`useEffectOnce`ブロックはそれを`App`コンポーネントの状態に割り当てます。これにより再レンダリングがトリガーされます。
*   `App`コンポーネントのコードが再び呼び出されますが、`useEffectOnce`ブロックは2回目は実行_されません_。

コルーチンの動作について深く理解したい場合は、[コルーチンに関するこのチュートリアル](coroutines-and-channels.md)を参照してください。

## 本番環境とクラウドにデプロイする

アプリケーションをクラウドに公開し、他の人がアクセスできるようにする時が来ました。

### プロダクションビルドをパッケージ化する

すべての資産をプロダクションモードでパッケージ化するには、IntelliJ IDEAのツールウィンドウから、または`./gradlew build`を実行して、Gradleの`build`タスクを実行します。これにより、DCE（デッドコード削除）などの様々な改善が適用された最適化されたプロジェクトビルドが生成されます。

ビルドが完了すると、デプロイに必要なすべてのファイルが`/build/dist`にあります。これには、JavaScriptファイル、HTMLファイル、およびアプリケーションの実行に必要なその他のリソースが含まれます。これらは静的HTTPサーバーに配置したり、GitHub Pagesを使用して提供したり、選択したクラウドプロバイダーでホストしたりできます。

### Herokuにデプロイする

Herokuは、独自のドメインでアクセス可能なアプリケーションを簡単に起動できるようにします。彼らのフリーティアは開発目的には十分でしょう。

1.  [アカウントを作成](https://signup.heroku.com/)します。
2.  [CLIクライアントをインストールして認証](https://devcenter.heroku.com/articles/heroku-cli)します。
3.  プロジェクトルートにいる間にターミナルで以下のコマンドを実行して、Gitリポジトリを作成し、Herokuアプリをアタッチします:

    ```bash
    git init
    heroku create
    git add .
    git commit -m "initial commit"
    ```

4.  Herokuで実行される通常のJVMアプリケーション（KtorやSpring Bootで書かれたものなど）とは異なり、このアプリは静的HTMLページとJavaScriptファイルを生成するため、それに応じて提供する必要があります。必要なビルドパックを調整して、プログラムを適切に提供できます:

    ```bash
    heroku buildpacks:set heroku/gradle
    heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
    ```

5.  `heroku/gradle`ビルドパックが適切に実行されるようにするため、`build.gradle.kts`ファイルに`stage`タスクが必要です。このタスクは`build`タスクと同等であり、対応するエイリアスはファイルの最後にすでに含まれています:

    ```kotlin
    // Heroku Deployment
    tasks.register("stage") {
        dependsOn("build")
    }
    ```

6.  `buildpack-static`を設定するために、新しい`static.json`ファイルをプロジェクトルートに追加します。
7.  ファイル内に`root`プロパティを追加します:

    ```xml
    {
        "root": "build/distributions"
    }
    ```
    {validate="false"}

8.  たとえば、以下のコマンドを実行してデプロイをトリガーできます:

    ```bash
    git add -A
    git commit -m "add stage task and static content root configuration"
    git push heroku master
    ```

> メイン以外のブランチからプッシュする場合は、`main`リモートにプッシュするようにコマンドを調整してください。例: `git push heroku feature-branch:main`。
>
{style="tip"}

デプロイが成功すると、人々がインターネット上でアプリケーションにアクセスするために使用できるURLが表示されます。

![Web app deployment to production](deployment-to-production.png){width=700}

> この状態のプロジェクトは、`finished`ブランチの[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)で確認できます。
>
{style="note"}

## 次のステップ

### さらに機能を追加する {initial-collapse-state="collapsed" collapsible="true"}

結果として得られたアプリは、React、Kotlin/JSなどの分野でより高度なトピックを探求するための出発点として使用できます。

*   **検索**。タイトルや著者などでトークのリストをフィルタリングするための検索フィールドを追加できます。[ReactでのHTMLフォーム要素の動作](https://reactjs.org/docs/forms.html)について学びましょう。
*   **永続化**。現在、アプリケーションはページがリロードされるたびに視聴者のウォッチリストを失います。Kotlinで利用可能なWebフレームワーク（[Ktor](https://ktor.io/)など）のいずれかを使用して独自のバックエンドを構築することを検討してください。あるいは、[クライアント側で情報を保存する方法](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)を調べてください。
*   **複雑なAPI**。多くのデータセットとAPIが利用可能です。アプリケーションにあらゆる種類のデータを引き込むことができます。たとえば、[猫の写真](https://thecatapi.com/)のビジュアライザーや、[ロイヤリティフリーのストックフォトAPI](https://unsplash.com/developers)を構築できます。

### スタイルの改善: レスポンシブとグリッド {initial-collapse-state="collapsed" collapsible="true"}

アプリケーションのデザインはまだ非常にシンプルであり、モバイルデバイスや狭いウィンドウでは見栄えがよくありません。CSS DSLをさらに探求して、アプリのアクセシビリティを向上させましょう。

### コミュニティに参加してヘルプを得る {initial-collapse-state="collapsed" collapsible="true"}

問題を報告し、ヘルプを得るための最良の方法は、[kotlin-wrappersイシュートラッカー](https://github.com/JetBrains/kotlin-wrappers/issues)です。問題のチケットが見つからない場合は、遠慮なく新しいチケットを提出してください。公式の[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)に参加することもできます。そこには`#javascript`と`#react`のチャンネルがあります。

### コルーチンについてさらに学ぶ {initial-collapse-state="collapsed" collapsible="true"}

並行コードの書き方についてもっと詳しく知りたい場合は、[コルーチンに関するチュートリアル](coroutines-and-channels.md)を参照してください。

### Reactについてさらに学ぶ {initial-collapse-state="collapsed" collapsible="true"}

Reactの基本的な概念と、それがKotlinにどのように変換されるかを理解した今、[Reactのドキュメント](https://react.dev/learn)に概説されている他のいくつかの概念をKotlinに変換することができます。