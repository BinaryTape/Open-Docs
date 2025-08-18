[//]: # (title: 添加多平台库依赖项)

每个程序都需要一组库才能成功运行。Kotlin 多平台项目可以依赖于适用于所有目标平台的多平台库、平台特有的库，以及其他多平台项目。

要添加对库的依赖，请更新项目中包含共享代码目录下的 `build.gradle(.kts)` 文件。在 [`dependencies {}`](multiplatform-dsl-reference.md#dependencies) 代码块中，设置所需[类型](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types)的依赖项（例如，`implementation`）：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 适用于所有源代码集的共享库
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 对 Kotlin 库的依赖

### 标准库

每个源代码集对标准库（`stdlib`）的依赖都会自动添加。标准库的版本与 `kotlin-multiplatform` 插件的版本相同。

对于平台特有的源代码集，使用库对应的平台特有变体，而公共标准库则添加到其余部分。Kotlin Gradle 插件将根据 Gradle 构建脚本的 `compilerOptions.jvmTarget` [编译器选项](https://kotlinlang.org/docs/gradle-compiler-options.html)选择合适的 JVM 标准库。

了解如何[更改默认行为](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library)。

### 测试库

对于多平台测试，[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 可用。创建多平台项目时，你可以在 `commonTest` 中使用单个依赖项，从而向所有源代码集添加测试依赖项：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 自动引入所有平台依赖项
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 自动引入所有平台依赖项
            }
        }
    }
}
```

</TabItem>
</Tabs>

### kotlinx 库

如果你使用多平台库并需要[依赖共享代码](#library-shared-for-all-source-sets)，只需在共享源代码集中设置一次依赖项。使用库基础构件名称，例如 `kotlinx-coroutines-core`：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</TabItem>
</Tabs>

如果你的 kotlinx 库需要[平台特有的依赖项](#library-used-in-specific-source-sets)，你仍可在对应的平台源代码集中使用库的基础构件名称：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 对 Kotlin 多平台库的依赖

你可以添加对已采用 Kotlin 多平台技术的库的依赖，例如 [SQLDelight](https://github.com/cashapp/sqldelight)。这些库的作者通常会提供关于如何将它们的依赖项添加到你的项目的指南。

> 在 [JetBrains 搜索平台](https://klibs.io/)上查找 Kotlin 多平台库。
>
{style="tip"}

### 适用于所有源代码集的共享库

如果你想在所有源代码集使用某个库，你可以仅将其添加到公共源代码集。Kotlin Multiplatform Mobile 插件将自动把对应的部分添加到任何其他源代码集。

> 你无法在公共源代码集中设置对平台特有库的依赖项。
>
{style="warning"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:%ktorVersion%")
        }
        androidMain.dependencies {
            // ktor-client 的平台部分依赖项将自动添加
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:%ktorVersion%'
            }
        }
        androidMain {
            dependencies {
                // ktor-client 的平台部分依赖项将自动添加
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 在特定源代码集中使用的库

如果你只想在特定源代码集使用某个多平台库，你可以仅将它添加到这些源代码集。指定的库声明将只在这些源代码集中可用。

> 在这种情况下，请使用通用库名称，而不是平台特有的名称。例如，在下面的 SQLDelight 示例中，使用 `native-driver`，而不是 `native-driver-iosx64`。在库的文档中查找确切名称。
>
{style="note"}

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines 将在所有源代码集中可用
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight 将仅在 iOS 源代码集中可用，但在 Android 或 common 中不可用
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines 将在所有源代码集中可用
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight 将仅在 iOS 源代码集中可用，但在 Android 或 common 中不可用
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</TabItem>
</Tabs>

## 对另一个多平台项目的依赖

你可以将一个多平台项目作为依赖项连接到另一个项目。为此，只需向需要它的源代码集添加项目依赖项。如果你想在所有源代码集使用某个依赖项，将其添加到公共源代码集。在这种情况下，其他源代码集将自动获取其版本。

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // :some-other-multiplatform-module 的平台部分将自动添加
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    //...
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // :some-other-multiplatform-module 的平台部分将自动添加
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 下一步？

查看关于在多平台项目中添加依赖项的其他资源，并了解更多关于：

* [添加 Android 依赖项](multiplatform-android-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)
* [在面向 iOS、Android、桌面和 Web 的 Compose Multiplatform 项目中添加依赖项](compose-multiplatform-modify-project.md#add-a-new-dependency)