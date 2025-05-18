---
title: "Android - Jetpack Compose"
---
> 本教學課程將引導您編寫一個 Android 應用程式，並使用 Koin 依賴注入（dependency injection）來檢索您的元件。
> 完成本教學課程大約需要 __10 分鐘__。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始程式碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 設定

加入 Koin Android 依賴，如下所示：

```groovy
dependencies {

    // Koin for Android
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## 應用程式概觀

此應用程式的目的是管理使用者列表，並在我們的 `MainActivity` 類別中使用 Presenter 或 ViewModel 顯示它：

> Users -> UserRepository -> (Presenter or ViewModel) -> Composable

## "User" 資料

我們將管理一個 Users 集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 元件來管理使用者列表（新增使用者或依名稱尋找）。以下是 `UserRepository` 介面及其實現：

```kotlin
interface UserRepository {
    fun findUser(name : String): User?
    fun addUsers(users : List<User>)
}

class UserRepositoryImpl : UserRepository {

    private val _users = arrayListOf<User>()

    override fun findUser(name: String): User? {
        return _users.firstOrNull { it.name == name }
    }

    override fun addUsers(users : List<User>) {
        _users.addAll(users)
    }
}
```

## Koin 模組

使用 `module` 函數來宣告 Koin 模組。Koin 模組是我們定義所有要注入的元件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告我們的第一個元件。我們想要一個 `UserRepository` 的單例（singleton），方法是建立一個 `UserRepositoryImpl` 的實例。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## 使用 UserViewModel 顯示使用者

### `UserViewModel` 類別

讓我們編寫一個 ViewModel 元件來顯示使用者：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的建構子中被引用

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModelOf` 定義，以避免在記憶體中保留任何實例（避免 Android 生命週期（lifecycle）的任何洩漏）：

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 函數允許要求 Koin 解析所需的依賴項。

### 在 Compose 中注入 ViewModel

`UserViewModel` 元件將被建立，並解析 `UserRepository` 實例。為了將其放入我們的 Activity 中，讓我們使用 `koinViewModel()` 函數注入它：

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 函數允許我們檢索 ViewModel 實例，為您建立相關聯的 ViewModel Factory，並將其繫結到生命週期。
:::

## 使用 UserStateHolder 顯示使用者

### `UserStateHolder` 類別

讓我們編寫一個 State holder 元件來顯示使用者：

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的建構子中被引用

我們在 Koin 模組中宣告 `UserStateHolder`。我們將其宣告為 `factoryOf` 定義，以避免在記憶體中保留任何實例（避免 Android 生命周期（lifecycle）的任何洩漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### 在 Compose 中注入 UserStateHolder

`UserStateHolder` 元件將被建立，並解析 `UserRepository` 實例。為了將其放入我們的 Activity 中，讓我們使用 `koinInject()` 函數注入它：

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 函數允許我們檢索 ViewModel 實例，為您建立相關聯的 ViewModel Factory，並將其繫結到生命週期。
:::

## 啟動 Koin

我們需要使用我們的 Android 應用程式啟動 Koin。只需在應用程式的主入口點（我們的 `MainApplication` 類別）中呼叫 `startKoin()` 函數：

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
`startKoin` 中的 `modules()` 函數載入給定的模組列表。
:::

在啟動 Compose 應用程式時，我們需要使用 `KoinAndroidContext` 將 Koin 連結到我們目前的 Compose 應用程式：

```kotlin
class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                KoinAndroidContext {
                    App()
                }
            }
        }
    }
}
```

## Koin 模組：經典還是建構子 DSL？

這是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我們可以透過使用建構子，以更緊湊的方式編寫它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 驗證您的應用程式！

我們可以在啟動應用程式之前，透過使用簡單的 JUnit 測試驗證我們的 Koin 配置來確保我們的 Koin 配置良好。

### Gradle 設定

加入 Koin Android 依賴，如下所示：

```groovy
dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 檢查您的模組

`verify()` 函數允許驗證給定的 Koin 模組：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

只需一個 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何內容！