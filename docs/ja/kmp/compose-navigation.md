[//]: # (title: Composeのナビゲーション)

[AndroidのNavigationライブラリ](https://developer.android.com/guide/navigation)は、Jetpack Composeでのナビゲーションをサポートしています。
Compose Multiplatformチームは、AndroidX Navigationライブラリにマルチプラットフォームサポートを提供しています。

アプリ内のコンテンツ間での実際のナビゲーションとは別に、このライブラリは基本的なナビゲーションの問題を解決します。

*   型安全な方法で宛先間でデータを渡す。
*   明確でアクセスしやすいナビゲーション履歴を保持することで、ユーザーのアプリ内での移動経路を簡単に追跡できるようにする。
*   通常のワークフロー外からユーザーをアプリ内の特定の場所にナビゲートできるディープリンクのメカニズムをサポートする。
*   ナビゲーション時に統一されたアニメーションとトランジションをサポートし、少ない追加作業で戻るジェスチャーなどの一般的なパターンを可能にする。

基本を十分に理解している場合は、[[](compose-navigation-routing.md)](compose-navigation-routing.md)に進み、クロスプラットフォームプロジェクトでNavigationライブラリを活用する方法を学びましょう。そうでない場合は、ライブラリが扱う基本的な概念について読み進めてください。

> Compose MultiplatformバージョンのNavigationライブラリへの変更は、[最新情報](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html)で追跡できます。
> または、[Compose Multiplatformチェンジログ](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md)で特定のEAPリリースをフォローしてください。
>
{style="tip"}

## Compose Navigationの基本概念

Navigationライブラリは、ナビゲーションのユースケースを以下のような概念にマッピングするために使用します。

*   _ナビゲーショングラフ_は、アプリ内のすべての可能な宛先とそれらの間の接続を記述します。
    ナビゲーショングラフは、アプリ内のサブフローに対応するためにネストできます。
*   _宛先_は、ナビゲーショングラフ内のナビゲート可能なノードです。
    これは、`composable`、ネストされたナビゲーショングラフ、またはダイアログのいずれかです。
    ユーザーが宛先にナビゲートすると、アプリはそのコンテンツを表示します。
*   _ルート_は、宛先を識別し、それにナビゲートするために必要な引数を定義しますが、UIを記述するものではありません。
    このように、データが表現から分離されることで、各UIの実装をアプリ全体の構造から独立させることができます。
    これにより、例えば、プロジェクト内の`composables`をテストしたり再配置したりすることが容易になります。

これらの概念を念頭に置いて、Navigationライブラリはナビゲーションアーキテクチャを導くための基本的なルールを実装しています。

<!--* There is a fixed _start destination_, the first screen a user **usually** sees when they launch the app.
  Conditional screens like initial setup or login should not be considered
  start destinations even if they are unavoidable for a new user, think about the primary workflow.-->
<!-- Android introduces this concept, but in our docs there is no use for it so far. Maybe later on. -->

*   アプリは、ユーザーのパスを宛先のスタック、つまり_バックスタック_として表します。
    デフォルトでは、ユーザーが新しい宛先にナビゲートされるたびに、その宛先がスタックの最上位に追加されます。
    バックスタックを使用すると、ナビゲーションをより簡単に行うことができます。
    直接前後を行き来する代わりに、現在の宛先をスタックの最上位からポップし、自動的に前の宛先に戻ることができます。
*   各宛先には、一連の_ディープリンク_が関連付けられています。
    これらは、アプリがオペレーティングシステムからリンクを受信したときにその宛先に繋がるべきURIパターンです。

## 基本的なナビゲーションの例

Navigationライブラリを使用するには、`commonMain`ソースセットに次の依存関係を追加します。

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

> Compose Multiplatform %org.jetbrains.compose%は、Navigationライブラリバージョン%org.jetbrains.androidx.navigation%を必要とします。
>
{style="note"}

ナビゲーションを設定するために必要な手順には、意味のある順序があります。

1.  ルートを定義します。
    各宛先に対応する、必要な引数を保持するための[serializable](https://kotlinlang.org/docs/serialization.html)な`object`または`data class`を作成します。
2.  `NavController`を作成します。これはナビゲーションインターフェースとなり、すべての`composables`がアクセスできるように、`composable`階層のできるだけ上位に配置します。
    `NavController`はアプリのバックスタックを保持し、ナビゲーショングラフ内の宛先間を遷移するためのメソッドを提供します。
3.  ルートの1つを開始宛先として選択し、ナビゲーショングラフを設計します。
    これを行うには、ナビゲーショングラフ（ナビゲーション可能なすべての宛先を記述する）を保持する`NavHost` `composable`を作成します。

以下は、アプリ内でナビゲートするための基本的な基盤の例です。

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

### Navigationライブラリの主要なクラス

Navigationライブラリは、以下のコアタイプを提供します。

*   `NavController`。
    コアナビゲーション機能のためのAPIを提供します。宛先間の遷移、ディープリンクの処理、バックスタックの管理などです。
    <!--You should create the `NavController` high in your composable hierarchy, high enough that all the composables
    that need to reference it can do so.
    This way, you can use the `NavController` as the single source of truth for updating composables outside of your screens.
    [NB: This doesn't seem to be useful to people who are trying to cover the basics.]-->
*   `NavHost`。ナビゲーショングラフに基づいて現在の宛先のコンテンツを表示する`Composable`です。
    各`NavHost`には必須の`startDestination`パラメーターがあります。これは、ユーザーがアプリを起動したときに最初に表示されるべき画面に対応する宛先です。
*   `NavGraph`。
    アプリ内のすべての可能な宛先とそれらの間の接続を記述します。
    ナビゲーショングラフは通常、`NavGraph`を返すビルダーラムダとして定義されます。例えば、`NavHost`宣言内などです。

コアタイプ機能の他に、Navigationコンポーネントはアニメーションとトランジション、ディープリンクのサポート、型安全性、`ViewModel`のサポート、およびアプリナビゲーションを処理するためのその他の開発体験を向上させる機能を提供します。

## ナビゲーションのユースケース

### 宛先に移動する

宛先にナビゲートするには、`NavController.navigate()`関数を呼び出します。上記の例を続けると次のようになります。

```kotlin
Button(onClick = { navController.navigate(Profile) }) {
    Text("Go to profile")
}
```

### 宛先に引数を渡す

ナビゲーショングラフを設計する際、次のようにパラメーターを持つ`data class`としてルートを定義できます。

```kotlin
@Serializable
data class Profile(val name: String)
```

宛先に引数を渡すには、宛先にナビゲートする際に、対応するクラスコンストラクターに引数を渡します。

```kotlin
Button(onClick = { navController.navigate(Profile("Alice")) }) {
    Text("Go to profile")
}
```

次に、宛先でデータを取得します。

```kotlin
composable<Profile> { backStackEntry ->
    val profile: Profile = backStackEntry.toRoute()
    
    // Use `profile.name` wherever a user's name is needed
}
```

### ナビゲーション時に複雑なデータを取得する

宛先間をナビゲートする際は、最小限必要な情報のみを渡すことを検討してください。
アプリ全体の状態を反映するファイルや複雑なオブジェクトは、データレイヤーに格納する必要があります。
ユーザーが宛先に着地したら、UIは信頼できる唯一の情報源から実際のデータを読み込む必要があります。

例：

*   ユーザープロフィール全体を渡す**のではなく**、宛先でプロフィールを取得するためのユーザーIDを渡しましょう。
*   画像オブジェクトを渡す**のではなく**、宛先でソースから画像を読み込めるURIやファイル名を渡しましょう。
*   アプリケーションの状態や`ViewModels`を渡す**のではなく**、宛先画面が機能するために必要な情報のみを渡しましょう。

このアプローチは、設定変更中のデータ損失や、参照されるオブジェクトが更新または変更された場合の不整合を防ぐのに役立ちます。

アプリでデータレイヤーを適切に実装するためのガイダンスについては、[Androidのデータレイヤーに関する記事](https://developer.android.com/topic/architecture/data-layer)を参照してください。

### バックスタックの管理

バックスタックは`NavController`クラスによって制御されます。
他のスタックと同様に、`NavController`は新しいアイテムをスタックの最上位にプッシュし、最上位からポップします。

*   アプリが起動すると、バックスタックに表示される最初の項目は`NavHost`で定義された開始宛先です。
*   デフォルトでは、`NavController.navigate()`の各呼び出しは、与えられた宛先をスタックの最上位にプッシュします。
*   戻るジェスチャー、戻るボタン、または`NavController.popBackStack()`メソッドを使用すると、現在の宛先がスタックからポップされ、ユーザーは前の宛先に戻ります。
    ユーザーがディープリンクをたどって現在の宛先に到達した場合、スタックをポップすると前のアプリに戻ります。
    あるいは、`NavController.navigateUp()`関数は、`NavController`のコンテキスト内でアプリ内のみをナビゲートします。

Navigationライブラリは、バックスタックの処理に関してある程度の柔軟性を許容します。
次のようなことができます。

*   バックスタック内の特定の宛先を指定し、それにナビゲートして、その宛先の上にある（その後に来た）すべてのものをスタックからポップする。
*   宛先Yまでバックスタックをポップしながら、宛先Xに同時にナビゲートする（`.navigate()`呼び出しに`popUpTo()`引数を追加することで）。
*   空のバックスタックをポップする処理（ユーザーが空の画面に着地する）を行う。
*   アプリの異なる部分に複数のバックスタックを保持する。
    例えば、下部ナビゲーションを持つアプリでは、タブを切り替えるときにナビゲーションの状態を保存および復元しながら、各タブに個別のネストされたグラフを保持できます。
    あるいは、各タブに個別の`NavHost`を作成することもできます。これにより、セットアップは少し複雑になりますが、場合によっては追跡しやすくなるかもしれません。

詳細とユースケースについては、[Jetpack Composeのバックスタックに関するドキュメント](https://developer.android.com/guide/navigation/backstack)を参照してください。

### ディープリンク

Navigationライブラリを使用すると、特定のURI、アクション、またはMIMEタイプを宛先に関連付けることができます。
この関連付けを_ディープリンク_と呼びます。

デフォルトでは、ディープリンクは外部アプリに公開されません。各ターゲット配布に対して、適切なURIスキームをオペレーティングシステムに登録する必要があります。

ディープリンクの作成、登録、および処理の詳細については、[[](compose-navigation-deep-links.md)](compose-navigation-deep-links.md)を参照してください。

### 戻るジェスチャー

マルチプラットフォームNavigationライブラリは、各プラットフォームでの戻るジェスチャーを前の画面へのナビゲーションに変換します
（例えば、iOSでは単純な戻るスワイプ、デスクトップでは<shortcut>Esc</shortcut>キーです）。

デフォルトでは、iOSでは戻るジェスチャーが別の画面へのスワイプ遷移のネイティブのようなアニメーションをトリガーします。
`enterTransition`または`exitTransition`引数で`NavHost`アニメーションをカスタマイズした場合、デフォルトのアニメーションはトリガーされません。

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

Androidでは、[マニフェストファイル](https://developer.android.com/guide/navigation/custom-back/predictive-back-gesture#opt-predictive)で戻るジェスチャーハンドラーを有効または無効にできます。

iOSでは、ハンドラーはデフォルトで有効になっています。
無効にするには、`ViewController`構成でこのフラグを設定します。

```kotlin
ComposeUIViewController(
    configure = { enableBackGesture = false }
) {
    App()
}
```

## 代替ナビゲーションソリューション

Composeベースのナビゲーション実装が要件に合わない場合、評価すべきサードパーティの代替ソリューションがあります。

| 名前                                                | 説明                                                                                                                                                     |
|-----------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Voyager](https://voyager.adriel.cafe)              | ナビゲーションへの実践的なアプローチ                                                                                                                              |
| [Decompose](https://arkivanov.github.io/Decompose/) | 完全なライフサイクルと潜在的な依存性注入をカバーするナビゲーションへの高度なアプローチ                                                                                       |
| [Circuit](https://slackhq.github.io/circuit/)       | ナビゲーションと高度な状態管理を備えたKotlinアプリケーション向けのCompose主導のアーキテクチャ。                                                            |
| [Appyx](https://bumble-tech.github.io/appyx/)       | ジェスチャー制御を備えたモデル駆動型ナビゲーション                                                                                                                    |
| [PreCompose](https://tlaster.github.io/PreCompose/) | Jetpack Lifecycle、ViewModel、LiveData、およびNavigationに触発されたナビゲーションおよびビューモデル                                                                  |

## 次のステップ

Composeナビゲーションは、Android Developerポータルで詳細にカバーされています。
このドキュメントではAndroidのみの例が使用されている場合がありますが、基本的なガイダンスとナビゲーションの原則はMultiplatformでも同じです。

*   [Composeによるナビゲーションの概要](https://developer.android.com/develop/ui/compose/navigation)。
*   [Jetpack Navigationの開始ページ](https://developer.android.com/guide/navigation)（ナビゲーショングラフ、その中での移動、その他のナビゲーションユースケースに関するサブページを含む）。