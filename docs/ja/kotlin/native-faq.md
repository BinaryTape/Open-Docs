[//]: # (title: Kotlin/Native FAQ)

## プログラムの実行方法を教えてください。

渡される引数に関心がない場合は、トップレベル関数 `fun main(args: Array<String>)` または単に `fun main()` を定義します。パッケージに含まれないようにしてください。
また、コンパイラオプション `-entry` を使用すると、`Array<String>` を引数に取る、または引数を取らない、`Unit` を返す任意の関数をエントリポイントとして設定できます。

## Kotlin/Nativeのメモリ管理モデルとは何ですか？

Kotlin/Nativeは、JavaやSwiftが提供するものと同様の自動メモリ管理スキームを使用します。

[Kotlin/Nativeメモリマネージャーについて学習する](native-memory-manager.md)

## 共有ライブラリを作成するにはどうすればよいですか？

Gradleビルドファイルで、コンパイラオプション `-produce dynamic` または `binaries.sharedLib()` を使用します。

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

これは、プラットフォーム固有の共有オブジェクト (Linuxでは `.so`、macOSでは `.dylib`、Windowsターゲットでは `.dll`) とC言語ヘッダーを生成し、C/C++コードからKotlin/Nativeプログラムで利用可能なすべての公開APIを使用できるようにします。

[Kotlin/Nativeを動的ライブラリとして使用するチュートリアルを完了する](native-dynamic-libraries.md)

## 静的ライブラリまたはオブジェクトファイルを作成するにはどうすればよいですか？

Gradleビルドファイルで、コンパイラオプション `-produce static` または `binaries.staticLib()` を使用します。

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

これは、プラットフォーム固有の静的オブジェクト (`.a` ライブラリ形式) とC言語ヘッダーを生成し、C/C++コードからKotlin/Nativeプログラムで利用可能なすべての公開APIを使用できるようにします。

## 会社のプロキシの背後でKotlin/Nativeを実行するにはどうすればよいですか？

Kotlin/Nativeはプラットフォーム固有のツールチェーンをダウンロードする必要があるため、コンパイラまたは `gradlew` の引数として `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` を指定するか、`JAVA_OPTS` 環境変数経由で設定する必要があります。

## KotlinフレームワークのカスタムObjective-Cプレフィックス/名前を指定するにはどうすればよいですか？

コンパイラオプション `-module-name` または対応するGradle DSLステートメントを使用します。

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</tab>
</tabs>

## iOSフレームワークの名前を変更するにはどうすればよいですか？

iOSフレームワークのデフォルト名は `<project name>.framework` です。
カスタム名を設定するには、`baseName` オプションを使用します。これによりモジュール名も設定されます。

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## Kotlinフレームワークのbitcodeを有効にするにはどうすればよいですか？

ビットコードの埋め込みは、すべてのAppleターゲット向けにXcode 14で非推奨となり、Xcode 15で削除されました。
Kotlin 2.0.20以降、Kotlin/Nativeコンパイラはビットコードの埋め込みをサポートしていません。

以前のバージョンのXcodeを使用しているものの、Kotlin 2.0.20以降のバージョンにアップグレードしたい場合は、Xcodeプロジェクトでビットコードの埋め込みを無効にしてください。

## 異なるコルーチンからオブジェクトを安全に参照するにはどうすればよいですか？

Kotlin/Nativeで複数のコルーチン間でオブジェクトに安全にアクセスまたは更新するには、`@Volatile` や `AtomicReference` などの並行処理セーフな構造の使用を検討してください。

`var` プロパティをアノテーションするには、[`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/) を使用します。これにより、そのプロパティのバッキングフィールドへのすべての読み書きがアトミックになります。さらに、書き込みは他のスレッドに即座に可視になります。別のスレッドがこのプロパティにアクセスすると、更新された値だけでなく、更新前に発生した変更も観測します。

あるいは、アトミックな読み書きをサポートする [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/) を使用します。Kotlin/Nativeでは、これはvolatile変数をラップし、アトミック操作を実行します。Kotlinはまた、特定のデータ型に合わせたアトミック操作のための型のセットを提供しています。`AtomicInt`、`AtomicLong`、`AtomicBoolean`、`AtomicArray`、さらに `AtomicIntArray` や `AtomicLongArray` を使用できます。

共有可変状態へのアクセスに関する詳細については、[コルーチンに関するドキュメント](shared-mutable-state-and-concurrency.md) を参照してください。

## 未リリースのKotlin/Nativeバージョンでプロジェクトをコンパイルするにはどうすればよいですか？

まず、[プレビューバージョン](eap.md) を試すことを検討してください。

さらに新しい開発バージョンが必要な場合は、Kotlin/Nativeをソースコードからビルドできます。[Kotlinリポジトリ](https://github.com/JetBrains/kotlin) をクローンし、[これらの手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source) に従ってください。