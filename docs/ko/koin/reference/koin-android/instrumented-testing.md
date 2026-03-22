---
title: 안드로이드 계측 테스트
---

## 개요

계측 테스트(Instrumented tests)는 안드로이드 기기나 에뮬레이터에서 실행되며 앱과 안드로이드 프레임워크의 통합을 테스트합니다. Koin의 생명주기를 직접 제어하는 단위 테스트(unit tests)와 달리, 계측 테스트는 `Application` 클래스에 의해 Koin이 시작되므로 특별한 처리가 필요합니다.

### 단위 테스트와의 주요 차이점

| 항목 | 단위 테스트 | 계측 테스트 |
|--------|------------|-------------------|
| **실행** | JVM 전용 | 안드로이드 기기/에뮬레이터 |
| **Koin 시작** | 테스트 클래스 내 (`startKoin`) | `Application.onCreate()` 내 |
| **속도** | 빠름 | 느림 |
| **안드로이드 API** | 모킹(Mocked)됨 | 실제 API 사용 |
| **테스트 격리** | 쉬움 (각 테스트가 새로 시작됨) | 세심한 설정이 필요함 |
| **사용 사례** | 비즈니스 로직, ViewModel | UI, 안드로이드 컴포넌트 통합 |

### 계측 테스트로 테스트할 항목

✅ **계측 테스트에 적합한 항목:**
- UI 동작 및 상호작용
- 안드로이드 컴포넌트 통합 (Activity, Fragment, Service)
- 네비게이션 흐름
- Room을 이용한 데이터베이스 작업
- Shared preferences 및 파일 I/O
- Compose UI 테스트

❌ **단위 테스트가 더 적합한 항목:**
- 비즈니스 로직
- ViewModel (단위 테스트 가능)
- Repository (모킹을 통한 단위 테스트 가능)
- 순수 Kotlin 함수

## 테스트 전략

### 전략 1: 커스텀 테스트 Application

테스트 전용 모듈을 가진 별도의 Application 클래스를 생성합니다.

### 전략 2: 테스트 규칙(Test Rules)

JUnit 규칙을 사용하여 테스트 클래스 또는 테스트 메서드별로 Koin을 구성합니다.

### 전략 3: 모듈 오버라이드

프로덕션용 Application은 유지하되, 테스트를 위해 특정 정의(definition)를 오버라이드합니다.

이제 각 전략을 자세히 살펴보겠습니다.

## 커스텀 Application 클래스에서 프로덕션 모듈 오버라이드하기

각 테스트 클래스에서 `startKoin` 또는 `KoinTestExtension`을 호출하여 실제로 Koin을 시작하는 [단위 테스트(unit tests)](/docs/reference/koin-test/testing)와 달리, 계측 테스트에서 Koin은 `Application` 클래스에 의해 시작됩니다.

프로덕션 Koin 모듈을 오버라이드할 때 `loadModules` 및 `unloadModules`는 변경 사항이 즉시 적용되지 않을 수 있어 안전하지 않은 경우가 많습니다. 대신, `Application` 클래스의 `startKoin`에서 사용하는 `modules`에 오버라이드할 `module`을 추가하는 방식이 권장됩니다.
기존 애플리케이션의 `Application` 확장 클래스를 수정하지 않으려면, 다음과 같이 `AndroidTest` 패키지 안에 별도의 클래스를 생성할 수 있습니다:

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

계측 테스트에서 이 커스텀 `Application`을 사용하려면 다음과 같이 커스텀 [AndroidJUnitRunner](https://developer.android.com/training/testing/instrumented-tests/androidx-test-libraries/runner)를 생성해야 할 수도 있습니다:

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

그런 다음 gradle 파일 내에 다음과 같이 등록합니다:

```groovy
testInstrumentationRunner "com.example.myapplication.InstrumentationTestRunner"
```

## 테스트 규칙(test rule)으로 프로덕션 모듈 오버라이드하기

더 많은 유연성이 필요한 경우, 여전히 커스텀 `AndroidJUnitRunner`를 생성해야 하지만 커스텀 애플리케이션 내부에 `startKoin { ... }`을 두는 대신 다음과 같이 커스텀 테스트 규칙 내부에 둘 수 있습니다:

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

이 방식을 사용하면 다음과 같이 테스트 클래스에서 직접 정의(definition)를 오버라이드할 수 있습니다:

```kotlin
private val instrumentedTestModule = module {
    factory<Something> { FakeSomething() }
}

@get:Rule
val koinTestRule = KoinTestRule(
    modules = listOf(productionModule, instrumentedTestModule)
)
```

## 모킹(Mocking) 및 페이크(Fakes)

### `declareMock()` 사용 (권장)

:::info
**Koin 4.2+:** 별도의 테스트 모듈을 생성하지 않고도 테스트 중에 즉석에서 의존성을 빠르게 모킹하려면 `declareMock()`을 사용하세요.
:::

```kotlin
class UserViewModelTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(
            module {
                viewModelOf(::UserViewModel)
                // 기타 프로덕션 의존성
            }
        )
    }

    @Test
    fun `test user loading`() {
        // 즉석에서 mock 선언
        declareMock<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
        }

        val viewModel: UserViewModel by inject()
        // 모킹된 repository로 테스트
    }
}
```

**`declareMock()`의 장점:**
- ✅ 별도의 테스트 모듈을 만들 필요 없음
- ✅ 테스트별로 필요한 것만 모킹 가능
- ✅ 더 깔끔한 테스트 코드
- ✅ MockK와 즉시 연동 가능

### 테스트 더블(Test Doubles) 사용

테스트를 위해 실제 구현체를 모킹 또는 페이크(fakes)로 대체합니다:

```kotlin
// 프로덕션 모듈
val productionModule = module {
    single<UserRepository> { UserRepositoryImpl(get()) }
    single { ApiService.create() }
}

// 페이크를 포함한 테스트 모듈
val testModule = module {
    single<UserRepository> { FakeUserRepository() }
    single<ApiService> { FakeApiService() }
}

// 페이크 구현체
class FakeUserRepository : UserRepository {
    private val users = mutableListOf<User>()

    override suspend fun getUser(id: String): User {
        return users.find { it.id == id } ?: throw UserNotFoundException()
    }

    override suspend fun saveUser(user: User) {
        users.add(user)
    }

    // 테스트 전용 메서드
    fun clearUsers() {
        users.clear()
    }
}
```

### MockK 사용

```kotlin
// MockK를 사용한 테스트 모듈
val mockModule = module {
    single<UserRepository> {
        mockk<UserRepository> {
            coEvery { getUser(any()) } returns User("1", "Test User")
            coEvery { saveUser(any()) } just Runs
        }
    }
}

// 테스트 애플리케이션
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

### 부분 모킹(Partial Mocking)

특정 의존성만 교체합니다:

```kotlin
val testModule = module {
    // 실제 구현체 유지
    single { Database.create(androidContext()) }

    // 네트워크 계층 모킹
    single<ApiService> { mockk<ApiService>() }

    // 모킹된 API를 사용하는 실제 repository 사용
    single<UserRepository> { UserRepositoryImpl(get()) }
}
```

## Activity 및 Fragment 테스트

### Koin을 이용한 Activity 테스트

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

### Koin을 이용한 Fragment 테스트

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

## 계측 테스트에서 ViewModel 테스트하기

### 테스트에서 ViewModel 주입하기

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

### Activity와 함께 ViewModel 테스트하기

```kotlin
@Test
fun testViewModelStateReflectsInUI() {
    val scenario = ActivityScenario.launch(HomeActivity::class.java)

    scenario.onActivity { activity ->
        val viewModel: HomeViewModel = activity.viewModel

        // ViewModel 액션 유도
        viewModel.loadUser("123")

        // UI 업데이트 확인
        onView(withId(R.id.userName)).check(matches(withText("Test User")))
    }
}
```

## Jetpack Compose를 이용한 테스트

### Koin을 이용한 Compose UI 테스트

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

### koinViewModel을 사용하는 Composable 테스트

```kotlin
@Composable
fun HomeScreen(viewModel: HomeViewModel = koinViewModel()) {
    val user by viewModel.user.collectAsState()

    Text(text = user?.name ?: "Loading...")
}

// 테스트
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

## 스코프(Scopes) 테스트

### Activity 스코프 테스트

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

            // 다음 fragment로 이동
            activity.supportFragmentManager.commit {
                replace(R.id.container, PaymentFragment())
            }

            // fragment에서 동일한 스코프에 접근 가능
            val fragment = activity.supportFragmentManager
                .findFragmentById(R.id.container) as PaymentFragment

            val state2 = fragment.scope.get<CheckoutState>()
            assertEquals(state1, state2)
            assertEquals("123 Main St", state2.selectedAddress?.street)
        }
    }
}
```

### 커스텀 스코프 테스트

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

        // 스코프 생성
        val sessionScope = koin.createScope("test_session", named("session"))
        val session = sessionScope.get<UserSession>()

        session.login("user@example.com")
        assertTrue(session.isLoggedIn)

        // 스코프 닫기
        sessionScope.close()

        // 스코프가 닫혔으므로 접근 불가
        assertThrows<ClosedScopeException> {
            sessionScope.get<UserSession>()
        }
    }
}
```

## 멀티 모듈 앱 테스트

### 기능 모듈(Feature Modules) 테스트

```kotlin
@RunWith(AndroidJUnit4::class)
class MultiModuleTest {

    @get:Rule
    val koinTestRule = KoinTestRule(
        modules = listOf(
            // 핵심 모듈
            networkModule,
            databaseModule,

            // 기능 모듈
            loginModule,
            homeModule,

            // 테스트 오버라이드
            module {
                single<ApiService>(override = true) { FakeApiService() }
            }
        )
    )

    @Test
    fun testFeatureIntegration() {
        // login 기능이 home 기능과 함께 작동하는지 테스트
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

### 테스트에서 모듈 검증

```kotlin
class ModuleVerificationTest {

    @Test
    fun verifyAllModules() {
        // 모든 정의가 충족되는지 확인
        appModule.verify()  // appModule은 다른 모듈들을 포함함
    }

    @Test
    fun verifyTestModules() {
        testAppModule.verify()
    }
}
```

:::info
`verify()`와 `checkModules()`는 향후 Koin 컴파일러 플러그인의 네이티브 컴파일 타임 안정성 기능으로 대체될 예정입니다. 자세한 내용은 [모듈 검증(Module Verification)](/docs/reference/koin-test/verify)을 참조하세요.
:::

## Espresso를 이용한 UI 테스트

### 전체 UI 흐름 테스트

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
        // 장바구니로 이동
        onView(withId(R.id.cartButton)).perform(click())

        // 장바구니에 아이템 추가
        onView(withId(R.id.addItemButton)).perform(click())
        onView(withId(R.id.cartItemCount)).check(matches(withText("1")))

        // 결제 진행
        onView(withId(R.id.checkoutButton)).perform(click())

        // 배송 주소 입력
        onView(withId(R.id.addressField))
            .perform(typeText("123 Main St"))

        onView(withId(R.id.nextButton)).perform(click())

        // 결제 정보 입력
        onView(withId(R.id.cardNumberField))
            .perform(typeText("4111111111111111"))

        onView(withId(R.id.completeOrderButton)).perform(click())

        // 주문 확인 메시지 검증
        onView(withId(R.id.confirmationMessage))
            .check(matches(isDisplayed()))
    }
}
```

### 네비게이션 테스트

```kotlin
@Test
fun testNavigationWithSharedState() {
    onView(withId(R.id.loginButton)).perform(click())

    // 로그인 화면
    onView(withId(R.id.emailField)).perform(typeText("user@example.com"))
    onView(withId(R.id.passwordField)).perform(typeText("password"))
    onView(withId(R.id.submitButton)).perform(click())

    // 홈 화면으로 이동해야 함
    onView(withId(R.id.homeTitle)).check(matches(isDisplayed()))

    // 사용자 데이터가 사용 가능해야 함 (Koin을 통해 공유됨)
    onView(withId(R.id.welcomeMessage))
        .check(matches(withText("Welcome, user@example.com")))
}
```

## 테스트 격리(Test Isolation)

### 테스트 간 깨끗한 상태 보장

```kotlin
class KoinIsolationTestRule : TestWatcher() {

    override fun starting(description: Description) {
        // 깨끗한 Koin 인스턴스 시작
        startKoin {
            androidContext(InstrumentationRegistry.getInstrumentation().targetContext)
            modules(emptyList())
        }
    }

    override fun finished(description: Description) {
        // 각 테스트 후 정리
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
        // 새로운 Koin 인스턴스, test1의 오염이 없음
        loadKoinModules(module { single { "Test2" } })
        assertEquals("Test2", get<String>())
    }
}
```

### 테스트 간 페이크(Fakes) 재설정

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
        // 깨끗한 repository로 테스트
    }

    @Test
    fun test2() {
        // 깨끗한 repository로 테스트 (reset이 호출됨)
    }
}
```

## 공통 패턴

### 패턴 1: 공유 테스트 모듈

```kotlin
// androidTest 패키지의 TestModules.kt
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

// 테스트에서 사용
@get:Rule
val koinTestRule = KoinTestRule(
    modules = TestModules.fakeNetworkModule + TestModules.fakeDataModule
)
```

### 패턴 2: 테스트 전용 구성

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

### 패턴 3: 테스트별 오버라이드

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

        // 테스트 코드
    }

    @Test
    fun testWithMockRepo() {
        loadKoinModules(module {
            single<UserRepository> { mockk<UserRepository>() }
        })

        // 테스트 코드
    }

    @After
    fun cleanup() {
        unloadKoinModules(/* 테스트에서 로드된 모듈들 */)
    }
}
```

## 트러블슈팅

### 문제: Koin이 이미 시작됨

**현상:**
```
org.koin.core.error.KoinAppAlreadyStartedException: A Koin Application has already been started
```

**해결 방법:**
```kotlin
class SafeKoinTestRule : TestWatcher() {
    override fun starting(description: Description) {
        // Koin이 이미 시작되었는지 확인
        if (getKoinApplicationOrNull() == null) {
            startKoin {
                modules(testModules)
            }
        } else {
            // 기존 Koin 인스턴스에 모듈 로드
            loadKoinModules(testModules)
        }
    }

    override fun finished(description: Description) {
        // Koin을 중지하지 않고 테스트 모듈만 언로드
        unloadKoinModules(testModules)
    }
}
```

### 문제: 정의 오버라이드가 작동하지 않음

**현상:**
테스트 정의가 프로덕션 정의를 대체하지 못함.

**해결 방법:**
```kotlin
// override = true 사용
val testModule = module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}

// 또는 includes를 사용하여 교체
val testModule = module {
    includes(productionModule)
} + module {
    single<UserRepository>(override = true) { FakeUserRepository() }
}
```

### 문제: 스코프를 찾을 수 없음

**현상:**
```
org.koin.core.error.NoBeanDefFoundException: No definition found for class X
```

**해결 방법:**
```kotlin
// 접근하기 전에 스코프가 생성되었는지 확인
val scenario = ActivityScenario.launch(MyActivity::class.java)

scenario.onActivity { activity ->
    // 여기서 스코프가 존재함
    val dependency = activity.scope.get<MyDependency>()
}
```

### 문제: 테스트가 서로 영향을 줌

**현상:**
테스트가 개별적으로는 통과하지만 함께 실행하면 실패함.

**해결 방법:**
```kotlin
// 테스트 간 적절한 정리 수행
@After
fun tearDown() {
    // 스코프 닫기
    getKoin().scopeRegistry.deleteScope("test_scope")

    // 페이크 재설정
    fakeRepository.reset()

    // 테스트 모듈 언로드
    unloadKoinModules(testModules)
}
```

### 문제: ViewModel이 UI를 업데이트하지 않음

**현상:**
ViewModel 상태는 변경되지만 테스트에서 UI가 업데이트되지 않음.

**해결 방법:**
```kotlin
// 비동기 작업을 위해 Espresso의 IdlingResource 사용
@get:Rule
val activityRule = ActivityScenarioRule(MyActivity::class.java)

@Test
fun testViewModelUpdatesUI() = runTest {
    activityRule.scenario.onActivity { activity ->
        val viewModel: MyViewModel = activity.viewModel

        // 비동기 액션 유도
        viewModel.loadData()

        // LiveData/StateFlow가 방출될 때까지 대기
        advanceUntilIdle()

        // 그 다음 UI 검증
        onView(withId(R.id.dataText))
            .check(matches(withText("Data Loaded")))
    }
}
```

## 모범 사례(Best Practices)

### 1. 테스트에 인메모리 데이터베이스 사용

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

### 2. 테스트 모듈을 집중화하여 유지

```kotlin
// ✅ 좋음 - 집중된 테스트 모듈
val loginTestModule = module {
    viewModel { LoginViewModel(get()) }
    single<AuthService> { FakeAuthService() }
}

// ❌ 나쁨 - 너무 광범위함
val hugeTestModule = module {
    // 50개 이상의 정의...
}
```

### 3. 공통 페이크(Fakes) 공유

```kotlin
// 재사용 가능한 테스트 더블 생성
object TestDoubles {
    fun createFakeUserRepository() = FakeUserRepository().apply {
        addUser(User("1", "Test User"))
    }

    fun createMockApiService() = mockk<ApiService> {
        coEvery { getUser(any()) } returns User("1", "Test User")
    }
}
```

### 4. 실제 통합 지점 테스트

```kotlin
// 실제 Room + Repository 통합 테스트
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

### 5. 서술적인 테스트 이름 사용

```kotlin
// ✅ 좋음
@Test
fun loginWithValidCredentials_navigatesToHomeScreen()

@Test
fun loginWithInvalidEmail_showsEmailError()

// ❌ 나쁨
@Test
fun test1()

@Test
fun testLogin()
```

## 요약

Koin을 이용한 계측 테스트의 핵심 사항:

- Koin 구성을 위해 **커스텀 테스트 Application** 또는 **테스트 규칙(Test Rules)** 사용
- `override = true` 또는 테스트 전용 모듈을 사용하여 **모듈 오버라이드**
- 계측 테스트의 더 나은 성능을 위해 **모킹보다 페이크(Fakes) 사용**
- **테스트 격리**가 매우 중요함 - 테스트 간 정리 작업 수행
- 빠르고 격리된 데이터베이스 테스트를 위한 **인메모리 데이터베이스** 사용
- **Compose 테스트**는 `KoinContext`와 함께 매끄럽게 작동함
- **스코프 테스트**를 통해 생명주기에 묶인 의존성 검증
- `verify()`를 이용한 **모듈 검증**으로 구성 오류를 조기에 발견

## 다음 단계

- **[단위 테스트(Unit Testing)](/docs/reference/koin-test/testing)** - 단위 테스트를 위한 테스트 전략
- **[모듈 검증(Module Verification)](/docs/reference/koin-test/verify)** - 모듈 구성 검증
- **[멀티 모듈 앱](/docs/reference/koin-android/multi-module)** - 멀티 모듈 아키텍처 테스트
- **[모범 사례](/docs/reference/koin-android/best-practices)** - 전반적인 Koin 모범 사례