---
title: Android Instrumented 測試
---

## 總覽

Instrumented 測試在 Android 裝置或模擬器上執行，並測試您的應用程式與 Android 架構的整合情況。與您可以控制 Koin 生命週期的單元測試不同，Instrumented 測試需要特殊處理，因為 Koin 是由您的 `Application` 類別啟動的。

### 與單元測試的主要區別

| 面向 | 單元測試 | Instrumented 測試 |
|--------|------------|-------------------|
| **執行** | 僅限 JVM | Android 裝置/模擬器 |
| **Koin 啟動** | 在測試類別中 (`startKoin`) | 在 `Application.onCreate()` 中 |
| **速度** | 快 | 較慢 |
| **Android API** | 模擬 (Mocked) | 真實 |
| **測試隔離** | 容易 (每個測試都重新開始) | 需要仔細設定 |
| **使用案例** | 業務邏輯、ViewModel | UI、Android 元件整合 |

### 哪些內容適合使用 Instrumented 測試

✅ **適合 Instrumented 測試：**
- UI 行為與互動
- Android 元件整合（Activity、Fragment、Service）
- 導覽流程
- 使用 Room 的資料庫操作
- Shared preferences 與檔案 I/O
- Compose UI 測試

❌ **更適合單元測試：**
- 業務邏輯
- ViewModel（可以進行單元測試）
- Repository（可以使用模擬物件進行單元測試）
- 純 Kotlin 函式

## 測試策略

### 策略 1：自訂測試應用程式

為測試建立一個獨立的 Application 類別，並配備測試特定的模組。

### 策略 2：測試規則

使用 JUnit 規則為每個測試類別或測試方法配置 Koin。

### 策略 3：模組覆寫

保留生產環境的 Application，但針對測試覆寫特定的定義。

讓我們詳細探討每種策略。

## 在自訂 Application 類別中覆寫生產環境模組

與 [單元測試](/docs/reference/koin-test/testing) 不同，在單元測試中您實際上是在每個測試類別中呼叫啟動 Koin（即 `startKoin` 或 `KoinTestExtension`），而在 Instrumented 測試中，Koin 是由您的 `Application` 類別啟動的。

為了覆寫生產環境的 Koin 模組，`loadModules` 與 `unloadModules` 通常是不安全的，因為變更不會立即套用。相反地，建議的方法是將您要覆寫的 `module` 加入到 `Application` 類別中 `startKoin` 所使用的 `modules` 裡。
如果您想保持應用程式中繼承 `Application` 的類別不被更動，您可以在 `AndroidTest` 套件中建立另一個類別，例如：
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
為了在您的 Instrumentation 測試中使用此自訂 `Application`，您可能需要建立一個自訂的 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，例如：
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
然後在您的 gradle 檔案中透過以下方式註冊：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用測試規則覆寫生產環境模組

如果您想要更多彈性，您仍然需要建立自訂的 `AndroidJUnitRunner`，但不是在自訂應用程式內使用 `startKoin { ... }`，而是可以將其放入自訂測試規則中，例如：
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
透過這種方式，我們可以潛在地直接從測試類別中覆寫定義，例如：
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```

## 模擬與 Fake

### 使用 `declareMock()` (推薦)

:::info
**Koin 4.2+：** 使用 `declareMock()` 在測試中即時快速模擬相依性，無需建立獨立的測試模組。
:::

```kotlin
class UserViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            module {
                viewModelOf(::UserViewModel)
                // 其他生產環境相依性
            }
        )
    }

    @Test
    fun `test user loading`() {
        // 即時宣告模擬
        declareMock<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
        }

        val viewModel: UserViewModel by inject()
        // 使用模擬的 repository 進行測試
    }
}
```

**`declareMock()` 的優點：**
- ✅ 無需建立獨立的測試模組
- ✅ 僅針對每個測試模擬所需的內容
- ✅ 測試程式碼更簡潔
- ✅ 開箱即用支援 MockK

### 使用測試替身 (Test Doubles)

使用模擬物件或 Fake 取代真實實作進行測試：

```kotlin
// 生產環境模組
val productionModule = module {
    single<UserRepository> { UserRepositoryImpl(get()) }
    single { ApiService.create() }
}

// 包含 Fake 的測試模組
val testModule = module {
    single<UserRepository> { FakeUserRepository() }
    single<ApiService> { FakeApiService() }
}

// Fake 實作
class FakeUserRepository : UserRepository {
    private val users = mutableListOf<User>()

    override suspend fun getUser(id: String): User {
        return users.find { it.id == id } ?: throw UserNotFoundException()
    }

    override suspend fun saveUser(user: User) {
        users.add(user)
    }

    // 測試專用方法
    fun clearUsers() {
        users.clear()
    }
}
```

### 使用 MockK

```kotlin
// 使用 MockK 的測試模組
val mockModule = module {
    single<UserRepository> {
        mockk<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
            coEvery { saveUser(any()) } just Runs
        }
    }
}

// 測試應用程式
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

### 部分模擬 (Partial Mocking)

僅取代特定的相依性：

```kotlin
val testModule = module {
    // 保留真實實作
    single { Database.create(androidContext()) }

    // 模擬網路層
    single<ApiService> { mockk<ApiService>() }

    // 使用模擬的 API 搭配真實的 repository
    single<UserRepository> { UserRepositoryImpl(get()) }
}
```

## 測試 Activity 與 Fragment

### 使用 Koin 測試 Activity

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

### 使用 Koin 測試 Fragment

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

## 在 Instrumented 測試中測試 ViewModel

### 在測試中注入 ViewModel

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

### 搭配 Activity 測試 ViewModel

```kotlin
@Test
fun testViewModelStateReflectsInUI() {
    val scenario = ActivityScenario.launch(HomeActivity::class.java)

    scenario.onActivity { activity ->
        val viewModel: HomeViewModel = activity.viewModel

        // 觸發 ViewModel 操作
        viewModel.loadUser("123")

        // 驗證 UI 已更新
        onView(withId(R.id.userName)).check(matches(withText("Test User")))
    }
}
```

## 使用 Jetpack Compose 進行測試

### 使用 Koin 進行 Compose UI 測試

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

### 使用 koinViewModel 測試 Composable

```kotlin
@Composable
fun HomeScreen(viewModel: HomeViewModel = koinViewModel()) {
    val user by viewModel.user.collectAsState()

    Text(text = user?.name ?: "Loading...")
}

// 測試
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

## 測試作用域 (Scopes)

### 測試 Activity 作用域

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

            // 導覽至下一個 fragment
            activity.supportFragmentManager.commit {
                replace(R.id.container, PaymentFragment())
            }

            // 在 fragment 中可存取相同的作用域
            val fragment = activity.supportFragmentManager
                .findFragmentById(R.id.container) as PaymentFragment

            val state2 = fragment.scope.get<CheckoutState>()
            assertEquals(state1, state2)
            assertEquals("123 Main St", state2.selectedAddress?.street)
        }
    }
}
```

### 測試自訂作用域

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

        // 建立作用域
        val sessionScope = koin.createScope("test_session", named("session"))
        val session = sessionScope.get<UserSession>()

        session.login("user@example.com")
        assertTrue(session.isLoggedIn)

        // 關閉作用域
        sessionScope.close()

        // 作用域已關閉，無法存取
        assertThrows<ClosedScopeException> {
            sessionScope.get<UserSession>()
        }
    }
}
```

## 測試多模組應用程式

### 使用功能模組進行測試

```kotlin
@RunWith(AndroidJUnit4::class)
class MultiModuleTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            // 核心模組
            networkModule,
            databaseModule,

            // 功能模組
            loginModule,
            homeModule,

            // 測試覆寫
            module {
                single<ApiService>(override = true) { FakeApiService() }
            }
        )
    )

    @Test
    fun testFeatureIntegration() {
        // 測試登入功能是否能與首頁功能協作
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

### 在測試中驗證模組

```kotlin
class ModuleVerificationTest {

    @Test
    fun verifyAllModules() {
        // 驗證所有定義是否已滿足
        appModule.verify()  // appModule 包含其他模組
    }

    @Test
    fun verifyTestModules() {
        testAppModule.verify()
    }
}
```

:::tip
Koin 編譯器外掛程式現在提供編譯期相依性驗證，取代了對 `verify()` 與 `checkModules()` 的需求。詳情請參閱 [編譯期安全性](/docs/reference/koin-compiler/compile-safety)。
:::

## 使用 Espresso 進行 UI 測試

### 完整 UI 流程測試

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
        // 導覽至購物車
        onView(withId(R.id.cartButton)).perform(click())

        // 將項目加入購物車
        onView(withId(R.id.addItemButton)).perform(click())
        onView(withId(R.id.cartItemCount)).check(matches(withText("1")))

        // 繼續結帳
        onView(withId(R.id.checkoutButton)).perform(click())

        // 填寫運送地址
        onView(withId(R.id.addressField))
            .perform(typeText("123 Main St"))

        onView(withId(R.id.nextButton)).perform(click())

        // 輸入付款資訊
        onView(withId(R.id.cardNumberField))
            .perform(typeText("4111111111111111"))

        onView(withId(R.id.completeOrderButton)).perform(click())

        // 驗證訂單確認
        onView(withId(R.id.confirmationMessage))
            .check(matches(isDisplayed()))
    }
}
```

### 測試導覽

```kotlin
@Test
fun testNavigationWithSharedState() {
    onView(withId(R.id.loginButton)).perform(click())

    // 登入畫面
    onView(withId(R.id.emailField)).perform(typeText("user@example.com"))
    onView(withId(R.id.passwordField)).perform(typeText("password"))
    onView(withId(R.id.submitButton)).perform(click())

    // 應該導覽至首頁
    onView(withId(R.id.homeTitle)).check(matches(isDisplayed()))

    // 使用者資料應可用（透過 Koin 共享）
    onView(withId(R.id.welcomeMessage))
        .check(matches(withText("Welcome, user@example.com")))
}
```

## 測試隔離

### 確保測試之間狀態純淨

```kotlin
class KoinIsolationTestRule : TestWatcher() {

    override fun starting(description: Description) {
        // 啟動全新的 Koin 執行個體
        startKoin {
            androidContext(InstrumentationRegistry.getInstrumentation().targetContext)
            modules(emptyList())
        }
    }

    override fun finished(description: Description) {
        // 每個測試後進行清理
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
        // 全新的 Koin 執行個體，不受 test1 污染
        loadKoinModules(module { single { "Test2" } })
        assertEquals("Test2", get<String>())
    }
}
```

### 在測試之間重設 Fake

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
        // 使用純淨的存儲庫進行測試
    }

    @Test
    fun test2() {
        // 使用純淨的存儲庫進行測試（已呼叫 reset）
    }
}
```

## 常見模式

### 模式 1：共享測試模組

```kotlin
// androidTest 套件中的 TestModules.kt
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

// 在測試中使用
@get:Rule
val koinTestRule = KoinTestRule(
    modules = TestModules.fakeNetworkModule + TestModules.fakeDataModule
)
```

### 模式 2：測試特定配置

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

### 模式 3：逐測試覆寫 (Per-Test Override)

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

        // 測試程式碼
    }

    @Test
    fun testWithMockRepo() {
        loadKoinModules(module {
            single<UserRepository> { mockk<UserRepository>() }
        })

        // 測試程式碼
    }

    @After
    fun cleanup() {
        unloadKoinModules(/* 測試中載入的模組 */)
    }
}
```

## 疑難排解

### 問題：Koin 已經啟動

**問題描述：**
```
org.koin.core.error.KoinAppAlreadyStartedException: A Koin Application has already been started
```

**解決方案：**
```kotlin
class SafeKoinTestRule : TestWatcher() {
    override fun starting(description: Description) {
        // 檢查 Koin 是否已啟動
        if (getKoinApplicationOrNull() == null) {
            startKoin {
                modules(testModules)
            }
        } else {
            // 將模組載入至現有的 Koin 執行個體中
            loadKoinModules(testModules)
        }
    }

    override fun finished(description: Description) {
        // 不要停止 Koin，僅卸載測試模組
        unloadKoinModules(testModules)
    }
}
```

### 問題：定義覆寫無效

**問題描述：**
測試定義未能取代生產環境定義。

**解決方案：**
```kotlin
// 使用 override = true
val testModule = module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}

// 或使用 includes 來取代
val testModule = module {
    includes(productionModule)
} + module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}
```

### 問題：找不到作用域

**問題描述：**
```
org.koin.core.error.NoBeanDefFoundException: No definition found for class X
```

**解決方案：**
```kotlin
// 確保在存取前已建立作用域
val scenario = ActivityScenario.launch(MyActivity::class.java)

scenario.onActivity { activity ->
    // 作用域在此處存在
    val dependency = activity.scope.get<MyDependency>()
}
```

### 問題：測試相互影響

**問題描述：**
測試單獨執行時通過，但一起執行時失敗。

**解決方案：**
```kotlin
// 在測試之間進行適當清理
@After
fun tearDown() {
    // 關閉作用域
    getKoin().scopeRegistry.deleteScope("test_scope")

    // 重設 Fake
    fakeRepository.reset()

    // 卸載測試模組
    unloadKoinModules(testModules)
}
```

### 問題：ViewModel 未更新 UI

**問題描述：**
ViewModel 狀態已變更，但 UI 在測試中未更新。

**解決方案：**
```kotlin
// 使用 Espresso 的 IdlingResource 處理非同步操作
@get:Rule
val activityRule = ActivityScenarioRule(MyActivity::class.java)

@Test
fun testViewModelUpdatesUI() = runTest {
    activityRule.scenario.onActivity { activity ->
        val viewModel: MyViewModel = activity.viewModel

        // 觸發非同步操作
        viewModel.loadData()

        // 等待 LiveData/StateFlow 發送
        advanceUntilIdle()

        // 然後驗證 UI
        onView(withId(R.id.dataText))
            .check(matches(withText("Data Loaded")))
    }
}
```

## 最佳實務

### 1. 在測試中使用記憶體內資料庫

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

### 2. 保持測試模組專注

```kotlin
// ✅ 良好 - 專注的測試模組
val loginTestModule = module {
    viewModel { LoginViewModel(get()) }
    single<AuthService> { FakeAuthService() }
}

// ❌ 不佳 - 過於寬泛
val hugeTestModule = module {
    // 超過 50 個定義...
}
```

### 3. 共享通用的 Fake

```kotlin
// 建立可重用的測試替身
object TestDoubles {
    fun createFakeUserRepository() = FakeUserRepository().apply {
        addUser(User("1", "Test User"))
    }

    fun createMockApiService() = mockk<ApiService> {
        coEvery { getUser(any()) } returns User("1", "Test User")
    }
}
```

### 4. 測試真實的整合點

```kotlin
// 測試真實的 Room + Repository 整合
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

### 5. 使用具描述性的測試名稱

```kotlin
// ✅ 良好
@Test
fun loginWithValidCredentials_navigatesToHomeScreen()

@Test
fun loginWithInvalidEmail_showsEmailError()

// ❌ 不佳
@Test
fun test1()

@Test
fun testLogin()
```

## 總結

使用 Koin 進行 Instrumented 測試的關鍵點：

- 使用 **自訂測試應用程式** 或 **測試規則** 進行 Koin 配置
- 使用 `override = true` 或測試特定模組來 **覆寫模組**
- 在 Instrumented 測試中，**使用 Fake 優於 Mock** 以獲得更好的效能
- **測試隔離** 至關重要 - 在測試之間進行清理
- **記憶體內資料庫** 進行快速、隔離的資料庫測試
- **Compose 測試** 與 `KoinContext` 完美協作
- **作用域測試** 驗證與生命週期繫結的相依性
- **模組驗證** 搭配 Koin 編譯器外掛程式（編譯期）或 `verify()`（執行時）可及早發現配置錯誤

## 後續步驟

- **[單元測試](/docs/reference/koin-test/testing)** - 單元測試的測試策略
- **[模組驗證](/docs/reference/koin-test/verify)** - 驗證模組配置
- **[多模組應用程式](/docs/reference/koin-android/multi-module)** - 測試多模組架構
- **[最佳實務](/docs/reference/koin-android/best-practices)** - Koin 整體最佳實務