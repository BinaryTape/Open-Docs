---
title: HiltからKoinへの移行
---

このガイドでは、AndroidアプリケーションをDagger HiltからKoinに移行する方法を説明します。Koin DSLとKoin Annotationsのどちらを使用する場合でも、このガイドでは主要な違いと移行ステップを網羅しています。

:::info
実践的な完全な例については、[Now in Androidの移行](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)を確認してください。30個のGradleモジュールを持つGoogleのプロダクション対応ニュースアプリが、HiltからKoin Annotationsにどのように移行されたかが示されています。
:::

## なぜKoinに移行するのか？

**Koinの主な利点：**

- **コード生成なし** - Koinはアノテーションプロセッサを使用せず、実行時に依存関係を解決します。
- **シンプルなセットアップ** - 複雑なコンポーネント階層や `@InstallIn` 宣言は不要です。
- **Kotlinファースト** - 自然に感じられる、慣習的なKotlin DSLを提供します。
- **軽量** - kapt/KSPによるコード生成がないため、ビルド時間が短縮されます（DSLアプローチの場合）。
- **マルチモジュールに最適** - `@EntryPoint` インターフェースは必要ありません。
- **JSR-330のサポート** - 既存の `@Inject` コンストラクタを修正なしでそのまま利用できます。

## クイックリファレンス：Hilt vs Koin

### アノテーションのマッピング

| Hilt | Koin DSL                                 | Koin Annotations                                                                                    |
|------|------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `@HiltAndroidApp` | Application内での `startKoin {}`            | `@KoinApplication`                                                                                  |
| `@AndroidEntryPoint` | `by inject()` / `by viewModel()`         | `by inject()` / `by viewModel()`                                                                    |
| `@HiltViewModel` | `viewModel { MyViewModel(...) }`         | `@KoinViewModel`                                                                                    |
| `@Inject` コンストラクタ | DSLでコンストラクタパラメータを指定    | コンストラクタパラメータを自動検出 (JSR-330)                                                           |
| `@Module` + `@InstallIn` | `module { }`                             | `@Module` + `@ComponentScan`                                                                        |
| `@Provides` | `single { }` または `factory { }`            | `@Single` / `@Factory`                                                                              |
| `@Binds` | `single<Interface> { Implementation() }` | `@Single` または `@Singleton` はバインディングを検出します。また、これらのアノテーションの `binds` プロパティも使用可能です。 |
| `@Singleton` | `single { }`                             | `@Single` または `@Singleton`                                                                                           |
| `@Named("qualifier")` | `named("qualifier")`                     | `@Named("qualifier")`                                                                               |
| `@ApplicationContext` | コンテキストの自動注入              | コンテキストの自動注入                                                                         |
| `@EntryPoint` | 不要                               | 不要                                                                                          |

### スコープのマッピング

| Hiltスコープ | Koin DSL | Koin Annotations | 備考 |
|------------|----------|------------------|-------|
| `@Singleton` | `single { }` | `@Single` / `@Singleton` | アプリケーション全体のシングルトン |
| `@ActivityScoped` | `activityScope { scoped { } }` | `@ActivityScope` | Activityのライフサイクルに紐づく |
| `@ViewModelScoped` | `viewModelScope { scoped { } }` | `@ViewModelScope` | ViewModelのライフサイクルに紐づく |
| `@ActivityRetainedScoped` | `activityRetainedScope { scoped { } }` | `@ActivityRetainedScope` | 設定変更（Configuration changes）をまたいで維持される |

## 移行ステップ

### ステップ 1: 依存関係の更新

**Hiltの依存関係を削除する：**

```kotlin
// build.gradle.kts からこれらを削除
plugins {
    id("com.google.dagger.hilt.android") // 削除
}

dependencies {
    // Hiltの依存関係を削除
    implementation("com.google.dagger:hilt-android:...")
    kapt("com.google.dagger:hilt-compiler:...")
}
```

**Koinの依存関係を追加する：**

```kotlin
// build.gradle.kts (appモジュール)
dependencies {
    // Android用Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")

    // オプション: Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_ksp_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

### ステップ 2: Applicationの設定

**Hilt:**

```kotlin
@HiltAndroidApp
class MyApplication : Application()
```

**Koin DSL:**

```kotlin
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(appModule, dataModule, domainModule)
        }
    }
}
```

**Koin Annotations:**

```kotlin
@KoinApplication
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
        }
    }
}
```

:::info
`@KoinApplication` を使用すると、`@Configuration` が付与されたモジュールが自動的に検出されます。また、`modules` プロパティを使用して明示的にモジュールを含めることもできます： `@KoinApplication(modules = [AppModule::class])`。
:::

### ステップ 3: モジュールの移行

**Hilt:**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(okHttpClient)
            .build()
    }

    @Provides
    @Singleton
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

**Koin DSL:**

```kotlin
val networkModule = module {

    single {
        OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    single {
        Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(get()) // 自動依存関係解決
            .build()
    }

    single {
        get<Retrofit>().create(ApiService::class.java)
    }
}
```

**Koin Annotations:**

```kotlin
@Module
class NetworkModule {

    @Single
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Single
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com")
            .client(okHttpClient)
            .build()
    }

    @Single
    fun provideApiService(retrofit: Retrofit): ApiService {
        return retrofit.create(ApiService::class.java)
    }
}
```

### ステップ 4: ViewModelの移行

**Hilt:**

```kotlin
@HiltViewModel
class MyViewModel @Inject constructor(
    private val repository: MyRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

@Composable
fun MyScreen() {
    val viewModel = hiltViewModel<MyViewModel>()
    // ...
}
```

**Koin DSL:**

```kotlin
class MyViewModel(
    private val repository: MyRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

val appModule = module {
    viewModelOf(::MyViewModel)
}

@Composable
fun MyScreen() {
    val viewModel = koinViewModel<MyViewModel>()
    // ...
}
```

**Koin Annotations:**

```kotlin
@KoinViewModel
class MyViewModel(
    private val repository: MyRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    // ...
}

@Composable
fun MyScreen() {
    val viewModel = koinViewModel<MyViewModel>()
    // ...
}
```

:::info
`viewModelOf` DSL関数は、コンストラクタパラメータの自動配線（autowiring）を使用します。`SavedStateHandle` はKoinによって自動的に提供されるため、明示的に渡す必要はありません。これはViewModelの定義を簡素化するKoinのautowire DSLの一部です。
:::

### ステップ 5: ActivityとFragmentの移行

**Hilt:**

```kotlin
@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    @Inject
    lateinit var analytics: AnalyticsService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logEvent("screen_view")
    }
}
```

**Koin:**

```kotlin
class MainActivity : ComponentActivity() {

    // プロパティ委譲 - アノテーションは不要
    private val analytics: AnalyticsService by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logEvent("screen_view")
    }
}
```

:::info
Koinでは `@AndroidEntryPoint` は必要ありません。`by inject()` または `by viewModel()` プロパティ委譲を使用するだけです。
:::

### ステップ 6: インターフェース・バインディングの移行

**Hilt:**

```kotlin
@Module
@InstallIn(SingletonComponent::class)
abstract class DataModule {

    @Binds
    @Singleton
    abstract fun bindRepository(
        impl: MyRepositoryImpl
    ): MyRepository
}

class MyRepositoryImpl @Inject constructor(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

**Koin DSL:**

```kotlin
val dataModule = module {
    single<MyRepository> { MyRepositoryImpl(get()) }
}

class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

**Koin Annotations (自動バインディング検出):**

```kotlin
// オプション 1: 自動 - Koinがインターフェース・バインディングを検出
@Singleton
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
// Koinは自動的にMyRepositoryImplをMyRepositoryにバインドします

// オプション 2: bindsプロパティで明示的に指定
@Single(binds = [MyRepository::class])
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

:::info
Koin Annotationsは、クラスがインターフェースを実装している場合、自動的にインターフェース・バインディングを検出します。複数のインターフェースを明示的に指定したり、バインディングの動作を制御したりする必要がある場合は、`binds` プロパティを使用してください。
:::

### ステップ 7: Qualifier（限定子）の移行

**Hilt:**

```kotlin
@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Module
@InstallIn(SingletonComponent::class)
object DispatcherModule {

    @Provides
    @IoDispatcher
    fun provideIoDispatcher(): CoroutineDispatcher {
        return Dispatchers.IO
    }
}

class MyRepository @Inject constructor(
    @IoDispatcher private val dispatcher: CoroutineDispatcher
)
```

**Koin DSL (文字列ベース):**

```kotlin
val dispatcherModule = module {
    single(named("io")) { Dispatchers.IO }
}

class MyRepository(
    private val dispatcher: CoroutineDispatcher
)

val dataModule = module {
    single { MyRepository(get(named("io"))) }
}
```

**Koin DSL (型安全):**

```kotlin
// 限定子の型を定義
object IoDispatcher

val dispatcherModule = module {
    single(named<IoDispatcher>()) { Dispatchers.IO }
}

class MyRepository(
    private val dispatcher: CoroutineDispatcher
)

val dataModule = module {
    single { MyRepository(get(named<IoDispatcher>())) }
}
```

**Koin Annotations (文字列ベース):**

```kotlin
@Module
class DispatcherModule {
    @Single
    @Named("io")
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO
}

@Single
class MyRepository(
    @InjectedParam @Named("io") private val dispatcher: CoroutineDispatcher
)
```

**Koin Annotations (JSR-330 @Qualifier 使用 - 完全互換！):**

```kotlin
// 既存のJSR-330限定子アノテーションをそのまま使用可能！
@Qualifier
@Retention(AnnotationRetention.BINARY)
annotation class IoDispatcher

@Module
class DispatcherModule {
    @Single
    @IoDispatcher
    fun provideIoDispatcher(): CoroutineDispatcher = Dispatchers.IO
}

@Single
class MyRepository @Inject constructor(
    @IoDispatcher private val dispatcher: CoroutineDispatcher
)
```

:::info
Koin AnnotationsはJSR-330の `@Qualifier` アノテーションを完全にサポートしています！これは標準的なJava/KotlinのDIアノテーションであり（Hilt固有ではありません）、移行時に既存の限定子アノテーションをそのまま維持できます。また、DSLも文字列ベースの `named("string")` の代わりに `named<T>()` を使用した型安全な限定子をサポートしています。
:::

### ステップ 8: Compose連携の移行

**Hilt:**

```kotlin
@Composable
fun MyScreen(
    viewModel: MyViewModel = hiltViewModel()
) {
    val dependency: SomeDependency = EntryPointAccessors
        .fromActivity<MyEntryPoint>(LocalContext.current as Activity)
        .dependency()
}
```

**Koin:**

```kotlin
@Composable
fun MyScreen(
    viewModel: MyViewModel = koinViewModel()
) {
    // 直接注入 - EntryPointは不要
    val dependency: SomeDependency = koinInject()
}
```

### ステップ 9: テストの移行

**Hilt:**

```kotlin
@HiltAndroidTest
class MyTest {

    @get:Rule
    var hiltRule = HiltAndroidRule(this)

    @Inject
    lateinit var repository: MyRepository

    @Before
    fun init() {
        hiltRule.inject()
    }

    @Test
    fun myTest() {
        // ...
    }
}
```

**Koin:**

```kotlin
class MyTest : KoinTest {

    private val repository: MyRepository by inject()

    @Before
    fun before() {
        startKoin {
            modules(testModule)
        }
    }

    @After
    fun after() {
        stopKoin()
    }

    @Test
    fun myTest() {
        // ...
    }
}
```

## マルチモジュール・プロジェクト

### Hiltのアプローチ

Hiltでは以下が必要です：
- コンポーネント階層を指定するための `@InstallIn`
- モジュールをまたいでアクセスするための `@EntryPoint` インターフェース
- 複雑なコンポーネント依存関係

### Koinのアプローチ

Koinでは：
- 各モジュールが独自のKoinモジュールを宣言します
- すべてのモジュールをApplicationクラスでインポートします
- 特別なインターフェースは不要です

**Koinを使用した機能モジュール：**

```kotlin
// :feature:home モジュール
val homeModule = module {
    viewModel { HomeViewModel(get()) }
    factory { HomeRepository(get()) }
}

// :app モジュール
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(
                coreModule,
                dataModule,
                homeModule,  // 機能モジュール
                profileModule // 別の機能モジュール
            )
        }
    }
}
```

詳細は [マルチモジュール・アーキテクチャ](/docs/reference/koin-android/multi-module) を参照してください。

## 一般的なパターン

### コンストラクタ・インジェクション (JSR-330)

最大の利点の一つは、**既存の `@Inject` コンストラクタがKoin Annotationsでもそのまま動作する**ことです！

```kotlin
// これはHiltとKoin Annotationsの両方で動作します
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

Koin Annotationsでは、`@Inject` コンストラクタをそのままに、クラスに `@Single`、`@Singleton`、または `@Factory` を追加するだけです：

```kotlin
@Single // または @Singleton
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

### AssistedInject

**Hilt:**

```kotlin
class MyViewModel @AssistedInject constructor(
    private val repository: MyRepository,
    @Assisted private val userId: String
) : ViewModel() {

    @AssistedFactory
    interface Factory {
        fun create(userId: String): MyViewModel
    }
}
```

**Koin:**

```kotlin
class MyViewModel(
    private val repository: MyRepository,
    private val userId: String
) : ViewModel()

val appModule = module {
    viewModelOf(::MyViewModel)
}

// 使用方法
val viewModel: MyViewModel by viewModel { parametersOf("user123") }
```

### 遅延インジェクション (Lazy Injection)

**Hilt:**

```kotlin
@Inject
lateinit var heavyService: HeavyService
```

**Koin:**

```kotlin
// プロパティ委譲によりデフォルトで遅延評価されます
private val heavyService: HeavyService by inject()

// または明示的なlazy
private val heavyService: Lazy<HeavyService> by lazy { get() }
```

## 移行チェックリスト

移行の進捗確認にこのリストを使用してください：

- [ ] **依存関係**
  - [ ] Hilt Gradleプラグインを削除
  - [ ] Hiltの依存関係を削除
  - [ ] Koinの依存関係を追加
  - [ ] 他で必要なければ `kapt` を削除

- [ ] **Applicationクラス**
  - [ ] `@HiltAndroidApp` を削除
  - [ ] `onCreate()` に `startKoin {}` を追加
  - [ ] `androidContext()` とモジュールを設定

- [ ] **モジュール**
  - [ ] `@Module` + `@InstallIn` を `module { }` に変換
  - [ ] `@Provides` を `single { }` または `factory { }` に変換
  - [ ] `@Binds` をインターフェース・バインディングに変換
  - [ ] 限定子を `named()` に更新

- [ ] **ViewModel**
  - [ ] `@HiltViewModel` を削除
  - [ ] `viewModel { }` を使用してモジュールに追加
  - [ ] Composableを `koinViewModel()` を使用するように更新

- [ ] **Activity/Fragment**
  - [ ] `@AndroidEntryPoint` を削除
  - [ ] フィールド注入を `by inject()` に変換

- [ ] **テスト**
  - [ ] `@HiltAndroidTest` を削除
  - [ ] `KoinTest` を実装
  - [ ] setup/teardownに `startKoin` / `stopKoin` を追加

- [ ] **検証**
  - [ ] プロジェクトが正常にビルドできること
  - [ ] すべてのテストを実行
  - [ ] アプリ内の依存関係注入をテスト
  - [ ] ランタイムクラッシュがないことを確認

## トラブルシューティング

### "No definition found for X"

**問題**: Koinが型の定義を見つけられません。

**解決策**:
- モジュールが `startKoin { modules(...) }` でロードされているか確認してください。
- 定義が存在するか確認してください（`single { }` または `factory { }` を使用）。
- 正しい型が指定されているか確認してください。

### "DefinitionOverrideException"

**問題**: 同じ型に対して複数の定義が存在します。

**解決策**:
- 限定子を使用してください： `single(named("qualifier")) { }`
- オーバーライドを有効にしてください： `startKoin { allowOverride(true) }`

### 循環依存 (Circular Dependencies)

**問題**: 2つのクラスが互いに依存しています。

**解決策**:
- `lazy` インジェクションを使用してください： `private val service by lazy { get<MyService>() }`
- 循環依存を解消するようにリファクタリングしてください。
- スコープを使用してサイクルを断ち切ってください。

## その他のリソース

- **実践的な移行事例**: [Migrating Now in Android to Koin](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)
- **Koinドキュメント**: [はじめに](/docs/setup/koin)
- **Koin Annotations**: [Android Annotations ガイド](/docs/quickstart/android-annotations)

## ヘルプが必要ですか？

- **GitHub Discussions**: [Koinリポジトリ](https://github.com/InsertKoinIO/koin/discussions)で質問する
- **Slack**: SlackのKoinコミュニティに参加する
- **Stack Overflow**: `koin` タグを付けて質問する