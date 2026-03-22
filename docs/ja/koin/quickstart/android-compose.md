---
title: Android - Jetpack Compose
---

> このチュートリアルでは、Jetpack Compose UIを使用したAndroidアプリケーションを作成し、Koinの依存関係注入（dependency injection）を使用してコンポーネントを取得する方法を学びます。
> 所要時間は約 **10分** です。

:::note
更新日 - 2024-11-28
:::

## コードを入手する

:::info
[ソースコードはGitHubで公開されています](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradleの設定

以下のようにKoin AndroidとKoin Composeの依存関係を追加します。

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
    // Koin for Jetpack Compose
    implementation("io.insert-koin:koin-androidx-compose:$koin_version")
}
```

## アプリケーションの概要

このアプリケーションの構成は、ユーザーのリストを管理し、ViewModelとJetpack Compose UIを使用して `MainActivity` クラスに表示するというものです。

> Users -> UserRepository -> UserService -> UserViewModel -> MainActivity (Compose UI)

## 「User」データ

ユーザーのコレクションを管理します。データクラスは以下の通りです。

```kotlin
data class User(val name: String, val email: String)
```

ユーザーのリストを管理（ユーザーの追加や名前による検索）するための「Repository」コンポーネントを作成します。以下は `UserRepository` インターフェースとその実装です。

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

## UserServiceコンポーネント

ユーザー操作を管理するためのサービスコンポーネントを作成しましょう。

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

## Koinモジュール

Koinモジュールを宣言するには `module` 関数を使用します。Koinモジュールは、注入するすべてのコンポーネントを定義する場所です。

```kotlin
val appModule = module {

}
```

コンポーネントを宣言しましょう。 `UserRepository` と `UserService` のシングルトンを作成します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
}
```

:::info
このチュートリアルでは、コンパイル時に自動配線（auto-wiring）を提供する **Koin Compiler Plugin DSL** (`single<T>()`, `viewModel<T>()`) を使用しています。設定については [Compiler Plugin Setup](/docs/setup/compiler-plugin) を参照してください。
:::

## ViewModelでユーザーを表示する

ユーザーを表示するためのViewModelコンポーネントを作成しましょう。

```kotlin
class UserViewModel(private val userService: UserService) : ViewModel() {

    fun sayHello(name: String): String {
        val user = userService.getUserOrNull(name)
        val message = userService.prepareHelloMessage(user)
        return "[UserViewModel] $message"
    }
}
```

> UserServiceはUserViewModelのコンストラクタで参照されています。

Koinモジュールで `UserViewModel` を宣言します。メモリ内にインスタンスを保持し続けないように（Androidのライフサイクルによるリークを避けるため）、 `viewModel` 定義として宣言します。

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

## Jetpack ComposeでのViewModelの注入

Jetpack Composeでは、 `AppCompatActivity` の代わりに `ComponentActivity` を使用し、XMLレイアウトの代わりにComposable関数を使用してUIを構築します。

`UserViewModel` コンポーネントが作成され、それとともに `UserService` インスタンスが解決されます。これをCompose UIで使用するために、 `koinViewModel()` 関数を使って取得しましょう。

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

これで、Composeアプリの準備が整いました！

:::info
`koinViewModel()` 関数は、KoinからViewModelのインスタンスを取得し、Composeのライフサイクルに自動的にバインドします。これは、従来のAndroid Viewで使用されていた `by viewModel()` デリゲートに代わる、Compose特有のViewModel注入方法です。
:::

### Composeの主要な概念

- **ComponentActivity**: Composeアプリのベースクラス（AppCompatActivityの代わり）
- **setContent**: ComposableコンテンツをActivityのUIとして設定する
- **@Composable**: UIを宣言的に構築する関数
- **remember & mutableStateOf**: リアクティブなUI更新のためのCompose状態管理
- **koinViewModel()**: ViewModel注入のためのKoinのCompose統合

## Koinの起動

AndroidアプリケーションでKoinを起動する必要があります。アプリケーションのメインエントリポイントである `MainApplication` クラスで `startKoin()` 関数を呼び出すだけです。

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
`startKoin` 内の `modules()` 関数は、指定されたモジュールのリストをロードします。
:::

## Koinモジュール：DSLの比較

こちらは **Classic DSL** （手動配線）を使用したKoinモジュールの宣言です。

```kotlin
val appModule = module {
    single<UserRepository> { UserRepositoryImpl() }
    single<UserService> { UserServiceImpl(get()) }
    viewModel { UserViewModel(get()) }
}
```

 **Compiler Plugin DSL** （コンパイル時の自動配線）を使用した場合：

```kotlin
val appModule = module {
    single<UserRepositoryImpl>() bind UserRepository::class
    single<UserServiceImpl>() bind UserService::class
    viewModel<UserViewModel>()
}
```

:::tip
Compiler Plugin DSLを使用するには [Koin Compiler Plugin](/docs/setup/compiler-plugin) が必要です。これにより、コンパイル時の依存関係解決と、よりクリーンな構文が提供されます。
:::

## Compose と XML Viewの比較

このチュートリアルでは、[Android ViewModelチュートリアル](./android-viewmodel.md)と同じ機能を示していますが、XMLレイアウトの代わりにJetpack Composeを使用しています。

| 項目 | XML View | Jetpack Compose |
|--------|-----------|-----------------|
| Activityのベース | `AppCompatActivity` | `ComponentActivity` |
| UI定義 | XMLレイアウトファイル | `@Composable` 関数 |
| ViewModelの注入 | `by viewModel()` デリゲート | `koinViewModel()` 関数 |
| 状態管理 | LiveData/StateFlow | `remember` + `mutableStateOf` |
| UIの更新 | View binding + observers | 自動リコンポジション（Automatic recomposition） |

:::tip
ComposeでKoin Annotationsを使用するバージョンについては、 [Compose Multiplatform Annotations tutorial](./compose-multiplatform-annotations.md) を参照してください。
:::