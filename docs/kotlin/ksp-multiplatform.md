[//]: # (title: 针对 Kotlin Multiplatform 的 KSP)

如需快速入门，请参阅定义了 KSP 处理器的[Kotlin Multiplatform 示例项目](https://github.com/google/ksp/tree/main/examples/multiplatform)。

从 KSP 1.0.1 开始，在多平台项目中应用 KSP 与在单平台 JVM 项目中类似。主要区别在于，不再是在 `dependencies` 中编写 `ksp(...)` 配置，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 来指定在编译之前哪些编译目标需要进行符号处理。

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
    add("kspJvmTest", project(":test-processor")) // 不执行任何操作，因为 JVM 没有测试源集
    // 不对 Linux x64 主源集进行处理，因为未指定 kspLinuxX64
    // add("kspLinuxX64Test", project(":test-processor"))
}
```

## 编译与处理

在多平台项目中，每个平台的 Kotlin 编译可能会发生多次（`main`、`test` 或其他构建变体）。符号处理也是如此。只要存在 Kotlin 编译任务并且指定了相应的 `ksp<Target>` 或 `ksp<SourceSet>` 配置，就会创建一个符号处理任务。

例如，在上述 `build.gradle.kts` 中，有 4 个编译任务：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 个符号处理任务：common/metadata、JVM main、Linux x64 test。

## 在 KSP 1.0.1+ 中避免使用 ksp(...) 配置

在 KSP 1.0.1 之前，只有一个统一的 `ksp(...)` 配置可用。因此，处理器要么应用于所有编译目标，要么完全不应用。请注意，`ksp(...)` 配置不仅适用于主源集，如果存在测试源集，它也适用于测试源集，即使在传统的非多平台项目中也是如此。这给构建时间带来了不必要的开销。

从 KSP 1.0.1 开始，如上例所示，提供了针对每个目标的配置。在未来：
1. 对于多平台项目，`ksp(...)` 配置将被弃用并移除。
2. 对于单平台项目，`ksp(...)` 配置将仅应用于主要的默认编译。其他目标（如 `test`）将需要指定 `kspTest(...)` 才能应用处理器。

从 KSP 1.0.1 开始，提供了一个早期访问标志 `-DallowAllTargetConfiguration=false` 以切换到更高效的行为。如果当前行为导致了性能问题，请尝试使用该标志。该标志的默认值将在 KSP 2.0 中从 `true` 改为 `false`。