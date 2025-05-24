---
title: "构建最终原生二进制文件 (实验性 DSL)"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::note
下面描述的新 DSL 处于 [实验性](components-stability) 阶段。它可能随时更改。
我们鼓励您将其用于评估目的。

如果新的 DSL 不适合您，请参阅[之前构建 native 二进制文件的方法](multiplatform-build-native-binaries)。

[Kotlin/Native targets](multiplatform-dsl-reference#native-targets) 被编译为 `*.klib` 库产物，
它可以被 Kotlin/Native 本身作为依赖项使用，但不能用作 native 库。
 
要声明最终的 native 二进制文件，请使用带有 `kotlinArtifacts` DSL 的新二进制文件格式。除了默认的 `*.klib` 产物之外，它还表示为此目标构建的 native 二进制文件的集合，并提供了一组用于声明和配置它们的方法。
 
默认情况下，`kotlin-multiplatform` 插件不会创建任何生产二进制文件。默认情况下，唯一可用的二进制文件是一个 debug 测试可执行文件，可让您从 `test` 编译中运行单元测试。

:::

Kotlin artifact DSL 可以帮助您解决一个常见问题：当您需要从您的应用程序访问多个 Kotlin 模块时。
由于对多个 Kotlin/Native 产物的使用受到限制，您可以使用新的 DSL 将多个 Kotlin 模块导出到单个
产物中。

## 声明二进制文件

`kotlinArtifacts {}` 是 Gradle 构建脚本中用于 artifact 配置的顶层块。使用
以下类型的二进制文件来声明 `kotlinArtifacts {}` DSL 的元素：

| 工厂方法（Factory method） | 二进制文件种类（Binary kind）                                                                               | 适用于（Available for）                                |
|----------------|-------------------------------------------------------------------------------------------|----------------------------------------------|
| `sharedLib`    | [共享 native 库（Shared native library）](native-faq#how-do-i-create-a-shared-library)                   | 除 `WebAssembly` 之外的所有 native targets |
| `staticLib`    | [静态 native 库（Static native library）](native-faq#how-do-i-create-a-static-library-or-an-object-file) | 除 `WebAssembly` 之外的所有 native targets |
| `framework`    | Objective-C 框架（Objective-C framework）                                                                     | 仅适用于 macOS、iOS、watchOS 和 tvOS targets   |
| `fatFramework` | 通用 fat 框架（Universal fat framework）                                                                   | 仅适用于 macOS、iOS、watchOS 和 tvOS targets   |
| `XCFramework`  | XCFramework 框架（XCFramework framework）                                                                     | 仅适用于 macOS、iOS、watchOS 和 tvOS targets   |

在 `kotlinArtifacts` 元素中，您可以编写以下块：

* [Native.Library](#library)
* [Native.Framework](#framework)
* [Native.FatFramework](#fat-frameworks)
* [Native.XCFramework](#xcframeworks)

最简单的版本需要所选构建类型的 `target`（或 `targets`）参数。目前，
有两种构建类型可用：

* `DEBUG` – 生成带有 debug 信息的非优化二进制文件
* `RELEASE` – 生成不带 debug 信息的优化二进制文件

在 `modes` 参数中，您可以指定要为其创建二进制文件的构建类型。默认值包括 `DEBUG` 和 `RELEASE` 可执行二进制文件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library {
        target = iosX64 // Define your target instead
        modes(DEBUG, RELEASE)
        // Binary configuration
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library {
        target = iosX64 // Define your target instead
        modes(DEBUG, RELEASE)
        // Binary configuration
    }
}
```

</TabItem>
</Tabs>

您还可以声明具有自定义名称的二进制文件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("mylib") {
        // Binary configuration
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("mylib") {
        // Binary configuration
    }
}
```

</TabItem>
</Tabs>

该参数设置一个名称前缀，它是二进制文件的默认名称。例如，对于 Windows，该代码
生成 `mylib.dll` 文件。

## 配置二进制文件

对于二进制文件配置，以下通用参数可用：

| **名称（Name）**        | **描述（Description）**                                                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `isStatic`      | 可选的链接类型，用于定义库的类型。 默认情况下，它是 `false`，库是动态的。                                              |
| `modes`         | 可选的构建类型，`DEBUG` 和 `RELEASE`。                                                                                                           |
| `kotlinOptions` | 应用于编译的可选编译器选项。 请参阅可用[编译器选项](gradle-compiler-options)的列表。                        |
| `addModule`     | 除了当前模块，您可以将其他模块添加到结果 artifact 中。                                                                |
| `setModules`    | 您可以覆盖将添加到结果 artifact 中的所有模块的列表。                                                                 |
| `target`        | 声明项目的特定 target。 可用 target 的名称在[Targets](multiplatform-dsl-reference#targets) 部分列出。 |

### 库和框架（Libraries and frameworks）

在构建 Objective-C 框架或 native 库（共享或静态）时，您可能不仅需要打包当前项目的类，
还需要将任何其他 multiplatform 模块的类打包到单个实体中，并将所有这些
模块导出到其中。

#### 库（Library）

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Library("myslib") {
        target = linuxX64
        isStatic = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Library("myslib") {
        target = linuxX64
        it.static = false
        modes(DEBUG)
        addModule(project(":lib"))
        kotlinOptions {
            verbose = false
            freeCompilerArgs += "-Xmen=pool"
        }
    }
}
```

</TabItem>
</Tabs>

注册的 Gradle 任务是 `assembleMyslibSharedLibrary`，它将所有类型的已注册 "myslib" 组装到动态库中。

#### 框架（Framework）

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        isStatic = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.Framework("myframe") {
        modes(DEBUG, RELEASE)
        target = iosArm64
        it.static = false
        kotlinOptions {
            verbose = false
        }
    }
}
```

</TabItem>
</Tabs>

注册的 Gradle 任务是 `assembleMyframeFramework`，它将所有类型的已注册 "myframe" 框架组装起来。

:::tip
如果由于某种原因，新的 DSL 不适合您，请尝试[之前的方法](multiplatform-build-native-binaries#export-dependencies-to-binaries)
将依赖项导出到二进制文件。

:::

### Fat 框架（Fat frameworks）

默认情况下，Kotlin/Native 生成的 Objective-C 框架仅支持一个平台。但是，您可以将这些
框架合并为单个通用（fat）二进制文件。这对于 32 位和 64 位 iOS 框架尤其有意义。
在这种情况下，您可以在 32 位和 64 位设备上使用生成的通用框架。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.FatFramework("myfatframe") {
        targets(iosX32, iosX64)
        kotlinOptions {
            suppressWarnings = false
        }
    }
}
```

</TabItem>
</Tabs>

注册的 Gradle 任务是 `assembleMyfatframeFatFramework`，它将所有类型的已注册 "myfatframe" fat 框架组装起来。

:::tip
如果由于某种原因，新的 DSL 不适合您，请尝试[之前的方法](multiplatform-build-native-binaries#build-universal-frameworks)
构建 fat 框架。

:::

### XCFrameworks

所有 Kotlin Multiplatform 项目都可以使用 XCFrameworks 作为输出，以在单个捆绑包中收集所有目标平台和
架构的逻辑。与[通用（fat）框架](#fat-frameworks)不同，您无需
在将应用程序发布到 App Store 之前删除所有不必要的架构。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlinArtifacts {
    Native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"),
            project(":lib")
        )
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlinArtifacts {
    it.native.XCFramework("sdk") {
        targets(iosX64, iosArm64, iosSimulatorArm64)
        setModules(
            project(":shared"), 
            project(":lib")
        )
    }
}
```

</TabItem>
</Tabs>

注册的 Gradle 任务是 `assembleSdkXCFramework`，它将所有类型的已注册 "sdk" XCFrameworks 组装起来。

:::tip
如果由于某种原因，新的 DSL 不适合您，请尝试[之前的方法](multiplatform-build-native-binaries#build-xcframeworks)
构建 XCFrameworks。

:::