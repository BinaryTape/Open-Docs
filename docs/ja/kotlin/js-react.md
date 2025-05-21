---
title: "ReactとKotlin/JSでWebアプリケーションを構築する — チュートリアル"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>

このチュートリアルでは、Kotlin/JS と [React](https://reactjs.org/)
フレームワークを使ってブラウザアプリケーションを構築する方法を学びます。以下を行います。

* 一般的な React アプリケーションの構築に関連する一般的なタスクを完了します。
* [Kotlin の DSL](type-safe-builders) を使用して、読みやすさを犠牲にすることなく、概念を簡潔かつ均一に表現する方法を探求し、Kotlin で本格的なアプリケーションを記述できるようにします。
* 既製の npm コンポーネントの使用方法、外部ライブラリの使用方法、最終アプリケーションの公開方法を学びます。

出力は、[KotlinConf](https://kotlinconf.com/) イベント専用の _KotlinConf Explorer_ Web アプリで、会議の講演へのリンクが含まれます。ユーザーは、1 つのページですべての講演を視聴し、視聴済みまたは未視聴としてマークできます。

このチュートリアルでは、Kotlin の事前知識と HTML および CSS の基本的な知識があることを前提としています。React の背後にある基本的な概念を理解すると、サンプルコードの理解に役立つ場合がありますが、厳密には必須ではありません。

:::note
最終的なアプリケーションは[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/finished)で入手できます。

:::

## 開始する前に

1. 最新バージョンの [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html) をダウンロードしてインストールします。
2. [プロジェクトテンプレート](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle)を複製し、IntelliJ IDEA で開きます。このテンプレートには、必要なすべての構成と依存関係を備えた基本的な Kotlin Multiplatform Gradle プロジェクトが含まれています。

   * `build.gradle.kts` ファイルの依存関係とタスク:
   
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

   * このチュートリアルで使用する JavaScript コードを挿入するための `src/jsMain/resources/index.html` の HTML テンプレートページ:

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
   

   Kotlin/JS プロジェクトは、コードとその依存関係すべてとともに、プロジェクトと同じ名前の単一の JavaScript ファイル `confexplorer.js` に自動的にバンドルされます。典型的な[JavaScript の慣例](https://faqs.skillcrush.com/article/176-where-should-js-script-tags-be-linked-in-html-documents)として、本文の内容（`root` div を含む）が最初にロードされ、ブラウザがスクリプトの前にすべてのページ要素をロードするようにします。

* `src/jsMain/kotlin/Main.kt` のコードスニペット:

   ```kotlin
   import kotlinx.browser.document
   
   fun main() {
       document.bgColor = "red"
   }
   ```

### 開発サーバーを実行する

デフォルトでは、Kotlin Multiplatform Gradle プラグインには埋め込みの `webpack-dev-server` のサポートが付属しており、サーバーを手動で設定しなくても IDE からアプリケーションを実行できます。

プログラムがブラウザで正常に実行されることをテストするには、IntelliJ IDEA 内の Gradle ツールウィンドウから `run` または `browserDevelopmentRun` タスク（`other` または `kotlin browser` ディレクトリで使用可能）を呼び出して、開発サーバーを起動します。

<img src="/img/browser-development-run.png" alt="Gradle tasks list" width="700" style={{verticalAlign: 'middle'}}/>

ターミナルからプログラムを実行するには、代わりに `./gradlew run` を使用します。

プロジェクトがコンパイルおよびバンドルされると、空白の赤いページがブラウザウィンドウに表示されます。

<img src="/img/red-page.png" alt="Blank red page" width="700" style={{verticalAlign: 'middle'}}/>

### ホットリロード/継続モードを有効にする

変更を加えるたびにプロジェクトを手動でコンパイルして実行する必要がないように、_[継続コンパイル](dev-server-continuous-compilation)_ モードを構成します。続行する前に、実行中の開発サーバーインスタンスをすべて停止してください。

1. Gradle `run` タスクを最初に実行した後に IntelliJ IDEA が自動的に生成する実行構成を編集します。

   <img src="/img/edit-configurations-continuous.png" alt="Edit a run configuration" width="700" style={{verticalAlign: 'middle'}}/>

2. **Run/Debug Configurations** ダイアログで、実行構成の引数に `--continuous` オプションを追加します。

   <img src="/img/continuous-mode.png" alt="Enable continuous mode" width="700" style={{verticalAlign: 'middle'}}/>

   変更を適用すると、IntelliJ IDEA 内の **Run** ボタンを使用して、開発サーバーを再起動できます。ターミナルから継続的な Gradle ビルドを実行するには、代わりに `./gradlew run --continuous` を使用します。

3. この機能をテストするには、Gradle タスクの実行中に `Main.kt` ファイルでページの色を青に変更します。

   ```kotlin
   document.bgColor = "blue"
   ```

   その後、プロジェクトが再コンパイルされ、リロード後にブラウザページが新しい色になります。

開発プロセス中は、開発サーバーを継続モードで実行し続けることができます。変更を加えると、ページが自動的に再構築およびリロードされます。

:::note
このプロジェクトの状態は、`master` ブランチの[こちら](https://github.com/kotlin-hands-on/web-app-react-kotlin-js-gradle/tree/master)にあります。

:::

## Web アプリの下書きを作成する

### React を使用して最初の静的ページを追加する

アプリに簡単なメッセージを表示するには、`Main.kt` ファイルのコードを次のように置き換えます。

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

* `render()` 関数は、[kotlin-react-dom](https://github.com/JetBrains/kotlin-wrappers/tree/master/kotlin-react-dom) に、[fragment](https://reactjs.org/docs/fragments.html) 内の最初の HTML 要素を `root` 要素にレンダリングするように指示します。この要素は、テンプレートに含まれていた `src/jsMain/resources/index.html` で定義されたコンテナです。
* コンテンツは `<h1>` ヘッダーで、typesafe DSL を使用して HTML をレンダリングします。
* `h1` はラムダパラメータを取る関数です。文字列リテラルの前に `+` 記号を追加すると、[演算子のオーバーロード](operator-overloading)を使用して `unaryPlus()` 関数が実際に呼び出されます。囲まれた HTML 要素に文字列を追加します。

プロジェクトが再コンパイルされると、ブラウザに次の HTML ページが表示されます。

<img src="/img/hello-react-js.png" alt="An HTML page example" width="700" style={{verticalAlign: 'middle'}}/>

### HTML を Kotlin の typesafe HTML DSL に変換する

React 用の Kotlin [ラッパー](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-react/README) には、純粋な Kotlin コードで HTML を記述できるようにする[ドメイン固有言語 (DSL)](type-safe-builders)が付属しています。この点で、JavaScript の [JSX](https://reactjs.org/docs/introducing-jsx.html) に似ています。ただし、このマークアップは Kotlin であるため、オートコンプリートや型チェックなど、静的に型付けされた言語のすべての利点が得られます。

将来の Web アプリケーションの従来の HTML コードと、Kotlin の typesafe バリアントを比較します。

<Tabs>
<TabItem value="HTML" label="HTML">

```html
<h1>KotlinConf Explorer</h1>
<div>
<h3>Videos to watch</h3>
<p>
   John Doe: Building and breaking things
</p>
<p>
   Jane Smith: The development process
</p>
<p>
   Matt Miller: The Web 7.0
</p>
<h3>Videos watched</h3>
<p>
   Tom Jerry: Mouseless development
</p>
</div>
<div>
<h3>John Doe: Building and breaking things</h3>
    <img src="https://via.placeholder.com/640x360.png?text=Video+Player+Placeholder"/>
</div>
```

</TabItem>
<TabItem value="Kotlin" label="Kotlin">

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

</TabItem>
</Tabs>

Kotlin コードをコピーして、`main()` 関数内の `Fragment.create()` 関数呼び出しを更新し、以前の `h1` タグを置き換えます。

ブラウザがリロードされるまで待ちます。ページは次のようになります。

<img src="/img/website-draft.png" alt="The web app draft" width="700" style={{verticalAlign: 'middle'}}/>

### マークアップで Kotlin 構造を使用して動画を追加する

この DSL を使用して Kotlin で HTML を記述することには、いくつかの利点があります。ループ、条件、コレクション、文字列補間など、通常の Kotlin 構造を使用してアプリを操作できます。

動画のハードコードされたリストを Kotlin オブジェクトのリストに置き換えることができます。

1. `Main.kt` で、すべての動画属性を 1 か所に保持するために、`Video` [data class](data-classes) を作成します。

   ```kotlin
   data class Video(
       val id: Int,
       val title: String,
       val speaker: String,
       val videoUrl: String
   )
   ```

2. 2 つのリスト（未視聴の動画と視聴済みの動画）をそれぞれ入力します。これらの宣言を `Main.kt` のファイルレベルに追加します。

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

3. これらの動画をページで使用するには、Kotlin の `for` ループを記述して、未視聴の `Video` オブジェクトのコレクションを反復処理します。「Videos to watch」の下にある 3 つの `p` タグを次のスニペットに置き換えます。

   ```kotlin
   for (video in unwatchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```
   
4. 同じプロセスを適用して、「Videos watched」に続く単一のタグのコードも変更します。

   ```kotlin
   for (video in watchedVideos) {
       p {
           +"${video.speaker}: ${video.title}"
       }
   }
   ```

ブラウザがリロードされるまで待ちます。レイアウトは以前と同じままになります。ループが機能していることを確認するために、リストにさらに動画を追加できます。

### typesafe CSS でスタイルを追加する

[Emotion](https://emotion.sh/docs/introduction) ライブラリ用の [kotlin-emotion](https://github.com/JetBrains/kotlin-wrappers/blob/master/kotlin-emotion/) ラッパーを使用すると、CSS 属性（動的な属性を含む）を JavaScript を使用した HTML と並行して指定できます。概念的には、[CSS-in-JS](https://reactjs.org/docs/faq-styling.html#what-is-css-in-js) に似ていますが、Kotlin 用です。DSL を使用する利点は、Kotlin コード構造を使用してフォーマットルールを表現できることです。

このチュートリアルのテンプレートプロジェクトには、`kotlin-emotion` の使用に必要な依存関係がすでに含まれています。

```kotlin
dependencies {
    // ...
    // Kotlin React Emotion (CSS) (chapter 3)
    implementation("org.jetbrains.kotlin-wrappers:kotlin-emotion")
    // ...
}
```

`kotlin-emotion` を使用すると、スタイルを定義できる HTML 要素 `div` および `h3` 内に `css` ブロックを指定できます。

ビデオプレーヤーをページの右上隅に移動するには、CSS を使用して、ビデオプレーヤー（スニペットの最後の `div`）のコードを調整します。

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

他のスタイルも自由に試してみてください。たとえば、`fontFamily` を変更したり、UI に `color` を追加したりできます。

## アプリコンポーネントを設計する

React の基本的な構成要素は _[components](https://reactjs.org/docs/components-and-props.html)_ と呼ばれます。コンポーネント自体も、他のより小さなコンポーネントで構成できます。コンポーネントを組み合わせることで、アプリケーションを構築します。コンポーネントを汎用的で再利用できるように構造化すると、コードやロジックを複製せずに、アプリの複数の部分で使用できます。

`render()` 関数の内容は、通常、基本的なコンポーネントを記述します。アプリケーションの現在のレイアウトは次のようになります。

<img src="/img/current-layout.png" alt="Current layout" width="700" style={{verticalAlign: 'middle'}}/>

アプリケーションを個々のコンポーネントに分解すると、各コンポーネントがそれぞれの責任を処理する、より構造化されたレイアウトになります。

<img src="/img/structured-layout.png" alt="Structured layout with components" width="700" style={{verticalAlign: 'middle'}}/>

コンポーネントは特定の機能をカプセル化します。コンポーネントを使用すると、ソースコードが短くなり、読みやすく理解しやすくなります。

### メインコンポーネントを追加する

アプリケーションの構造の作成を開始するには、最初に `root` 要素にレンダリングするメインコンポーネントである `App` を明示的に指定します。

1. `src/jsMain/kotlin` フォルダに新しい `App.kt` ファイルを作成します。
2. このファイル内に、次のスニペットを追加し、typesafe HTML を `Main.kt` からそのファイルに移動します。

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
   
   `FC` 関数は、[function component](https://reactjs.org/docs/components-and-props.html#function-and-class-components) を作成します。

3. `Main.kt` ファイルで、`main()` 関数を次のように更新します。

   ```kotlin
   fun main() {
       val container = document.getElementById("root") ?: error("Couldn't find root container!")
       createRoot(container).render(App.create())
   }
   ```

   これで、プログラムは `App` コンポーネントのインスタンスを作成し、指定されたコンテナにレンダリングします。

React の概念の詳細については、[ドキュメントとガイド](https://reactjs.org/docs/hello-world.html#how-to-read-this-guide)を参照してください。

### リストコンポーネントを抽出する

`watchedVideos` リストと `unwatchedVideos` リストにはそれぞれ動画のリストが含まれているため、単一の再利用可能なコンポーネントを作成し、リストに表示されるコンテンツのみを調整するのが理にかなっています。

`VideoList` コンポーネントは `App` コンポーネントと同じパターンに従います。`FC` ビルダー関数を使用し、`unwatchedVideos` リストのコードが含まれています。

1. `src/jsMain/kotlin` フォルダに新しい `VideoList.kt` ファイルを作成し、次のコードを追加します。

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

2. `App.kt` で、パラメータなしで `VideoList` コンポーネントを呼び出して使用します。

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

   今のところ、`App` コンポーネントは `VideoList` コンポーネントによって表示されるコンテンツを制御できません。ハードコードされているため、同じリストが 2 回表示されます。

### コンポーネント間でデータを渡すために props を追加する

`VideoList` コンポーネントを再利用するため、さまざまなコンテンツを入力できるようにする必要があります。アイテムのリストを属性としてコンポーネントに渡す機能を追加できます。React では、これらの属性は _props_ と呼ばれます。React でコンポーネントの props が変更されると、フレームワークはコンポーネントを自動的に再レンダリングします。

`VideoList` の場合は、表示する動画のリストを含む prop が必要になります。`VideoList` コンポーネントに渡すことができるすべての props を保持するインターフェースを定義します。

1. 次の定義を `VideoList.kt` ファイルに追加します。

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
   }
   ```
   [external](js-interop#external-modifier) 修飾子は、コンパイラにインターフェースの実装が外部から提供されることを伝え、宣言から JavaScript コードを生成しようとしません。

2. `FC` ブロックにパラメータとして渡される props を使用するように `VideoList` のクラス定義を調整します。

   ```kotlin
   val VideoList = FC<VideoListProps> { props `->`
       for (video in props.videos) {
           p {
               key = video.id.toString()
               +"${video.speaker}: ${video.title}"
           }
       }
   }
   ```

   `key` 属性は、`props.videos` の値が変更された場合に React レンダラーが何を行うかを判断するのに役立ちます。キーを使用して、リストのどの部分を更新する必要があるか、どの部分を同じままにするかを判断します。[React ガイド](https://reactjs.org/docs/lists-and-keys.html)で、リストとキーの詳細を確認できます。

3. `App` コンポーネントで、子コンポーネントが適切な属性でインスタンス化されていることを確認します。`App.kt` で、`h3` 要素の下にある 2 つのループを、`unwatchedVideos` と `watchedVideos` の属性とともに `VideoList` の呼び出しに置き換えます。Kotlin DSL では、`VideoList` コンポーネントに属するブロック内で属性を割り当てます。

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

リロード後、ブラウザにリストが正しくレンダリングされることが表示されます。

### リストをインタラクティブにする

まず、ユーザーがリストエントリをクリックしたときにポップアップするアラートメッセージを追加します。`VideoList.kt` で、現在選択されている動画でアラートをトリガーする `onClick` ハンドラ関数を追加します。

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

ブラウザウィンドウでリスト項目の 1 つをクリックすると、次のようなアラートウィンドウで動画に関する情報が表示されます。

<img src="/img/alert-window.png" alt="Browser alert window" width="700" style={{verticalAlign: 'middle'}}/>
:::note
ラムダとして直接 `onClick` 関数を定義することは簡潔で、プロトタイピングに非常に役立ちます。ただし、Kotlin/JS での等価性の[現在の仕組み](https://youtrack.jetbrains.com/issue/KT-15101)により、パフォーマンスの観点からはクリックハンドラを渡す最適な方法ではありません。レンダリングパフォーマンスを最適化する場合は、関数を変数に格納して渡すことを検討してください。

### 値を保持するために状態を追加する

ユーザーにアラートを表示するだけでなく、選択した動画を ▶ 三角形で強調表示する機能を追加できます。そのためには、このコンポーネントに固有の _state_ を導入します。

状態は、React の中心的な概念の 1 つです。最新の React（いわゆる _Hooks API_ を使用）では、状態は [`useState` hook](https://reactjs.org/docs/hooks-state.html) を使用して表されます。

1. 次のコードを `VideoList` 宣言の先頭に追加します。

   ```kotlin
   val VideoList = FC<VideoListProps> { props `->`
       var selectedVideo: Video? by useState(null)

   // . . .
   ```
   

   * `VideoList` 関数型コンポーネントは状態を保持します（現在の関数呼び出しとは独立した値）。状態は null 許容で、`Video?` 型です。そのデフォルト値は `null` です。
   * React の `useState()` 関数は、関数が複数回呼び出されても状態を追跡するようにフレームワークに指示します。たとえば、デフォルト値を指定した場合でも、React はデフォルト値が最初にのみ割り当てられるようにします。状態が変化すると、コンポーネントは新しい状態に基づいて再レンダリングされます。
   * `by` キーワードは、`useState()` が [委譲プロパティ](delegated-properties)として機能することを示します。他の変数と同様に、値を読み書きします。`useState()` の背後にある実装は、状態を機能させるために必要なメカニズムを処理します。

State Hook の詳細については、[React ドキュメント](https://reactjs.org/docs/hooks-state.html)を参照してください。

2. `VideoList` コンポーネントの `onClick` ハンドラとテキストを次のように変更します。

   ```kotlin
   val VideoList = FC<VideoListProps> { props `->`
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

   * ユーザーが動画をクリックすると、その値が `selectedVideo` 変数に割り当てられます。
   * 選択されたリストエントリがレンダリングされると、三角形が先頭に付加されます。

状態管理の詳細については、[React FAQ](https://reactjs.org/docs/faq-state.html)を参照してください。

ブラウザを確認し、リストのアイテムをクリックして、すべてが正しく動作していることを確認します。

## コンポーネントを構成する

現在、2 つの動画リストは単独で動作しています。つまり、各リストは選択された動画を追跡します。
ユーザーは、1 つのプレーヤーしかない場合でも、未視聴リストと視聴済みリストの両方で 2 つの動画を選択できます。

<img src="/img/two-videos-select.png" alt="Two videos are selected in both lists simultaneously" width="700" style={{verticalAlign: 'middle'}}/>

リストは、リスト内と兄弟リスト内の両方で、どの動画が選択されているかを追跡できません。その理由は、選択された動画が _リスト_ 状態の一部ではなく、_アプリケーション_ 状態の一部であるためです。これは、状態を個々のコンポーネントから _リフト_ する必要があることを意味します。

### 状態をリフトする

React は、props が親コンポーネントからその子コンポーネントにのみ渡されるようにします。これにより、コンポーネントがハードワイヤで接続されるのを防ぎます。

コンポーネントが兄弟コンポーネントの状態を変更する場合は、親を介して行う必要があります。その時点で、状態は子コンポーネントのいずれにも属さなくなり、包括的な親コンポーネントに属するようになります。

コンポーネントから親への状態の移行プロセスは、_状態のリフト_ と呼ばれます。アプリの場合は、`currentVideo` を状態として `App` コンポーネントに追加します。

1. `App.kt` で、`App` コンポーネントの定義の先頭に次を追加します。

   ```kotlin
   val App = FC<Props> {
       var currentVideo: Video? by useState(null)
   
       // . . .
   }
   ```

   `VideoList` コンポーネントは、状態を追跡する必要がなくなりました。代わりに、現在の動画を prop として受け取ります。

2. `VideoList.kt` で `useState()` 呼び出しを削除します。
3. 選択された動画を prop として受け取るように `VideoList` コンポーネントを準備します。そのためには、`VideoListProps` インターフェースを展開して `selectedVideo` を含めます。

   ```kotlin
   external interface VideoListProps : Props {
       var videos: List<Video>
       var selectedVideo: Video?
   }
   ```

4. 三角形の条件を、`state` の代わりに `props` を使用するように変更します。

   ```kotlin
   if (video == props.selectedVideo) {
       +"▶ "
   }
   ```

### ハンドラを渡す

現時点では、props に値を割り当てる方法がないため、`onClick` 関数は現在設定されている方法では機能しません。親コンポーネントの状態を変更するには、状態を再度リフトする必要があります。

React では、状態は常に親から子に流れます。したがって、子コンポーネントの 1 つから _アプリケーション_ 状態を変更するには、ユーザーインタラクションを処理するためのロジックを親コンポーネントに移動し、ロジックを prop として渡す必要があります。Kotlin では、変数に [関数の型](lambdas#function-types)を持たせることができることに注意してください。

1. `VideoListProps` インターフェースを再度展開して、`Video` を受け取り `Unit` を返す関数である変数 `onSelectVideo` を含めます。

   ```kotlin
   external interface VideoListProps : Props {
       // ...
       var onSelectVideo: (Video) `->` Unit
   }
   ```

2. `VideoList` コンポーネントで、`onClick` ハンドラで新しい prop を使用します。

   ```kotlin
   onClick = {
       props.onSelectVideo(video)
   }
   ```
   
   これで、`VideoList` コンポーネントから `selectedVideo` 変数を削除できます。

3. `App` コンポーネントに戻り、2 つの動画リストそれぞれに対して `selectedVideo` と `onSelectVideo` のハンドラを渡します。

   ```kotlin
   VideoList {
       videos = unwatchedVideos // および watchedVideos それぞれ
       selectedVideo = currentVideo
       onSelectVideo = { video `->`
           currentVideo = video
       }
   }
   ```

4. 視聴済みの動画リストに対して前の手順を繰り返します。

ブラウザに戻り、動画を選択したときに、重複することなく 2 つのリスト間で選択がジャンプすることを確認します。

## コンポーネントをさらに追加する

### ビデオプレーヤーコンポーネントを抽出する

自己完結型の別のコンポーネント（現在プレースホルダー画像であるビデオプレーヤー）を作成できます。ビデオプレーヤーは、講演のタイトル、講演の作成者、および動画へのリンクを知る必要があります。この情報はすでに各 `Video` オブジェクトに含まれているため、prop として渡して、その属性にアクセスできます。

1. 新しい `VideoPlayer.kt` ファイルを作成し、`VideoPlayer` コンポーネントに次の実装を追加します。

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
   
   val VideoPlayer = FC<VideoPlayerProps> { props `->`
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

2. `VideoPlayerProps` インターフェースは `VideoPlayer` コンポーネントが null 許容でない `Video` を取ることを指定しているため、`App` コンポーネントでこれに確実に対応してください。

   `App.kt` で、ビデオプレーヤーの以前の `div` スニペットを次のように置き換えます。

   ```kotlin
   currentVideo?.let { curr `->`
       VideoPlayer {
           video = curr
       }
   }
   ```

   [`let` スコープ関数](scope-functions#let) は、`VideoPlayer` コンポーネントが `state.currentVideo` が null でない場合にのみ追加されるようにします。

これで、リストのエントリをクリックすると、ビデオプレーヤーが起動し、クリックされたエントリの情報が入力されます。

### ボタンを追加してワイヤリングする

ユーザーが動画を視聴済みまたは未視聴としてマークし、2 つのリスト間で移動できるようにするには、`VideoPlayer` コンポーネントにボタンを追加します。

このボタンは 2 つの異なるリスト間で動画を移動するため、状態の変更を処理するロジックを `VideoPlayer` から _リフト_ して、prop として親から渡す必要があります。ボタンは、動画が視聴されたかどうかに基づいて異なって表示される必要があります。これも prop として渡す必要がある情報です。

1. `VideoPlayerProps` インターフェースを `VideoPlayer.kt` で展開して、それらの 2 つのケースのプロパティを含めます。

   ```kotlin
   external interface VideoPlayerProps : Props {
       var video: Video
       var onWatchedButtonPressed: (Video) `->` Unit
       var unwatchedVideo: Boolean
   }
   ```

2. これで、ボタンを実際のコンポーネントに追加できます。次のスニペットを `VideoPlayer` コンポーネントの本体に、`h3` タグと `img` タグの間に追加します。

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

   スタイルを動的に変更できる Kotlin CSS DSL の助けを借りて、基本的な Kotlin `if` 式を使用してボタンの色を変更できます。

### 動画リストをアプリケーション状態に移動