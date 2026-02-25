[//]: # (title: 层次化项目结构)

Kotlin 多平台项目支持层次化源集结构。
这意味着你可以安排一个中间源集的层次结构，以便在部分（而非全部）[支持的目标](multiplatform-dsl-reference.md#targets)之间共享公共代码。使用中间源集有助于：

* **为某些目标提供特定的 API**。例如，库可以在针对 Kotlin/Native 目标的中间源集中添加原生特定的 API，但不适用于 Kotlin/JVM 目标。
* **在某些目标中消费特定的 API**。例如，你可以从 Kotlin 多平台库为构成中间源集的某些目标提供的丰富 API 中获益。
* **在项目中使用平台相关的库**。例如，你可以从中间 iOS 源集访问 iOS 特定的依赖项。

Kotlin 工具链确保每个源集只能访问对其编译到的所有目标都可用的 API。这可以防止出现诸如使用 Windows 特定的 API 然后将其编译到 macOS 的情况，否则会导致链接错误或运行时的未定义行为。

建议的设置源集层次结构的方式是使用[默认层次结构模板](#default-hierarchy-template)。
该模板涵盖了最常见的案例。如果你有更高级的项目，可以进行[手动配置](#manual-configuration)。
这是一种更底层的方法：虽然更灵活，但需要更多的精力。

## 默认层次结构模板

Kotlin Gradle 插件内置了一个默认的[层次结构模板](#see-the-full-hierarchy-template)。
它包含了一些针对流行用例预定义的中间源集。
插件会根据你项目中指定的目标自动设置这些源集。

考虑项目模块中包含共享代码的以下 `build.gradle(.kts)` 文件：

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

当你在代码中声明 `android`、`iosArm64` 和 `iosSimulatorArm64` 目标时，Kotlin Gradle 插件会从模板中查找合适的共享源集并为你创建它们。生成的层次结构如下所示：

![使用默认层次结构模板的示例](default-hierarchy-example.svg)

有颜色的源集是实际创建并存在于项目中的，而默认模板中灰色的源集则被忽略。例如，Kotlin Gradle 插件没有创建 `watchos` 源集，因为项目中没有 watchOS 目标。

如果你添加一个 watchOS 目标，如 `watchosArm64`，则会创建 `watchos` 源集，并且来自 `apple`、`native` 和 `common` 源集代码也会编译到 `watchosArm64`。

Kotlin Gradle 插件为默认层次结构模板中的所有源集提供了类型安全和静态访问器，因此与[手动配置](#manual-configuration)相比，你可以直接引用它们，而无需使用 `by getting` 或 `by creating` 构造。

如果你尝试在共享模块的 `build.gradle(.kts)` 文件中访问源集而没有先声明相应的目标，你将看到一个警告：

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
        // 警告：在未声明目标的情况下访问源集
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
        // 警告：在未声明目标的情况下访问源集
        linuxX64Main { }
    }
}
```

</TabItem>
</Tabs>

> 在此示例中，`apple` 和 `native` 源集仅编译为 `iosArm64` 和 `iosSimulatorArm64` 目标。
> 尽管它们的名字如此，但它们可以访问完整的 iOS API。
> 对于像 `native` 这样的源集，这可能不太符合直觉，因为你可能期望在该源集中只能访问所有原生目标上都可用的 API。此行为将来可能会发生变化。
>
{style="note"}

### 其他配置

你可能需要对默认层次结构模板进行调整。如果你之前通过 `dependsOn` 调用[手动](#manual-configuration)引入了中间源集，这将取消默认层次结构模板的使用，并导致以下警告：

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

* [将手动配置替换为默认层次结构模板](#replacing-a-manual-configuration)
* [在默认层次结构模板中创建额外的源集](#creating-additional-source-sets)
* [修改由默认层次结构模板创建的源集](#modifying-source-sets)

#### 将手动配置替换为默认层次结构模板

**案例**。你所有的中间源集当前都已由默认层次结构模板涵盖。

**解决方案**。在共享模块的 `build.gradle(.kts)` 文件中，移除所有手动的 `dependsOn()` 调用以及使用 `by creating` 构造的源集。要检查所有默认源集的列表，请参阅[完整层次结构模板](#see-the-full-hierarchy-template)。

#### 创建额外的源集

**案例**。你想添加默认层次结构模板尚未提供的源集，例如介于 macOS 和 JVM 目标之间的源集。

**解决方案**：

1. 在共享模块的 `build.gradle(.kts)` 文件中，通过显式调用 `applyDefaultHierarchyTemplate()` 重新应用模板。
2. 使用 `dependsOn()` [手动](#manual-configuration)配置额外的源集：

    <Tabs group="build-script">
    <TabItem title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        jvm()
        macosArm64()
        iosArm64()
        iosSimulatorArm64()
    
        // 再次应用默认层次结构。它将创建例如 iosMain 源集：
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 创建一个额外的 jvmAndMacos 源集：
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
    
        // 再次应用默认层次结构。它将创建例如 iosMain 源集：
        applyDefaultHierarchyTemplate()
    
        sourceSets {
            // 创建一个额外的 jvmAndMacos 源集：
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

#### 修改源集

**案例**。你已经拥有与模板生成的名称完全相同的源集，但在项目中共享于不同的目标集。例如，`nativeMain` 源集仅在特定于桌面的目标之间共享：`linuxX64`、`mingwX64` 和 `macosX64`。

**解决方案**。目前无法修改模板源集之间默认的 `dependsOn` 关系。同样重要的是，源集（例如 `nativeMain`）的实现和含义在所有项目中都是相同的。

但是，你仍然可以执行以下操作之一：

* 为你的目的寻找不同的源集，可以是在默认层次结构模板中，也可以是手动创建的源集。
* 通过在 `gradle.properties` 文件中添加 `kotlin.mpp.applyDefaultHierarchyTemplate=false` 来完全退出模板，并手动配置所有源集。

> 我们目前正在开发用于创建自定义层次结构模板的 API。对于层次结构配置与默认模板显著不同的项目，这将非常有用。
>
> 此 API 尚未准备就绪，但如果你渴望尝试，可以查看 `applyHierarchyTemplate {}` 块以及 `KotlinHierarchyTemplate.default` 的声明作为参考。请记住，此 API 仍处于开发阶段。它可能未经测试，并且在后续版本中可能会发生变化。
>
{style="tip"}

#### 查看完整层次结构模板 {initial-collapse-state="collapsed" collapsible="true"}

当你声明项目编译到的目标时，插件会根据指定的从模板中选择共享源集，并在你的项目中创建它们。

![默认层次结构模板](full-template-hierarchy.svg)

> 此示例仅显示项目的生产部分，省略了 `Main` 后缀（例如，使用 `common` 代替 `commonMain`）。但是，`*Test` 源码的情况也是完全一样的。
>
{style="tip"}

## 手动配置

你可以手动在源集结构中引入中间源。它将保存多个目标的共享代码。

例如，如果你想在原生 Linux、Windows 和 macOS 目标（`linuxX64`、`mingwX64` 和 `macosX64`）之间共享代码，操作如下：

1. 在共享模块的 `build.gradle(.kts)` 文件中，添加中间源集 `myDesktopMain`，它将保存这些目标的共享逻辑。
2. 使用 `dependsOn` 关系设置源集层次结构。将 `commonMain` 与 `myDesktopMain` 连接，然后将 `myDesktopMain` 与每个目标源集连接：

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

生成的层次结构如下所示：

![手动配置的层次结构](manual-hierarchical-structure.svg)

你可以为以下目标组合建立共享源集：

* JVM 或 Android + Web + Native
* JVM 或 Android + Native
* Web + Native
* JVM 或 Android + Web
* Native

Kotlin 目前不支持为以下组合共享源集：

* 多个 JVM 目标
* JVM + Android 目标
* 多个 JS 目标

如果你需要从共享的原生源集访问平台特定的 API，IntelliJ IDEA 将帮助你检测可在共享原生代码中使用的公共声明。对于其他情况，请使用 Kotlin 的[预期声明与实际声明](multiplatform-expect-actual.md)机制。