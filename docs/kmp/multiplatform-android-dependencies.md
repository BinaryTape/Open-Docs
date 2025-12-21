[//]: # (title: 添加 Android 依赖项)

将 Android 特有的依赖项添加到 Kotlin 多平台模块的工作流程与纯 Android 项目相同：在 Gradle 文件中声明依赖项并导入项目。之后，您可以在 Kotlin 代码中使用此依赖项。

我们建议在 Kotlin 多平台项目中声明 Android 依赖项时，将其添加到特定的 Android 源代码集。为此，请更新您项目 `shared` 目录中的 `build.gradle(.kts)` 文件：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    //...
    sourceSets {
        androidMain.dependencies {
            implementation("com.example.android:app-magic:12.3")
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
        androidMain {
            dependencies {
                implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

如果顶层依赖项具有非简单的配置名称，将 Android 项目中的顶层依赖项移动到多平台项目中的特定源代码集可能会很困难。例如，要从 Android 项目的顶层移动 `debugImplementation` 依赖项，您需要将 `implementation` 依赖项添加到名为 `androidDebug` 的源代码集。为了最大程度地减少处理此类迁移问题所需的工作量，您可以将 `dependencies {}` 代码块添加到 `android {}` 代码块内：

<Tabs group="build-script">
<TabItem title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    android {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</TabItem>
<TabItem title="Groovy" group-key="groovy">

```groovy
kotlin {
    android {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
            }
        }
    }
}
```

</TabItem>
</Tabs>

在此处声明的依赖项将被完全相同地对待，就像来自顶层代码块的依赖项一样，但以这种方式声明它们还将使您的构建脚本中的 Android 依赖项在视觉上分离，并减少混淆。

将依赖项放置在脚本末尾一个独立的 `dependencies {}` 代码块中（以 Android 项目的惯用方式），也受支持。然而，我们强烈建议 **不要** 这样做，因为在顶层代码块中配置 Android 依赖项，而在每个源代码集中配置其他目标依赖项，可能会导致混淆。

## 接下来是什么？

查看有关在多平台项目中添加依赖项的其他资源，并了解更多信息：

* [在官方 Android 文档中添加依赖项](https://developer.android.com/studio/build/dependencies)
* [添加对多平台库或其他多平台项目的依赖项](multiplatform-add-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)