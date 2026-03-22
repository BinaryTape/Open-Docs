---
title: Android - Jetpack Compose
---

> 이 튜토리얼에서는 Jetpack Compose UI를 사용하여 Android 애플리케이션을 작성하고, Koin 의존성 주입(dependency injection)을 사용하여 컴포넌트를 가져오는 방법을 알아봅니다.
> 이 튜토리얼을 완료하는 데는 약 **10분**이 소요됩니다.

:::note
업데이트 - 2024-11-28
:::

## 코드 가져오기

:::info
[GitHub에서 소스 코드를 확인할 수 있습니다](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 설정

다음과 같이 Koin Android 및 Koin Compose 의존성을 추가합니다:

```groovy
dependencies {

    // Android용 Koin
    implementation("io.insert-koin:koin-android:$koin_version")
    // Jetpack Compose용 Koin
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
}
```

## 애플리케이션 개요

이 애플리케이션의 아이디어는 사용자 목록을 관리하고, ViewModel 및 Jetpack Compose UI를 사용하여 `MainActivity` 클래스에 표시하는 것입니다.

> Users -> UserRepository -> UserService -> UserViewModel -> MainActivity (Compose UI)

## "User" 데이터

사용자 컬렉션을 관리할 것입니다. 다음은 데이터 클래스입니다:

```kotlin
data class User(val name: String, val email: String)
```

사용자 목록을 관리(사용자 추가 또는 이름으로 검색)하기 위한 "Repository" 컴포넌트를 생성합니다. 아래는 `UserRepository` 인터페이스와 그 구현체입니다:

```kotlin
interface UserRepository {
    fun findUserOrNull(name: String): User?
    fun addUsers(users: List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUserOrNull(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users: List<User>) {
        _users.addAll(users)
    }
}
```

## UserService 컴포넌트

사용자 작업을 관리하기 위한 서비스 컴포넌트를 작성해 보겠습니다:

```kotlin
interface UserService {
    fun getUserOrNull(name: String): User?
    fun loadUsers()
    fun prepareHelloMessage(user: User?): String
}

class UserServiceImpl(
    private val userRepository: UserRepository
) : UserService {

    override fun getUserOrNull(name: String): User? = userRepository.findUserOrNull(name)

    override fun loadUsers() {
        userRepository.addUsers(listOf(
            User("Alice", "alice@example.com"),
            User("Bob", "bob@example.com"),
            User("Charlie", "charlie@example.com")
        ))
    }

    override fun prepareHelloMessage(user: User?): String {
        return user?.let { "Hello '${user.name}' (${user.email})! 👋" } ?: "❌ User not found"
    }
}
```

## Koin 모듈

Koin 모듈을 선언하려면 `module` 함수를 사용합니다. Koin 모듈은 주입될 모든 컴포넌트를 정의하는 공간입니다.

```kotlin
val appModule = module {

}
```

컴포넌트를 선언해 보겠습니다. `UserRepository`와 `UserService`를 싱글톤(singleton)으로 만들고자 합니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
이 튜토리얼은 컴파일 시점에 자동 연결(auto-wiring)을 제공하는 **Koin Compiler Plugin DSL**(`single<T>()`, `viewModel<T>()`)을 사용합니다. 구성 방법은 [컴파일러 플러그인 설정](/docs/setup/compiler-plugin)을 참조하세요.
:::

## ViewModel로 사용자 표시하기

사용자를 표시하기 위한 ViewModel 컴포넌트를 작성해 보겠습니다:

```kotlin
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> UserService는 UserViewModel의 생성자에서 참조됩니다.

Koin 모듈에 `UserViewModel`을 선언합니다. 메모리에 인스턴스를 유지하지 않도록(Android 생명주기에 따른 메모리 누수 방지) `viewModel` 정의로 선언합니다:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## Jetpack Compose에서 ViewModel 주입하기

Jetpack Compose에서는 `AppCompatActivity` 대신 `ComponentActivity`를 사용하며, XML 레이아웃 대신 Composable 함수를 사용하여 UI를 빌드합니다.

`UserViewModel` 컴포넌트가 생성될 때, `UserService` 인스턴스가 함께 해결(resolve)됩니다. 이를 Compose UI에서 가져오기 위해 `koinViewModel()` 함수를 사용합니다:

```kotlin
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                MainScreen()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: UserViewModel = koinViewModel()
) {
    var nameInput by remember { mutableStateOf("") }
    var greetingMessage by remember { mutableStateOf("") }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Koin Sample") }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            OutlinedTextField(
                value = nameInput,
                onValueChange = { nameInput = it },
                label = { Text("Enter name") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    val userName = nameInput.trim().ifEmpty { "Alice" }
                    greetingMessage = viewModel.sayHello(userName)
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Say Hello")
            }

            if (greetingMessage.isNotEmpty()) {
                Text(
                    text = greetingMessage,
                    style = MaterialTheme.typography.bodyLarge,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}
```

이제 Compose 앱이 준비되었습니다!

:::info
`koinViewModel()` 함수는 Koin에서 ViewModel 인스턴스를 가져오고 이를 Compose 생명주기(lifecycle)에 자동으로 바인딩합니다. 이는 기존 Android View에서 사용하던 `by viewModel()` 대리자(delegate)를 대체하는 Compose 전용 주입 방식입니다.
:::

### 주요 Compose 개념

- **ComponentActivity**: Compose 앱을 위한 기본 클래스 (`AppCompatActivity` 대신 사용)
- **setContent**: Composable 콘텐츠를 Activity의 UI로 설정
- **@Composable**: UI를 선언적으로 빌드하는 함수
- **remember & mutableStateOf**: 반응형 UI 업데이트를 위한 Compose 상태 관리
- **koinViewModel()**: ViewModel 주입을 위한 Koin의 Compose 통합 기능

## Koin 시작하기

Android 애플리케이션에서 Koin을 시작해야 합니다. 애플리케이션의 메인 진입점인 `MainApplication` 클래스에서 `startKoin()` 함수를 호출하기만 하면 됩니다:

```kotlin
class MainApplication : Application(){
    override fun onCreate() {
        super.onCreate()

        startKoin{
            androidLogger()
            androidContext(this@MainApplication)
            modules(appModule)
        }
    }
}
```

:::info
`startKoin` 내부의 `modules()` 함수는 주어진 모듈 리스트를 로드합니다.
:::

## Koin 모듈: DSL 비교

다음은 **기본 DSL**(수동 연결)을 사용한 Koin 모듈 선언입니다:

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

**컴파일러 플러그인 DSL**(컴파일 시점 자동 연결)을 사용하는 경우:

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
컴파일러 플러그인 DSL을 사용하려면 [Koin 컴파일러 플러그인](/docs/setup/compiler-plugin)이 필요합니다. 이는 컴파일 시점의 의존성 해결과 더 깔끔한 문법을 제공합니다.
:::

## Compose vs XML View

이 튜토리얼은 [Android ViewModel 튜토리얼](./android-viewmodel.md)과 동일한 기능을 보여주지만, XML 레이아웃 대신 Jetpack Compose를 사용합니다:

| 항목 | XML View | Jetpack Compose |
|--------|-----------|-----------------|
| 기본 Activity | `AppCompatActivity` | `ComponentActivity` |
| UI 정의 | XML 레이아웃 파일 | `@Composable` 함수 |
| ViewModel 주입 | `by viewModel()` 대리자 | `koinViewModel()` 함수 |
| 상태 관리 | LiveData/StateFlow | `remember` + `mutableStateOf` |
| UI 업데이트 | View binding + 관찰자(observer) | 자동 리컴포지션(Recomposition) |

:::tip
Compose와 함께 Koin Annotations를 사용하는 버전은 [Compose Multiplatform Annotations 튜토리얼](./compose-multiplatform-annotations.md)을 참조하세요.
:::