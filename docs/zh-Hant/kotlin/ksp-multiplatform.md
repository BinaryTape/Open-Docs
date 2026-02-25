[//]: # (title: KSP 搭配 Kotlin Multiplatform)

若要快速入門，請參閱定義了 KSP 處理器的 [Kotlin Multiplatform 專案範例](https://github.com/google/ksp/tree/main/examples/multiplatform)。

從 KSP 1.0.1 開始，在多平台專案上套用 KSP 與在單一平台、JVM 專案上的操作方式相似。主要差異在於，在相依性中不再撰寫 `ksp(...)` 組態，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 來指定在編譯前哪些編譯目標需要進行符號處理。

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    jvm()
    linuxX64 {
        binaries {
            executable()
        }
    }
}

dependencies {
    add("kspCommonMainMetadata", project(":test-processor"))
    add("kspJvm", project(":test-processor"))
    add("kspJvmTest", project(":test-processor")) // 不會執行任何操作，因為 JVM 沒有測試原始碼集
    // Linux x64 主原始碼集不會進行處理，因為未指定 kspLinuxX64
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 編譯與處理

在多平台專案中，每個平台可能會發生多次 Kotlin 編譯（`main`、`test` 或其他組建變體）。符號處理也是如此。只要有 Kotlin 編譯任務且指定了對應的 `ksp<Target>` 或 `ksp<SourceSet>` 組態，就會建立符號處理任務。

例如，在上述的 `build.gradle.kts` 中，共有 4 個編譯任務：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 個符號處理任務：common/metadata、JVM main、Linux x64 test。

## 在 KSP 1.0.1+ 中避免使用 ksp(...) 組態

在 KSP 1.0.1 之前，只有一個統一的 `ksp(...)` 組態可用。因此，處理器要麼套用於所有編譯目標，要麼完全不套用。請注意，即使在傳統的非多平台專案中，`ksp(...)` 組態不僅套用於主原始碼集，如果存在測試原始碼集也會套用。這為組建時間帶來了不必要的開銷。

從 KSP 1.0.1 開始，如上述範例所示，提供了個別目標的組態。未來：
1. 對於多平台專案，`ksp(...)` 組態將被棄用並移除。
2. 對於單一平台專案，`ksp(...)` 組態將僅套用於主預設編譯。其他目標（如 `test`）則需要指定 `kspTest(...)` 才能套用處理器。

從 KSP 1.0.1 開始，有一個早期體驗旗標 `-DallowAllTargetConfiguration=false` 可切換至更有效率的行為。如果目前的行為導致效能問題，請嘗試使用此旗標。該旗標的預設值將在 KSP 2.0 從 `true` 改為 `false`。