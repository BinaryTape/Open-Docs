---
title: "Kotlin 1.9.0 の新機能"
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

_[リリース日: 2023年7月6日](releases#release-details)_

Kotlin 1.9.0 がリリースされ、JVM 用 K2 コンパイラーが**ベータ**になりました。さらに、主なハイライトを以下に示します。

* [Kotlin K2 コンパイラーの新しいアップデート](#new-kotlin-k2-compiler-updates)
* [enum class values 関数の安定版置換](#stable-replacement-of-the-enum-class-values-function)
* [オープンエンド範囲の安定版 `..<` 演算子](#stable-operator-for-open-ended-ranges)
* [名前で正規表現キャプチャグループを取得する新しい共通関数](#new-common-function-to-get-regex-capture-group-by-name)
* [親ディレクトリーを作成する新しいパスユーティリティ](#new-path-utility-to-create-parent-directories)
* [Kotlin Multiplatform での Gradle 構成キャッシュのプレビュー](#preview-of-the-gradle-configuration-cache)
* [Kotlin Multiplatform での Android ターゲットサポートの変更](#changes-to-android-target-support)
* [Kotlin/Native でのカスタムメモリーアロケーターのプレビュー](#preview-of-custom-memory-allocator)
* [Kotlin/Native でのライブラリーリンケージ](#library-linkage-in-kotlin-native)
* [Kotlin/Wasm のサイズ関連の最適化](#size-related-optimizations)

この動画でアップデートの簡単な概要を確認することもできます。

<video src="https://www.youtube.com/v/fvwTZc-dxsM" title="What's new in Kotlin 1.9.0"/>

## IDE サポート

1.9.0 をサポートする Kotlin プラグインは以下で利用できます。

| IDE | サポート対象バージョン |
|--|--|
| IntelliJ IDEA | 2022.3.x, 2023.1.x |
| Android Studio | Giraffe (223), Hedgehog (231)* |

*Kotlin 1.9.0 プラグインは、今後のリリースで Android Studio Giraffe (223) および Hedgehog (231) に含まれます。

Kotlin 1.9.0 プラグインは、今後のリリースで IntelliJ IDEA 2023.2 に含まれます。

:::note
Kotlin のアーティファクトと依存関係をダウンロードするには、Maven Central Repository を使用するように[Gradle 設定を構成](#configure-gradle-settings)してください。

## Kotlin K2 コンパイラーの新しいアップデート

JetBrains の Kotlin チームは、K2 コンパイラーの安定化を継続しており、1.9.0 リリースでは、さらなる進歩が導入されています。
JVM 用 K2 コンパイラーが**ベータ**になりました。

Kotlin/Native およびマルチプラットフォームプロジェクトの基本的なサポートも追加されました。

### Kapt コンパイラープラグインと K2 コンパイラーの互換性

K2 コンパイラーと一緒にプロジェクトで[kapt プラグイン](kapt)を使用できますが、いくつかの制限があります。
`languageVersion` を `2.0` に設定しても、kapt コンパイラープラグインは古いコンパイラーを使用します。

`languageVersion` が `2.0` に設定されているプロジェクト内で kapt コンパイラープラグインを実行すると、kapt は自動的に
`1.9` に切り替わり、特定のバージョン互換性チェックを無効にします。この動作は、次のコマンド引数を含めることと同じです。
* `-Xskip-metadata-version-check`
* `-Xskip-prerelease-check`
* `-Xallow-unstable-dependencies`

これらのチェックは、kapt タスクに対してのみ無効になります。他のすべてのコンパイルタスクは、引き続き新しい K2 コンパイラーを使用します。

K2 コンパイラーで kapt を使用するときに問題が発生した場合は、[課題追跡システム](http://kotl.in/issue)にご報告ください。

### プロジェクトで K2 コンパイラーを試す

1.9.0 以降 Kotlin 2.0 のリリースまで、`kotlin.experimental.tryK2=true`
Gradle プロパティを `gradle.properties` ファイルに追加することで、K2 コンパイラーを簡単にテストできます。次のコマンドを実行することもできます。

```shell
./gradlew assemble -Pkotlin.experimental.tryK2=true
```

この Gradle プロパティは、言語バージョンを 2.0 に自動的に設定し、現在のコンパイラーと比較して K2 コンパイラーを使用してコンパイルされた Kotlin
タスクの数でビルドレポートを更新します。

```none
##### 'kotlin.experimental.tryK2' の結果 (Kotlin/Native はチェックされていません) #####
:lib:compileKotlin: 2.0 言語バージョン
:app:compileKotlin: 2.0 言語バージョン
##### 100% (2/2) のタスクが Kotlin 2.0 でコンパイルされました #####
```

### Gradle ビルドレポート

[Gradle ビルドレポート](gradle-compilation-and-caches#build-reports)に、コードのコンパイルに使用されたコンパイラーが現在のものか、K2 コンパイラーかが表示されるようになりました。Kotlin 1.9.0 では、この情報を[Gradle ビルドスキャン](https://scans.gradle.com/)で確認できます。

<img src="/img/gradle-build-scan-k1.png" alt="Gradle ビルドスキャン - K1" width="700" style={{verticalAlign: 'middle'}}/>

<img src="/img/gradle-build-scan-k2.png" alt="Gradle ビルドスキャン - K2" width="700" style={{verticalAlign: 'middle'}}/>

プロジェクトで使用されている Kotlin バージョンは、ビルドレポートで直接確認することもできます。

```none
Task info:
  Kotlin language version: 1.9
```

Gradle 8.0 を使用している場合、特に Gradle 構成
キャッシュが有効になっている場合は、ビルドレポートでいくつかの問題が発生する可能性があります。これは既知の問題であり、Gradle 8.1 以降で修正されています。

:::

### 現在の K2 コンパイラーの制限事項

Gradle プロジェクトで K2 を有効にすると、Gradle バージョン 8.3 未満を使用しているプロジェクトに次のケースで影響を与える可能性のある特定の制限があります。

* `buildSrc` からのソースコードのコンパイル。
* 含まれているビルドでの Gradle プラグインのコンパイル。
* 他の Gradle プラグインが Gradle バージョン 8.3 未満のプロジェクトで使用されている場合のコンパイル。
* Gradle プラグインの依存関係の構築。

上記のいずれかの問題が発生した場合は、次の手順を実行して対処できます。

* `buildSrc`、Gradle プラグイン、およびその依存関係の言語バージョンを設定します。

```kotlin
kotlin {
    compilerOptions {
        languageVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
        apiVersion.set(org.jetbrains.kotlin.gradle.dsl.KotlinVersion.KOTLIN_1_9)
    }
}
```

* プロジェクトの Gradle バージョンを 8.3 に更新します (利用可能になった場合)。

### 新しい K2 コンパイラーに関するフィードバックをお寄せください

ご意見をお待ちしております！

* K2 開発者に直接フィードバックを送信する Kotlin の Slack – [招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
  して、[#k2-early-adopters](https://kotlinlang.slack.com/archives/C03PK0PE257) チャンネルに参加してください。
* 新しい K2 コンパイラーで発生した問題を[課題追跡システム](https://kotl.in/issue)にご報告ください。
* [**利用統計情報の送信**オプションを有効にする](https://www.jetbrains.com/help/idea/settings-usage-statistics.html)
  JetBrains が K2 の使用に関する匿名データを収集できるようにします。

## 言語

Kotlin 1.9.0 では、以前に導入されたいくつかの新しい言語機能が安定化されています。
* [enum class values 関数の置換](#stable-replacement-of-the-enum-class-values-function)
* [データクラスとの対称性のためのデータオブジェクト](#stable-data-objects-for-symmetry-with-data-classes)
* [インライン値クラスでの本体を持つセカンダリコンストラクターのサポート](#support-for-secondary-constructors-with-bodies-in-inline-value-classes)

### enum class values 関数の安定版置換

1.8.20 では、enum クラスの `entries` プロパティが試験的な機能として導入されました。`entries` プロパティは、
合成 `values()` 関数の最新の高性能な代替手段です。1.9.0 では、`entries` プロパティは安定版です。

:::note
`values()` 関数は引き続きサポートされていますが、代わりに `entries`
プロパティを使用することをお勧めします。

```kotlin
enum class Color(val colorName: String, val rgb: String) {
    RED("Red", "#FF0000"),
    ORANGE("Orange", "#FF7F00"),
    YELLOW("Yellow", "#FFFF00")
}

fun findByRgb(rgb: String): Color? = Color.entries.find { it.rgb == rgb }
```

enum クラスの `entries` プロパティの詳細については、[Kotlin 1.8.20 の新機能](whatsnew1820#a-modern-and-performant-replacement-of-the-enum-class-values-function)を参照してください。

### データクラスとの対称性のための安定版データオブジェクト

[Kotlin 1.8.20](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes)で導入されたデータオブジェクト宣言は、
安定版になりました。これには、データクラスとの対称性のために追加された関数 (`toString()`、`equals()`、`hashCode()`) が含まれます。

この機能は、`sealed` 階層 (`sealed class` または `sealed interface` 階層など) で特に役立ちます。
`data object` 宣言は `data class` 宣言と一緒に便利に使用できるためです。この例では、
プレーンな `object` ではなく `data object` として `EndOfFile` を宣言すると、手動でオーバーライドする必要なく、`toString()` 関数が自動的に追加されます。
これにより、付属のデータクラス定義との対称性が維持されます。

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) // Number(number=7)
    println(EndOfFile) // EndOfFile
}
```

詳細については、[Kotlin 1.8.20 の新機能](whatsnew1820#preview-of-data-objects-for-symmetry-with-data-classes)を参照してください。

### インライン値クラスでの本体を持つセカンダリコンストラクターのサポート

Kotlin 1.9.0 以降、[インライン値クラス](inline-classes)での本体を持つセカンダリコンストラクターの使用は
デフォルトで使用できます。

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    // Kotlin 1.4.30 以降は許可されています。
    init {
        check(fullName.isNotBlank()) {
            "Full name shouldn't be empty"
        }
    }
    // Kotlin 1.9.0 以降はデフォルトで許可されています。
    constructor(name: String, lastName: String) : this("$name $lastName") {
        check(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }
}
```

以前は、Kotlin ではインラインクラスでパブリックプライマリコンストラクターのみが許可されていました。その結果、
基礎となる値をカプセル化したり、制約された値を表すインラインクラスを作成したりすることができませんでした。

Kotlin の開発に伴い、これらの問題は修正されました。Kotlin 1.4.30 では `init` ブロックの制限が解除され、Kotlin 1.8.20
には本体を持つセカンダリコンストラクターのプレビューが付属していました。これらは現在デフォルトで使用できます。Kotlin インラインクラスの開発の詳細については、[この KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/inline-classes)を参照してください。

## Kotlin/JVM

バージョン 1.9.0 以降、コンパイラーは JVM 20 に対応するバイトコードバージョンでクラスを生成できます。さらに、
`JvmDefault` アノテーションとレガシー `-Xjvm-default` モードの非推奨は継続されます。

### JvmDefault アノテーションとレガシー -Xjvm-default モードの非推奨

Kotlin 1.5 以降、`JvmDefault` アノテーションの使用は、新しい `-Xjvm-default`
モード (`all` および `all-compatibility`) に対して非推奨になりました。Kotlin 1.4 での `JvmDefaultWithoutCompatibility` と
Kotlin 1.6 での `JvmDefaultWithCompatibility` の導入により、これらのモードは `DefaultImpls`
クラスの生成を包括的に制御し、古い Kotlin コードとのシームレスな互換性を保証します。

したがって、Kotlin 1.9.0 では、`JvmDefault` アノテーションは意味を持たなくなり、非推奨としてマークされ、
エラーが発生します。最終的には Kotlin から削除されます。

## Kotlin/Native

その他の改善の中でも、このリリースでは[Kotlin/Native メモリーマネージャー](native-memory-manager)がさらに改善され、
その堅牢性とパフォーマンスが向上します。

* [カスタムメモリーアロケーターのプレビュー](#preview-of-custom-memory-allocator)
* [メインスレッドでの Objective-C または Swift オブジェクトの割り当て解除フック](#objective-c-or-swift-object-deallocation-hook-on-the-main-thread)
* [Kotlin/Native での定数値へのアクセス時のオブジェクトの初期化なし](#no-object-initialization-when-accessing-constant-values-in-kotlin-native)
* [Kotlin/Native での iOS シミュレーターテストのスタンドアロンモードを構成する機能](#ability-to-configure-standalone-mode-for-ios-simulator-tests-in-kotlin-native)
* [Kotlin/Native でのライブラリーリンケージ](#library-linkage-in-kotlin-native)

### カスタムメモリーアロケーターのプレビュー

Kotlin 1.9.0 では、カスタムメモリーアロケーターのプレビューが導入されています。その割り当てシステムは、
[Kotlin/Native メモリーマネージャー](native-memory-manager)のランタイムパフォーマンスを向上させます。

Kotlin/Native の現在のオブジェクト割り当てシステムは、効率的なガベージコレクションの機能がない汎用アロケーターを使用しています。
それを補うために、ガベージコレクター (GC) がそれらを単一のリストにマージする前に、割り当てられたすべてのオブジェクトのスレッドローカルリンクされたリストを保持します。
これは、スウィーピング中に反復処理できます。このアプローチには、いくつかのパフォーマンス上の欠点があります。

* スウィーピングの順序にはメモリー局所性がなく、多くの場合、メモリーアクセスパターンが散在し、潜在的なパフォーマンスの問題が発生します。
* リンクされたリストでは、オブジェクトごとに追加のメモリーが必要になり、特に多くの小さなオブジェクトを処理する場合にメモリー使用量が増加します。
* 割り当てられたオブジェクトの単一のリストにより、スウィーピングの並列化が困難になり、GC スレッドがオブジェクトを収集できるよりもミューテータースレッドがオブジェクトをより速く割り当てる場合にメモリー使用量の問題が発生する可能性があります。

これらの問題に対処するために、Kotlin 1.9.0 ではカスタムアロケーターのプレビューが導入されています。システムのメモリーをページに分割し、
連続した順序で独立したスウィーピングを可能にします。各割り当てはページ内のメモリーブロックになり、ページは
ブロックサイズを追跡します。さまざまなページタイプは、さまざまな割り当てサイズに合わせて最適化されています。メモリーブロックの連続した配置により、
割り当てられたすべてのブロックを効率的に反復処理できます。

スレッドがメモリーを割り当てると、割り当てサイズに基づいて適切なページを検索します。スレッドは、
さまざまなサイズカテゴリのページセットを保持します。通常、特定のサイズの現在のページは割り当てに対応できます。そうでない場合、
スレッドは共有割り当てスペースから別のページを要求します。このページはすでに利用可能であるか、
スウィーピングが必要であるか、最初に作成する必要があります。

新しいアロケーターを使用すると、複数の独立した割り当てスペースを同時に持つことができ、Kotlin チームは
さまざまなページレイアウトを試して、パフォーマンスをさらに向上させることができます。

新しいアロケーターの設計の詳細については、この[README](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/runtime/src/alloc/custom/README)を参照してください。

#### 有効にする方法

`-Xallocator=custom` コンパイラーオプションを追加します。

```kotlin
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {
                freeCompilerArgs.add("-Xallocator=custom")
            }
        }
    }
}
```

#### フィードバックをお寄せください

カスタムアロケーターを改善するために、[YouTrack](https://youtrack.jetbrains.com/issue/KT-55364/Implement-custom-allocator-for-Kotlin-Native)でフィードバックをお待ちしております。

### メインスレッドでの Objective-C または Swift オブジェクトの割り当て解除フック

Kotlin 1.9.0 以降、Objective-C または Swift オブジェクトが Kotlin に渡される場合、メインスレッドで Objective-C または Swift オブジェクトの割り当て解除フックが呼び出されます。
[Kotlin/Native メモリーマネージャー](native-memory-manager)が以前に Objective-C オブジェクトへの参照を処理していた方法は、メモリーリークにつながる可能性がありました。
新しい動作により、メモリーマネージャーの堅牢性が向上すると考えています。

たとえば、引数として渡されたり、関数によって返されたり、コレクションから取得されたりするなど、Kotlin コードで参照されている Objective-C オブジェクトについて考えてみます。
この場合、Kotlin は Objective-C オブジェクトへの参照を保持する独自のオブジェクトを作成します。Kotlin オブジェクトが割り当て解除されると、
Kotlin/Native ランタイムは Objective-C 参照を解放する `objc_release` 関数を呼び出します。

以前は、Kotlin/Native メモリーマネージャーは特別な GC スレッドで `objc_release` を実行していました。それが最後のオブジェクト参照である場合、
オブジェクトは割り当て解除されます。Objective-C オブジェクトに Objective-C の `dealloc` メソッドや Swift の `deinit` ブロックなど、カスタム割り当て解除フックがあり、
これらのフックが特定の スレッドで呼び出されることを想定している場合、問題が発生する可能性があります。

メインスレッド上のオブジェクトのフックは通常そこで呼び出されることを想定しているため、Kotlin/Native ランタイムもメインスレッドで `objc_release` を呼び出すようになりました。
Objective-C オブジェクトがメインスレッドで Kotlin に渡され、そこに Kotlin ピアオブジェクトが作成された場合に対応する必要があります。これは、メインディスパッチキューが処理される場合にのみ機能します。
これは、通常の UI アプリケーションの場合に該当します。メインキューではない場合、またはオブジェクトがメイン以外のスレッドで Kotlin に渡された場合、`objc_release` は以前と同様に特別な GC スレッドで呼び出されます。

#### オプトアウトする方法

問題が発生した場合は、次のオプションを使用して `gradle.properties` ファイルでこの動作を無効にできます。

```none
kotlin.native.binary.objcDisposeOnMain=false
```

[課題追跡システム](https://kotl.in/issue)にそのようなケースを報告することを躊躇しないでください。

### Kotlin/Native での定数値へのアクセス時のオブジェクトの初期化なし

Kotlin 1.9.0 以降、Kotlin/Native バックエンドは `const val` フィールドにアクセスするときにオブジェクトを初期化しません。

```kotlin
object MyObject {
    init {
        println("side effect!")
    }

    const val y = 1
}

fun main() {
    println(MyObject.y) // No initialization at first
    val x = MyObject    // Initialization occurs
    println(x.y)
}
```

この動作は Kotlin/JVM と統一されました。Kotlin/JVM では、実装は Java と一貫性があり、この場合オブジェクトは初期化されません。
この変更のおかげで、Kotlin/Native プロジェクトでパフォーマンスが向上することも期待できます。

### Kotlin/Native での iOS シミュレーターテストのスタンドアロンモードを構成する機能

デフォルトでは、Kotlin/Native の iOS シミュレーターテストを実行する場合、`--standalone` フラグは手動シミュレーターの起動とシャットダウンを回避するために使用されます。
1.9.0 では、Gradle タスクでこのフラグを使用するかどうかを `standalone` プロパティを介して構成できるようになりました。デフォルトでは、`--standalone` フラグが使用されるため、スタンドアロンモードが有効になります。

`build.gradle.kts` ファイルでスタンドアロンモードを無効にする方法の例を次に示します。

```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.targets.native.tasks.KotlinNativeSimulatorTest>().configureEach {
    standalone.set(false)
}
```

スタンドアロンモードを無効にする場合は、シミュレーターを手動で起動する必要があります。CLI からシミュレーターを起動するには、
次のコマンドを使用します。

```shell
/usr/bin/xcrun simctl boot <DeviceId>
```

:::

### Kotlin/Native でのライブラリーリンケージ

Kotlin 1.9.0 以降、Kotlin/Native コンパイラーは Kotlin ライブラリーのリンケージの問題を Kotlin/JVM と同じ方法で処理します。
サードパーティの Kotlin ライブラリーの作成者が、別のサードパーティの Kotlin ライブラリーが使用する実験的な API で互換性のない変更を加えた場合、そのような問題が発生する可能性があります。

サードパーティの Kotlin ライブラリー間のリンケージの問題が発生した場合でも、コンパイル中にビルドが失敗しなくなりました。代わりに、JVM とまったく同じように、実行時にこれらのエラーが発生します。

Kotlin/Native コンパイラーは、ライブラリーリンケージに問題が検出されるたびに警告を報告します。これらの警告は、コンパイルログで見つけることができます。
次に例を示します。

```text
No function found for symbol 'org.samples/MyRemovedClass.doSomething|3657632771909858561[0]'

Can not get instance of singleton 'MyEnumClass.REMOVED_ENTRY': No enum entry found for symbol 'org.samples/MyEnumClass.REMOVED_ENTRY|null[0]'

Function 'getMyRemovedClass' can not be called: Function uses unlinked class symbol 'org.samples/MyRemovedClass|null[0]'
```

プロジェクトでこの動作をさらに構成したり、無効にしたりすることもできます。

* コンパイルログにこれらの警告を表示したくない場合は、`-Xpartial-linkage-loglevel=INFO` コンパイラーオプションを使用して抑制します。
* `-Xpartial-linkage-loglevel=ERROR` を使用して、報告された警告の重大度をコンパイルエラーに上げることもできます。この場合、コンパイルが失敗し、コンパイルログにすべてのエラーが表示されます。このオプションを使用して、リンケージの問題をより詳細に調べます。
* この機能で予期しない問題が発生した場合は、常に `-Xpartial-linkage=disable` コンパイラーオプションを使用してオプトアウトできます。[課題追跡システム](https://kotl.in/issue)にそのようなケースを報告することを躊躇しないでください。

```kotlin
// Gradle ビルドファイルを介してコンパイラーオプションを渡す例。
kotlin {
    macosX64("native") {
        binaries.executable()

        compilations.configureEach {
            compilerOptions.configure {

                // リンケージ警告を抑制するには:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=INFO")

                // リンケージ警告をエラーに上げるには:
                freeCompilerArgs.add("-Xpartial-linkage-loglevel=ERROR")

                // 機能を完全に無効にするには:
                freeCompilerArgs.add("-Xpartial-linkage=disable")
            }
        }
    }
}
```

### C インターロップ暗黙的整数変換のコンパイラーオプション

暗黙的な整数変換を使用できるようにする C インターロップのコンパイラーオプションを導入しました。慎重に検討した結果、このコンパイラーオプションを導入して、意図しない使用を防ぎました。
この機能にはまだ改善の余地があり、最高の品質の API を目指しているためです。

このコードサンプルでは、[`options`](https://developer.apple.com/documentation/foundation/nscalendar/options) に符号なし型 `UInt` があり、`0` が符号付きであるにもかかわらず、暗黙的な整数変換により `options = 0` が可能になります。

```kotlin
val today = NSDate()
val tomorrow = NSCalendar.currentCalendar.dateByAddingUnit(
    unit = NSCalendarUnitDay,
    value = 1,
    toDate = today,
    options = 0
)
```

ネイティブインターロップライブラリーで暗黙的な変換を使用するには、`-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion`
コンパイラーオプションを使用します。

これは、Gradle `build.gradle.kts` ファイルで構成できます。
```kotlin
tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinNativeCompile>().configureEach {
    compilerOptions.freeCompilerArgs.addAll(
        "-XXLanguage:+ImplicitSignedToUnsignedIntegerConversion"
    )
}
```

## Kotlin Multiplatform

Kotlin Multiplatform は、開発者エクスペリエンスを向上させるために設計された 1.9.0 でいくつかの注目すべきアップデートを受けました。

* [Android ターゲットサポートの変更](#changes-to-android-target-support)
* [新しい Android ソースセットレイアウトがデフォルトで有効](#new-android-source-set-layout-enabled-by-default)
* [マルチプラットフォームプロジェクトでの Gradle 構成キャッシュのプレビュー](#preview-of-the-gradle-configuration-cache)

### Android ターゲットサポートの変更

Kotlin Multiplatform の安定化に向けて、私たちは努力を続けています。不可欠なステップは、
Android ターゲットのファーストクラスのサポートを提供することです。将来的には、Google の Android チームが Kotlin Multiplatform での Android をサポートするために独自の Gradle プラグインを提供することを発表できることを嬉しく思います。

Google からのこの新しいソリューションへの道を開くために、1.9.0 で現在の Kotlin DSL の `android` ブロックの名前を変更します。
ビルドスクリプト内の `android` ブロックのすべての出現箇所を `androidTarget` に変更してください。これは一時的な変更であり、
Google からの今後の DSL の `android` 名を解放するために必要な変更です。

Google プラグインは、マルチプラットフォームプロジェクトで Android を操作するための推奨される方法になります。準備ができたら、短い `android` 名を以前のように使用できるように、必要な移行手順を提供します。

### 新しい Android ソースセットレイアウトがデフォルトで有効

Kotlin 1.9.0 以降、新しい Android ソースセットレイアウトがデフォルトになります。これは、ディレクトリの以前の命名スキーマを置き換えたものであり、複数の方法で混乱を招きました。
新しいレイアウトには、いくつかの利点があります。

* 簡略化された型のセマンティクス – 新しい Android ソースレイアウトは、さまざまな種類のソースセットを区別するのに役立つ明確で一貫性のある命名規則を提供します。
* 改善されたソースディレクトリレイアウト – 新しいレイアウトを使用すると、`SourceDirectories` の配置がより一貫性のあるものになり、コードの整理とソースファイルの検索が容易になります。
* Gradle 構成の明確な命名スキーマ – スキーマは、`KotlinSourceSets` と `AndroidSourceSets` の両方で、より一貫性があり、予測可能になりました。

新しいレイアウトには Android Gradle プラグインバージョン 7.0 以降が必要であり、Android Studio 2022.3 以降でサポートされています。必要な変更を行うには、[移行ガイド](multiplatform-android-layout)を参照してください。
`build.gradle(.kts)` ファイル。

### Gradle 構成キャッシュのプレビュー

<anchor name="preview-of-gradle-configuration-cache"/>

Kotlin 1.9.0 には、マルチプラットフォームライブラリーでの[Gradle 構成キャッシュ](https://docs.gradle.org/current/userguide/configuration_cache.html)のサポートが付属しています。
ライブラリーの作成者であれば、ビルドパフォーマンスの向上からすでにメリットを得ることができます。

Gradle 構成キャッシュは、後続のビルドの構成フェーズの結果を再利用することで、ビルドプロセスを高速化します。この機能は Gradle 8.1 以降、安定版になりました。
有効にするには、[Gradle ドキュメント](https://docs.gradle.org/current/userguide/configuration_cache.html#config_cache:usage)の手順に従ってください。

Kotlin Multiplatform プラグインは、Xcode 統合タスクまたは
[Kotlin CocoaPods Gradle プラグイン](native-cocoapods-dsl-reference)を使用した Gradle 構成キャッシュをまだサポートしていません。この機能は、今後の Kotlin リリースで追加する予定です。

:::

## Kotlin/Wasm

Kotlin チームは、新しい Kotlin/Wasm ターゲットの実験を続けています。このリリースでは、いくつかのパフォーマンスと
[サイズ関連の最適化](#size-related-optimizations)に加えて、[JavaScript インターロップのアップデート](#updates-in-javascript-interop)が導入されています。

### サイズ関連の最適化

Kotlin 1.9.0 では、WebAssembly (Wasm) プロジェクトのサイズが大幅に改善されています。2 つの「Hello World」プロジェクトを比較すると、
Kotlin 1.9.0 の Wasm のコードフットプリントは、Kotlin 1.8.20 よりも 10 倍以上小さくなっています。

<img src="/img/wasm-1-9-0-size-improvements.png" alt="Kotlin/Wasm サイズ関連の最適化" width="700" style={{verticalAlign: 'middle'}}/>

これらのサイズの最適化により、リソースの使用率が向上し、Kotlin コードで Wasm
プラットフォームをターゲットとする場合のパフォーマンスが向上します。

### JavaScript インターロップのアップデート

この Kotlin アップデートでは、Kotlin/Wasm の Kotlin と JavaScript 間の相互運用性の変更が導入されています。Kotlin/Wasm
は[試験的](components-stability#stability-levels-explained)な機能であるため、特定の制限が相互運用性に適用されます。

#### 動的型の制限

バージョン 1.9.0 以降、Kotlin は Kotlin/Wasm での `Dynamic` 型の使用をサポートしなくなりました。これは、JavaScript の相互運用性を促進する新しいユニバーサル `JsAny` 型に賛成して非推奨になりました。

詳細については、[Kotlin/Wasm と JavaScript の相互運用性](wasm-js-interop)ドキュメントを参照してください。

#### 非外部型の制限

Kotlin/Wasm は、JavaScript との間で値を渡す場合に、特定の Kotlin 静的型の変換をサポートしています。これらのサポートされている
タイプには、以下が含まれます。

* 符号付き数値、`Boolean`、`Char` などのプリミティブ。
* `String`.
* 関数型。

その他の型は、不透明な参照として変換せずに渡され、JavaScript と Kotlin
のサブタイピング間に不整合が生じます。

これに対処するために、Kotlin は JavaScript インターロップを十分にサポートされている型セットに制限しています。Kotlin 1.9.0 以降、
外部型、プリミティブ型、文字列型、および関数型のみが Kotlin/Wasm JavaScript インターロップでサポートされています。さらに、
JavaScript インターロップで使用できる Kotlin/Wasm オブジェクトへのハンドルを表す `JsReference` という別の明示的な型が導入されました。

詳細については、[Kotlin/Wasm と JavaScript の相互運用性](wasm-js-interop)ドキュメントを参照してください。

### Kotlin Playground での Kotlin/Wasm

Kotlin Playground は Kotlin/Wasm ターゲットをサポートしています。
Kotlin/Wasm をターゲットとする Kotlin コードを記述、実行、共有できます。[チェックしてください！](https://pl.kotl.in/HDFAvimga)

:::note
Kotlin/Wasm を使用するには、ブラウザーで試験的な機能を有効にする必要があります。

[これらの機能を有効にする方法の詳細](wasm-troubleshooting)を参照してください。

:::

```kotlin
import kotlin.time.*
import kotlin.time.measureTime

fun main() {
    println("Hello from Kotlin/Wasm!")
    computeAck(3, 10)
}

tailrec fun ack(m: Int, n: Int): Int = when {
    m == 0 `->` n + 1
    n == 0 `->` ack(m - 1, 1)
    else `->` ack(m - 1, ack(m, n - 1))
}

fun computeAck(m: Int, n: Int) {
    var res = 0
    val t = measureTime {
        res = ack(m, n)
    }
    println()
    println("ack($m, $n) = ${res}")
    println("duration: ${t.inWholeNanoseconds / 1e6} ms")
}
```

## Kotlin/JS

このリリースでは、古い Kotlin/JS コンパイラーの削除、Kotlin/JS Gradle プラグインの非推奨、および ES2015 の試験的なサポートなど、Kotlin/JS のアップデートが導入されています。

* [古い Kotlin/JS コンパイラーの削除](#removal-of-the-old-kotlin-js-compiler)
* [Kotlin/JS Gradle プラグインの非推奨](#deprecation-of-the-kotlin-js-gradle-plugin)
* [外部列挙型の非推奨](#deprecation-of-external-enum)
* [ES2015 クラスとモジュールの試験的なサポート](#experimental-support-for-es2015-classes-and-modules)
* [JS プロダクションディストリビューションのデフォルトの宛先の変更](#changed-default-destination-of-js-production-distribution)
* [stdlib-js から org.w3c 宣言を抽出](#extract-org-w3c-declarations-from-stdlib-js)

:::note
バージョン 1.9.0 以降、[部分ライブラリーリンケージ](#library-linkage-in-kotlin-native)も Kotlin/JS で有効になっています。

:::

### 古い Kotlin/JS コンパイラーの削除

Kotlin 1.8.0 では、IR ベースのバックエンドが[安定](components-stability)になったことを[発表](whatsnew18#stable-js-ir-compiler-backend)しました。
それ以来、コンパイラーを指定しないとエラーになり、古いコンパイラーを使用すると警告が表示されるようになりました。

Kotlin 1.9.0 では、古いバックエンドを使用するとエラーが発生します。[移行ガイド](js-ir-migration)に従って IR コンパイラーに移行してください。

### Kotlin/JS Gradle プラグインの非推奨

Kotlin 1.9.0 以降、`kotlin-js` Gradle プラグインは
非推奨です。代わりに、`js()` ターゲットで