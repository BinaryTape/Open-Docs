---
title: "Androidスコープの管理 (Android Scopesの管理)"
---
## Androidライフサイクルとの連携

Androidコンポーネントは主にライフサイクルによって管理されます。ActivityやFragmentを直接インスタンス化することはできません。システムがすべての生成と管理を行い、onCreateやonStartなどのメソッドでコールバックを行います。

そのため、KoinモジュールでActivity/Fragment/Serviceを記述することはできません。プロパティに依存性を注入する必要があり、ライフサイクルも尊重する必要があります。UI部分に関連するコンポーネントは、不要になったらすぐに解放する必要があります。

したがって、以下のようなコンポーネントがあります。

* 長寿命コンポーネント（Service、Data Repositoryなど） - 複数の画面で使用され、破棄されない
* 中寿命コンポーネント（ユーザーセッションなど） - 複数の画面で使用され、一定時間後に破棄される
* 短寿命コンポーネント（ビュー） - 1つの画面でのみ使用され、画面終了時に破棄される

長寿命コンポーネントは、`single`定義として簡単に記述できます。中寿命および短寿命コンポーネントについては、いくつかのアプローチがあります。

MVP（Model-View-Presenter）アーキテクチャスタイルでは、`Presenter`はUIを支援/サポートする短寿命コンポーネントです。Presenterは画面が表示されるたびに作成し、画面が閉じたら破棄する必要があります。

新しいPresenterは毎回作成されます

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入されたPresenter
    override val presenter : Presenter by inject()
```

モジュールで記述できます。

* `factory`として - `by inject()`または`get()`が呼び出されるたびに新しいインスタンスを生成します

```kotlin
val androidModule = module {

    // PresenterのFactoryインスタンス
    factory { Presenter() }
}
```

* `scope`として - スコープに関連付けられたインスタンスを生成します

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
Androidのメモリリークのほとんどは、UI/Androidコンポーネントを非Androidコンポーネントから参照することから発生します。システムがその参照を保持し、ガベージコレクションによって完全に破棄できません。
:::

## Androidコンポーネントのスコープ (3.2.1以降)

### Androidスコープの宣言

Androidコンポーネントの依存関係をスコープするには、次のように`scope`ブロックを使用してスコープセクションを宣言する必要があります。

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // MyActivityのスコープを宣言
  scope<MyActivity> {
    // 現在のスコープからMyPresenterインスタンスを取得
    scoped { MyAdapter(get()) }
    scoped { MyPresenter() }
  }
}
```

### Androidスコープクラス

Koinは、ActivityまたはFragmentに対して宣言されたスコープを直接使用できるように、`ScopeActivity`、`RetainedScopeActivity`、および`ScopeFragment`クラスを提供します。

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenterはMyActivityのスコープから解決されます
    val presenter : MyPresenter by inject()
}
```

内部的には、Androidスコープは`AndroidScopeComponent`インターフェースで使用して、次のように`scope`フィールドを実装する必要があります。

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

`AndroidScopeComponent`インターフェースを使用して、`scope`プロパティを実装する必要があります。これにより、クラスで使用されるデフォルトのスコープが設定されます。

### AndroidスコープAPI

AndroidコンポーネントにバインドされたKoinスコープを作成するには、次の関数を使用します。
- `createActivityScope()` - 現在のActivityのスコープを作成します（スコープセクションを宣言する必要があります）
- `createActivityRetainedScope()` - 現在のActivityの保持されたスコープ（ViewModelライフサイクルによってサポートされる）を作成します（スコープセクションを宣言する必要があります）
- `createFragmentScope()` - 現在のFragmentのスコープを作成し、親Activityスコープにリンクします

これらの関数はデリゲートとして使用でき、さまざまな種類のスコープを実装できます。

- `activityScope()` - 現在のActivityのスコープを作成します（スコープセクションを宣言する必要があります）
- `activityRetainedScope()` - 現在のActivityの保持されたスコープ（ViewModelライフサイクルによってサポートされる）を作成します（スコープセクションを宣言する必要があります）
- `fragmentScope()` - 現在のFragmentのスコープを作成し、親Activityスコープにリンクします

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

次のように、保持されたスコープ（ViewModelライフサイクルによってサポートされる）を設定することもできます。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
Androidスコープクラスを使用しない場合は、独自のクラスを使用し、`AndroidScopeComponent`をスコープ作成APIとともに使用できます
:::

### AndroidScopeComponentとスコープのクローズ処理

`AndroidScopeComponent`の`onCloseScope`関数をオーバーライドすることにより、Koinスコープが破棄される前にいくつかのコードを実行できます。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // スコープを閉じる前に呼び出されます
    }
}
```

:::note
`onDestroy()`関数からスコープにアクセスしようとすると、スコープはすでに閉じられています。
:::

### ViewModelスコープ (3.5.4以降)

ViewModelは、リーク（ActivityやFragmentのリークなど）を回避するために、ルートスコープに対してのみ作成されます。これは、ViewModelが互換性のないスコープにアクセスする可能性がある可視性の問題を保護します。

:::warn
ViewModelはActivityまたはFragmentスコープにアクセスできません。なぜでしょうか？ViewModelはActivityやFragmentよりも長く存続するため、適切なスコープ外の依存関係をリークさせる可能性があるためです。
:::

:::note
ViewModelスコープ外から依存関係をブリッジする必要がある場合は、「注入されたパラメータ」を使用して、オブジェクトをViewModelに渡すことができます：`viewModel { p ->  }`
:::

`ScopeViewModel`は、ViewModelスコープでの作業を支援する新しいクラスです。これはViewModelのスコープの作成を処理し、`scope`プロパティを提供して`by scope.inject()`で注入できるようにします。

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }    
}

class MyScopeViewModel : ScopeViewModel() {

    // onClearedで、スコープが閉じられます
    
    // 現在のMyScopeViewModelのスコープから注入されます
    val session by scope.inject<Session>()

}
```

`ScopeViewModel`を使用すると、`onCloseScope()`関数をオーバーライドして、スコープが閉じられる前にコードを実行することもできます。

:::note
ViewModelスコープ内のすべてのインスタンスは同じ可視性を持ち、ViewModelインスタンスのライフタイムの間、ViewModelのonCleared関数が呼び出されるまで存続します
:::

たとえば、ActivityまたはFragmentがViewModelを作成すると、関連するスコープが作成されます。

```kotlin
class MyActivity : AppCompatActivity() {

    // ViewModelとそのスコープを作成
    val myViewModel by viewModel<MyScopeViewModel>()

}
```

ViewModelが作成されると、このスコープ内の関連するすべての依存関係を作成して注入できます。

`ScopeViewModel`クラスを使用せずにViewModelスコープを手動で実装するには、次の手順に従います。

```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {

    override val scope: Scope = createScope(this)

    // 依存関係を注入
    val session by scope.inject<Session>()

    // スコープをクリア
    override fun onCleared() {
        super.onCleared()
        scope.close()
    }
}
```

## スコープリンク

スコープリンクを使用すると、カスタムスコープを持つコンポーネント間でインスタンスを共有できます。

より拡張された使用法では、コンポーネント間で`Scope`インスタンスを使用できます。たとえば、`UserSession`インスタンスを共有する必要がある場合です。

最初にスコープ定義を宣言します。

```kotlin
module {
    // 共有ユーザーセッションデータ
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

`UserSession`インスタンスの使用を開始する必要がある場合は、そのスコープを作成します。

```kotlin
val ourSession = getKoin().createScope("ourSession",named("session"))

// ScopeActivityまたはScopeFragmentから、ourSessionスコープを現在の`scope`にリンクします
scope.linkTo(ourSession)
```

次に、必要な場所で使用します。

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ScopeActivityまたはScopeFragmentから、ourSessionスコープを現在の`scope`にリンクします
        scope.linkTo(ourSession)

        // MyActivity1のスコープ+ ourSessionスコープを調べて解決します
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession",named("session"))
        
        // ScopeActivityまたはScopeFragmentから、ourSessionスコープを現在の`scope`にリンクします
        scope.linkTo(ourSession)

        // MyActivity2のスコープ+ ourSessionスコープを調べて解決します
        val userSession = get<UserSession>()
    }
}
```