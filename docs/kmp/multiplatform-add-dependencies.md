[//]: # (title: 添加多平台库依赖项)

每个程序都需要一组库才能成功运行。Kotlin Multiplatform 项目可以依赖适用于所有目标平台的多平台库、平台特有的库以及其他多平台项目。

要添加库依赖项，请在包含共享代码的项目目录中更新 `build.gradle(.kts)` 文件。在 [`dependencies {}`](multiplatform-dsl-reference.md#dependencies) 代码块中设置所需 [类型](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-types) 的依赖项 (例如，`implementation`)：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 所有源代码集共享的库
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
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</tab>
</tabs>

另外，你也可以 [在顶层设置依赖项](https://kotlinlang.org/docs/gradle-configure-project.html#set-dependencies-at-top-level)。

## Kotlin 库依赖项

### 标准库

在每个源代码集中，对标准库 (`stdlib`) 的依赖项都会自动添加。标准库的版本与 `kotlin-multiplatform` 插件的版本相同。

对于平台特有的源代码集，会使用库的相应平台特有变体，同时其余部分会添加一个公共标准库。Kotlin Gradle 插件将根据你的 Gradle 构建脚本的 `compilerOptions.jvmTarget` [编译选项](https://kotlinlang.org/docs/gradle-compiler-options.html) 选择合适的 JVM 标准库。

了解如何 [更改默认行为](https://kotlinlang.org/docs/gradle-configure-project.html#dependency-on-the-standard-library)。

### 测试库

对于多平台测试，[`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API 可用。创建多平台项目时，你可以通过在 `commonTest` 中使用单个依赖项，为所有源代码集添加测试依赖项：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

### kotlinx 库

如果你使用多平台库并需要 [依赖共享代码](#library-shared-for-all-source-sets)，只需在共享源代码集中设置一次依赖项即可。请使用库的基本 artifact 名称，例如 `kotlinx-coroutines-core`：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

如果你的 [平台特有的依赖项](#library-used-in-specific-source-sets) 需要一个 kotlinx 库，你仍然可以在相应的平台源代码集中使用库的基本 artifact 名称：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## Kotlin Multiplatform 库依赖项

你可以添加对已采用 Kotlin Multiplatform 技术的库的依赖项，例如 [SQLDelight](https://github.com/cashapp/sqldelight)。这些库的作者通常提供将它们的依赖项添加到你的项目的指南。

> 请在 [JetBrains 搜索平台](https://klibs.io/) 上查找 Kotlin Multiplatform 库。
>
{style="tip"}

### 适用于所有源代码集的库

如果你希望在所有源代码集中使用某个库，你可以只将其添加到公共源代码集。Kotlin Multiplatform Mobile 插件将自动将相应的部件添加到任何其他源代码集。

> 你不能在公共源代码集中设置对平台特有库的依赖项。
>
{style="warning"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

### 在特定源代码集中使用的库

如果你只想在特定源代码集中使用多平台库，你可以专门将其添加到这些源代码集。指定的库声明则将只在那些源代码集中可用。

> 在这种情况下，请使用通用的库名称，而不是平台特有的名称。例如，在下面的示例中，对于 SQLDelight，请使用 `native-driver` 而非 `native-driver-iosx64`。请在库的文档中查找确切名称。
>
{style="note"}

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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
            // SQLDelight 将仅在 iOS 源代码集中可用，但在 Android 或公共源代码集中不可用
            implementation("com.squareup.sqldelight:native-driver:%sqlDelightVersion%")
        }
        wasmJsMain.dependencies {
            
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
                // SQLDelight 将仅在 iOS 源代码集中可用，但在 Android 或公共源代码集中不可用
                implementation 'com.squareup.sqldelight:native-driver:%sqlDelightVersion%'
            }
        }
        wasmJsMain {
            dependencies {}
        }
    }
}
```

</tab>
</tabs>

## 另一个多平台项目依赖项

你可以将一个多平台项目作为依赖项连接到另一个项目。为此，只需将项目依赖项添加到需要它的源代码集。如果你希望在所有源代码集中使用某个依赖项，请将其添加到公共源代码集。在这种情况下，其他源代码集将自动获取其版本。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

## 接下来？

查看关于在多平台项目中添加依赖项的其他资源，并了解更多关于：

* [添加 Android 依赖项](multiplatform-android-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)
* [在面向 iOS、Android、桌面和 Web 的 Compose Multiplatform 项目中添加依赖项](compose-multiplatform-modify-project.md#add-a-new-dependency)