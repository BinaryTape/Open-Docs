---
title: 從 Hilt 遷移到 Koin
---

這份指南將協助您將 Android 應用程式從 Dagger Hilt 遷移到 Koin。無論您是使用 Koin DSL 還是 Koin Annotations，這份指南都涵蓋了主要差異與遷移步驟。

:::info
如需完整的真實案例，請查看 [Now in Android 遷移實例](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)，該案例展示了擁有 30 個 Gradle 模組的 Google 生產級新聞應用程式如何從 Hilt 遷移到 Koin Annotations。
:::

## 為什麼要遷移到 Koin？

**Koin 的主要優勢：**

- **無程式碼產生** – Koin 使用執行期相依性解析，不需要註解處理器。
- **設定更簡單** – 沒有複雜的元件階層或 `@InstallIn` 宣告。
- **Kotlin 優先** – 使用起來非常自然的慣用 Kotlin DSL。
- **更輕量** – 沒有 kapt/KSP 程式碼產生（針對 DSL 方式），建置時間更快。
- **多模組友善** – 不需要 `@EntryPoint` 介面。
- **支援 JSR-330** – 現有的 `@Inject` 建構函式無需修改即可運作。

## 快速參考：Hilt vs Koin

### 註解對應

| Hilt | Koin DSL | Koin Annotations |
|------|------------------------------------------|-----------------------------------------------------------------------------------------------------|
| `@HiltAndroidApp` | Application 中的 `startKoin {}` | `@KoinApplication` |
| `@AndroidEntryPoint` | `by inject()` / `by viewModel()` | `by inject()` / `by viewModel()` |
| `@HiltViewModel` | `viewModel { MyViewModel(...) }` | `@KoinViewModel` |
| `@Inject` 建構函式 | DSL 指定建構函式參數 | 自動偵測建構函式參數 (JSR-330) |
| `@Module` + `@InstallIn` | `module { }` | `@Module` + `@ComponentScan` |
| `@Provides` | `single { }` 或 `factory { }` | `@Single` / `@Factory` |
| `@Binds` | `single<Interface> { Implementation() }` | `@Single` 或 `@Singleton` 會自動偵測繫結。也可以使用這些註解的 `binds` 屬性。 |
| `@Singleton` | `single { }` | `@Single` 或 `@Singleton` |
| `@Named("qualifier")` | `named("qualifier")` | `@Named("qualifier")` |
| `@ApplicationContext` | 自動 Context 注入 | 自動 Context 注入 |
| `@EntryPoint` | 不需要 | 不需要 |

### 作用域 (Scope) 對應

| Hilt 作用域 | Koin DSL | Koin Annotations | 備註 |
|------------|----------|------------------|-------|
| `@Singleton` | `single { }` | `@Single` / `@Singleton` | 全應用程式範圍的單例 |
| `@ActivityScoped` | `activityScope { scoped { } }` | `@ActivityScope` | 繫結至 Activity 生命週期 |
| `@ViewModelScoped` | `viewModelScope { scoped { } }` | `@ViewModelScope` | 繫結至 ViewModel 生命週期 |
| `@ActivityRetainedScoped` | `activityRetainedScope { scoped { } }` | `@ActivityRetainedScope` | 在組態變更後繼續存在 |

## 遷移步驟

### 步驟 1：更新相依性

**移除 Hilt 相依性：**

```kotlin
// 從 build.gradle.kts 中移除這些內容
plugins {
    id("com.google.dagger.hilt.android") // 移除
}

dependencies {
    // 移除 Hilt 相依性
    implementation("com.google.dagger:hilt-android:...")
    kapt("com.google.dagger:hilt-compiler:...")
}
```

**加入 Koin 相依性：**

```kotlin
// build.gradle.kts (app 模組)
dependencies {
    // 適用於 Android 的 Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")

    // 選用：Koin Annotations
    implementation("io.insert-koin:koin-annotations:$koin_ksp_version")
    ksp("io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

### 步驟 2：應用程式設定

**Hilt：**

```kotlin
@HiltAndroidApp
class MyApplication : Application()
```

**Koin DSL：**

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

**Koin Annotations：**

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
使用 `@KoinApplication` 時，如果模組被標記為 `@Configuration`，系統會自動發現這些模組。您也可以使用 `modules` 屬性明確包含模組：`@KoinApplication(modules = [AppModule::class])`。
:::

### 步驟 3：遷移模組

**Hilt：**

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

**Koin DSL：**

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
            .client(get()) // 自動相依性解析
            .build()
    }

    single {
        get<Retrofit>().create(ApiService::class.java)
    }
}
```

**Koin Annotations：**

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

### 步驟 4：遷移 ViewModel

**Hilt：**

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

**Koin DSL：**

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

**Koin Annotations：**

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
`viewModelOf` 這個 DSL 函式使用了建構函式參數自動裝配 (autowiring)。`SavedStateHandle` 會由 Koin 自動提供，因此您不需要明確傳遞它。這是 Koin 自動裝配 DSL 的一部分，它簡化了 ViewModel 的定義。
:::

### 步驟 5：遷移 Activity 與 Fragment

**Hilt：**

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

**Koin：**

```kotlin
class MainActivity : ComponentActivity() {

    // 屬性委託 - 不需要註解
    private val analytics: AnalyticsService by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        analytics.logEvent("screen_view")
    }
}
```

:::info
使用 Koin 時，您不需要 `@AndroidEntryPoint` – 只要使用 `by inject()` 或 `by viewModel()` 屬性委託即可。
:::

### 步驟 6：遷移介面繫結

**Hilt：**

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

**Koin DSL：**

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

**Koin Annotations（自動繫結偵測）：**

```kotlin
// 選項 1：自動 - Koin 會偵測介面繫結
@Singleton
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
// Koin 會自動將 MyRepositoryImpl 繫結至 MyRepository

// 選項 2：使用 binds 屬性明確指定
@Single(binds = [MyRepository::class])
class MyRepositoryImpl(
    private val apiService: ApiService
) : MyRepository {
    // ...
}
```

:::info
當一個類別實作介面時，Koin Annotations 會自動偵測介面繫結。當您需要明確指定多個介面或控制繫結行為時，請使用 `binds` 屬性。
:::

### 步驟 7：遷移限定符 (Qualifiers)

**Hilt：**

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

**Koin DSL（基於字串）：**

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

**Koin DSL（型別安全）：**

```kotlin
// 定義限定符型別
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

**Koin Annotations（基於字串）：**

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

**Koin Annotations（搭配 JSR-330 @Qualifier - 完全相容！）：**

```kotlin
// 保留您現有的 JSR-330 限定符註解！
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
Koin Annotations 完全支援 JSR-330 `@Qualifier` 註解！這是一個標準的 Java/Kotlin DI 註解（非 Hilt 專屬），因此您在遷移期間可以保持現有的限定符註解不變。DSL 也支援使用 `named<T>()` 代替基於字串的 `named("string")` 來實作型別安全限定符。
:::

### 步驟 8：遷移 Compose 整合

**Hilt：**

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

**Koin：**

```kotlin
@Composable
fun MyScreen(
    viewModel: MyViewModel = koinViewModel()
) {
    // 直接注入 - 不需要 EntryPoint
    val dependency: SomeDependency = koinInject()
}
```

### 步驟 9：遷移測試

**Hilt：**

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

**Koin：**

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

## 多模組專案

### Hilt 方式

使用 Hilt，您需要：
- `@InstallIn` 來指定元件階層
- `@EntryPoint` 介面用於跨模組存取
- 複雜的元件相依性

### Koin 方式

使用 Koin：
- 每個模組宣告自己的 Koin 模組
- 在 Application 類別中匯入所有模組
- 不需要特殊的介面

**使用 Koin 的功能模組：**

```kotlin
// :feature:home 模組
val homeModule = module {
    viewModel { HomeViewModel(get()) }
    factory { HomeRepository(get()) }
}

// :app 模組
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@MyApplication)
            modules(
                coreModule,
                dataModule,
                homeModule,  // 功能模組
                profileModule // 另一個功能模組
            )
        }
    }
}
```

詳情請參閱 [多模組架構](/docs/reference/koin-android/multi-module)。

## 常見模式

### 建構函式注入 (JSR-330)

最大的優勢之一：**現有的 `@Inject` 建構函式可以與 Koin Annotations 搭配運作！**

```kotlin
// 這在 Hilt 和 Koin Annotations 中都能運作
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

使用 Koin Annotations，您可以保持 `@Inject` 建構函式不變，只需在類別中加入 `@Single`、`@Singleton` 或 `@Factory`：

```kotlin
@Single // 或 @Singleton
class MyRepository @Inject constructor(
    private val apiService: ApiService,
    private val database: AppDatabase
) {
    // ...
}
```

### 輔助注入 (AssistedInject)

**Hilt：**

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

**Koin：**

```kotlin
class MyViewModel(
    private val repository: MyRepository,
    private val userId: String
) : ViewModel()

val appModule = module {
    viewModelOf(::MyViewModel)
}

// 用法
val viewModel: MyViewModel by viewModel { parametersOf("user123") }
```

### 延遲注入 (Lazy Injection)

**Hilt：**

```kotlin
@Inject
lateinit var heavyService: HeavyService
```

**Koin：**

```kotlin
// 使用屬性委託時預設為延遲載入
private val heavyService: HeavyService by inject()

// 或明確使用 lazy
private val heavyService: Lazy<HeavyService> by lazy { get() }
```

## 遷移檢查表

使用此檢查表來追蹤您的遷移進度：

- [ ] **相依性**
  - [ ] 移除 Hilt Gradle 外掛程式
  - [ ] 移除 Hilt 相依性
  - [ ] 加入 Koin 相依性
  - [ ] 如果其他地方不需要，移除 `kapt`

- [ ] **Application 類別**
  - [ ] 移除 `@HiltAndroidApp`
  - [ ] 在 `onCreate()` 中加入 `startKoin {}`
  - [ ] 設定 `androidContext()` 與模組

- [ ] **模組**
  - [ ] 將 `@Module` + `@InstallIn` 轉換為 `module { }`
  - [ ] 將 `@Provides` 轉換為 `single { }` 或 `factory { }`
  - [ ] 將 `@Binds` 轉換為介面繫結
  - [ ] 將限定符更新為 `named()`

- [ ] **ViewModels**
  - [ ] 移除 `@HiltViewModel`
  - [ ] 使用 `viewModel { }` 加入模組
  - [ ] 更新 Composable 以使用 `koinViewModel()`

- [ ] **Activity/Fragment**
  - [ ] 移除 `@AndroidEntryPoint`
  - [ ] 將欄位注入轉換為 `by inject()`

- [ ] **測試**
  - [ ] 移除 `@HiltAndroidTest`
  - [ ] 實作 `KoinTest`
  - [ ] 在 setup/teardown 中加入 `startKoin` / `stopKoin`

- [ ] **驗證**
  - [ ] 專案建置成功
  - [ ] 執行所有測試
  - [ ] 測試應用程式內的相依性注入
  - [ ] 驗證無執行期崩潰

## 疑難排解

### "No definition found for X"

**問題**：Koin 找不到該型別的定義。

**解決方案**：
- 確保模組已載入至 `startKoin { modules(...) }` 中。
- 檢查定義是否存在（使用 `single { }` 或 `factory { }`）。
- 驗證是否指定了正確的型別。

### "DefinitionOverrideException"

**問題**：同一個型別有多個定義。

**解決方案**：
- 使用限定符：`single(named("qualifier")) { }`
- 啟用覆寫：`startKoin { allowOverride(true) }`

### 循環相依 (Circular Dependencies)

**問題**：兩個類別互相依賴。

**解決方案**：
- 使用 `lazy` 注入：`private val service by lazy { get<MyService>() }`
- 重構以移除循環相依。
- 使用作用域來打破循環。

## 其他資源

- **真實案例遷移**：[將 Now in Android 遷移至 Koin](https://blog.insert-koin.io/migrating-now-in-android-to-koin-annotations-2-3-67d252dbb97d)
- **Koin 文件**：[快速入門](/docs/setup/koin)
- **Koin Annotations**：[Android 註解指南](/docs/quickstart/android-annotations)

## 需要協助？

- **GitHub Discussions**：在 [Koin 儲存庫](https://github.com/InsertKoinIO/koin/discussions) 中提問。
- **Slack**：加入 Slack 上的 Koin 社群。
- **Stack Overflow**：為問題加上 `koin` 標籤。