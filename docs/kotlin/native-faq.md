[//]: # (title: Kotlin/Native 常见问题)

## 如何运行我的程序？

定义一个顶层函数 `fun main(args: Array<String>)`，如果你不关心传入的参数，也可以只定义 `fun main()`，请确保它不在任何包中。
此外，可以使用编译器开关 `-entry` 将任何接受 `Array<String>` 或不接受参数并返回 `Unit` 的函数作为入口点。

## Kotlin/Native 内存管理模型是什么？

Kotlin/Native 使用一种自动化内存管理方案，与 Java 或 Swift 提供的类似。

[了解 Kotlin/Native 内存管理器](native-memory-manager.md)

## 如何创建共享库？

在 Gradle 构建文件中使用 `-produce dynamic` 编译器选项或 `binaries.sharedLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

它会生成一个特定于平台的共享对象（Linux 上的 `.so`、macOS 上的 `.dylib` 和 Windows 目标上的 `.dll`）以及一个 C 语言头文件，允许在 C/C++ 代码中使用 Kotlin/Native 程序中所有可用的公共 API。

[完成 Kotlin/Native 作为动态库教程](native-dynamic-libraries.md)

## 如何创建静态库或目标文件？

在 Gradle 构建文件中使用 `-produce static` 编译器选项或 `binaries.staticLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

它会生成一个特定于平台的静态对象（`.a` 库格式）以及一个 C 语言头文件，允许你在 C/C++ 代码中使用 Kotlin/Native 程序中所有可用的公共 API。

## 如何在公司代理后运行 Kotlin/Native？

由于 Kotlin/Native 需要下载特定于平台的工具链，你需要将 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 指定为编译器或 `gradlew` 的参数，或者通过 `JAVA_OPTS` 环境变量进行设置。

## 如何为我的 Kotlin 框架指定自定义 Objective-C 前缀/名称？

使用 `-module-name` 编译器选项或匹配的 Gradle DSL 语句。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</tab>
</tabs>

## 如何重命名 iOS 框架？

iOS 框架的默认名称是 `<项目名称>.framework`。
要设置自定义名称，请使用 `baseName` 选项。这也会同时设置模块名称。

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## 如何为我的 Kotlin 框架启用 Bitcode？

Bitcode 嵌入已在 Xcode 14 中弃用，并在 Xcode 15 中针对所有 Apple 目标移除。
自 Kotlin 2.0.20 起，Kotlin/Native 编译器不再支持 Bitcode 嵌入。

如果你使用的是早期版本的 Xcode，但希望升级到 Kotlin 2.0.20 或更高版本，请在 Xcode 项目中禁用 Bitcode 嵌入。

## 如何从不同的协程安全地引用对象？

为了在 Kotlin/Native 中跨多个协程安全地访问或更新对象，请考虑使用并发安全构造，例如 `@Volatile` 和 `AtomicReference`。

使用 [`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/) 注解 `var` 属性。
这使得对属性后备字段的所有读写操作都具有原子性。此外，写入操作会立即对其他线程可见。当另一个线程访问此属性时，它不仅会观察到更新的值，还会观察到在更新之前发生的所有更改。

或者，使用支持原子读写操作的 [`AtomicReference`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/)。
在 Kotlin/Native 中，它封装了一个 `volatile` 变量并执行原子操作。
Kotlin 还提供了一组针对特定数据类型定制的原子操作类型。你可以使用 `AtomicInt`、`AtomicLong`、`AtomicBoolean`、`AtomicArray`，以及 `AtomicIntArray` 和 `AtomicLongArray`。

有关访问共享可变状态的更多信息，请参阅[协程文档](shared-mutable-state-and-concurrency.md)。

## 如何使用未发布的 Kotlin/Native 版本编译我的项目？

首先，请考虑尝试[预览版](eap.md)。

如果你需要更近期的开发版本，可以从源代码构建 Kotlin/Native：
克隆 [Kotlin 仓库](https://github.com/JetBrains/kotlin) 并遵循[这些步骤](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source)。