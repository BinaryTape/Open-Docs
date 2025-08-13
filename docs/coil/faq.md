# 常见问题

有问题不在常见问题解答中？请在 [StackOverflow](https://stackoverflow.com/questions/tagged/coil) 上搜索 `#coil` 标签，或在 [Github discussion](https://github.com/coil-kt/coil/discussions) 中查找。

## Coil 可以用于 Java 项目或 Kotlin/Java 混合项目吗？

可以！[在此阅读](java_compatibility.md)。

## 如何预加载图像？

启动一个没有目标的图像请求：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

这将预加载图像并将其保存到磁盘缓存和内存缓存中。

如果您只想预加载到磁盘缓存，可以跳过解码和保存到内存缓存的步骤，如下所示：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    // 禁用写入内存缓存。
    .memoryCachePolicy(CachePolicy.DISABLED)
    // 跳过解码步骤，避免将图像解码到内存中浪费时间/内存。
    .decoderFactory(BlackholeDecoder.Factory())
    .build()
imageLoader.enqueue(request)
```

## 如何启用日志记录？

在[构建 `ImageLoader`](getting_started.md#configuring-the-singleton-imageloader) 时设置 `logger(DebugLogger())`。

!!! 注意
    `DebugLogger` 仅应在调试构建中使用。

## 如何面向 Java 8 或 Java 11？

Coil 需要 [Java 8 字节码](https://developer.android.com/studio/write/java8-support)。Android Gradle Plugin `4.2.0` 及更高版本和 Kotlin Gradle Plugin `1.5.0` 及更高版本默认启用此功能。如果您使用这些插件的旧版本，请将以下内容添加到您的 Gradle 构建脚本中：

```kotlin
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}
```

从 Coil `3.2.0` 开始，`coil-compose` 和 `coil-compose-core` 需要 Java 11 字节码：

```kotlin
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
}
```

## 如何获取开发快照版本？

将快照仓库添加到您的仓库列表中：

Gradle (`.gradle`)：

```groovy
allprojects {
    repositories {
        maven { url 'https://oss.sonatype.org/content/repositories/snapshots' }
    }
}
```

Gradle Kotlin DSL (`.gradle.kts`)：

```kotlin
allprojects {
    repositories {
        maven("https://oss.sonatype.org/content/repositories/snapshots")
    }
}
```

然后依赖于带有[最新快照版本](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34)的相同构件。

!!! 注意
    每次通过 CI 的 `main` 分支新提交都会部署快照版本。它们可能包含破坏性更改或不稳定。请自行承担风险使用。

## 如何在 Coil 中使用 Proguard？

要在 Coil 中使用 Proguard，请将以下规则添加到您的配置中：

```
-keep class * extends coil3.util.DecoderServiceLoaderTarget { *; }
-keep class * extends coil3.util.FetcherServiceLoaderTarget { *; }
```

您可能还需要为 Ktor、OkHttp 和 Coroutines 添加自定义规则。

!!! 注意
    **如果您使用 R8，则无需为 Coil 添加任何自定义规则**，R8 是 Android 上默认的代码缩减器。这些规则是自动添加的。