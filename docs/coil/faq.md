# 常见问题解答

有问题不在常见问题解答中？查看带有 #coil 标签的 [StackOverflow](https://stackoverflow.com/questions/tagged/coil) 或搜索 [Github 讨论区](https://github.com/coil-kt/coil/discussions)。

## Coil 可以用于 Java 项目或 Kotlin/Java 混合项目吗？

可以！[在此阅读](java_compatibility.md)。

## 如何预加载图像？

发起一个不带目标的图像请求：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

这将预加载图像并将其保存到磁盘和内存缓存中。

如果你只想预加载到磁盘缓存，可以像这样跳过解码和保存到内存缓存：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    // 禁用写入内存缓存。
    .memoryCachePolicy(CachePolicy.DISABLED)
    // 跳过解码步骤，这样我们就不会浪费时间/内存将图像解码到内存中。
    .decoderFactory(BlackholeDecoder.Factory())
    .build()
imageLoader.enqueue(request)
```

## 如何启用日志记录？

在 [构造 `ImageLoader`](getting_started.md#configuring-the-singleton-imageloader) 时设置 `logger(DebugLogger())`。

!!! Note
    `DebugLogger` 应仅在调试构建中使用。

## 如何以 Java 8 或 Java 11 为目标？

Coil 需要 [Java 8 字节码](https://developer.android.com/studio/write/java8-support)。Android Gradle 插件 `4.2.0` 及更高版本以及 Kotlin Gradle 插件 `1.5.0` 及更高版本默认启用此功能。如果你正在使用这些插件的旧版本，请将以下内容添加到你的 Gradle 构建脚本中：

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

自 Coil `3.2.0` 起，`coil-compose` 和 `coil-compose-core` 需要 Java 11 字节码：

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

## 如何获取开发快照？

将快照仓库添加到你的仓库列表中：

Gradle (`.gradle`)：

```groovy
allprojects {
    repositories {
        maven { url 'https://central.sonatype.com/repository/maven-snapshots/' }
    }
}
```

Gradle Kotlin DSL (`.gradle.kts`)：

```kotlin
allprojects {
    repositories {
        maven("https://central.sonatype.com/repository/maven-snapshots/")
    }
}
```

然后依赖具有 [最新快照版本](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34) 的相同构件。

!!! Note
    快照会针对通过 CI 的 `main` 分支上的每个新提交进行部署。它们可能包含破坏性变更或可能不稳定。使用风险自负。

## 如何在 Coil 中使用 Proguard？

要在 Coil 中使用 Proguard，请将以下规则添加到你的配置中：

```
-keep class coil3.util.DecoderServiceLoaderTarget { *; }
-keep class coil3.util.FetcherServiceLoaderTarget { *; }
-keep class coil3.util.ServiceLoaderComponentRegistry { *; }
-keep class * implements coil3.util.DecoderServiceLoaderTarget { *; }
-keep class * implements coil3.util.FetcherServiceLoaderTarget { *; }
```

你可能还需要为 Ktor、OkHttp 和 Coroutines 添加自定义规则。

!!! Note
    **如果你使用 R8，则不需要为 Coil 添加任何自定义规则**，它是 Android 上的默认代码压缩工具。这些规则会自动添加。