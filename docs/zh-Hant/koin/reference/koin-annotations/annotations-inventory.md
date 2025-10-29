# Koin 註解清單

本文件提供了所有 Koin 註解的詳盡清單，包含其參數、行為和使用範例。

## 目錄

- [定義註解](#definition-annotations)
  - [@Single](#single)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [作用域註解](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel 與 Android 專用註解](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [限定符註解](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [屬性註解](#property-annotations)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [模組與應用程式註解](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [監控註解](#monitoring-annotations)
  - [@Monitor](#monitor)
- [元註解 (內部使用)](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 定義註解

### @Single

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 將類型或函式宣告為 Koin 中的 `single` (單一實例) 定義。將建立一個單一實例並在整個應用程式中共享。

**參數：**
- `binds: Array<KClass<*>> = [Unit::class]` - 明確要綁定到此定義的類型。超類型會自動偵測。
- `createdAtStart: Boolean = false` - 如果為 `true`，則實例會在 Koin 啟動時建立。

**行為：**
所有依賴項均透過建構式注入來填充。

**範例：**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
single { MyClass(get()) }
```

**使用明確綁定：**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**使用啟動時建立：**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 將類型或函式宣告為 Koin 中的 `factory` 定義。每次請求時都會建立一個新實例。

**參數：**
- `binds: Array<KClass<*>> = [Unit::class]` - 明確要綁定到此定義的類型。超類型會自動偵測。

**行為：**
所有依賴項均透過建構式注入來填充。每個請求都會建立一個新實例。

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

**目標：** `CLASS`、`FUNCTION`

**說明：** 將類型或函式宣告為 Koin 中的 `scoped` 定義。必須與 `@Scope` 註解關聯。實例在特定作用域內共享。

**參數：**
- `binds: Array<KClass<*>> = [Unit::class]` - 明確要綁定到此定義的類型。超類型會自動偵測。

**行為：**
建立一個在所定義作用域生命週期內存在的作用域實例。

**範例：**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**另請參閱：** [@Scope](#scope)

---

## 作用域註解

### @Scope

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 在 Koin 作用域中宣告一個類別。作用域名稱由值 (類別) 或名稱 (字串) 來描述。預設情況下，宣告為 `scoped` 定義。可使用 `@Scoped`、`@Factory`、`@KoinViewModel` 註解來覆寫以進行明確綁定。

**參數：**
- `value: KClass<*> = Unit::class` - 作用域類別值
- `name: String = ""` - 作用域字串值

**行為：**
建立與指定作用域類型或名稱相關聯的作用域定義。

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

**目標：** `CLASS`、`FUNCTION`

**說明：** 在 ViewModelScope Koin 作用域中宣告一個類別。這是為應在 ViewModel 生命週期內存在的元件而設的作用域原型。

**參數：** 無

**行為：**
在 `viewModelScope` 內建立一個作用域定義。

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
標記的類別旨在與 ViewModel 和 `viewModelScope` 函式一起使用以啟用作用域。

---

### @ActivityScope

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 在 Activity Koin 作用域中宣告一個類別。

**參數：** 無

**行為：**
在 `activityScope` 內建立一個作用域定義。

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
標記的類別旨在與 Activity 和 `activityScope` 函式一起使用以啟用作用域。

---

### @ActivityRetainedScope

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 在 Activity Koin 作用域中宣告一個類別，但在設定變更時仍會保留。

**參數：** 無

**行為：**
在 `activityRetainedScope` 內建立一個作用域定義。

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
標記的類別旨在與 Activity 和 `activityRetainedScope` 函式一起使用以啟用作用域。

---

### @FragmentScope

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 在 Fragment Koin 作用域中宣告一個類別。

**參數：** 無

**行為：**
在 `fragmentScope` 內建立一個作用域定義。

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
標記的類別旨在與 Fragment 和 `fragmentScope` 函式一起使用以啟用作用域。

---

### @ScopeId

**套件：** `org.koin.core.annotation`

**目標：** `VALUE_PARAMETER`

**說明：** 註解類別建構式或函式中的參數，以請求解析具有 Scope ID 的給定作用域。

**參數：**
- `value: KClass<*> = Unit::class` - 作用域類型
- `name: String = ""` - 作用域字串識別符

**行為：**
從由類型或名稱識別的特定作用域解析依賴項。

**使用字串名稱的範例：**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**使用類型的範例：**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel 與 Android 專用註解

### @KoinViewModel

**套件：** `org.koin.android.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** Koin 定義的 ViewModel 註解。將類型或函式宣告為 Koin 中的 `viewModel` 定義。

**平台支援：**
- ✅ Android
- ✅ Kotlin Multiplatform (KMP)
- ✅ Compose Multiplatform (CMP)

**參數：**
- `binds: Array<KClass<*>> = []` - 明確要綁定到此定義的類型。超類型會自動偵測。

**行為：**
所有依賴項均透過建構式注入來填充。建立一個由 Koin 管理的 ViewModel 實例。在使用 Compose Multiplatform 時，它可在所有平台 (包括 Android、iOS、桌面和網路) 上運作。

**範例 (Android/CMP)：**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**範例 (KMP/CMP 共享)：**
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

**目標：** `CLASS`、`FUNCTION`

**說明：** Koin 定義的 Worker 註解。將類型宣告為 WorkManager worker 的 `worker` 定義。

**參數：**
- `binds: Array<KClass<*>> = []` - 明確要綁定到此定義的類型。

**行為：**
為 Android WorkManager 整合建立 worker 定義。

**範例：**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 限定符註解

### @Named

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FUNCTION`、`VALUE_PARAMETER`

**說明：** 為給定定義定義一個限定符。產生 `StringQualifier("...")` 或基於類型的限定符。

**參數：**
- `value: String = ""` - 字串限定符
- `type: KClass<*> = Unit::class` - 類別限定符

**行為：**
用於區分相同類型的多個定義。

**使用字串的範例：**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**在參數中的用法：**
```kotlin
@Single
class Consumer(@Named("special") val myClass: MyClass)
```

**使用類型的範例：**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FUNCTION`、`VALUE_PARAMETER`

**說明：** 為給定定義定義一個限定符。與 `@Named` 類似，但參數優先順序相反。

**參數：**
- `value: KClass<*> = Unit::class` - 類別限定符
- `name: String = ""` - 字串限定符

**行為：**
用於區分相同類型的多個定義。

**範例：**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## 屬性註解

### @Property

**套件：** `org.koin.core.annotation`

**目標：** `VALUE_PARAMETER`

**說明：** 註解建構式參數或函式參數，將其解析為 Koin 屬性。

**參數：**
- `value: String` - 屬性名稱

**行為：**
從 Koin 屬性而不是依賴注入來解析參數值。

**範例：**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**產生的 Koin DSL：**
```kotlin
factory { MyClass(getProperty("name")) }
```

**使用預設值：**
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

**說明：** 註解一個欄位值，該值將作為屬性的預設值。

**參數：**
- `value: String` - 屬性名稱

**行為：**
為屬性定義預設值，當找不到該屬性時可使用。

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

## 模組與應用程式註解

### @Module

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`

**說明：** 類別註解，用於協助將定義收集到 Koin 模組中。每個函式都可以使用 Koin 定義註解來註解。

**參數：**
- `includes: Array<KClass<*>> = []` - 要包含的模組類別
- `createdAtStart: Boolean = false` - 如果為 `true`，則模組實例會在啟動時建立。

**行為：**
收集模組中所有已註解的函式和類別。

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

**使用 includes：**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // definitions
}
```

---

### @ComponentScan

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FIELD`

**說明：** 收集使用 Koin 定義註解宣告的定義。掃描目前的套件或明確指定的套件名稱。

**參數：**
- `value: vararg String = []` - 要掃描的套件 (支援 Glob 模式)

**行為：**
掃描指定套件中已註解的類別。支援精確套件名稱和 Glob 模式。

**Glob 模式支援：**

1. **精確套件名稱 (無萬用字元)：**
   - `com.example.service` - 掃描此套件及其所有子套件 (等同於 `com.example**`)

2. **多層掃描 (包含根套件)：**
   - `com.example**` - 掃描 `com.example` 及其所有子套件

3. **多層掃描 (不含根套件)：**
   - `com.example.**` - 僅掃描 `com.example` 的子套件，不包含根套件本身

4. **單層萬用字元：**
   - `com.example.*.service` - 精確匹配一層 (例如 `com.example.user.service`)

5. **組合萬用字元：**
   - `com.**.service.*data` - 複雜模式匹配
   - `com.*.service.**` - 掃描模式下的子套件

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

**範例 - 使用 Glob 模式：**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FIELD`

**說明：** 應用於 `@Module` 類別，以將其與一個或多個配置 (標籤/版本) 關聯。

**參數：**
- `value: vararg String = []` - 配置名稱

**行為：**
模組可以分組為配置，以便進行條件載入。

**預設配置：**
```kotlin
@Module
@Configuration
class MyModule
```
此模組屬於「default」配置。

**多個配置：**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
此模組在「prod」和「test」配置中均可用。

**帶預設值：**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
在 default 和 test 配置中可用。

**注意：** `@Configuration("default")` 等同於 `@Configuration`

---

### @KoinApplication

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`

**說明：** 將類別標記為 Koin 應用程式的進入點。使用 `startKoin()` 或 `koinApplication()` 函式產生 Koin 應用程式的啟動程式。

**參數：**
- `configurations: Array<String> = []` - 要掃描的配置名稱清單
- `modules: Array<KClass<*>> = [Unit::class]` - 除配置外要載入的模組清單

**行為：**
產生啟動函式，用於掃描配置和包含的模組。

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

**範例 - 帶模組：**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**使用自訂配置：**
```kotlin
MyApp.startKoin {
    printLogger()
    // additional configuration
}
```

---

## 監控註解

### @Monitor

**套件：** `org.koin.core.annotation`

**目標：** `CLASS`、`FUNCTION`

**說明：** 標記一個類別或函式，以便透過 Kotzilla Platform (Koin 的官方工具平台) 進行自動監控和效能追蹤。

**參數：** 無

**行為：**
- 當應用於類別時：產生一個 Koin 代理，監控所有公開方法呼叫
- 當應用於函式時：監控 Koin 管理元件中的該特定方法
- 自動捕獲效能指標、錯誤率和使用模式
- 將資料傳送至 Kotzilla 工作區進行即時分析

**要求：**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 有效的 Kotzilla Platform 帳戶和 API 金鑰

**範例：**
```kotlin
@Monitor
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
}
```

**資源：**
- [Kotzilla Platform](https://kotzilla.io)
- [完整文件](https://doc.kotzilla.io)
- [最新版本](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)

**始於：** Kotzilla 1.2.1

---

## 元註解 (內部使用)

這些註解僅供 Koin 編譯器和程式碼生成內部使用。

### @ExternalDefinition

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`、`FIELD`、`FUNCTION`

**說明：** 用於在生成的套件中發現元件的內部用途。

**參數：**
- `value: String = ""` - 宣告定義的套件

---

### @MetaDefinition

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`、`FUNCTION`、`PROPERTY`

**說明：** 元定義註解，用於協助表示定義中繼資料。

**參數：**
- `value: String = ""` - 定義的完整路徑
- `moduleTagId: String = ""` - 模組標籤 + ID (格式："module_id:module_tag")
- `dependencies: Array<String> = []` - 要檢查的參數標籤
- `binds: Array<String> = []` - 綁定的類型
- `qualifier: String = ""` - 限定符
- `scope: String = ""` - 宣告所在的作用域

---

### @MetaModule

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`

**說明：** 元模組註解，用於協助表示模組中繼資料。

**參數：**
- `value: String = ""` - 模組的完整路徑
- `id: String = ""` - 模組 ID
- `includes: Array<String> = []` - 要檢查的包含模組標籤
- `configurations: Array<String> = []` - 要檢查的模組配置
- `isObject: Boolean = false` - 模組是否為一個物件 (object)

---

### @MetaApplication

**套件：** `org.koin.meta.annotations`

**目標：** `CLASS`

**說明：** 元應用程式註解，用於協助表示應用程式中繼資料。

**參數：**
- `value: String = ""` - 應用程式的完整路徑
- `includes: Array<String> = []` - 要檢查的使用模組標籤
- `configurations: Array<String> = []` - 要檢查的使用配置模組

---

## 已棄用註解

### @Singleton

**套件：** `org.koin.core.annotation`

**狀態：** 已棄用 - 錯誤等級

**替代方案：** 請改用 `koin-jsr330` 套件中的 `@Singleton`

**說明：** 與 `@Single` 相同，但因符合 JSR-330 規範而棄用。

---

## 總結表格

| 註解 | 套件 | 目的 | 常見使用情境 |
|---|---|---|---|
| `@Single` | `org.koin.core.annotation` | 單一實例定義 | 共享的應用程式服務 |
| `@Factory` | `org.koin.core.annotation` | 工廠定義 | 每次請求建立的實例 |
| `@Scoped` | `org.koin.core.annotation` | 作用域定義 | 作用域專屬實例 |
| `@Scope` | `org.koin.core.annotation` | 作用域宣告 | 自訂作用域 |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel 作用域 | ViewModel 作用域的依賴項 |
| `@ActivityScope` | `org.koin.android.annotation` | Activity 作用域 | Activity 作用域的依賴項 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 活躍 Activity 作用域 | 設定變更時仍保留的依賴項 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragment 作用域 | Fragment 作用域的依賴項 |
| `@ScopeId` | `org.koin.core.annotation` | 作用域解析 | 從特定作用域解析 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 定義 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | Worker 定義 | WorkManager worker |
| `@Named` | `org.koin.core.annotation` | 字串/類型限定符 | 區分同類型的定義 |
| `@Qualifier` | `org.koin.core.annotation` | 類型/字串限定符 | 區分同類型的定義 |
| `@Property` | `org.koin.core.annotation` | 屬性注入 | 設定值 |
| `@PropertyValue` | `org.koin.core.annotation` | 屬性預設值 | 預設設定值 |
| `@Module` | `org.koin.core.annotation` | 模組宣告 | 分組定義 |
| `@ComponentScan` | `org.koin.core.annotation` | 套件掃描 | 自動發現定義 |
| `@Configuration` | `org.koin.core.annotation` | 模組配置 | 建構變體/版本 |
| `@KoinApplication` | `org.koin.core.annotation` | 應用程式進入點 | 啟動 Koin |
| `@Monitor` | `org.koin.core.annotation` | 效能監控 | 正式環境監控 |

---

**文件版本：** 1.0
**最後更新：** 20-10-2025
**Koin 註解版本：** 2.2.x+