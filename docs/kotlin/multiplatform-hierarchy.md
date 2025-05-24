---
title: 分层项目结构
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Kotlin Multiplatform (KMP) 项目支持分层源码集结构。
这意味着你可以安排一个中间源码集的分层结构，以便在部分（而非全部）[支持的目标](multiplatform-dsl-reference#targets)之间共享通用代码。使用中间源码集有助于你：

* 为某些目标提供特定的 API。例如，一个库可以在 Kotlin/Native 目标的中间源码集中添加 native-specific APIs，但不在 Kotlin/JVM 目标中添加。
* 为某些目标使用特定的 API。例如，你可以从 Kotlin Multiplatform 库为构成中间源码集的某些目标提供的丰富 API 中获益。
* 在你的项目中使用平台相关的库。例如，你可以从中间 iOS 源码集中访问 iOS 相关的依赖项。

Kotlin 工具链确保每个源码集只能访问可用于该源码集编译的所有目标的 API。这可以防止诸如使用 Windows 特定的 API 然后将其编译为 macOS 之类的情况，从而导致链接错误或运行时未定义的行为。

设置源码集分层结构的推荐方法是使用[默认分层结构模板](#default-hierarchy-template)。该模板涵盖了最常见的用例。如果你有一个更高级的项目，你可以[手动配置它](#manual-configuration)。这是一种更底层的方案：它更灵活，但需要更多的努力和知识。

## 默认分层结构模板

Kotlin Gradle 插件具有一个内置的默认[分层结构模板](#see-the-full-hierarchy-template)。它包含一些常用用例的预定义中间源码集。插件会根据项目中指定的目标自动设置这些源码集。

考虑以下包含共享代码的项目模块中的 `build.gradle(.kts)` 文件：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

当你在代码中声明目标 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 时，Kotlin Gradle 插件会从模板中找到合适的共享源码集并为你创建它们。 结果得到的分层结构如下所示：

<img src="/img/default-hierarchy-example.svg" alt="使用默认分层结构模板的示例" style={{verticalAlign: 'middle'}}/>

有颜色的源码集是实际创建的并存在于项目中的，而默认模板中的灰色源码集则被忽略。 例如，Kotlin Gradle 插件尚未创建 `watchos` 源码集，因为项目中没有 watchOS 目标。

如果你添加一个 watchOS 目标，例如 `watchosArm64`，则会创建 `watchos` 源码集，并且来自 `apple`、`native` 和 `common` 源码集的代码也会被编译为 `watchosArm64`。

Kotlin Gradle 插件为默认分层结构模板中的所有源码集提供类型安全和静态访问器，因此你可以引用它们，而无需像[手动配置](#manual-configuration)那样使用 `by getting` 或 `by creating` 构造。

如果你尝试在共享模块的 `build.gradle(.kts)` 文件中访问源码集而不先声明相应的目标，你将看到一个警告：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        // Warning: accessing source set without declaring the target
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

:::note
在此示例中，`apple` 和 `native` 源码集仅编译为 `iosArm64` 和 `iosSimulatorArm64` 目标。
尽管它们有名称，但它们可以访问完整的 iOS API。
对于像 `native` 这样的源码集来说，这可能违反直觉，因为你可能期望只有所有 native 目标上可用的 API 才能在此源码集中访问。此行为将来可能会更改。

:::

### 附加配置

你可能需要对默认分层结构模板进行调整。 如果你之前通过 `dependsOn` 调用[手动](#manual-configuration)引入了中间源，它将取消使用默认分层结构模板并导致以下警告：

```none
The Default Kotlin Hierarchy Template was not applied to '<project-name>':
Explicit .dependsOn() edges were configured for the following source sets:
[<... names of the source sets with manually configured dependsOn-edges...>]

Consider removing dependsOn-calls or disabling the default template by adding
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
to your gradle.properties

Learn more about hierarchy templates: https://kotl.in/hierarchy-template
```

要解决此问题，请通过执行以下操作之一来配置你的项目：

* [使用默认分层结构模板替换你的手动配置](#replacing-a-manual-configuration)
* [在默认分层结构模板中创建其他源码集](#creating-additional-source-sets)
* [修改由默认分层结构模板创建的源码集](#modifying-source-sets)

#### 替换手动配置

**情况**。 你的所有中间源码集当前都包含在默认分层结构模板中。

**解决方案**。 在共享模块的 `build.gradle(.kts)` 文件中，删除所有手动 `dependsOn()` 调用和带有 `by creating` 构造的源码集。 要检查所有默认源码集的列表，请参见[完整的分层结构模板](#see-the-full-hierarchy-template)。

#### 创建其他源码集

**情况**。 你想要添加默认分层结构模板尚未提供的源码集，例如，在 macOS 和 JVM 目标之间的一个源码集。

**解决方案**：

1. 在共享模块的 `build.gradle(.kts)` 文件中，通过显式调用 `applyDefaultHierarchyTemplate()` 重新应用该模板。
2. 使用 `dependsOn()` [手动](#manual-configuration)配置其他源码集：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </TabItem>
    <TabItem value="groovy" label="Groovy" default>

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // Apply the default hierarchy again. It'll create, for example, the iosMain source set:
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // Create an additional jvmAndMacos source set:
            jvmAndMacos {
                dependsOn(commonMain.get())
            }
            macosArm64Main {
                dependsOn(jvmAndMacos.get())
            }
            jvmMain {
                dependsOn(jvmAndMacos.get())
            }
        } 
    }
    ```

    </TabItem>
    </Tabs>

#### 修改源码集

**情况**。 你已经有了与模板生成的源码集具有完全相同名称的源码集，但在你的项目中，这些源码集在不同的目标集之间共享。 例如，`nativeMain` 源码集仅在桌面特定的目标之间共享：`linuxX64`、`mingwX64` 和 `macosX64`。

**解决方案**。 目前无法修改模板的源码集之间的默认 `dependsOn` 关系。
同样重要的是，源码集的实现和含义（例如，`nativeMain`）在所有项目中都是相同的。

但是，你仍然可以执行以下操作之一：

* 在默认分层结构模板或手动创建的模板中找到适合你目的的不同源码集。
* 通过将 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 添加到你的 `gradle.properties` 文件中来完全退出该模板，并手动配置所有源码集。

:::tip
我们目前正在开发一个 API 来创建你自己的分层结构模板。 这对于其分层结构配置与默认模板差异很大的项目非常有用。

此 API 尚未准备好，但如果你急于尝试，请查看 `applyHierarchyTemplate {}` 块和 `KotlinHierarchyTemplate.default` 的声明作为示例。
请记住，此 API 仍在开发中。 它可能未经测试，并且可能会在以后的版本中更改。

:::

#### 查看完整的分层结构模板

当你声明项目编译到的目标时，插件会根据模板中指定的目标选择共享源码集并在你的项目中创建它们。

<img src="/img/full-template-hierarchy.svg" alt="默认分层结构模板" style={{verticalAlign: 'middle'}}/>
:::tip
此示例仅显示项目的生产部分，省略了 `Main` 后缀（例如，使用 `common` 而不是 `commonMain`）。 但是，对于 `*Test` 源也是如此。

:::

## 手动配置

你可以在源码集结构中手动引入中间源。
它将保存多个目标的共享代码。

例如，如果你想在 native Linux、Windows 和 macOS 目标（`linuxX64`、`mingwX64` 和 `macosX64`）之间共享代码，请执行以下操作：

1. 在共享模块的 `build.gradle(.kts)` 文件中，添加中间源码集 `desktopMain`，该源码集保存这些目标的共享逻辑。
2. 使用 `dependsOn` 关系，设置源码集分层结构。 将 `commonMain` 与 `desktopMain` 连接，然后将 `desktopMain` 与每个目标源码集连接：

    <Tabs groupId="build-script">
    <TabItem value="kotlin" label="Kotlin" default>
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val desktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(desktopMain)
            mingwX64Main.get().dependsOn(desktopMain)
            macosX64Main.get().dependsOn(desktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem value="groovy" label="Groovy" default>
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            desktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(desktopMain)
            }
            mingwX64Main {
                dependsOn(desktopMain)
            }
            macosX64Main {
                dependsOn(desktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

结果得到的分层结构如下所示：

<img src="/img/manual-hierarchical-structure.svg" alt="手动配置的分层结构" style={{verticalAlign: 'middle'}}/>

你可以为以下目标组合使用共享源码集：

* JVM 或 Android + JS + Native
* JVM 或 Android + Native
* JS + Native
* JVM 或 Android + JS
* Native

Kotlin 目前不支持为以下组合共享源码集：

* 多个 JVM 目标
* JVM + Android 目标
* 多个 JS 目标

如果你需要从共享的 native 源码集访问平台特定的 API，IntelliJ IDEA 将帮助你检测可在共享的 native 代码中使用的通用声明。
对于其他情况，请使用 Kotlin 的[期望和实际声明](multiplatform-expect-actual)机制。