[//]: # (title: 构建最终的原生二进制文件)

默认情况下，Kotlin/Native 目标会编译为 `*.klib` 库 artifact，该 artifact 可被 Kotlin/Native 自身作为依赖项使用，但无法直接执行或作为原生库使用。

要声明最终的原生二进制文件，例如可执行文件或共享库，请使用原生目标的 `binaries` 属性。此属性表示为此目标构建的原生二进制文件集合（除了默认的 `*.klib` artifact 外），并提供了一组用于声明和配置它们的方法。

> `kotlin-multiplatform` 插件默认不创建任何生产二进制文件。默认唯一可用的二进制文件是一个调试测试可执行文件，它允许你运行 `test` 编译中的单元测试。
>
{style="note"}

Kotlin/Native 编译器生成的二进制文件可以包含第三方代码、数据或衍生作品。这意味着如果你分发 Kotlin/Native 编译的最终二进制文件，应始终将必要的[许可证文件](https://kotlinlang.org/docs/native-binary-licenses.html)包含到你的二进制分发中。

## 声明二进制文件

使用以下工厂方法声明 `binaries` 集合的元素。

| 工厂方法 | 二进制文件类型 | 可用于 |
|---|---|---|
| `executable` | 产品可执行文件 | 所有原生目标 |
| `test` | 测试可执行文件 | 所有原生目标 |
| `sharedLib` | 共享原生库 | 所有原生目标 |
| `staticLib` | 静态原生库 | 所有原生目标 |
| `framework` | Objective-C framework | 仅限 macOS、iOS、watchOS 和 tvOS 目标 |

最简单的版本不需要任何额外形参，并为每种构建类型创建一个二进制文件。目前，有两种构建类型可用：

*   `DEBUG` – 生成未优化且包含额外元数据的二进制文件，这在配合[调试器工具](https://kotlinlang.org/docs/native-debugging.html)工作时很有帮助
*   `RELEASE` – 生成不带调试信息的优化二进制文件

以下代码片段创建了两个可执行二进制文件：调试和发布版本：

```kotlin
kotlin {
    linuxX64 { // 请改为定义你的目标。
        binaries {
            executable {
                // 二进制文件配置。
            }
        }
    }
}
```

如果无需[额外配置](multiplatform-dsl-reference.md#native-targets)，你可以省略 lambda 表达式：

```kotlin
binaries {
    executable()
}
```

你可以指定为哪些构建类型创建二进制文件。在以下示例中，只创建 `debug` 可执行文件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable(listOf(DEBUG)) {
        // 二进制文件配置。
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable([DEBUG]) {
        // 二进制文件配置。
    }
}
```

</tab>
</tabs>

你还可以声明具有自定义名称的二进制文件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    executable("foo", listOf(DEBUG)) {
        // 二进制文件配置。
    }

    // 可以省略构建类型列表
    // （在这种情况下，将使用所有可用的构建类型）。
    executable("bar") {
        // 二进制文件配置。
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    executable('foo', [DEBUG]) {
        // 二进制文件配置。
    }

    // 可以省略构建类型列表
    // （在这种情况下，将使用所有可用的构建类型）。
    executable('bar') {
        // 二进制文件配置。
    }
}
```

</tab>
</tabs>

第一个实参设置一个名称前缀，这是二进制文件的默认名称。例如，对于 Windows，该代码将生成 `foo.exe` 和 `bar.exe` 文件。你还可以使用名称前缀来[访问构建脚本中的二进制文件](#access-binaries)。

## 访问二进制文件

你可以访问二进制文件来[配置它们](multiplatform-dsl-reference.md#native-targets)或获取它们的属性（例如，输出文件路径）。

你可以通过其唯一名称获取二进制文件。此名称基于名称前缀（如果已指定）、构建类型和二进制文件类型，遵循以下模式：`<optional-name-prefix><build-type><binary-kind>`，例如 `releaseFramework` 或 `testDebugExecutable`。

> 静态库和共享库分别具有 `static` 和 `shared` 后缀，例如 `fooDebugStatic` 或 `barReleaseShared`。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果没有此类二进制文件，则失败。
binaries["fooDebugExecutable"]
binaries.getByName("fooDebugExecutable")

// 如果没有此类二进制文件，则返回 null。
binaries.findByName("fooDebugExecutable")
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果没有此类二进制文件，则失败。
binaries['fooDebugExecutable']
binaries.fooDebugExecutable
binaries.getByName('fooDebugExecutable')

// 如果没有此类二进制文件，则返回 null。
binaries.findByName('fooDebugExecutable')
```

</tab>
</tabs>

或者，你可以使用类型化 getter 通过其名称前缀和构建类型访问二进制文件。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// 如果没有此类二进制文件，则失败。
binaries.getExecutable("foo", DEBUG)
binaries.getExecutable(DEBUG)          // 如果未设置名称前缀，请跳过第一个实参。
binaries.getExecutable("bar", "DEBUG") // 你也可以使用字符串作为构建类型。

// 类似的 getter 可用于其他二进制文件类型：
// getFramework, getStaticLib 和 getSharedLib。

// 如果没有此类二进制文件，则返回 null。
binaries.findExecutable("foo", DEBUG)

// 类似的 getter 可用于其他二进制文件类型：
// findFramework, findStaticLib 和 findSharedLib。
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// 如果没有此类二进制文件，则失败。
binaries.getExecutable('foo', DEBUG)
binaries.getExecutable(DEBUG)          // 如果未设置名称前缀，请跳过第一个实参。
binaries.getExecutable('bar', 'DEBUG') // 你也可以使用字符串作为构建类型。

// 类似的 getter 可用于其他二进制文件类型：
// getFramework, getStaticLib 和 getSharedLib。

// 如果没有此类二进制文件，则返回 null。
binaries.findExecutable('foo', DEBUG)

// 类似的 getter 可用于其他二进制文件类型：
// findFramework, findStaticLib 和 findSharedLib。
```

</tab>
</tabs>

## 将依赖项导出到二进制文件

构建 Objective-C framework 或原生库（共享或静态）时，你可能需要打包的不仅是当前项目的类，还包括其依赖项的类。使用 `export` 方法指定要导出到二进制文件的依赖项。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // 将被导出。
            api(project(":dependency"))
            api("org.example:exported-library:1.0")
            // 不会被导出。
            api("org.example:not-exported-library:1.0")
        }
    }
    macosX64("macos").binaries {
        framework {
            export(project(":dependency"))
            export("org.example:exported-library:1.0")
        }
        sharedLib {
            // 可以将不同组的依赖项导出到不同的二进制文件。
            export(project(':dependency'))
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        macosMain.dependencies {
            // 将被导出。
            api project(':dependency')
            api 'org.example:exported-library:1.0'
            // 不会被导出。
            api 'org.example:not-exported-library:1.0'
        }
    }
    macosX64("macos").binaries {
        framework {
            export project(':dependency')
            export 'org.example:exported-library:1.0'
        }
        sharedLib {
            // 可以将不同组的依赖项导出到不同的二进制文件。
            export project(':dependency')
        }
    }
}
```

</tab>
</tabs>

例如，你在 Kotlin 中实现了多个模块并希望从 Swift 访问它们。在 Swift 应用程序中使用多个 Kotlin/Native framework 是有限制的，但你可以创建一个伞形 framework 并将所有这些模块导出到其中。

> 你只能导出相应源代码集的 [`api` 依赖项](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)。
>
{style="note"}

导出依赖项时，它会将其所有 API 包含到 framework API 中。编译器会将此依赖项的代码添加到 framework 中，即使你只使用了其中一小部分。这会禁用导出依赖项（以及在某种程度上，其依赖项）的无用代码消除。

默认情况下，导出是非传递性工作的。这意味着如果你导出依赖于库 `bar` 的库 `foo`，则只有 `foo` 的方法会被添加到输出 framework 中。

你可以使用 `transitiveExport` 选项更改此行为。如果设置为 `true`，则库 `bar` 的声明也会被导出。

> 不建议使用 `transitiveExport`：它会将导出依赖项的所有传递性依赖项添加到 framework 中。这可能会增加编译时间和二进制文件大小。
>
> 在大多数情况下，你不需要将所有这些依赖项添加到 framework API 中。对于你需要从 Swift 或 Objective-C 代码中直接访问的依赖项，请显式使用 `export`。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
binaries {
    framework {
        export(project(":dependency"))
        // 传递性导出。
        transitiveExport = true
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
binaries {
    framework {
        export project(':dependency')
        // 传递性导出。
        transitiveExport = true
    }
}
```

</tab>
</tabs>

## 构建通用 framework

默认情况下，Kotlin/Native 生成的 Objective-C framework 仅支持一个平台。但是，你可以使用 [`lipo` 工具](https://llvm.org/docs/CommandGuide/llvm-lipo.html)将此类 framework 合并成一个单一的通用（fat）二进制文件。此操作对于 32 位和 64 位 iOS framework 尤其有意义。在这种情况下，你可以在 32 位和 64 位设备上使用生成的通用 framework。

> fat framework 必须与初始 framework 具有相同的基本名称。否则，你将收到错误。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建和配置目标。
    val watchos32 = watchosArm32("watchos32")
    val watchos64 = watchosArm64("watchos64")
    configure(listOf(watchos32, watchos64)) {
        binaries.framework {
            baseName = "MyFramework"
        }
    }
    // 创建一个构建 fat framework 的任务。
    tasks.register<FatFrameworkTask>("debugFatFramework") {
        // fat framework 必须与初始 framework 具有相同的基本名称。
        baseName = "MyFramework"
        // 默认目标目录是 "<build directory>/fat-framework"。
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 指定要合并的 framework。
        from(
            watchos32.binaries.getFramework("DEBUG"),
            watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.FatFrameworkTask

kotlin {
    // 创建和配置目标。
    targets {
        watchosArm32("watchos32")
        watchosArm64("watchos64")
        configure([watchos32, watchos64]) {
            binaries.framework {
                baseName = "MyFramework"
            }
        }
    }
    // 创建一个构建 fat framework 的任务。
    tasks.register("debugFatFramework", FatFrameworkTask) {
        // fat framework 必须与初始 framework 具有相同的基本名称。
        baseName = "MyFramework"
        // 默认目标目录是 "<build directory>/fat-framework"。
        destinationDirProperty.set(layout.buildDirectory.dir("fat-framework/debug"))
        // 指定要合并的 framework。
        from(
            targets.watchos32.binaries.getFramework("DEBUG"),
            targets.watchos64.binaries.getFramework("DEBUG")
        )
    }
}
```

</tab>
</tabs>

## 构建 XCFramework

所有 Kotlin Multiplatform 项目都可以使用 XCFramework 作为输出，将所有目标平台和架构的逻辑收集到一个单一包中。与[通用（fat）framework](#build-universal-frameworks) 不同，你无需在将应用程序发布到 App Store 之前移除所有不必要的架构。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFramework

plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
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

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.plugin.mpp.apple.XCFrameworkConfig

plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
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

</tab>
</tabs>

当你声明 XCFramework 时，Kotlin Gradle 插件将注册多个 Gradle 任务：

*   `assembleXCFramework`
*   `assemble<Framework name>DebugXCFramework`
*   `assemble<Framework name>ReleaseXCFramework`

<anchor name="build-frameworks"/>

如果你正在项目中利用 [CocoaPods 集成](multiplatform-cocoapods-overview.md)，可以使用 Kotlin CocoaPods Gradle 插件构建 XCFramework。它包含以下任务，这些任务会构建包含所有注册目标的 XCFramework 并生成 podspec 文件：

*   `podPublishReleaseXCFramework`，生成发布 XCFramework 连同 podspec 文件。
*   `podPublishDebugXCFramework`，生成调试 XCFramework 连同 podspec 文件。
*   `podPublishXCFramework`，生成调试和发布 XCFramework 连同 podspec 文件。

这可以帮助你通过 CocoaPods 将项目的共享部分与移动应用分开分发。你还可以使用 XCFramework 发布到私有或公共 podspec 版本库。

> 如果 Kotlin framework 是为不同版本的 Kotlin 构建的，则不建议将其发布到公共版本库。这样做可能导致最终用户项目中出现冲突。
>
{style="warning"}

## 自定义 Info.plist 文件

生成 framework 时，Kotlin/Native 编译器会生成信息属性列表文件 `Info.plist`。你可以使用相应的二进制选项自定义其属性：

| 属性 | 二进制选项 |
|---|---|
| `CFBundleIdentifier` | `bundleId` |
| `CFBundleShortVersionString` | `bundleShortVersionString` |
| `CFBundleVersion` | `bundleVersion` |

要启用此特性，请传递 `-Xbinary=$option=$value` 编译器标志或为特定 framework 设置 `binaryOption("option", "value")` Gradle DSL：

```kotlin
binaries {
    framework {
        binaryOption("bundleId", "com.example.app")
        binaryOption("bundleVersion", "2")
    }
}
```