# FAQ

FAQにない質問がありますか？ #coil タグが付いた [StackOverflow](https://stackoverflow.com/questions/tagged/coil) を確認するか、[Github discussions](https://github.com/coil-kt/coil/discussions) を検索してください。

## CoilはJavaプロジェクト、またはKotlinとJavaが混在するプロジェクトで使用できますか？

はい！ [こちら](java_compatibility.md)をご覧ください。

## 画像をプリロードするにはどうすればよいですか？

ターゲットを指定せずに画像リクエストを開始します。

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    .build()
imageLoader.enqueue(request)
```

これにより、画像がプリロードされ、ディスクキャッシュとメモリキャッシュに保存されます。

ディスクキャッシュにのみプリロードしたい場合は、次のようにデコードとメモリキャッシュへの保存をスキップできます。

```kotlin
val request = ImageRequest.Builder(context)
    .data("https://example.com/image.jpg")
    // メモリキャッシュへの書き込みを無効にします。
    .memoryCachePolicy(CachePolicy.DISABLED)
    // 画像をメモリにデコードするための時間やメモリを無駄にしないよう、デコードステップをスキップします。
    .decoderFactory(BlackholeDecoder.Factory())
    .build()
imageLoader.enqueue(request)
```

## ロギングを有効にするにはどうすればよいですか？

[`ImageLoader`を構築する](getting_started.md#configuring-the-singleton-imageloader)際に、`logger(DebugLogger())` を設定してください。

!!! Note
    `DebugLogger` はデバッグビルドでのみ使用してください。

## Java 8 または Java 11 をターゲットにするにはどうすればよいですか？

Coilは [Java 8 バイトコード (bytecode)](https://developer.android.com/studio/write/java8-support) を必要とします。これは Android Gradle Plugin `4.2.0` 以降および Kotlin Gradle Plugin `1.5.0` 以降ではデフォルトで有効になっています。これらのプラグインの古いバージョンを使用している場合は、Gradleビルドスクリプトに以下を追加してください。

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

## 開発スナップショットを取得するにはどうすればよいですか？

リポジトリの一覧にスナップショットリポジトリを追加します。

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

次に、[最新のスナップショットバージョン](https://github.com/coil-kt/coil/blob/main/gradle.properties#L34)を使用して、同じアーティファクトに依存させます。

!!! Note
    スナップショットは、CIをパスした `main` ブランチへの新しいコミットごとにデプロイされます。これらには破壊的変更が含まれる可能性や、不安定な場合があります。自己責任で使用してください。

## CoilでProguardを使用するにはどうすればよいですか？

CoilでProguardを使用するには、[設定にこれらのProguardルールを追加してください](https://github.com/coil-kt/coil/blob/main/coil-core/src/jvmMain/resources/META-INF/proguard/proguard-rules.pro)。

また、Ktor、OkHttp、Coroutines 用のカスタムルールを追加する必要がある場合もあります。

!!! Note
    Androidのデフォルトのコードシュリンカー（code shrinker）である **R8を使用している場合、Coil用にカスタムルールを追加する必要はありません**。ルールは自動的に追加されます。