[//]: # (title: Composeにおけるナビゲーション)

[AndroidのNavigationライブラリ](https://developer.android.com/guide/navigation)は、Jetpack Composeにおけるナビゲーションをサポートしています。
Compose Multiplatformチームは、AndroidX Navigationライブラリへのマルチプラットフォームサポートに貢献しています。

アプリ内のコンテンツ間の実際のナビゲーションとは別に、このライブラリは基本的なナビゲーションの問題を解決します。

*   型安全な方法でデスティネーション間でのデータ受け渡しを行う。
*   明確でアクセスしやすいナビゲーション履歴を保持することで、ユーザーのアプリ内での操作経路を簡単に追跡できるようにする。
*   通常のワークフロー外から、ユーザーをアプリ内の特定の場所にナビゲートできるようにするディープリンクのメカニズムをサポートする。
*   ナビゲーション時の統一されたアニメーションとトランジションをサポートし、少ない追加作業で戻るジェスチャーのような一般的なパターンを可能にする。

基本に十分に慣れている場合は、[Navigationとルーティング](compose-navigation-routing.md)に進み、クロスプラットフォームプロジェクトでNavigationライブラリを活用する方法を学びましょう。
そうでない場合は、引き続きライブラリが扱う基本的な概念について読み進めてください。

> Navigationライブラリのマルチプラットフォーム版への変更は、[What's new](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)で追跡するか、特定のEAPリリースを[Compose Multiplatform changelog](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)で確認できます。
>
{style="tip"}

## Compose Navigationの基本概念

Navigationライブラリは、ナビゲーションのユースケースを以下の概念にマッピングして使用します。

*   _ナビゲーショングラフ_は、アプリ内のすべての可能なデスティネーションとそれらの間の接続を記述します。ナビゲーショングラフは、アプリ内のサブフローに対応するためにネストできます。
*   _デスティネーション_は、ナビゲーショングラフ内のナビゲート可能なノードです。これは、コンポーザブル、ネストされたナビゲーショングラフ、またはダイアログになり得ます。ユーザーがデスティネーションにナビゲートすると、アプリはそのコンテンツを表示します。
*   _ルート_は、デスティネーションを識別し、それにナビゲートするために必要な引数を定義しますが、UIを記述することはありません。このようにして、データは表現から分離され、UIの実装の各部分をアプリ全体の構造から独立させることができます。これにより、例えば、プロジェクト内のコンポーザブルのテストや再配置が容易になります。

これらの概念を念頭に置いて、Navigationライブラリはナビゲーションアーキテクチャを導くための基本的なルールを実装しています。

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

*   アプリは、ユーザーのパスをデスティネーションのスタック、つまり_バックスタック_として表現します。
    デフォルトでは、ユーザーが新しいデスティネーションにナビゲートされるたびに、そのデスティネーションがスタックの最上部に追加されます。
    バックスタックを使用すると、ナビゲーションをより簡単に行うことができます。直接前後にナビゲートする代わりに、現在のデスティネーションをスタックの最上部からポップし、自動的に前のデスティネーションに戻ることができます。
*   各デスティネーションには、一連の_ディープリンク_を関連付けることができます。これは、アプリがオペレーティングシステムからリンクを受け取ったときにそのデスティネーションに誘導するURIパターンです。

## 基本的なナビゲーションの例

Navigationライブラリを使用するには、`commonMain`ソースセットに以下の依存関係を追加します。

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

> Compose Multiplatform %org.jetbrains.compose% は Navigationライブラリバージョン %org.jetbrains.androidx.navigation% を必要とします。
>
{style="note"}

ナビゲーションを設定するために必要な手順には、理にかなった順序があります。

1.  ルートを定義します。
    各デスティネーションに対応する引数を保持するために、[シリアライズ可能](https://kotlinlang.org/docs/serialization.html)なオブジェクトまたはデータクラスを作成します。
2.  `NavController`を作成します。これは、すべてのコンポーザブルがアクセスできる十分な上位のコンポーザブル階層にあるナビゲーションインターフェースになります。
    `NavController`はアプリのバックスタックを保持し、ナビゲーショングラフ内のデスティネーション間を遷移するためのメソッドを提供します。
3.  いずれかのルートを開始デスティネーションとして選択して、ナビゲーショングラフを設計します。
    これを行うには、ナビゲーショングラフ（すべてのナビゲート可能なデスティネーションを記述するもの）を保持する`NavHost`コンポーザブルを作成します。

以下は、アプリ内ナビゲーションの基盤となる基本的な例です。

```kotlin
// Creates routes
@Serializable
object Profile
@Serializable
object FriendsList

// Creates the NavController
val navController = rememberNavController()

// Creates the NavHost with the navigation graph consisting of supplied destinations
NavHost(navController = navController, startDestination = Profile) {
    composable<Profile> { ProfileScreen( /* ... */ ) }
    composable<FriendsList> { FriendsListScreen( /* ... */ ) }
    // You can add more destinations similarly
}
```

### Navigationライブラリの主要クラス

Navigationライブラリは、以下のコアタイプを提供します。

*   `NavController`。
    デスティネーション間の遷移、ディープリンクの処理、バックスタックの管理など、コアナビゲーション機能のAPIを提供します。
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
*   `NavHost`。ナビゲーショングラフに基づいて、現在のデスティネーションのコンテンツを表示するコンポーザブルです。
    各`NavHost`には必須の`startDestination`パラメータがあります。これは、ユーザーがアプリを起動したときに最初に表示されるべき画面に対応するデスティネーションです。
*   `NavGraph`。
    アプリ内のすべての可能なデスティネーションとそれらの間の接続を記述します。
    ナビゲーショングラフは通常、`NavHost`宣言などで、`NavGraph`を返すビルダーラムダとして定義されます。

コアタイプの機能に加えて、Navigationコンポーネントは、アニメーションとトランジション、ディープリンクのサポート、型安全性、`ViewModel`サポート、およびアプリナビゲーションを扱うためのその他の品質向上機能を提供します。

## ナビゲーションのユースケース

### デスティネーションに移動する

デスティネーションにナビゲートするには、`NavController.navigate()`関数を呼び出します。上記の例を続けると:

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### デスティネーションに引数を渡す

ナビゲーショングラフを設計する際、例えば、ルートをパラメータを持つデータクラスとして定義できます。

```kotlin
@Serializable
data class Profile(val name: String)
```

デスティネーションに引数を渡すには、デスティネーションにナビゲートする際に、対応するクラスコンストラクタに引数を渡します。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

その後、デスティネーションでデータを取得します。

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // Use `profile.name` wherever a user's name is needed
}
```

### ナビゲート時に複雑なデータを取得する

デスティネーション間をナビゲートする際は、必要最小限の情報のみを渡すことを検討してください。
ファイルや、アプリ全体の状態を反映する複雑なオブジェクトは、データレイヤーに保存すべきです。ユーザーがデスティネーションに到達したら、UIは真実の唯一のソースから実際のデータをロードする必要があります。

例:

*   ユーザープロファイル全体を渡す**のではなく**、デスティネーションでプロファイルを取得するためのユーザーIDを渡して**ください**。
*   画像オブジェクトを渡す**のではなく**、デスティネーションでソースから画像をロードできるURIまたはファイル名を渡して**ください**。
*   アプリケーションの状態やViewModelを渡す**のではなく**、デスティネーション画面が機能するために必要な情報のみを渡して**ください**。

このアプローチは、設定変更時のデータ損失や、参照されるオブジェクトが更新または変更された際の不整合を防ぐのに役立ちます。

アプリでデータレイヤーを適切に実装するためのガイダンスについては、[Androidのデータレイヤーに関する記事](https://developer.android.com/topic/architecture/data-layer)を参照してください。

### バックスタックの管理

バックスタックは`NavController`クラスによって制御されます。他のスタックと同様に、`NavController`は新しいアイテムをスタックの最上部にプッシュし、最上部からポップします。

*   アプリ起動時、バックスタックに最初に表示されるエントリは、NavHostで定義された開始デスティネーションです。
*   各`NavController.navigate()`呼び出しは、デフォルトで指定されたデスティネーションをスタックの最上部にプッシュします。
*   戻るジェスチャー、戻るボタン、または`NavController.popBackStack()`メソッドを使用すると、現在のデスティネーションがスタックからポップされ、ユーザーは前のデスティネーションに戻ります。ユーザーがディープリンクをたどって現在のデスティネーションに到達した場合、スタックをポップすると前のアプリに戻ります。あるいは、`NavController.navigateUp()`関数は、`NavController`のコンテキスト内でユーザーをアプリ内でのみナビゲートします。

Navigationライブラリは、バックスタックの処理に関してある程度の柔軟性を可能にします。以下を行うことができます。

*   バックスタック内の特定のデスティネーションを指定し、そこにナビゲートして、そのデスティネーションの上にある（後に来た）スタック上のすべてをポップする。
*   デスティネーションXにナビゲートすると同時に、デスティネーションYまでのバックスタックをポップする（`.navigate()`呼び出しに`popUpTo()`引数を追加することで）。
*   空のバックスタックをポップする処理を行う（これにより、ユーザーは空の画面に移動することになります）。
*   アプリの異なる部分に対して複数のバックスタックを保持する。例えば、ボトムナビゲーションを持つアプリの場合、各タブに対して個別のネストされたグラフを保持し、タブ切り替え時にナビゲーション状態を保存および復元できます。あるいは、各タブに個別のNavHostを作成することもできます。これは設定が少し複雑になりますが、場合によっては追跡が容易になる可能性があります。

詳細とユースケースについては、[Jetpack Composeのバックスタックに関するドキュメント](https://developer.android.com/guide/navigation/backstack)を参照してください。

### ディープリンク

Navigationライブラリを使用すると、特定のURI、アクション、またはMIMEタイプをデスティネーションに関連付けることができます。この関連付けは_ディープリンク_と呼ばれます。

デフォルトでは、ディープリンクは外部アプリに公開されません。各ターゲット配布に対して、オペレーティングシステムに適切なURIスキームを登録する必要があります。

ディープリンクの作成、登録、および処理の詳細については、[ディープリンク](compose-navigation-deep-links.md)を参照してください。

### 戻るジェスチャー

マルチプラットフォームNavigationライブラリは、各プラットフォームでの戻るジェスチャーを前の画面へのナビゲーションに変換します（例えば、iOSでは単純なスワイプ操作、デスクトップでは<shortcut>Esc</shortcut>キー）。

デフォルトでは、iOSで戻るジェスチャーは、別の画面へのスワイプ遷移のネイティブのようなアニメーションをトリガーします。`enterTransition`または`exitTransition`引数でNavHostアニメーションをカスタマイズした場合、デフォルトのアニメーションはトリガーされません。

```kotlin
NavHost(
    navController = navController,
    startDestination = Profile,
    // Explicitly specifying transitions turns off default animations
    // in favor of the selected ones 
    enterTransition = { slideInHorizontally() },
    exitTransition = { slideOutVertically() }
) { ... }
```

Androidでは、[マニフェストファイル](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive)で戻るジェスチャーハンドラを有効または無効にできます。

iOSでは、このハンドラはデフォルトで有効になっています。
無効にするには、ViewControllerの設定でこのフラグを設定します。

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 代替ナビゲーションソリューション

Composeベースのナビゲーション実装が適切でない場合、評価すべきサードパーティの代替ソリューションがあります。

| 名称                                                | 説明                                                                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | ナビゲーションへの実用的なアプローチ                                                                                                                              |
| [Decompose](https://arkivanov.github.io/Decompose/) | 完全なライフサイクルと潜在的な依存性注入をすべてカバーする、ナビゲーションへの高度なアプローチ                                                        |
| [Circuit](https://slackhq.github.io/circuit/)       | ナビゲーションと高度な状態管理を備えたKotlinアプリケーション向けのCompose主導アーキテクチャ。                                                            |
| [Appyx](https://bumble-tech.github.io/appyx/)       | ジェスチャーコントロールを備えたモデル駆動型ナビゲーション                                                                                                                    |
| [PreCompose](https://tlaster.github.io/PreCompose/) | Jetpack Lifecycle, ViewModel, LiveData, Navigationにインスパイアされたナビゲーションおよびビューモデル                                                                  |

## 次のステップ

Composeナビゲーションは、Android Developerポータルで詳細に解説されています。
時折、このドキュメントではAndroid専用の例が使用されていますが、基本的なガイダンスとナビゲーションの原則はMultiplatformでも同じです。

*   [Composeでのナビゲーションの概要](https://developer.android.com/develop/ui/compose/navigation)。
*   [Jetpack Navigationの開始ページ](https://developer.android.com/guide/navigation)（ナビゲーショングラフ、それらの移動、その他のナビゲーションユースケースに関するサブページを含む）。