# 图像加载器

`ImageLoader` 是 [服务对象 (service objects)](https://publicobject.com/2019/06/10/value-objects-service-objects-and-glue/)，负责执行 [`ImageRequest`](image_requests.md)。它们处理缓存、数据获取、图像解码、请求管理、内存管理等。

Coil 在您创建一个 `ImageLoader` 并在整个应用中共享它时表现最佳。这是因为每个 `ImageLoader` 都有自己的内存缓存、磁盘缓存和 `OkHttpClient`。

## 单例

默认的 `io.coil-kt.coil3:coil` 工件 (artifact) 附带一个单例 `ImageLoader`。Coil 延迟创建 (lazily) 此 `ImageLoader`。它可以通过多种方式配置：

```kotlin
// The setSafe method ensures that it won't overwrite an
// existing image loader that's been created.
SingletonImageLoader.setSafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// An alias of SingletonImageLoader.setSafe that's useful for
// Compose Multiplatform apps.
setSingletonImageLoaderFactory { context ->
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// Should only be used in tests. If you call this method
// multiple times it will create multiple image loaders.
SingletonImageLoader.setUnsafe {
    ImageLoader.Builder(context)
        .crossfade(true)
        .build()
}

// On Android you can implement SingletonImageLoader.Factory on your
// Application class to have it create the singleton image loader.
class CustomApplication : SingletonImageLoader.Factory {
    override fun newImageLoader(context: Context): ImageLoader {
        return ImageLoader.Builder(context)
            .crossfade(true)
            .build()
    }
}
```

**在所有情况下，请确保上述方法在应用启动时尽快调用（例如，在 `Application.onCreate` 中，或者如果您的应用只有一个 `Activity`，则在 `MainActivity.onCreate` 中）。**

## 依赖注入

如果您有更大的应用或希望管理自己的 `ImageLoader`，您可以依赖 `io.coil-kt.coil3:coil-core` 而不是 `io.coil-kt.coil3:coil`。

这种方式使得范围化 (scoping) 虚假 (fake) `ImageLoader` 的生命周期变得容易得多，并且总体上会使测试更容易。

## 缓存

每个 `ImageLoader` 都保留一个最近解码的 `Bitmap` 的内存缓存，以及一个用于从互联网加载的任何图像的磁盘缓存。两者都可以在创建 `ImageLoader` 时配置：

```kotlin
val imageLoader = ImageLoader.Builder(context)
    .memoryCache {
        MemoryCache.Builder(context)
            .maxSizePercent(0.25)
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

您可以使用键访问内存和磁盘缓存中的项目，这些键在图像加载后会以 `ImageResult` 的形式返回。`ImageResult` 由 `ImageLoader.execute` 或在 `ImageRequest.Listener.onSuccess` 和 `ImageRequest.Listener.onError` 中返回。