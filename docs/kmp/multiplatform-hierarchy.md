[//]: # (title: 分层项目结构)

Kotlin 多平台项目支持分层源代码集结构。这意味着你可以安排中间源代码集的层级结构，以便在部分（而非全部）[支持的目标](multiplatform-dsl-reference.md#targets)之间共享公共代码。使用中间源代码集有助于你：

*   为某些目标提供特定的 API。例如，一个库可以在一个中间源代码集中为 Kotlin/Native 目标添加原生特有的 API，而不是为 Kotlin/JVM 目标添加。
*   为某些目标消费特定的 API。例如，你可以受益于 Kotlin 多平台库为构成中间源代码集的一些目标提供的丰富 API。
*   在你的项目中使用平台相关的库。例如，你可以从中间 iOS 源代码集访问 iOS 特有的依赖项。

Kotlin 工具链确保每个源代码集只能访问对其编译到的所有目标都可用的 API。这可以防止诸如使用 Windows 特有的 API 然后将其编译到 macOS，从而导致链接错误或运行时未定义行为的情况。

设置源代码集层级结构推荐的方式是使用[默认分层模板](#default-hierarchy-template)。该模板涵盖了最常见的用例。如果你有一个更高级的项目，可以[手动配置](#manual-configuration)。这是一种更底层的方法：它更灵活，但需要更多的精力和知识。

## 默认分层模板

Kotlin Gradle 插件有一个内置的默认[分层模板](#see-the-full-hierarchy-template)。它包含针对一些常见用例的预定义中间源代码集。该插件会根据你的项目中指定的目标自动设置这些源代码集。

考虑以下项目中包含共享代码的模块中的 `build.gradle(.kts)` 文件：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()
}
```

</TabItem>
</Tabs>

当你在代码中声明 `android`、`iosArm64` 和 `iosSimulatorArm64` 目标时，Kotlin Gradle 插件会从模板中查找合适的共享源代码集并为你创建它们。结果层级结构如下所示：

![使用默认分层模板的示例](default-hierarchy-example.svg)

彩色源代码集是实际创建并存在于项目中的，而默认模板中灰色的源代码集则被忽略。例如，Kotlin Gradle 插件没有创建 `watchos` 源代码集，因为项目中没有 watchOS 目标。

如果你添加一个 watchOS 目标，例如 `watchosArm64`，那么 `watchos` 源代码集将被创建，并且 `apple`、`native` 和 `common` 源代码集中的代码也将编译到 `watchosArm64`。

Kotlin Gradle 插件为默认分层模板中的所有源代码集提供了类型安全和静态访问器，因此与[手动配置](#manual-configuration)相比，你无需使用 `by getting` 或 `by creating` 构造即可引用它们。

如果你在共享模块的 `build.gradle(.kts)` 文件中尝试访问源代码集而未首先声明相应目标，你将看到一个警告：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        // 警告：未声明目标就访问源代码集
        linuxX64Main { }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        iosMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        // 警告：未声明目标就访问源代码集
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> 在此示例中，`apple` 和 `native` 源代码集仅编译到 `iosArm64` 和 `iosSimulatorArm64` 目标。尽管它们的名称如此，但它们可以访问完整的 iOS API。对于像 `native` 这样的源代码集来说，这可能违反直觉，因为你可能会期望只有适用于所有原生目标的 API 才能在此源代码集中访问。这种行为将来可能会改变。
>
{style="note"}

### 额外配置

你可能需要对默认分层模板进行调整。如果你之前通过 `dependsOn` 调用[手动](#manual-configuration)引入了中间源代码集，这将取消对默认分层模板的使用，并导致以下警告：

```none
默认 Kotlin 分层模板未应用于 '<项目名称>'：
已为以下源代码集配置了显式 .dependsOn() 关联：
[<... 带有手动配置 dependsOn 关联的源代码集名称...>]

考虑删除 dependsOn 调用，或通过在 gradle.properties 中添加
    'kotlin.mpp.applyDefaultHierarchyTemplate=false'
来禁用默认模板

了解更多关于分层模板的信息：https://kotl.in/hierarchy-template
```

要解决此问题，请通过执行以下任一操作来配置你的项目：

*   [用默认分层模板替换你的手动配置](#replacing-a-manual-configuration)
*   [在默认分层模板中创建额外的源代码集](#creating-additional-source-sets)
*   [修改由默认分层模板创建的源代码集](#modifying-source-sets)

#### 替换手动配置

**场景**。你所有的中间源代码集目前都由默认分层模板覆盖。

**解决方案**。在共享模块的 `build.gradle(.kts)` 文件中，移除所有手动 `dependsOn()` 调用和带有 `by creating` 构造的源代码集。要查看所有默认源代码集的列表，请参见[完整的分层模板](#see-the-full-hierarchy-template)。

#### 创建额外的源代码集

**场景**。你希望添加默认分层模板尚未提供的源代码集，例如，在 macOS 和 JVM 目标之间添加一个。

**解决方案**：

1.  在共享模块的 `build.gradle(.kts)` 文件中，通过显式调用 `applyDefaultHierarchyTemplate()` 重新应用模板。
2.  使用 `dependsOn()` [手动](#manual-configuration)配置额外的源代码集：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次应用默认层级。例如，它将创建 iosMain 源代码集：
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

    </TabItem>
    <TabItem title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次应用默认层级。例如，它将创建 iosMain 源代码集：
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

    </TabItem>
    </Tabs>

#### 修改源代码集

**场景**。你已有的源代码集与模板生成的源代码集名称完全相同，但在你的项目中由不同的目标集共享。例如，一个 `nativeMain` 源代码集仅在桌面特有的目标：`linuxX64`、`mingwX64` 和 `macosX64` 之间共享。

**解决方案**。目前没有办法修改模板源代码集之间的默认 `dependsOn` 关联。同样重要的是，源代码集的实现和含义，例如 `nativeMain`，在所有项目中都是相同的。

但是，你仍然可以执行以下任一操作：

*   找到适用于你目的的不同源代码集，无论是在默认分层模板中还是手动创建的。
*   通过在 `gradle.properties` 文件中添加 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 来完全退出模板，并手动配置所有源代码集。

> 我们目前正在开发一个 API 来创建你自己的分层模板。这将对层级配置与默认模板显著不同的项目很有用。
>
> 这个 API 尚未准备就绪，但如果你渴望尝试它，可以查看 `applyHierarchyTemplate {}` 代码块和 `KotlinHierarchyTemplate.default` 的声明作为示例。请记住，此 API 仍在开发中。它可能未经测试，并且在后续版本中可能会发生变化。
>
{style="tip"}

#### 查看完整的分层模板 {initial-collapse-state="collapsed" collapsible="true"}

当你声明项目编译到的目标时，插件会根据模板中指定的目标选择共享源代码集，并在你的项目中创建它们。

![默认分层模板](full-template-hierarchy.svg)

> 此示例仅显示项目的生产部分，省略了 `Main` 后缀（例如，使用 `common` 而不是 `commonMain`）。然而，对于 `*Test` 源代码集，一切都是相同的。
>
{style="tip"}

## 手动配置

你可以在源代码集结构中手动引入一个中间源代码集。它将包含多个目标的共享代码。

例如，如果你想在原生 Linux、Windows 和 macOS 目标（`linuxX64`、`mingwX64` 和 `macosX64`）之间共享代码，可以这样做：

1.  在共享模块的 `build.gradle(.kts)` 文件中，添加中间源代码集 `myDesktopMain`，它将包含这些目标的共享逻辑。
2.  使用 `dependsOn` 关联，设置源代码集层级结构。将 `commonMain` 与 `myDesktopMain` 连接，然后将 `myDesktopMain` 与每个目标源代码集连接：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">
    
    ```kotlin
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            val myDesktopMain by creating {
                dependsOn(commonMain.get())
            }
    
            linuxX64Main.get().dependsOn(myDesktopMain)
            mingwX64Main.get().dependsOn(myDesktopMain)
            macosX64Main.get().dependsOn(myDesktopMain)
        }
    }
    ```
    
    </TabItem>
    <TabItem title="Groovy" group-key="groovy">
    
    ```groovy
    kotlin {
        linuxX64()
        mingwX64()
        macosX64()
    
        sourceSets {
            myDesktopMain {
                dependsOn(commonMain.get())
            }
            linuxX64Main {
                dependsOn(myDesktopMain)
            }
            mingwX64Main {
                dependsOn(myDesktopMain)
            }
            macosX64Main {
                dependsOn(myDesktopMain)
            }
        }
    }
    ```
    
    </TabItem>
    </Tabs>

结果层级结构将如下所示：

![手动配置的分层结构](manual-hierarchical-structure.svg)

你可以为以下目标组合共享源代码集：

*   JVM 或 Android + Web + Native
*   JVM 或 Android + Native
*   Web + Native
*   JVM 或 Android + Web
*   Native

Kotlin 目前不支持为以下组合共享源代码集：

*   多个 JVM 目标
*   JVM + Android 目标
*   多个 JS 目标

如果你需要从共享的原生源代码集访问平台特有的 API，IntelliJ IDEA 将帮助你检测可以在共享原生代码中使用的公共声明。对于其他情况，请使用 Kotlin 的[预期与实际声明](multiplatform-expect-actual.md)机制。