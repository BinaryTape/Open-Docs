[//]: # (title: Kotlin 2.2.0 の新機能)

[Kotlin 言語設計機能とプロポーザルの全リストを見る](kotlin-language-features-and-proposals.md)。

## Kotlin コンパイラ: コンパイラ警告の統一管理
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 では、新しいコンパイラオプション `-Xwarning-level` が導入されました。これは、Kotlin プロジェクトにおけるコンパイラ警告を管理するための統一された方法を提供するために設計されています。

以前は、`-nowarn` で全ての警告を無効にする、`-Werror` で全ての警告をコンパイルエラーにする、`-Wextra` で追加のコンパイラチェックを有効にするといった、モジュール全体の一般的なルールしか適用できませんでした。特定の警告に対してこれらを調整する唯一のオプションは `-Xsuppress-warning` でした。

新しいソリューションを使用すると、一般的なルールを上書きしたり、特定の診断を排除したりすることが、一貫した方法で行えるようになります。

### 適用方法

新しいコンパイラオプションの構文は以下の通りです：

```bash
-Xwarning-level=DIAGNOSTIC_NAME:(error|warning|disabled)
```

* `error`: 指定された警告をエラーに格上げします。
* `warning`: 警告を出力します（デフォルトで有効）。
* `disabled`: 指定された警告をモジュール全体で完全に抑制します。

新しいコンパイラオプションで設定できるのは、*警告（warnings）* の重大度レベルのみであることに注意してください。

### ユースケース

新しいソリューションを使用すると、一般的なルールと特定のルールを組み合わせることで、プロジェクト内の警告レポートをより細かく調整できます。ユースケースを選択してください：

#### 警告を抑制する

| コマンド                                           | 説明                                            |
|---------------------------------------------------|------------------------------------------------|
| [`-nowarn`](compiler-reference.md#nowarn)         | コンパイル中の全ての警告を抑制します。               |
| `-Xwarning-level=DIAGNOSTIC_NAME:disabled`        | 指定された警告のみを抑制します。                     |
| `-nowarn -Xwarning-level=DIAGNOSTIC_NAME:warning` | 指定された警告以外の全ての警告を抑制します。           |

#### 警告をエラーに格上げする

| コマンド                                           | 説明                                                  |
|---------------------------------------------------|------------------------------------------------------|
| [`-Werror`](compiler-reference.md#werror)         | 全ての警告をコンパイルエラーに格上げします。           |
| `-Xwarning-level=DIAGNOSTIC_NAME:error`           | 指定された警告のみをエラーに格上げします。             |
| `-Werror -Xwarning-level=DIAGNOSTIC_NAME:warning` | 指定された警告以外の全ての警告をエラーに格上げします。 |

#### 追加のコンパイラ警告を有効にする

| コマンド                                            | 説明                                                                                          |
|----------------------------------------------------|----------------------------------------------------------------------------------------------|
| [`-Wextra`](compiler-reference.md#wextra)          | 警告を出力する、全ての追加の宣言、式、型のコンパイラチェックを有効にします。                         |
| `-Xwarning-level=DIAGNOSTIC_NAME:warning`          | 指定された追加のコンパイラチェックのみを有効にします。                                               |
| `-Wextra -Xwarning-level=DIAGNOSTIC_NAME:disabled` | 指定されたチェック以外の全ての追加チェックを有効にします。                                             |

#### 警告リスト

一般的なルールから除外したい警告が多数ある場合は、[`@argfile`](compiler-reference.md#argfile) を通じて別のファイルにリスト化できます。

### フィードバックのお願い

この新しいコンパイラオプションはまだ [Experimental（実験的）](components-stability.md#stability-levels-explained) です。問題が発生した場合は、問題トラッカー [YouTrack](https://kotl.in/issue) に報告してください。

## Kotlin/JVM

Kotlin 2.2.0 では JVM 向けに多くのアップデートが行われました。コンパイラが Java 24 バイトコードをサポートするようになり、インターフェース関数のデフォルトメソッド生成に変更が導入されました。本リリースでは、Kotlin メタデータ内のアノテーションの操作も簡素化され、インライン値クラスによる Java との相互運用性が向上し、JVM レコードへのアノテーション付加のサポートも改善されました。

### インターフェース関数のデフォルトメソッド生成に関する変更

Kotlin 2.2.0 以降、インターフェースで宣言された関数は、別途設定されていない限り JVM デフォルトメソッドとしてコンパイルされます。
この変更は、実装を持つ Kotlin のインターフェース関数がバイトコードにコンパイルされる方法に影響します。

この動作は、非推奨となった `-Xjvm-default` オプションに代わる、新しい安定したコンパイラオプション `-jvm-default` によって制御されます。

`-jvm-default` オプションの動作は、以下の値を使用して制御できます：

* `enable`（デフォルト）：インターフェースにデフォルト実装を生成し、サブクラスと `DefaultImpls` クラスにブリッジ関数を含めます。古いバージョンの Kotlin とのバイナリ互換性を維持したい場合にこのモードを使用します。
* `no-compatibility`：インターフェースにデフォルト実装のみを生成します。互換性ブリッジや `DefaultImpls` クラスをスキップするため、新しいコードに適しています。
* `disable`：インターフェースでのデフォルト実装を無効にします。ブリッジ関数と `DefaultImpls` クラスのみが生成され、Kotlin 2.2.0 以前の動作と一致します。

`-jvm-default` コンパイラオプションを構成するには、Gradle Kotlin DSL で `jvmDefault` プロパティを設定します：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        jvmDefault = JvmDefaultMode.NO_COMPATIBILITY
    }
}
```

### Kotlin メタデータ内のアノテーションの読み書きのサポート
<primary-label ref="experimental-general"/>

以前は、リフレクションやバイトコード解析を使用してコンパイル済みの JVM クラスファイルからアノテーションを読み取り、シグネチャに基づいて手動でメタデータエントリと照合する必要がありました。
このプロセスは、特に関数がオーバーロードされている場合に間違いが発生しやすいものでした。

Kotlin 2.2.0 では、[](metadata-jvm.md) に Kotlin メタデータに保存されたアノテーションの読み取りサポートが導入されました。

コンパイル済みファイルのメタデータでアノテーションを利用可能にするには、以下のコンパイラオプションを追加します：

```kotlin
-Xannotations-in-metadata
```

または、Gradle ビルドファイルの `compilerOptions {}` ブロックに追加します：

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

このオプションを有効にすると、Kotlin コンパイラは JVM バイトコードと共にメタデータにアノテーションを書き込み、`kotlin-metadata-jvm` ライブラリからアクセスできるようにします。

ライブラリは、アノテーションにアクセスするための以下の API を提供します：

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

これらの API は [Experimental（実験的）](components-stability.md#stability-levels-explained) です。
オプトインするには、`@OptIn(ExperimentalAnnotationsInMetadata::class)` アノテーションを使用してください。

以下は、Kotlin メタデータからアノテーションを読み取る例です：

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // [@Label(value = StringValue("Message class"))]
}
```

> プロジェクトで `kotlin-metadata-jvm` ライブラリを使用している場合は、アノテーションをサポートするようにコードをテストおよび更新することをお勧めします。
> そうしないと、将来の Kotlin バージョンでメタデータ内のアノテーションが [デフォルトで有効](https://youtrack.jetbrains.com/issue/KT-75736) になった際に、プロジェクトが不正確または不完全なメタデータを生成する可能性があります。
>
> 問題が発生した場合は、[問題トラッカー](https://youtrack.jetbrains.com/issue/KT-31857) に報告してください。
>
{style="warning"}

### インライン値クラスによる Java 相互運用性の向上
<primary-label ref="experimental-general"/>

Kotlin 2.2.0 では、新しい実験的なアノテーション [`@JvmExposeBoxed`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.jvm/-jvm-expose-boxed/) が導入されました。このアノテーションを使用すると、Java から [インライン値クラス（inline value classes）](inline-classes.md) を利用しやすくなります。

この機能の概要については、こちらの動画をご覧ください：

<video src="https://www.youtube.com/v/KSvq7jHr1lo" title="Exposed inline value classes for Java in Kotlin 2.2.0"/>

デフォルトでは、Kotlin はインライン値クラスをコンパイルして **アンボックス化された表現（unboxed representations）** を使用します。これはパフォーマンスに優れていますが、Java からの使用は困難、あるいは不可能な場合が多いです。例えば：

```kotlin
@JvmInline value class PositiveInt(val number: Int) {
    init { require(number >= 0) }
}
```

この場合、クラスがアンボックス化されているため、Java が呼び出せるコンストラクタが存在しません。また、Java が `init` ブロックをトリガーして `number` が正であることを保証する方法もありません。

クラスに `@JvmExposeBoxed` アノテーションを付けると、Kotlin は Java が直接呼び出せる公開コンストラクタを生成し、`init` ブロックも確実に実行されるようにします。

`@JvmExposeBoxed` アノテーションをクラス、コンストラクタ、または関数レベルで適用して、Java に公開する内容を細かく制御できます。

例えば、以下のコードでは、拡張関数 `.timesTwoBoxed()` は Java からアクセス **できません**：

```kotlin
@JvmInline
value class MyInt(val value: Int)

fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

Java コードから `MyInt` クラスのインスタンスを作成し、`.timesTwoBoxed()` 関数を呼び出せるようにするには、クラスと関数の両方に `@JvmExposeBoxed` アノテーションを追加します：

```kotlin
@JvmExposeBoxed
@JvmInline
value class MyInt(val value: Int)

@JvmExposeBoxed
fun MyInt.timesTwoBoxed(): MyInt = MyInt(this.value * 2)
```

これらのアノテーションにより、Kotlin コンパイラは `MyInt` クラスに対して Java からアクセス可能なコンストラクタを生成します。また、値クラスのボックス化された形式を使用する拡張関数のオーバーロードも生成します。その結果、以下の Java コードが正常に動作します：

```java
MyInt input = new MyInt(5);
MyInt output = ExampleKt.timesTwoBoxed(input);
```

公開したいインライン値クラスの各部分に個別にアノテーションを付けたくない場合は、モジュール全体に実質的にアノテーションを適用できます。モジュールにこの動作を適用するには、`-Xjvm-expose-boxed` オプションを付けてコンパイルします。このオプションを使用してコンパイルすることは、モジュール内のすべての宣言に `@JvmExposeBoxed` アノテーションがあるかのように扱うのと同じ効果があります。

この新しいアノテーションは、Kotlin が内部的に値クラスをコンパイルまたは使用する方法を変更するものではなく、既存のコンパイル済みコードはすべて有効なままです。単に Java との相互運用性を向上させるための新しい機能を追加するだけです。値クラスを使用する Kotlin コードのパフォーマンスへの影響はありません。

`@JvmExposeBoxed` アノテーションは、メンバー関数のボックス化されたバリアントを公開し、ボックス化された戻り値の型を受け取りたいライブラリ作成者にとって便利です。これにより、インライン値クラス（効率的だが Kotlin 専用）とデータクラス（Java と互換性があるが常にボックス化される）のどちらかを選択する必要がなくなります。

`@JvmExposeBoxed` アノテーションがどのように機能し、どのような問題を解決するかについての詳細は、この [KEEP](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md) プロポーザルを参照してください。

### JVM レコードへのアノテーション付加のサポート改善

Kotlin は Kotlin 1.5.0 から [JVM レコード（JVM records）](jvm-records.md) をサポートしています。Kotlin 2.2.0 では、特に Java の [`RECORD_COMPONENT`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/lang/annotation/ElementType.html#RECORD_COMPONENT) ターゲットに関して、レコードコンポーネント上のアノテーションの処理方法が改善されました。

まず、`RECORD_COMPONENT` をアノテーションターゲットとして使用したい場合は、Kotlin (`@Target`) と Java の両方のアノテーションを手動で追加する必要があります。これは、Kotlin の `@Target` アノテーションが `RECORD_COMPONENT` をサポートしていないためです。例えば：

```kotlin
@Target(AnnotationTarget.CLASS, AnnotationTarget.PROPERTY)
@java.lang.annotation.Target(ElementType.CLASS, ElementType.RECORD_COMPONENT)
annotation class exampleClass
```

両方のリストを手動で維持するのは間違いやすいため、Kotlin 2.2.0 では Kotlin と Java のターゲットが一致しない場合にコンパイラ警告を出すようになりました。例えば、Java ターゲットリストに `ElementType.CLASS` が欠けている場合、コンパイラは以下を報告します：

```
Incompatible annotation targets: Java target 'CLASS' missing, corresponding to Kotlin targets 'CLASS'.
```

次に、レコード内のアノテーション伝播に関して、Kotlin の動作は Java と異なります。Java では、レコードコンポーネント上のアノテーションは、自動的にバッキングフィールド、ゲッター、およびコンストラクタパラメータに適用されます。Kotlin はデフォルトではこれを行いませんが、[`@all:` 使用箇所ターゲット](#all-meta-target-for-properties) を使用してこの動作を再現できるようになりました。

例えば：

```kotlin
@JvmRecord
data class Person(val name: String, @all:Positive val age: Int)
```

`@JvmRecord` と `@all:` を併用すると、Kotlin は以下のようになります：

* アノテーションをプロパティ、バッキングフィールド、コンストラクタパラメータ、およびゲッターに伝播させます。
* アノテーションが Java の `RECORD_COMPONENT` をサポートしている場合、レコードコンポーネントにもアノテーションを適用します。

## Kotlin/Native

2.2.0 以降、Kotlin/Native は LLVM 19 を使用します。本リリースでは、メモリ消費を追跡・調整するために設計されたいくつかの実験的な機能も導入されています。

### オブジェクトごとのメモリ割り当て
<primary-label ref="experimental-opt-in"/>

Kotlin/Native の [メモリ割り当てツール（memory allocator）](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README.md) が、オブジェクトごとにメモリを予約できるようになりました。特定のケースでは、厳しいメモリ制限を満たしたり、アプリケーション起動時のメモリ消費を抑えたりするのに役立ちます。

この新機能は、デフォルトのメモリアロケータの代わりにシステムメモリアロケータを有効にしていた `-Xallocator=std` コンパイラオプションを置き換えるように設計されています。今後は、メモリアロケータを切り替えることなく、バッファリング（割り当てのページング）を無効にできます。

この機能は現在 [Experimental（実験的）](components-stability.md#stability-levels-explained) です。
有効にするには、`gradle.properties` ファイルに以下のオプションを設定してください：

```none
kotlin.native.binary.pagedAllocator=false
```

問題が発生した場合は、問題トラッカー [YouTrack](https://kotl.in/issue) に報告してください。

### ランタイムでの Latin-1 エンコード文字列のサポート
<primary-label ref="experimental-opt-in"/>

[JVM](https://openjdk.org/jeps/254) と同様に、Kotlin が Latin-1 エンコード文字列をサポートするようになりました。これにより、アプリケーションのバイナリサイズを縮小し、メモリ消費を調整するのに役立ちます。

デフォルトでは、Kotlin の文字列は各文字を 2 バイトで表す UTF-16 エンコーディングを使用して保存されます。場合によっては、ソースコードと比較してバイナリ内の文字列が 2 倍のスペースを占めたり、単純な ASCII ファイルからデータを読み込む際にディスク上のファイル保存の 2 倍のメモリを消費したりすることがあります。

一方、[Latin-1 (ISO 8859-1)](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) エンコーディングは、最初の 256 個の Unicode 文字のそれぞれをわずか 1 バイトで表します。Latin-1 サポートが有効な場合、文字列のすべての文字がその範囲内に収まる限り、文字列は Latin-1 エンコーディングで保存されます。それ以外の場合は、デフォルトの UTF-16 エンコーディングが使用されます。

#### Latin-1 サポートを有効にする方法

この機能は現在 [Experimental（実験的）](components-stability.md#stability-levels-explained) です。
有効にするには、`gradle.properties` ファイルに以下のオプションを設定してください：

```none
kotlin.native.binary.latin1Strings=true
```
#### 既知の問題

この機能が実験段階である間は、cinterop 拡張関数の [`String.pin`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/pin.html)、[`String.usePinned`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/use-pinned.html)、および [`String.refTo`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlinx.cinterop/ref-to.html) の効率が低下します。これらの各呼び出しにより、UTF-16 への自動文字列変換がトリガーされる可能性があります。

Kotlin チームは、Google の同僚、特にこの機能を実装してくれた [Sonya Valchuk](https://github.com/pyos) 氏に深く感謝します。

Kotlin でのメモリ消費に関する詳細は、[ドキュメント](native-memory-manager.md#memory-consumption) を参照してください。

### Apple プラットフォームでのメモリ消費の追跡改善

Kotlin 2.2.0 以降、Kotlin コードによって割り当てられたメモリにタグが付けられるようになりました。これにより、Apple プラットフォームでのメモリ問題のデバッグに役立ちます。

アプリケーションの高いメモリ使用量を調査する際に、Kotlin コードによってどれだけのメモリが予約されているかを特定できるようになりました。Kotlin の共有分には識別子がタグ付けされ、Xcode Instruments の VM Tracker などのツールを通じて追跡できます。

この機能はデフォルトで有効になっていますが、以下の条件が *すべて* 満たされている場合にのみ、Kotlin/Native デフォルトメモリアロケータで利用可能です：

* **タグ付けが有効であること**。メモリには有効な識別子がタグ付けされている必要があります。Apple は 240 から 255 の間の数字を推奨しており、デフォルト値は 246 です。

  `kotlin.native.binary.mmapTag=0` Gradle プロパティを設定すると、タグ付けは無効になります。

* **mmap による割り当て**。アロケータは `mmap` システムコールを使用してファイルをメモリにマップする必要があります。

  `kotlin.native.binary.disableMmap=true` Gradle プロパティを設定すると、デフォルトのアロケータは `mmap` の代わりに `malloc` を使用します。

* **ページングが有効であること**。割り当てのページング（バッファリング）が有効である必要があります。

  [`kotlin.native.binary.pagedAllocator=false`](#per-object-memory-allocation) Gradle プロパティを設定すると、メモリはオブジェクトごとに予約されます。

Kotlin でのメモリ消費に関する詳細は、[ドキュメント](native-memory-manager.md#memory-consumption) を参照してください。

### LLVM のアップデート（16 から 19 へ）

Kotlin 2.2.0 では、LLVM をバージョン 16 から 19 にアップデートしました。
新しいバージョンには、パフォーマンスの向上、バグ修正、およびセキュリティアップデートが含まれています。

このアップデートによってコードに影響が出ることはありませんが、問題が発生した場合は [問題トラッカー](http://kotl.in/issue) に報告してください。

### Windows 7 ターゲットの非推奨化

Kotlin 2.2.0 以降、サポートされる Windows の最小バージョンが Windows 7 から Windows 10 に引き上げられました。Microsoft が 2025 年 1 月に Windows 7 のサポートを終了したため、このレガシーターゲットを非推奨にすることを決定しました。

詳細については、[](native-target-support.md) を参照してください。

## Kotlin/Wasm

本リリースでは、[Wasm ターゲットのビルドインフラストラクチャが JavaScript ターゲットから分離されました](#build-infrastructure-for-wasm-target-separated-from-javascript-target)。さらに、[Binaryen ツールをプロジェクトまたはモジュールごとに設定](#per-project-binaryen-configuration)できるようになりました。

### Wasm ターゲットのビルドインフラストラクチャを JavaScript ターゲットから分離

以前は、`wasmJs` ターゲットは `js` ターゲットと同じインフラストラクチャを共有していました。その結果、両方のターゲットは同じディレクトリ (`build/js`) にホストされ、同じ NPM タスクと設定を使用していました。

今回、`wasmJs` ターゲットは `js` ターゲットから独立した独自のインフラストラクチャを持つようになりました。これにより、Wasm のタスクと型を JavaScript のものと区別でき、独立した設定が可能になります。

また、Wasm 関連のプロジェクトファイルと NPM 依存関係は、別の `build/wasm` ディレクトリに保存されるようになりました。

Wasm 用に新しい NPM 関連タスクが導入され、既存の JavaScript タスクは JavaScript 専用になりました：

| **Wasm タスク**         | **JavaScript タスク** |
|------------------------|----------------------|
| `kotlinWasmNpmInstall` | `kotlinNpmInstall`   |
| `wasmRootPackageJson`  | `rootPackageJson`    |

同様に、新しい Wasm 固有の宣言が追加されました：

| **Wasm 宣言**             | **JavaScript 宣言** |
|---------------------------|-----------------------------|
| `WasmNodeJsRootPlugin`    | `NodeJsRootPlugin`          |
| `WasmNodeJsPlugin`        | `NodeJsPlugin`              |
| `WasmYarnPlugin`          | `YarnPlugin`                |
| `WasmNodeJsRootExtension` | `NodeJsRootExtension`       |
| `WasmNodeJsEnvSpec`       | `NodeJsEnvSpec`             |
| `WasmYarnRootEnvSpec`     | `YarnRootEnvSpec`           |

JavaScript ターゲットから独立して Wasm ターゲットを扱えるようになり、設定プロセスが簡素化されます。

この変更はデフォルトで有効になっており、追加のセットアップは必要ありません。

### プロジェクトごとの Binaryen 設定

Kotlin/Wasm で [プロダクションビルドを最適化](whatsnew20.md#optimized-production-builds-by-default-using-binaryen) するために使用される Binaryen ツールは、以前はルートプロジェクトで一度だけ設定されていました。

今回、Binaryen ツールをプロジェクトまたはモジュールごとに設定できるようになりました。この変更は Gradle のベストプラティスに沿ったもので、[プロジェクト分離（project isolation）](https://docs.gradle.org/current/userguide/isolated_projects.html) などの機能のより良いサポートを保証し、複雑なビルドにおけるビルドパフォーマンスと信頼性を向上させます。

さらに、必要に応じてモジュールごとに異なるバージョンの Binaryen を設定することも可能になりました。

この機能はデフォルトで有効になっています。ただし、Binaryen のカスタム設定を行っている場合は、ルートプロジェクトだけでなく、プロジェクトごとに適用する必要があります。

## Kotlin/JS

本リリースでは、[`@JsPlainObject` インターフェースの `copy()` 関数](#fix-for-copy-in-jsplainobject-interfaces)、[`@JsModule` アノテーションを持つファイル内の型エイリアス](#support-for-type-aliases-in-files-with-jsmodule-annotation)、およびその他の Kotlin/JS 機能が改善されました。

### `@JsPlainObject` インターフェースの `copy()` の修正

Kotlin/JS には `js-plain-objects` という実験的なプラグインがあり、`@JsPlainObject` でアノテーションされたインターフェース向けに `copy()` 関数を導入していました。`copy()` 関数を使用してオブジェクトを操作できます。

しかし、`copy()` の初期の実装は継承と互換性がなく、`@JsPlainObject` インターフェースが他のインターフェースを拡張する場合に問題が発生していました。

プレーンオブジェクトの制限を回避するため、`copy()` 関数はオブジェクト自体からそのコンパニオンオブジェクトに移動されました：

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
}

fun main() {
    val user = User(name = "SomeUser", age = 21)
    // この構文は無効になりました
    val copy = user.copy(age = 35)      
    // これが正しい構文です
    val copy = User.copy(user, age = 35)
}
```

この変更により、継承階層における競合が解決され、曖昧さが解消されます。
これは Kotlin 2.2.0 からデフォルトで有効になります。

### `@JsModule` アノテーションを持つファイルでの型エイリアスのサポート

以前は、JavaScript モジュールから宣言をインポートするために `@JsModule` でアノテーションされたファイルは、外部宣言（external declarations）のみに制限されていました。つまり、そのようなファイル内で `typealias` を宣言することはできませんでした。

Kotlin 2.2.0 以降、`@JsModule` が付いたファイル内でも型エイリアスを宣言できるようになりました：

```kotlin
@file:JsModule("somepackage")
package somepackage
typealias SomeClass = Any
```

この変更により Kotlin/JS の相互運用性の制限が一つ緩和され、将来のリリースではさらなる改善が計画されています。

`@JsModule` を持つファイルでの型エイリアスのサポートは、デフォルトで有効です。

### マルチプラットフォームの `expect` 宣言における `@JsExport` のサポート

Kotlin Multiplatform プロジェクトで [`expect/actual` メカニズム](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) を使用する際、共通（common）コードの `expect` 宣言に対して `@JsExport` アノテーションを使用することはできませんでした。

本リリースから、`expect` 宣言に直接 `@JsExport` を適用できるようになりました：

```kotlin
// commonMain

// 以前はエラーでしたが、正しく動作するようになりました
@JsExport
expect class WindowManager {
    fun close()
}

@JsExport
fun acceptWindowManager(manager: WindowManager) {
    ...
}

// jsMain

@JsExport
actual class WindowManager {
    fun close() {
        window.close()
    }
}
```

JavaScript ソースセットの対応する `actual` 実装にも `@JsExport` を付ける必要があり、エクスポート可能な型のみを使用する必要があります。

この修正により、`commonMain` で定義された共有コードを JavaScript に正しくエクスポートできるようになります。手動の回避策を使用することなく、マルチプラットフォームコードを JavaScript 利用者に公開できるようになりました。

この変更はデフォルトで有効です。

### `Promise<Unit>` 型での `@JsExport` の使用が可能に

以前は、`@JsExport` アノテーションを付けて `Promise<Unit>` 型を返す関数をエクスポートしようとすると、Kotlin コンパイラがエラーを出していました。

`Promise<Int>` などの戻り値の型は正しく機能していましたが、`Promise<Unit>` を使用すると、TypeScript では正しく `Promise<void>` にマップされるにもかかわらず、「エクスポート不可能な型（non-exportable type）」という警告が表示されていました。

この制限は解除されました。現在、以下のコードはエラーなくコンパイルされます：

```kotlin
// 以前から正しく動作していたもの
@JsExport
fun fooInt(): Promise<Int> = GlobalScope.promise {
    delay(100)
    return@promise 42
}

// 以前はエラーでしたが、正しく動作するようになりました
@JsExport
fun fooUnit(): Promise<Unit> = GlobalScope.promise {
    delay(100)
}
```

この変更により、Kotlin/JS 相互運用モデルにおける不必要な制限が取り除かれました。この修正はデフォルトで有効です。

## Gradle

Kotlin 2.2.0 は、Gradle 7.6.3 から 8.14 までと完全に互換性があります。最新の Gradle リリースまでのバージョンも使用できますが、その場合は非推奨の警告が表示されたり、一部の新しい Gradle 機能が動作しなかったりする可能性があることに注意してください。

本リリースでは、Kotlin Gradle プラグインの診断機能にいくつかの改善が行われました。
また、[バイナリ互換性検証（binary compatibility validation）](#binary-compatibility-validation-included-in-kotlin-gradle-plugin) の実験的な統合が導入され、ライブラリの開発が容易になりました。

### Kotlin Gradle プラグインに含まれるバイナリ互換性検証
<primary-label ref="experimental-general"/>

ライブラリのバージョン間でのバイナリ互換性のチェックを容易にするため、[バイナリ互換性検証ツール（binary compatibility validator）](https://github.com/Kotlin/binary-compatibility-validator) の機能を Kotlin Gradle プラグイン (KGP) に移行する実験を行っています。小規模なプロジェクトで試すことは可能ですが、まだ本番環境での使用はお勧めしません。

オリジナルの [バイナリ互換性検証ツール](https://github.com/Kotlin/binary-compatibility-validator) は、この実験フェーズ中も引き続きメンテナンスされます。

Kotlin ライブラリは、JVM クラスファイルまたは `klib` の 2 つのバイナリ形式のいずれかを使用できます。これらの形式には互換性がないため、KGP はそれぞれを個別に処理します。

バイナリ互換性検証機能を有効にするには、`build.gradle.kts` ファイルの `kotlin{}` ブロックに以下を追加します：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        // 古いバージョンの Gradle との互換性を確保するために set() 関数を使用します
        enabled.set(true)
    }
}
```

プロジェクトにバイナリ互換性をチェックしたいモジュールが複数ある場合は、各モジュールで個別に設定してください。各モジュールは独自のカスタム設定を持つことができます。

有効にしたら、`checkLegacyAbi` Gradle タスクを実行してバイナリ互換性の問題をチェックします。IntelliJ IDEA 内で、またはプロジェクトディレクトリのコマンドラインからタスクを実行できます：

```kotlin
./gradlew checkLegacyAbi
```

このタスクは、現在のコードからアプリケーション・バイナリ・インターフェース (ABI) ダンプを UTF-8 テキストファイルとして生成します。
次に、新しいダンプを前のリリースのものと比較します。差異が見つかった場合、タスクはそれらをエラーとして報告します。エラーを確認し、変更が許容範囲内であると判断した場合は、`updateLegacyAbi` Gradle タスクを実行して参照 ABI ダンプを更新できます。

#### クラスのフィルタリング

この機能では、ABI ダンプ内のクラスをフィルタリングできます。名前または部分一致する名前、あるいはそれらをマークするアノテーション（またはアノテーション名の一部）によって、クラスを明示的に含めたり除外したりできます。

例えば、このサンプルは `com.company` パッケージ内のすべてのクラスを除外します：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        filters.excluded.byNames.add("com.company.**")
    }
}
```

バイナリ互換性検証ツールの設定についての詳細は、[KGP API リファレンス](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.dsl.abi/) を参照してください。

#### マルチプラットフォームにおける制限事項

マルチプラットフォームプロジェクトにおいて、ホストがすべてのターゲットのクロスコンパイルをサポートしていない場合、KGP は他のターゲットの ABI ダンプをチェックすることで、サポートされていないターゲットの ABI 変更を推測しようとします。このアプローチにより、後で **すべての** ターゲットをコンパイルできるホストに切り替えたときに、誤った検証失敗が発生するのを防ぐことができます。

`build.gradle.kts` ファイルに以下を追加することで、KGP がサポートされていないターゲットの ABI 変更を推測しないようにデフォルトの動作を変更できます：

```kotlin
// build.gradle.kts
kotlin {
    @OptIn(org.jetbrains.kotlin.gradle.dsl.abi.ExperimentalAbiValidation::class)
    abiValidation {
        klib {
            keepUnsupportedTargets = false
        }
    }
}
```

ただし、プロジェクトにサポートされていないターゲットがある場合、タスクが ABI ダンプを作成できないため、`checkLegacyAbi` タスクの実行は失敗します。他のターゲットからの推測によって互換性のない変更を見逃すよりも、チェックを失敗させることの方が重要な場合は、この動作が望ましいかもしれません。

### Kotlin Gradle プラグインでのコンソールのリッチ出力のサポート

Kotlin 2.2.0 では、Gradle ビルドプロセス中のコンソールでカラーなどのリッチ出力をサポートし、報告される診断結果を読みやすく理解しやすくしました。

リッチ出力は、Linux および macOS のサポートされているターミナルエミュレータで利用可能です。Windows へのサポートも現在進めています。

![Gradle コンソール](gradle-console-rich-output.png){width=600}

この機能はデフォルトで有効になっていますが、上書きしたい場合は、`gradle.properties` ファイルに以下の Gradle プロパティを追加してください：

```
org.gradle.console=plain
```

このプロパティとそのオプションの詳細については、Gradle のドキュメント [ログ形式のカスタマイズ](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_customizing_log_format) を参照してください。

### KGP 診断における Problems API の統合

以前、Kotlin Gradle Plugin (KGP) は、警告やエラーなどの診断情報をコンソールやログにプレーンテキストとして出力することしかできませんでした。

2.2.0 以降、KGP は追加のレポートメカニズムを導入しました。ビルドプロセス中にリッチで構造化された問題情報をレポートするための標準化された方法である [Gradle の Problems API](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.problems/index.html) を使用するようになりました。

KGP の診断は読みやすくなり、Gradle CLI や IntelliJ IDEA などの異なるインターフェース間でより一貫して表示されるようになります。

この統合は、Gradle 8.6 以降でデフォルトで有効になります。
API はまだ進化中であるため、最新の改善を享受するには最新の Gradle バージョンを使用してください。

### `--warning-mode` との KGP の互換性

これまでの Kotlin Gradle Plugin (KGP) の診断では、固定された重大度レベルを使用して問題をレポートしていたため、Gradle の [`--warning-mode` コマンドラインオプション](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:command_line_warnings) は KGP のエラー表示に影響を与えませんでした。

今回、KGP の診断が `--warning-mode` オプションに対応し、より柔軟性が増しました。例えば、すべての警告をエラーに変換したり、警告を完全に無効にしたりできます。

この変更により、KGP の診断は選択された警告モードに基づいて出力を調整します：

* `--warning-mode=fail` を設定すると、`Severity.Warning` の診断が `Severity.Error` に格上げされます。
* `--warning-mode=none` を設定すると、`Severity.Warning` の診断はログに出力されません。

この動作は、2.2.0 からデフォルトで有効になります。

`--warning-mode` オプションを無視するには、`gradle.properties` ファイルに以下の Gradle プロパティを設定してください：

```
kotlin.internal.diagnostics.ignoreWarningMode=true
```

## 新しい実験的なビルドツール API (BTA)
<primary-label ref="experimental-general"/>

Kotlin は、Gradle、Maven、Amper などのさまざまなビルドシステムで使用できます。しかし、インクリメンタルコンパイルのサポートや Kotlin コンパイラプラグイン、デーモン、Kotlin Multiplatform との互換性など、フル機能セットをサポートするために各システムに Kotlin を統合するには、多大な労力が必要です。

このプロセスを簡素化するため、Kotlin 2.2.0 では新しい実験的なビルドツール API (BTA) が導入されました。BTA は、ビルドシステムと Kotlin コンパイラエコシステムの間の抽象化レイヤーとして機能するユニバーサルな API です。このアプローチにより、各ビルドシステムは単一の BTA エントリポイントをサポートするだけで済みます。

現在、BTA は Kotlin/JVM のみをサポートしています。JetBrains の Kotlin チームはすでに Kotlin Gradle プラグイン (KGP) と `kotlin-maven-plugin` でこれを使用しています。これらのプラグインを通じて BTA を試すことができますが、API 自体は独自のビルドツール統合での一般的な使用にはまだ準備ができていません。BTA プロポーザルに興味がある場合やフィードバックを共有したい場合は、この [KEEP](https://github.com/Kotlin/KEEP/issues/421) プロポーザルを参照してください。

BTA を試すには：

* KGP の場合、`gradle.properties` ファイルに以下のプロパティを追加します：

```kotlin
kotlin.compiler.runViaBuildToolsApi=true
```   

* Maven の場合、何もする必要はありません。デフォルトで有効になっています。

現在、BTA は Maven プラグインに直接的なメリットをもたらしませんが、[Kotlin デーモンのサポート](https://youtrack.jetbrains.com/issue/KT-77587/Maven-Introduce-Kotlin-daemon-support-and-make-it-enabled-by-default) や [インクリメンタルコンパイルの安定化](https://youtrack.jetbrains.com/issue/KT-77086/Stabilize-incremental-compilation-in-Maven) など、新しい機能をより迅速に提供するための強固な基盤を築きます。

KGP の場合、BTA を使用することで次のようなメリットがすでにあります：

* [改善された「プロセス内」コンパイラ実行戦略](#improved-in-process-compiler-execution-strategy)
* [Kotlin から異なるコンパイラバージョンを構成できる柔軟性の向上](#flexibility-to-configure-different-compiler-versions-from-kotlin)

### 改善された「プロセス内」コンパイラ実行戦略

KGP は 3 つの [Kotlin コンパイラ実行戦略](gradle-compilation-and-caches.md#defining-kotlin-compiler-execution-strategy) をサポートしています。コンパイラを Gradle デーモンプロセス内で実行する「プロセス内（in process）」戦略は、以前はインクリメンタルコンパイルをサポートしていませんでした。

今回、BTA を使用することで、「プロセス内」戦略がインクリメンタルコンパイルを **サポート** するようになりました。これを使用するには、`gradle.properties` ファイルに以下のプロパティを追加してください：

```kotlin
kotlin.compiler.execution.strategy=in-process
```

### Kotlin から異なるコンパイラバージョンを構成できる柔軟性

ビルドスクリプトの非推奨事項に対応しつつ、新しい言語機能を試すために、KGP は古いバージョンのまま、コード内でより新しい Kotlin コンパイラバージョンを使用したい場合があります。あるいは、KGP のバージョンを更新しても、古い Kotlin コンパイラバージョンを維持したい場合もあります。

BTA により、これが可能になります。`build.gradle.kts` ファイルでの構成方法は以下の通りです：

```kotlin
// build.gradle.kts
import org.jetbrains.kotlin.buildtools.api.ExperimentalBuildToolsApi
import org.jetbrains.kotlin.gradle.ExperimentalKotlinGradlePluginApi

plugins { 
    kotlin("jvm") version "2.2.0"
}

group = "org.jetbrains.example"
version = "1.0-SNAPSHOT"

repositories { 
    mavenCentral()
}

kotlin { 
    jvmToolchain(8)
    @OptIn(ExperimentalBuildToolsApi::class, ExperimentalKotlinGradlePluginApi::class) 
    compilerVersion.set("2.1.21") // 2.2.0 とは異なるバージョン
}

```

BTA は、KGP と Kotlin コンパイラバージョンの構成において、過去 3 つのメジャーバージョンと 1 つの将来のメジャーバージョンをサポートしています。したがって、KGP 2.2.0 では、Kotlin コンパイラバージョン 2.1.x、2.0.x、および 1.9.25 がサポートされます。KGP 2.2.0 は、将来の Kotlin コンパイラバージョン 2.2.x および 2.3.x とも互換性があります。

ただし、異なるコンパイラバージョンをコンパイラプラグインと一緒に使用すると、Kotlin コンパイラ例外が発生する可能性があることに注意してください。Kotlin チームは、将来のリリースでこれらの問題に対処する予定です。

これらのプラグインで BTA を試してみて、[KGP](https://youtrack.jetbrains.com/issue/KT-56574) および [Maven プラグイン](https://youtrack.jetbrains.com/issue/KT-73012) の専用 YouTrack チケットでフィードバックをお送りください。

## 標準ライブラリ

Kotlin 2.2.0 では、[`Base64` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) および [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) が [Stable（安定版）](components-stability.md#stability-levels-explained) になりました。

### Stable になった Base64 エンコーディングとデコーディング

Kotlin 1.8.20 で [Base64 エンコーディングとデコーディングの実験的サポート](whatsnew1820.md#support-for-base64-encoding) が導入されました。
Kotlin 2.2.0 では、[Base64 API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/) は [Stable（安定版）](components-stability.md#stability-levels-explained) となり、本リリースで追加された新しい `Base64.Pem` を含む 4 つのエンコーディングスキームが含まれています：

* [`Base64.Default`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/) は、標準の [Base64 エンコーディングスキーム](https://www.rfc-editor.org/rfc/rfc4648#section-4) を使用します。

  > `Base64.Default` は `Base64` クラスのコンパニオンオブジェクトです。
  > その結果、`Base64.Default.encode()` および `Base64.Default.decode()` の代わりに `Base64.encode()` および `Base64.decode()` として関数を呼び出すことができます。
  >
  {style="tip"}

* [`Base64.UrlSafe`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-url-safe.html) は、「URL およびファイル名に安全な」["URL and Filename safe"](https://www.rfc-editor.org/rfc/rfc4648#section-5) エンコーディングスキームを使用します。
* [`Base64.Mime`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.io.encoding/-base64/-default/-mime.html) は、[MIME](https://www.rfc-editor.org/rfc/rfc2045#section-6.8) エンコーディングスキームを使用し、エンコーディング中に 76 文字ごとに改行セパレータを挿入し、デコーディング中に不正な文字をスキップします。
* `Base64.Pem` は、`Base64.Mime` のようにデータをエンコードしますが、行の長さを 64 文字に制限します。

Base64 API を使用して、バイナリデータを Base64 文字列にエンコードしたり、バイトデータにデコードし直したりできます。

以下に例を示します：

```kotlin
val foBytes = "fo".map { it.code.toByte() }.toByteArray()
Base64.Default.encode(foBytes) // "Zm8="
// あるいは:
// Base64.encode(foBytes)

val foobarBytes = "foobar".map { it.code.toByte() }.toByteArray()
Base64.UrlSafe.encode(foobarBytes) // "Zm9vYmFy"

Base64.Default.decode("Zm8=") // foBytes
// あるいは:
// Base64.decode("Zm8=")

Base64.UrlSafe.decode("Zm9vYmFy") // foobarBytes
```

JVM では、`.encodingWith()` および `.decodingWith()` 拡張関数を使用して、入力ストリームと出力ストリームで Base64 をエンコードおよびデコードします：

```kotlin
import kotlin.io.encoding.*
import java.io.ByteArrayOutputStream

fun main() {
    val output = ByteArrayOutputStream()
    val base64Output = output.encodingWith(Base64.Default)

    base64Output.use { stream ->
        stream.write("Hello World!!".encodeToByteArray()) 
    }

    println(output.toString())
    // SGVsbG8gV29ybGQhIQ==
}
```

### `HexFormat` API による 16 進数の解析とフォーマットの安定化

[Kotlin 1.9.0](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) で導入された [`HexFormat` API](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/-hex-format/) が [Stable（安定版）](components-stability.md#stability-levels-explained) になりました。
数値と 16 進文字列の間の変換に使用できます。

例：

```kotlin
fun main() {
    //sampleStart
    println(93.toHexString())
    //sampleEnd
}
```
{kotlin-runnable="true"}

詳細は [16 進数のフォーマットと解析のための新しい HexFormat クラス](whatsnew19.md#new-hexformat-class-to-format-and-parse-hexadecimals) を参照してください。

## Compose コンパイラ

本リリースでは、Compose コンパイラに composable 関数参照のサポートが導入され、いくつかの機能フラグのデフォルトが変更されました。

### `@Composable` 関数参照のサポート

Compose コンパイラは、Kotlin 2.2.0 リリースから composable 関数参照の宣言と使用をサポートします：

```kotlin
val content: @Composable (String) -> Unit = ::Text

@Composable fun App() {
    content("My App")
}
```

composable 関数参照は、実行時に composable ラムダオブジェクトとはわずかに異なる動作をします。特に、composable ラムダは `ComposableLambda` クラスを拡張することで、スキップ（skipping）のより細かな制御を可能にします。関数参照は `KCallable` インターフェースを実装することが期待されるため、同じ最適化をそれらに適用することはできません。

### `PausableComposition` 機能フラグがデフォルトで有効に

Kotlin 2.2.0 から、`PausableComposition` 機能フラグがデフォルトで有効になりました。このフラグは、再起動可能な関数に対する Compose コンパイラの出力を調整し、ランタイムが強制的にスキップ動作を行えるようにします。これにより、各関数をスキップすることで実質的にコンポジションを一時停止できるようになります。これにより、重いコンポジションをフレーム間に分割することが可能になり、将来のリリースでのプリフェッチ（prefetching）に使用される予定です。

この機能フラグを無効にするには、Gradle 設定に以下を追加してください：

```kotlin
// build.gradle.kts
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.PausableComposition.disabled())
}
```

### `OptimizeNonSkippingGroups` 機能フラグがデフォルトで有効に

Kotlin 2.2.0 から、`OptimizeNonSkippingGroups` 機能フラグがデフォルトで有効になりました。この最適化により、スキップしない composable 関数に対して生成されるグループ呼び出しが削除され、ランタイムパフォーマンスが向上します。
実行時の動作に目に見える変化はないはずです。

問題が発生した場合は、機能フラグを無効にすることで、この変更が原因かどうかを確認できます。
問題は [Jetpack Compose 問題トラッカー](https://issuetracker.google.com/issues/new?component=610764&template=1424126) に報告してください。

`OptimizeNonSkippingGroups` フラグを無効にするには、Gradle 設定に以下を追加してください：

```kotlin
composeCompiler {
    featureFlag = setOf(ComposeFeatureFlag.OptimizeNonSkippingGroups.disabled())
}
```

### 非推奨となった機能フラグ

`StrongSkipping` および `IntrinsicRemember` 機能フラグは非推奨となり、将来のリリースで削除される予定です。
これらの機能フラグを無効にする必要があるような問題が発生した場合は、[Jetpack Compose 問題トラッカー](https://issuetracker.google.com/issues/new?component=610764&template=1424126) に報告してください。

## 破壊的変更と非推奨事項

このセクションでは、注目すべき重要な破壊的変更と非推奨事項について説明します。本リリースにおけるすべての破壊的変更と非推奨事項の完全な概要については、[互換性ガイド](compatibility-guide-22.md) を参照してください。

* Kotlin 2.2.0 以降、コンパイラは [`-language-version=1.6` または `-language-version=1.7` をサポートしなくなりました](compatibility-guide-22.md#drop-support-in-language-version-for-1-6-and-1-7)。
  1.8 より古い言語機能セットはサポートされませんが、言語自体は Kotlin 1.0 との完全な後方互換性を維持しています。
* Ant ビルドシステムのサポートが非推奨となりました。Ant 向けの Kotlin サポートは長い間活発に開発されておらず、ユーザーベースが比較的少ないため、今後メンテナンスする予定はありません。
  Ant サポートは 2.3.0 で削除する予定です。
* Kotlin 2.2.0 では、Gradle における [`kotlinOptions{}` ブロックの非推奨レベルがエラーに引き上げられました](compatibility-guide-22.md#deprecate-kotlinoptions-dsl)。
  代わりに `compilerOptions{}` ブロックを使用してください。ビルドスクリプトの更新に関するガイダンスについては、[`kotlinOptions{}` から `compilerOptions{}` への移行](gradle-compiler-options.md#migrate-from-kotlinoptions-to-compileroptions) を参照してください。
* Kotlin スクリプティングは依然として Kotlin エコシステムの重要な部分ですが、より良い体験を提供するために、カスタムスクリプティングや `gradle.kts` および `main.kts` スクリプトなどの特定のユースケースに焦点を当てています。
  詳細については、更新された [ブログ投稿](https://blog.jetbrains.com/kotlin/2024/11/state-of-kotlin-scripting-2024/) を参照してください。その結果、Kotlin 2.2.0 では以下のサポートが非推奨となります：
  
  * REPL: `kotlinc` 経由で REPL を引き続き使用するには、`-Xrepl` コンパイラオプションでオプトインしてください。
  * JSR-223: この [JSR](https://jcp.org/en/jsr/detail?id=223) は **Withdrawn（取り下げ）** 状態にあるため、JSR-223 実装は言語バージョン 1.9 では引き続き動作しますが、将来的に K2 コンパイラを使用するように移行されることはありません。
  * `KotlinScriptMojo` Maven プラグイン: このプラグインは十分な関心が得られませんでした。使用し続けるとコンパイラ警告が表示されます。
* 
* Kotlin 2.2.0 では、[`KotlinCompileTool`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/#) 内の [`setSource()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/set-source.html#) 関数が、[構成されたソースに追加するのではなく、それらを置き換える](compatibility-guide-22.md#correct-setsource-function-in-kotlincompiletool-to-replace-sources) ようになりました。
  既存のソースを置き換えずに追加したい場合は、[`source()`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-kotlin-compile-tool/source.html#) 関数を使用してください。
* `BaseKapt` における [`annotationProcessorOptionProviders`](https://kotlinlang.org/api/kotlin-gradle-plugin/kotlin-gradle-plugin-api/org.jetbrains.kotlin.gradle.tasks/-base-kapt/annotation-processor-option-providers.html#) の型が、[`MutableList<Any>` から `MutableList<CommandLineArgumentProvider>` に変更されました](compatibility-guide-22.md#deprecate-basekapt-annotationprocessoroptionproviders-property)。コードで現在リストを単一要素として追加している場合は、`add()` 関数の代わりに `addAll()` 関数を使用してください。
* レガシーな Kotlin/JS バックエンドで使用されていたデッドコード削除 (DCE) ツールの非推奨化に伴い、DCE に関連する残りの DSL が Kotlin Gradle プラグインから削除されました：
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDce` インターフェース
  * `org.jetbrains.kotlin.gradle.targets.js.dsl.KotlinJsBrowserDsl.dceTask(body: Action<KotlinJsDce>)` 関数
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceCompilerToolOptions` インターフェース
  * `org.jetbrains.kotlin.gradle.dsl.KotlinJsDceOptions` インターフェース

  現在の [JS IR コンパイラ](js-ir-compiler.md) は標準で DCE をサポートしており、[`@JsExport`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-export/) アノテーションにより、DCE 中にどの Kotlin 関数やクラスを保持するかを指定できます。

* 非推奨となっていた `kotlin-android-extensions` プラグインは [Kotlin 2.2.0 で削除されました](compatibility-guide-22.md#deprecate-kotlin-android-extensions-plugin)。
  `Parcelable` 実装ジェネレータには `kotlin-parcelize` プラグインを、シンセティックビューには Android Jetpack の [ビューバインディング](https://developer.android.com/topic/libraries/view-binding) を代わりに使用してください。
* 実験的な `kotlinArtifacts` API は [Kotlin 2.2.0 で非推奨となりました](compatibility-guide-22.md#deprecate-kotlinartifacts-api)。
  [最終的なネイティブバイナリをビルド](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html) するには、Kotlin Gradle プラグインで利用可能な現在の DSL を使用してください。移行に不十分な場合は、[この YouTrack 課題](https://youtrack.jetbrains.com/issue/KT-74953) にコメントを残してください。
* Kotlin 1.9.0 で非推奨となった `KotlinCompilation.source` は、[Kotlin Gradle プラグインから削除されました](compatibility-guide-22.md#deprecate-kotlincompilation-source-api)。
* 実験的なコモナイゼーション（commonization）モードのパラメータは、[Kotlin 2.2.0 で非推奨となりました](compatibility-guide-22.md#deprecate-commonization-parameters)。
  無効なコンパイル成果物を削除するには、コモナイゼーションキャッシュをクリアしてください。
* 非推奨となっていた `konanVersion` プロパティは、[`CInteropProcess` タスクから削除されました](compatibility-guide-22.md#deprecate-konanversion-in-cinteropprocess)。
  代わりに `CInteropProcess.kotlinNativeVersion` を使用してください。
* 非推奨の `destinationDir` プロパティを使用すると [エラーになるようになりました](compatibility-guide-22.md#deprecate-destinationdir-in-cinteropprocess)。
  代わりに `CInteropProcess.destinationDirectory.set()` を使用してください。

## ドキュメントの更新

本リリースでは、Kotlin Multiplatform ドキュメントの [KMP ポータル](https://kotlinlang.org/docs/multiplatform/get-started.html) への移行など、注目すべきドキュメントの変更が行われました。

さらに、新しいページやチュートリアルを作成し、既存のものを刷新しました。

### 新規および刷新されたチュートリアル

* [Kotlin 中級ツアー](kotlin-tour-welcome.md) – Kotlin への理解を次のレベルへ。拡張関数、インターフェース、クラスなどをいつ使用すべきかを学びます。
* [Spring AI を使用する Kotlin アプリの構築](spring-ai-guide.md) – OpenAI とベクトルデータベースを使用して質問に答える Kotlin アプリの作成方法を学びます。
* [](jvm-create-project-with-spring-boot.md) – IntelliJ IDEA の **New Project** ウィザードを使用して、Gradle で Spring Boot プロジェクトを作成する方法を学びます。
* [Kotlin と C のマッピング チュートリアルシリーズ](mapping-primitive-data-types-from-c.md) – 異なる型や構造が Kotlin と C の間でどのようにマッピングされるかを学びます。
* [C interop と libcurl を使用したアプリの作成](native-app-with-c-and-libcurl.md) – libcurl C ライブラリを使用してネイティブに動作するシンプルな HTTP クライアントを作成します。
* [Kotlin Multiplatform ライブラリの作成](https://kotlinlang.org/docs/multiplatform/create-kotlin-multiplatform-library.html) – IntelliJ IDEA を使用してマルチプラットフォームライブラリを作成し公開する方法を学びます。
* [Ktor と Kotlin Multiplatform によるフルスタックアプリケーションの構築](https://ktor.io/docs/full-stack-development-with-kotlin-multiplatform.html) – このチュートリアルは Fleet の代わりに IntelliJ IDEA を使用するように更新され、Material 3 および最新バージョンの Ktor と Kotlin を採用しました。
* [Compose Multiplatform アプリでのローカルリソース環境の管理](https://kotlinlang.org/docs/multiplatform/compose-resource-environment.html) – アプリ内テーマや言語など、アプリケーションのリソース環境を管理する方法を学びます。

### 新規および刷新されたページ

* [AI 向け Kotlin の概要](kotlin-ai-apps-development-overview.md) – AI 搭載アプリケーションを構築するための Kotlin の機能を紹介します。
* [Dokka 移行ガイド](https://kotlinlang.org/docs/dokka-migration.html) – Dokka Gradle プラグインの v2 への移行方法を学びます。
* [](metadata-jvm.md) – JVM 向けにコンパイルされた Kotlin クラスのメタデータの読み取り、変更、および生成に関するガイダンスを提供します。
* [CocoaPods 統合](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-overview.html) – チュートリアルやサンプルプロジェクトを通じて、環境のセットアップ、Pod 依存関係の追加、または Kotlin プロジェクトを CocoaPod 依存関係として使用する方法を学びます。
* iOS 安定版リリースをサポートするための Compose Multiplatform の新ページ：
    * 特に [ナビゲーション](https://kotlinlang.org/docs/multiplatform/compose-navigation.html) と [ディープリンク](https://kotlinlang.org/docs/multiplatform/compose-navigation-deep-links.html)。
    * [Compose でのレイアウト実装](https://kotlinlang.org/docs/multiplatform/compose-layout.html)。
    * [文字列のローカライズ](https://kotlinlang.org/docs/multiplatform/compose-localize-strings.html) および RTL 言語のサポートなどのその他の i18n ページ。
* [Compose ホットリロード](https://kotlinlang.org/docs/multiplatform/compose-hot-reload.html) – デスクトップターゲットで Compose ホットリロードを使用する方法と、既存のプロジェクトに追加する方法を学びます。
* [Exposed 移行](https://www.jetbrains.com/help/exposed/migrations.html) – データベーススキーマの変更を管理するために Exposed が提供するツールについて学びます。

## Kotlin 2.2.0 へのアップデート方法

Kotlin プラグインは、IntelliJ IDEA および Android Studio にバンドルされたプラグインとして提供されています。

新しい Kotlin バージョンにアップデートするには、ビルドスクリプト内の [Kotlin バージョンを 2.2.0 に変更](releases.md#update-to-a-new-kotlin-version)してください。