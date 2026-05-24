---
title: Android 仪器化测试
---

## 概览

仪器化测试在 Android 设备或模拟器上运行，并测试应用与 Android 框架的集成。与您控制 Koin 生命周期的单元测试不同，仪器化测试需要特殊处理，因为 Koin 是由您的 `Application` 类启动的。

### 与单元测试的主要区别

| 维度 | 单元测试 | 仪器化测试 |
|--------|------------|-------------------|
| **执行** | 仅 JVM | Android 设备/模拟器 |
| **Koin 启动** | 在测试类中 (`startKoin`) | 在 `Application.onCreate()` 中 |
| **速度** | 快 | 较慢 |
| **Android API** | 模拟 (Mocked) | 真实 |
| **测试隔离** | 容易（每个测试都重新开始） | 需要仔细设置 |
| **用例** | 业务逻辑、ViewModel | UI、Android 组件集成 |

### 哪些内容适合仪器化测试

✅ **适合仪器化测试：**
- UI 行为和交互
- Android 组件集成 (Activity, Fragment, Service)
- 导航流
- 使用 Room 的数据库操作
- Shared preferences 和文件 I/O
- Compose UI 测试

❌ **更适合作为单元测试：**
- 业务逻辑
- ViewModel（可以进行单元测试）
- 仓库（可以使用模拟对象进行单元测试）
- 纯 Kotlin 函数

## 测试策略

### 策略 1：自定义测试 Application

为测试创建一个单独的 Application 类，并配置测试专用的模块。

### 策略 2：测试规则

使用 JUnit 规则来为每个测试类或测试方法配置 Koin。

### 策略 3：模块重写

保留生产环境的 Application，但针对测试重写特定的定义。

让我们详细探讨每种策略。

## 在自定义 Application 类中重写生产环境模块

与[单元测试](/docs/reference/koin-test/testing)不同（在单元测试中，您实际上是在每个测试类中调用启动 Koin，即 `startKoin` 或 `KoinTestExtension`），在仪器化测试中，Koin 是由您的 `Application` 类启动的。

为了重写生产环境的 Koin 模块，使用 `loadModules` 和 `unloadModules` 通常是不安全的，因为更改不会立即生效。相反，推荐的方法是将重写定义的 `module` 添加到 `Application` 类中 `startKoin` 所使用的 `modules` 中。
如果您想保持应用中继承自 `Application` 的类不被改动，您可以在 `AndroidTest` 软件包中创建另一个类，例如：
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
为了在您的仪器化测试中使用此自定义 `Application`，您可能需要创建一个自定义 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)，如下所示：
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
然后在您的 gradle 文件中通过以下方式注册它：
```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 使用测试规则重写生产环境模块

如果您需要更高的灵活性，您仍需要创建自定义 `AndroidJUnitRunner`，但不再将 `startKoin { ... }` 放在自定义应用程序中，而是可以将其放在自定义测试规则中，如下所示：
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
通过这种方式，我们可以直接从测试类中重写定义，例如：
```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```

## 模拟 (Mocking) 与虚假对象 (Fakes)

### 使用 `declareMock()`（推荐）

:::info
**Koin 4.2+：** 使用 `declareMock()` 在测试中动态快速地模拟依赖项，无需创建单独的测试模块。
:::

```kotlin
class UserViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            module {
                viewModelOf(::UserViewModel)
                // 其他生产环境依赖项
            }
        )
    }

    @Test
    fun `test user loading`() {
        // 动态声明模拟对象
        declareMock<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
        }

        val viewModel: UserViewModel by inject()
        // 使用模拟的仓库进行测试
    }
}
```

**`declareMock()` 的优势：**
- ✅ 无需创建单独的测试模块
- ✅ 仅模拟每个测试所需的内容
- ✅ 测试代码更简洁
- ✅ 开箱即用地支持 MockK

### 使用测试替身 (Test Doubles)

在测试中使用模拟对象或虚假对象替换真实实现：

```kotlin
// 生产环境模块
val productionModule = module {
    single<UserRepository> { UserRepositoryImpl(get()) }
    single { ApiService.create() }
}

// 带有虚假对象的测试模块
val testModule = module {
    single<UserRepository> { FakeUserRepository() }
    single<ApiService> { FakeApiService() }
}

// 虚假实现
class FakeUserRepository : UserRepository {
    private val users = mutableListOf<User>()

    override suspend fun getUser(id: String): User {
        return users.find { it.id == id } ?: throw UserNotFoundException()
    }

    override suspend fun saveUser(user: User) {
        users.add(user)
    }

    // 测试专用方法
    fun clearUsers() {
        users.clear()
    }
}
```

### 使用 MockK

```kotlin
// 使用 MockK 的测试模块
val mockModule = module {
    single<UserRepository> {
        mockk<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
            coEvery { saveUser(any()) } just Runs
        }
    }
}

// 测试 Application
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

### 部分模拟 (Partial Mocking)

仅替换特定的依赖项：

```kotlin
val testModule = module {
    // 保留真实实现
    single { Database.create(androidContext()) }

    // 模拟网络层
    single<ApiService> { mockk<ApiService>() }

    // 使用带有模拟 API 的真实仓库
    single<UserRepository> { UserRepositoryImpl(get()) }
}
```

## 测试 Activity 和 Fragment

### 使用 Koin 测试 Activity

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

### 使用 Koin 测试 Fragment

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

## 在仪器化测试中测试 ViewModel

### 在测试中注入 ViewModel

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

### 结合 Activity 测试 ViewModel

```kotlin
@Test
fun testViewModelStateReflectsInUI() {
    val scenario = ActivityScenario.launch(HomeActivity::class.java)

    scenario.onActivity { activity ->
        val viewModel: HomeViewModel = activity.viewModel

        // 触发 ViewModel 操作
        viewModel.loadUser("123")

        // 验证 UI 已更新
        onView(withId(R.id.userName)).check(matches(withText("Test User")))
    }
}
```

## 使用 Jetpack Compose 进行测试

### 结合 Koin 进行 Compose UI 测试

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

### 使用 koinViewModel 测试 Composable

```kotlin
@Composable
fun HomeScreen(viewModel: HomeViewModel = koinViewModel()) {
    val user by viewModel.user.collectAsState()

    Text(text = user?.name ?: "Loading...")
}

// 测试
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

## 测试作用域 (Scopes)

### 测试 Activity 作用域 (Scope)

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

            // 导航到下一个 fragment
            activity.supportFragmentManager.commit {
                replace(R.id.container, PaymentFragment())
            }

            // 在 fragment 中可以访问相同的作用域
            val fragment = activity.supportFragmentManager
                .findFragmentById(R.id.container) as PaymentFragment

            val state2 = fragment.scope.get<CheckoutState>()
            assertEquals(state1, state2)
            assertEquals("123 Main St", state2.selectedAddress?.street)
        }
    }
}
```

### 测试自定义作用域 (Scopes)

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

        // 创建作用域
        val sessionScope = koin.createScope("test_session", named("session"))
        val session = sessionScope.get<UserSession>()

        session.login("user@example.com")
        assertTrue(session.isLoggedIn)

        // 关闭作用域
        sessionScope.close()

        // 作用域已关闭，无法访问
        assertThrows<ClosedScopeException> {
            sessionScope.get<UserSession>()
        }
    }
}
```

## 测试多模块应用

### 结合功能模块 (Feature Modules) 进行测试

```kotlin
@RunWith(AndroidJUnit4::class)
class MultiModuleTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            // 核心模块
            networkModule,
            databaseModule,

            // 功能模块
            loginModule,
            homeModule,

            // 测试重写
            module {
                single<ApiService>(override = true) { FakeApiService() }
            }
        )
    )

    @Test
    fun testFeatureIntegration() {
        // 测试登录功能与主页功能是否协同工作
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

### 测试中的模块验证

```kotlin
class ModuleVerificationTest {

    @Test
    fun verifyAllModules() {
        // 验证所有定义是否都已满足
        appModule.verify()  // appModule 包含了其他模块
    }

    @Test
    fun verifyTestModules() {
        testAppModule.verify()
    }
}
```

:::tip
Koin 编译器插件现在提供编译时依赖项验证，取代了对 `verify()` 和 `checkModules()` 的需求。详见[编译时安全性](/docs/reference/koin-compiler/compile-safety)。
:::

## 使用 Espresso 进行 UI 测试

### 完整的 UI 流程测试

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
        // 导航到购物车
        onView(withId(R.id.cartButton)).perform(click())

        // 向购物车添加商品
        onView(withId(R.id.addItemButton)).perform(click())
        onView(withId(R.id.cartItemCount)).check(matches(withText("1")))

        // 继续结账
        onView(withId(R.id.checkoutButton)).perform(click())

        // 填写收货地址
        onView(withId(R.id.addressField))
            .perform(typeText("123 Main St"))

        onView(withId(R.id.nextButton)).perform(click())

        // 输入支付信息
        onView(withId(R.id.cardNumberField))
            .perform(typeText("4111111111111111"))

        onView(withId(R.id.completeOrderButton)).perform(click())

        // 验证订单确认
        onView(withId(R.id.confirmationMessage))
            .check(matches(isDisplayed()))
    }
}
```

### 测试导航

```kotlin
@Test
fun testNavigationWithSharedState() {
    onView(withId(R.id.loginButton)).perform(click())

    // 登录屏幕
    onView(withId(R.id.emailField)).perform(typeText("user@example.com"))
    onView(withId(R.id.passwordField)).perform(typeText("password"))
    onView(withId(R.id.submitButton)).perform(click())

    // 应该导航到主页
    onView(withId(R.id.homeTitle)).check(matches(isDisplayed()))

    // 用户数据应该是可用的（通过 Koin 共享）
    onView(withId(R.id.welcomeMessage))
        .check(matches(withText("Welcome, user@example.com")))
}
```

## 测试隔离

### 确保测试之间的状态干净

```kotlin
class KoinIsolationTestRule : TestWatcher() {

    override fun starting(description: Description) {
        // 启动全新的 Koin 实例
        startKoin {
            androidContext(InstrumentationRegistry.getInstrumentation().targetContext)
            modules(emptyList())
        }
    }

    override fun finished(description: Description) {
        // 每个测试后进行清理
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
        // 全新的 Koin 实例，不受 test1 的污染
        loadKoinModules(module { single { "Test2" } })
        assertEquals("Test2", get<String>())
    }
}
```

### 在测试之间重置虚假对象 (Fakes)

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
        // 使用干净的仓库进行测试
    }

    @Test
    fun test2() {
        // 使用干净的仓库进行测试（已调用 reset）
    }
}
```

## 常见模式

### 模式 1：共享测试模块

```kotlin
// androidTest 软件包中的 TestModules.kt
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

// 在测试中使用
@get:Rule
val koinTestRule = KoinTestRule(
    modules = TestModules.fakeNetworkModule + TestModules.fakeDataModule
)
```

### 模式 2：测试专用配置

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

### 模式 3：针对每个测试进行重写

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

        // 测试代码
    }

    @Test
    fun testWithMockRepo() {
        loadKoinModules(module {
            single<UserRepository> { mockk<UserRepository>() }
        })

        // 测试代码
    }

    @After
    fun cleanup() {
        unloadKoinModules(/* 测试中加载的模块 */)
    }
}
```

## 故障排除

### 问题：Koin 已启动

**问题：**
```
org.koin.core.error.KoinAppAlreadyStartedException: A Koin Application has already been started
```

**解决方案：**
```kotlin
class SafeKoinTestRule : TestWatcher() {
    override fun starting(description: Description) {
        // 检查 Koin 是否已经启动
        if (getKoinApplicationOrNull() == null) {
            startKoin {
                modules(testModules)
            }
        } else {
            // 将模块加载到现有的 Koin 实例中
            loadKoinModules(testModules)
        }
    }

    override fun finished(description: Description) {
        // 不要停止 Koin，只需卸载测试模块
        unloadKoinModules(testModules)
    }
}
```

### 问题：定义重写未生效

**问题：**
测试定义没有替换生产环境定义。

**解决方案：**
```kotlin
// 使用 override = true
val testModule = module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}

// 或使用 includes 进行替换
val testModule = module {
    includes(productionModule)
} + module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}
```

### 问题：未找到作用域 (Scope)

**问题：**
```
org.koin.core.error.NoBeanDefFoundException: No definition found for class X
```

**解决方案：**
```kotlin
// 确保在访问之前已创建作用域
val scenario = ActivityScenario.launch(MyActivity::class.java)

scenario.onActivity { activity ->
    // 作用域在此处存在
    val dependency = activity.scope.get<MyDependency>()
}
```

### 问题：测试互相影响

**问题：**
测试单独运行时通过，但一起运行时失败。

**解决方案：**
```kotlin
// 测试之间的妥善清理
@After
fun tearDown() {
    // 关闭作用域
    getKoin().scopeRegistry.deleteScope("test_scope")

    // 重置虚假对象
    fakeRepository.reset()

    // 卸载测试模块
    unloadKoinModules(testModules)
}
```

### 问题：ViewModel 未更新 UI

**问题：**
ViewModel 状态发生了变化，但在测试中 UI 未更新。

**解决方案：**
```kotlin
// 对于异步操作，使用 Espresso 的 IdlingResource
@get:Rule
val activityRule = ActivityScenarioRule(MyActivity::class.java)

@Test
fun testViewModelUpdatesUI() = runTest {
    activityRule.scenario.onActivity { activity ->
        val viewModel: MyViewModel = activity.viewModel

        // 触发异步操作
        viewModel.loadData()

        // 等待 LiveData/StateFlow 发射
        advanceUntilIdle()

        // 然后验证 UI
        onView(withId(R.id.dataText))
            .check(matches(withText("Data Loaded")))
    }
}
```

## 最佳做法

### 1. 为测试使用内存数据库

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

### 2. 保持测试模块专注

```kotlin
// ✅ 推荐 - 专注的测试模块
val loginTestModule = module {
    viewModel { LoginViewModel(get()) }
    single<AuthService> { FakeAuthService() }
}

// ❌ 不推荐 - 范围过广
val hugeTestModule = module {
    // 50 多个定义...
}
```

### 3. 共享通用的虚假对象 (Fakes)

```kotlin
// 创建可重用的测试替身
object TestDoubles {
    fun createFakeUserRepository() = FakeUserRepository().apply {
        addUser(User("1", "Test User"))
    }

    fun createMockApiService() = mockk<ApiService> {
        coEvery { getUser(any()) } returns User("1", "Test User")
    }
}
```

### 4. 测试真实的集成点

```kotlin
// 测试真实的 Room + Repository 集成
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

### 5. 使用描述性的测试名称

```kotlin
// ✅ 推荐
@Test
fun loginWithValidCredentials_navigatesToHomeScreen()

@Test
fun loginWithInvalidEmail_showsEmailError()

// ❌ 不推荐
@Test
fun test1()

@Test
fun testLogin()
```

## 总结

使用 Koin 进行仪器化测试的关键点：

- 使用**自定义测试 Application** 或**测试规则**进行 Koin 配置
- 使用 `override = true` 或测试专用模块来**重写模块**
- 在仪器化测试中，**使用虚假对象 (Fakes) 优于模拟对象 (Mocks)**，以获得更好的性能
- **测试隔离**至关重要 - 在测试之间进行清理
- 使用**内存数据库**进行快速、隔离的数据库测试
- **Compose 测试**可以与 `KoinContext` 无缝协作
- **作用域测试**验证了生命周期绑定的依赖项
- 使用 Koin 编译器插件进行**模块验证**（编译时）或使用 `verify()`（运行时）可以尽早发现配置错误

## 下一步

- **[单元测试](/docs/reference/koin-test/testing)** - 单元测试的测试策略
- **[模块验证](/docs/reference/koin-test/verify)** - 验证模块配置
- **[多模块应用](/docs/reference/koin-android/multi-module)** - 测试多模块架构
- **[最佳做法](/docs/reference/koin-android/best-practices)** - Koin 总体最佳做法