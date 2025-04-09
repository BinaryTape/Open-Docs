---
title: 添加对多平台库的依赖
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

每个程序都需要一组库才能成功运行。一个 Kotlin Multiplatform 项目可以依赖于：适用于所有目标平台的多平台库、平台特定库和其他多平台项目。

要添加对库的依赖，请更新包含共享代码的项目的目录中的 `build.gradle(.kts)` 文件。在 [`dependencies {}`](multiplatform-dsl-reference#dependencies) 代码块中，设置所需[类型](gradle-configure-project#dependency-types)（例如，`implementation`）的依赖项：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("com.example:my-library:1.0") // 所有源集共享的库
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
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

或者，你可以[在顶层设置依赖项](gradle-configure-project#set-dependencies-at-top-level)。

## 依赖 Kotlin 库

### 标准库

会自动添加每个源集中对标准库（`stdlib`）的依赖项。标准库的版本与 `kotlin-multiplatform` 插件的版本相同。

对于特定于平台的源集，将使用该库的相应于特定平台的变体，而通用标准库将添加到其余源集中。Kotlin Gradle 插件将根据 Gradle 构建脚本的 `compilerOptions.jvmTarget` [编译器选项](gradle-compiler-options)选择合适的 JVM 标准库。

了解如何[更改默认行为](gradle-configure-project#dependency-on-the-standard-library)。

### 测试库

对于多平台测试，可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API。创建多平台项目时，可以通过在 `commonTest` 中使用单个依赖项，将测试依赖项添加到所有源集：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
            implementation(kotlin("test")) // 自动引入所有平台依赖项
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
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

如果你使用多平台库并且需要[依赖于共享代码](#library-shared-for-all-source-sets)，则只需在共享源集中设置一次依赖项。使用库的基本 artifact 名称，例如 `kotlinx-coroutines-core`：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

如果你需要一个 kotlinx 库用于[特定于平台的依赖项](#library-used-in-specific-source-sets)，你仍然可以在相应的平台源集中使用库的基本 artifact 名称：

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        jvmMain.dependencies {
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 依赖 Kotlin Multiplatform 库

你可以添加对采用了 Kotlin Multiplatform 技术的库的依赖，例如 [SQLDelight](https://github.com/cashapp/sqldelight)。这些库的作者通常会提供将它们的依赖项添加到你的项目的指南。

:::note
在 [JetBrains 的搜索平台](https://klibs.io/)上查找 Kotlin Multiplatform 库。

### 所有源集共享的库

如果想要从所有源集使用一个库，你可以只将其添加到 `common` 源集中。Kotlin Multiplatform Mobile 插件会自动将相应的部件添加到任何其他源集中。

你无法在 `common` 源集中设置对特定于平台的库的依赖。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation("io.ktor:ktor-client-core:3.1.1")
        }
        androidMain.dependencies {
            // 将自动添加对 ktor-client 的平台部件的依赖
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'io.ktor:ktor-client-core:3.1.1'
            }
        }
        androidMain {
            dependencies {
                // 将自动添加对 ktor-client 的平台部件的依赖
            }
        }
    }
}
```

</TabItem>
</Tabs>

### 在特定源集中使用的库

如果你只想将多平台库用于特定源集，则可以将其专门添加到这些源集中。然后，指定的库声明将仅在这些源集中可用。

在这种情况下，使用通用的库名称，而不是特定于平台的名称。与下面的 SQLDelight 示例一样，使用 `native-driver`，而不是 `native-driver-iosx64`。在库的文档中找到确切的名称。

:::

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            // kotlinx.coroutines 将在所有源集中可用
            implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1")
        }
        androidMain.dependencies {

        }
        iosMain.dependencies {
            // SQLDelight 将仅在 iOS 源集中可用，而不在 Android 或 common 中可用
            implementation("com.squareup.sqldelight:native-driver:2.0.2")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                // kotlinx.coroutines 将在所有源集中可用
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core:1.10.1'
            }
        }
        androidMain {
            dependencies {}
        }
        iosMain {
            dependencies {
                // SQLDelight 将仅在 iOS 源集中可用，而不在 Android 或 common 中可用
                implementation 'com.squareup.sqldelight:native-driver:2.0.2'
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 依赖于另一个多平台项目

你可以将一个多平台项目作为依赖项连接到另一个多平台项目。为此，只需将项目依赖项添加到需要它的源集。如果要在所有源集中使用依赖项，请将其添加到 `common` 源集中。在这种情况下，其他源集将自动获取其版本。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    sourceSets {
        commonMain.dependencies {
            implementation(project(":some-other-multiplatform-module"))
        }
        androidMain.dependencies {
            // 将自动添加 :some-other-multiplatform-module 的平台部分
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation project(':some-other-multiplatform-module')
            }
        }
        androidMain {
            dependencies {
                // 将自动添加 :some-other-multiplatform-module 的平台部分
            }
        }
    }
}
```

</TabItem>
</Tabs>

## 接下来做什么？

查看有关在多平台项目中添加依赖项的其他资源，并了解更多信息：

* [添加 Android 依赖项](multiplatform-android-dependencies)
* [添加 iOS 依赖项](multiplatform-ios-dependencies)