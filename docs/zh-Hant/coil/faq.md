# 常見問題

有不在常見問題中的問題嗎？請查看標籤為 #coil 的 [StackOverflow](https://stackoverflow.com/questions/tagged/coil) 或搜尋 [Github discussions](https://github.com/coil-kt/coil/discussions)。

## Coil 可以用於 Java 專案或 Kotlin/Java 混合專案嗎？

是的！[請參閱此處](java_compatibility.md)。

## 我該如何預載圖片？

發動一個沒有目標 (target) 的圖片請求：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

這將會預載圖片並將其儲存到磁碟快取與記憶體快取中。

如果你只想預載到磁碟快取，你可以跳過解碼並儲存到記憶體快取的步驟，如下所示：

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    // 停用寫入記憶體快取。
    .memoryCachePolicy(CachePolicy.DISABLED)
    // 跳過解碼步驟，以免浪費時間/記憶體將圖片解碼至記憶體中。
    .decoderFactory(BlackholeDecoder.Factory())
    .build()
imageLoader.enqueue(request)
```

## 我該如何啟用記錄？

在[建構你的 `ImageLoader`](getting_started.md#configuring-the-singleton-imageloader) 時設定 `logger(DebugLogger())`。

!!! Note
    `DebugLogger` 僅應在偵錯組建中使用。

## 我該如何以 Java 8 或 Java 11 為目標？

Coil 需要 [Java 8 位元組碼](https://developer.android.com/studio/write/java8-support)。在 Android Gradle 外掛程式 `4.2.0` 及更高版本以及 Kotlin Gradle 外掛程式 `1.5.0` 及更高版本中，此功能預設為啟用。如果你使用的是這些外掛程式的舊版本，請將以下內容新增至你的 Gradle 組建指令碼中：

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

自 Coil `3.2.0` 起，`coil-compose` 和 `coil-compose-core` 需要 Java 11 位元組碼：

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

## 我該如何取得開發版快照？

將快照存儲庫新增至你的存儲庫清單中：

Gradle (`.gradle`):

```groovy
allprojects {
    repositories {
        maven { url 'https://central.sonatype.com/repository/maven-snapshots/' }
    }
}
```

Gradle Kotlin DSL (`.gradle.kts`):

```kotlin
allprojects {
    repositories {
        maven("https://central.sonatype.com/repository/maven-snapshots/")
    }
}
```

接著透過[最新的快照版本](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34)依賴相同的產物 (artifacts)。

!!! Note
    快照會針對 `main` 分支上每個通過持續整合的新提交進行部署。它們可能包含破壞性變更或不穩定。請自行承擔使用風險。

## 我該如何在 Coil 中使用 Proguard？

若要在 Coil 中使用 Proguard，請將以下規則新增至你的配置中：

```
-keep class coil3.util.DecoderServiceLoaderTarget { *; }
-keep class coil3.util.FetcherServiceLoaderTarget { *; }
-keep class coil3.util.ServiceLoaderComponentRegistry { *; }
-keep class * implements coil3.util.DecoderServiceLoaderTarget { *; }
-keep class * implements coil3.util.FetcherServiceLoaderTarget { *; }
```

你可能還需要為 Ktor、OkHttp 和 Coroutines 新增自訂規則。

!!! Note
    **如果你使用 R8**（Android 上的預設程式碼壓縮器），**則無需為 Coil 新增任何自訂規則**。這些規則會自動新增。