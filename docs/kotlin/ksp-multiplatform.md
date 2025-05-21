---
title: "使用 Kotlin Multiplatform 的 KSP"
---
要快速入门，请参阅定义 KSP 处理器的 [Kotlin Multiplatform 项目示例](https://github.com/google/ksp/tree/main/examples/multiplatform)。

从 KSP 1.0.1 开始，在 Multiplatform 项目上应用 KSP 类似于在单个平台 JVM 项目上应用。主要的区别在于，不是在依赖项中编写 `ksp(...)` 配置，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 来指定在编译之前哪些编译目标需要符号处理。

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
    add("kspJvmTest", project(":test-processor")) // 不执行任何操作，因为 JVM 没有测试源集 (test source set)
    // Linux x64 主源集 (main source set) 没有处理，因为未指定 kspLinuxX64
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 编译和处理 (Compilation and processing)

在 Multiplatform 项目中，Kotlin 编译可能会为每个平台发生多次（`main`、`test` 或其他构建风格）。符号处理也是如此。每当有 Kotlin 编译任务并且指定了相应的 `ksp<Target>` 或 `ksp<SourceSet>` 配置时，就会创建一个符号处理任务。

例如，在上面的 `build.gradle.kts` 中，有 4 个编译任务：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 个符号处理任务：common/metadata、JVM main、Linux x64 test。

## 避免在 KSP 1.0.1+ 上使用 ksp(...) 配置

在 KSP 1.0.1 之前，只有一个统一的 `ksp(...)` 配置可用。因此，处理器要么应用于所有编译目标，要么根本不应用。请注意，`ksp(...)` 配置不仅适用于主源集 (main source set)，而且如果存在测试源集 (test source set)，也适用于测试源集 (test source set)，即使在传统的非 Multiplatform 项目中也是如此。这给构建时间带来了不必要的开销。

从 KSP 1.0.1 开始，提供了如上例所示的每个目标的配置。将来：
1. 对于 Multiplatform 项目，`ksp(...)` 配置将被弃用和删除。
2. 对于单平台项目，`ksp(...)` 配置将仅应用于主 (main) 的默认编译。`test` 等其他目标将需要指定 `kspTest(...)` 才能应用处理器。

从 KSP 1.0.1 开始，有一个早期访问标志 `-DallowAllTargetConfiguration=false` 可以切换到更高效的行为。如果当前行为导致性能问题，请尝试一下。在 KSP 2.0 上，该标志的默认值将从 `true` 翻转到 `false`。