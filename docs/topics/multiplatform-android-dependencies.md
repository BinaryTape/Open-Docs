[//]: # (title: 添加 Android 依赖项)

将 Android 特有的依赖项添加到 Kotlin Multiplatform 模块的工作流程与纯 Android 项目相同：在 Gradle 文件中声明依赖项并导入项目。之后，您可以在 Kotlin 代码中使用此依赖项。

我们建议在 Kotlin Multiplatform 项目中，通过将 Android 依赖项添加到特定的 Android 源代码集来声明它们。为此，请更新您项目 `shared` 目录中的 `build.gradle(.kts)` 文件：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

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

</tab>
<tab title="Groovy" group-key="groovy">

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

</tab>
</tabs>

将 Android 项目中的顶层依赖项移动到 multiplatform 项目中的特定源代码集可能会很困难，如果该顶层依赖项具有非平凡的配置名称。例如，要将 `debugImplementation` 依赖项从 Android 项目的顶层移动，您需要向名为 `androidDebug` 的源代码集添加一个 implementation 依赖项。为了最大程度地减少处理此类迁移问题所需的工作量，您可以将 `dependencies {}` 代码块添加到 `androidTarget {}` 代码块内部：

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation("com.example.android:app-magic:12.3")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    androidTarget {
        //...
        dependencies {
            implementation 'com.example.android:app-magic:12.3'
        }
    }
}
```

</tab>
</tabs>

在此处声明的依赖项将与来自顶层代码块的依赖项完全相同地对待，但以这种方式声明它们还将在您的构建脚本中视觉上分离 Android 依赖项，并减少混淆。

将依赖项放入脚本末尾的独立 `dependencies {}` 代码块中，以 Android 项目惯用的方式，也受支持。但是，我们强烈建议 **不要** 这样做，因为在顶层代码块中配置 Android 依赖项，而在每个源代码集中配置其他目标依赖项，可能会导致混淆。

## 后续内容

查看有关在 multiplatform 项目中添加依赖项的其他资源，并了解更多：

* [在官方 Android 文档中添加依赖项](https://developer.android.com/studio/build/dependencies)
* [在 multiplatform 库或其他 multiplatform 项目中添加依赖项](multiplatform-add-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)