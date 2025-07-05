---
title: Androidスコープ
---

## Androidライフサイクルとの連携

Androidコンポーネントは主にそのライフサイクルによって管理されます。ActivityやFragmentを直接インスタンス化することはできません。システムが私たちのためにすべての作成と管理を行い、`onCreate`、`onStart`などのメソッドでコールバックを行います。

そのため、KoinモジュールでActivity/Fragment/Serviceを記述することはできません。依存関係をプロパティに注入し、ライフサイクルも尊重する必要があります。UI部分に関連するコンポーネントは、不要になり次第すぐに解放されなければなりません。

これには、次のものがあります。

*   長寿命コンポーネント (サービス、データリポジトリなど) - 複数の画面で使用され、決して破棄されない
*   中寿命コンポーネント (ユーザーセッションなど) - 複数の画面で使用され、一定時間が経過したら破棄される必要がある
*   短寿命コンポーネント (ビュー) - 1つの画面でのみ使用され、画面終了時に破棄される必要がある

長寿命コンポーネントは、`single` 定義として簡単に記述できます。中寿命および短寿命コンポーネントの場合、いくつかの方法があります。

MVPアーキテクチャスタイルでは、`Presenter` はUIを支援/サポートする短寿命コンポーネントです。Presenterは画面が表示されるたびに作成され、画面が終了したら破棄される必要があります。

新しいPresenterは毎回作成されます

```kotlin
class DetailActivity : AppCompatActivity() {

    // injected Presenter
    override val presenter : Presenter by inject()
```

モジュールで以下のように記述できます。

*   `factory` として - `by inject()` または `get()` が呼び出されるたびに新しいインスタンスを生成する

```kotlin
val androidModule = module {

    // Factory instance of Presenter
    factory { Presenter() }
}
```

*   `scope` として - スコープに紐付けられたインスタンスを生成する

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
Androidのメモリリークのほとんどは、非AndroidコンポーネントからUI/Androidコンポーネントを参照することから発生します。システムがその参照を保持し、ガベージコレクションによって完全に破棄できないためです。
:::

## Androidコンポーネントのスコープ (3.2.1以降)

### Androidスコープの宣言

Androidコンポーネントに依存関係をスコープ化するには、以下のように`scope`ブロックでスコープセクションを宣言する必要があります。

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // Declare scope for MyActivity
  scope<MyActivity> {
   // get MyPresenter instance from current scope 
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
 
  // or
  activityScope {
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
}
```

### Androidスコープクラス

Koinは`ScopeActivity`、`RetainedScopeActivity`、`ScopeFragment`クラスを提供しており、ActivityやFragmentで宣言されたスコープを直接使用できるようにします。

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenter is resolved from MyActivity's scope 
    val presenter : MyPresenter by inject()
}
```

内部では、Androidスコープは`AndroidScopeComponent`インターフェースと一緒に使用され、次のように`scope`フィールドを実装する必要があります。

```kotlin
abstract class ScopeActivity(
    @LayoutRes contentLayoutId: Int = 0,
) : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        checkNotNull(scope)
    }
}
```

`AndroidScopeComponent`インターフェースを使用し、`scope`プロパティを実装する必要があります。これにより、クラスで使用されるデフォルトスコープが設定されます。

### AndroidスコープAPI

AndroidコンポーネントにバインドされたKoinスコープを作成するには、以下の関数を使用します。
- `createActivityScope()` - 現在のActivityのスコープを作成 (スコープセクションの宣言が必要)
- `createActivityRetainedScope()` - 現在のActivityの保持されたスコープ (ViewModelライフサイクルに裏打ちされた) を作成 (スコープセクションの宣言が必要)
- `createFragmentScope()` - 現在のFragmentのスコープを作成し、親Activityスコープにリンクする

これらの関数はデリゲートとして利用でき、異なる種類のスコープを実装できます。

- `activityScope()` - 現在のActivityのスコープを作成 (スコープセクションの宣言が必要)
- `activityRetainedScope()` - 現在のActivityの保持されたスコープ (ViewModelライフサイクルに裏打ちされた) を作成 (スコープセクションの宣言が必要)
- `fragmentScope()` - 現在のFragmentのスコープを作成し、親Activityスコープにリンクする

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

また、以下を使用して保持されたスコープ (ViewModelライフサイクルに裏打ちされた) を設定することもできます。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
Androidスコープクラスを使用したくない場合は、独自のクラスで作業し、スコープ作成APIとともに`AndroidScopeComponent`を使用できます。
:::

### AndroidScopeComponentとスコープのクローズ処理

Koinスコープが破棄される前にコードを実行するには、`AndroidScopeComponent`の`onCloseScope`関数をオーバーライドします。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // Called before closing the Scope
    }
}
```

:::note
`onDestroy()`関数からスコープにアクセスしようとすると、スコープはすでに閉じられています。
:::

### スコープアーキタイプ (4.1.0)

新機能として、スコープを**アーキタイプ (archetype)**で宣言できるようになりました。特定の型に対してスコープを定義する必要はなく、「アーキタイプ」（スコープクラスの一種）に対して定義できます。「Activity」、「Fragment」、または「ViewModel」に対してスコープを宣言できます。
以下のDSLセクションを使用できます。

```kotlin
module {
 activityScope {
  // scoped instances for an activity
 }

 activityRetainedScope {
  // scoped instances for an activity, retained scope
 }

 fragmentScope {
  // scoped instances for Fragment
 }

 viewModelScope {
  // scoped instances for ViewModel
 }
}
```

これにより、スコープ間での定義の再利用が容易になります。特定のオブジェクトにスコープが必要な場合を除き、`scope<>{ }`のような特定の型を使用する必要はありません。

:::info
[AndroidスコープAPI](#android-scope-api) を参照して、`by activityScope()`、`by activityRetainedScope()`、`by fragmentScope()` 関数を使用してAndroidスコープをアクティブにする方法を確認してください。これらの関数はスコープアーキタイプをトリガーします。
:::

例えば、スコープアーキタイプを使用して、定義をActivityに簡単にスコープ化できます。

```kotlin
// declare Class Session in Activity scope
module {
 activityScope {
    scopedOf(::Session)
 }
}

// Inject the scoped Session object to the activity:
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    
    // create Activity's scope
    val scope: Scope by activityScope() 
    
    // inject from scope above
    val session: Session by inject()
}
```

### ViewModelスコープ (4.1.0に更新)

ViewModelは、(ActivityやFragmentの)リークを防ぐためにルートスコープに対してのみ作成されます。これにより、ViewModelが互換性のないスコープにアクセスしてしまう可視性の問題が防止されます。

:::warn
ViewModelはActivityまたはFragmentスコープにアクセスできません。なぜでしょうか？ ViewModelはActivityやFragmentよりも長く存在するため、適切なスコープ外に依存関係がリークしてしまうためです。
ViewModelスコープ外から依存関係を_どうしても_ブリッジする必要がある場合は、「注入パラメータ (injected parameters)」を使用して、いくつかのオブジェクトをViewModelに渡すことができます: `viewModel { p -> }`
:::

ViewModelスコープは、ViewModelクラスに紐付けるか、`viewModelScope` DSLセクションを使用して次のように宣言します。

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    // MyScopeViewModelのみのスコープ
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }
    // ViewModelアーキタイプスコープ - すべてのViewModelのスコープ 
    viewModelScope {
        scopedOf(::Session)
    }
}
```

ViewModelとスコープ化されたコンポーネントを宣言したら、次のいずれかを_選択できます_:
- 手動API - `KoinScopeComponent`と`viewModelScope`関数を手動で使用します。これにより、作成されたViewModelスコープの作成と破棄が処理されます。ただし、スコープ化された定義を注入するには`scope`プロパティに依存する必要があるため、フィールドによってスコープ化された定義を注入する必要があります。
```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {
    
    // ViewModelスコープを作成
    override val scope: Scope = viewModelScope()
    
    // 上記スコープを使用してセッションを注入
    val session: Session by inject()
}
```
- 自動スコープ作成
    - `viewModelScopeFactory` オプション (「[Koinオプション](../koin-core/start-koin.md#koin-options---feature-flagging)」を参照) をアクティブにして、ViewModelスコープを自動的に作成します。
    - これにより、コンストラクタインジェクションを使用できます
```kotlin
// ViewModelスコープファクトリをアクティブ化
startKoin {
    options(
        viewModelScopeFactory()
    )
}

// スコープはファクトリレベルで作成され、注入前に自動的に作成されます
class MyScopeViewModel(val session: Session) : ViewModel()
```

次に、ActivityまたはFragmentからViewModelを呼び出します。

```kotlin
class MyActivity : AppCompatActivity() {
    
    // MyScopeViewModelインスタンスを作成し、MyScopeViewModelのスコープを割り当てます
    val vieModel: MyScopeViewModel by viewModel()
}
```

## スコープリンク

スコープリンクを使用すると、カスタムスコープを持つコンポーネント間でインスタンスを共有できます。デフォルトでは、Fragmentのスコープは親Activityスコープにリンクされています。

より高度な使い方として、複数のコンポーネント間で`Scope`インスタンスを使用できます。例えば、`UserSession`インスタンスを共有する必要がある場合です。

まずスコープ定義を宣言します。

```kotlin
module {
    // 共有ユーザーセッションデータ
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

`UserSession`インスタンスの使用を開始する必要がある場合は、そのためのスコープを作成します。

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// ourSessionスコープを、ScopeActivityまたはScopeFragmentから現在の`scope`にリンク
scope.linkTo(ourSession)
```

その後、必要な場所でどこでも使用できます。

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ourSessionスコープを、ScopeActivityまたはScopeFragmentから現在の`scope`にリンク
        scope.linkTo(ourSession)

        // 解決のためにMyActivity1のスコープとourSessionスコープを検索します
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ourSessionスコープを、ScopeActivityまたはScopeFragmentから現在の`scope`にリンク
        scope.linkTo(ourSession)

        // 解決のためにMyActivity2のスコープとourSessionスコープを検索します
        val userSession = get<UserSession>()
    }
}