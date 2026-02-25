---
title: Android - Jetpack Compose
---

> 本教學將帶領您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組建。
> 您大約需要 __10 分鐘__ 來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 GitHub 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android-compose)
:::

## Gradle 設定

如下所示新增 Koin Android 相依性：

```groovy
dependencies {

    // Koin for Android
    implementation "io.insert-koin:koin-androidx-compose:$koin_version"
}
```

## 應用程式概覽

此應用程式的想法是管理使用者清單，並透過 Presenter 或 ViewModel 將其顯示在我們的 `MainActivity` 類別中：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> Composable

## 「User」資料

我們將管理一個 User 集合。這是資料類別： 

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」組建來管理使用者清單（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入的組建的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告我們的第一個組建。我們想要一個 `UserRepository` 的單例，透過建立一個 `UserRepositoryImpl` 的執行個體來實現：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
}
```

## 使用 UserViewModel 顯示使用者

### `UserViewModel` 類別

讓我們編寫一個 ViewModel 組建來顯示使用者：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserViewModel` 的建構函式中被參照。

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModelOf` 定義，以便不在記憶體中保留任何執行個體（避免 Android 生命週期的任何洩漏）：

```kotlin
val appModule = module {
     singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

> `get()` 函式允許要求 Koin 解析所需的相依性。

### 在 Compose 中注入 ViewModel

`UserViewModel` 組建將被建立，並隨之解析 `UserRepository` 執行個體。若要在 Activity 中取得它，讓我們使用 `koinViewModel()` 函式進行注入： 

```kotlin
@Composable
fun ViewModelInject(userName : String, viewModel: UserViewModel = koinViewModel()){
    Text(text = viewModel.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinViewModel` 函式允許我們擷取 ViewModel 執行個體，為您建立關聯的 ViewModel Factory 並將其繫結到生命週期。
:::

## 使用 UserStateHolder 顯示使用者

### `UserStateHolder` 類別

讓我們編寫一個狀態持有者（State holder）組建來顯示使用者：

```kotlin
class UserStateHolder(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserViewModel` 的建構函式中被參照。

我們在 Koin 模組中宣告 `UserStateHolder`。我們將其宣告為 `factoryOf` 定義，以便不在記憶體中保留任何執行個體（避免 Android 生命週期的任何洩漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

### 在 Compose 中注入 UserStateHolder

`UserStateHolder` 組建將被建立，並隨之解析 `UserRepository` 執行個體。若要在 Activity 中取得它，讓我們使用 `koinInject()` 函式進行注入： 

```kotlin
@Composable
fun FactoryInject(userName : String, presenter: UserStateHolder = koinInject()){
    Text(text = presenter.sayHello(userName), modifier = Modifier.padding(8.dp))
}
```

:::info
`koinInject` 函式允許我們擷取 ViewModel 執行個體，為您建立關聯的 ViewModel Factory 並將其繫結到生命週期。
:::

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

啟動 Compose 應用程式時，我們需要透過 `KoinAndroidContext` 將 Koin 連結到我們目前的 Compose 應用程式：

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

## Koin 模組：傳統或建構函式 DSL？

這是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我們可以使用建構函式以更簡潔的方式編寫：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 驗證您的應用程式！

在啟動應用程式之前，我們可以透過簡單的 JUnit 測試來驗證 Koin 配置，確保我們的 Koin 設定是正確的。

### Gradle 設定

如下所示新增 Koin Android 相依性：

```groovy
dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 檢查您的模組

`verify()` 函式允許驗證指定的 Koin 模組：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

只需一個 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何內容！