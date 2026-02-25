# Image Loaders

`ImageLoader` 是执行 [`ImageRequest`](image_requests.md) 的 [service objects](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)。它们处理缓存、数据提取、图像解码、请求管理、内存管理等。

当您创建一个 `ImageLoader` 并在整个应用中共享它时，Coil 的性能表现最佳。这是因为每个 `ImageLoader` 都有自己的内存缓存、磁盘缓存和 `OkHttpClient`。

## Singleton

默认的 `io.coil-kt.coil3:coil` 构件带有一个单例 `ImageLoader`。Coil 会延迟创建此 `ImageLoader`。可以通过多种方式对其进行配置：

```kotlin
// setSafe 方法确保它不会覆盖
// 已经创建的现有图像加载器。
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// SingletonImageLoader.setSafe 的别名，对
// Compose Multiplatform 应用非常有用。
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// 仅应在测试中使用。如果您多次调用此方法，
// 它将创建多个图像加载器。
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// 在 Android 上，您可以在 Application 类上实现 SingletonImageLoader.Factory，
// 以便让它创建单例图像加载器。
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**在所有情况下，请确保在应用启动时尽早调用上述方法（即在 `Application.onCreate` 内部，或者如果您的应用只有一个 `Activity`，则在 `MainActivity.onCreate` 内部）。**

## Dependency injection

如果您拥有较大的应用或想要管理自己的 `ImageLoader`，可以依赖 `io.coil-kt.coil3:coil-core` 而不是 `io.coil-kt.coil3:coil`。

这条路径使得限定模拟 `ImageLoader` 的生命周期变得更加容易，并且总体上会使测试更加简单。

## Caching

每个 `ImageLoader` 都会保留最近解码的 `Bitmap` 的内存缓存，以及从互联网加载的任何图像的磁盘缓存。两者都可以在创建 `ImageLoader` 时进行配置：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder()
            .maxSizePercent(context, 0.25)
            .build()
    }
    .diskCache {
        DiskCache.Builder()
            .directory(context.cacheDir.resolve("image_cache"))
            .maxSizePercent(0.02)
            .build()
    }
    .build()
```

您可以使用键 (key) 访问内存和磁盘缓存中的项，这些键会在图像加载后的 `ImageResult` 中返回。`ImageResult` 由 `ImageLoader.execute` 返回，或在 `ImageRequest.Listener.onSuccess` 和 `ImageRequest.Listener.onError` 中返回。