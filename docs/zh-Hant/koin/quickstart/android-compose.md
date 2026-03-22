---
title: Android - Jetpack Compose
---

> 本教學將帶領您使用 Jetpack Compose UI 編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 __10 分鐘__ 來完成此教學。

:::note
更新 - 2024-11-28
:::

## 取得程式碼

:::info
[原始碼可在 GitHub 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 設定

如下所示新增 Koin Android 與 Koin Compose 相依性：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin for Jetpack Compose
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
}
```

## 應用程式概覽

此應用程式的想法是管理使用者清單，並透過 ViewModel 與 Jetpack Compose UI 在我們的 `MainActivity` 類別中顯示它：

> Users -> UserRepository -> UserService -> UserViewModel -> MainActivity (Compose UI)

## 「User」資料

我們將管理一個 User 集合。這是資料類別：

```kotlin
data class User(val name: String, val email: String)
```

我們建立一個「Repository」組建來管理使用者清單（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

## UserService 組建

讓我們編寫一個服務組建來管理使用者作業：

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

## Koin 模組

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入的組建的地方。

```kotlin
val appModule = module {

}
```

讓我們宣告我們的組建。我們想要 `UserRepository` 與 `UserService` 的單例：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
本教學使用 **Koin 編譯器外掛程式 DSL** (`single<T>()`, `viewModel<T>()`)，它在編譯時提供自動連接 (auto-wiring)。請參閱 [編譯器外掛程式設定](/docs/setup/compiler-plugin) 以了解配置。
:::

## 使用 ViewModel 顯示使用者

讓我們編寫一個 ViewModel 組建來顯示使用者：

```kotlin
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> `UserService` 在 `UserViewModel` 的建構函式中被參照。

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModel` 定義，以便不在記憶體中保留任何執行個體（避免 Android 生命週期的任何洩漏）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## 在 Jetpack Compose 中注入 ViewModel

使用 Jetpack Compose 時，我們使用 `ComponentActivity` 而非 `AppCompatActivity`，並且使用可組合函式 (composable functions) 而非 XML 版面配置來建構我們的 UI。

`UserViewModel` 組建將被建立，並隨之解析 `UserService` 執行個體。若要在我們的 Compose UI 中取得它，我們使用 `koinViewModel()` 函式：

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

就這樣，您的 Compose 應用程式準備好了！

:::info
`koinViewModel()` 函式從 Koin 擷取一個 ViewModel 執行個體，並自動將其繫結到 Compose 生命週期。這是 Compose 特有的注入 ViewModel 的方式，取代了傳統 Android View 中使用的 `by viewModel()` 委派。
:::

### 核心 Compose 概念

- **ComponentActivity**：Compose 應用程式的基底類別（而非 AppCompatActivity）
- **setContent**：將可組合內容設定為 Activity 的 UI
- **@Composable**：以宣告方式建構 UI 的函式
- **remember & mutableStateOf**：用於反應式 UI 更新的 Compose 狀態管理
- **koinViewModel()**：Koin 的 Compose 整合，用於 ViewModel 注入

## 啟動 Koin

我們需要在 Android 應用程式中啟動 Koin。只需在應用程式的主要入口點（即我們的 `MainApplication` 類別）中呼叫 `startKoin()` 函式：

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
`startKoin` 中的 `modules()` 函式會載入指定的模組清單。
:::

## Koin 模組：DSL 比較

以下是使用 **傳統 DSL**（手動連接）的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

使用 **編譯器外掛程式 DSL**（在編譯時自動連接）：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
編譯器外掛程式 DSL 需要 [Koin 編譯器外掛程式](/docs/setup/compiler-plugin)。它提供編譯時的相依性解析與更簡潔的語法。
:::

## Compose 與 XML View

本教學示範了與 [Android ViewModel 教學](./android-viewmodel.md) 相同的功能，但使用 Jetpack Compose 而非 XML 版面配置：

| 層面 | XML View | Jetpack Compose |
|--------|-----------|-----------------|
| Activity 基底 | `AppCompatActivity` | `ComponentActivity` |
| UI 定義 | XML 版面配置檔案 | `@Composable` 函式 |
| ViewModel 注入 | `by viewModel()` 委派 | `koinViewModel()` 函式 |
| 狀態管理 | LiveData/StateFlow | `remember` + `mutableStateOf` |
| UI 更新 | View binding + 觀察者 | 自動重新編組 (Recomposition) |

:::tip
關於使用 Koin Annotations 搭配 Compose 的版本，請參閱 [Compose Multiplatform Annotations 教學](./compose-multiplatform-annotations.md)。
:::