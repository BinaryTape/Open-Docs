# よくある質問

よくある質問に掲載されていない質問がありますか？ [StackOverflow](https://stackoverflow.com/questions/tagged/coil) で `#coil` タグを使って確認するか、[Github discussions](https://github.com/coil-kt/coil/discussions) で検索してください。

## Coil は Java プロジェクトまたは Kotlin/Java 混合プロジェクトで使用できますか？

はい、可能です！ [こちら](java_compatibility.md)をご覧ください。

## 画像をプリロードするにはどうすればよいですか？

ターゲットなしで画像リクエストを起動します。

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

これにより画像がプリロードされ、ディスクキャッシュとメモリキャッシュに保存されます。

ディスクキャッシュにのみプリロードしたい場合は、次のようにデコードとメモリキャッシュへの保存をスキップできます。

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

## ロギングを有効にするにはどうすればよいですか？

[ImageLoader を構築する際](getting_started.md#configuring-the-singleton-imageloader) に `logger(DebugLogger())` を設定します。

!!! Note
    `DebugLogger` はデバッグビルドでのみ使用してください。

## Java 8 または Java 11 をターゲットにするにはどうすればよいですか？

Coil は [Java 8 バイトコード](https://developer.android.com/studio/write/java8-support) を必要とします。これは Android Gradle Plugin `4.2.0` 以降および Kotlin Gradle Plugin `1.5.0` 以降でデフォルトで有効になっています。これらのプラグインの古いバージョンを使用している場合は、Gradle ビルドスクリプトに以下を追加してください。

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

Coil `3.2.0` 以降、`coil-compose` および `coil-compose-core` には Java 11 バイトコードが必要です。

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

## 開発版スナップショットを入手するにはどうすればよいですか？

リポジトリリストにスナップショットリポジトリを追加します。

Gradle (`.gradle`):

```groovy
allprojects {
    repositories {
        maven { url 'https://oss.sonatype.org/content/repositories/snapshots' }
    }
}
```

Gradle Kotlin DSL (`.gradle.kts`):

```kotlin
allprojects {
    repositories {
        maven("https://oss.sonatype.org/content/repositories/snapshots")
    }
}
```

次に、[最新のスナップショットバージョン](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34) で同じアーティファクトに依存します。

!!! Note
    スナップショットは、CI をパスした `main` ブランチの新しいコミットごとにデプロイされます。破壊的変更が含まれていたり、不安定である可能性があります。自己責任でご利用ください。

## Proguard を Coil と一緒に使用するにはどうすればよいですか？

Coil で Proguard を使用するには、設定に以下のルールを追加してください。

```
-keep class * extends coil3.util.DecoderServiceLoaderTarget { *; }
-keep class * extends coil3.util.FetcherServiceLoaderTarget { *; }
```

Ktor、OkHttp、および Coroutines にカスタムルールを追加する必要がある場合もあります。

!!! Note
    **R8 を使用している場合は Coil にカスタムルールを追加する必要はありません**。R8 は Android のデフォルトのコードシュリンカーです。ルールは自動的に追加されます。