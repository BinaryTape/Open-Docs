---
title: "Kotlin/Native 常见问题解答"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 如何运行我的程序？

定义一个顶层函数 `fun main(args: Array<String>)` 或者如果对传递的参数不感兴趣，可以直接定义 `fun main()`，请确保它不在任何 package 中。
另外，编译器开关 `-entry` 可以用来指定任何接受 `Array<String>` 类型参数或无参数并返回 `Unit` 类型的函数作为入口点。

## Kotlin/Native 的内存管理模型是什么？

Kotlin/Native 使用一种自动内存管理方案，类似于 Java 或 Swift 提供的方案。

[了解 Kotlin/Native 内存管理器](native-memory-manager)

## 如何创建一个共享库？

使用 `-produce dynamic` 编译器选项或 Gradle 构建文件中的 `binaries.sharedLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

这将生成一个平台特定的共享对象（Linux 上为 `.so`，macOS 上为 `.dylib`，Windows 目标上为 `.dll`）和一个 C 语言头文件，允许从 C/C++ 代码中使用 Kotlin/Native 程序中所有可用的公共 API (Application Programming Interface)。

[完成 Kotlin/Native 作为动态库的教程](native-dynamic-libraries)

## 如何创建一个静态库或目标文件？

使用 `-produce static` 编译器选项或 Gradle 构建文件中的 `binaries.staticLib()`：

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

这将生成一个平台特定的静态对象（`.a` 库格式）和一个 C 语言头文件，允许你从 C/C++ 代码中使用 Kotlin/Native 程序中所有可用的公共 API。

## 如何在公司代理后面运行 Kotlin/Native？

由于 Kotlin/Native 需要下载特定于平台的工具链（toolchain），你需要指定 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 作为编译器或 `gradlew` 的参数，或者通过 `JAVA_OPTS` 环境变量设置。

## 如何为我的 Kotlin 框架指定自定义的 Objective-C 前缀/名称？

使用 `-module-name` 编译器选项或匹配的 Gradle DSL 语句。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</TabItem>
</Tabs>

## 如何重命名 iOS 框架？

iOS 框架的默认名称是 `<项目名称>.framework`。
要设置自定义名称，请使用 `baseName` 选项。 这也会设置模块名称。

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

## 如何为我的 Kotlin 框架启用 bitcode？

Bitcode 嵌入已在 Xcode 14 中弃用，并在 Xcode 15 中针对所有 Apple 目标移除。
Kotlin/Native 编译器自 Kotlin 2.0.20 起不支持 bitcode 嵌入。

如果您使用的是早期版本的 Xcode 但想要升级到 Kotlin 2.0.20 或更高版本，请在您的 Xcode 项目中禁用 bitcode 嵌入。

## 为什么会看到 InvalidMutabilityException？

:::note
此问题仅与旧版内存管理器相关。 查看 [Kotlin/Native 内存管理](native-memory-manager) 以了解新的内存管理器，该管理器自 Kotlin 1.7.20 起已默认启用。

:::

这很可能发生，因为你正在尝试修改一个被冻结的对象。对象可以显式地转换为冻结状态，例如从调用 `kotlin.native.concurrent.freeze` 的对象可访问的对象，或者隐式地转换（即从 `enum` 或全局单例对象可访问的对象 - 参见下一个问题）。

## 如何使单例对象可变？

:::note
此问题仅与旧版内存管理器相关。 查看 [Kotlin/Native 内存管理](native-memory-manager) 以了解新的内存管理器，该管理器自 Kotlin 1.7.20 起已默认启用。

:::

目前，单例对象是不可变的（即在创建后被冻结），通常认为保持全局状态不可变是一种好的做法。如果由于某种原因，你需要在此类对象内部使用可变状态，请在对象上使用 `@konan.ThreadLocal` 注解。此外，`kotlin.native.concurrent.AtomicReference` 类可用于在冻结对象中存储指向不同冻结对象的指针并自动更新它们。

## 如何使用未发布的 Kotlin/Native 版本编译我的项目？

首先，请考虑尝试 [预览版本](eap)。

如果您需要更新的开发版本，可以从源代码构建 Kotlin/Native：克隆 [Kotlin 仓库](https://github.com/JetBrains/kotlin) 并按照 [这些步骤](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README#building-from-source) 操作。
  ```