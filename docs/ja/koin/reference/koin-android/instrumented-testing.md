---
title: Androidのインストゥルメンテッドテスト
---

## 概要

インストゥルメンテッドテスト（Instrumented tests）は、Androidデバイスまたはエミュレータ上で実行され、アプリとAndroidフレームワークとの統合をテストします。Koinのライフサイクルを制御するユニットテストとは異なり、インストゥルメンテッドテストでは `Application` クラスによってKoinが開始されるため、特別な処理が必要になります。

### ユニットテストとの主な違い

| 項目 | ユニットテスト | インストゥルメンテッドテスト |
|--------|------------|-------------------|
| **実行環境** | JVMのみ | Androidデバイス/エミュレータ |
| **Koinの開始** | テストクラス内 (`startKoin`) | `Application.onCreate()` 内 |
| **実行速度** | 高速 | 低速 |
| **Android API** | モック（Mocked） | 実機（Real） |
| **テストの分離** | 容易（各テストがクリーンに開始される） | 注意深いセットアップが必要 |
| **ユースケース** | ビジネスロジック、ViewModel | UI、Androidコンポーネントの統合 |

### インストゥルメンテッドテストでテストすべきもの

✅ **インストゥルメンテッドテストに適しているもの:**
- UIの動作とインタラクション
- Androidコンポーネントの統合（Activity、Fragment、Service）
- ナビゲーションフロー
- Roomを使用したデータベース操作
- Shared preferencesやファイルI/O
- Compose UIテスト

❌ **ユニットテストの方が適しているもの:**
- ビジネスロジック
- ViewModel（ユニットテスト可能）
- リポジトリ（モックを使用したユニットテストが可能）
- 純粋なKotlin関数

## テスト戦略

### 戦略 1: カスタムテストApplicationクラス

テスト専用のモジュールを持つ、テスト用のApplicationクラスを個別に作成します。

### 戦略 2: テストルール

JUnitルールを使用して、テストクラスまたはテストメソッドごとにKoinを構成します。

### 戦略 3: モジュールのオーバーライド

プロダクション用のApplicationを維持しつつ、テスト用に特定の定義をオーバーライドします。

それぞれの戦略を詳しく見ていきましょう。

## カスタムApplicationクラスでのプロダクションモジュールのオーバーライド

各テストクラスで実質的にKoinを開始する（すなわち `startKoin` や `KoinTestExtension` を呼び出す）[ユニットテスト](/docs/reference/koin-test/testing)とは異なり、インストゥルメンテッドテストでは `Application` クラスによってKoinが開始されます。

プロダクション用のKoinモジュールをオーバーライドする場合、`loadModules` や `unloadModules` は変更が即座に適用されないことが多いため、安全でない場合があります。代わりに、`Application` クラスの `startKoin` で使用される `modules` に、オーバーライド用の `module` を追加する方法が推奨されます。
アプリケーションの `Application` を継承しているクラスを変更したくない場合は、以下のように `AndroidTest` パッケージ内に別のクラスを作成できます。

```kotlin
class TestApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            modules(productionModule, instrumentedTestModule)
        }
    }
}
```

インストゥルメンテッドテストでこのカスタム `Application` を使用するには、以下のようにカスタム [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner) を作成する必要があるかもしれません。

```kotlin
class InstrumentationTestRunner : AndroidJUnitRunner() {
    override fun newApplication(
        classLoader: ClassLoader?,
        className: String?,
        context: Context?
    ): Application {
        return super.newApplication(classLoader, TestApplication::class.java.name, context)
    }
}
```

その後、gradleファイル内で以下のように登録します。

```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## テストルールを使用したプロダクションモジュールのオーバーライド

より柔軟性が必要な場合は、カスタム `AndroidJUnitRunner` を作成した上で、カスタムアプリケーション内で `startKoin { ... }` を実行する代わりに、以下のようなカスタムテストルール内に記述することができます。

```kotlin
class KoinTestRule(
    private val modules: List<Module>
) : TestWatcher() {
    override fun starting(description: Description) {

        if (getKoinApplicationOrNull() == null) {
            startKoin {
                androidContext(InstrumentationRegistry.getInstrumentation().targetContext.applicationContext)
                modules(modules)
            }
        } else {
            loadKoinModules(modules)
        }
    }

    override fun finished(description: Description) {
        unloadKoinModules(modules)
    }
}
```

これにより、以下のようにテストクラスから直接定義をオーバーライドできるようになります。

```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```

## モックとフェイク（Mocking and Fakes）

### `declareMock()` の使用（推奨）

:::info
**Koin 4.2+:** 個別のテストモジュールを作成することなく、テスト中に依存関係をオンザフライ（on-the-fly）で素早くモックするには、`declareMock()` を使用します。
:::

```kotlin
class UserViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            module {
                viewModelOf(::UserViewModel)
                // その他のプロダクション依存関係
            }
        )
    }

    @Test
    fun `test user loading`() {
        // オンザフライでモックを宣言
        declareMock<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
        }

        val viewModel: UserViewModel by inject()
        // モック化されたリポジトリを使用してテスト
    }
}
```

**`declareMock()` のメリット:**
- ✅ 個別のテストモジュールを作成する必要がない
- ✅ テストごとに必要なものだけをモックできる
- ✅ テストコードがクリーンになる
- ✅ MockKと標準で連携する

### テストダブル（Test Doubles）の使用

テストのために、実際の構成要素をモックまたはフェイクに置き換えます。

```kotlin
// プロダクションモジュール
val productionModule = module {
    single<UserRepository> { UserRepositoryImpl(get()) }
    single { ApiService.create() }
}

// フェイクを使用したテストモジュール
val testModule = module {
    single<UserRepository> { FakeUserRepository() }
    single<ApiService> { FakeApiService() }
}

// フェイクの実装
class FakeUserRepository : UserRepository {
    private val users = mutableListOf<User>()

    override suspend fun getUser(id: String): User {
        return users.find { it.id == id } ?: throw UserNotFoundException()
    }

    override suspend fun saveUser(user: User) {
        users.add(user)
    }

    // テスト専用のメソッド
    fun clearUsers() {
        users.clear()
    }
}
```

### MockK の使用

```kotlin
// MockKを使用したテストモジュール
val mockModule = module {
    single<UserRepository> {
        mockk<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
            coEvery { saveUser(any()) } just Runs
        }
    }
}

// テスト用Application
class TestApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@TestApplication)
            modules(mockModule)
        }
    }
}
```

### 部分的なモッキング（Partial Mocking）

特定の依存関係のみを置き換えます。

```kotlin
val testModule = module {
    // 実際の構成要素を維持
    single { Database.create(androidContext()) }

    // ネットワーク層をモック
    single<ApiService> { mockk<ApiService>() }

    // モック化されたAPIを使用して実際のリポジトリを使用
    single<UserRepository> { UserRepositoryImpl(get()) }
}
```

## Activity と Fragment のテスト

### Koin を使用した Activity のテスト

```kotlin
@RunWith(AndroidJUnit4::class)
class LoginActivityTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                viewModel { LoginViewModel(get()) }
                single<AuthService> { FakeAuthService() }
            }
        )
    )

    @Test
    fun testSuccessfulLogin() {
        val scenario = ActivityScenario.launch(LoginActivity::class.java)

        onView(withId(R.id.email)).perform(typeText("user@example.com"))
        onView(withId(R.id.password)).perform(typeText("password123"))
        onView(withId(R.id.loginButton)).perform(click())

        onView(withId(R.id.successMessage)).check(matches(isDisplayed()))

        scenario.close()
    }
}
```

### Koin を使用した Fragment のテスト

```kotlin
@RunWith(AndroidJUnit4::class)
class ProfileFragmentTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                viewModel { ProfileViewModel(get()) }
                single<UserRepository> {
                    mockk {
                        coEvery { getUser(any()) } returns User("1", "Test User")
                    }
                }
            }
        )
    )

    @Test
    fun testProfileDisplaysUserInfo() {
        val scenario = launchFragmentInContainer<ProfileFragment>()

        onView(withId(R.id.userName)).check(matches(withText("Test User")))

        scenario.close()
    }
}
```

## インストゥルメンテッドテストでの ViewModel のテスト

### テストでの ViewModel のインジェクト

```kotlin
@RunWith(AndroidJUnit4::class)
class HomeViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                viewModelOf(::HomeViewModel)
                single<UserRepository> { FakeUserRepository() }
            }
        )
    )

    private val viewModel: HomeViewModel by inject()

    @Test
    fun testLoadUserData() = runTest {
        viewModel.loadUser("123")

        val state = viewModel.userState.value
        assertEquals("Test User", state.name)
    }
}
```

### Activity を使用した ViewModel のテスト

```kotlin
@Test
fun testViewModelStateReflectsInUI() {
    val scenario = ActivityScenario.launch(HomeActivity::class.java)

    scenario.onActivity { activity ->
        val viewModel: HomeViewModel = activity.viewModel

        // ViewModelのアクションをトリガー
        viewModel.loadUser("123")

        // UIが更新されたことを確認
        onView(withId(R.id.userName)).check(matches(withText("Test User")))
    }
}
```

## Jetpack Compose でのテスト

### Koin を使用した Compose UI テスト

```kotlin
@RunWith(AndroidJUnit4::class)
class LoginScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                viewModelOf(::LoginViewModel)
                single<AuthService> { FakeAuthService() }
            }
        )
    )

    @Test
    fun testLoginFlow() {
        composeTestRule.setContent {
            KoinContext {
                LoginScreen()
            }
        }

        composeTestRule.onNodeWithTag("email_field")
            .performTextInput("user@example.com")

        composeTestRule.onNodeWithTag("password_field")
            .performTextInput("password123")

        composeTestRule.onNodeWithTag("login_button")
            .performClick()

        composeTestRule.onNodeWithTag("success_message")
            .assertIsDisplayed()
    }
}
```

### koinViewModel を使用した Composable のテスト

```kotlin
@Composable
fun HomeScreen(viewModel: HomeViewModel = koinViewModel()) {
    val user by viewModel.user.collectAsState()

    Text(text = user?.name ?: "Loading...")
}

// テスト
@Test
fun testHomeScreenDisplaysUser() {
    composeTestRule.setContent {
        KoinContext {
            HomeScreen()
        }
    }

    composeTestRule.onNodeWithText("Test User")
        .assertIsDisplayed()
}
```

## スコープ（Scopes）のテスト

### Activity スコープのテスト

```kotlin
@RunWith(AndroidJUnit4::class)
class CheckoutActivityTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                activityScope {
                    scoped { CheckoutState() }
                }
            }
        )
    )

    @Test
    fun testActivityScopeSharedAcrossFragments() {
        val scenario = ActivityScenario.launch(CheckoutActivity::class.java)

        scenario.onActivity { activity ->
            val state1 = activity.scope.get<CheckoutState>()
            state1.selectedAddress = Address("123 Main St")

            // 次のFragmentに遷移
            activity.supportFragmentManager.commit {
                replace(R.id.container, PaymentFragment())
            }

            // Fragment内でも同じスコープにアクセス可能
            val fragment = activity.supportFragmentManager
                .findFragmentById(R.id.container) as PaymentFragment

            val state2 = fragment.scope.get<CheckoutState>()
            assertEquals(state1, state2)
            assertEquals("123 Main St", state2.selectedAddress?.street)
        }
    }
}
```

### カスタムスコープのテスト

```kotlin
@Test
fun testCustomScopeLifecycle() {
    val testModule = module {
        scope(named("session")) {
            scoped { UserSession() }
        }
    }

    koinApplication {
        modules(testModule)

        // スコープの作成
        val sessionScope = koin.createScope("test_session", named("session"))
        val session = sessionScope.get<UserSession>()

        session.login("user@example.com")
        assertTrue(session.isLoggedIn)

        // スコープのクローズ
        sessionScope.close()

        // スコープは閉じられているため、アクセス不可
        assertThrows<ClosedScopeException> {
            sessionScope.get<UserSession>()
        }
    }
}
```

## マルチモジュールアプリのテスト

### フィーチャーモジュール（Feature Modules）を使用したテスト

```kotlin
@RunWith(AndroidJUnit4::class)
class MultiModuleTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            // コアモジュール
            networkModule,
            databaseModule,

            // フィーチャーモジュール
            loginModule,
            homeModule,

            // テスト用のオーバーライド
            module {
                single<ApiService>(override = true) { FakeApiService() }
            }
        )
    )

    @Test
    fun testFeatureIntegration() {
        // loginフィーチャーがhomeフィーチャーと連携して動作することをテスト
        val loginViewModel: LoginViewModel by inject()
        val homeViewModel: HomeViewModel by inject()

        runBlocking {
            loginViewModel.login("user@example.com", "password")
            homeViewModel.loadUserData()
        }

        assertEquals("user@example.com", homeViewModel.userState.value.email)
    }
}
```

### テストでのモジュール検証

```kotlin
class ModuleVerificationTest {

    @Test
    fun verifyAllModules() {
        // すべての定義が満たされているか検証
        appModule.verify()  // appModuleには他のモジュールも含まれる
    }

    @Test
    fun verifyTestModules() {
        testAppModule.verify()
    }
}
```

:::info
`verify()` および `checkModules()` は、将来的に Koin Compiler Plugin によるネイティブなコンパイル時の安全性に置き換えられる予定です。詳細は [モジュールの検証](/docs/reference/koin-test/verify) を参照してください。
:::

## Espresso を使用した UI テスト

### 完全な UI フローのテスト

```kotlin
@RunWith(AndroidJUnit4::class)
@LargeTest
class CheckoutFlowTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                viewModel { CheckoutViewModel(get(), get()) }
                single<CartRepository> { FakeCartRepository() }
                single<PaymentService> { FakePaymentService() }
            }
        )
    )

    @get:Rule
    val activityRule = ActivityScenarioRule(MainActivity::class.java)

    @Test
    fun testCompleteCheckoutFlow() {
        // カートへ移動
        onView(withId(R.id.cartButton)).perform(click())

        // カートにアイテムを追加
        onView(withId(R.id.addItemButton)).perform(click())
        onView(withId(R.id.cartItemCount)).check(matches(withText("1")))

        // チェックアウトに進む
        onView(withId(R.id.checkoutButton)).perform(click())

        // 配送先住所を入力
        onView(withId(R.id.addressField))
            .perform(typeText("123 Main St"))

        onView(withId(R.id.nextButton)).perform(click())

        // 支払い情報を入力
        onView(withId(R.id.cardNumberField))
            .perform(typeText("4111111111111111"))

        onView(withId(R.id.completeOrderButton)).perform(click())

        // 注文確認を表示
        onView(withId(R.id.confirmationMessage))
            .check(matches(isDisplayed()))
    }
}
```

### ナビゲーションのテスト

```kotlin
@Test
fun testNavigationWithSharedState() {
    onView(withId(R.id.loginButton)).perform(click())

    // ログイン画面
    onView(withId(R.id.emailField)).perform(typeText("user@example.com"))
    onView(withId(R.id.passwordField)).perform(typeText("password"))
    onView(withId(R.id.submitButton)).perform(click())

    // ホーム画面にナビゲートされるはず
    onView(withId(R.id.homeTitle)).check(matches(isDisplayed()))

    // ユーザーデータが利用可能である（Koinを通じて共有されている）
    onView(withId(R.id.welcomeMessage))
        .check(matches(withText("Welcome, user@example.com")))
}
```

## テストの分離（Test Isolation）

### テスト間でのクリーンな状態の保証

```kotlin
class KoinIsolationTestRule : TestWatcher() {

    override fun starting(description: Description) {
        // 新しいKoinインスタンスを開始
        startKoin {
            androidContext(InstrumentationRegistry.getInstrumentation().targetContext)
            modules(emptyList())
        }
    }

    override fun finished(description: Description) {
        // 各テストの後にクリーンアップ
        stopKoin()
    }
}

@RunWith(AndroidJUnit4::class)
class IsolatedTest {

    @get:Rule
    val isolationRule = KoinIsolationTestRule()

    @Test
    fun test1() {
        loadKoinModules(module { single { "Test1" } })
        assertEquals("Test1", get<String>())
    }

    @Test
    fun test2() {
        // 新しいKoinインスタンスのため、test1の影響を受けない
        loadKoinModules(module { single { "Test2" } })
        assertEquals("Test2", get<String>())
    }
}
```

### テスト間でのフェイクのリセット

```kotlin
class FakeUserRepository : UserRepository {
    private val users = mutableListOf<User>()

    override suspend fun getUser(id: String): User =
        users.find { it.id == id } ?: throw UserNotFoundException()

    fun reset() {
        users.clear()
    }
}

@RunWith(AndroidJUnit4::class)
class UserTest {

    private val fakeRepo = FakeUserRepository()

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            module {
                single<UserRepository> { fakeRepo }
            }
        )
    )

    @Before
    fun setup() {
        fakeRepo.reset()
    }

    @Test
    fun test1() {
        // クリーンなリポジトリでテスト
    }

    @Test
    fun test2() {
        // クリーンなリポジトリでテスト（resetが呼び出されている）
    }
}
```

## よく使われるパターン

### パターン 1: 共有テストモジュール

```kotlin
// androidTestパッケージ内の TestModules.kt
object TestModules {

    val fakeNetworkModule = module {
        single<ApiService> { FakeApiService() }
        single { OkHttpClient() }
    }

    val fakeDatabaseModule = module {
        single { createInMemoryDatabase() }
        single<UserDao> { get<AppDatabase>().userDao() }
    }

    val fakeDataModule = module {
        single<UserRepository> { FakeUserRepository() }
    }

    fun createInMemoryDatabase(): AppDatabase {
        return Room.inMemoryDatabaseBuilder(
            InstrumentationRegistry.getInstrumentation().targetContext,
            AppDatabase::class.java
        ).build()
    }
}

// テストでの使用
@get:Rule
val koinTestRule = KoinTestRule(
    modules = TestModules.fakeNetworkModule + TestModules.fakeDataModule
)
```

### パターン 2: テスト固有の構成

```kotlin
class TestConfig {
    companion object {
        const val TEST_API_URL = "http://localhost:8080"
        const val TEST_TIMEOUT_MS = 1000L
    }
}

val testConfigModule = module {
    single {
        OkHttpClient.Builder()
            .connectTimeout(TestConfig.TEST_TIMEOUT_MS, TimeUnit.MILLISECONDS)
            .build()
    }

    single {
        Retrofit.Builder()
            .baseUrl(TestConfig.TEST_API_URL)
            .client(get())
            .build()
    }
}
```

### パターン 3: テストごとのオーバーライド

```kotlin
@RunWith(AndroidJUnit4::class)
class FlexibleTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule(modules = emptyList())

    @Test
    fun testWithFakeRepo() {
        loadKoinModules(module {
            single<UserRepository> { FakeUserRepository() }
        })

        // テストコード
    }

    @Test
    fun testWithMockRepo() {
        loadKoinModules(module {
            single<UserRepository> { mockk<UserRepository>() }
        })

        // テストコード
    }

    @After
    fun cleanup() {
        unloadKoinModules(/* テストでロードされたモジュール */)
    }
}
```

## トラブルシューティング

### 問題: Koin が既に開始されている

**事象:**
```
org.koin.core.error.KoinAppAlreadyStartedException: A Koin Application has already been started
```

**解決策:**
```kotlin
class SafeKoinTestRule : TestWatcher() {
    override fun starting(description: Description) {
        // Koinが既に開始されているかチェック
        if (getKoinApplicationOrNull() == null) {
            startKoin {
                modules(testModules)
            }
        } else {
            // 既存のKoinインスタンスにモジュールをロード
            loadKoinModules(testModules)
        }
    }

    override fun finished(description: Description) {
        // Koinを停止せず、テストモジュールのみアンロード
        unloadKoinModules(testModules)
    }
}
```

### 問題: 定義のオーバーライドが機能しない

**事象:**
テスト用の定義がプロダクション用の定義を置き換えない。

**解決策:**
```kotlin
// override = true を使用する
val testModule = module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}

// または includes を使用して置き換える
val testModule = module {
    includes(productionModule)
} + module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}
```

### 問題: スコープが見つからない

**事象:**
```
org.koin.core.error.NoBeanDefFoundException: No definition found for class X
```

**解決策:**
```kotlin
// アクセスする前にスコープが作成されていることを確認
val scenario = ActivityScenario.launch(MyActivity::class.java)

scenario.onActivity { activity ->
    // ここでスコープが存在する
    val dependency = activity.scope.get<MyDependency>()
}
```

### 問題: テストが互いに影響し合っている

**事象:**
個別のテストはパスするが、一括実行すると失敗する。

**解決策:**
```kotlin
// テスト間での適切なクリーンアップ
@After
fun tearDown() {
    // スコープを閉じる
    getKoin().scopeRegistry.deleteScope("test_scope")

    // フェイクをリセット
    fakeRepository.reset()

    // テストモジュールをアンロード
    unloadKoinModules(testModules)
}
```

### 問題: ViewModel が UI を更新しない

**事象:**
ViewModel の状態は変化しているが、テストで UI が更新されない。

**解決策:**
```kotlin
// 非同期操作に Espresso の IdlingResource を使用する
@get:Rule
val activityRule = ActivityScenarioRule(MyActivity::class.java)

@Test
fun testViewModelUpdatesUI() = runTest {
    activityRule.scenario.onActivity { activity ->
        val viewModel: MyViewModel = activity.viewModel

        // 非同期アクションをトリガー
        viewModel.loadData()

        // LiveData/StateFlow の発行を待機
        advanceUntilIdle()

        // その後 UI を検証
        onView(withId(R.id.dataText))
            .check(matches(withText("Data Loaded")))
    }
}
```

## ベストプラクティス

### 1. テストにはインメモリデータベースを使用する

```kotlin
val testDatabaseModule = module {
    single {
        Room.inMemoryDatabaseBuilder(
            androidContext(),
            AppDatabase::class.java
        ).build()
    }
}
```

### 2. テストモジュールの責務を絞る

```kotlin
// ✅ 良い例 - 責務が絞られたテストモジュール
val loginTestModule = module {
    viewModel { LoginViewModel(get()) }
    single<AuthService> { FakeAuthService() }
}

// ❌ 悪い例 - 範囲が広すぎる
val hugeTestModule = module {
    // 50以上の定義...
}
```

### 3. 共通のフェイクを共有する

```kotlin
// 再利用可能なテストダブルを作成
object TestDoubles {
    fun createFakeUserRepository() = FakeUserRepository().apply {
        addUser(User("1", "Test User"))
    }

    fun createMockApiService() = mockk<ApiService> {
        coEvery { getUser(any()) } returns User("1", "Test User")
    }
}
```

### 4. 実際の統合ポイントをテストする

```kotlin
// 実際の Room + Repository の統合をテスト
@Test
fun testDatabaseIntegration() = runTest {
    val database = Room.inMemoryDatabaseBuilder(
        context,
        AppDatabase::class.java
    ).build()

    val repo = UserRepositoryImpl(database.userDao())

    repo.saveUser(User("1", "Test"))
    val user = repo.getUser("1")

    assertEquals("Test", user.name)
}
```

### 5. 説明的なテスト名を使用する

```kotlin
// ✅ 良い例
@Test
fun loginWithValidCredentials_navigatesToHomeScreen()

@Test
fun loginWithInvalidEmail_showsEmailError()

// ❌ 悪い例
@Test
fun test1()

@Test
fun testLogin()
```

## まとめ

Koin を使用したインストゥルメンテッドテストの重要ポイント：

- Koin 構成には、**カスタムテスト用Application** または **テストルール** を使用する。
- `override = true` またはテスト専用モジュールを使用して、**モジュールをオーバーライド** する。
- インストゥルメンテッドテストでのパフォーマンス向上のため、**モックよりもフェイクを使用** する。
- **テストの分離** は極めて重要であり、テストごとにクリーンアップを行う。
- 高速で分離されたデータベーステストのために、**インメモリデータベース** を使用する。
- **Compose テスト** は `KoinContext` とシームレスに動作する。
- **スコープのテスト** を行い、ライフサイクルに紐づく依存関係を検証する。
- `verify()` による **モジュール検証** を行い、構成エラーを早期に発見する。

## 次のステップ

- **[ユニットテスト](/docs/reference/koin-test/testing)** - ユニットテストのテスト戦略
- **[モジュールの検証](/docs/reference/koin-test/verify)** - モジュール構成の検証
- **[マルチモジュールアプリ](/docs/reference/koin-android/multi-module)** - マルチモジュールアーキテクチャのテスト
- **[ベストプラクティス](/docs/reference/koin-android/best-practices)** - Koin 全般のベストプラクティス