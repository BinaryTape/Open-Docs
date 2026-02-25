---
title: Android - ViewModel
---

> 這篇教學將帶領您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組件。
> 您大約需要 __10 min__ 來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 設定

如下所示新增 Koin Android 相依性：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 應用程式概觀

此應用程式的構想是管理使用者列表，並透過 Presenter 或 ViewModel 在我們的 `MainActivity` 類別中顯示：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> MainActivity

## "User" 資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 組件來管理使用者列表（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

使用 `module` 函式來宣告 Koin 模組。Koin 模組是我們定義所有要注入之組件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告第一個組件。我們想要透過建立一個 `UserRepositoryImpl` 的執行個體來得到 `UserRepository` 的單例。

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 使用 ViewModel 顯示使用者

讓我們撰寫一個 ViewModel 組件來顯示使用者：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserViewModel` 的建構函式中被參照。

我們在 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModelOf` 定義，以避免在記憶體中保留任何執行個體（防止與 Android 生命週期相關的記憶體洩漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 在 Android 中注入 ViewModel

`UserViewModel` 組件將被建立，並隨之解析 `UserRepository` 執行個體。為了將其獲取到我們的 Activity 中，讓我們使用 `by viewModel()` 委託函式進行注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就這樣，您的應用程式準備就緒了。

:::info
`by viewModel()` 函式允許我們獲取 ViewModel 執行個體，為您建立關聯的 ViewModel Factory 並將其綁定到生命週期。
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
`startKoin` 中的 `modules()` 函式會載入指定的模組列表。
:::

## Koin 模組：傳統或建構函式 DSL？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我們可以使用建構函式，以更精簡的方式撰寫：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 驗證您的應用程式！

在啟動應用程式之前，我們可以透過一個簡單的 JUnit 測試來驗證 Koin 配置，以確保 Koin 配置是正確的。

### Gradle 設定

如下所示新增 Koin Android 相依性：

```groovy
// 如果需要，將 Maven Central 新增至您的存儲庫
repositories {
	mavenCentral()    
}

dependencies {
    
    // 用於測試的 Koin
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

只需透過 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何內容！