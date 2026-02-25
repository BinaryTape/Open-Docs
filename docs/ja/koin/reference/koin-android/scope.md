---
title: Androidのスコープ
---

## Androidのライフサイクルを扱う

Androidのコンポーネントは主にライフサイクルによって管理されます。ActivityやFragmentを直接インスタンス化することはできません。システムがすべての生成と管理を行い、`onCreate`や`onStart`などのメソッドでコールバックを提供します。

そのため、Koinモジュール内でActivity、Fragment、Serviceを定義することはできません。依存関係をプロパティに注入（インジェクト）し、ライフサイクルを尊重する必要があります。UI部分に関連するコンポーネントは、不要になったらすぐに解放される必要があります。

これらには以下のような種類があります：

* **長期間生存するコンポーネント (Long live components)**（Service、Data Repositoryなど）: 複数の画面で使用され、破棄されることはありません。
* **中期間生存するコンポーネント (Medium live components)**（ユーザーセッションなど）: 複数の画面で使用されますが、一定時間後に破棄される必要があります。
* **短期間生存するコンポーネント (Short live components)**（View）: 1つの画面でのみ使用され、画面の終了時に破棄される必要があります。

長期間生存するコンポーネントは、`single`定義として簡単に記述できます。中期間および短期間生存するコンポーネントについては、いくつかの方法があります。

MVPアーキテクチャスタイルの場合、`Presenter`はUIを補助・サポートするための短期間生存するコンポーネントです。Presenterは画面が表示されるたびに作成され、画面が消えたら破棄される必要があります。

画面が表示されるたびに新しいPresenterが作成されます：

```kotlin
class DetailActivity : AppCompatActivity() {

    // 注入されるPresenter
    override val presenter : Presenter by inject()
```

これをモジュールで記述する方法は以下の通りです：

*   **`factory`として**：`by inject()`や`get()`が呼び出されるたびに新しいインスタンスを生成します。

```kotlin
val androidModule = module {

    // PresenterのFactoryインスタンス
    factory { Presenter() }
}
```

*   **`scope`として**：特定のスコープに紐付いたインスタンスを生成します。

```kotlin
val androidModule = module {

    scope<DetailActivity> {
        scoped { Presenter() }
    }
}
```

:::note
Androidのメモリリークのほとんどは、非AndroidコンポーネントからUIやAndroidコンポーネントを参照することによって発生します。システムがそれへの参照を保持し続けるため、ガベージコレクションによって完全に破棄することができなくなります。
:::

## Androidコンポーネント用のスコープ (3.2.1以降)

### Androidスコープを宣言する

Androidコンポーネントに依存関係をスコープ（限定）させるには、以下のように`scope`ブロックを使用してスコープセクションを宣言する必要があります。

```kotlin
class MyPresenter()
class MyAdapter(val presenter : MyPresenter)

module {
  // MyActivity用のスコープを宣言
  scope<MyActivity> {
   // 現在のスコープからMyPresenterインスタンスを取得
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
 
  // または
  activityScope {
   scoped { MyAdapter(get()) }
   scoped { MyPresenter() }
  }
}
```

### Androidスコープクラス

Koinは、ActivityやFragmentで宣言されたスコープを直接利用できるように、`ScopeActivity`、`RetainedScopeActivity`、`ScopeFragment`クラスを提供しています。

```kotlin
class MyActivity : ScopeActivity() {
    
    // MyPresenterはMyActivityのスコープから解決されます
    val presenter : MyPresenter by inject()
}
```

内部的には、Androidスコープは`AndroidScopeComponent`インターフェースを使用して、以下のように`scope`フィールドを実装する必要があります。

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

`AndroidScopeComponent`インターフェースを使用し、`scope`プロパティを実装する必要があります。これにより、クラスで使用されるデフォルトのスコープが設定されます。

### AndroidスコープAPI

AndroidコンポーネントにバインドされたKoinスコープを作成するには、以下の関数を使用します：
- `createActivityScope()` - 現在のActivity用のスコープを作成します（スコープセクションの宣言が必要です）。
- `createActivityRetainedScope()` - 現在のActivity用にリテイン（保持）されたスコープ（ViewModelのライフサイクルに支えられたもの）を作成します（スコープセクションの宣言が必要です）。
- `createFragmentScope()` - 現在のFragment用のスコープを作成し、親Activityのスコープにリンクします。

これらの関数は、異なる種類のスコープを実装するためのデリゲート（委譲）としても利用可能です：

- `activityScope()` - 現在のActivity用のスコープを作成します。
- `activityRetainedScope()` - 現在のActivity用にリテインされたスコープを作成します。
- `fragmentScope()` - 現在のFragment用のスコープを作成し、親Activityのスコープにリンクします。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()
    
}
```

また、以下のようにしてリテインされたスコープ（ViewModelのライフサイクルによって保持される）を設定することもできます。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityRetainedScope()
}
```

:::note
Androidスコープクラスを使用したくない場合は、独自のクラスで`AndroidScopeComponent`とスコープ作成APIを組み合わせて使用することができます。
:::

### AndroidScopeComponentとスコープ終了の処理

`AndroidScopeComponent`の`onCloseScope`関数をオーバーライドすることで、Koinスコープが破棄される前にコードを実行できます。

```kotlin
class MyActivity() : AppCompatActivity(contentLayoutId), AndroidScopeComponent {

    override val scope: Scope by activityScope()

    override fun onCloseScope() {
        // スコープが閉じられる前に呼び出されます
    }
}
```

:::note
`onDestroy()`関数からスコープにアクセスしようとすると、その時点ですでにスコープは閉じられています。
:::

### スコープアーキタイプ (4.1.0)

新しい機能として、**アーキタイプ (archetype)** によってスコープを宣言できるようになりました。特定の型に対してスコープを定義するのではなく、「アーキタイプ」（ある種のスコープクラス）に対して定義します。"Activity"、"Fragment"、または "ViewModel" に対してスコープを宣言できます。
以下のDSLセクションを使用できるようになりました：

```kotlin
module {
 activityScope {
  // activity用のスコープ付きインスタンス
 }

 activityRetainedScope {
  // activity用のリテインされたスコープ付きインスタンス
 }

 fragmentScope {
  // Fragment用のスコープ付きインスタンス
 }

 viewModelScope {
  // ViewModel用のスコープ付きインスタンス
 }
}
```

これにより、特定のオブジェクト上のスコープが必要な場合を除き、`scope<>{ }`のような特定の型を使用することなく、定義をスコープ間で簡単に再利用できるようになります。

:::info
Androidスコープを有効にするために `by activityScope()`、`by activityRetainedScope()`、`by fragmentScope()` 関数を使用する方法については、[AndroidスコープAPI](#android-scope-api)を参照してください。これらの関数はスコープアーキタイプをトリガーします。
:::

例えば、スコープアーキタイプを使用して、以下のようにActivityに定義を簡単にスコープさせることができます：

```kotlin
// ActivityスコープでSessionクラスを宣言
module {
 activityScope {
    scopedOf(::Session)
 }
}

// スコープされたSessionオブジェクトをActivityに注入：
class MyActivity : AppCompatActivity(), AndroidScopeComponent {
    
    // Activityのスコープを作成
    val scope: Scope by activityScope() 
    
    // 上記のスコープから注入
    val session: Session by inject()
}
```

### ViewModelスコープ (4.1.0で更新)

ViewModelは、リーク（ActivityやFragmentのリークなど）を避けるために、ルートスコープに対してのみ作成されます。これにより、ViewModelが互換性のないスコープにアクセスできてしまうという可視性の問題を防いでいます。

:::warn
ViewModelはActivityやFragmentのスコープにアクセスできません。なぜなら、ViewModelはActivityやFragmentよりも長く生存するため、適切なスコープ外に依存関係をリークさせてしまう可能性があるからです。
ViewModelスコープ外から依存関係を橋渡しする必要がある場合は、「注入パラメータ (injected parameters)」を使用してオブジェクトをViewModelに渡すことができます：`viewModel { p -> }`
:::

ViewModelクラスに紐付けるか、`viewModelScope` DSLセクションを使用して、以下のようにViewModelスコープを宣言します：

```kotlin
module {
    viewModelOf(::MyScopeViewModel)
    // MyScopeViewModelのみのスコープ
    scope<MyScopeViewModel> {
        scopedOf(::Session)
    }
    // ViewModelアーキタイプスコープ - すべてのViewModel用のスコープ
    viewModelScope {
        scopedOf(::Session)
    }
}
```

ViewModelとスコープ付きコンポーネントを宣言したら、以下のいずれかを選択できます：

- **手動API** - `KoinScopeComponent`と`viewModelScope`関数を手動で使用します。これにより、作成されたViewModelスコープの生成と破棄が処理されます。ただし、スコープされた定義を注入するには`scope`プロパティに依存する必要があるため、フィールド注入を使用する必要があります。
```kotlin
class MyScopeViewModel : ViewModel(), KoinScopeComponent {
    
    // ViewModelスコープを作成
    override val scope: Scope = viewModelScope()
    
    // 上記のスコープを使用してsessionを注入
    val session: Session by inject()
}
```
- **自動スコープ作成**
    - `viewModelScopeFactory`オプションを有効にして（[Koinオプション](../koin-core/start-koin.md#koin-options---feature-flagging)を参照）、ViewModelスコープを動的に自動生成します。
    - これにより、コンストラクタ注入が可能になります。
```kotlin
// ViewModelスコープファクトリを有効化
startKoin {
    options(
        viewModelScopeFactory()
    )
}

// 注入の直前に、ファクトリレベルでスコープが自動的に作成される
class MyScopeViewModel(val session: Session) : ViewModel()
```

あとはActivityやFragmentからViewModelを呼び出すだけです：

```kotlin
class MyActivity : AppCompatActivity() {
    
    // MyScopeViewModelインスタンスを作成し、MyScopeViewModelのスコープを割り当てる
    val vieModel: MyScopeViewModel by viewModel()
}
```

## スコープのリンク

スコープのリンク（Scope links）を使用すると、カスタムスコープを持つコンポーネント間でインスタンスを共有できます。デフォルトでは、Fragmentのスコープは親Activityのスコープにリンクされています。

より高度な使い方として、コンポーネント間で `Scope` インスタンスを共有できます。例えば、`UserSession` インスタンスを共有する必要がある場合などです。

まず、スコープ定義を宣言します：

```kotlin
module {
    // 共有ユーザーセッションデータ
    scope(named("session")) {
        scoped { UserSession() }
    }
}
```

`UserSession` インスタンスの使用を開始する必要があるときに、そのためのスコープを作成します：

```kotlin
val ourSession = getKoin().createScope("ourSession", named("session"))

// ourSessionスコープを、ScopeActivityやScopeFragmentの現在の `scope` にリンクする
scope.linkTo(ourSession)
```

その後、必要な場所で使用します：

```kotlin
class MyActivity1 : ScopeActivity() {
    
    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession", named("session"))
        
        // ourSessionスコープを、ScopeActivityやScopeFragmentの現在の `scope` にリンクする
        scope.linkTo(ourSession)

        // 解決のためにMyActivity1のスコープ + ourSessionスコープを確認する
        val userSession = get<UserSession>()
    }
}
class MyActivity2 : ScopeActivity() {

    fun reuseSession(){
        val ourSession = getKoin().createScope("ourSession", named("session"))
        
        // ourSessionスコープを、ScopeActivityやScopeFragmentの現在の `scope` にリンクする
        scope.linkTo(ourSession)

        // 解決のためにMyActivity2のスコープ + ourSessionスコープを確認する
        val userSession = get<UserSession>()
    }
}