[//]: # (title: KSP 搭配 Kotlin 多平台)

如欲快速入門，請參閱一個定義 KSP 處理器的[Kotlin 多平台範例專案](https://github.com/google/ksp/tree/main/examples/multiplatform)。

自 KSP 1.0.1 起，在多平台專案上應用 KSP 與在單平台 JVM 專案上應用類似。主要差異在於，不再是將 `ksp(...)` 配置寫在依賴項中，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 來指定在編譯前哪些編譯目標需要符號處理。

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
    add("kspJvmTest", project(":test-processor")) // Not doing anything because there's no test source set for JVM
    // There is no processing for the Linux x64 main source set, because kspLinuxX64 isn't specified
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 編譯與處理

在多平台專案中，每個平台上的 Kotlin 編譯可能會發生多次（`main`、`test` 或其他建構變體）。符號處理亦然。每當有 Kotlin 編譯任務且指定了相應的 `ksp<Target>` 或 `ksp<SourceSet>` 配置時，就會建立一個符號處理任務。

例如，在上述 `build.gradle.kts` 中，有 4 個編譯任務：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 個符號處理任務：common/metadata、JVM main、Linux x64 test。

## 避免在 KSP 1.0.1+ 中使用 `ksp(...)` 配置

在 KSP 1.0.1 之前，只有一個統一的 `ksp(...)` 配置可用。因此，處理器要麼適用於所有編譯目標，要麼完全不適用。請注意，`ksp(...)` 配置不僅適用於主要原始碼集，如果存在的話，也適用於測試原始碼集，即使是在傳統的非多平台專案中也是如此。這給建構時間帶來了不必要的開銷。

自 KSP 1.0.1 起，提供了如上述範例所示的每個目標的配置。未來：
1. 對於多平台專案，`ksp(...)` 配置將被廢棄並移除。
2. 對於單平台專案，`ksp(...)` 配置將僅適用於主要、預設的編譯。其他目標（如 `test`）將需要指定 `kspTest(...)` 才能應用處理器。

自 KSP 1.0.1 起，有一個早期存取旗標 `-DallowAllTargetConfiguration=false` 可切換到更高效的行為。如果當前行為導致效能問題，請嘗試看看。該旗標的預設值將在 KSP 2.0 時從 `true` 反轉為 `false`。