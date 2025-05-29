---
title: Android - ViewModel
---

> 本教學將引導你編寫一個 Android 應用程式，並使用 Koin 依賴注入來取得你的組件。
> 你需要約 **10 分鐘**來完成此教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 設定

如下所示新增 Koin Android 依賴：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 應用程式概述

此應用程式的構想是管理使用者清單，並使用 Presenter 或 ViewModel 在我們的 `MainActivity` 類別中顯示它：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> MainActivity

## 「使用者」資料

我們將管理使用者集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」組件來管理使用者清單（新增使用者或按名稱尋找使用者）。以下是 `UserRepository` 介面及其實作：

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

使用 `module` 函數來宣告一個 Koin 模組。Koin 模組是我們定義所有要注入的組件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告第一個組件。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的實例。

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 使用 ViewModel 顯示使用者

讓我們編寫一個 ViewModel 組件來顯示使用者：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的建構函數中被引用

我們在我們的 Koin 模組中宣告 `UserViewModel`。我們將其宣告為 `viewModelOf` 定義，以避免在記憶體中保留任何實例（避免與 Android 生命週期相關的記憶體洩漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 在 Android 中注入 ViewModel

`UserViewModel` 組件將被建立，並解析其 `UserRepository` 實例。要將它放入我們的 Activity 中，讓我們使用 `by viewModel()` 委託函數注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就這樣，你的應用程式已經準備好了。

:::info
`by viewModel()` 函數允許我們檢索 ViewModel 實例，為你建立相關的 ViewModel Factory 並將其綁定到生命週期
:::

## 啟動 Koin

我們需要在我們的 Android 應用程式中啟動 Koin。只需在應用程式的主入口點，我們的 `MainApplication` 類別中呼叫 `startKoin()` 函數即可：

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
`startKoin` 中的 `modules()` 函數會載入給定的模組清單
:::

## Koin 模組：傳統方式還是建構函數 DSL？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我們可以透過使用建構函數，以更緊湊的方式來編寫它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 驗證你的應用程式！

在啟動我們的應用程式之前，我們可以透過一個簡單的 JUnit 測試來驗證我們的 Koin 配置，以確保其良好。

### Gradle 設定

如下所示新增 Koin Android 依賴：

```groovy
// Add Maven Central to your repositories if needed
repositories {
	mavenCentral()    
}

dependencies {
    
    // Koin for Tests
    testImplementation "io.insert-koin:koin-test-junit4:$koin_version"
}
```

### 檢查你的模組

`verify()` 函數允許驗證給定的 Koin 模組：

```kotlin
class CheckModulesTest : KoinTest {

    @Test
    fun checkAllModules() {
        appModule.verify()
    }
}
```

僅透過一個 JUnit 測試，你可以確保你的定義配置沒有遺漏任何東西！