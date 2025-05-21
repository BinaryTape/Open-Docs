---
title: 构建最终原生二进制文件
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

默认情况下，Kotlin/Native 目标会被编译成 `*.klib` 库构件，它可以被 Kotlin/Native
自身作为依赖项使用，但不能被执行或用作原生库。

要声明最终的原生二进制文件，例如可执行文件或共享库，请使用原生目标的 `binaries` 属性。
此属性表示为此目标构建的一组原生二进制文件，它是默认 `*.klib` 构件的补充，并提供了一组用于声明和配置它们的方法。

:::note
默认情况下，`kotlin-multiplatform` 插件不会创建任何生产二进制文件。默认情况下，唯一可用的二进制文件
是一个调试测试可执行文件，允许你从 `test` 编译中运行单元测试。

:::

Kotlin/Native 编译器生成的二进制文件可以包含第三方代码、数据或派生作品。
这意味着，如果你分发 Kotlin/Native 编译的最终二进制文件，
你应该始终将必要的[许可证文件](native-binary-licenses)包含到你的二进制文件分发中。

## 声明二进制文件

使用以下工厂方法来声明 `binaries` 集合的元素。

| 工厂方法      | 二进制文件类型       | 适用于                             |
|----------------|-----------------------|------------------------------------|
| `executable`   | 产品可执行文件      | 所有原生目标                       |
| `test`         | 测试可执行文件      | 所有原生目标                       |
| `sharedLib`    | 共享原生库         | 除 `WebAssembly` 之外的所有原生目标 |
| `staticLib`    | 静态原生库         | 除 `WebAssembly` 之外的所有原生目标 |
| `framework`    | Objective-C 框架    | 仅适用于 macOS、iOS、watchOS 和 tvOS 目标 |

最简单的版本不需要任何额外的参数，并为每个构建类型创建一个二进制文件。目前，
有两种构建类型可用：

* `DEBUG` – 生成带有调试信息的非优化二进制文件
* `RELEASE` – 生成没有调试信息的优化二进制文件

以下代码段创建了两个可执行二进制文件，调试版和发布版：

```kotlin
kotlin {
    linuxX64 { // 定义你的目标。
        binaries {
            executable {
                // 二进制文件配置。
            }
        }
    }
}
```

如果不需要[其他配置](multiplatform-dsl-reference#native-targets)，你可以删除 lambda 表达式：

```kotlin
binaries {
    executable()
}
```

你可以指定为哪些构建类型创建二进制文件。在以下示例中，仅创建 `debug` 可执行文件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 二进制文件配置。
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable([DEBUG]) {
        // 二进制文件配置。
    }
}
```

</TabItem>
</Tabs>

你还可以声明具有自定义名称的二进制文件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 二进制文件配置。
    }

    // 可以删除构建类型的列表
    // （在这种情况下，将使用所有可用的构建类型）。
    executable("bar") {
        // 二进制文件配置。
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 二进制文件配置。
    }

    // 可以删除构建类型的列表
    // （在这种情况下，将使用所有可用的构建类型）。
    executable('bar') {
        // 二进制文件配置。
    }
}
```

</TabItem>
</Tabs>

第一个参数设置名称前缀，它是二进制文件的默认名称。例如，对于 Windows，该代码
生成文件 `foo.exe` 和 `bar.exe`。你还可以使用名称前缀来[访问构建脚本中的二进制文件](#access-binaries)。

## 访问二进制文件

你可以访问二进制文件以[配置它们](multiplatform-dsl-reference#native-targets)或获取它们的属性（例如，输出文件的路径）。

你可以通过其唯一名称获取二进制文件。此名称基于名称前缀（如果已指定）、构建类型和
二进制文件类型，遵循以下模式：`<optional-name-prefix><build-type><binary-kind>`，例如，`releaseFramework` 或
`testDebugExecutable`。

:::note
静态库和共享库分别具有后缀 static 和 shared，例如，`fooDebugStatic` 或 `barReleaseShared`。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// 如果没有这样的二进制文件，则失败。
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果没有这样的二进制文件，则返回 null。
binaries.findByName("fooDebugExecutable")
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 如果没有这样的二进制文件，则失败。
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果没有这样的二进制文件，则返回 null。
binaries.findByName('fooDebugExecutable')
```

</TabItem>
</Tabs>

或者，你可以使用类型化的 getter 按其名称前缀和构建类型访问二进制文件。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
// 如果没有这样的二进制文件，则失败。
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果未设置名称前缀，则跳过第一个参数。
binaries.getExecutable("bar", "DEBUG") // 你也可以使用字符串作为构建类型。

// 类似的 getter 可用于其他二进制文件类型：
// getFramework、getStaticLib 和 getSharedLib。

// 如果没有这样的二进制文件，则返回 null。
binaries.findExecutable("foo", DEBUG)

// 类似的 getter 可用于其他二进制文件类型：
// findFramework、findStaticLib 和 findSharedLib。
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
// 如果没有这样的二进制文件，则失败。
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果未设置名称前缀，则跳过第一个参数。
binaries.getExecutable('bar', 'DEBUG') // 你也可以使用字符串作为构建类型。

// 类似的 getter 可用于其他二进制文件类型：
// getFramework、getStaticLib 和 getSharedLib。

// 如果没有这样的二进制文件，则返回 null。
binaries.findExecutable('foo', DEBUG)

// 类似的 getter 可用于其他二进制文件类型：
// findFramework、findStaticLib 和 findSharedLib。
```

</TabItem>
</Tabs>

## 将依赖项导出到二进制文件

在构建 Objective-C 框架或原生库（共享或静态）时，你可能不仅需要打包当前项目的类，还需要打包其依赖项的类。使用 `export` 方法指定要导出到二进制文件的依赖项。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 将被导出。
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 将不会被导出。
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 可以将不同的依赖项集导出到不同的二进制文件。
            export(project(':dependency'))
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        macosMain.dependencies {
            // 将被导出。
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 将不会被导出。
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 可以将不同的依赖项集导出到不同的二进制文件。
            export project(':dependency')
        }
    }
}
```

</TabItem>
</Tabs>

例如，你在 Kotlin 中实现了几个模块，并且想要从 Swift 访问它们。在 Swift 应用程序中使用
多个 Kotlin/Native 框架是有限制的，但你可以创建一个伞状框架并将所有这些模块导出到其中。

:::note
你只能导出相应源集的 [`api` 依赖项](gradle-configure-project#dependency-types)。

:::

当你导出依赖项时，它会将所有 API 都包含到框架 API 中。
编译器会将此依赖项中的代码添加到框架中，即使你只使用了其中的一小部分。
这会禁用对导出依赖项（以及对其依赖项）的无用代码消除。

默认情况下，导出以非传递方式工作。这意味着，如果你导出依赖于库 `bar` 的库 `foo`，
则只有 `foo` 的方法会被添加到输出框架中。

你可以使用 `transitiveExport` 选项更改此行为。如果设置为 `true`，则库 `bar` 的声明
也会被导出。

:::caution
不建议使用 `transitiveExport`：它会将导出依赖项的所有传递依赖项添加到框架中。
这可能会增加编译时间和二进制文件大小。

在大多数情况下，你不需要将所有这些依赖项添加到框架 API 中。
对于你需要直接从 Swift 或 Objective-C 代码访问的依赖项，请显式使用 `export`。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 传递性导出。
        transitiveExport = true
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
binaries {
    framework {
        export project(':dependency')
        // 传递性导出。
        transitiveExport = true
    }
}
```

</TabItem>
</Tabs>

## 构建通用框架

默认情况下，Kotlin/Native 生成的 Objective-C 框架仅支持一个平台。但是，你可以使用 [`lipo` 工具](https://llvm.org/docs/CommandGuide/llvm-lipo.html)将此类
框架合并到单个通用（胖）二进制文件中。对于 32 位和 64 位 iOS 框架来说，此操作尤其有意义。在这种情况下，你可以在 32 位和 64 位设备上使用生成的通用
框架。

:::caution
胖框架必须与初始框架具有相同的基本名称。否则，你将收到错误。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建和配置目标。
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "my_framework"
        }
    }
    // 创建一个任务来构建胖框架。
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // 胖框架必须与初始框架具有相同的基本名称。
        baseName = "my_framework"
        // 默认目标目录是 "<build directory>/fat-framework"。
        destinationDir = buildDir.resolve("fat-framework/debug")
        // 指定要合并的框架。
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建和配置目标。
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "my_framework"
            }
        }
    }
    // 创建一个构建胖框架的任务。
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // 胖框架必须与初始框架具有相同的基本名称。
        baseName = "my_framework"
        // 默认目标目录是 "<build directory>/fat-framework"。
        destinationDir = file("$buildDir/fat-framework/debug")
        // 指定要合并的框架。
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</TabItem>
</Tabs>

## 构建 XCFrameworks

所有 Kotlin Multiplatform 项目都可以使用 XCFrameworks 作为输出来收集单个包中所有目标平台和架构的逻辑。
与[通用（胖）框架](#build-universal-frameworks)不同，你无需在将应用程序发布到 App Store 之前删除所有不必要的架构。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "2.1.20"
}

kotlin {
    val xcf = XCFramework()
    val iosTargets = listOf(iosX64(), iosArm64(), iosSimulatorArm64())
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = "shared"
            xcf.add(this)
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '2.1.20'
}

kotlin {
    def xcf = new XCFrameworkConfig(project)
    def iosTargets = [iosX64(), iosArm64(), iosSimulatorArm64()]
    
    iosTargets.forEach {
        it.binaries.framework {
            baseName = 'shared'
            xcf.add(it)
        }
    }
}
```

</TabItem>
</Tabs>

当你声明 XCFrameworks 时，Kotlin Gradle 插件将注册多个 Gradle 任务：

* `assembleXCFramework`
* `assemble<Framework name>DebugXCFramework`
* `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

如果你在项目中使用 [CocoaPods 集成](native-cocoapods)，则可以使用 Kotlin
CocoaPods Gradle 插件构建 XCFrameworks。它包括以下任务，这些任务构建具有所有已注册目标的 XCFrameworks 并
生成 podspec 文件：

* `podPublishReleaseXCFramework`，它生成一个发布 XCFramework 以及一个 podspec 文件。
* `podPublishDebugXCFramework`，它生成一个调试 XCFramework 以及一个 podspec 文件。
* `podPublishXCFramework`，它生成调试和发布 XCFrameworks 以及一个 podspec 文件。

这可以帮助你通过 CocoaPods 将项目的共享部分与移动应用程序分开分发。你还可以使用 XCFrameworks
发布到私有或公共 podspec 存储库。

:::caution
如果不针对不同版本的 Kotlin 构建框架，则不建议将 Kotlin 框架发布到公共存储库。
这样做可能会导致最终用户项目中的冲突。

:::

## 自定义 Info.plist 文件

在生成框架时，Kotlin/Native 编译器会生成信息属性列表文件 `Info.plist`。
你可以使用相应的二进制文件选项自定义其属性：

| 属性                       | 二进制文件选项           |
|------------------------------|----------------------------|
| `CFBundleIdentifier`         | `bundleId`                 |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion`            | `bundleVersion`            |

要启用该功能，请传递 `-Xbinary=$option=$value` 编译器标志或为特定框架设置 `binaryOption("option", "value")`
Gradle DSL：

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```