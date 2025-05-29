[//]: # (title: KSP 与 Kotlin Multiplatform)

如需快速上手，请参阅[示例 Kotlin Multiplatform 项目](https://github.com/google/ksp/tree/main/examples/multiplatform)，该项目定义了一个 KSP 处理器。

从 KSP 1.0.1 开始，在多平台项目上应用 KSP 与在单平台 JVM 项目上类似。主要区别在于，不再将 `ksp(...)` 配置写入依赖项中，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 在编译前指定哪些编译目标需要进行符号处理。

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

## 编译与处理

在多平台项目中，Kotlin 编译可能针对每个平台发生多次（`main`、`test` 或其他构建变体）。符号处理亦是如此。每当存在 Kotlin 编译任务并指定了相应的 `ksp<Target>` 或 `ksp<SourceSet>` 配置时，就会创建一个符号处理任务。

例如，在上述 `build.gradle.kts` 中，有 4 个编译任务：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 个符号处理任务：common/metadata、JVM main、Linux x64 test。

## 避免在 KSP 1.0.1+ 版本中使用 `ksp(...)` 配置

在 KSP 1.0.1 之前，只有一个统一的 `ksp(...)` 配置可用。因此，处理器要么应用于所有编译目标，要么根本不应用。请注意，即使在传统的非多平台项目中，`ksp(...)` 配置不仅适用于主源集，如果存在，也适用于测试源集。这给构建时间带来了不必要的开销。

从 KSP 1.0.1 开始，提供了针对每个目标的配置，如上例所示。将来：
1. 对于多平台项目，`ksp(...)` 配置将被弃用并移除。
2. 对于单平台项目，`ksp(...)` 配置将只应用于主编译（默认编译）。其他目标（如 `test`）将需要指定 `kspTest(...)` 才能应用处理器。

从 KSP 1.0.1 开始，提供了一个抢先体验标志 `-DallowAllTargetConfiguration=false`，用于切换到更高效的行为。如果当前行为导致性能问题，请尝试使用该标志。该标志的默认值将在 KSP 2.0 中从 `true` 翻转为 `false`。