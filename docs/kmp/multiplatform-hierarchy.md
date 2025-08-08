[//]: # (title: 分层项目结构)

Kotlin Multiplatform 项目支持分层源代码集结构。这意味着你可以安排中间源代码集的层级结构，以便在部分（而非全部）[支持的目标平台](multiplatform-dsl-reference.md#targets)之间共享公共代码。使用中间源代码集有助于你：

*   为某些目标平台提供特定 API。例如，一个库可以在一个中间源代码集中为 Kotlin/Native 目标平台添加原生特有的 API，但不会为 Kotlin/JVM 目标平台添加。
*   为某些目标平台使用特定 API。例如，你可以利用 Kotlin Multiplatform 库为构成中间源代码集的一些目标平台提供的丰富 API。
*   在你的项目中使用平台相关的库。例如，你可以从中间 iOS 源代码集访问 iOS 特有的依赖项。

Kotlin 工具链确保每个源代码集只能访问适用于该源代码集编译所面向的所有目标平台的 API。这可以防止诸如使用 Windows 特有的 API 然后将其编译到 macOS，从而导致链接错误或运行时未定义行为的情况。

设置源代码集层级结构的推荐方式是使用[默认层级结构模板](#default-hierarchy-template)。该模板涵盖了最常见的用例。如果你有一个更高级的项目，可以[手动配置](#manual-configuration)它。这是一种更低层的方法：它更灵活，但需要更多的精力和知识。

## 默认层级结构模板

Kotlin Gradle 插件有一个内置的默认[层级结构模板](#see-the-full-hierarchy-template)。它包含了一些常见用例的预定义中间源代码集。插件会根据你在项目中指定的目标平台自动设置这些源代码集。

考虑项目模块中包含共享代码的以下 `build.gradle(.kts)` 文件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()
}
```

</tab>
</tabs>

当你声明目标平台 `androidTarget`、`iosArm64` 和 `iosSimulatorArm64` 时，Kotlin Gradle 插件会从模板中找到合适的共享源代码集并为你创建它们。结果层级结构如下所示：

![使用默认层级结构模板的示例](default-hierarchy-example.svg)

彩色源代码集是实际创建并存在于项目中的，而默认模板中灰色的源代码集则被忽略。例如，Kotlin Gradle 插件没有创建 `watchos` 源代码集，因为项目中没有 watchOS 目标平台。

如果你添加一个 watchOS 目标平台，例如 `watchosArm64`，那么 `watchos` 源代码集将被创建，并且来自 `apple`、`native` 和 `common` 源代码集的代码也将被编译到 `watchosArm64`。

Kotlin Gradle 插件为所有来自默认层级结构模板的源代码集提供了类型安全的静态访问器，因此与[手动配置](#manual-configuration)相比，你无需使用 `by getting` 或 `by creating` 构造即可引用它们。

如果你尝试在共享模块的 `build.gradle(.kts)` 文件中访问源代码集而没有先声明相应的目标平台，你将看到一个警告：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // 警告：在未声明目标平台的情况下访问源代码集
        linuxX64Main { }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // 警告：在未声明目标平台的情况下访问源代码集
        linuxX64Main { }
    }
}
```

</tab>
</tabs>

> 在此示例中，`apple` 和 `native` 源代码集只编译到 `iosArm64` 和 `iosSimulatorArm64` 目标平台。尽管它们的名称如此，它们仍可访问完整的 iOS API。这对于像 `native` 这样的源代码集来说可能反直觉，因为你可能期望只有适用于所有原生目标平台的 API 才能在此源代码集中访问。此行为未来可能会改变。
>
{style="note"}

### 额外配置

你可能需要对默认层级结构模板进行调整。如果你之前使用 `dependsOn` 调用[手动](#manual-configuration)引入了中间源代码集，这将取消默认层级结构模板的使用，并导致此警告：

```none
默认的 Kotlin 层级结构模板未应用于 '<project-name>'：
已为以下源代码集配置了显式的 .dependsOn() 依赖关系：
[<... names of the source sets with manually configured dependsOn-edges...>]

考虑移除 dependsOn 调用或通过添加
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
到你的 gradle.properties 文件中来禁用默认模板

了解更多关于层级结构模板的信息：https://kotl.in/hierarchy-template
```

要解决此问题，请执行以下任一操作来配置你的项目：

*   [使用默认层级结构模板替换你的手动配置](#replacing-a-manual-configuration)
*   [在默认层级结构模板中创建额外源代码集](#creating-additional-source-sets)
*   [修改默认层级结构模板创建的源代码集](#modifying-source-sets)

#### 替换手动配置

**情况**。你所有的中间源代码集目前都已包含在默认层级结构模板中。

**解决方案**。在共享模块的 `build.gradle(.kts)` 文件中，移除所有手动 `dependsOn()` 调用以及使用 `by creating` 构造的源代码集。要查看所有默认源代码集的列表，请参阅[完整层级结构模板](#see-the-full-hierarchy-template)。

#### 创建额外源代码集

**情况**。你想添加默认层级结构模板尚未提供的源代码集，例如，一个介于 macOS 和 JVM 目标平台之间的源代码集。

**解决方案**：

1.  在共享模块的 `build.gradle(.kts)` 文件中，通过显式调用 `applyDefaultHierarchyTemplate()` 来重新应用模板。
2.  使用 `dependsOn()` [手动](#manual-configuration)配置额外源代码集：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次应用默认层级结构。例如，它将创建 iosMain 源代码集：
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 创建一个额外的 jvmAndMacos 源代码集：
            val jvmAndMacos by creating {
                dependsOn(commonMain.get())
            }
    
            macosArm64Main.get().dependsOn(jvmAndMacos)
            jvmMain.get().dependsOn(jvmAndMacos)
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次应用默认层级结构。例如，它将创建 iosMain 源代码集：
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 创建一个额外的 jvmAndMacos 源代码集：
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

    </tab>
    </tabs>

#### 修改源代码集

**情况**。你的项目中已经存在与模板生成的源代码集名称完全相同，但共享给不同目标平台集合的源代码集。例如，一个 `nativeMain` 源代码集仅在桌面特有目标平台之间共享：`linuxX64`、`mingwX64` 和 `macosX64`。

**解决方案**。目前无法修改模板源代码集之间默认的 `dependsOn` 依赖关系。同样重要的是，源代码集（例如 `nativeMain`）的实现和含义在所有项目中都应保持一致。

但是，你仍然可以执行以下任一操作：

*   查找适用于你目的的不同源代码集，无论是在默认层级结构模板中还是已手动创建的源代码集。
*   通过在 `gradle.properties` 文件中添加 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 来完全退出该模板，并手动配置所有源代码集。

> 我们目前正在开发一个 API，用于创建你自己的层级结构模板。这对于其层级结构配置与默认模板显著不同的项目将非常有用。
>
> 这个 API 尚未准备就绪，但如果你渴望尝试，可以查看 `applyHierarchyTemplate {}` 代码块和 `KotlinHierarchyTemplate.default` 的声明作为示例。请记住，这个 API 仍在开发中。它可能尚未经过测试，并且在未来的版本中可能会有所改变。
>
{style="tip"}

#### 查看完整层级结构模板 {initial-collapse-state="collapsed" collapsible="true"}

当你声明项目编译所面向的目标平台时，插件会根据模板中指定的目标平台选择共享源代码集，并在你的项目中创建它们。

![默认层级结构模板](full-template-hierarchy.svg)

> 本示例仅展示项目的生产部分，省略了 `Main` 后缀（例如，使用 `common` 而不是 `commonMain`）。然而，对于 `*Test` 源代码集，一切都是相同的。
>
{style="tip"}

## 手动配置

你可以手动在源代码集结构中引入一个中间源代码集。它将为多个目标平台保留共享代码。

例如，如果你想在原生 Linux、Windows 和 macOS 目标平台（`linuxX64`、`mingwX64` 和 `macosX64`）之间共享代码，可以执行以下操作：

1.  在共享模块的 `build.gradle(.kts)` 文件中，添加中间源代码集 `desktopMain`，它将为这些目标平台保留共享逻辑。
2.  使用 `dependsOn` 依赖关系来设置源代码集层级结构。将 `commonMain` 与 `desktopMain` 连接起来，然后将 `desktopMain` 与每个目标源代码集连接起来：

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">
    
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
    
    </tab>
    <tab title="Groovy" group-key="groovy">
    
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
    
    </tab>
    </tabs>

结果层级结构将如下所示：

![手动配置的层级结构](manual-hierarchical-structure.svg)

你可以为以下目标平台组合共享源代码集：

*   JVM 或 Android + JS + Native
*   JVM 或 Android + Native
*   JS + Native
*   JVM 或 Android + JS
*   Native

Kotlin 目前不支持为以下组合共享源代码集：

*   多个 JVM 目标平台
*   JVM + Android 目标平台
*   多个 JS 目标平台

如果你需要从共享原生源代码集访问平台特有的 API，IntelliJ IDEA 将帮助你检测可在共享原生代码中使用的公共声明。对于其他情况，请使用 Kotlin 的[预期与实际声明](multiplatform-expect-actual.md)机制。