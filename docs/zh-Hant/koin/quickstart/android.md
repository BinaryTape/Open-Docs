---
title: Android
---

> 這份教學將引導你撰寫一個 Android 應用程式，並使用 Koin 依賴注入 (Dependency Injection) 來取得你的元件 (Component)。你大約需要 **10 分鐘** 來完成本教學。

:::note
更新 - 2024-10-21
:::

## 取得程式碼

:::info
[原始程式碼已在 Github 上提供](https://github.com/InsertKoinIO/koin-getting-started/tree/main/android)
:::

## Gradle 設定

如下所示加入 Koin Android 依賴項 (Dependency)：

```groovy
dependencies {

    // Koin for Android
    implementation("io.insert-koin:koin-android:$koin_version")
}
```

## 應用程式概覽

這個應用程式的構想是管理一份使用者列表，並透過 Presenter 或 ViewModel 在我們的 `MainActivity` 類別中顯示它：

> Users -> UserRepository -> (Presenter or ViewModel) -> MainActivity

## 「User」資料

我們將管理一個使用者集合。這是資料類別 (Data Class)：

```kotlin
data class User(val name : String)
```

我們建立一個「Repository」(儲存庫) 元件來管理使用者列表 (加入使用者或透過名稱尋找使用者)。如下所示，`UserRepository` 介面 (Interface) 及其實作 (Implementation)：

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

使用 `module` 函數來宣告一個 Koin 模組。Koin 模組是我們定義所有要注入的元件的地方。

```kotlin
val appModule = module {
    
}
```

讓我們宣告我們的第一個元件。我們希望透過建立 `UserRepositoryImpl` 的實例來取得一個 `UserRepository` 的單例 (Singleton)。

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 使用 Presenter 顯示使用者

讓我們撰寫一個 presenter 元件來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的建構函數 (Constructor) 中被參考。

我們在 Koin 模組中宣告 `UserPresenter`。我們將它宣告為一個 `factoryOf` 定義，以避免在記憶體中保留任何實例 (避免 Android 生命週期 (Lifecycle) 相關的記憶體洩漏)：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()` 函數允許 Koin 解析所需的依賴項。

## 在 Android 中注入依賴項

`UserPresenter` 元件將被建立，並同時解析 `UserRepository` 實例。要將它引入我們的 Activity，讓我們使用 `by inject()` 委託函數 (Delegate Function) 來注入它：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就這樣，你的應用程式已準備就緒。

:::info
`by inject()` 函數允許我們在 Android 元件的執行時 (Runtime) (Activity、fragment、Service 等) 取得 Koin 實例。
:::

## 啟動 Koin

我們需要讓 Koin 隨著我們的 Android 應用程式一起啟動。只要在應用程式的主要進入點 (Entry Point)，也就是我們的 `MainApplication` 類別中呼叫 `startKoin()` 函數即可：

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
`startKoin` 中的 `modules()` 函數會載入給定的模組列表。
:::

## Koin 模組：傳統方式還是建構函數 DSL？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    factory { MyPresenter(get()) }
}
```

我們可以用更簡潔的方式撰寫它，透過使用建構函數：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

## 驗證你的應用程式！

在啟動我們的應用程式之前，我們可以透過使用一個簡單的 JUnit 測試來驗證我們的 Koin 配置 (Configuration)，以確保它是好的。

### Gradle 設定

如下所示加入 Koin Android 依賴項：

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

僅透過一個 JUnit 測試，你就可以確保你的定義配置沒有遺漏任何東西！