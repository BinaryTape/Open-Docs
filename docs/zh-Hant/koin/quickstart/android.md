---
title: Android
---

> 本教學將引導您編寫一個 Android 應用程式，並使用 Koin 相依注入來取得您的組件。
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

## 應用程式概覽

此應用程式的想法是管理使用者清單，並透過 Presenter 或 ViewModel 將其顯示在我們的 `MainActivity` 類別中：

> Users -> UserRepository -> (Presenter 或 ViewModel) -> MainActivity

## 「User」資料

我們將管理一個 User 的集合。以下是資料類別：

```kotlin
data class User(val name : String)
```

我們建立一個 「Repository」組件來管理使用者清單（新增使用者或按名稱尋找）。以下是 `UserRepository` 介面及其實作：

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

讓我們宣告第一個組件。我們想要一個 `UserRepository` 的單例，透過建立 `UserRepositoryImpl` 的執行個體：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
}
```

## 使用 Presenter 顯示使用者

讓我們編寫一個 presenter 組件來顯示使用者：

```kotlin
class UserPresenter(private val repository: UserRepository) {

    fun sayHello(name : String) : String{
        val foundUser = repository.findUser(name)
        return foundUser?.let { "Hello '$it' from $this" } ?: "User '$name' not found!"
    }
}
```

> `UserRepository` 在 `UserPresenter` 的建構函式中被引用

我們在 Koin 模組中宣告 `UserPresenter`。我們將其宣告為 `factoryOf` 定義，以便不將任何執行個體保留在記憶體中（避免 Android 生命週期導致的記憶體洩漏）：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserStateHolder)
}
```

> `get()` 函式允許要求 Koin 解決所需的相依性。

## 在 Android 中注入相依性

`UserPresenter` 組件將被建立，並解決其中的 `UserRepository` 執行個體。要在我們的 Activity 中取得它，讓我們使用 `by inject()` 委派函式來注入：

```kotlin
class MainActivity : AppCompatActivity() {

    private val presenter: UserPresenter by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        //...
    }
}
```

就這樣，您的應用程式準備好了。

:::info
`by inject()` 函式讓我們能在 Android 組件執行階段（Activity、fragment、Service...）擷取 Koin 執行個體
:::

## 啟動 Koin

我們需要在 Android 應用程式中啟動 Koin。只需在應用程式的主要進入點（即我們的 `MainApplication` 類別）呼叫 `startKoin()` 函式：

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
`startKoin` 中的 `modules()` 函式會載入指定的模組清單
:::

## Koin 模組：傳統或建構函式 DSL？

以下是我們應用程式的 Koin 模組宣告：

```kotlin
val appModule = module {
    single<HelloRepository> { HelloRepositoryImpl() }
    factory { MyPresenter(get()) }
}
```

我們可以使用建構函式以更精簡的方式編寫：

```kotlin
val appModule = module {
    singleOf(::UserRepositoryImpl) { bind<UserRepository>() }
    factoryOf(::UserPresenter)
}
```

## 驗證您的應用程式！

在啟動應用程式之前，我們可以透過簡單的 JUnit 測試來驗證 Koin 配置，以確保 Koin 組態是正確的。

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

只需一個 JUnit 測試，您就可以確保您的定義配置沒有遺漏任何內容！