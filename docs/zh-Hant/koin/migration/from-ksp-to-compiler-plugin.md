---
title: 將 Koin 註解從 KSP 遷移至編譯器外掛程式
---

# 將 Koin 註解從 KSP 遷移至編譯器外掛程式

本指南將協助您將 Koin 註解專案從基於 KSP 的處理方式遷移至新的 Koin 編譯器外掛程式。

:::info 好消息！
**您的註解將保持完全相同。** 僅有組建組態與 Koin 啟動程式碼會發生變更。
:::

## 有何不同？

| 面向 | KSP 處理 | 編譯器外掛程式 |
|--------|----------------|-----------------|
| **處理** | KSP (獨立步驟) | K2 編譯器 (整合) |
| **產生的檔案** | 在 `build/generated/ksp` 中可見 | 無 — 內聯轉換 |
| **組建速度** | 較慢 | 較快 |
| **KMP 設定** | 每一平台專屬的 KSP 配置 | 套用單一外掛程式 |
| **Koin 啟動** | `modules(AppModule().module)` | `startKoin<MyApp>()` |
| **未來支援** | 已棄用 | 積極開發中 |

## 系統需求

- **Kotlin 2.3+** (需要 K2 編譯器)
- **Gradle 8.x+**

## 遷移步驟

### 步驟 1：更新 Kotlin 版本

編譯器外掛程式需要 Kotlin 2.3+：

```kotlin
// build.gradle.kts
plugins {
    kotlin("jvm") version "2.3.20-Beta1" // 最低要求為 2.3.20-Beta1
}
```

### 步驟 2：更新版本目錄 (Version Catalog)

**遷移前 (KSP)：**
```toml
[versions]
koin = "4.0.0"
koin-ksp = "2.0.0"  # KSP 註解的獨立版本控制
ksp = "2.0.0-1.0.22"

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin-ksp" }
koin-ksp-compiler = { module = "io.insert-koin:koin-ksp-compiler", version.ref = "koin-ksp" }

[plugins]
ksp = { id = "com.google.devtools.ksp", version.ref = "ksp" }
```

**遷移後 (編譯器外掛程式)：**
```toml
[versions]
koin = "4.2.0-Beta4" // 或更新版本
koin-plugin = "0.2.9" // 或更新版本

[libraries]
koin-core = { module = "io.insert-koin:koin-core", version.ref = "koin" }
koin-annotations = { module = "io.insert-koin:koin-annotations", version.ref = "koin" }

[plugins]
koin-compiler = { id = "io.insert-koin.compiler.plugin", version.ref = "koin-plugin" }
```

:::note
`koin-annotations` 現在是 Koin 主專案的一部分，並使用與 `koin-core` 相同的版本。
:::

### 步驟 3：更新組建組態

**遷移前 (KSP)：**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.ksp)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // KSP 版本 (獨立版本控制)
    ksp(libs.koin.ksp.compiler)
}

ksp {
    arg("KOIN_CONFIG_CHECK", "true")
}
```

**遷移後 (編譯器外掛程式)：**
```kotlin
// build.gradle.kts
plugins {
    alias(libs.plugins.koin.compiler)
}

dependencies {
    implementation(libs.koin.core)
    implementation(libs.koin.annotations)  // 與 koin-core 版本相同
}

// 選用配置
koinCompiler {
    userLogs = true  // 記錄組件偵測
}
```

### 步驟 4：更新 Koin 啟動

這是主要的程式碼變更。KSP 方式使用產生的擴充套件，而編譯器外掛程式則使用具型別的 API。

**遷移前 (KSP)：**
```kotlin
import org.koin.ksp.generated.*  // 產生的擴充套件

@Module
@ComponentScan("com.myapp")
class AppModule

fun main() {
    startKoin {
        modules(AppModule().module)  // 產生的 .module 擴充套件
    }
}
```

**遷移後 (編譯器外掛程式)：**
```kotlin
// 不需要產生的匯入

@Module
@ComponentScan("com.myapp")
class AppModule

@KoinApplication(modules = [AppModule::class])
class MyApp

fun main() {
    startKoin<MyApp>()  // 具型別的 API
}
```

#### Android 範例

**遷移前 (KSP)：**
```kotlin
import org.koin.ksp.generated.*

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApplication)
            modules(AppModule().module)
        }
    }
}
```

**遷移後 (編譯器外掛程式)：**
```kotlin
@KoinApplication(modules = [AppModule::class])
class MyApp

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin<MyApp> {
            androidContext(this@MyApplication)
        }
    }
}
```

### 步驟 5：清理

移除 KSP 產生的檔案並重新組建：

```bash
rm -rf build/generated/ksp
./gradlew clean build
```

## 註解保持不變

所有加上註解的類別皆維持不變：

```kotlin
// 無需變更！
@Singleton
class UserRepository(private val database: Database)

@Factory
class GetUserUseCase(private val repository: UserRepository)

@KoinViewModel
class UserViewModel(private val useCase: GetUserUseCase) : ViewModel()

@Module
@ComponentScan("com.myapp")
class AppModule
```

所有註解的功能完全相同。請參閱 **[註解參考](/docs/reference/koin-annotations/definitions)** 以取得完整清單。

## KMP 遷移

編譯器外掛程式大幅簡化了 KMP 設定。

**遷移前 (KSP) — 每一平台專屬的配置：**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.insert-koin:koin-core:$koin_version")
            implementation("io.insert-koin:koin-annotations:$koin_ksp_version")  // 獨立版本
        }
    }
}

dependencies {
    // 每一平台都需要 KSP 編譯器
    add("kspAndroid", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosX64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
    add("kspIosSimulatorArm64", "io.insert-koin:koin-ksp-compiler:$koin_ksp_version")
}
```

**遷移後 (編譯器外掛程式) — 單一外掛程式：**
```kotlin
// shared/build.gradle.kts
plugins {
    kotlin("multiplatform")
    alias(libs.plugins.koin.compiler)
}

kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(libs.koin.core)
            implementation(libs.koin.annotations)
        }
    }
}
```

## 具型別的啟動 API

編譯器外掛程式提供了具型別的 API：`startKoin<T>()`、`koinApplication<T>()`、`koinConfiguration<T>()`。

詳情請參閱 **[從註解開始](/docs/reference/koin-annotations/start)**。

## 配置標籤 (新增)

編譯器外掛程式新增了配置標籤，用於條件式模組載入。

詳情請參閱 **[模組 - 配置](/docs/reference/koin-annotations/modules)**。

## 編譯器外掛程式選項

請參閱 **[編譯器外掛程式選項](/docs/reference/koin-annotations/options)** 以了解所有配置選項。

## 疑難排解

### 移除 KSP 後組建失敗

1. `./gradlew clean`
2. `rm -rf build/generated/ksp`
3. 失效 IDE 快取 (Invalidate IDE caches)
4. 重新組建

### 未偵測到註解

啟用記錄功能：
```kotlin
koinCompiler {
    userLogs = true
}
```

### 執行時缺少相依性

1. 檢查 `@ComponentScan` 套件
2. 驗證 `@KoinApplication(modules = [...])` 中的模組
3. 對外部相依性使用 `@Provided`

## 遷移檢查表

- [ ] 將 Kotlin 更新至 2.3+
- [ ] 移除 KSP 外掛程式
- [ ] 移除 `koin-ksp-compiler` 相依性
- [ ] 將 `koin-annotations` 更新至 Koin 主版本 (`io.insert-koin:koin-annotations:$koin_version`)
- [ ] 新增 Koin 編譯器外掛程式
- [ ] 建立 `@KoinApplication` 類別
- [ ] 將 `modules(X().module)` 替換為 `startKoin<MyApp>()`
- [ ] 移除 `import org.koin.ksp.generated.*`
- [ ] 清理並重新組建

## 另請參閱

- **[編譯器外掛程式設定](/docs/setup/compiler-plugin)** — 完整設定指南
- **[註解參考](/docs/reference/koin-annotations/start)** — 所有註解
- **[KSP 設定 (已棄用)](/docs/setup/annotations-ksp)** — 舊版參考