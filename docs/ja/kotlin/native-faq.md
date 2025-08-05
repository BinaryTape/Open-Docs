[//]: # (title: Kotlin/Native FAQ)

## プログラムを実行するには？

渡された引数に興味がない場合は、トップレベル関数 `fun main(args: Array<String>)` または単に `fun main()` を定義してください。パッケージ内にないことを確認してください。
また、`Array<String>` を引数にとる、または引数をとらない、かつ `Unit` を返す任意の関数をエントリポイントにするために、コンパイラスイッチ `-entry` を使用できます。

## Kotlin/Nativeのメモリ管理モデルとは？

Kotlin/Nativeは、JavaやSwiftが提供するものと同様の自動メモリ管理スキームを使用しています。

[Kotlin/Nativeメモリマネージャーについて学ぶ](native-memory-manager.md)

## 共有ライブラリを作成するには？

コンパイラオプション `-produce dynamic` またはGradleビルドファイルで `binaries.sharedLib()` を使用します。

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

これはプラットフォーム固有の共有オブジェクト（Linuxでは `.so`、macOSでは `.dylib`、Windowsターゲットでは `.dll`）とC言語ヘッダーを生成し、Kotlin/Nativeプログラムで利用可能なすべてのパブリックAPIをC/C++コードから使用できるようにします。

[Kotlin/Nativeを動的ライブラリとして使用するチュートリアルを完了する](native-dynamic-libraries.md)

## 静的ライブラリまたはオブジェクトファイルを作成するには？

コンパイラオプション `-produce static` またはGradleビルドファイルで `binaries.staticLib()` を使用します。

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

これはプラットフォーム固有の静的オブジェクト（`.a` ライブラリ形式）とC言語ヘッダーを生成し、Kotlin/Nativeプログラムで利用可能なすべてのパブリックAPIをC/C++コードから使用できるようにします。

## 企業プロキシの背後でKotlin/Nativeを実行するには？

Kotlin/Nativeはプラットフォーム固有のツールチェインをダウンロードする必要があるため、コンパイラまたは `gradlew` の引数として `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` を指定するか、`JAVA_OPTS` 環境変数で設定する必要があります。

## KotlinフレームワークにカスタムのObjective-Cプレフィックス/名を指定するには？

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

## iOSフレームワークの名前を変更するには？

iOSフレームワークのデフォルト名は `<project name>.framework` です。
カスタム名を設定するには、`baseName` オプションを使用します。これにより、モジュール名も設定されます。

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

## KotlinフレームワークでBitcodeを有効にするには？

Bitcodeの埋め込みは、Xcode 14で非推奨となり、Xcode 15で全てのAppleターゲットから削除されました。
Kotlin/Nativeコンパイラは、Kotlin 2.0.20以降、bitcodeの埋め込みをサポートしていません。

以前のバージョンのXcodeを使用しているが、Kotlin 2.0.20以降のバージョンにアップグレードしたい場合は、Xcodeプロジェクトでbitcodeの埋め込みを無効にしてください。

## 異なるコルーチンからオブジェクトを安全に参照するには？

Kotlin/Nativeで複数のコルーチン間でオブジェクトに安全にアクセスまたは更新するには、`@Volatile` や `AtomicReference` といった並行処理セーフな構造体を使用することを検討してください。

[`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/) を使用して `var` プロパティにアノテーションを付けます。
これにより、プロパティのバッキングフィールドへのすべての読み書きがアトミックになります。さらに、書き込みは他のスレッドからすぐに可視になります。別のスレッドがこのプロパティにアクセスすると、更新された値だけでなく、更新前に発生した変更も観測されます。

あるいは、アトミックな読み取りと更新をサポートする [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/) を使用します。Kotlin/Nativeでは、これはvolatile変数をラップし、アトミック操作を実行します。
Kotlinは、特定のデータ型に合わせたアトミック操作のための型のセットも提供しています。`AtomicInt`、`AtomicLong`、`AtomicBoolean`、`AtomicArray`、さらに `AtomicIntArray` と `AtomicLongArray` を使用できます。

共有ミュータブル状態へのアクセスに関する詳細については、[コルーチンに関するドキュメント](shared-mutable-state-and-concurrency.md)を参照してください。

## 未リリースのKotlin/Nativeバージョンでプロジェクトをコンパイルするには？

まず、[プレビューバージョン](eap.md)を試すことを検討してください。

さらに新しい開発バージョンが必要な場合は、Kotlin/Nativeをソースコードからビルドできます。[Kotlinリポジトリ](https://github.com/JetBrains/kotlin)をクローンし、[これらの手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source)に従ってください。