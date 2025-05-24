---
title: "Kotlin/Native FAQ"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## プログラムを実行するにはどうすればよいですか？

トップレベル関数 `fun main(args: Array<String>)` を定義するか、引数に興味がない場合は `fun main()` だけを定義してください。これがパッケージ内にないことを確認してください。
また、コンパイラースイッチ `-entry` を使用すると、`Array<String>` を引数に取るか引数を取らずに `Unit` を返す任意の関数を
エントリーポイントとして指定できます。

## Kotlin/Native のメモリー管理モデルとは何ですか？

Kotlin/Native は、Java や Swift が提供するものと同様の自動メモリー管理スキームを使用しています。

[Kotlin/Native のメモリーマネージャーについて学ぶ](native-memory-manager)

## 共有ライブラリーを作成するにはどうすればよいですか？

`-produce dynamic` コンパイラーオプションを使用するか、Gradle ビルドファイルで `binaries.sharedLib()` を使用します。

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

これにより、プラットフォーム固有の共有オブジェクト (Linux では `.so`、macOS では `.dylib`、Windows ターゲットでは `.dll`) と、
C 言語ヘッダーが生成され、Kotlin/Native プログラムで利用可能なすべてのパブリック API を C/C++ コードから使用できます。

[動的ライブラリーとしての Kotlin/Native チュートリアルを完了する](native-dynamic-libraries)

## 静的ライブラリーまたはオブジェクトファイルを作成するにはどうすればよいですか？

`-produce static` コンパイラーオプションを使用するか、Gradle ビルドファイルで `binaries.staticLib()` を使用します。

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

これにより、プラットフォーム固有の静的オブジェクト (`.a` ライブラリー形式) と C 言語ヘッダーが生成され、Kotlin/Native プログラムで利用可能なすべてのパブリック API を C/C++ コードから使用できます。

## 企業プロキシーの背後で Kotlin/Native を実行するにはどうすればよいですか？

Kotlin/Native はプラットフォーム固有のツールチェーンをダウンロードする必要があるため、
`-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` をコンパイラーまたは `gradlew` の引数として指定するか、
`JAVA_OPTS` 環境変数を使用して設定する必要があります。

## Kotlin フレームワークのカスタム Objective-C プレフィックス/名を指定するにはどうすればよいですか？

`-module-name` コンパイラーオプションまたは一致する Gradle DSL ステートメントを使用します。

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</TabItem>
</Tabs>

## iOS フレームワークの名前を変更するにはどうすればよいですか？

iOS フレームワークのデフォルトの名前は `<project name>.framework` です。
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

## Kotlin フレームワークで bitcode を有効にするにはどうすればよいですか？

Bitcode の埋め込みは Xcode 14 で非推奨となり、Xcode 15 で Apple のすべてのターゲットで削除されました。
Kotlin/Native コンパイラーは Kotlin 2.0.20 以降、bitcode の埋め込みをサポートしていません。

以前のバージョンの Xcode を使用しているが、Kotlin 2.0.20 以降のバージョンにアップグレードする場合は、Xcode プロジェクトで bitcode の埋め込みを無効にしてください。

## InvalidMutabilityException が表示されるのはなぜですか？

:::note
この問題は、レガシーメモリーマネージャーにのみ関連します。[Kotlin/Native のメモリー管理](native-memory-manager) を参照して、Kotlin 1.7.20 以降でデフォルトで有効になっている新しいメモリーマネージャーについて学んでください。

:::

これは、フリーズされたオブジェクトを変更しようとしている場合に発生する可能性があります。オブジェクトは、`kotlin.native.concurrent.freeze` が呼び出されたオブジェクトから到達可能なオブジェクトとして明示的に、
または暗黙的に (`enum` またはグローバルシングルトンオブジェクトから到達可能 - 次の質問を参照) フリーズされた状態に移行できます。

## シングルトンオブジェクトをミュータブルにするにはどうすればよいですか？

:::note
この問題は、レガシーメモリーマネージャーにのみ関連します。[Kotlin/Native のメモリー管理](native-memory-manager) を参照して、Kotlin 1.7.20 以降でデフォルトで有効になっている新しいメモリーマネージャーについて学んでください。

:::

現在、シングルトンオブジェクトはイミュータブル (つまり、作成後にフリーズ) であり、一般的にグローバル状態をイミュータブルにすることが
良い習慣とされています。何らかの理由でそのようなオブジェクト内にミュータブルな状態が必要な場合は、オブジェクトに `@konan.ThreadLocal` アノテーションを使用します。
また、`kotlin.native.concurrent.AtomicReference` クラスを使用して、フリーズされたオブジェクト内のフリーズされたオブジェクトへのさまざまなポインターを格納し、それらを自動的に更新することもできます。

## 未リリースの Kotlin/Native バージョンでプロジェクトをコンパイルするにはどうすればよいですか？

まず、[プレビューバージョン](eap) を試すことを検討してください。

さらに最新の開発バージョンが必要な場合は、ソースコードから Kotlin/Native をビルドできます。
[Kotlin リポジトリー](https://github.com/JetBrains/kotlin) をクローンし、[これらの手順](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README#building-from-source) に従ってください。