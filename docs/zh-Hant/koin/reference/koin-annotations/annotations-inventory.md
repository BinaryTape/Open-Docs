# Koin 註解清單 (Koin Annotations Inventory)

本文件提供所有 Koin 註解的完整清單、參數、行為以及使用範例。

## 目錄

- [定義註解 (Definition Annotations)](#definition-annotations)
  - [@Single / @Singleton](#single--singleton)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [作用域註解 (Scope Annotations)](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel 與 Android 特定註解](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [限定符註解 (Qualifier Annotations)](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [參數註解 (Parameter Annotations)](#parameter-annotations)
  - [@InjectedParam](#injectedparam)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [安全註解 (Safety Annotations)](#safety-annotations)
  - [@Provided](#provided)
- [模組與應用程式註解](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [監控註解 (Monitoring Annotations)](#monitoring-annotations)
  - [@Monitor](#monitor)
- [元註解 (Meta Annotations - 內部專用)](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 定義註解

### @Single / @Singleton

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 在 Koin 中將型別或函式宣告為 `single` (singleton) 定義。會在整個應用程式中建立並共用單一個執行個體。`@Singleton` 是偏好使用的名稱（符合標準命名慣例）；`@Single` 則是別名。

**參數：**
- `binds: Array<KClass<*>> = [Unit::class]` - 要繫結至此定義的明確型別。系統會自動偵測父型別。
- `createdAtStart: Boolean = false` - 若為 `true`，執行個體將在 Koin 啟動時建立。

**行為：**
所有相依性均透過建構函式注入填入。

**範例：**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
single { MyClass(get()) }
```

**搭配明確繫結：**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**在啟動時建立：**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 在 Koin 中將型別或函式宣告為 `factory` 定義。每次請求時都會建立一個新的執行個體。

**參數：**
- `binds: Array<KClass<*>> = [Unit::class]` - 要繫結至此定義的明確型別。系統會自動偵測父型別。

**行為：**
所有相依性均透過建構函式注入填入。每次請求都會建立一個新執行個體。

**範例：**
```kotlin
@Factory
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(get()) }
```

---

### @Scoped

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 在 Koin 中將型別或函式宣告為 `scoped` 定義。必須與 `@Scope` 註解關聯。執行個體會在特定的作用域（scope）內共用。

**參數：**
- `binds: Array<KClass<*>> = [Unit::class]` - 要繫結至此定義的明確型別。系統會自動偵測父型別。

**行為：**
建立一個在定義的作用域生命週期內存在的 scoped 執行個體。

**範例：**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**請參閱：** [@Scope](#scope)

---

## 作用域註解

### @Scope

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 將類別宣告在 Koin 作用域內。作用域名稱可由值（類別）或名稱（字串）描述。預設情況下會宣告一個 `scoped` 定義。可以使用 `@Scoped`、`@Factory`、`@KoinViewModel` 註解進行覆寫以進行明確繫結。

**參數：**
- `value: KClass<*> = Unit::class` - 作用域類別值
- `name: String = ""` - 作用域字串值

**行為：**
建立與指定作用域型別或名稱關聯的作用域定義。

**使用類別的範例：**
```kotlin
@Scope(MyScope::class)
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
scope<MyScope> {
    scoped { MyClass(get()) }
}
```

**使用字串名稱的範例：**
```kotlin
@Scope(name = "my_custom_scope")
class MyClass(val d : MyDependency)
```

---

### @ViewModelScope

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 將類別宣告在 ViewModelScope Koin 作用域中。這是針對應存在於 ViewModel 生命週期內之元件的作用域原型。

**參數：** 無

**行為：**
在 `viewModelScope` 內建立一個 scoped 定義。

**範例：**
```kotlin
@ViewModelScope
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
viewModelScope {
    scoped { MyClass(get()) }
}
```

**用法：**
被標記的類別旨在與 ViewModel 和 `viewModelScope` 函式搭配使用，以啟動該作用域。

---

### @ActivityScope

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 將類別宣告在 Activity Koin 作用域中。

**參數：** 無

**行為：**
在 `activityScope` 內建立一個 scoped 定義。

**範例：**
```kotlin
@ActivityScope
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
activityScope {
    scoped { MyClass(get()) }
}
```

**用法：**
畢業標記的類別旨在與 Activity 和 `activityScope` 函式搭配使用，以啟動該作用域。

---

### @ActivityRetainedScope

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 將類別宣告在 Activity Koin 作用域中，但在組態變更時仍會保留。

**參數：** 無

**行為：**
在 `activityRetainedScope` 內建立一個 scoped 定義。

**範例：**
```kotlin
@ActivityRetainedScope
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
activityRetainedScope {
    scoped { MyClass(get()) }
}
```

**用法：**
被標記的類別旨在與 Activity 和 `activityRetainedScope` 函式搭配使用，以啟動該作用域。

---

### @FragmentScope

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 將類別宣告在 Fragment Koin 作用域中。

**參數：** 無

**行為：**
在 `fragmentScope` 內建立一個 scoped 定義。

**範例：**
```kotlin
@FragmentScope
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
fragmentScope {
    scoped { MyClass(get()) }
}
```

**用法：**
被標記的類別旨在與 Fragment 和 `fragmentScope` 函式搭配使用，以啟動該作用域。

---

### @ScopeId

**套件：** `org.koin.core.annotation`

**目標：** `VALUE_PARAMETER`

**說明：** 標註類別建構函式或函式的參數，以請求針對具有作用域 ID 的指定作用域進行解析。

**參數：**
- `value: KClass<*> = Unit::class` - 作用域型別
- `name: String = ""` - 作用域字串識別碼

**行為：**
從型別或名稱識別的特定作用域中解析相依性。

**使用字串名稱的範例：**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**使用型別的範例：**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel 與 Android 特定註解

### @KoinViewModel

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** Koin 定義的 ViewModel 註解。在 Koin 中將型別或函式宣告為 `viewModel` 定義。

**平台支援：**
- ✅ Android
- ✅ Kotlin Multiplatform (KMP)
- ✅ Compose Multiplatform (CMP)

**參數：**
- `binds: Array<KClass<*>> = []` - 要繫結至此定義的明確型別。系統會自動偵測父型別。

**行為：**
所有相依性均透過建構函式注入填入。建立由 Koin 管理的 ViewModel 執行個體。在使用 Compose Multiplatform 時，可跨所有平台運行，包括 Android、iOS、桌面版和 Web。

**範例 (Android/CMP)：**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**範例 (KMP/CMP 共用)：**
```kotlin
@KoinViewModel
class SharedViewModel(
    val repository: Repository,
    val analytics: Analytics
) : ViewModel()
```

**產生的 Koin DSL：**
```kotlin
viewModel { MyViewModel(get()) }
```

---

### @KoinWorker

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** Koin 定義的 Worker 註解。將型別宣告為 WorkManager worker 的 `worker` 定義。

**參數：**
- `binds: Array<KClass<*>> = []` - 要繫結至此定義的明確型別。

**行為：**
針對 Android WorkManager 整合建立 worker 定義。

**範例：**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 限定符註解

### @Named

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**說明：** 為指定定義定義限定符（qualifier）。產生 `StringQualifier("...")` 或基於型別的限定符。

**參數：**
- `value: String = ""` - 字串限定符
- `type: KClass<*> = Unit::class` - 類別限定符

**行為：**
用於區分相同型別的多個定義。

**使用字串的範例：**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**在參數中使用：**
```kotlin
@Single
class Consumer(@Named("special") val myClass: MyClass)
```

**使用型別的範例：**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**說明：** 為指定定義定義限定符。與 `@Named` 類似，但參數優先級相反。

**參數：**
- `value: KClass<*> = Unit::class` - 類別限定符
- `name: String = ""` - 字串限定符

**行為：**
用於區分相同型別的多個定義。

**範例：**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## 參數註解

### @InjectedParam

**套件：** `org.koin.core.annotation`

**目標：** `VALUE_PARAMETER`

**說明：** 標記建構函式或函式參數，使其從 `ParametersHolder` (透過呼叫處的 `parametersOf()` 傳入) 解析，而非透過相依注入容器。

**參數：** 無

**行為：**
在執行期從 `ParametersHolder.get()` 解析參數值，而非從 Koin 定義中解析。編譯時期安全驗證會跳過標註為 `@InjectedParam` 的參數。

**範例：**
```kotlin
@Factory
class MyClass(@InjectedParam val id: Int, val service: Service)
```

**產生的 Koin DSL：**
```kotlin
factory { params -> MyClass(params.get(), get()) }
```

**用法：**
```kotlin
val instance = koin.get<MyClass> { parametersOf(42) }
```

---

### @Property

**套件：** `org.koin.core.annotation`

**目標：** `VALUE_PARAMETER`

**說明：** 標註建構函式參數或函式參數，以將其解析為 Koin 屬性（property）。

**參數：**
- `value: String` - 屬性名稱

**行為：**
從 Koin 屬性中解析參數值，而非透過相依注入。

**範例：**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name")) }
```

**搭配預設值：**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

### @PropertyValue

**套件：** `org.koin.core.annotation`

**目標：** `FIELD`

**說明：** 標註一個欄位值，該值將作為屬性的預設值。

**參數：**
- `value: String` - 屬性名稱

**行為：**
為屬性定義一個預設值，當找不到該屬性時可以使用。

**範例：**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

## 安全註解

### @Provided

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `VALUE_PARAMETER`

**說明：** 將型別或參數標記為在執行期由外部提供（例如：Android 框架型別、第三方 SDK）。編譯期安全驗證會跳過這些型別。

**參數：** 無

**行為：**
- 應用於 **類別 (class)** 時：該型別的所有使用處都會跳過編譯安全驗證
- 應用於 **參數 (parameter)** 時：僅該特定參數會跳過驗證
- 該型別在執行期仍會透過 `scope.get<T>()` 解析 —— `@Provided` 僅影響編譯時期檢查

**類別範例：**
```kotlin
@Provided
class FirebaseAnalytics  // 所有使用處都會跳過驗證

@Singleton
class AnalyticsService(val analytics: FirebaseAnalytics)
// 無編譯錯誤 —— FirebaseAnalytics 已標記為 @Provided
```

**參數範例：**
```kotlin
@Factory
class PaymentProcessor(@Provided val gateway: PaymentGateway)
// 無編譯錯誤 —— 僅此參數跳過驗證
```

**注意：** 常見的 Android 框架型別（`Context`, `Application`, `Activity`, `Fragment`, `SavedStateHandle`, `WorkerParameters`）已自動加入白名單，不需要使用 `@Provided`。

**請參閱：** [編譯期安全 (Compile-Time Safety)](/docs/reference/koin-compiler/compile-safety#external-types-provided)

---

## 模組與應用程式註解

### @Module

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`

**說明：** 類別註解，用於協助彙整 Koin 模組內的定義。每個函式都可以使用 Koin 定義註解進行標註。

**參數：**
- `includes: Array<KClass<*>> = []` - 要包含的模組類別
- `createdAtStart: Boolean = false` - 若為 `true`，模組執行個體將在啟動時建立

**行為：**
彙整模組內所有標註的函式和類別。

**範例：**
```kotlin
@Module
class MyModule {
    @Single
    fun myClass(d : MyDependency) = MyClass(d)
}
```

**產生的 Koin DSL：**
```kotlin
val MyModule.module = module {
    val moduleInstance = MyModule()
    single { moduleInstance.myClass(get()) }
}
```

**搭配 includes：**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // 定義
}
```

---

### @ComponentScan

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FIELD`

**說明：** 彙整使用 Koin 定義註解宣告的定義。掃描目前套件或明確指定的套件名稱。

**參數：**
- `value: vararg String = []` - 要掃描的套件（支援萬用字元模式）

**行為：**
掃描指定的套件以尋找標註的類別。支援精確的套件名稱和萬用字元模式。

**萬用字元模式 (Glob Pattern) 支援：**

1. **精確套件名稱（無萬用字元）：**
   - `com.example.service` - 掃描套件及其所有子套件（相當於 `com.example**`）

2. **包含根目錄的多層級掃描：**
   - `com.example**` - 掃描 `com.example` 和所有子套件

3. **不包含根目錄的多層級掃描：**
   - `com.example.**` - 僅掃描 `com.example` 的子套件，不包含根目錄

4. **單層級萬用字元：**
   - `com.example.*.service` - 僅配對一個層級（例如：`com.example.user.service`）

5. **組合萬用字元：**
   - `com.**.service.*data` - 複雜模式配對
   - `com.*.service.**` - 掃描該模式下的子套件

**範例 - 掃描目前套件：**
```kotlin
@ComponentScan
class MyApp
```

**範例 - 掃描特定套件：**
```kotlin
@ComponentScan("com.example.services", "com.example.repositories")
class MyApp
```

**範例 - 使用萬用字元模式：**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FIELD`

**說明：** 應用於 `@Module` 類別，將其與一或多個配置（標籤/變體）關聯。

**參數：**
- `value: vararg String = []` - 配置名稱

**行為：**
模組可以分組到配置中以便有條件地載入。

**預設配置：**
```kotlin
@Module
@Configuration
class MyModule
```
此模組是 "default" 配置的一部分。

**多個配置：**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
此模組在 "prod" 和 "test" 配置中皆可用。

**搭配預設配置：**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
在預設和測試配置中可用。

**注意：** `@Configuration("default")` 相當於 `@Configuration`

---

### @KoinApplication

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`

**說明：** 將類別標記為 Koin 應用程式進入點。產生具有 `startKoin()` 或 `koinApplication()` 函式的 Koin 應用程式引導程式。

**參數：**
- `configurations: Array<String> = []` - 要掃描的配置名稱清單
- `modules: Array<KClass<*>> = [Unit::class]` - 除了配置之外要載入的模組清單

**行為：**
產生掃描配置和包含模組的引導函式。

**範例 - 預設配置：**
```kotlin
@KoinApplication
class MyApp
```

**產生的函式：**
```kotlin
MyApp.startKoin()
MyApp.koinApplication()
```

**範例 - 特定配置：**
```kotlin
@KoinApplication(configurations = ["default", "prod"])
class MyApp
```

**範例 - 包含模組：**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**搭配自訂配置使用：**
```kotlin
MyApp.startKoin {
    printLogger()
    // 額外配置
}
```

---

## 監控註解

### @Monitor

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`, `FUNCTION`

**說明：** 標記類別或函式，以便透過 Kotzilla 平台（Koin 的官方工具平台）進行自動監控和效能追蹤。

**參數：** 無

**行為：**
- 應用於類別時：產生一個 Koin 代理，監控所有公開方法的呼叫
- 應用於函式時：監控 Koin 管理元件內的該特定方法
- 自動擷取效能指標、錯誤率和使用模式
- 將資料傳送到 Kotzilla 工作區進行即時分析

**需求：**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 有效的 Kotzilla 平台帳戶和 API 金鑰

**範例：**
```kotlin
@Monitor
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
}
```

**資源：**
- [Kotzilla 平台](https://kotzilla.io)
- [完整文件](https://doc.kotzilla.io)
- [最新版本](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)

**始於：** Kotzilla 1.2.1

---

## 元註解 (內部專用)

這些註解僅供 Koin 編譯器和程式碼產生內部使用。

### @ExternalDefinition

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`, `FIELD`, `FUNCTION`

**說明：** 內部用於在產生的套件中進行元件探索。

**參數：**
- `value: String = ""` - 宣告定義的套件

---

### @MetaDefinition

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`, `FUNCTION`, `PROPERTY`

**說明：** 元定義註解，協助表示定義元資料。

**參數：**
- `value: String = ""` - 定義的完整路徑
- `moduleTagId: String = ""` - 模組標籤 + ID (格式: "module_id:module_tag")
- `dependencies: Array<String> = []` - 要檢查的參數標籤
- `binds: Array<String> = []` - 繫結型別
- `qualifier: String = ""` - 限定符
- `scope: String = ""` - 宣告該定義的作用域

---

### @MetaModule

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`

**說明：** 元模組註解，協助表示模組元資料。

**參數：**
- `value: String = ""` - 模組完整路徑
- `id: String = ""` - 模組 ID
- `includes: Array<String> = []` - 要檢查的包含模組標籤
- `configurations: Array<String> = []` - 要檢查的模組配置
- `isObject: Boolean = false` - 模組是否為物件

---

### @MetaApplication

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`

**說明：** 元應用程式註解，協助表示應用程式元資料。

**參數：**
- `value: String = ""` - 應用程式完整路徑
- `includes: Array<String> = []` - 要檢查的已使用模組標籤
- `configurations: Array<String> = []` - 要檢查的已使用配置模組

---

## 摘要表

| 註解 | 套件 | 用途 | 常見使用案例 |
|------------|---------|---------|-----------------|
| `@Singleton` / `@Single` | `org.koin.core.annotation` | Singleton 定義 | 共用的應用程式服務 |
| `@Factory` | `org.koin.core.annotation` | Factory 定義 | 每次請求的執行個體 |
| `@Scoped` | `org.koin.core.annotation` | Scoped 定義 | 特定作用域的執行個體 |
| `@Scope` | `org.koin.core.annotation` | 作用域宣告 | 自訂作用域 |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel 作用域 | ViewModel 作用域的相依性 |
| `@ActivityScope` | `org.koin.android.annotation` | Activity 作用域 | Activity 作用域的相依性 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 保留的 activity 作用域 | 組態變更後存續的相依性 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragment 作用域 | Fragment 作用域的相依性 |
| `@ScopeId` | `org.koin.core.annotation` | 作用域解析 | 從特定作用域解析 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 定義 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | Worker 定義 | WorkManager worker |
| `@Named` | `org.koin.core.annotation` | 字串/型別限定符 | 區分同型別的 Bean |
| `@Qualifier` | `org.koin.core.annotation` | 型別/字串限定符 | 區分同型別的 Bean |
| `@InjectedParam` | `org.koin.core.annotation` | 執行期參數 | `parametersOf()` 的值 |
| `@Property` | `org.koin.core.annotation` | 屬性注入 | 配置值 |
| `@PropertyValue` | `org.koin.core.annotation` | 屬性預設值 | 預設配置值 |
| `@Provided` | `org.koin.core.annotation` | 跳過安全驗證 | 外部/框架型別 |
| `@Module` | `org.koin.core.annotation` | 模組宣告 | 將定義分組 |
| `@ComponentScan` | `org.koin.core.annotation` | 套件掃描 | 自動探索定義 |
| `@Configuration` | `org.koin.core.annotation` | 模組配置 | 組建變體/變體 (flavors) |
| `@KoinApplication` | `org.koin.core.annotation` | 應用程式進入點 | 引導 Koin |
| `@Monitor` | `org.koin.core.annotation` | 效能監控 | 正式環境監控 |

---

**文件版本：** 1.0
**最後更新：** 20-10-2025
**Koin Annotations 版本：** 2.2.x+