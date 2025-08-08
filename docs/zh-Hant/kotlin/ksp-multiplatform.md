[//]: # (title: KSP 與 Kotlin 多平台)

如需快速入門，請參閱一個定義了 KSP 處理器的[Kotlin 多平台專案範例](https://github.com/google/ksp/tree/main/examples/multiplatform)。

從 KSP 1.0.1 開始，在多平台專案上套用 KSP 的方式與在單一平台、JVM 專案上的方式類似。主要差異在於，不再是將 `ksp(...)` 配置寫在依賴項中，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 來指定哪些編譯目標需要在編譯前進行符號處理。

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
    add("kspJvmTest", project(":test-processor")) // 由於 JVM 沒有測試原始碼集，所以不起作用
    // Linux x64 main 原始碼集沒有處理，因為未指定 kspLinuxX64
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 編譯與處理

在多平台專案中，Kotlin 編譯可能會針對每個平台發生多次（`main`、`test` 或其他建置變體）。符號處理亦是如此。每當存在 Kotlin 編譯任務且指定了對應的 `ksp<Target>` 或 `ksp<SourceSet>` 配置時，就會建立一個符號處理任務。

例如，在上述的 `build.gradle.kts` 中，有 4 個編譯任務：`common/metadata`、JVM `main`、Linux x64 `main`、Linux x64 `test`，以及 3 個符號處理任務：`common/metadata`、JVM `main`、Linux x64 `test`。

## 避免在 KSP 1.0.1+ 中使用 `ksp(...)` 配置

在 KSP 1.0.1 之前，只有一個統一的 `ksp(...)` 配置可用。因此，處理器要麼適用於所有編譯目標，要麼完全不適用。請注意，`ksp(...)` 配置不僅適用於 `main` 原始碼集，如果存在的話，也適用於 `test` 原始碼集，即使在傳統的非多平台專案上也是如此。這給建置時間帶來了不必要的開銷。

從 KSP 1.0.1 開始，提供了針對每個目標的配置，如上述範例所示。未來：
1. 對於多平台專案，`ksp(...)` 配置將被棄用並移除。
2. 對於單一平台專案，`ksp(...)` 配置將只適用於 `main`、預設編譯。其他目標，例如 `test`，將需要指定 `kspTest(...)` 才能套用處理器。

從 KSP 1.0.1 開始，有一個早期存取旗標 `-DallowAllTargetConfiguration=false` 用於切換到更高效的行為。如果目前的行為導致效能問題，請嘗試使用它。該旗標的預設值將在 KSP 2.0 中從 `true` 翻轉為 `false`。