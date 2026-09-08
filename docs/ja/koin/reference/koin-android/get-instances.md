---
title: Androidでの注入
---

モジュールを宣言し、Koinを開始したら、AndroidのActivity、Fragment、またはServiceでどのようにインスタンスを取得すればよいでしょうか？

## Androidクラスでの準備 {id="ready-for-android-classes"}

`Activity`、`Fragment`、`Service` はKoinの拡張機能によって拡張されています。すべての `ComponentCallbacks` クラスで以下にアクセスできるようになります：

* `by inject()` - Koinコンテナからの遅延評価（lazy）によるインスタンス取得
* `get()` - Koinコンテナからの即時（eager）インスタンス取得
* `by viewModel()` - ViewModelの遅延インスタンス取得
* `getViewModel()` - ViewModelの即時インスタンス取得

## 依存関係の定義 {id="defining-dependencies"}

### コンパイラプラグインDSL {id="compiler-plugin-dsl"}

```kotlin
val appModule = module {
    factory<Presenter>()
    viewModel<UserViewModel>()
}
```

### アノテーション {id="annotations"}

```kotlin
@Factory
class Presenter(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val repository: UserRepository) : ViewModel()
```

### クラシックDSL {id="classic-dsl"}

```kotlin
val appModule = module {
    factory { Presenter(get()) }
    viewModel { UserViewModel(get()) }
}
```

## Activityでの注入 {id="injecting-in-activity"}

```kotlin
class DetailActivity : AppCompatActivity() {

    // PresenterをLazy注入
    private val presenter: Presenter by inject()

    // ViewModelをLazy注入
    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // presenter と viewModel を使用
    }
}
```

## Fragmentでの注入 {id="injecting-in-fragment"}

```kotlin
class UserFragment : Fragment() {

    // Fragment自身のViewModel
    private val viewModel: UserViewModel by viewModel()

    // Activityと共有するViewModel
    private val sharedViewModel: SharedViewModel by activityViewModel()

    // 通常の依存関係
    private val presenter: Presenter by inject()
}
```

## Serviceでの注入 {id="injecting-in-service"}

```kotlin
class MyService : Service() {

    private val repository: UserRepository by inject()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        repository.doSomething()
        return START_STICKY
    }
}
```

## 即時（Eager）注入 vs 遅延（Lazy）注入 {id="eager-vs-lazy-injection"}

```kotlin
class DetailActivity : AppCompatActivity() {

    // Lazy - 初回アクセス時に作成
    private val presenter: Presenter by inject()

    // Eager - すぐに作成
    private val service: MyService = get()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // あるいは関数内で即時取得
        val anotherPresenter: Presenter = get()
    }
}
```

| メソッド | 作成タイミング | ユースケース |
|--------|--------------|----------|
| `by inject()` | 初回アクセス時 | ほとんどのケース。不要な作成を回避します |
| `get()` | 即時 | インスタンスがすぐに必要な場合 |

:::info
クラスにKoinの拡張機能がない場合は、`KoinComponent` インターフェースを実装することで `inject()` や `get()` にアクセスできるようになります。
:::

## パラメータを指定した注入 {id="injection-with-parameters"}

注入時にパラメータを渡します：

```kotlin
@Factory
class UserPresenter(
    @InjectedParam val userId: String,
    val repository: UserRepository
)
```

```kotlin
class UserActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject { parametersOf("user_123") }
}
```

## クォリファイア（Qualifier）を使用した注入 {id="injection-with-qualifiers"}

同じ型の定義が複数ある場合：

```kotlin
val appModule = module {
    single<Database>(named("local")) { LocalDatabase() }
    single<Database>(named("remote")) { RemoteDatabase() }
}
```

```kotlin
class MyActivity : AppCompatActivity() {

    private val localDb: Database by inject(named("local"))
    private val remoteDb: Database by inject(named("remote"))
}
```

## 定義内でのAndroid Contextの使用 {id="using-android-context-in-definitions"}

`Application` クラスで `androidContext` を使用してKoinを設定すると、定義内でそれを解決できるようになります。

### アノテーション

アノテーションを使用する場合、単に `Context` または `Application` パラメータを宣言するだけで、自動的に注入されます：

```kotlin
@Factory
class MyPresenter(private val context: Context)

@Singleton
class MyRepository(private val application: Application)
```

### DSL {id="dsl"}

モジュール内で `androidContext()` または `androidApplication()` 関数を使用します：

```kotlin
val appModule = module {
    factory {
        MyPresenter(androidContext())
    }
    single {
        MyRepository(androidApplication())
    }
}
```

## AndroidのスコープとContextの解決 {id="android-scope-context-resolution"}

`Context` 型をバインドしているスコープがある場合、異なるレベルから `Context` を解決する必要があるかもしれません。

```kotlin
class MyPresenter(val context: Context)

val appModule = module {
    scope<MyActivity> {
        scoped { MyPresenter(get()) }
    }
}
```

Contextの解決：
- `get()` - 最も近い `Context` を解決します。ここでは `MyActivity` になります。
- `androidContext()` - 最も近い `Context` を解決します。ここでは `MyActivity` になります。
- `androidApplication()` - Koinの設定から `Application` を解決します。