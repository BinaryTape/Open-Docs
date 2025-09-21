# 常見問題

有不在常見問題中的問題嗎？請在 [StackOverflow](https://stackoverflow.com/questions/tagged/coil) 上查看 #coil 標籤或搜尋 [Github discussions](https://github.com/coil-kt/coil/discussions)。

## Coil 可以與 Java 專案或混合 Kotlin/Java 專案一起使用嗎？

是的！[請在此處閱讀](java_compatibility.md)。

## 我如何預載入圖片？

啟動一個沒有目標的圖片請求：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

這將預載入圖片並將其儲存到磁碟和記憶體快取中。

如果您只想預載入到磁碟快取，可以跳過解碼並儲存到記憶體快取，如下所示：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    // Disables writing to the memory cache.
    .memoryCachePolicy(CachePolicy.DISABLED)
    // Skips the decode step so we don't waste time/memory decoding the image into memory.
    .decoderFactory(BlackholeDecoder.Factory())
    .build()
imageLoader.enqueue(request)
```

## 我如何啟用日誌記錄？

當 [建構您的 `ImageLoader`](getting_started.md#configuring-the-singleton-imageloader) 時，設定 `logger(DebugLogger())`。

!!! 注意
    `DebugLogger` 應僅用於除錯建構中。

## 我如何將目標設定為 Java 8 或 Java 11？

Coil 需要 [Java 8 位元組碼](https://developer.android.com/studio/write/java8-support)。這在 Android Gradle Plugin `4.2.0` 及更高版本和 Kotlin Gradle Plugin `1.5.0` 及更高版本中預設啟用。如果您使用這些外掛程式的舊版本，請將以下內容新增到您的 Gradle 建構指令碼中：

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

從 Coil `3.2.0` 開始，`coil-compose` 和 `coil-compose-core` 需要 Java 11 位元組碼：

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

## 我如何獲取開發快照？

將快照儲存庫新增到您的儲存庫列表中：

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

然後依賴具有 [最新快照版本](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34) 的相同構件。

!!! 注意
    每個通過 CI 的 `main` 分支新提交都會部署快照。它們可能包含破壞性變更或不穩定。請自行承擔風險使用。

## 我如何將 Proguard 與 Coil 一起使用？

要將 Proguard 與 Coil 一起使用，請將以下規則新增到您的配置中：

```
-keep class coil3.util.DecoderServiceLoaderTarget { *; }
-keep class coil3.util.FetcherServiceLoaderTarget { *; }
-keep class coil3.util.ServiceLoaderComponentRegistry { *; }
-keep class * implements coil3.util.DecoderServiceLoaderTarget { *; }
-keep class * implements coil3.util.FetcherServiceLoaderTarget { *; }
```

您可能還需要為 Ktor、OkHttp 和 Coroutines 新增自訂規則。

!!! 注意
    **如果您使用 R8，則無需為 Coil 新增任何自訂規則**，R8 是 Android 上預設的程式碼壓縮器。這些規則會自動新增。