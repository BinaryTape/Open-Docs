---
title: "Android - ViewModel"
---
> 本教學課程將引導您編寫一個 Android 應用程式，並使用 Koin 依賴注入來檢索您的元件（components）。
> 完成本教學課程約需 __10 分鐘__。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始程式碼可在 Github 上取得](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 設定

如下所示新增 Koin Android 依賴項：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 應用程式概述

應用程式的想法是管理一個使用者列表，並在我們的 `MainActivity` 類別中使用 Presenter 或 ViewModel 來顯示它：

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## "User" 資料

我們將管理一個使用者（Users）的集合。 以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個 "Repository" 元件來管理使用者列表（新增使用者或按名稱尋找使用者）。 以下是 `UserRepository` 介面及其實現：

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

## Koin 模組（module）

使用 `module` 函數宣告一個 Koin 模組。 Koin 模組是我們定義所有要注入元件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告我們的第一個元件。 我們想要一個 `UserRepository` 的單例，透過創建 `UserRepositoryImpl` 的實例。

```kotlin
val appModule = module {
   singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 使用 ViewModel 顯示使用者

讓我們編寫一個 ViewModel 元件來顯示使用者：

```kotlin
class UserViewModel(private val repository: UserRepository) : ViewModel() {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> UserRepository 在 UserViewModel 的建構函數中被引用

我們在 Koin 模組中宣告 `UserViewModel`。 我們將其宣告為 `viewModelOf` 定義，以不在記憶體中保留任何實例（避免與 Android 生命週期產生任何洩漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 在 Android 中注入 ViewModel

`UserViewModel` 元件將會被創建，並解析 `UserRepository` 實例。 要在我們的 Activity 中取得它，讓我們使用 `by viewModel()` 委託函數注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val viewModel: UserViewModel by viewModel()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就是這樣，您的應用程式已準備就緒。

:::info
`by viewModel()` 函數允許我們檢索 ViewModel 實例，為您創建相關聯的 ViewModel Factory，並將其綁定到生命週期
:::

## 啟動 Koin

我們需要使用我們的 Android 應用程式啟動 Koin。 只需在應用程式的主要入口點（我們的 `MainApplication` 類別）中呼叫 `startKoin()` 函數即可：

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
`startKoin` 中的 `modules()` 函數載入給定的模組列表
:::

## Koin 模組：傳統方式還是建構函數 DSL？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    viewModel { MyViewModel(get()) }
}
```

我們可以透過使用建構函數以更緊湊的方式編寫它：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    viewModelOf(::UserViewModel)
}
```

## 驗證您的應用程式！

我們可以透過使用一個簡單的 JUnit 測試驗證我們的 Koin 配置，從而確保我們的 Koin 配置在啟動我們的應用程式之前是正確的。

### Gradle 設定

如下所示新增 Koin Android 依賴項：

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