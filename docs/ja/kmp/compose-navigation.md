[//]: # (title: Compose でのナビゲーション)

[Android の Navigation ライブラリ](https://developer.android.com/guide/navigation)は、Jetpack Compose でのナビゲーションをサポートしています。
Compose Multiplatform チームは、AndroidX Navigation ライブラリへのマルチプラットフォーム サポートの提供に貢献しています。

アプリ内のコンテンツ間の実際のナビゲーション以外に、このライブラリは以下のような基本的なナビゲーションの課題を解決します。

* デスティネーション間で型安全な方法でデータを渡す。
* 明確でアクセス可能なナビゲーション履歴を保持することで、アプリを通じたユーザーのジャーニーを簡単に追跡できるようにする。
* 通常のワークフロー以外からアプリの特定の場所にユーザーを誘導できる、ディープリンクの仕組みをサポートする。
* ナビゲーション時の統一されたアニメーションとトランジションをサポートするほか、最小限の追加作業で「戻る」ジェスチャーなどの一般的なパターンを利用できるようにする。

基本概念を十分に理解している場合は、[ナビゲーションとルーティング](compose-navigation-routing.md)に進み、クロスプラットフォーム プロジェクトで Navigation ライブラリを活用する方法を学んでください。
そうでない場合は、このまま読み進めてライブラリが扱う基本概念について学んでください。

> Navigation ライブラリのマルチプラットフォーム版の変更点は、[最新情報](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)で確認するか、[Compose Multiplatform の変更履歴](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)で特定の EAP リリースを追跡できます。
>
{style="tip"}

## Compose ナビゲーションの基本概念

Navigation ライブラリでは、ナビゲーションのユースケースを以下の概念にマッピングします。

* **ナビゲーション グラフ (navigation graph)** は、アプリ内のすべての可能なデスティネーションとそれらの間の接続を記述します。ナビゲーション グラフは、アプリ内のサブフローに合わせてネストさせることができます。
* **デスティネーション (destination)** は、ナビゲーション グラフ内の移動先となるノードです。これはコンポーザブル、ネストされたナビゲーション グラフ、またはダイアログになります。ユーザーがデスティネーションに移動すると、アプリはそのコンテンツを表示します。
* **ルート (route)** はデスティネーションを識別し、そこに移動するために必要な引数を定義しますが、UI の記述については何も行いません。このようにデータと表現を分離することで、各 UI 実装をアプリ全体の構造から独立させることができます。これにより、例えばプロジェクト内でのコンポーザブルのテストや配置換えが容易になります。

これらの概念を念頭に置いて、Navigation ライブラリはナビゲーション アーキテクチャを導くための基本的なルールを実装しています。

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

* アプリは、ユーザーの経路をデスティネーションのスタック、すなわち**バックスタック (back stack)** として表現します。デフォルトでは、ユーザーが新しいデスティネーションに移動するたびに、そのデスティネーションがスタックの最上部に追加されます。バックスタックを使用すると、ナビゲーションをより分かりやすくできます。直接あちこちに移動する代わりに、現在のデスティネーションをスタックの最上部からポップして、自動的に前のデスティネーションに戻ることができます。
* 各デスティネーションには、一連の**ディープリンク (deep links)** を関連付けることができます。これは、アプリがオペレーティング システムからリンクを受け取ったときに、そのデスティネーションに導くべき URI パターンです。

## 基本的なナビゲーションの例

Navigation ライブラリを使用するには、`commonMain` ソースセットに以下の依存関係を追加します。

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.navigation:navigation-compose:%org.jetbrains.androidx.navigation%"}

ナビゲーションを設定するために必要な手順には、理にかなった順序があります。

1. **ルートを定義する。**
   対応するデスティネーションが必要とする引数を保持するために、各デスティネーションに対して [シリアライズ可能 (serializable)](https://kotlinlang.org/docs/serialization.html) なオブジェクトまたはデータクラスを作成します。
2. **`NavController` を作成する。**
   これはナビゲーション インターフェースとなります。すべてのコンポーザブルがアクセスできるように、コンポーザブル階層の十分に高い位置で作成します。`NavController` はアプリのバックスタックを保持し、ナビゲーション グラフ内のデスティネーション間を遷移するメソッドを提供します。
3. **ナビゲーション グラフを設計する。**
   ルートの 1 つを開始デスティネーションとして選択します。これを行うには、ナビゲーション グラフ（すべてのナビゲート可能なデスティネーションを記述したもの）を保持する `NavHost` コンポーザブルを作成します。

以下は、アプリ内ナビゲーションの基盤となる基本的な例です。

```kotlin
// ルートを作成
@Serializable
object Profile
@Serializable
object FriendsList

// NavController を作成
val navController = rememberNavController()

// 提供されたデスティネーションで構成されるナビゲーション グラフを持つ NavHost を作成
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // 同様にしてさらにデスティネーションを追加できます
}
```

### Navigation ライブラリの主要クラス

Navigation ライブラリは、以下のコア型を提供します。

* `NavController`: コアなナビゲーション機能のための API を提供します。デスティネーション間の遷移、ディープリンクの処理、バックスタックの管理などを行います。
* `NavHost`: ナビゲーション グラフに基づいて、現在のデスティネーションのコンテンツを表示するコンポーザブルです。各 `NavHost` には必須の `startDestination` パラメータがあります。これは、ユーザーがアプリを起動したときに最初に表示される画面に対応するデスティネーションです。
* `NavGraph`: アプリ内のすべての可能なデスティネーションとそれらの間の接続を記述します。ナビゲーション グラフは通常、`NavHost` 宣言内などで、`NavGraph` を返すビルダー ラムダとして定義されます。

コア型の機能に加えて、Navigation コンポーネントはアニメーションとトランジション、ディープリンクのサポート、型安全性、`ViewModel` サポート、およびアプリのナビゲーションを処理するためのその他の便利な機能を提供します。

## ナビゲーションのユースケース

### デスティネーションに移動する

デスティネーションに移動するには、`NavController.navigate()` 関数を呼び出します。上記の例を続けると以下のようになります。

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### デスティネーションに引数を渡す

ナビゲーション グラフを設計する際、ルートをパラメータ付きのデータクラスとして定義できます。例えば以下の通りです。

```kotlin
@Serializable
data class Profile(val name: String)
```

デスティネーションに引数を渡すには、そのデスティネーションに移動する際、対応するクラスのコンストラクターに引数を渡します。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

次に、デスティネーションでデータを取り出します。

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // ユーザーの名前が必要な場所で `profile.name` を使用します
}
```

### ナビゲーション時に複雑なデータを取得する

デスティネーション間を移動する際は、必要最小限の情報のみを渡すようにしてください。ファイルや、アプリ全体の論理的な状態を反映する複雑なオブジェクトは、データレイヤーに保存すべきです。ユーザーがデスティネーションに到達した際、UI は信頼できる唯一の情報源 (Single Source of Truth) から実際のデータを読み込むようにします。

例:

* ユーザープロファイル全体を**渡さないでください**。デスティネーションでプロファイルを取得するために、ユーザー ID を**渡してください**。
* 画像オブジェクトを**渡さないでください**。デスティネーションでソースから画像を読み込めるように、URI やファイル名を**渡してください**。
* アプリケーションの状態や ViewModel を**渡さないでください**。デスティネーション画面が動作するために必要な情報のみを**渡してください**。

このアプローチは、構成変更（Configuration Changes）中のデータ損失を防ぎ、参照先のオブジェクトが更新または変更された際の不整合を防ぐのに役立ちます。

アプリでデータレイヤーを適切に実装するためのガイダンスについては、[Android のデータレイヤーに関する記事](https://developer.android.com/topic/architecture/data-layer)を参照してください。

### バックスタックを管理する

バックスタックは `NavController` クラスによって制御されます。他のスタックと同様に、`NavController` は新しいアイテムをスタックの最上部にプッシュし、最上部からポップします。

* アプリが起動すると、バックスタックに最初に表示されるエントリは、`NavHost` で定義された開始デスティネーションです。
* 各 `NavController.navigate()` 呼び出しは、デフォルトで指定されたデスティネーションをスタックの最上部にプッシュします。
* 戻るジェスチャー、戻るボタン、または `NavController.popBackStack()` メソッドを使用すると、現在のデスティネーションがスタックからポップされ、ユーザーは前のデスティネーションに戻ります。ユーザーがディープリンクを辿って現在のデスティネーションに来た場合、スタックをポップすると前のアプリに戻ります。あるいは、`NavController.navigateUp()` 関数は、`NavController` のコンテキスト内、つまりアプリ内でのみユーザーを戻します。

Navigation ライブラリでは、バックスタックの処理に柔軟性があります。以下のことが可能です。

* バックスタック内の特定のデスティネーションを指定してそこに移動し、そのデスティネーションの上にある（後に来た）スタック内のすべてをポップする。
* デスティネーション X に移動すると同時に、デスティネーション Y までバックスタックをポップする（`.navigate()` 呼び出しに `popUpTo()` 引数を追加する）。
* 空のバックスタックをポップする処理を行う（これによりユーザーは空の画面にたどり着くことになります）。
* アプリの異なる部分に対して複数のバックスタックを維持する。例えば、ボトムナビゲーションを持つアプリでは、タブを切り替える際にナビゲーション状態を保存および復元しながら、各タブに対して個別のネストされたグラフを維持できます。あるいは、各タブに対して個別の `NavHost` を作成することもできます。これは設定が少し複雑になりますが、場合によっては管理しやすくなります。

詳細とユースケースについては、[バックスタックに関する Jetpack Compose ドキュメント](https://developer.android.com/guide/navigation/backstack)を参照してください。

### ディープリンク

Navigation ライブラリを使用すると、特定の URI、アクション、または MIME タイプをデスティネーションに関連付けることができます。この関連付けは**ディープリンク (deep link)** と呼ばれます。

デフォルトでは、ディープリンクは外部アプリに公開されません。ターゲットとなる各配布プラットフォームのオペレーティングシステムに、適切な URI スキームを登録する必要があります。

ディープリンクの作成、登録、および処理の詳細については、[ディープリンク](compose-navigation-deep-links.md)を参照してください。

### 戻るジェスチャー

マルチプラットフォームの Navigation ライブラリは、各プラットフォームでの戻るジェスチャーを前の画面への移動に変換します（例えば、iOS ではシンプルな「戻るスワイプ」、デスクトップでは <shortcut>Esc</shortcut> キー）。

デフォルトでは、iOS で戻るジェスチャーを行うと、別の画面へのスワイプ遷移というネイティブのようなアニメーションがトリガーされます。`enterTransition` または `exitTransition` 引数を使用して `NavHost` のアニメーションをカスタマイズした場合、デフォルトのアニメーションはトリガーされません。

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // トランジションを明示的に指定すると、デフォルトのアニメーションが無効になり、
    // 選択されたアニメーションが優先されます
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

Android では、[マニフェストファイルで](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive)戻るジェスチャーハンドラーを有効または無効にできます。

iOS では、ハンドラーはデフォルトで有効になっています。無効にするには、`ViewController` の構成でこのフラグを設定します。

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 代替のナビゲーション ソリューション

Compose ベースのナビゲーション実装が要件に合わない場合は、検討すべきサードパーティの代替案があります。

| 名前 | 説明 |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | ナビゲーションへの実用的なアプローチ |
| [Decompose](https://arkivanov.github.io/Decompose/) | フルライフサイクルと潜在的な依存関係注入のすべてをカバーする、ナビゲーションへの高度なアプローチ |
| [Circuit](https://slackhq.github.io/circuit/)       | ナビゲーションと高度な状態管理を備えた、Kotlin アプリケーション向けの Compose 駆動アーキテクチャ |
| [Appyx](https://bumble-tech.github.io/appyx/)       | ジェスチャー制御を備えたモデル駆動型ナビゲーション |
| [PreCompose](https://tlaster.github.io/PreCompose/) | Jetpack Lifecycle、ViewModel、LiveData、および Navigation にインスパイアされたナビゲーションと ViewModel |

## 次のステップ

Compose のナビゲーションについては、Android デベロッパー ポータルで詳しく説明されています。これらのドキュメントでは Android 専用の例が使われていることがありますが、基本的なガイダンスとナビゲーションの原則はマルチプラットフォームでも同じです。

* [Compose でのナビゲーションの概要](https://developer.android.com/develop/ui/compose/navigation)
* [Jetpack Navigation の開始ページ](https://developer.android.com/guide/navigation)（ナビゲーション グラフ、グラフ内の移動、およびその他のナビゲーション ユースケースに関するサブページを含む）