[//]: # (title: KSP 与 Kotlin 多平台)

为了快速入门，请参见一个定义 KSP 处理器的 [Kotlin 多平台示例项目](https://github.com/google/ksp/tree/main/examples/multiplatform)。

从 KSP 1.0.1 开始，在多平台项目上应用 KSP 与在单平台 JVM 项目上应用类似。主要区别在于，不再是在依赖项中编写 `ksp(...)` 配置，而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)` 来在编译前指定哪些编译目标需要符号处理。

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

在多平台项目中，Kotlin 编译可能会针对每个平台发生多次（`main`、`test` 或其他构建变体）。符号处理也是如此。每当存在 Kotlin 编译任务且指定了对应的 `ksp<Target>` 或 `ksp<SourceSet>` 配置时，就会创建一个符号处理任务。

例如，在上述 `build.gradle.kts` 中，有 4 个编译任务：common/metadata、JVM main、Linux x64 main、Linux x64 test，以及 3 个符号处理任务：common/metadata、JVM main、Linux x64 test。

## 避免在 KSP 1.0.1+ 中使用 ksp(...) 配置

在 KSP 1.0.1 之前，只有一个统一的 `ksp(...)` 配置可用。因此，处理器要么应用于所有编译目标，要么完全不适用。请注意，`ksp(...)` 配置不仅应用于主源代码集，如果测试源代码集存在，它也适用于测试源代码集，即使是在传统的非多平台项目中也是如此。这给构建时间带来了不必要的开销。

从 KSP 1.0.1 开始，提供了针对每个目标的配置，如上例所示。将来：
1. 对于多平台项目，`ksp(...)` 配置将被弃用和移除。
2. 对于单平台项目，`ksp(...)` 配置将只应用于主要的默认编译项。其他目标（例如 `test`）将需要指定 `kspTest(...)` 以应用处理器。

从 KSP 1.0.1 开始，有一个抢先体验标志 `-DallowAllTargetConfiguration=false` 可以切换到更高效的行为。如果当前行为导致性能问题，请尝试一下。在 KSP 2.0 中，该标志的默认值将从 `true` 反转为 `false`。