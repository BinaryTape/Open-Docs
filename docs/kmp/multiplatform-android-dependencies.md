[//]: # (title: 添加 Android 依赖项)

向 Kotlin Multiplatform 模块添加 Android 特定的依赖项，其工作流与纯 Android 项目相同：在 Gradle 文件中声明依赖项并导入项目。之后，你就可以在 Kotlin 代码中使用该依赖项了。

我们建议通过将 Android 依赖项添加到特定的 Android 源集来在 Kotlin Multiplatform 项目中声明它们。为此，请更新项目中 `shared` 目录下的 `build.gradle(.kts)` 文件：

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

如果顶级依赖项具有非平凡的配置名称，那么将 Android 项目中的顶级依赖项移动到多平台项目中的特定源集可能会比较困难。例如，要移动 Android 项目顶级的 `debugImplementation` 依赖项，你需要向名为 `androidDebug` 的源集中添加一个 implementation 依赖项。为了尽量减少处理此类迁移问题的工作量，你可以在 `android {}` 块内添加一个 `dependencies {}` 块：

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
```

</TabItem>
</Tabs>

在此处声明的依赖项将与顶级块中的依赖项完全相同地处理，但以这种方式声明还可以在构建脚本中直观地分离 Android 依赖项，并减少混淆。

同时也支持按照 Android 项目的惯例，在脚本末尾将依赖项放入独立的 `dependencies {}` 块中。但是，我们强烈**不建议**这样做，因为在顶级块中配置 Android 依赖项，而在每个源集中配置其他目标依赖项，很可能会导致混淆。

## 下一步

查看有关在多平台项目中添加依赖项的其他资源，并详细了解：

* [在官方 Android 文档中添加依赖项](https://developer.android.com/studio/build/dependencies)
* [添加多平台库或其他多平台项目的依赖项](multiplatform-add-dependencies.md)
* [添加 iOS 依赖项](multiplatform-ios-dependencies.md)