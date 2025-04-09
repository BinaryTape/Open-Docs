---
title: "使用 Kotlin Multiplatform 的 KSP"
---
如需快速入門，請參閱[範例 Kotlin Multiplatform 專案](https://github.com/google/ksp/tree/main/examples/multiplatform)，其中定義了 KSP 處理器 (KSP processor)。

從 KSP 1.0.1 開始，在多平台專案上應用 KSP (applying KSP) 類似於在單平台 JVM 專案上應用 KSP。主要區別在於，不用在 dependencies 寫入 `ksp(...)` 設定，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 來指定哪些編譯目標 (compilation targets) 需要在編譯前進行符號處理 (symbol processing)。

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

## 編譯和處理 (Compilation and processing)

在多平台專案中，Kotlin 編譯可能會針對每個平台多次發生（`main`、`test` 或其他 build flavors）。符號處理也是如此。每當有 Kotlin 編譯任務 (Kotlin compilation task) 並且指定了相應的 `ksp<Target>` 或 `ksp<SourceSet>` 設定時，就會建立一個符號處理任務 (symbol processing task)。

例如，在上面的 `build.gradle.kts` 中，有 4 個編譯任務：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 個符號處理任務：common/metadata、JVM main、Linux x64 test。

## 避免在 KSP 1.0.1+ 上使用 ksp(...) 設定 (Avoid the ksp(...) configuration)

在 KSP 1.0.1 之前，只有一個統一的 `ksp(...)` 設定可用。因此，處理器要么應用於所有編譯目標，要么完全不應用。請注意，即使在傳統的非多平台專案中，`ksp(...)` 設定不僅適用於 main source set，也適用於 test source set（如果存在）。這給構建時間帶來了不必要的開銷。

從 KSP 1.0.1 開始，提供了如上例所示的 per-target configuration。在未來：
1. 對於多平台專案，`ksp(...)` 設定將被棄用並移除。
2. 對於單平台專案，`ksp(...)` 設定將僅應用於 main，預設編譯 (default compilation)。
   其他目標 (targets)，如 `test`，將需要指定 `kspTest(...)` 才能應用處理器。

從 KSP 1.0.1 開始，有一個early access flag `-DallowAllTargetConfiguration=false` 可以切換到更高效的行為。
如果目前的行為導致效能問題，請嘗試一下。
在 KSP 2.0 上，該 flag 的預設值將從 `true` 翻轉為 `false`。